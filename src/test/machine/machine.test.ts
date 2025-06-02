import {beforeEach, describe, expect, it} from "vitest"
import { interpret, type InterpreterFrom } from "xstate"
import { GameMachine, GameModel, makeGame } from "../../machine/GameMachine"
import { PlayerColor, GameStates } from "../../types"
import { canDropTokenGuard, canLeaveGuard } from "../../machine/guards"


describe("machine/GameMachine", () => {

  describe("join", () => {
    let machine: InterpreterFrom<typeof GameMachine>

    beforeEach(() => {
      machine = interpret(GameMachine).start()
    })
    it('Should let a player join', () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true)
      expect(machine.state.context.players).toHaveLength(1)
      expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true)
      expect(machine.state.context.players).toHaveLength(2)
    })

    it('Should not let me join a game twice', () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true)
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(false)
    })

    it('Should let me leave', () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true)
      expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true)
      expect(machine.send(GameModel.events.leave("1")).changed).toBe(true)
    })
  })

  describe("dropToken", () => {
    const machine = makeGame(GameStates.PLAY, {
      players: [{
        id: '1',
        name: '1',
        color: PlayerColor.RED
      }, {
        id: '2',
        name: '2',
        color: PlayerColor.YELLOW
      }],
      currentPlayer: '1',
      rowLength: 0,
      grid: [
        ["E", "E", "E", "E", "E", "E", "R"],
        ["E", "E", "E", "E", "E", "R", "Y"],
        ["E", "E", "E", "E", "E", "R", "R"],
        ["E", "E", "E", "E", "E", "R", "Y"],
        ["E", "E", "E", "E", "E", "Y", "R"],
        ["E", "E", "E", "E", "E", "Y", "Y"]
      ]
    }) 

    it("should let me drop a token", () => {
      expect(machine.send(GameModel.events.dropToken("1", 0)).changed).toBe(true)
      expect(machine.state.context.grid[5][0]).toBe(PlayerColor.RED)
      expect(machine.state.value).toBe(GameStates.PLAY)
      expect(machine.state.context.currentPlayer).toBe("2")
    })

    it("should not let me drop a token on filled column", () => {
      expect(machine.send(GameModel.events.dropToken("1", 6)).changed).toBe(false)
    })

    it("should make me win", () => {
      expect(machine.send(GameModel.events.dropToken("1", 5)).changed).toBe(true)
      expect(machine.state.value).toBe(GameStates.VICTORY)
    })
  })
})