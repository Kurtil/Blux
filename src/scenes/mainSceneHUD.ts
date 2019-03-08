import MainScene from "./mainScene";

export default class MainSceneHUD extends Phaser.Scene {

    hud: Phaser.GameObjects.Text = null;
    initMessage = '0 / 10 gems';

    constructor() {
        super({ key: 'mainSceneHUD' });
    }

    init({ playerScore }) {
        if (playerScore) this.initMessage = `${playerScore} / 10 gems`;
    }

    create() {
        this.hud = this.add.text(10, 10, this.initMessage, {
            font: "24px monospace",
            fill: "#ffffff",
        })
            .setDepth(30)
            .setScrollFactor(0);
    }

    updatePlayerScore(playerScore) {
        this.hud.setText(`${playerScore} / 10 gems`);
    }
}