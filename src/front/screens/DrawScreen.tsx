import { Draw } from "../component/Draw";
import { useGame } from "../hooks/useGame";

type DrawProps = {}

export function DrawScreen ({}: DrawProps) {
  const {send} = useGame()
  const restart = () => send({type: 'restart'})
  return <div>
    <Draw onRestart={restart}/>
  </div>
}