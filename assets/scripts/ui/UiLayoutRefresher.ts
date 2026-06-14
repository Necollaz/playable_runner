import { _decorator, Component, view, Widget } from 'cc';
import { FullscreenPanel } from './FullscreenPanel';

const { ccclass } = _decorator;

@ccclass('UiLayoutRefresher')
export class UiLayoutRefresher extends Component {
    protected onEnable(): void {
        view.on('canvas-resize', this.refresh, this);

        this.refresh();
        this.scheduleOnce(() => this.refresh(), 0);
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.refresh, this);
    }

    public refresh(): void {
        for (const panel of this.getComponentsInChildren(FullscreenPanel))
            panel.refresh();

        this.scheduleOnce(() => this.refreshWidgets(), 0);
    }

    private refreshWidgets(): void {
        for (const widget of this.getComponentsInChildren(Widget)) {
            if (!widget.enabledInHierarchy)
                continue;

            widget.updateAlignment();
        }
    }
}