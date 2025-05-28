import type { ContextFrom } from "xstate"
import type { GameModel } from "./machine/machine"

export enum PlayerColor {
  RED = "red",
  YELLOW = "yellow"
}
export type Player = {
  id: string,
  name: string,
  color?: PlayerColor
}
export type CellEmpty = "E"
export type CellState = PlayerColor.RED | PlayerColor.YELLOW | CellEmpty
export type GridState = CellState[][]
export type GameContext = ContextFrom<typeof GameModel>
