import { _decorator, Component, EventMouse, EventTouch, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerInputReader')
export class PlayerInputReader extends Component
{
    @property(Node) private inputRoot: Node | null = null;
    @property private acceptInput = true;

    private tapHandler: (() => void) | null = null;

    protected onEnable(): void
    {
        const root = this.getInputRoot();

        root.on(Node.EventType.TOUCH_START, this.handleInput, this);
        root.on(Node.EventType.MOUSE_DOWN, this.handleInput, this);
    }

    protected onDisable(): void
    {
        const root = this.getInputRoot();

        root.off(Node.EventType.TOUCH_START, this.handleInput, this);
        root.off(Node.EventType.MOUSE_DOWN, this.handleInput, this);
    }

    public setInputEnabled(value: boolean): void
    {
        this.acceptInput = value;
    }

    public setTapHandler(handler: (() => void) | null): void
    {
        this.tapHandler = handler;
    }

    private handleInput(_event: EventTouch | EventMouse): void
    {
        if (!this.acceptInput || !this.tapHandler)
            return;

        this.tapHandler();
    }

    private getInputRoot(): Node
    {
        return this.inputRoot ?? this.node;
    }
}