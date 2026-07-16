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



