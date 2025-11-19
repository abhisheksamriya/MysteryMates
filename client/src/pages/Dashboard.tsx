import { useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import Header from "../components/Header";
import MessageBox from "../components/MessageBox";
import { getRoomId, getSocket, getUsername } from "../socket";

interface ChatMessage {
  message: string;
  author: string;
  type: "chat" | "system";
}

function Dashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const socket = getSocket();
  const roomId = getRoomId();
  const username = getUsername();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleOpen = () => setIsConnected(true);
    const handleClose = () => setIsConnected(false);
    const handleError = () => setIsConnected(false);

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            message: data.payload.message,
            author: data.payload.author,
            type: "chat",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { message: data.payload.message, author: "System", type: "system" },
        ]);
      }
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);
    socket.addEventListener("message", handleMessage);

    if (socket.readyState === WebSocket.OPEN) setIsConnected(true);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const handleSend = (msg: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (!username) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: { message: msg, author: username },
      })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative px-4">
      {/* Background glow */}
      <div className="absolute left-10 top-10 w-40 h-40 bg-green-500/20 blur-[90px] rounded-full"></div>
      <div className="absolute right-10 bottom-10 w-52 h-52 bg-green-400/20 blur-[120px] rounded-full"></div>

      <div
        className="flex flex-col justify-between bg-zinc-900/60 backdrop-blur-xl 
        px-5 pt-5 pb-4 rounded-2xl max-w-2xl w-full h-[80vh]
        border border-zinc-700 shadow-[0_0_25px_rgba(0,255,120,0.14)]"
      >
        <Header RoomId={roomId} />

        {!isConnected && (
          <div className="text-red-400 text-sm font-doto mb-2 animate-pulse">
            ⚠️ Connecting to server...
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto pr-1 mt-2">
          <div className="flex flex-col w-full min-h-full gap-1">
            {messages.map((msg, i) =>
              msg.type === "system" ? (
                <div
                  key={i}
                  className="text-center text-zinc-400 text-sm font-doto italic opacity-80 animate-fade"
                >
                  {msg.message}
                </div>
              ) : (
                <MessageBox
                  key={i}
                  message={msg.message}
                  author={msg.author}
                  isMe={msg.author === username}
                />
              )
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <Input
          placeholder="Type a message..."
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}

export default Dashboard;
