import { _decorator, Component } from 'cc';
import { PlayerAnimationController } from './PlayerAnimationController';
import { PlayerJumpMovement } from './PlayerJumpMovement';
import { PlayerState } from './PlayerState';

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(PlayerAnimationController) private animationController: PlayerAnimationController | null = null;
    @property(PlayerJumpMovement) private jumpMovement: PlayerJumpMovement | null = null;

    #state = PlayerState.Idle;
    #animation!: PlayerAnimationController;
    #movement!: PlayerJumpMovement;

    protected onLoad(): void {
        const animation = this.animationController ?? this.getComponent(PlayerAnimationController);
        const movement = this.jumpMovement ?? this.getComponent(PlayerJumpMovement);

        if (!animation)
            throw new Error('[PlayerController] PlayerAnimationController is not assigned or attached to Player.');

        if (!movement)
            throw new Error('[PlayerController] PlayerJumpMovement is not assigned or attached to Player.');

        this.#animation = animation;
        this.#movement = movement;
    }

    public jump(): boolean {
        if (this.#state !== PlayerState.Run)
            return false;

        this.setState(PlayerState.Jump);

        this.#movement.jump(() => {
            if (this.#state === PlayerState.Jump)
                this.startRun();
        });

        return true;
    }

    public startRun(): void {
        this.setState(PlayerState.Run);
    }

    public fall(): void {
        if (this.#state === PlayerState.Fall)
            return;

        this.setState(PlayerState.Fall);
        this.#movement.fall();
    }

    public reset(): void {
        this.#movement.reset();
        this.setState(PlayerState.Run);
    }

    private setState(nextState: PlayerState): void {
        if (this.#state === nextState)
            return;

        this.#state = nextState;
        this.#animation.play(nextState);
    }
}