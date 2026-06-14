import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameplayHudView')
export class GameplayHudView extends Component
{
    @property(Node) private root: Node | null = null;

    public show(): void
    {
        this.getRoot().active = true;
    }

    public hide(): void
    {
        this.getRoot().active = false;
    }

    private getRoot(): Node
    {
        return this.root ?? this.node;
    }
}