import { createModel } from 'xstate/lib/model'
import { GameStates, type GameContext, type GridState, type Player, type PlayerColor } from "../types"
import { canChooseColorGuard, canDropTokenGuard, canJoinGuard, canLeaveGuard, canStartGameGuard } from './guards'
import { dropToken, joinGameAction, leaveGameAction, switchPlayerAction } from './actions'
import { interpret, type InterpreterFrom } from 'xstate'



export const GameModel = createModel({
  players: [] as Player[],
  currentPlayer: null as null | Player['id'],
  rowLength: 4,
  grid:[
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"]
  ] as GridState,
}, {
  events:{
    join:(playerId: Player["id"], name: Player["name"]) => ({playerId, name}),
    leave:(playerId: Player["id"]) => ({playerId}),
    chooseColor:(playerId: Player["id"], color: PlayerColor) => ({playerId, color}),
    start:(playerId: Player["id"]) => ({playerId}),
    dropToken: (playerId: Player["id"], x: number) => ({playerId, x}),
    restart: (playerId: Player["id"]) => ({playerId})
  }
})

export const GameMachine = GameModel.createMachine({
  id: "game",
  initial: GameStates.LOBBY,
  context: GameModel.initialContext,
  states:{
    [GameStates.LOBBY]:{
      on: {
        join:{
          cond: canJoinGuard,
          actions: [GameModel.assign(joinGameAction)],
          target: GameStates.LOBBY
        },
        leave:{
          cond: canLeaveGuard,
          actions: [GameModel.assign(leaveGameAction)],
          target: GameStates.LOBBY
        },
        chooseColor:{
          cond: canChooseColorGuard,
          target: GameStates.LOBBY
        },
        start:{
          cond: canStartGameGuard,
          target: GameStates.PLAY
        }
      }
    },
    [GameStates.PLAY]:{
      on:{
        dropToken:{
          cond: canDropTokenGuard,
          target: GameStates.PLAY,
          actions: [
            GameModel.assign(dropToken),
            GameModel.assign(switchPlayerAction)]
        }
      }
    },
    [GameStates.DRAW]:{
      on:{
        restart:{
          target: GameStates.LOBBY
        }
      }
    },
    [GameStates.VICTORY]:{
      on:{
        restart:{
          target: GameStates.LOBBY
        }
      }
    }
  }
})

export function makeGame(state: GameStates = GameStates.LOBBY, context: Partial<GameContext> = {}): InterpreterFrom<typeof GameMachine> {
  const machine = interpret(
    GameMachine.withContext({
      ...GameModel.initialContext,
      ...context
    })
  ).start()
  machine.state.value = state
  return machine

}