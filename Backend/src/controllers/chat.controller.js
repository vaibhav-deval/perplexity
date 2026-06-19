import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  // const result = await generateResponse(message);
  let title = null,
    chat = null;
  if (!chatId) {
    title = await generateChatTitle(message);

    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const messages= await messageModel.find({ chat: chatId });
  // const userMessage = await messageModel.create({
  //   chat: chat._id,
  //   content: message,
  //   role: "user",
  // });

  console.log(messages)
  // const aiMessage = await messageModel.create({
  //   chat: chat._id,
  //   content: result,
  //   role: "ai",
  // });

  // res.status(201).json({ title, chat, aiMessage });
}
