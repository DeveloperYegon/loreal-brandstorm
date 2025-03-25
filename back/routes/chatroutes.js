const express = require('express');
const router = express.Router();
const { fetchAllChats ,fetchChatMessages} = require('../controllers/chatcontroller');
const { authMiddleware, adminMiddleware } = require("../middleware/authmiddleware");

router.get('/user-chats', authMiddleware, adminMiddleware,fetchAllChats);
router.get('/chat-messages/:thread_id', authMiddleware,fetchChatMessages);


module.exports = router;
