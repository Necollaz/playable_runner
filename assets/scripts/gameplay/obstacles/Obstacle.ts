import { _decorator, Component, Vec3 } from 'cc';

const { ccclass } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component
{
    private readonly moveDirection = new Vec3(0, 0, 1);
    private readonly tempPosition = new Vec3();
    
    private despawnHandler: ((obstacle: Obstacle) => void) | null = null;
    private speed = 0;
    private despawnZ = 0;
    private isMoving = false;

    protected update(deltaTime: number): void
    {
        if (!this.isMoving)
            return;

        this.node.getPosition(this.tempPosition);
        this.tempPosition.x += this.moveDirection.x * this.speed * deltaTime;
        this.tempPosition.z += this.moveDirection.z * this.speed * deltaTime;
        this.node.setPosition(this.tempPosition);

        if (this.tempPosition.z >= this.despawnZ)
            this.despawnHandler?.(this);
    }
    
    public initialize(speed: number, despawnZ: number, onDespawn: (obstacle: Obstacle) => void): void
    {
        this.speed = speed;
        this.despawnZ = despawnZ;
        this.despawnHandler = onDespawn;
        this.isMoving = true;
    }

    public stop(): void
    {
        this.isMoving = false;
        this.despawnHandler = null;
    }
}