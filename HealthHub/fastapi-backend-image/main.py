from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model  # type: ignore
from PIL import Image
import io

app = FastAPI()

# Enable CORS (modify in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
try:
    pneumonia_model = load_model("models/pneumonia_model.keras")  # Pneumonia model
    eyecataract_model = load_model("models/eyecat_model.keras")  # model for eye cataract
    fracture_model = load_model("models/fracture.keras")  # Fracture model
except Exception as e:
    print(f"Error loading models: {e}")
    raise

# Input image size
IMG_SIZE = (224, 224)

# Common preprocessing function
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize(IMG_SIZE)
    image_array = np.array(image) / 255.0  # Normalize
    return np.expand_dims(image_array, axis=0)  # Add batch dimension

# prediction logic
async def predict_with_model(file: UploadFile, model, threshold: float, labels: list):
    try:
        image_bytes = await file.read()
        input_array = preprocess_image(image_bytes)
        prediction = model.predict(input_array)[0][0]
        label = labels[1] if prediction > threshold else labels[0]
        confidence = float(prediction if prediction > threshold else 1 - prediction)

        return JSONResponse(content={
            "prediction": label,
            "confidence": confidence
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pneumonia endpoint
@app.post("/predict/pneumonia")
async def predict_pneumonia(file: UploadFile = File(...)):
    return await predict_with_model(file, pneumonia_model, threshold=0.5, labels=["Normal", "Pneumonia"])

# Eye Cataract endpoint
@app.post("/predict/eyecataract")
async def predict_eyecataract(file: UploadFile = File(...)):
    return await predict_with_model(file, eyecataract_model, threshold=0.5, labels=["Normal", "Cataract"])

# Fracture endpoint
@app.post("/predict/fracture")
async def predict_fracture(file: UploadFile = File(...)):
    return await predict_with_model(file, fracture_model, threshold=0.5, labels=["No Fracture", "Fracture"])
