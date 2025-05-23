from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd

app = FastAPI()

# --- 1. Enable CORS (for React frontend on localhost:3000 or any origin) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Load all CSVs once at startup ---
symptom_severity_df = pd.read_csv('symptom-severity.csv')
dataset_df          = pd.read_csv('dataset.csv')
description_df      = pd.read_csv('symptom_Description.csv')
precaution_df       = pd.read_csv('symptom_precaution.csv')

# Map symptom -> weight
symptom_severity: Dict[str,int] = dict(zip(
    symptom_severity_df['Symptom'].str.strip().str.lower(),
    symptom_severity_df['weight']
))

# Map disease -> list of its symptoms
disease_symptoms: Dict[str,List[str]] = {}
for _, row in dataset_df.iterrows():
    disease = row['Disease'].strip()
    symptoms = [
        str(row[col]).strip().lower()
        for col in dataset_df.columns
        if col != 'Disease' and pd.notna(row[col])
    ]
    disease_symptoms[disease] = symptoms

# Map disease -> description
descriptions: Dict[str,str] = dict(zip(
    description_df['Disease'].str.strip(),
    description_df['Description']
))

# Map disease -> list of precautions
precautions: Dict[str,List[str]] = {}
for _, row in precaution_df.iterrows():
    disease = row['Disease'].strip()
    precs = [
        row[f'Precaution_{i}'].strip()
        for i in range(1,5)
        if pd.notna(row.get(f'Precaution_{i}'))
    ]
    precautions[disease] = precs

# --- 3. Request & Response Models ---
class SymptomsRequest(BaseModel):
    symptoms: List[str]

class DiseaseResponse(BaseModel):
    diseases: List[str]
    descriptions: Dict[str, str]
    precautions: Dict[str, List[str]]

# --- 4. Prediction endpoint ---
@app.post("/predict", response_model=DiseaseResponse)
def predict_disease(data: SymptomsRequest):
    user_symptoms = {s.lower().strip() for s in data.symptoms}

    best_score = -1
    best_diseases: List[str] = []

    # Score each disease
    for disease, syms in disease_symptoms.items():
        score = sum(
            symptom_severity.get(sym, 1)
            for sym in syms
            if sym in user_symptoms
        )
        if score > best_score:
            best_score = score
            best_diseases = [disease]
        elif score == best_score:
            best_diseases.append(disease)

    # If top score is zero or no symptoms matched, you can return empty or 'Unknown'
    if best_score <= 0 or not best_diseases:
        return DiseaseResponse(
            diseases=[],
            descriptions={},
            precautions={}
        )

    # Build response entries for each top disease
    resp_descriptions = {
        d: descriptions.get(d, "No description available.")
        for d in best_diseases
    }
    resp_precautions = {
        d: precautions.get(d, [])
        for d in best_diseases
    }

    return DiseaseResponse(
        diseases=best_diseases,
        descriptions=resp_descriptions,
        precautions=resp_precautions
    )
