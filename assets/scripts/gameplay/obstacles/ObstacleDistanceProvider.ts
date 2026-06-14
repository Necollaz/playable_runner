import { randomRange } from 'cc';

export class ObstacleDistanceProvider
{
    public constructor(
        private readonly minDistance: number,
        private readonly maxDistance: number,
        private readonly speed: number,
        private readonly minSpawnInterval: number,
    )
    {
    }

    public getNextDistance(): number
    {
        const safeMinDistance = this.speed * this.minSpawnInterval;
        const actualMinDistance = Math.max(this.minDistance, safeMinDistance);
        const actualMaxDistance = Math.max(this.maxDistance, actualMinDistance);

        return randomRange(actualMinDistance, actualMaxDistance);
    }
}