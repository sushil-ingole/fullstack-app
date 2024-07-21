Got it! Here's the entire `README.md` formatted correctly, with continuous markdown sections:

```markdown
# MERN Stack Chat Application

This project is a chat application built using the MERN stack (MongoDB, Express.js, React, Node.js). It features real-time messaging, user authentication, and group management.

## Features

- **User Registration and Login:** Secure authentication for users.
- **Group Creation and Management:** Create and manage groups, including adding and removing members.
- **Real-Time Messaging:** Send and receive messages in real-time using Socket.io.
- **Message Liking:** Like messages to show appreciation.

## Setup

### Backend

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Run the Backend Server:**
   ```bash
   npx nodemon index.js
   ```

### Frontend

1. **Navigate to the Frontend Directory and Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The frontend will be served on [http://localhost:5173](http://localhost:5173) by default.

## API Endpoints

- `POST /signup` - Register a new user
- `POST /login` - Authenticate a user
- `GET /getallusers` - Fetch all users
- `POST /creategroup` - Create a new group
- `PUT /updategroupinfo` - Update group information
- `POST /getallgroups` - Fetch all groups for a user
- `POST /removeuserfromgroup` - Remove a user from a group
- `POST /addMessageToChat` - Add a message to a chat
- `PUT /likemsg` - Like a message

## Socket Events

- `setup` - Join a chat room
- `send_user_notification` - Send a notification to a user
- `likemsg` - Broadcast a message like event
- `removeUserFromGroup` - Notify about a user removal from a group
- `updateGroup` - Broadcast group update information

## Dependencies

- **Backend:** Express, MongoDB, Mongoose, Bcrypt, JWT, Socket.io
- **Frontend:** React, Vite

---

Feel free to explore the repository and let me know if you have any questions or need further information.
```

This version keeps the markdown formatting consistent and correct.