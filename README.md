# Vibify: Full-Stack Music Streaming Platform

## 1. Overview

Vibify is a modern, full-stack music streaming and content management platform. It provides users with a rich interface for discovering, playing, and managing music, complete with real-time chat, AI-powered content discovery, and a secure administrative dashboard for content curation.

The application is built as a monolithic repository, featuring a robust Node.js/Express backend and a high-performance React/TypeScript frontend.

## 2. Tech Stack

| Layer | Technology | Key Components |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express | Mongoose (MongoDB), Socket.IO, Clerk (Auth), Cloudinary (Storage), Gemini AI, `node-cron` |
| **Database** | MongoDB | Mongoose ODM |
| **Frontend** | React, TypeScript | Vite, Tailwind CSS, Zustand (State), Radix UI, `react-router-dom`, Clerk (Auth) |
| **Styling** | Tailwind CSS | Shadcn UI components, `class-variance-authority` |
| **Authentication** | Clerk | `@clerk/express`, `@clerk/clerk-react` |

## 3. Project Structure

| Directory/File | Role |
| :--- | :--- |
| `backend/src/controller/` | Contains all business logic handlers for API routes (Auth, Songs, Admin, Chat). |
| `backend/src/lib/` | Core utilities: Database connection (`db.js`), Cloudinary, Gemini AI, and Socket.IO setup. |
| `backend/src/middleware/` | Custom Express middleware for authentication (`protectRoute`) and authorization (`requireAdmin`). |
| `backend/src/models/` | Mongoose schemas for `Song`, `Album`, `User`, and `Message` entities. |
| `backend/src/routes/` | Express routers defining all API endpoints (`/api/songs`, `/api/admin`, etc.). |
| `backend/src/seeds/` | Standalone scripts for populating the database with initial sample data. |
| `frontend/src/components/` | Reusable UI components, including the shared `ui/` library (Button, Card, Table). |
| `frontend/src/layout/` | Defines the persistent application structure (`MainLayout`, `LeftSidebar`, `PlaybackControls`). |
| `frontend/src/pages/` | Top-level components for specific views (Home, Chat, Admin, Album). |
| `frontend/src/stores/` | Centralized state management using Zustand (`useMusicStore`, `usePlayerStore`, `useChatStore`). |
| `frontend/src/types/` | Global TypeScript interfaces for data models. |

## 4. Key Components/Modules

### Backend

| Module | Purpose |
| :--- | :--- |
| **`admin.controller.js`** | Handles content lifecycle: `createSong`, `deleteAlbum`, including file uploads to Cloudinary and database relationship management. |
| **`song.controller.js`** | Manages all read operations: `getAllSongs`, randomized sampling (`getFeaturedSongs`), and search (`searchSongs`). |
| **`stat.controller.js`** | Calculates and returns application metrics (Total Songs, Albums, Users, Unique Artists) using MongoDB aggregation. |
| **`index.js`** | Entry point: Initializes Express, connects to MongoDB, sets up Clerk middleware, and starts the Socket.IO server. |
| **`socket.js`** | Real-time communication layer: Manages user presence, activity tracking, and message persistence via Socket.IO. |
| **`auth.middleware.js`** | Secures routes using `protectRoute` and enforces content management access with `requireAdmin` (checks against `ADMIN_EMAIL`). |

### Frontend

| Component/Store | Purpose |
| :--- | :--- |
| **`MainLayout.tsx`** | The root layout, integrating `LeftSidebar`, main content (`Outlet`), `FriendsActivity`, and the persistent `PlaybackControls`. |
| **`AudioPlayer.tsx`** | The hidden functional component managing the HTML `<audio>` element and synchronizing playback with the global state. |
| **`usePlayerStore.ts`** | Manages global playback state (queue, current song, play/pause) and broadcasts user activity via the socket. |
| **`useChatStore.ts`** | Manages real-time chat state, handles socket connection, user presence, and message fetching/sending. |
| **`AdminPage.tsx`** | Secure administrative dashboard for viewing stats and managing content via `SongsTable` and `AlbumsTable`. |
| **`AISidebar.tsx`** | AI-powered search panel that uses the Gemini API (via backend) to find relevant YouTube videos based on natural language prompts. |

