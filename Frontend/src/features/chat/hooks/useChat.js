import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  createChat,
  deleteChat,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    const data = await sendMessage({ message, chatId });
    const { chat, aiMessage } = data;
    if (!chatId)
      dispatch(
        createNewChat({
          chatId: chat._id,
          title: chat.title,
        }),
      );
    dispatch(
      addNewMessage({
        chatId: chatId || chat._id,
        content: message,
        role: "user",
      }),
    );
    dispatch(
      addNewMessage({
        chatId: chatId || chat._id,
        content: aiMessage.content,
        role: aiMessage.role,
      }),
    );
    dispatch(setCurrentChatId(chat._id));
  }

  async function handleGetChats() {
    dispatch(setLoading(true));
    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            message: [],
            lastUpdate: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats
  };
};
