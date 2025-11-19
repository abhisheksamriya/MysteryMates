import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createSocket, setUsername as setGlobalUsername } from "../socket";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    if (!roomId) return toast.error("Room ID is required");
    if (!username) return toast.error("Username is required");

    setGlobalUsername(username);
    createSocket(roomId, username);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-full">
      <Toaster />

      <h1 className="font-doto text-zinc-200 text-3xl mb-2 tracking-wide">
        Join Room
      </h1>

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full px-4 py-3 bg-zinc-800/70 border border-zinc-700 rounded-lg text-zinc-200 font-doto 
        focus:border-green-400 focus:outline-none transition-all shadow-inner"
      />

      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-3 bg-zinc-800/70 border border-zinc-700 rounded-lg text-zinc-200 font-doto 
        focus:border-green-400 focus:outline-none transition-all shadow-inner"
      />

      <button
        onClick={handleJoin}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500
        rounded-lg text-black font-doto font-semibold tracking-wide transition-all transform hover:scale-105 
        shadow-[0_0_20px_rgba(74,222,128,0.4)]"
      >
        Join Room
      </button>
    </div>
  );
};

export default Join;
