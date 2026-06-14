import { _decorator, Canvas, Camera, Component, UITransform, Vec3, view, Widget } from 'cc';

const { ccclass, requireComponent } = _decorator;

@ccclass('CanvasViewportSync')
@requireComponent(UITransform)
export class CanvasViewportSync extends Component
{
    private uiTransform: UITransform | null = null;
    private canvas: Canvas | null = null;
    private canvasWidget: Widget | null = null;
    private readonly worldPosition = new Vec3();

    protected onLoad(): void
    {
        this.uiTransform = this.getComponent(UITransform);
        this.canvas = this.getComponent(Canvas);
        this.canvasWidget = this.getComponent(Widget);

        if (this.canvasWidget)
            this.canvasWidget.enabled = false;

        this.sync();
    }

    protected onEnable(): void
    {
        view.on('canvas-resize', this.sync, this);

        this.sync();
        this.scheduleOnce(() => this.sync(), 0);
    }

    protected onDisable(): void
    {
        view.off('canvas-resize', this.sync, this);
    }

    public sync(): void
    {
        if (!this.uiTransform)
            return;

        const size = view.getDesignResolutionSize();

        this.uiTransform.setContentSize(size.width, size.height);
        this.node.setPosition(size.width * this.uiTransform.anchorX, size.height * this.uiTransform.anchorY, 0);
        this.syncCamera(size.height);
    }

    private syncCamera(height: number): void
    {
        const camera = this.canvas?.cameraComponent ?? this.getComponentInChildren(Camera);

        if (!camera)
            return;

        camera.orthoHeight = height / 2;

        this.node.getWorldPosition(this.worldPosition);
        camera.node.setWorldPosition(this.worldPosition.x, this.worldPosition.y, 1000);
    }
}