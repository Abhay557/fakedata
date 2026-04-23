import json
import os
from pathlib import Path

# Base directory for helpers
HELPER_DIR = Path(__file__).parent / "helpers"

def load_data(filename):
    """Safely loads a JSON file from the helpers directory."""
    file_path = HELPER_DIR / filename
    if not file_path.exists():
        raise FileNotFoundError(f"Data file not found: {filename}")
    
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)
