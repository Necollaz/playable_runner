export class GameProgress
{
    private passedObstacles = 0;
    private collisions = 0;

    public constructor(private readonly targetPassedObstacles: number)
    {
    }

    public recordPassedObstacle(): boolean
    {
        this.passedObstacles++;

        return this.passedObstacles >= this.targetPassedObstacles;
    }

    public recordCollision(): number
    {
        this.collisions++;

        return this.collisions;
    }

    public resetRun(): void
    {
        this.passedObstacles = 0;
    }

    public resetAll(): void
    {
        this.passedObstacles = 0;
        this.collisions = 0;
    }
}