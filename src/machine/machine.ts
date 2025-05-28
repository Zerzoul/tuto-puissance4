import {createMachine} from "xstate"
import { createModel } from 'xstate/lib/model'
import type { GridState, Player } from "../types"

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
})

export const machine = createMachine({
  id: "game",
  initial: GameStates.LOBBY,
  context: GameModel,
  states:{
    [GameStates.LOBBY]:{
      on: {
        join:{
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
          target: "???"
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