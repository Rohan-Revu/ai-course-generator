# 📚 Learnify - AI Course Generator

Learnify is a full-stack AI-powered learning platform that generates personalized courses based on user interests. Users can create structured learning paths, track progress, upload course thumbnails, and access curated YouTube resources—all powered by Google's Gemini AI.

---

## 🌐 Live Demo

**Frontend:** https://ai-course-generator-rho.vercel.app

> **Note:** The backend is hosted on Render. If the application has been inactive for a while, the first request may take 30–60 seconds while the server wakes up.



## 🚀 Features

- 🤖 AI-generated personalized courses using Google Gemini API
- 🔐 Secure user authentication with JWT
- 📖 Structured modules and lessons
- ✅ Track lesson completion and learning progress
- 🖼️ Upload custom course thumbnails with Cloudinary
- 🎥 Curated YouTube learning resources
- 📊 Interactive dashboard to manage courses
- 🗑️ Create and delete courses
- 📱 Responsive modern UI

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- ShadCN UI
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Multer

### Database
- MongoDB Atlas
- Mongoose

### External APIs
- Google Gemini API
- YouTube Data API
- Cloudinary

---

## 📂 Project Structure

```
Learnify/
│
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/learnify.git
cd learnify
```

---

### Install Frontend

```bash
cd client
npm install
```

---

### Install Backend

```bash
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

YOUTUBE_API_KEY=your_youtube_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Run Locally

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

The application will be available at

```
Frontend : http://localhost:5173

Backend  : http://localhost:5000
```

---

## 📸 Screenshots

### Landing Page

<img width="1901" height="873" alt="Screenshot 2026-07-11 134213" src="https://github.com/user-attachments/assets/ea426733-041b-4af8-a497-c7396bc8ebb9" />


---

### Dashboard

<img width="1918" height="875" alt="Screenshot 2026-07-11 134241" src="https://github.com/user-attachments/assets/c5e59832-1e41-4228-a885-e38503c7aba0" />


---

### Course Detail

<img width="1900" height="873" alt="Screenshot 2026-07-11 134305" src="https://github.com/user-attachments/assets/dfdabb52-3494-4d1c-8abe-7f91a6b916da" />


---

### Create Course

<img width="1898" height="871" alt="Screenshot 2026-07-11 134331" src="https://github.com/user-attachments/assets/4965ffce-9581-495a-a899-961bb1988f7f" />


---
