import { _decorator, Component, Node, UITransform, Widget } from 'cc';

const { ccclass, requireComponent } = _decorator;

@ccclass('FullscreenPanel')
@requireComponent(UITransform)
export class FullscreenPanel extends Component
{
    private uiTransform: UITransform | null = null;
    private panelWidget: Widget | null = null;

    protected onLoad(): void
    {
        this.uiTransform = this.getComponent(UITransform);
        this.panelWidget = this.getComponent(Widget);

        if (this.panelWidget)
            this.panelWidget.enabled = false;
    }

    protected onEnable(): void
    {
        this.refresh();
        this.scheduleOnce(() => this.refresh(), 0);
    }

    public refresh(): void
    {
        this.applyParentSize();
        this.scheduleOnce(() => this.updateChildWidgets(), 0);
    }

    private applyParentSize(): void
    {
        const parentTransform = this.node.parent?.getComponent(UITransform);

        if (!parentTransform)
            return;

        const size = parentTransform.contentSize;

        this.uiTransform?.setContentSize(size.width, size.height);
        this.node.setPosition(0, 0, 0);
    }

    private updateChildWidgets(): void
    {
        this.updateWidgetsRecursive(this.node);
    }

    private updateWidgetsRecursive(root: Node): void
    {
        for (const child of root.children)
        {
            child.getComponent(Widget)?.updateAlignment();
            this.updateWidgetsRecursive(child);
        }
    }
}