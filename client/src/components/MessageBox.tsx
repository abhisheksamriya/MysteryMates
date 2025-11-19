type MessageBoxProps = {
  message: string;
  author?: string;
  isMe: boolean;
};

const MessageBox: React.FC<MessageBoxProps> = ({ message, author, isMe }) => {
  return (
    <div
      className={`max-w-[75%] break-words whitespace-pre-wrap px-4 py-3 rounded-xl font-doto 
        shadow-md transition-all ${
          isMe
            ? "bg-green-500/80 text-black font-bold ml-auto rounded-br-none shadow-[0_0_10px_rgba(0,255,120,0.3)]"
            : "bg-zinc-700 text-zinc-100 font-bold mr-auto rounded-bl-none"
        }`}
    >
      <div className="mb-1">{message}</div>
      <div
        className={`text-xs opacity-70 text-right ${
          isMe ? "text-black/80" : "text-zinc-300"
        }`}
      >
        {author}
      </div>
    </div>
  );
};

export default MessageBox;
