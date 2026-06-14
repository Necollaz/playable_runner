import { Node, Vec3 } from 'cc';
import { Obstacle } from './Obstacle';
import { ObstacleLifecycleHandlers } from './ObstacleLifecycleHandlers';
import { ObstacleMovementSettings } from './ObstacleMovementSettings';
import { ObstaclePool } from './ObstaclePool';

export class ObstacleFactory {
    readonly #pool: ObstaclePool;
    readonly #spawnPosition: Vec3;

    public constructor(pool: ObstaclePool, spawnPosition: Vec3) {
        this.#pool = pool;
        this.#spawnPosition = spawnPosition;
    }

    public create(
        zPosition: number,
        movementSettings: ObstacleMovementSettings,
        handlers: ObstacleLifecycleHandlers,
    ): Obstacle {
        const obstacleNode = this.#pool.get();

        obstacleNode.setPosition(this.#spawnPosition.x, this.#spawnPosition.y, zPosition);

        const obstacle = obstacleNode.getComponent(Obstacle);

        if (!obstacle)
            throw new Error('[ObstacleFactory] Obstacle prefab must contain Obstacle component.');

        obstacle.initialize(
            movementSettings.speed,
            movementSettings.passedZ,
            movementSettings.despawnZ,
            handlers.onPassed,
            handlers.onHit,
            handlers.onDespawn,
        );

        return obstacle;
    }
}