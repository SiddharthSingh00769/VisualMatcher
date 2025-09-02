# ⚡ Visual Product Matcher

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.15.0-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-4.3.9-purple?logo=vite&logoColor=white)](https://vitejs.dev/)

A **full-stack web application** that lets users find **visually similar products** by uploading an image or providing an image URL.

---

## 📑 Table of Contents

- [🚀 Key Features](#-key-features)  
- [🛠️ Technology Stack](#-technology-stack)  
- [💻 Setup and Installation](#-setup-and-installation)  
  - [Prerequisites](#prerequisites)  
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)  
  - [Step 2: Backend Setup](#step-2-backend-setup)  
  - [Step 3: Frontend Setup](#step-3-frontend-setup)  
  - [Step 4: Seed the Database](#step-4-seed-the-database)  
  - [Step 5: Run the Application](#step-5-run-the-application)  
- [⚙️ Deployment](#-deployment)  
- [📂 Project Structure](#-project-structure)  
- [🔐 Authentication Flow](#-authentication-flow)  
- [🖼️ Usage Tips](#-usage-tips)  
- [🖥️ Screenshots & Demo](#-screenshots--demo)  
- [📄 License](#-license)  

---

## 🚀 Key Features

- 🔍 **Visual Search**: Find and rank products by visual similarity using the **Gemini API**.  
- 🖼️ **Image Uploads**: Supports **file uploads** and **URL inputs**.  
- 🛒 **Product Management**: Authenticated users can add new products.  
- 🔐 **User Authentication**: Secure sign-up/sign-in with **JWT** and **HTTP-only cookies**.  
- 📄 **Detailed Product Pages**: View complete product information.  
- 📱 **Responsive Design**: Mobile-friendly UI built with **Tailwind CSS**.  

> 💡 Tip: Use JPEG and WEBP images for better search accuracy.

---

## 🛠️ Technology Stack

### Frontend

- **React** – Interactive UI  
- **Vite** – Fast build tool  
- **React Router** – Client-side routing  
- **Axios** – HTTP client  
- **Tailwind CSS** – Utility-first styling  

### Backend

- **Node.js & Express** – Server runtime & framework  
- **MongoDB & Mongoose** – NoSQL database + ODM  
- **JWT** – Stateless authentication  
- **bcrypt** – Password hashing  
- **cookie-parser** – Cookie middleware  
- **Gemini API** – Convert images into feature vectors for visual matching  

---

## 💻 Setup and Installation

### Prerequisites

- Node.js v18+  
- MongoDB Atlas account  
- Google AI Studio API key  

### Step 1: Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd visual-matcher-app
```

### Step 2: Backend Setup
```bash
Copy code
cd backend
npm install
```
-Create .env in backend/:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_strong_random_secret_key
GOOGLE_API_KEY=your_gemini_api_key
```

### Step 3: Frontend Setup
```bash
Copy code
cd ../frontend
npm install
```
-Create .env.local in frontend/:
```bash
VITE_BACKEND_URL=http://localhost:5000
```

### Step 4: Seed the Database
```bash
cd ../backend
node seeder/seeder.js
⚠️ Note: This may take time due to API rate limits.
```

### Step 5: Run the Application
```bash
# Backend
cd backend
npm run dev
```

# Frontend
```bash
cd ../frontend
npm run dev
Access at: http://localhost:5173
```

### ⚙️ Deployment
```bash
Backend: Render.com (Web Service)

Frontend: Vercel (Static Site)

⚠️ Tip: Configure environment variables and CORS correctly on both platforms.
```

### 📂 Project Structure
```bash
visual-matcher-app/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seeder/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── .env.local
│
└── README.md
```

### 🔐 Authentication Flow
-User signs up or logs in
-JWT token is stored in an HTTP-only cookie
-Authenticated users can add products and perform visual search

### 🖼️ Usage Tips
-Use JPEG or WEBP images for better similarity results
-Fill in name, category, and description for each product
-Search via file upload or image URL

### 🖥️ Screenshots & Demo
Home Page
<img width="1902" height="920" alt="Screenshot 2025-09-01 000256" src="https://github.com/user-attachments/assets/1d98fa8c-a775-4637-b946-c7c0fef462f3" />

Visual Search
<img width="1899" height="916" alt="Screenshot 2025-09-01 000405" src="https://github.com/user-attachments/assets/f24cb168-8edc-460b-8dd8-56c976517eae" />

Product Details
<img width="1899" height="916" alt="Screenshot 2025-09-01 000444" src="https://github.com/user-attachments/assets/8ebecf51-1fe0-4073-88c3-bff5d8ecfc4e" />

Add New Product
<img width="1898" height="920" alt="Screenshot 2025-09-01 000525" src="https://github.com/user-attachments/assets/6eaaa877-6b0d-4972-88a7-6501cd934188" />
