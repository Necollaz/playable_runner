import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
import { ActiveObstacleList } from './ActiveObstacleList';
import { Obstacle } from './Obstacle';
import { ObstacleDistanceProvider } from './ObstacleDistanceProvider';
import { ObstacleFactory } from './ObstacleFactory';
import { ObstacleLifecycleHandlers } from './ObstacleLifecycleHandlers';
import { ObstacleMovementSettings } from './ObstacleMovementSettings';
import { ObstaclePool } from './ObstaclePool';
import { ObstacleSpawnSequence } from './ObstacleSpawnSequence';

const { ccclass, property } = _decorator;

@ccclass('ObstacleSpawner')
export class ObstacleSpawner extends Component {
    @property(Prefab) private obstaclePrefab: Prefab | null = null;
    @property(Node) private obstacleParent: Node | null = null;
    @property(Vec3) private spawnPosition = new Vec3(0, 0.35, -18);

    @property private speed = 3.5;
    @property private spawnZ = -18;
    @property private passedZ = 1;
    @property private despawnZ = 15;
    @property private minDistance = 7;
    @property private maxDistance = 11;
    @property private minSpawnInterval = 2;
    @property private startObstacleCount = 3;
    @property private closestInitialObstacleZ = -6;
    @property private initialPoolSize = 6;

    #pool!: ObstaclePool;
    #factory!: ObstacleFactory;
    #activeObstacles!: ActiveObstacleList;
    #spawnSequence!: ObstacleSpawnSequence;

    #obstaclePassedHandler: ((obstacle: Obstacle) => void) | null = null;
    #obstacleHitHandler: ((obstacle: Obstacle) => void) | null = null;

    protected onLoad(): void {
        this.createRuntimeObjects();
    }

    protected start(): void {
        this.reset();
    }

    protected update(): void {
        if (!this.#spawnSequence.shouldSpawnNext())
            return;

        this.spawnNextObstacle();
    }

    public reset(): void {
        this.#activeObstacles.clear();
        this.#spawnSequence = this.createSpawnSequence();

        const initialPositions = this.#spawnSequence.createInitialSpawnPositions();
        let firstSpawnedNode: Node | null = null;

        for (const position of initialPositions) {
            const obstacle = this.spawnObstacleAt(position);

            firstSpawnedNode ??= obstacle.node;
        }

        if (firstSpawnedNode) {
            this.#spawnSequence.setInitialAnchor(firstSpawnedNode);
            return;
        }

        this.spawnNextObstacle();
    }

    public setMoving(value: boolean): void {
        this.#activeObstacles.setMoving(value, (obstacle) => this.initializeObstacle(obstacle));
    }

    public setObstaclePassedHandler(handler: ((obstacle: Obstacle) => void) | null): void {
        this.#obstaclePassedHandler = handler;
    }

    public setObstacleHitHandler(handler: ((obstacle: Obstacle) => void) | null): void {
        this.#obstacleHitHandler = handler;
    }

    private createRuntimeObjects(): void {
        if (!this.obstaclePrefab)
            throw new Error('[ObstacleSpawner] Obstacle Prefab is not assigned in Cocos Inspector.');

        const parent = this.obstacleParent ?? this.node;

        this.#pool = new ObstaclePool(this.obstaclePrefab, parent);
        this.#pool.prewarm(this.initialPoolSize);

        this.#factory = new ObstacleFactory(this.#pool, this.spawnPosition);
        this.#activeObstacles = new ActiveObstacleList(this.#pool);
        this.#spawnSequence = this.createSpawnSequence();
    }

    private spawnNextObstacle(): void {
        const obstacle = this.spawnObstacleAt(this.spawnZ);

        this.#spawnSequence.registerSpawned(obstacle.node);
    }

    private spawnObstacleAt(zPosition: number): Obstacle {
        const obstacle = this.#factory.create(
            zPosition,
            this.getMovementSettings(),
            this.getLifecycleHandlers(),
        );

        this.#activeObstacles.add(obstacle);

        return obstacle;
    }

    private initializeObstacle(obstacle: Obstacle): void {
        const movementSettings = this.getMovementSettings();
        const handlers = this.getLifecycleHandlers();

        obstacle.initialize(
            movementSettings.speed,
            movementSettings.passedZ,
            movementSettings.despawnZ,
            handlers.onPassed,
            handlers.onHit,
            handlers.onDespawn,
        );
    }

    private getMovementSettings(): ObstacleMovementSettings {
        return {
            speed: this.speed,
            passedZ: this.passedZ,
            despawnZ: this.despawnZ,
        };
    }

    private getLifecycleHandlers(): ObstacleLifecycleHandlers {
        return {
            onPassed: (obstacle) => this.#obstaclePassedHandler?.(obstacle),
            onHit: (obstacle) => this.#obstacleHitHandler?.(obstacle),
            onDespawn: (obstacle) => this.#activeObstacles.remove(obstacle),
        };
    }

    private createSpawnSequence(): ObstacleSpawnSequence {
        return new ObstacleSpawnSequence(
            this.createDistanceProvider(),
            this.spawnZ,
            this.startObstacleCount,
            this.closestInitialObstacleZ,
        );
    }

    private createDistanceProvider(): ObstacleDistanceProvider {
        return new ObstacleDistanceProvider(
            this.minDistance,
            this.maxDistance,
            this.speed,
            this.minSpawnInterval,
        );
    }
}