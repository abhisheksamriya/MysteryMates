import { useNavigate } from "react-router-dom";
import { disconnect } from "../socket";

const Header = ({ RoomId }: { RoomId: string | null }) => {
  const navigate = useNavigate();

  const handleExit = () => {
    disconnect();
    navigate("/");
  };

  return (
    <div
      className="flex items-center justify-between bg-zinc-800/70 border border-zinc-700 
      px-4 py-3 rounded-xl shadow-inner"
    >
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Logo"
          className="size-9 rounded-md shadow-md"
        />

        <h1 className="text-lg md:text-xl text-green-400 font-doto tracking-wider">
          Room: {RoomId}
        </h1>
      </div>

      <button
        onClick={handleExit}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500
          text-white px-4 py-2 rounded-lg font-doto font-semibold transition-all 
          shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:scale-105"
      >
        Exit
      </button>
    </div>
  );
};

export default Header;
