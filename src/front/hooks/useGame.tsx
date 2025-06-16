import { createContext, useCallback, useContext, type PropsWithChildren } from "react";
import type { GameContext, GameEvent, GameEvents, GameStates, Player } from "../../types";
import { useMachine } from "@xstate/react";
import { GameMachine } from "../../machine/GameMachine";

type GameContextType = {
  state: GameStates,
  context: GameContext,
  send: <T extends GameEvents['type']>(event: {type: T, playerId?: string} & Omit<GameEvent<T>, 'playerId'>)=>void,
  can: <T extends GameEvents['type']>(event: {type: T, playerId?: string} & Omit<GameEvent<T>, 'playerId'>)=>boolean,
  playerId: Player["id"]
}

const Context = createContext<GameContextType>({} as any)

export function useGame(): GameContextType {
  return useContext(Context)
}

export function GameContextProvider({children}: PropsWithChildren){
  const [state, send] = useMachine(GameMachine);
  const playerId = state.context.currentPlayer ?? '';
  const sendWithPlayer = useCallback<GameContextType["send"]>((event)=>send({playerId, ...event} as GameEvents),[playerId])
  const can = useCallback<GameContextType["can"]>((event) => !!GameMachine.transition(state, {playerId, ...event} as GameEvents).changed, [playerId])
  return <Context.Provider value={{
    state: state.value as GameStates,
    context: state.context,
    playerId,
    send: sendWithPlayer,
    can: can,
  }}>
      {children}
    </Context.Provider>
}