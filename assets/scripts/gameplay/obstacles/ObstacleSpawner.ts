import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
import { Obstacle } from './Obstacle';
import { ObstacleDistanceProvider } from './ObstacleDistanceProvider';
import { ObstaclePool } from './ObstaclePool';

const { ccclass, property } = _decorator;

@ccclass('ObstacleSpawner')
export class ObstacleSpawner extends Component
{
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

    private readonly activeObstacles: Obstacle[] = [];

    private pool: ObstaclePool | null = null;
    private distanceProvider: ObstacleDistanceProvider | null = null;
    private latestSpawnedObstacle: Node | null = null;
    private latestSpawnZ = 0;
    private nextDistance = 0;
    private obstaclePassedHandler: ((obstacle: Obstacle) => void) | null = null;
    private obstacleHitHandler: ((obstacle: Obstacle) => void) | null = null;

    protected start(): void
    {
        this.reset();
    }

    protected update(): void
    {
        if (!this.latestSpawnedObstacle)
            return;

        const distanceFromLatestSpawn = this.latestSpawnedObstacle.position.z - this.latestSpawnZ;

        if (distanceFromLatestSpawn >= this.nextDistance)
            this.spawnNextObstacle();
    }

    public reset(): void
    {
        this.createPoolIfNeeded();
        this.createDistanceProvider();
        this.clearObstacles();

        this.spawnInitialObstacles();
        this.nextDistance = this.getNextDistance();
    }

    public setMoving(value: boolean): void
    {
        for (const obstacle of this.activeObstacles)
        {
            if (value)
                this.initializeObstacle(obstacle);
            else
                obstacle.stop();
        }
    }

    public setObstaclePassedHandler(handler: ((obstacle: Obstacle) => void) | null): void
    {
        this.obstaclePassedHandler = handler;
    }

    public setObstacleHitHandler(handler: ((obstacle: Obstacle) => void) | null): void
    {
        this.obstacleHitHandler = handler;
    }

    private spawnInitialObstacles(): void
    {
        let nextSpawnZ = this.spawnZ;

        for (let i = 0; i < this.startObstacleCount; i++)
        {
            if (nextSpawnZ > this.closestInitialObstacleZ)
                break;

            const obstacleNode = this.spawnObstacleAt(nextSpawnZ);

            if (i === 0 && obstacleNode)
            {
                this.latestSpawnedObstacle = obstacleNode;
                this.latestSpawnZ = nextSpawnZ;
            }

            nextSpawnZ += this.getNextDistance();
        }

        if (!this.latestSpawnedObstacle)
            this.spawnNextObstacle();
    }

    private spawnNextObstacle(): void
    {
        const obstacleNode = this.spawnObstacleAt(this.spawnZ);

        if (!obstacleNode)
            return;

        this.latestSpawnedObstacle = obstacleNode;
        this.latestSpawnZ = this.spawnZ;
        this.nextDistance = this.getNextDistance();
    }

    private spawnObstacleAt(zPosition: number): Node | null
    {
        this.createPoolIfNeeded();

        if (!this.pool)
            return null;

        const obstacleNode = this.pool.get();

        obstacleNode.setPosition(this.spawnPosition.x, this.spawnPosition.y, zPosition);

        const obstacle = obstacleNode.getComponent(Obstacle);

        if (obstacle)
        {
            this.initializeObstacle(obstacle);
            this.activeObstacles.push(obstacle);
        }

        return obstacleNode;
    }

    private initializeObstacle(obstacle: Obstacle): void
    {
        obstacle.initialize(
            this.speed,
            this.passedZ,
            this.despawnZ,
            (passedObstacle) => this.obstaclePassedHandler?.(passedObstacle),
            (hitObstacle) => this.obstacleHitHandler?.(hitObstacle),
            (despawnedObstacle) => this.removeObstacle(despawnedObstacle),
        );
    }

    private removeObstacle(obstacle: Obstacle): void
    {
        const index = this.activeObstacles.indexOf(obstacle);

        if (index >= 0)
            this.activeObstacles.splice(index, 1);

        obstacle.stop();
        this.pool?.release(obstacle.node);
    }

    private clearObstacles(): void
    {
        for (const obstacle of this.activeObstacles)
        {
            obstacle.stop();
            this.pool?.release(obstacle.node);
        }

        this.activeObstacles.length = 0;
        this.latestSpawnedObstacle = null;
    }

    private createPoolIfNeeded(): void
    {
        if (this.pool || !this.obstaclePrefab)
            return;

        const parent = this.obstacleParent ?? this.node;

        this.pool = new ObstaclePool(this.obstaclePrefab, parent);
        this.pool.prewarm(this.initialPoolSize);
    }

    private createDistanceProvider(): void
    {
        this.distanceProvider = new ObstacleDistanceProvider(
            this.minDistance,
            this.maxDistance,
            this.speed,
            this.minSpawnInterval,
        );
    }

    private getNextDistance(): number
    {
        this.createDistanceProvider();

        return this.distanceProvider?.getNextDistance() ?? this.minDistance;
    }
}