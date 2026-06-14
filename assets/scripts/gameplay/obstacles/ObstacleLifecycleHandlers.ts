import { Obstacle } from './Obstacle';

export type ObstacleLifecycleHandlers = {
    onPassed: (obstacle: Obstacle) => void;
    onHit: (obstacle: Obstacle) => void;
    onDespawn: (obstacle: Obstacle) => void;
};