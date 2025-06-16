import type { CSSProperties } from "react"
import type { CellState, GridState, PlayerColor, Position } from "../../types"
import { discColorClass } from "../../func/color"
import { prevent } from "../../func/dom"

type GridProps = {
  grid: GridState,
  color?: PlayerColor,
  onDrop?: (x: number) => void,
  winingPositions: Position[]
}

export function Grid({grid, color, onDrop, winingPositions}: GridProps) {
  const cols = grid[0].length
  const showColums = color && onDrop
  const isWining = (x:number, y:number) => !!winingPositions.find(p=>p.x === x && p.y === y)
  return <>
    <div className="grid" style={{'--rows': grid.length, '--cols': cols} as CSSProperties}>
      {grid.map((row, y) => row.map((c, x) => <Cell 
      active={isWining(x, y)}
      x={x} y={y} color={c} key={`${x}-${y}`}/>))}
      { showColums && <div className="columns">
        { new Array(cols).fill(1).map((_, k)=><Column onDrop={()=>onDrop(k)} color={color} key={k}/> )}
      </div> }
    </div>
  </>
}

type CellProps = {
  x: number,
  y: number,
  color: CellState,
  active: boolean
}

function Cell({y, color, active}: CellProps) {
  return <div 
    style={{'--row': y} as CSSProperties}
    className={discColorClass(color) + (active ? ' disc-active' : '' )}
  />
}
type ColumnPros = {
  color: PlayerColor,
  onDrop: () => void
}
function Column ({color, onDrop}: ColumnPros) {
  return <button onClick={prevent(onDrop)} className="column">
    <div className={discColorClass(color)}></div>
  </button>
}