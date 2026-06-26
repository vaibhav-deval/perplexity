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
  addMessage,
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    const data = await sendMessage({ message, chatId });
    const { chat, chatId: responseChatId, aiMessage } = data;
    const activeChatId = chatId || responseChatId;

    if (!chatId) {
      dispatch(
        createNewChat({
          chatId: activeChatId,
          title: chat?.title ?? "New chat",
        }),
      );
    }

    dispatch(
      addNewMessage({
        chatId: activeChatId,
        content: message,
        role: "user",
      }),
    );
    dispatch(
      addNewMessage({
        chatId: activeChatId,
        content: aiMessage.content,
        role: aiMessage.role,
      }),
    );
    dispatch(setCurrentChatId(activeChatId));
    dispatch(setLoading(false));
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
            messages: [],
            lastUpdate: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  async function handleGetOpenChats(chatId) {
    if (!chatId) return;

    if (!chats[chatId]?.messages?.length) {
      dispatch(setLoading(true));
      const data = await getMessages(chatId);
      const { messages } = data;
      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));
      dispatch(
        addMessage({
          chatId,
          messages: formattedMessages,
        }),
      );
      dispatch(setLoading(false));
    }

    dispatch(setCurrentChatId(chatId));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleGetOpenChats,
  };
};
