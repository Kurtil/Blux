export default class MainScenePause extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScenePause' });
    }

    create() {
        const textPaddingX = 20;
        const textPaddingY = 10;

        const pauseText = this.add
            .bitmapText(
                (this.game.config.width as number) / 2, this.game.config.height as number / 2,
                'nokia-white',
                'Pause',
                36)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        this.add.rectangle(
            pauseText.x,
            pauseText.y,
            pauseText.width + textPaddingX * 2,
            pauseText.height + textPaddingY * 2,
            0x000000
        );

        this.add.rectangle(0, 0, this.game.config.width as number, this.game.config.height as number, 0x333333, 0.5)
            .setScale(this.scene.get('mainScene').cameras.main.zoom);

        this.input.keyboard.once('keydown-P', () => {
            this.scene.resume('mainScene');
            this.scene.resume('mainSceneHUD');
            this.scene.get('mainScene').sound.resumeAll();
            this.scene.get('mainScene').input.keyboard.resetKeys();
            this.scene.stop();
        });
    }
}