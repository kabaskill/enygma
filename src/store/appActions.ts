import { enigmaState } from "./core";
import { initialState } from "./core";

// Application-wide actions
export const appActions = {
  reset(): void {
    enigmaState.value = { ...initialState };
  }
};