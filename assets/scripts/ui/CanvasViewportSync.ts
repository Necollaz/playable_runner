import { _decorator, Canvas, Camera, Component, UITransform, Vec3, view, Widget } from 'cc';

const { ccclass, requireComponent } = _decorator;

@ccclass('CanvasViewportSync')
@requireComponent(UITransform)
export class CanvasViewportSync extends Component {
    readonly #worldPosition = new Vec3();
    
    #uiTransform!: UITransform;
    #canvas!: Canvas;
    #canvasWidget: Widget | null = null;

    protected onLoad(): void {
        const uiTransform = this.getComponent(UITransform);
        const canvas = this.getComponent(Canvas);

        if (!uiTransform)
            throw new Error('[CanvasViewportSync] UITransform is required.');

        if (!canvas)
            throw new Error('[CanvasViewportSync] Canvas is required. Add this script to Canvas node.');

        this.#uiTransform = uiTransform;
        this.#canvas = canvas;
        this.#canvasWidget = this.getComponent(Widget);

        if (this.#canvasWidget)
            this.#canvasWidget.enabled = false;

        this.sync();
    }

    protected onEnable(): void {
        view.on('canvas-resize', this.sync, this);

        this.sync();
        this.scheduleOnce(this.sync, 0);
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.sync, this);
    }

    public sync(): void {
        const size = view.getDesignResolutionSize();

        this.#uiTransform.setContentSize(size.width, size.height);
        this.node.setPosition(size.width * this.#uiTransform.anchorX, size.height * this.#uiTransform.anchorY, 0);

        this.syncCamera(size.height);
        this.scheduleOnce(this.updateChildWidgets, 0);
    }

    private syncCamera(height: number): void {
        const camera = this.#canvas.cameraComponent ?? this.getComponentInChildren(Camera);

        if (!camera)
            throw new Error('[CanvasViewportSync] UI Camera is not assigned.');

        camera.orthoHeight = height / 2;

        this.node.getWorldPosition(this.#worldPosition);
        camera.node.setWorldPosition(this.#worldPosition.x, this.#worldPosition.y, 1000);
    }

    private updateChildWidgets(): void {
        for (const widget of this.getComponentsInChildren(Widget)) {
            if (!widget.enabledInHierarchy)
                continue;

            widget.updateAlignment();
        }
    }
}