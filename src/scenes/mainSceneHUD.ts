export default class MainSceneHUD extends Phaser.Scene {

    infos: Phaser.GameObjects.Text = null;
    displayinInfos = false;
    hud: Phaser.GameObjects.Text = null;
    life: Phaser.GameObjects.Text = null;
    initMessage = '0 / 10';
    initLife = '3 x'

    constructor() {
        super({ key: 'mainSceneHUD' });
    }

    init({ playerScore, life }) {
        if (playerScore) this.initMessage = `${playerScore} / 10`;
        if (life) this.initLife = `${life} x`;
    }

    create() {
        this.hud = this.add.text(10, 10, this.initMessage, {
            font: "24px monospace",
            fill: "#ffffff",
        })
            .setDepth(30)
            .setScrollFactor(0);

        const gem = this.add.sprite(135, 20, 'spriteSheet', 80).setScale(2);
        gem.tint = 0xDDDDDD;


        this.life = this.add.text(700, 10, this.initLife, {
            font: "24px monospace",
            fill: "#ffffff",
        })
            .setDepth(30)
            .setScrollFactor(0);
        const heart = this.add.sprite(774, 20, 'spriteSheet', 95).setScale(2);


        this.infos = this.add.text(10, 566, '', {
            font: "24px monospace",
            fill: "#ffffff",
        })
            .setDepth(30)
            .setScrollFactor(0);
    }

    updatePlayerScore(playerScore) {
        this.hud.setText(`${playerScore} / 10`);
    }

    updatePlayerLife(life) {
        this.life.setText(`${life} x`)
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