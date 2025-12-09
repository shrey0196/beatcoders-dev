

import requests
import unittest

BASE_URL = "http://localhost:8001/api"

class TestProblemRoutes(unittest.TestCase):
    
    def test_get_valid_problem(self):
        """Test retrieving an existing problem (Two Sum)"""
        response = requests.get(f"{BASE_URL}/problems/Two Sum")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data["title"], "Two Sum")
        self.assertEqual(data["difficulty"], "Easy")
        self.assertIn("hints", data)
        self.assertIn("testCases", data)
        
        # Verify hints structure
        self.assertIsInstance(data["hints"], dict)
        
        # Verify test cases structure
        self.assertIsInstance(data["testCases"], list)
        self.assertGreater(len(data["testCases"]), 0)

    def test_get_problem_case_insensitive(self):
        """Test retrieving a problem with lowercase title"""
        response = requests.get(f"{BASE_URL}/problems/two sum")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["title"], "Two Sum")

    def test_get_nonexistent_problem(self):
        """Test retrieving a non-existent problem"""
        response = requests.get(f"{BASE_URL}/problems/NonExistentProblem123")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Problem not found")

    def test_problem_data_integrity(self):
        """Test that critical fields like starterCode are present"""
        response = requests.get(f"{BASE_URL}/problems/Valid Anagram")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("starterCode", data)
        # Relaxed check: ensure it's a string and not empty
        self.assertIsInstance(data["starterCode"], str)
        self.assertGreater(len(data["starterCode"]), 0)

if __name__ == "__main__":
    unittest.main()

