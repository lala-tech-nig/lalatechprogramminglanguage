# LALA Language Website

A full-stack website for the **LALA Programming Language** — built with HTML, CSS, JavaScript (frontend) and Node.js + Express + MongoDB (backend).

## Structure

```
website/
├── client/                 # Frontend (pure HTML/CSS/JS)
│   ├── index.html          # Homepage
│   ├── how-it-works.html   # Architecture & language design
│   ├── starter-guide.html  # Installation & tutorial
│   ├── playground.html     # In-browser LALA editor
│   ├── showcase.html       # Community project gallery
│   ├── community.html      # Ideas, bugs & feature requests
│   ├── css/
│   │   ├── global.css      # Design system & shared styles
│   │   ├── home.css
│   │   ├── howworks.css
│   │   ├── guide.css
│   │   ├── playground.css
│   │   ├── showcase.css
│   │   └── community.css
│   └── js/
│       ├── global.js       # Shared utilities (API, toasts, etc.)
│       ├── home.js
│       ├── howworks.js
│       ├── guide.js
│       ├── playground.js   # Browser LALA interpreter
│       ├── showcase.js
│       └── community.js
└── server/                 # Backend (Node.js + Express + MongoDB)
    ├── index.js            # Server entry point
    ├── .env                # Environment variables
    ├── models/
    │   ├── Project.js      # Showcase projects model
    │   └── CommunityPost.js# Community posts model
    └── routes/
        ├── projects.js     # /api/projects CRUD
        └── community.js    # /api/community CRUD
```

## Prerequisites

- **Node.js** v18+
- **MongoDB** (local or MongoDB Atlas)

## Setup & Running

### 1. Start MongoDB
Make sure MongoDB is running locally:
```bash
mongod --dbpath /data/db
```
Or set `MONGO_URI` in `server/.env` to your Atlas connection string.

### 2. Start the Backend
```bash
cd website/server
npm install
npm start
# API running at http://localhost:5000
```

### 3. Open the Frontend
Open `website/client/index.html` in your browser, or serve it:
```bash
# Using npx serve (quick)
npx serve website/client -p 3000

# Using Python
python -m http.server 3000 --directory website/client
```

## Environment Variables (`server/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | API server port |
| `MONGO_URI` | `mongodb://localhost:27017/lala_website` | MongoDB connection |
| `ADMIN_PASSWORD` | `lala_admin_2024` | Admin panel password |

## API Endpoints

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | List projects (filter by dialect, sort, paginate) |
| POST | `/api/projects` | Submit a new project (multipart/form-data) |
| POST | `/api/projects/:id/like` | Like a project |
| DELETE | `/api/projects/:id` | Delete project (admin) |

### Community
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/community` | List posts (public or all with admin pw) |
| GET | `/api/community/stats` | Aggregate stats |
| POST | `/api/community` | Submit idea/bug/feature |
| POST | `/api/community/:id/upvote` | Upvote a post |
| PATCH | `/api/community/:id/status` | Update status (admin) |
| DELETE | `/api/community/:id` | Delete post (admin) |

## Features

- 🌍 **6 Pages**: Home, How It Works, Starter Guide, Playground, Showcase, Community
- 🧪 **Browser Playground**: In-browser LALA interpreter with syntax highlighting and 9 code examples
- 💾 **Project Showcase**: Upload projects with screenshots, filter by dialect, like system
- 💬 **Community Board**: Anonymous posting of ideas/bugs/features with screenshot support, upvoting, admin management
- 🔐 **Admin Panel**: Password-protected admin mode for reviewing private posts and managing statuses
- 📥 **Download Buttons**: Windows (.exe), macOS (.dmg), Linux (.tar.gz) with npm install fallback
- 🎨 **Premium Design**: Dark mode, glassmorphism, gradient animations, micro-interactions
- 📱 **Fully Responsive**: Mobile-optimized across all pages

## Admin Access

Default password: `lala_admin_2024` (change in `.env`)

Admins can:
- View all posts including admin-only ones
- Update post statuses (open/in-progress/resolved/declined)
- Add admin notes to posts
- Delete posts and projects
