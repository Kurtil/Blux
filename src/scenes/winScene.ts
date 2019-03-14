export default class WinScene extends Phaser.Scene {

    private keySpace: Phaser.Input.Keyboard.Key = null;
    private nextScene = 'startMenuScene';

    constructor() {
        super({
            key: "winScene"
        });
    }

    create() {
        this.add
            .text(
                // TODO find a way to get the width of the text to replace 135 Magic Number
                (<number>this.game.config.width) * 0.5 - 100,
                (<number>this.game.config.height) * 0.5,
                'You won !',
                {
                    font: "18px monospace",
                    fill: "#ffffff",
                });

        this.time.addEvent({ delay: 2000, callback: () => this.scene.start(this.nextScene) });
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.sound.play("victory");
    }

    update() {
        if (this.keySpace.isDown) {
            this.scene.start(this.nextScene);
        }
    }
}