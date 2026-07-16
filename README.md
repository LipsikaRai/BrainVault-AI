# 🧠 BrainVault AI — Your Ultimate Digital Brain

BrainVault AI is a modern, high-performance web application designed for personal knowledge management and smart learning. Powered by Google Gemini AI, it helps users organize, search, and extract intelligence from a variety of digital learning inputs—including notes, web bookmarks, PDFs, and YouTube videos.

---

## ⚡ Tech Stack

| Tier | Technology | Description |
|---|---|---|
| **Frontend** | **React.js (Vite)** | Next-gen lightning-fast build tool and rendering library |
| | **Tailwind CSS v4** | Utility-first CSS styling for custom layout and theme aesthetics |
| | **React Router DOM** | Declarative page-routing mechanics |
| | **Axios** | Promised-based HTTP client with global request and response interceptors |
| **Backend** | **Node.js & Express** | Event-driven runtime environment and robust routing server |
| | **MongoDB & Mongoose** | Document database for storing notes, bookmarks, tasks, and users |
| | **JWT (JSON Web Tokens)** | Standard secure token authentication for session validation |
| | **Multer** | Multipart form-data handling for local file streaming |
| **AI Engine** | **Google Gemini 1.5 Flash** | Direct API integrations for lightning-fast text processing and PDF analyses |

---

## 🌟 Key Features

*   **Unified Dashboard**: Centrally view, pin, favorite, and search your entire index of notes, videos, websites, and documents.
*   **Gemini AI Summarization**: Instantly generate clean, 3-to-4 sentence summary digests of your notes, bookmarks, and uploaded PDFs.
*   **Smart Semantic Categorization**: Automated lowercase tag generators analyze text structures and map files dynamically.
*   **Media Bookmarks**:
    *   **YouTube Videos**: Saves bookmark lists, extracts info via Youtube oEmbed API, and stores custom learning notes.
    *   **Websites**: Scraping fallback gathers text content of bookmarks to send to Gemini for deeper digests.
    *   **PDF Documents**: Direct local PDF parsing (up to 10MB) leveraging Gemini Multimodal API contexts.
*   **Tasks & Deadlines Manager**: Add colored trackers with completion toggles, overdue warnings, and local browser push notifications.
*   **Client Validation & Feedback**: Dynamic invalid input indicator outlines, password complexity requirements, spinners, and toast queues.

---

## 📂 Project Directory Structure

```text
BrainVault-AI/
├── backend/                   # Node.js + Express API server
│   ├── config/                # Database configuration
│   ├── controllers/           # Route handler controllers (Auth, AI, Notes, etc.)
│   ├── middleware/            # JWT validation, error handling, Multer uploads
│   ├── models/                # Mongoose database schemas
│   ├── routes/                # Express API endpoints
│   ├── uploads/               # Directory for uploaded PDF documents
│   ├── utils/                 # Gemini API integration service
│   ├── .env.example           # Backend environment template
│   └── server.js              # Application entry point
├── frontend/                  # React + Vite Client app
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable UI widgets and SVG vector assets
│   │   ├── context/           # React context providers (Auth, Toast alerts)
│   │   ├── pages/             # View layers (Dashboard, LoginPage, etc.)
│   │   ├── utils/             # Axios API config wrappers
│   │   ├── index.css          # Tailwind CSS global sheets
│   │   └── main.jsx           # App initialization entry
│   ├── .env.example           # Frontend environment template
│   └── vite.config.js         # Vite compiler configuration
└── README.md                  # Master documentation (this file)
```

---

## 🔧 Environment Variables Setup

### Backend Config (`backend/.env`)
Create a `.env` file in the `backend` folder and populate it with:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/brainvault?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_token_key_change_me_in_production
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend Config (`frontend/.env`)
Create a `.env` file in the `frontend` folder and populate it with:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Local Installation & Execution

