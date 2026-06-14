import { Obstacle } from './Obstacle';
import { ObstaclePool } from './ObstaclePool';

export class ActiveObstacleList {
    readonly #obstacles: Obstacle[] = [];
    readonly #pool: ObstaclePool;

    public constructor(pool: ObstaclePool) {
        this.#pool = pool;
    }

    public add(obstacle: Obstacle): void {
        this.#obstacles.push(obstacle);
    }

    public remove(obstacle: Obstacle): void {
        const index = this.#obstacles.indexOf(obstacle);

        if (index >= 0)
            this.#obstacles.splice(index, 1);

        obstacle.stop();
        this.#pool.release(obstacle.node);
    }

    public clear(): void {
        for (const obstacle of this.#obstacles) {
            obstacle.stop();
            this.#pool.release(obstacle.node);
        }

        this.#obstacles.length = 0;
    }

    public setMoving(value: boolean, initializeObstacle: (obstacle: Obstacle) => void): void {
        for (const obstacle of this.#obstacles) {
            if (value)
                initializeObstacle(obstacle);
            else
                obstacle.stop();
        }
    }
}