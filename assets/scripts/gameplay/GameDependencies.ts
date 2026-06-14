import { ObstacleSpawner } from './obstacles/ObstacleSpawner';
import { PlayerController } from './player/PlayerController';
import { PlayerInputReader } from './player/PlayerInputReader';
import { RedirectService } from '../services/RedirectService';
import { FinalScreenView } from '../ui/FinalScreenView';
import { GameplayHudView } from '../ui/GameplayHudView';

export type GameDependencies = {
    playerController: PlayerController;
    inputReader: PlayerInputReader;
    obstacleSpawner: ObstacleSpawner;
    gameplayHudView: GameplayHudView;
    finalScreenView: FinalScreenView;
    redirectService: RedirectService;
};