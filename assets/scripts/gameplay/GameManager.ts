import { _decorator, Component } from 'cc';
import { Obstacle } from './obstacles/Obstacle';
import { ObstacleSpawner } from './obstacles/ObstacleSpawner';
import { PlayerController } from './player/PlayerController';
import { PlayerInputReader } from './player/PlayerInputReader';
import { RedirectService } from '../services/RedirectService';
import { FinalScreenView } from '../ui/FinalScreenView';
import { GameplayHudView } from '../ui/GameplayHudView';
import { GameDependencies } from './GameDependencies';
import { GameRules } from './GameRules';
import { GameSceneController } from './GameSceneController';
import { GameState } from './GameState';
import { GameStateMachine } from './GameStateMachine';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(PlayerController) private playerController: PlayerController | null = null;
    @property(PlayerInputReader) private inputReader: PlayerInputReader | null = null;
    @property(ObstacleSpawner) private obstacleSpawner: ObstacleSpawner | null = null;
    @property(GameplayHudView) private gameplayHudView: GameplayHudView | null = null;
    @property(FinalScreenView) private finalScreenView: FinalScreenView | null = null;
    @property(RedirectService) private redirectService: RedirectService | null = null;

    @property private targetPassedObstacles = 5;
    @property private maxCollisionsBeforeFinal = 2;
    @property private restartDelay = 0.8;

    #dependencies: GameDependencies | null = null;
    #stateMachine!: GameStateMachine;
    #rules!: GameRules;
    #sceneController!: GameSceneController;

    readonly #restartHandler = (): void => this.restartLevel();

    protected onLoad(): void {
        this.#dependencies = this.createDependencies();
        this.#stateMachine = new GameStateMachine();
        this.#rules = new GameRules(this.targetPassedObstacles, this.maxCollisionsBeforeFinal);
        this.#sceneController = new GameSceneController(this.#dependencies);

        this.#sceneController.hideFinalScreen();
    }

    protected onEnable(): void {
        const dependencies = this.getDependencies();

        dependencies.inputReader.setTapHandler(() => this.handleGameplayTap());
        dependencies.finalScreenView.setTapHandler(() => this.handleFinalTap());
        dependencies.obstacleSpawner.setObstaclePassedHandler((obstacle) => 
            this.handleObstaclePassed(obstacle));
        dependencies.obstacleSpawner.setObstacleHitHandler((obstacle) =>
            this.handleObstacleHit(obstacle));
    }

    protected onDisable(): void {
        if (!this.#dependencies)
            return;

        this.#dependencies.inputReader.setTapHandler(null);
        this.#dependencies.finalScreenView.setTapHandler(null);
        this.#dependencies.obstacleSpawner.setObstaclePassedHandler(null);
        this.#dependencies.obstacleSpawner.setObstacleHitHandler(null);

        this.unschedule(this.#restartHandler);
    }

    protected start(): void {
        this.enterPlaying();
    }

    private handleGameplayTap(): void {
        if (!this.#stateMachine.is(GameState.Playing))
            return;

        this.#sceneController.jump();
    }

    private handleFinalTap(): void {
        if (!this.#stateMachine.is(GameState.Final))
            return;

        this.enterRedirecting();
    }

    private handleObstaclePassed(_obstacle: Obstacle): void {
        if (!this.#stateMachine.is(GameState.Playing))
            return;

        if (this.#rules.recordPassedObstacle())
            this.enterFinal();
    }

    private handleObstacleHit(_obstacle: Obstacle): void {
        if (!this.#stateMachine.is(GameState.Playing))
            return;

        this.#sceneController.fallAndStopObstacles();

        if (this.#rules.recordCollision()) {
            this.enterFinal();
            return;
        }

        this.enterRestarting();
    }

    private enterPlaying(): void {
        this.#stateMachine.enter(GameState.Playing);
        this.#sceneController.enterPlaying();
    }

    private enterRestarting(): void {
        this.#stateMachine.enter(GameState.Restarting);
        this.#sceneController.enterRestarting();
        this.#rules.resetRunProgress();

        this.scheduleOnce(this.#restartHandler, this.restartDelay);
    }

    private restartLevel(): void {
        if (!this.#stateMachine.is(GameState.Restarting))
            return;

        this.enterPlaying();
    }

    private enterFinal(): void {
        this.unschedule(this.#restartHandler);

        this.#stateMachine.enter(GameState.Final);
        this.#sceneController.enterFinal();
    }

    private enterRedirecting(): void {
        this.#stateMachine.enter(GameState.Redirecting);
        this.#sceneController.enterRedirecting();
    }

    private createDependencies(): GameDependencies {
        return {
            playerController: this.requireReference(this.playerController, 'Player Controller'),
            inputReader: this.requireReference(this.inputReader, 'Input Reader'),
            obstacleSpawner: this.requireReference(this.obstacleSpawner, 'Obstacle Spawner'),
            gameplayHudView: this.requireReference(this.gameplayHudView, 'Gameplay Hud View'),
            finalScreenView: this.requireReference(this.finalScreenView, 'Final Screen View'),
            redirectService: this.requireReference(this.redirectService, 'Redirect Service'),
        };
    }

    private getDependencies(): GameDependencies {
        if (!this.#dependencies)
            throw new Error('[GameManager] Dependencies are not initialized.');

        return this.#dependencies;
    }

    private requireReference<T>(reference: T | null, propertyName: string): T {
        if (reference)
            return reference;

        throw new Error(`[GameManager] ${propertyName} is not assigned in Cocos Inspector.`);
    }
}