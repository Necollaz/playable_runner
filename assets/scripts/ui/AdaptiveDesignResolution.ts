import { _decorator, Canvas, Camera, Component, ResolutionPolicy, screen, UITransform, Vec3, view, Widget } from 'cc';
import { FullscreenPanel } from './FullscreenPanel';

const { ccclass, property } = _decorator;

@ccclass('AdaptiveDesignResolution')
export class AdaptiveDesignResolution extends Component
{
    @property private landscapeBaseHeight = 720;
    @property private portraitBaseWidth = 1280;

    private uiTransform: UITransform | null = null;
    private canvas: Canvas | null = null;
    private canvasWidget: Widget | null = null;
    private readonly worldPosition = new Vec3();
    private appliedWidth = 0;
    private appliedHeight = 0;

    protected onLoad(): void
    {
        this.uiTransform = this.getComponent(UITransform);
        this.canvas = this.getComponent(Canvas);
        this.canvasWidget = this.getComponent(Widget);

        if (this.canvasWidget)
            this.canvasWidget.enabled = false;

        this.applyResolution();
    }

    protected onEnable(): void
    {
        view.on('canvas-resize', this.applyResolution, this);

        this.applyResolution();
        this.scheduleOnce(() => this.applyResolution(), 0);
    }

    protected onDisable(): void
    {
        view.off('canvas-resize', this.applyResolution, this);
    }

    private applyResolution(): void
    {
        const windowSize = screen.windowSize;

        if (windowSize.width <= 0 || windowSize.height <= 0)
            return;

        if (this.isPortrait(windowSize.width, windowSize.height))
        {
            const width = this.portraitBaseWidth;
            const height = width * windowSize.height / windowSize.width;

            this.applyDesignResolution(width, height, ResolutionPolicy.FIXED_WIDTH);

            return;
        }

        const height = this.landscapeBaseHeight;
        const width = this.landscapeBaseHeight * windowSize.width / windowSize.height;

        this.applyDesignResolution(width, height, ResolutionPolicy.FIXED_HEIGHT);
    }

    private isPortrait(width: number, height: number): boolean
    {
        return height > width;
    }

    private applyDesignResolution(width: number, height: number, policy: number): void
    {
        if (!this.isSameSize(width, height))
        {
            this.appliedWidth = width;
            this.appliedHeight = height;
            view.setDesignResolutionSize(width, height, policy);
        }

        this.applyCanvasSize(width, height);
    }

    private applyCanvasSize(width: number, height: number): void
    {
        if (!this.uiTransform)
            return;

        this.uiTransform.setContentSize(width, height);
        this.node.setPosition(width * this.uiTransform.anchorX, height * this.uiTransform.anchorY, 0);

        this.updateCanvasCamera(height);
        this.updateFullscreenPanels();
        this.updateWidgets();
    }

    private updateCanvasCamera(height: number): void
    {
        const camera = this.canvas?.cameraComponent ?? this.getComponentInChildren(Camera);

        if (!camera)
            return;

        camera.orthoHeight = height / 2;

        this.node.getWorldPosition(this.worldPosition);
        camera.node.setWorldPosition(this.worldPosition.x, this.worldPosition.y, 1000);
    }

    private updateFullscreenPanels(): void
    {
        for (const panel of this.getComponentsInChildren(FullscreenPanel))
            panel.refresh();
    }

    private updateWidgets(): void
    {
        for (const widget of this.getComponentsInChildren(Widget))
        {
            if (widget === this.canvasWidget)
                continue;

            widget.updateAlignment();
        }
    }

    private isSameSize(width: number, height: number): boolean
    {
        return Math.abs(this.appliedWidth - width) < 0.5 && Math.abs(this.appliedHeight - height) < 0.5;
    }
}
