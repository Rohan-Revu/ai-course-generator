# Learnify - AI Course Generator

Learnify is a full-stack AI-powered learning platform that generates personalized courses based on user interests. Users can create structured learning paths, track progress, upload course thumbnails, and access curated YouTube resources—all powered by Google's Gemini AI.

---

## Live Link

**Frontend:** https://ai-course-generator-rho.vercel.app

> **Note:** The backend is hosted on Render. If the application has been inactive for a while, the first request may take 30–60 seconds while the server wakes up.

---

## Demo

<p align="center">
  <img src="client/src/assets/Learnify.gif" alt="CPP Shell Demo" width="900">
</p>

## Features

- AI-generated personalized courses using Google Gemini API
- Secure user authentication with JWT
- Structured modules and lessons
- Track lesson completion and learning progress
- Upload custom course thumbnails with Cloudinary
- Curated YouTube learning resources
- Interactive dashboard to manage courses
- Create and delete courses
- Responsive modern UI

---

## Tech Stack

| Category          | Technologies                                                          |
| ----------------- | --------------------------------------------------------------------- |
| **Frontend**      | React, TypeScript, Vite, Tailwind CSS, React Router, ShadCN UI, Axios |
| **Backend**       | Node.js, Express.js, TypeScript, JWT Authentication, Multer           |
| **Database**      | MongoDB Atlas, Mongoose                                               |
| **External APIs** | Google Gemini API, YouTube Data API, Cloudinary                       |

---

## Project Structure

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

## Installation

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

## Environment Variables

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

## Run Locally

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
