import Create from "../components/Create";
import Join from "../components/Join";

function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500 rounded-full opacity-5 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-500 rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>

      <div className="flex justify-between flex-col md:flex-row bg-zinc-900/60 backdrop-blur-xl p-10 rounded-2xl max-w-3xl w-full border border-zinc-700 shadow-[0_0_20px_rgba(0,255,100,0.15)] gap-10">
        <Join />

        <div className="w-[1px] bg-zinc-700/50"></div>

        <Create />
      </div>
    </div>
  );
}

export default Signup;
