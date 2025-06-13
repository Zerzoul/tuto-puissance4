import { discColorClass } from "../../func/color"
import type { PlayerColor } from "../../types"

type PlayScreenProps = {
  color: PlayerColor,
  name: string
}

export function GameInfo({color, name}: PlayScreenProps) {
  return <>
    <h2 className="flex" style={{gap:' .5rem'}}>Au tour du joueur {name}<div className={discColorClass(color)}></div> de jouer </h2>
  </>
}