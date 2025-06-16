import { currentPlayer } from "../func/game"
import { GameStates } from "../types"
import { Grid } from "./component/Grid"
import { useGame } from "./hooks/useGame"
import { DrawScreen } from "./screens/DrawScreen"
import { LobbyScreen } from "./screens/LobbyScreen"
import { PlayScreen } from "./screens/PlayScreen"
import { VictoryScreen } from "./screens/VictoryScreen"

function App() {
  const {state, context, send} = useGame()

  const canDropToken = state === GameStates.PLAY
  const player = canDropToken ? currentPlayer(context) : undefined
  const dropTopken = canDropToken ? (x: number) => {
    send({type: 'dropToken', x: x})
  } : undefined

  return (
    <div className="container">
      {state === GameStates.LOBBY && <LobbyScreen />}
      {state === GameStates.PLAY && <PlayScreen />}
      {state === GameStates.VICTORY && <VictoryScreen />}
      {state === GameStates.DRAW && <DrawScreen />}
      <Grid winingPositions={context.winingPositions} grid={context.grid} onDrop={dropTopken} color={player?.color}/>
    </div>
  )
}

export default App

