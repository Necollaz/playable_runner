import { GameDependencies } from './GameDependencies';

export class GameSceneController {
    readonly #dependencies: GameDependencies;

    public constructor(dependencies: GameDependencies) {
        this.#dependencies = dependencies;
    }

    public enterPlaying(): void {
        this.#dependencies.gameplayHudView.show();
        this.#dependencies.finalScreenView.hide();
        this.#dependencies.inputReader.setInputEnabled(true);
        this.#dependencies.playerController.reset();
        this.#dependencies.obstacleSpawner.reset();
        this.#dependencies.obstacleSpawner.setMoving(true);
    }

    public enterRestarting(): void {
        this.#dependencies.inputReader.setInputEnabled(false);
    }

    public enterFinal(): void {
        this.#dependencies.gameplayHudView.hide();
        this.#dependencies.inputReader.setInputEnabled(false);
        this.#dependencies.obstacleSpawner.setMoving(false);
        this.#dependencies.finalScreenView.show();
    }

    public enterRedirecting(): void {
        this.#dependencies.inputReader.setInputEnabled(false);
        this.#dependencies.redirectService.redirect();
    }

    public jump(): void {
        this.#dependencies.playerController.jump();
    }

    public fallAndStopObstacles(): void {
        this.#dependencies.playerController.fall();
        this.#dependencies.obstacleSpawner.setMoving(false);
    }

    public hideFinalScreen(): void {
        this.#dependencies.finalScreenView.hide();
    }
}