import { _decorator, Component } from 'cc';
import { PlayerAnimationController } from './PlayerAnimationController';
import { PlayerJumpMovement } from './PlayerJumpMovement';
import { PlayerState } from './PlayerState';

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component
{
    @property(PlayerAnimationController) private animationController: PlayerAnimationController | null = null;
    @property(PlayerJumpMovement) private jumpMovement: PlayerJumpMovement | null = null;

    private state = PlayerState.Idle;

    protected onLoad(): void
    {
        this.animationController = this.animationController ?? this.getComponent(PlayerAnimationController);
        this.jumpMovement = this.jumpMovement ?? this.getComponent(PlayerJumpMovement);
    }

    public jump(): boolean
    {
        if (this.state !== PlayerState.Run || !this.jumpMovement)
            return false;

        this.setState(PlayerState.Jump);

        this.jumpMovement.jump(() =>
        {
            if (this.state === PlayerState.Jump)
                this.startRun();
        });

        return true;
    }

    public startRun(): void
    {
        this.setState(PlayerState.Run);
    }

    public fall(): void
    {
        if (this.state === PlayerState.Fall)
            return;

        this.setState(PlayerState.Fall);
        this.jumpMovement?.fall();
    }

    public reset(): void
    {
        this.jumpMovement?.reset();
        this.setState(PlayerState.Run);
    }

    private setState(nextState: PlayerState): void
    {
        if (this.state === nextState)
            return;

        this.state = nextState;
        this.animationController?.play(nextState);
    }
}