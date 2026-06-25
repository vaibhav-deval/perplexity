import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useEffect } from "react";

const Dashboard = () => {
  const chat = useChat();
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const [inputValue, setInputValue] = useState("");
  
  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);
  
  const handleSendMessage = (e) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    if (inputValue.trim()) {
      chat.handleSendMessage({ message: inputValue, chatId: currentChatId });
      setInputValue("");
    }
  };

  return (
    <main className="h-screen w-full bg-neutral-900 flex">
      {/* Left Sidebar - Chat History */}
      <aside className="w-80 bg-neutral-800 border-r border-neutral-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-700">
          <h1 className="text-2xl font-semibold text-white">Perplexity</h1>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {Object.values(chats).map((chat, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left text-neutral-300 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors duration-200 truncate"
            >
              {chat.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 max-w-3/5 text-center mx-auto flex flex-col bg-neutral-900">
        {/* Header with User Message Area */}
        <div className="flex justify-end items-center p-6 border-b border-neutral-700">
          <div className="bg-neutral-700 px-4 py-2 rounded-lg">
            <span className="text-neutral-300 text-sm">user message</span>
          </div>
        </div>

        {/* Messages Display Area */}
        <div className="flex-1  overflow-y-auto p-8 flex items-center justify-center">
          <div className="text-center w-full">
            <div className="mt-8 space-y-4">
              {(chats?.[currentChatId]?.messages ?? []).map((message, idx) => (
                <div
                  key={message?.id ?? idx}
                  className={`flex ${
                    message?.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      message?.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-700 text-neutral-300"
                    }`}
                  >
                    {message?.content ?? ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-neutral-700">
          <div className="bg-neutral-700 rounded-lg p-4 flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="chat input area"
              className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
