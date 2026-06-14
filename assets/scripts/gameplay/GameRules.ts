import { GameProgress } from './GameProgress';

export class GameRules {
    readonly #progress: GameProgress;
    readonly #maxCollisionsBeforeFinal: number;

    public constructor(targetPassedObstacles: number, maxCollisionsBeforeFinal: number) {
        this.#progress = new GameProgress(targetPassedObstacles);
        this.#maxCollisionsBeforeFinal = maxCollisionsBeforeFinal;
    }

    public recordPassedObstacle(): boolean {
        return this.#progress.recordPassedObstacle();
    }

    public recordCollision(): boolean {
        return this.#progress.recordCollision() >= this.#maxCollisionsBeforeFinal;
    }

    public resetRunProgress(): void {
        this.#progress.resetRun();
    }
}