export default class MainScenePause extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScenePause' });
    }

    create() {
        const pauseText = this.add.text((this.game.config.width as number) / 2, this.game.config.height as number / 2, 'Pause', {
            font: "24px monospace",
            fill: "#ffffff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000000"
        })
            .setDepth(30)
            .setScrollFactor(0)
            .setOrigin(0.5, 0.5);

        this.add.rectangle(0, 0, this.game.config.width as number, this.game.config.height as number, 0x333333, 0.5)
            .setScale(this.scene.get('mainScene').cameras.main.zoom);

        this.input.keyboard.once('keydown-P', () => {
            this.scene.resume('mainScene');
            this.scene.get('mainScene').sound.resumeAll();
            this.scene.get('mainScene').input.keyboard.resetKeys();
            this.scene.stop();
        });
    }
}