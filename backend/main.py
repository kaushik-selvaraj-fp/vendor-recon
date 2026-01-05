import os
import json
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
import vertexai
from vertexai.generative_models import GenerativeModel, Part, Image

# 1. Configuration Load
load_dotenv()
PROJECT_ID = os.getenv("GCP_PROJECT_ID")
REGION = os.getenv("GCP_REGION")
MODEL_NAME = os.getenv("GEMINI_MODEL_NAME")

# Initialize Vertex AI
try:
    vertexai.init(project=PROJECT_ID, location=REGION)
except Exception as e:
    print(f"Vertex AI Init Error: {e}")

app = FastAPI()

# 2. CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Setup Upload Directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "public", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Data Models ---
class BoxEntry(BaseModel):
    width: float
    height: float
    top: float
    left: float
    label: str

class FieldPrompts(BaseModel):
    invoiceNo: str = ""
    dueDate: str = ""
    dueAmount: str = ""

class ExtractionRequest(BaseModel):
    imagePath: str
    userBoxes: List[BoxEntry]
    fieldPrompts: FieldPrompts = FieldPrompts()

# --- API Endpoints ---

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:

        file_location = os.path.join(UPLOAD_DIR, file.filename)
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"filePath": f"/uploads/{file.filename}"}
        
    except Exception as e:
        print(f"Upload Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@app.post("/extract-soa")
async def extract_soa_data(request: ExtractionRequest):
    print("Request received...")
    try:
        # 1. Resolve Image Path
        clean_path = request.imagePath.lstrip("/")
        absolute_image_path = os.path.join(BASE_DIR, "public", clean_path)
        
        if not os.path.exists(absolute_image_path):
             print(f"Image missing at: {absolute_image_path}")
             raise HTTPException(status_code=404, detail=f"Image not found at {absolute_image_path}")

        image = Image.load_from_file(absolute_image_path)

        # 2. Build Spatial Prompt (Location)
        box_descriptions = ""
        for box in request.userBoxes:
            box_descriptions += (
                f"- COLUMN '{box.label}': Vertical column located at Left: {box.left}, Width: {box.width}.\n"
            )

        # 3. Build Transformation Prompt (Logic)
        transform_rules = ""
        if request.fieldPrompts.invoiceNo:
            transform_rules += f"- INVOICE NO RULE: {request.fieldPrompts.invoiceNo}\n"
        if request.fieldPrompts.dueDate:
            transform_rules += f"- DUE DATE RULE: {request.fieldPrompts.dueDate}\n"
        if request.fieldPrompts.dueAmount:
            transform_rules += f"- DUE AMOUNT RULE: {request.fieldPrompts.dueAmount}\n"

        if not transform_rules:
            transform_rules = "Extract text exactly as it appears."

        # 4. Final Master Prompt
        prompt_text = f"""
        I am acting as a strict spatial data extractor and transformer.
        
        STEP 1: SPATIAL EXTRACTION
        Scan the document for a table. Extract data based strictly on these vertical column definitions:
        {box_descriptions}
        * CRITICAL: Ignore column headers text. Trust the box location implicitly. If box is on 'Balance' column, extract 'Balance'.
        
        STEP 2: APPLY TRANSFORMATION RULES
        After extraction, clean/format the data using these specific rules:
        {transform_rules}

        OUTPUT FORMAT:
        Return ONLY a raw JSON object with a key "rows".
        {{
            "rows": [
                {{ "invoiceNo": "...", "dueDate": "...", "dueAmount": "..." }}
            ]
        }}
        """

        # 5. Call Vertex AI
        target_model = MODEL_NAME if MODEL_NAME else "gemini-1.5-pro-vision"
        model = GenerativeModel(target_model)
        
        response = model.generate_content(
            [image, prompt_text],
            generation_config={"response_mime_type": "application/json"}
        )

        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        parsed_json = json.loads(raw_text)
        
        return parsed_json

    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))