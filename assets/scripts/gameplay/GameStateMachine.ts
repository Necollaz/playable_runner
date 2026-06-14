import { GameState } from './GameState';

export class GameStateMachine {
    #state = GameState.IntroReady;

    public get state(): GameState {
        return this.#state;
    }

    public is(state: GameState): boolean {
        return this.#state === state;
    }

    public enter(state: GameState): void {
        this.#state = state;
    }
}