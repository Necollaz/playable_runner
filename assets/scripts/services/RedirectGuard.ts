export class RedirectGuard {
    readonly #cooldownMilliseconds: number;

    #lockedUntilMilliseconds = 0;

    public constructor(cooldownSeconds: number) {
        this.#cooldownMilliseconds = cooldownSeconds * 1000;
    }

    public tryLock(): boolean {
        const now = Date.now();

        if (now < this.#lockedUntilMilliseconds)
            return false;

        this.#lockedUntilMilliseconds = now + this.#cooldownMilliseconds;

        return true;
    }
}