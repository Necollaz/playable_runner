import { _decorator, Component, screen, Size, UITransform, view, Widget } from 'cc';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('OrientationUiSize')
@requireComponent(UITransform)
export class OrientationUiSize extends Component {
    @property(Size) private landscapeSize = new Size(220, 101);
    @property(Size) private portraitSize = new Size(180, 83);

    #uiTransform: UITransform | null = null;
    #widget: Widget | null = null;

    protected onLoad(): void {
        this.#uiTransform = this.getComponent(UITransform);
        this.#widget = this.getComponent(Widget);
    }

    protected onEnable(): void {
        view.on('canvas-resize', this.refresh, this);

        this.refresh();
        this.scheduleOnce(() => this.refresh(), 0);
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.refresh, this);
    }

    public refresh(): void {
        this.applySize();
        this.scheduleOnce(() => this.updateWidget(), 0);
    }

    private applySize(): void {
        const size = this.isPortrait() ? this.portraitSize : this.landscapeSize;

        this.#uiTransform?.setContentSize(size.width, size.height);
    }

    private updateWidget(): void {
        this.#widget?.updateAlignment();
    }

    private isPortrait(): boolean {
        const windowSize = screen.windowSize;

        return windowSize.height > windowSize.width;
    }
}