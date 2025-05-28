import {createMachine} from "xstate"

enum GameStates {
  LOBBY = "LOBBY",
  PLAY = "PLAY",
  VICTORY = "VICTORY",
  DRAW = "DRAW"
}
export const machine = createMachine({
  id: "game",
  initial: GameStates.LOBBY,
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