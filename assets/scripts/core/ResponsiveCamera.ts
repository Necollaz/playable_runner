import { _decorator, Camera, Component, screen, Vec3, view } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ResponsiveCamera')
export class ResponsiveCamera extends Component
{
    @property(Camera) private targetCamera: Camera | null = null;
    @property(Vec3) private portraitPosition = new Vec3(6, 10, 4.5);
    @property(Vec3) private portraitRotation = new Vec3(-45, 130, 0);
    @property private portraitFov = 45;
    @property(Vec3) private landscapePosition = new Vec3(7, 8, 7);
    @property(Vec3) private landscapeRotation = new Vec3(-40, 135, 0);
    @property private landscapeFov = 35;

    protected onLoad(): void 
    {
        this.applyCameraSettings();
    }

    protected start(): void
    {
        this.applyCameraSettings();
    }

    protected onEnable(): void
    {
        view.on('canvas-resize', this.applyCameraSettings, this);
    }

    protected onDisable(): void
    {
        view.off('canvas-resize', this.applyCameraSettings, this);
    }

    private applyCameraSettings(): void
    {
        const camera = this.targetCamera ?? this.getComponent(Camera);

        if (!camera)
            return;

        const windowSize = screen.windowSize;
        const isPortrait = windowSize.height > windowSize.width;

        if (isPortrait)
        {
            camera.node.setPosition(this.portraitPosition);
            camera.node.setRotationFromEuler(this.portraitRotation);
            camera.fov = this.portraitFov;
        }
        else
        {
            camera.node.setPosition(this.landscapePosition);
            camera.node.setRotationFromEuler(this.landscapeRotation);
            camera.fov = this.landscapeFov;
        }
    }
}