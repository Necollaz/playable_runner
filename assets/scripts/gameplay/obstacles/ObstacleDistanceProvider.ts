import { randomRange } from 'cc';

export class ObstacleDistanceProvider {
    
    readonly #minDistance: number;
    readonly #maxDistance: number;
    readonly #speed: number;
    readonly #minSpawnInterval: number;

    public constructor(
        minDistance: number,
        maxDistance: number,
        speed: number,
        minSpawnInterval: number,
    ) {
        this.#minDistance = minDistance;
        this.#maxDistance = maxDistance;
        this.#speed = speed;
        this.#minSpawnInterval = minSpawnInterval;
    }

    public getNextDistance(): number {
        const safeMinDistance = this.#speed * this.#minSpawnInterval;
        const actualMinDistance = Math.max(this.#minDistance, safeMinDistance);
        const actualMaxDistance = Math.max(this.#maxDistance, actualMinDistance);

        return randomRange(actualMinDistance, actualMaxDistance);
    }
}