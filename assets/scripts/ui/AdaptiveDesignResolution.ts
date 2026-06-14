import { _decorator, Component, ResolutionPolicy, screen, view } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AdaptiveDesignResolution')
export class AdaptiveDesignResolution extends Component {
    @property private landscapeBaseHeight = 720;
    @property private portraitBaseWidth = 1280;

    #appliedWidth = 0;
    #appliedHeight = 0;

    protected onLoad(): void {
        this.applyResolution();
    }

    protected onEnable(): void {
        view.on('canvas-resize', this.applyResolution, this);

        this.applyResolution();
        this.scheduleOnce(() => this.applyResolution(), 0);
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.applyResolution, this);
    }

    private applyResolution(): void {
        const windowSize = screen.windowSize;

        if (windowSize.width <= 0 || windowSize.height <= 0)
            return;

        if (windowSize.height > windowSize.width) {
            const width = this.portraitBaseWidth;
            const height = width * windowSize.height / windowSize.width;

            this.applyDesignResolution(width, height, ResolutionPolicy.FIXED_WIDTH);
            return;
        }

        const height = this.landscapeBaseHeight;
        const width = height * windowSize.width / windowSize.height;

        this.applyDesignResolution(width, height, ResolutionPolicy.FIXED_HEIGHT);
    }

    private applyDesignResolution(width: number, height: number, policy: number): void {
        if (this.isSameSize(width, height))
            return;

        this.#appliedWidth = width;
        this.#appliedHeight = height;

        view.setDesignResolutionSize(width, height, policy);
    }

    private isSameSize(width: number, height: number): boolean {
        return Math.abs(this.#appliedWidth - width) < 0.5 && Math.abs(this.#appliedHeight - height) < 0.5;
    }
}