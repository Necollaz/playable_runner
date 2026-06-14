import { _decorator, Component, SkeletalAnimation } from 'cc';
import { PlayerState } from './PlayerState';

const { ccclass, property } = _decorator;

@ccclass('PlayerAnimationController')
export class PlayerAnimationController extends Component {
    @property(SkeletalAnimation) private animation: SkeletalAnimation | null = null;

    @property private idleClipName = 'Idle';
    @property private runClipName = 'Run';
    @property private jumpClipName = 'Jump';
    @property private fallClipName = 'Idle';

    #animationComponent!: SkeletalAnimation;
    #clipByState!: Record<PlayerState, string>;

    protected onLoad(): void {
        const animation = this.animation ?? this.getComponent(SkeletalAnimation);

        if (!animation)
            throw new Error('[PlayerAnimationController] SkeletalAnimation is not assigned or attached to Player.');

        this.#animationComponent = animation;
        this.#clipByState = this.createClipMap();
    }

    public play(state: PlayerState): void {
        this.playClip(this.#clipByState[state]);
    }

    private createClipMap(): Record<PlayerState, string> {
        return {
            [PlayerState.Idle]: this.idleClipName,
            [PlayerState.Run]: this.runClipName,
            [PlayerState.Jump]: this.jumpClipName,
            [PlayerState.Fall]: this.fallClipName,
        };
    }

    private playClip(clipName: string): void {
        this.#animationComponent.crossFade(clipName, 0.08);
    }
}