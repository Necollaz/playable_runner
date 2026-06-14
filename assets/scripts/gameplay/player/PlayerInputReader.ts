import { _decorator, Component, Input, input } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerInputReader')
export class PlayerInputReader extends Component
{
    @property private acceptInput = true;

    private jumpRequestedHandler: (() => void) | null = null;

    protected onEnable(): void
    {
        input.on(Input.EventType.TOUCH_START, this.handleInput, this);
        input.on(Input.EventType.MOUSE_DOWN, this.handleInput, this);
    }

    protected onDisable(): void
    {
        input.off(Input.EventType.TOUCH_START, this.handleInput, this);
        input.off(Input.EventType.MOUSE_DOWN, this.handleInput, this);
    }

    public setInputEnabled(value: boolean): void
    {
        this.acceptInput = value;
    }

    public setJumpRequestedHandler(handler: (() => void) | null): void
    {
        this.jumpRequestedHandler = handler;
    }

    private handleInput(): void
    {
        if (!this.acceptInput || !this.jumpRequestedHandler)
            return;

        this.jumpRequestedHandler();
    }
}