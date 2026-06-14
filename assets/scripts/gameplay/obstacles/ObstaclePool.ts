import { instantiate, Node, Prefab } from 'cc';

export class ObstaclePool {
    readonly #prefab: Prefab;
    readonly #inactiveNodes: Node[] = [];
    readonly #parent: Node;

    public constructor(prefab: Prefab, parent: Node) {
        this.#prefab = prefab;
        this.#parent = parent;
    }

    public prewarm(count: number): void {
        for (let i = 0; i < count; i++) {
            const node = this.createNode();
            this.release(node);
        }
    }

    public get(): Node {
        const node = this.#inactiveNodes.pop() ?? this.createNode();

        if (node.parent !== this.#parent)
            node.setParent(this.#parent);

        node.active = true;

        return node;
    }

    public release(node: Node): void {
        if (this.#inactiveNodes.indexOf(node) >= 0)
            return;

        if (node.parent !== this.#parent)
            node.setParent(this.#parent);

        node.active = false;
        this.#inactiveNodes.push(node);
    }

    private createNode(): Node {
        const node = instantiate(this.#prefab);
        node.setParent(this.#parent);

        return node;
    }
}