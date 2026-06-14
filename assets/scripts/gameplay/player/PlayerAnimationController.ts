import { _decorator, Component, SkeletalAnimation } from 'cc';
import { PlayerState } from './PlayerState';

const { ccclass, property } = _decorator;

@ccclass('PlayerAnimationController')
export class PlayerAnimationController extends Component
{
    @property(SkeletalAnimation) private animation: SkeletalAnimation | null = null;

    @property private idleClipName = 'Idle';
    @property private runClipName = 'Run';
    @property private jumpClipName = 'Jump';

    protected onLoad(): void
    {
        this.animation = this.animation ?? this.getComponent(SkeletalAnimation);
    }

    public play(state: PlayerState): void
    {
        switch (state)
        {
            case PlayerState.Idle:
                this.playClip(this.idleClipName);
                break;

            case PlayerState.Run:
                this.playClip(this.runClipName);
                break;

            case PlayerState.Jump:
                this.playClip(this.jumpClipName);
                break;

            case PlayerState.Fall:
                this.playClip(this.idleClipName);
                break;
        }
    }

    private playClip(clipName: string): void
    {
        const animation = this.animation ?? this.getComponent(SkeletalAnimation);

        if (!animation)
            return;

        animation.crossFade(clipName, 0.08);
    }
}