## 5. Setup

### Prerequisites

*   Node.js (v18+)
*   MongoDB Instance (Local or Cloud)
*   Clerk Account (for authentication)
*   Cloudinary Account (for media storage)
*   Google Gemini API Key
*   YouTube Data API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd vibify
    ```

2.  **Install dependencies (Backend & Frontend):**
    ```bash
    npm install
    npm run install:all
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `backend` directory and populate it (see Configuration section).

4.  **Seed the Database (Optional):**
    To populate your MongoDB instance with sample songs and albums:
    ```bash
    npm run seed
    ```

## 6. Usage

### Running the Application

Start both the backend API server and the frontend development server concurrently:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`. The backend API runs on `http://localhost:5000`.

### Key API Endpoints (Backend)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/callback` | Synchronizes user data after Clerk authentication (upsert user record). |
| `GET` | `/api/songs/featured` | Retrieves a randomized sample of featured songs. |
| `GET` | `/api/songs/search?q=query` | Searches songs by title or artist. |
| `POST` | `/api/ai-search` | **(Protected)** Uses Gemini AI to find a relevant YouTube video. |
| `POST` | `/api/admin/songs` | **(Admin Only)** Uploads audio/image files and creates a new song record. |
| `GET` | `/api/stats` | **(Admin Only)** Retrieves system statistics (songs, albums, artists, users). |
| `GET` | `/api/users/messages/:userId` | **(Protected)** Fetches conversation history with a specific user. |

## 7. Configuration

Create a `.env` file in the `backend` directory with the following variables:

| Name | Purpose | Required | Default |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend server port | Yes | `5000` |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `CLERK_SECRET_KEY` | Clerk API Secret Key | Yes | - |
| `ADMIN_EMAIL` | Email address of the designated administrator | Yes | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Yes | - |
| `GEMINI_API_KEY` | Google Gemini API Key | Yes | - |
| `YOUTUBE_API_KEY` | YouTube Data API Key (for AI search) | Yes | - |

The frontend requires the following variable in a `.env` file in the `frontend` directory:

| Name | Purpose | Required | Default |
| :--- | :--- | :--- | :--- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Frontend Publishable Key | Yes | - |

## 8. Data Model

The application uses four primary Mongoose models:

| Entity | Key Fields | Relationships |
| :--- | :--- | :--- |
| **User** | `clerkId` (unique), `fullName`, `imageUrl` | - |
| **Song** | `title`, `artist`, `audioUrl`, `imageUrl`, `duration` | Optional `albumId` (references `Album`) |
| **Album** | `title`, `artist`, `imageUrl`, `releaseYear` | `songs` (array of `Song` IDs) |
| **Message** | `content`, `senderId`, `receiverId` | - |

## 9. Testing

Testing is not explicitly defined in the provided file summaries. Standard practice would involve:

1.  **Unit Tests:** Using Jest/Vitest for controllers, utilities, and store logic.
2.  **Integration Tests:** Using Supertest for API routes.

## 10. Deployment

The backend application (`backend/src/index.js`) is configured for production deployment:

*   It uses `process.env.NODE_ENV` to serve the bundled frontend static assets from `../frontend/dist` when in production.
*   It implements a global error handler that masks detailed errors in production.
*   It uses `express-fileupload` for file handling and `node-cron` for hourly cleanup of temporary upload files.

**Deployment Hint:** Deploy the backend (Node/Express) to a service like Render or AWS Elastic Beanstalk. Ensure the build process runs the frontend build (`npm run build`) and places the output in the expected `frontend/dist` directory relative to the backend entry point.

## 11. Roadmap/Limitations

*   **Real-time Activity:** User activity (listening status) is broadcast in real-time via Socket.IO.
*   **Admin Security:** Administrative routes are secured using Clerk authentication and an `ADMIN_EMAIL` check.
*   **Content Discovery:** Integrated AI search (Gemini + YouTube API) provides advanced content discovery.
*   **Limitation:** The current implementation relies on external services (Clerk, Cloudinary, Gemini) and requires multiple API keys for full functionality.
