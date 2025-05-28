import { createModel } from 'xstate/lib/model'
import type { GridState, Player, PlayerColor } from "../types"
import { canJoinGuard } from './guards'
import { joinGameAction } from './actions'

enum GameStates {
  LOBBY = "LOBBY",
  PLAY = "PLAY",
  VICTORY = "VICTORY",
  DRAW = "DRAW"
}

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
    leave:(playerID: Player["id"]) => ({playerID}),
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
          target: GameStates.LOBBY
        },
        chooseColor:{
          target: GameStates.LOBBY
        },
        start:{
          target: GameStates.PLAY
        }
      }
    },
    [GameStates.PLAY]:{
      on:{
        dropToken:{
          target: GameStates.VICTORY
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