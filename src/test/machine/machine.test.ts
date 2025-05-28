import {beforeEach, describe, expect, it} from "vitest"
import { interpret, type InterpreterFrom } from "xstate"
import { GameMachine, GameModel } from "../../machine/GameMachine"


describe("machine/GameMachine", () => {

  describe("join", () => {
    let machine: InterpreterFrom<typeof GameMachine>

    beforeEach(() => {
      machine = interpret(GameMachine).start()
    })
    it('Should let a player join', () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true)
      expect(machine.state.context.players.join).toHaveLength(1)
      expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true)
      expect(machine.state.context.players.join).toHaveLength(2)
    })

    it('Should not let me join a game twice', () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true)
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(false)
    })

  })
})