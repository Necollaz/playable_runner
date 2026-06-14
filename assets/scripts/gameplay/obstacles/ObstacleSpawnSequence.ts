import { Node } from 'cc';
import { ObstacleDistanceProvider } from './ObstacleDistanceProvider';

export class ObstacleSpawnSequence {
    readonly #distanceProvider: ObstacleDistanceProvider;
    readonly #spawnZ: number;
    readonly #startObstacleCount: number;
    readonly #closestInitialObstacleZ: number;

    #latestSpawnedObstacle: Node | null = null;
    #latestSpawnZ = 0;
    #nextDistance = 0;

    public constructor(
        distanceProvider: ObstacleDistanceProvider,
        spawnZ: number,
        startObstacleCount: number,
        closestInitialObstacleZ: number,
    ) {
        this.#distanceProvider = distanceProvider;
        this.#spawnZ = spawnZ;
        this.#startObstacleCount = startObstacleCount;
        this.#closestInitialObstacleZ = closestInitialObstacleZ;
    }

    public createInitialSpawnPositions(): number[] {
        const positions: number[] = [];
        let nextSpawnZ = this.#spawnZ;

        for (let i = 0; i < this.#startObstacleCount; i++) {
            if (nextSpawnZ > this.#closestInitialObstacleZ)
                break;

            positions.push(nextSpawnZ);
            nextSpawnZ += this.#distanceProvider.getNextDistance();
        }

        return positions;
    }

    public setInitialAnchor(node: Node | null): void {
        this.#latestSpawnedObstacle = node;
        this.#latestSpawnZ = this.#spawnZ;
        this.#nextDistance = this.#distanceProvider.getNextDistance();
    }

    public shouldSpawnNext(): boolean {
        if (!this.#latestSpawnedObstacle)
            return false;

        const distanceFromLatestSpawn = this.#latestSpawnedObstacle.position.z - this.#latestSpawnZ;

        return distanceFromLatestSpawn >= this.#nextDistance;
    }

    public registerSpawned(node: Node): void {
        this.#latestSpawnedObstacle = node;
        this.#latestSpawnZ = this.#spawnZ;
        this.#nextDistance = this.#distanceProvider.getNextDistance();
    }
}