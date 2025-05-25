# 🩺 **Health Hub**

[![React](https://img.shields.io/badge/Frontend-React%2BTypeScript-blue)](https://reactjs.org/)  
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)](https://fastapi.tiangolo.com/)  
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen)](https://spring.io/projects/spring-boot)

**A Modular, AI-Powered Health Management Application**  
**Author:** **Naman Bangari**

---

## 📖 **Overview**

**Health Hub** is a full-stack health management system combining:

- 🧠 **Image Analysis** (e.g., cataract detection) via **FastAPI**
- 🩺 **Symptom Prediction** via **FastAPI**
- 🔧 **Extended Services** via **Spring Boot**
- 🌐 **Interactive Web UI** via **React + TypeScript**

Each service runs independently for easy scaling and maintenance.

---

## 📂 **Project Structure**

```text
health-hub/
├── fastapi-backend-image/       # Image analysis API (port 8000)
├── fastapi-backend-symptom/     # Symptom checker API (port 8001)
├── springboot-backend/          # Spring Boot microservices (port 8900)
└── healthhub-frontend/          # React + TypeScript UI (port 3000)
```
## FastAPI Backend – image Checker
```text
cd fastapi-backend-symptom
python -m uvicorn main:app --reload --port 8000
```

## FastAPI Backend – Symptom Checker
```text
cd fastapi-backend-symptom
python -m uvicorn main:app --reload --port 8001
```
## React + TypeScript Frontend
```text
cd healthhub-frontend
npm install
npm run dev
```
## Spring Boot Backend
```text
cd springboot-backend
./mvnw clean spring-boot:run
```

## 🎯 Features

**Eye Image Analysis** – Detect cataracts and other conditions

**Symptom Prediction** – Suggest possible ailments

**Modular Microservices** – Independent, scalable services

**RESTful APIs** – Standardized communication

**Responsive UI** – User-friendly React frontend

## 🛠️ Tech Stack

| **Layer**  | **Technology**          |
| ---------- | ----------------------- |
| Frontend   | React, TypeScript       |
| Backend 1  | FastAPI, Uvicorn        |
| Backend 2  | FastAPI, Uvicorn        |
| Backend 3  | Spring Boot, Maven      |
| Database   | MySql                   |





## 🤝 Contributing

Fork the repository

Create a feature branch: git checkout -b feature/YourFeature

Commit changes: git commit -m "Add YourFeature"


Push to branch: git push origin feature/YourFeature

Open a Pull Request

Please follow the existing code style and include tests where applicable.

