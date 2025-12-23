import os
import json
import requests
from typing import Optional, Dict, Any

class LLMClient:
    """
    A lightweight wrapper for LLM APIs (Gemini/OpenAI).
    Defaults to Gemini if GEMINI_API_KEY is present.
    """
    
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        
        # Default to Gemini if both or just Gemini are present
        if self.gemini_key:
            self.provider = "gemini"
        elif self.openai_key:
            self.provider = "openai"
        else:
            self.provider = "none" # Fallback mode

    def generate(self, prompt: str, system_instruction: str = "") -> Optional[str]:
        """
        Generate text from the LLM.
        Returns None if no API key is configured or request fails.
        """
        if self.provider == "gemini":
            return self._call_gemini(prompt, system_instruction)
        elif self.provider == "openai":
            return self._call_openai(prompt, system_instruction)
        else:
            return None

    def _call_gemini(self, prompt: str, system_instruction: str) -> Optional[str]:
        """Calls Google Gemini API via REST"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.gemini_key}"
        
        # Construct the message payload
        # Gemini doesn't support 'system' role in v1beta easily, so we prepend it
        full_prompt = f"{system_instruction}\n\nUser Question: {prompt}"
        
        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }]
        }
        
        try:
            response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and len(data["candidates"]) > 0:
                    content = data["candidates"][0]["content"]["parts"][0]["text"]
                    return content
            else:
                print(f"[LLM] Gemini Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"[LLM] Request failed: {str(e)}")
            
        return None

    def _call_openai(self, prompt: str, system_instruction: str) -> Optional[str]:
        """Calls OpenAI API via REST"""
        url = "https://api.openai.com/v1/chat/completions"
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }
        
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                print(f"[LLM] OpenAI Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"[LLM] Request failed: {str(e)}")
            
        return None
