import { reset } from "~/store/StateManager";

export default function Reset() {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <button
        onClick={reset}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Reset Machine
      </button>
    </div>
  );
}
