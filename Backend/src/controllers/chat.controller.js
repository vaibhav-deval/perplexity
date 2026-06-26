import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chatId } = req.body;

  let title = null;
  let chat = null;
  let activeChatId = chatId;

  if (chatId) {
    const existingChat = await chatModel.findOne({
      _id: chatId,
      user: req.user.id,
    });
    if (!existingChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
  } else {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
    activeChatId = chat._id;
  }

  const result = await generateResponse(message);

  await messageModel.create({
    chat: activeChatId,
    content: message,
    role: "user",
  });

  const aiMessage = await messageModel.create({
    chat: activeChatId,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    title,
    chatId: activeChatId,
    chat,
    aiMessage,
  });
}

export async function getChats(req, res) {
  const user = req.user.id;
  const chats = await chatModel.find({ user });
  res.status(200).json({
    message: "Chats retrieved successfully",
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;
  const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
  if (!chat) {
    return res.status(404).json({
      message: "chat not found",
    });
  }

  const messages = await messageModel.find({
    chat: chatId,
  });
  res
    .status(200)
    .json({ message: "messages retrieved successfully", messages });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;
  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });
  const messages = await messageModel.deleteMany({ chat: chatId });
  if (!chat) {
    return res.status(404).json({
      message: "chat not found",
    });
  }
  res.status(200).json({
    message: "chat deleted successfully",
  });
}
