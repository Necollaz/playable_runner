import { _decorator, Component, EventMouse, EventTouch, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FinalScreenView')
export class FinalScreenView extends Component {
    @property(Node) private root: Node | null = null;

    #tapHandler: (() => void) | null = null;

    protected onLoad(): void {
        this.hide();
    }

    protected onEnable(): void {
        const root = this.getRoot();

        root.on(Node.EventType.TOUCH_START, this.handleTouch, this);
        root.on(Node.EventType.MOUSE_DOWN, this.handleMouse, this);
    }

    protected onDisable(): void {
        const root = this.getRoot();

        root.off(Node.EventType.TOUCH_START, this.handleTouch, this);
        root.off(Node.EventType.MOUSE_DOWN, this.handleMouse, this);
    }

    public show(): void {
        this.getRoot().active = true;
    }

    public hide(): void {
        this.getRoot().active = false;
    }

    public setTapHandler(handler: (() => void) | null): void {
        this.#tapHandler = handler;
    }

    private handleTouch(event: EventTouch): void {
        event.propagationStopped = true;
        this.#tapHandler?.();
    }

    private handleMouse(event: EventMouse): void {
        event.propagationStopped = true;
        this.#tapHandler?.();
    }

    private getRoot(): Node {
        return this.root ?? this.node;
    }
}