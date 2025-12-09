"""
Visualization API Routes
Endpoints for code visualization (flowcharts, variable analysis)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from analyzers.code_analyzer import CodeAnalyzer

router = APIRouter(prefix="/api/visualization", tags=["visualization"])
analyzer = CodeAnalyzer()


class CodeInput(BaseModel):
    code: str
    language: str = "python"


class FlowchartResponse(BaseModel):
    success: bool
    mermaid_diagram: str
    complexity: int
    error: str = None


class VariableResponse(BaseModel):
    success: bool
    variables: List[Dict[str, str]]
    error: str = None


@router.post("/flowchart", response_model=FlowchartResponse)
async def generate_flowchart(input_data: CodeInput):
    """
    Generate a Mermaid flowchart from code
    
    Args:
        input_data: Code and language
    
    Returns:
        Mermaid diagram syntax and complexity score
    """
    if input_data.language != "python":
        raise HTTPException(
            status_code=400,
            detail="Only Python is currently supported"
        )
    
    try:
        result = analyzer.analyze(input_data.code)
        
        return FlowchartResponse(
            success=result["success"],
            mermaid_diagram=result["mermaid_diagram"],
            complexity=result["complexity"],
            error=result.get("error")
        )
    
    except Exception as e:
        return FlowchartResponse(
            success=False,
            mermaid_diagram="",
            complexity=0,
            error=str(e)
        )


@router.post("/variables", response_model=VariableResponse)
async def analyze_variables(input_data: CodeInput):
    """
    Extract variables from code
    
    Args:
        input_data: Code and language
    
    Returns:
        List of variables with their types and scopes
    """
    if input_data.language != "python":
        raise HTTPException(
            status_code=400,
            detail="Only Python is currently supported"
        )
    
    try:
        result = analyzer.analyze(input_data.code)
        
        return VariableResponse(
            success=result["success"],
            variables=result["variables"],
            error=result.get("error")
        )
    
    except Exception as e:
        return VariableResponse(
            success=False,
            variables=[],
            error=str(e)
        )


@router.post("/analyze", response_model=Dict[str, Any])
async def full_analysis(input_data: CodeInput):
    """
    Complete code analysis (flowchart + variables + complexity)
    
    Args:
        input_data: Code and language
    
    Returns:
        Complete analysis results
    """
    if input_data.language != "python":
        raise HTTPException(
            status_code=400,
            detail="Only Python is currently supported"
        )
    
    try:
        result = analyzer.analyze(input_data.code)
        return result
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "mermaid_diagram": None,
            "variables": [],
            "complexity": 0
        }
