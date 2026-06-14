import { _decorator, Component, EventMouse, EventTouch, Node } from 'cc';

const { ccclass } = _decorator;

@ccclass('UiInputBlocker')
export class UiInputBlocker extends Component {
    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.stopTouchPropagation, this);
        this.node.on(Node.EventType.MOUSE_DOWN, this.stopMousePropagation, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.stopTouchPropagation, this);
        this.node.off(Node.EventType.MOUSE_DOWN, this.stopMousePropagation, this);
    }

    private stopTouchPropagation(event: EventTouch): void {
        event.propagationStopped = true;
    }

    private stopMousePropagation(event: EventMouse): void {
        event.propagationStopped = true;
    }
}