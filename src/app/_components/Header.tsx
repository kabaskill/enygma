import Tooltip from "./Tooltip";

export default function Header() {
  return (
    <header className="text-center py-8 flex gap-4 justify-center">
      <h1 className="text-5xl font-bold tracking-widest text-amber-300 relative inline-block">
        <span className="relative z-10">ENIGMA</span> 
        <div className="absolute inset-0 bg-zinc-600 blur-sm transform -skew-y-1 z-0"></div>
      </h1>
      <Tooltip tooltip="header"/>
    </header>
  );
}
