import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="bg-background fixed top-0 z-50 w-full">
      <div className="container mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight ">
          e<span className="text-[hsl(280,100%,70%)]">N</span>ygma
        </h1>

        <nav>
          <ul className="flex gap-4 p-4">
            <li>home</li>
            <li>about</li>
            <li>contact</li>
            <li>projects </li>
            <li>maps</li>
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
