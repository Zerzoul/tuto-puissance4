import { freePositionY } from "../func/game";
import type { GameAction, GameContext } from "../types";

export const joinGameAction: GameAction<"join"> = (context, event) => ({
  players: [...context.players, {id: event.playerId, name: event.name}]
})

export const leaveGameAction: GameAction<"join"> = (context, event) => ({
  players: context.players.filter(p => p.id !== event.playerId)
})

// export const chooseColorGameAction: GameAction<"chooseColor"> = (context, event) => ({
//   players: [...context.players, {id: event.playerId, color: event.color}]
// })

export const dropToken: GameAction<"dropToken"> = ({grid, players}, {x: eventX, playerId}) => {
  const playerColor = players.find(p=>p.id === playerId)!.color!
  const eventY = freePositionY(grid, eventX)
  const newGrid = grid.map((row, y) => row.map((v, x) => x === eventX && y === eventY ? playerColor : v))
  return {
    grid: newGrid
  }
}

export const switchPlayerAction = (context: GameContext) => ({
  currentPlayer: context.players.find(p=>p.id !== context.currentPlayer)!.id
})