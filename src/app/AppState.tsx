import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";
import { ReactNode, createContext, useReducer } from "react";
import { GetFieldType } from "./types/helpers";

export interface Toast {
  id: string;
  message: string;
  type: string;
}

export interface IAppState {
  toasts: Toast[];
  vault?: {
    points: number;
    loading: boolean;
  };
  leaderboard?: {
    position?: number;
    totalPositions?: number;
    loading: boolean;
  };
}

interface Definitions {
  set<TPath extends string, TValue extends GetFieldType<IAppState, TPath>>(
    object: Record<TPath, TValue>
  ): void;
  set<TPath extends string, TValue extends GetFieldType<IAppState, TPath>>(
    path: TPath,
    value?: TValue
  ): void;
}

type SetState = Definitions["set"];

interface StateContextProps {
  state: IAppState;
  setState: SetState;
}

export const initialState: IAppState = {
  toasts: [],
};

export const StateContext = createContext<StateContextProps>({
  state: initialState as any,
  setState: () => {},
});

function stateReducer(state: IAppState, action: Record<string, any>) {
  const newState = cloneDeep(state);
  Object.keys(action).forEach((path) => {
    const value = action[path];
    if (path === "toast") {
      const toast = { message: value, id: Date.now() };
      set(newState, "toasts", [...newState.toasts, toast]);
    } else {
      set(newState, path, value);
    }
  });
  return newState;
}

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useReducer(stateReducer, {
    ...initialState,
  });

  return (
    <StateContext.Provider value={{ state, setState: setState as SetState }}>
      {children}
    </StateContext.Provider>
  );
};
