import spriteSheetConfig from '../../assets/spriteSheets/spriteSheet.json';
import Player from "../entities/player/player";

export default class MainSceneHUD extends Phaser.Scene {

    infos: Phaser.GameObjects.BitmapText = null;
    displayinInfos = false;
    score: Phaser.GameObjects.BitmapText = null;
    initMessage = '0 / 10';
    player: Player = null;
    lifes: Phaser.GameObjects.Sprite[] = null;
    gem: Phaser.GameObjects.Sprite;
    infoRect: any;

    constructor() {
        super({ key: 'mainSceneHUD' });
    }

    init({ player, playerScore, lifes }) {
        if (playerScore) this.initMessage = `${playerScore} / 10`;
        // if (lifes) this.lifes = lifes;
        if (player) this.player = player;
    }

    create() {

        this.score = this.add.bitmapText(20, 10, 'nokia-white', this.initMessage, 24);
        this.gem = this.add.sprite(this.score.width + 2 * 20, 20, spriteSheetConfig.name, 80)
            .setScale(2)
            .setOrigin(0, 0.5);
        this.add.rectangle(5, 5, this.score.width + this.gem.width + 3 * 20,
            this.score.height + 2 * 5, 0x443333)
            .setOrigin(0, 0)
            .setDepth(-1);
        // this.add.container(400, 300, [this.gem, this.score]);

        this.lifes = [];
        this.displayLife(this.player.life, this.player.maxLife);

        this.infos = this.add.bitmapText(10, 566, 'nokia-white', '', 24);
        this.infoRect = this.add.rectangle(0, 0, 0, 0, 0x443333).setVisible(false).setDepth(-1);
        this.updateInfoRect();
    }

    private updateInfoRect(): any {
        this.infoRect.x = this.infos.x - 5;
        this.infoRect.y = this.infos.y;
        this.infoRect.width = this.infos.width + 5;
        this.infoRect.height = this.infos.height + 5;
        return this.infoRect;
    }

    updatePlayerScore(playerScore) {
        this.score.setText(`${playerScore} / 10`);
    }

    updatePlayerLife(life, maxLife) {
        this.displayLife(life, maxLife);
    }

    displayInformations(infos: any): any {
        this.infos.setText(infos);
        this.updateInfoRect().setVisible(true);
        if (!this.displayinInfos) {
            this.displayinInfos = true;
            this.time.addEvent({
                delay: 300,
                callback: () => {
                    this.infos.setText('');
                    this.displayinInfos = false;
                    this.infoRect.setVisible(false);
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
                this.lifes.push(this.add.sprite(firstPosition - (spaceBetweenHeart + heartWidth) * i,
                    20, spriteSheetConfig.name, 96).setScale(2));
            } else {
                this.lifes.push(this.add.sprite(firstPosition - (spaceBetweenHeart + heartWidth) * i,
                    20, spriteSheetConfig.name, 95).setScale(2));
            }
        }
    }
}