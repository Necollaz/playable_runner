export class GameProgress {
    readonly #targetPassedObstacles: number;
    
    #passedObstacles = 0;
    #collisions = 0;

    public constructor(targetPassedObstacles: number) {
        this.#targetPassedObstacles = targetPassedObstacles;
    }

    public recordPassedObstacle(): boolean {
        this.#passedObstacles++;

        return this.#passedObstacles >= this.#targetPassedObstacles;
    }

    public recordCollision(): number {
        this.#collisions++;

        return this.#collisions;
    }

    public resetRun(): void {
        this.#passedObstacles = 0;
    }
}