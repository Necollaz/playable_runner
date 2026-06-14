import { _decorator, Component } from 'cc';
import { PlayerAnimationController } from './PlayerAnimationController';
import { PlayerInputReader } from './PlayerInputReader';
import { PlayerJumpMovement } from './PlayerJumpMovement';
import { PlayerState } from './PlayerState';

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component
{
    @property(PlayerAnimationController) private animationController: PlayerAnimationController | null = null;
    @property(PlayerJumpMovement) private jumpMovement: PlayerJumpMovement | null = null;
    @property(PlayerInputReader) private inputReader: PlayerInputReader | null = null;

    private state = PlayerState.Idle;
    private jumpStartedHandler: (() => void) | null = null;
    private fallStartedHandler: (() => void) | null = null;

    public get currentState(): PlayerState
    {
        return this.state;
    }

    protected onLoad(): void
    {
        this.animationController = this.animationController ?? this.getComponent(PlayerAnimationController);
        this.jumpMovement = this.jumpMovement ?? this.getComponent(PlayerJumpMovement);
        this.inputReader = this.inputReader ?? this.getComponent(PlayerInputReader);
    }

    protected onEnable(): void
    {
        this.inputReader?.setJumpRequestedHandler(() => this.jump());
    }

    protected onDisable(): void
    {
        this.inputReader?.setJumpRequestedHandler(null);
    }

    protected start(): void
    {
        this.startRun();
    }

    public setInputEnabled(value: boolean): void
    {
        this.inputReader?.setInputEnabled(value);
    }

    public setJumpStartedHandler(handler: (() => void) | null): void
    {
        this.jumpStartedHandler = handler;
    }

    public setFallStartedHandler(handler: (() => void) | null): void
    {
        this.fallStartedHandler = handler;
    }

    public startRun(): void
    {
        if (this.state === PlayerState.Fall)
            return;

        this.setState(PlayerState.Run);
        this.setInputEnabled(true);
    }

    public jump(): boolean
    {
        if (this.state !== PlayerState.Run || !this.jumpMovement)
            return false;

        this.setState(PlayerState.Jump);
        this.jumpStartedHandler?.();

        this.jumpMovement.jump(() =>
        {
            if (this.state === PlayerState.Jump)
                this.startRun();
        });

        return true;
    }

    public fall(): void
    {
        if (this.state === PlayerState.Fall)
            return;

        this.setInputEnabled(false);
        this.setState(PlayerState.Fall);
        this.fallStartedHandler?.();
        this.jumpMovement?.fall();
    }

    public reset(): void
    {
        this.jumpMovement?.reset();
        this.setInputEnabled(true);
        this.startRun();
    }

    private setState(nextState: PlayerState): void
    {
        if (this.state === nextState)
            return;

        this.state = nextState;
        this.animationController?.play(nextState);
    }
}