import Player from "../entities/player/player";

export default class MainSceneHUD extends Phaser.Scene {

    infos: Phaser.GameObjects.Text = null;
    displayinInfos = false;
    hud: Phaser.GameObjects.Text = null;
    initMessage = '0 / 10';
    player: Player = null;
    lifes : Phaser.GameObjects.Sprite[] = null;

    constructor() {
        super({ key: 'mainSceneHUD' });
    }

    init({ player, playerScore, lifes }) {
        if (playerScore) this.initMessage = `${playerScore} / 10`;
        // if (lifes) this.lifes = lifes;
        if (player) this.player = player;
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

        this.lifes = [];
        this.displayLife(this.player.life, this.player.maxLife);

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

    updatePlayerLife(life, maxLife) {
        this.displayLife(life, maxLife);
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

    private displayLife(life, maxLife) {
        const spaceBetweenHeart = 3;
        const heartWidth = 16 * 2;
        const firstPosition = (this.game.config.width as number) - spaceBetweenHeart - heartWidth;

        this.lifes.forEach(life => life.destroy());
        this.lifes = [];
        for (let i = 0; i < maxLife; i++) {
            if (i + 1 > life) {
                this.lifes.push(this.add.sprite(firstPosition - (spaceBetweenHeart + heartWidth) * i, 20, 'spriteSheet', 96).setScale(2));
            } else {
                this.lifes.push(this.add.sprite(firstPosition - (spaceBetweenHeart + heartWidth) * i, 20, 'spriteSheet', 95).setScale(2));
            }
        }
    }
}