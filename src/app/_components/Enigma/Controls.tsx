import { ChevronDown } from "lucide-react";

import Tooltip from "../Tooltip";
import type { Modules } from "~/data/types";
import { controls } from "~/store/StateManager";
import { cn } from "~/lib/utils";

export default function Controls({ modName }: { modName: Modules }) {
  return (
    <div className="flex w-full justify-between gap-4">
      {/*    
      <button
        onClick={() => {
          controls.value = {
            ...controls.value,
            [modName]: {
              ...controls.value[modName],
              show: !controls.value[modName].show,
            },
          };
        }}
      >
        {controls.value[modName].show ? <Eye /> : <EyeOff />}
      </button> */}

      <h2 className="enigma-header">{modName}</h2>

      <div className="flex items-center gap-2">
        <Tooltip tooltip={modName} />
        <button
          onClick={() => {
            controls.value = {
              ...controls.value,
              [modName]: {
                ...controls.value[modName],
                active: !controls.value[modName].active,
              },
            };
          }}
          className={cn(
            "transform cursor-pointer transition duration-200 ease-in-out",
            controls.value[modName].active ? "rotate-180" : "rotate-0",
          )}
        >
          <ChevronDown />
        </button>
      </div>
    </div>
  );
}
