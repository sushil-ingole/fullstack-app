const express = require('express');
const connectDB = require('./config/db');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Chat = require('./models/Chat');
const { Msg } = require('./models/Msg');
const path = require('path');
const fs = require('fs');
const { validationResult } = require("express-validator");
const fetchUser = require('./middleware/fetchUser');
const JWT_SECRET = "secret@key";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

const PORT = 5100;

app.get('/', (req, res) => {
    res.send("Fullstack Chat App");
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email }).select("-password");
    if (user) {
        return res.status(400).json({ error: "Sorry a user with this email id already exists." });
    } else {
        const salt = await bcrypt.genSalt();
        const securePassword = await bcrypt.hash(password, salt);
        user = await User.create({
            name: name, email: email, password: securePassword
        });
        const { _id, date } = user;
        const data = {
            user: {
                id: _id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        const loggedInUser = { _id, name, email, date };
        res.status(200).json({ success: true, authToken, data: loggedInUser });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ error: 'Account not found.' });
    }
    const { _id, name, date } = user;
    const loggedInUser = { _id, name, email, date };
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        res.status(401).json({ error: "Invalid username or password." });
    }
    const data = {
        user: {
            id: _id
        }
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.status(200).json({ success: true, authToken, data: loggedInUser });
});

app.get('/getallusers', fetchUser ,async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const users = await User.find().select("-password");
    if (!users) {
        res.status(200).json({ error: "No users found" });
    }
    success = true;
    res.status(200).json({ success: success, data: users });
});

app.post('/creategroup', fetchUser ,async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { groupName, userIds, adminsId } = req.body;
    const newChat = await new Chat({
        groupName: groupName,
        users: userIds,
        adminsId: adminsId
    });
    try {
        const savedChat = await newChat.save();
        success = true;
        res.status(200).json({ success, data: savedChat });
    } catch (error) {
        // console.error('Error creating group chat:', error);
        res.status(200).json({ success, error: "Error creating group chat" });
    }
});

app.put('/updategroupinfo', fetchUser ,async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { groupId, groupName, users } = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(groupId, { groupName: groupName, users: users }, { new: true });
        if (!updatedChat) {
            return res.status(404).json({ success, error: "Group not found" });
        }
        success = true;
        res.status(200).json({ success, data: updatedChat });
    } catch (error) {
        // console.error('Error updating group chat:', error);
        res.status(500).json({ success, error: "Error updating group chat" });
    }
});

app.post('/getallgroups', fetchUser ,async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.body;
    const allGroups = await Chat.find({ users: { $in: [userId] } });
    if (allGroups?.length) {
        success = true;
        res.status(200).json({ success, data: allGroups });
    } else {
        res.status(200).json({ success, error: "No groups found" });
    }
});

app.post('/removeuserfromgroup', fetchUser ,async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { groupId, userId } = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            groupId,
            { $pull: { users: userId } },
            { new: true }
        );
        if (!updatedChat) {
            return res.status(404).json({ success, error: "Group not found" });
        }
        success = true;
        res.status(200).json({ success: true, data: updatedChat });
    } catch (error) {
        // console.error('Error removing user from group:', error);
        res.status(500).json({ success, error: "Error removing user from group" });
    }
});

app.post('/addMessageToChat', fetchUser ,async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { _id, sender, content, name } = req.body;
    const newMsg = await new Msg({
        sender: sender,
        content,
        name
    });
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            _id,
            { $push: { msgs: newMsg } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedChat) {
            return res.status(404).json({ success, error: "Chat not found" });
        }
        success = true;
        res.status(200).json({ success: true, data: updatedChat });
    } catch (error) {
        // console.error('Error adding message to chat:', error);
        res.status(500).json({ success, error: "Error adding message to chat" });
    }
});

app.put('/likemsg', fetchUser ,async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { groupId, msgs } = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            groupId,
            { $set: { msgs: msgs } },
            { new: true }
        );
        if (!updatedChat) {
            return res.status(404).send({success, error: 'Chat group not found'});
        }
        success = true;
        res.status(200).json({success, data: updatedChat});
    } catch (error) {
        res.status(500).json({ success, error: error.message });
    }
});

const server = app.listen(PORT, () => {
    console.log("Server running on PORT: ", PORT);
});

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    socket.on("setup", (roomId) => {
        if (roomId) {
            socket.join(roomId);
        }
    });

    socket.on("send_user_notification", (notification) => {
        socket.to(notification._id).emit("receive_notification", notification);
    });

    socket.on("likemsg", (bodyData) => {
        socket.to(bodyData.groupId).emit("msgliked", bodyData);
    });

    socket.on("removeUserFromGroup", (data) => {
        socket.to(data.groupId).emit("removeUserFromGroup", data);
    });

    socket.on("updateGroup", (data) => {
        socket.to(userId).emit("updateGroup", data);
    });
});

module.exports = server;