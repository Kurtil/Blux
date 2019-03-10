export default class MainSceneHUD extends Phaser.Scene {

    infos: Phaser.GameObjects.Text = null;
    displayinInfos = false;
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

        this.infos = this.add.text(10, 566, '', {
            font: "24px monospace",
            fill: "#ffffff",
        })
            .setDepth(30)
            .setScrollFactor(0);
    }

    updatePlayerScore(playerScore) {
        this.hud.setText(`${playerScore} / 10 gems`);
    }

    displayInformations(infos: any): any {
        this.infos.setText(infos);
        if (!this.displayinInfos) {
            this.displayinInfos = true;
            this.time.addEvent({
                delay: 300,
                callback: () => {
                    this.infos.setText('');
                    this.displayinInfos = false;
                }
            });
        }
    }
}