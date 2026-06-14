import { _decorator, Component } from 'cc';
import { Obstacle } from './obstacles/Obstacle';
import { ObstacleSpawner } from './obstacles/ObstacleSpawner';
import { PlayerController } from './player/PlayerController';
import { PlayerInputReader } from './player/PlayerInputReader';
import { RedirectService } from '../services/RedirectService';
import { FinalScreenView } from '../ui/FinalScreenView';
import { GameplayHudView } from '../ui/GameplayHudView';
import { GameProgress } from './GameProgress';
import { GameState } from './GameState';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component
{
    @property(PlayerController) private playerController: PlayerController | null = null;
    @property(PlayerInputReader) private inputReader: PlayerInputReader | null = null;
    @property(ObstacleSpawner) private obstacleSpawner: ObstacleSpawner | null = null;
    @property(GameplayHudView) private gameplayHudView: GameplayHudView | null = null;
    @property(FinalScreenView) private finalScreenView: FinalScreenView | null = null;
    @property(RedirectService) private redirectService: RedirectService | null = null;

    @property private targetPassedObstacles = 5;
    @property private maxCollisionsBeforeFinal = 2;
    @property private restartDelay = 0.8;

    private state = GameState.IntroReady;
    private progress: GameProgress | null = null;

    protected onLoad(): void
    {
        this.progress = new GameProgress(this.targetPassedObstacles);
        this.finalScreenView?.hide();
    }

    protected onEnable(): void
    {
        this.inputReader?.setTapHandler(() => this.handleGameplayTap());
        this.finalScreenView?.setTapHandler(() => this.handleFinalTap());
        this.obstacleSpawner?.setObstaclePassedHandler((obstacle) => this.handleObstaclePassed(obstacle));
        this.obstacleSpawner?.setObstacleHitHandler((obstacle) => this.handleObstacleHit(obstacle));
    }

    protected onDisable(): void
    {
        this.inputReader?.setTapHandler(null);
        this.finalScreenView?.setTapHandler(null);
        this.obstacleSpawner?.setObstaclePassedHandler(null);
        this.obstacleSpawner?.setObstacleHitHandler(null);
        this.unschedule(this.restartLevel);
    }

    protected start(): void
    {
        this.enterPlaying();
    }

    private handleGameplayTap(): void
    {
        if (this.state !== GameState.Playing)
            return;

        this.playerController?.jump();
    }

    private handleFinalTap(): void
    {
        if (this.state !== GameState.Final)
            return;

        this.enterRedirecting();
    }

    private handleObstaclePassed(_obstacle: Obstacle): void
    {
        if (this.state !== GameState.Playing || !this.progress)
            return;

        if (this.progress.recordPassedObstacle())
            this.enterFinal();
    }

    private handleObstacleHit(_obstacle: Obstacle): void
    {
        if (this.state !== GameState.Playing || !this.progress)
            return;

        const collisions = this.progress.recordCollision();

        this.playerController?.fall();
        this.obstacleSpawner?.setMoving(false);

        if (collisions >= this.maxCollisionsBeforeFinal)
        {
            this.enterFinal();
            
            return;
        }

        this.enterRestarting();
    }

    private enterPlaying(): void
    {
        this.state = GameState.Playing;

        this.gameplayHudView?.show();
        this.finalScreenView?.hide();
        this.inputReader?.setInputEnabled(true);
        this.playerController?.reset();
        this.obstacleSpawner?.reset();
        this.obstacleSpawner?.setMoving(true);
    }

    private enterRestarting(): void
    {
        this.state = GameState.Restarting;

        this.inputReader?.setInputEnabled(false);
        this.progress?.resetRun();

        this.scheduleOnce(this.restartLevel, this.restartDelay);
    }

    private restartLevel(): void
    {
        if (this.state !== GameState.Restarting)
            return;

        this.enterPlaying();
    }

    private enterFinal(): void
    {
        this.state = GameState.Final;

        this.unschedule(this.restartLevel);
        this.gameplayHudView?.hide();
        this.inputReader?.setInputEnabled(false);
        this.obstacleSpawner?.setMoving(false);
        this.finalScreenView?.show();
    }

    private enterRedirecting(): void
    {
        this.state = GameState.Redirecting;

        this.inputReader?.setInputEnabled(false);
        this.redirectService?.redirect();
    }
}