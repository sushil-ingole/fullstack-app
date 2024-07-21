# MERN Stack Chat Application

This project is a chat application built using the MERN stack (MongoDB, Express.js, React, Node.js). It features real-time messaging, user authentication, and group management.

## Features

- User registration and login
- Group creation and management
- Real-time messaging with Socket.io
- Like messages functionality

## Setup

### Backend

1. **Install dependencies:**
   ```bash
   npm install
2. Run the backend server:
   ```bash
   npx nodemon index.js

### Frontend

1. **Navigate to the frontend directory and install dependencies:**
   ```bash
   cd frontend
   npm install

2.  **Run the development server:**
    ```bash
    npm run dev

The frontend will be served on http://localhost:5173 by default.

### API Endpoints
POST /signup - Register a new user
POST /login - Authenticate a user
GET /getallusers - Fetch all users
POST /creategroup - Create a new group
PUT /updategroupinfo - Update group information
POST /getallgroups - Fetch all groups for a user
POST /removeuserfromgroup - Remove a user from a group
POST /addMessageToChat - Add a message to a chat
PUT /likemsg - Like a message


### Socket Events
setup - Join a chat room
send_user_notification - Send a notification to a user
likemsg - Broadcast a message like event
removeUserFromGroup - Notify about a user removal from a group
updateGroup - Broadcast group update information

### Dependencies
Backend: Express, MongoDB, Mongoose, Bcrypt, JWT, Socket.io
Frontend: React, Vite

This `README.md` includes sections for setup, API endpoints, Socket events, and dependencies, formatted for GitHub.
