import { _decorator, Collider, Component, ITriggerEvent, Node, Vec3 } from 'cc';
import { PlayerCollisionMarker } from '../player/PlayerCollisionMarker';

const { ccclass } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component
{
    private readonly moveDirection = new Vec3(0, 0, 1);
    private readonly tempPosition = new Vec3();

    private collider: Collider | null = null;
    private passedHandler: ((obstacle: Obstacle) => void) | null = null;
    private hitHandler: ((obstacle: Obstacle) => void) | null = null;
    private despawnHandler: ((obstacle: Obstacle) => void) | null = null;

    private speed = 0;
    private passedZ = 0;
    private despawnZ = 0;
    private isMoving = false;
    private isPassed = false;
    private isHit = false;

    protected onLoad(): void
    {
        this.collider = this.getComponent(Collider);
    }

    protected onEnable(): void
    {
        this.collider?.on('onTriggerEnter', this.handleTriggerEnter, this);
    }

    protected onDisable(): void
    {
        this.collider?.off('onTriggerEnter', this.handleTriggerEnter, this);
    }

    protected update(deltaTime: number): void
    {
        if (!this.isMoving)
            return;

        this.node.getPosition(this.tempPosition);
        this.tempPosition.x += this.moveDirection.x * this.speed * deltaTime;
        this.tempPosition.z += this.moveDirection.z * this.speed * deltaTime;
        this.node.setPosition(this.tempPosition);

        if (!this.isHit && !this.isPassed && this.tempPosition.z >= this.passedZ)
        {
            this.isPassed = true;
            this.passedHandler?.(this);
        }

        if (this.tempPosition.z >= this.despawnZ)
            this.despawnHandler?.(this);
    }

    public initialize(
        speed: number,
        passedZ: number,
        despawnZ: number,
        onPassed: (obstacle: Obstacle) => void,
        onHit: (obstacle: Obstacle) => void,
        onDespawn: (obstacle: Obstacle) => void,
    ): void
    {
        this.speed = speed;
        this.passedZ = passedZ;
        this.despawnZ = despawnZ;
        this.passedHandler = onPassed;
        this.hitHandler = onHit;
        this.despawnHandler = onDespawn;
        this.isMoving = true;
        this.isPassed = false;
        this.isHit = false;
    }

    public stop(): void
    {
        this.isMoving = false;
        this.passedHandler = null;
        this.hitHandler = null;
        this.despawnHandler = null;
    }

    private handleTriggerEnter(event: ITriggerEvent): void
    {
        if (this.isHit || !this.isPlayer(event.otherCollider.node))
            return;

        this.isHit = true;
        this.hitHandler?.(this);
    }

    private isPlayer(node: Node): boolean
    {
        let currentNode: Node | null = node;

        while (currentNode)
        {
            if (currentNode.getComponent(PlayerCollisionMarker))
                return true;

            currentNode = currentNode.parent;
        }

        return false;
    }
}