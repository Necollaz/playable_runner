import { _decorator, Camera, Component, Node, screen, Vec3, view } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FollowCamera')
export class FollowCamera extends Component {
    @property(Camera) private targetCamera: Camera | null = null;
    @property(Node) private target: Node | null = null;

    @property(Vec3) private portraitOffset = new Vec3(6, 10, 4.5);
    @property(Vec3) private portraitRotation = new Vec3(-55, 130, 0);
    @property(Vec3) private landscapeOffset = new Vec3(20, 25, -10);
    @property(Vec3) private landscapeRotation = new Vec3(-40, 135, 0);
    
    @property private portraitFov = 45;
    @property private landscapeFov = 35;
    @property private lookAtTarget = true;

    readonly #targetPosition = new Vec3();
    readonly #cameraPosition = new Vec3();

    protected onEnable(): void {
        view.on('canvas-resize', this.applyCameraSettings, this);
        this.applyCameraSettings();
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.applyCameraSettings, this);
    }

    protected lateUpdate(): void {
        if (!this.target)
            return;

        const camera = this.targetCamera ?? this.getComponent(Camera);
        const cameraNode = camera ? camera.node : this.node;
        const offset = this.getCurrentOffset();

        this.target.getWorldPosition(this.#targetPosition);
        this.#cameraPosition.set(
            this.#targetPosition.x + offset.x,
            this.#targetPosition.y + offset.y,
            this.#targetPosition.z + offset.z,
        );

        cameraNode.setWorldPosition(this.#cameraPosition);

        if (this.lookAtTarget)
            cameraNode.lookAt(this.#targetPosition);
    }
    
    private getCurrentOffset(): Vec3 {
        return this.isPortrait() ? this.portraitOffset : this.landscapeOffset;
    }

    private isPortrait(): boolean {
        const windowSize = screen.windowSize;

        return windowSize.height > windowSize.width;
    }
    
    private applyCameraSettings(): void {
        const camera = this.targetCamera ?? this.getComponent(Camera);

        if (!camera)
            return;

        camera.fov = this.isPortrait() ? this.portraitFov : this.landscapeFov;

        if (!this.lookAtTarget)
            camera.node.setRotationFromEuler(this.isPortrait() ? this.portraitRotation : this.landscapeRotation);
    }
}