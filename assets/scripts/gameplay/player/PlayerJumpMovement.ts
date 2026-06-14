import { _decorator, Component, Tween, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

type TweenProgress = {
    progress: number;
};

@ccclass('PlayerJumpMovement')
export class PlayerJumpMovement extends Component
{
    @property(Vec3) private fallEuler = new Vec3(-75, 180, 0);
    @property private jumpHeight = 1.35;
    @property private jumpDuration = 0.62;
    @property private fallDuration = 0.25;

    private readonly startEuler = new Vec3();
    private readonly fallStartEuler = new Vec3();
    private readonly tempEuler = new Vec3();
    private readonly tempPosition = new Vec3();
    
    private groundY = 0;
    private jumpProgress: TweenProgress | null = null;
    private fallProgress: TweenProgress | null = null;
    
    protected onLoad(): void
    {
        this.groundY = this.node.position.y;
        this.startEuler.set(this.node.eulerAngles);
    }

    protected onDisable(): void
    {
        this.stopJump();
        this.stopFall();
    }

    public jump(onCompleted: () => void): void
    {
        this.stopJump();

        const progressTarget: TweenProgress = { progress: 0 };
        this.jumpProgress = progressTarget;

        tween(progressTarget).to(this.jumpDuration, { progress: 1 },
            {
                easing: 'linear',
                onUpdate: () =>
                {
                    const height = Math.sin(progressTarget.progress * Math.PI) * this.jumpHeight;
                    this.setHeight(this.groundY + height);
                },
            }).call(() =>
            {
                this.jumpProgress = null;
                this.setHeight(this.groundY);
                onCompleted();
            }).start();
    }

    public fall(): void
    {
        this.stopJump();
        this.stopFall();
        this.setHeight(this.groundY);

        this.fallStartEuler.set(this.node.eulerAngles);

        const progressTarget: TweenProgress = { progress: 0 };
        this.fallProgress = progressTarget;

        tween(progressTarget)
            .to(this.fallDuration, { progress: 1 }, {
                easing: 'quadOut',
                onUpdate: () =>
                {
                    this.tempEuler.set(
                        this.lerp(this.fallStartEuler.x, this.fallEuler.x, progressTarget.progress),
                        this.lerp(this.fallStartEuler.y, this.fallEuler.y, progressTarget.progress),
                        this.lerp(this.fallStartEuler.z, this.fallEuler.z, progressTarget.progress),
                    );

                    this.node.setRotationFromEuler(this.tempEuler);
                },
            })
            .call(() =>
            {
                this.fallProgress = null;
            })
            .start();
    }

    public reset(): void
    {
        this.stopJump();
        this.stopFall();

        this.setHeight(this.groundY);
        this.node.setRotationFromEuler(this.startEuler);
    }

    private setHeight(y: number): void
    {
        this.node.getPosition(this.tempPosition);
        this.tempPosition.y = y;
        this.node.setPosition(this.tempPosition);
    }

    private stopJump(): void
    {
        if (!this.jumpProgress)
            return;

        Tween.stopAllByTarget(this.jumpProgress);
        this.jumpProgress = null;
    }

    private stopFall(): void
    {
        if (!this.fallProgress)
            return;

        Tween.stopAllByTarget(this.fallProgress);
        this.fallProgress = null;
    }

    private lerp(from: number, to: number, progress: number): number
    {
        return from + (to - from) * progress;
    }
}