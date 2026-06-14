import { _decorator, Component, UITransform, view, Widget } from 'cc';

const { ccclass, requireComponent } = _decorator;

@ccclass('FullscreenPanel')
@requireComponent(UITransform)
export class FullscreenPanel extends Component {
    #uiTransform!: UITransform;
    #panelWidget: Widget | null = null;

    protected onLoad(): void {
        const uiTransform = this.getComponent(UITransform);

        if (!uiTransform)
            throw new Error('[FullscreenPanel] UITransform is required.');

        this.#uiTransform = uiTransform;
        this.#panelWidget = this.getComponent(Widget);

        if (this.#panelWidget)
            this.#panelWidget.enabled = false;
    }

    protected onEnable(): void {
        view.on('canvas-resize', this.refresh, this);

        this.refresh();
        this.scheduleOnce(this.refresh, 0);
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.refresh, this);
    }

    public refresh(): void {
        const size = view.getDesignResolutionSize();

        this.#uiTransform.setContentSize(size.width, size.height);
        this.node.setPosition(0, 0, 0);

        this.scheduleOnce(this.updateChildWidgets, 0);
    }

    private updateChildWidgets(): void {
        for (const widget of this.getComponentsInChildren(Widget)) {
            if (!widget.enabledInHierarchy)
                continue;

            widget.updateAlignment();
        }
    }
}