### Prerequisites
*   Node.js (v18+)
*   MongoDB Local instance or Atlas URI
*   Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### 1. Run the Backend API Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file using the templates above.
4. Launch in development mode:
   ```bash
   npm run dev
   ```
   *The server runs on [http://localhost:5000](http://localhost:5000)*

### 2. Run the Frontend Client App
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file pointing to the backend.
4. Launch the Vite hot-reloading dev server:
   ```bash
   npm run dev
   ```
   *The app opens on [http://localhost:5173](http://localhost:5173)*

---

## 📡 API Reference Guide

All routes except authentication (`/register` and `/login`) are protected and require a `Bearer <JWT_TOKEN>` in the `Authorization` header.

### 🔐 Authentication
*   `POST /api/auth/register` - Create user account
*   `POST /api/auth/login` - Sign in user and returns JWT token
*   `GET /api/auth/profile` - Fetch authenticated user profile

### 📝 Notes Management
*   `GET /api/notes` - Retrieve all user notes
*   `POST /api/notes` - Save a new note
*   `PUT /api/notes/:id` - Update note content/metadata
*   `DELETE /api/notes/:id` - Remove note

### 🔗 Resource Bookmarks (Videos & Websites)
*   `GET /api/resources` - Retrieve saved videos & website bookmarks
*   `POST /api/resources` - Bookmark a video or webpage URL
*   `GET /api/resources/youtube-info` - Fetch thumbnail information using YouTube oEmbed
*   `PUT /api/resources/:id` - Modify resource description or note details
*   `DELETE /api/resources/:id` - Remove resource bookmark

### 📄 PDF Document Archives
*   `GET /api/pdfs` - List uploaded PDF documents
*   `POST /api/pdfs` - Upload a PDF file (Field name: `pdf`, Max: 10MB)
*   `PUT /api/pdfs/:id` - Replace a PDF document or edit notes
*   `DELETE /api/pdfs/:id` - Delete PDF file record (and unlinks physical storage)

### ⏰ Tasks & Reminders
*   `GET /api/reminders` - Retrieve list of reminders
*   `POST /api/reminders` - Schedule a new reminder with color coding and due dates
*   `PUT /api/reminders/:id` - Complete task, toggle, or edit description
*   `DELETE /api/reminders/:id` - Remove reminder

### 🤖 Gemini AI Insights
*   `POST /api/ai/summary` - Generates a 3-to-4 sentence summary using item description and content
*   `POST /api/ai/tags` - Analyzes items to return JSON strings array of semantic keywords

---

## ☁️ Deployment Instructions

### 🖥️ Frontend Client (Vercel)
Vercel is optimized for static build sites (like Vite apps).

1. **Upload Code**: Push the repository to GitHub.
2. **Import Project**: Log in to Vercel and click **Add New Project**, importing this repo.
3. **Configure Project Settings**:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: `Vite`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4. **Environment Variables**: Add `VITE_API_URL` pointing to your deployed backend (e.g., `https://brainvault-api.onrender.com/api`).
5. Click **Deploy**.

### ⚙️ Backend API Server (Render)
Render is an excellent web hosting environment for Node.js Express APIs.

1. **Create Web Service**: In Render dashboard, select **New** -> **Web Service** and connect your GitHub repo.
2. **Configure Settings**:
    *   **Root Directory**: `backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Plan**: `Free` (or custom tier)
3. **Configure Environment Variables**:
    *   Add `PORT` = `5000`
    *   Add `MONGODB_URI` = *Your MongoDB Atlas URL*
    *   Add `JWT_SECRET` = *Secure secret string*
    *   Add `NODE_ENV` = `production`
    *   Add `GEMINI_API_KEY` = *Your Gemini API Key*
4. **MongoDB Atlas Settings**: Ensure you add `0.0.0.0/0` (allow connections from anywhere) to the IP Access List in MongoDB Atlas so Render servers can reach the database.
5. Click **Deploy**.

---

## 🎓 Interview Talking Points

If discussing this project during software engineering interviews, focus on these key structural highlights:
*   **JWT Token Persistence**: Explain how the request/response interceptors in `axiosInstance` attach session keys automatically, keeping routing guards valid even after manual page refreshes.
*   **Gemini API Efficiency**: Describe how standard `fetch` API requests to Google Generative Language endpoints were utilized instead of bulky client SDKs to keep the container lightweight.
*   **Orphan File Avoidance**: Highlight how the Multer controller deletes uploaded PDF files from physical storage in case database writing operations fail during a `catch` block.
