import { instantiate, Node, Prefab } from 'cc';

export class ObstaclePool
{
    private readonly inactiveNodes: Node[] = [];

    public constructor(private readonly prefab: Prefab, private readonly parent: Node,)
    {
    }

    public prewarm(count: number): void
    {
        for (let i = 0; i < count; i++)
        {
            const node = this.createNode();
            this.release(node);
        }
    }

    public get(): Node
    {
        const node = this.inactiveNodes.pop() ?? this.createNode();

        if (node.parent !== this.parent)
            node.setParent(this.parent);

        node.active = true;

        return node;
    }

    public release(node: Node): void
    {
        if (this.inactiveNodes.includes(node))
            return;

        if (node.parent !== this.parent)
            node.setParent(this.parent);

        node.active = false;
        this.inactiveNodes.push(node);
    }

    private createNode(): Node
    {
        const node = instantiate(this.prefab);
        node.setParent(this.parent);

        return node;
    }
}