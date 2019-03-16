import spriteSheetConfig from '../../assets/spriteSheets/spriteSheet.json';
import Entity from "./entity";
import MainScene from "../scenes/mainScene";
import FireBall from "./fireBall";
import Player from "./player/player";
import Heart from "./heart";
import ExtraLife from "./extraLife";

export default class Enemy extends Entity {

    /**
     * The group that must contains enemy shots
     */
    shotGroup: Phaser.GameObjects.Group;
    attackDelay = 2000;
    lastAttack = 0;
    graphics: any;
    debug = false;
    attackDistanceLimit = 100;
    maxLifeCount = 3;
    life = 3;
    lifeBars: { life: Phaser.GameObjects.Graphics, damage: Phaser.GameObjects.Graphics };
    green: Phaser.GameObjects.Graphics;
    isDead = false;

    constructor(scene: MainScene, x, y, key, shotGroup) {
        super(scene, x, y, key, "Enemy", Phaser.Physics.Arcade.STATIC_BODY);

        this.shotGroup = shotGroup;
        this.setSize(16, 14).setOffset(0, 2);
        this.play('enemy');
        if (this.debug) this.graphics = this.scene.add.graphics();

        // life management
        this.drawLifeBars();
    }

    update(time) {
        // hide life bar if full life
        const fullHealth = this.life === this.maxLifeCount;
        this.lifeBars.damage.setVisible(fullHealth ? false : true);
        this.lifeBars.life.setAlpha(fullHealth ? 0 : 1);

        if (!this.isDead) {
            const player = (this.scene as MainScene).player;

            // To add debug lines between player and enemy
            if (this.debug) {
                this.graphics.clear();
                this.graphics.lineStyle(1, 0xffffff, 1);
                const drawLine = new Phaser.Curves.Line(new Phaser.Math.Vector2(this.x, this.y),
                    new Phaser.Math.Vector2(player.x, player.y));
                drawLine.draw(this.graphics);
            }

            const distanceToPlayer = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                this.x,
                this.y);

            if (distanceToPlayer < this.attackDistanceLimit &&
                this.canSee(player) &&
                time - this.lastAttack > this.attackDelay) {

                this.attack(player);
                this.lastAttack = time;
            }
        }
    }

    hit() {
        this.onHit();
    }

    private onHit() {
        this.life--;
        this.updateLifeBar();
        if (this.life === 0) {
            this.onDead();
        }
    }

    private onDead() {
        this.clearLifeBar();
        this.disableBody();
        this.isDead = true;
        this.play('enemyDestroy');
        this.scene.sound.play('enemyDestroy', { volume: 0.5 })
        this.once('animationcomplete-enemyDestroy', () => {
            const randomNumber = Phaser.Math.Between(1, 12);
            if (randomNumber <= 3) (this.scene as MainScene).heartGroup.add(new Heart(this.scene, this.x, this.y, spriteSheetConfig.name));
            else if (randomNumber === 12) (this.scene as MainScene).extraLifeGroup.add(new ExtraLife(this.scene, this.x, this.y, spriteSheetConfig.name));
            this.destroy();
        });
    }

    /**
     * Draw the green and the red (bottom) life bars
     */
    private drawLifeBars(): any {
        this.lifeBars = {
            damage: this.scene.add.graphics({ fillStyle: { color: 0xff0000 } }).fillRectShape(this.getLifeRectangle(true)),
            life: this.scene.add.graphics({ fillStyle: { color: 0x00ff00 } }).fillRectShape(this.getLifeRectangle())
        }
    }

    private updateLifeBar() {
        this.lifeBars.life.destroy();
        this.lifeBars.life = this.scene.add.graphics({ fillStyle: { color: 0x00ff00 } }).fillRectShape(this.getLifeRectangle());
    }

    private clearLifeBar() {
        this.lifeBars.life.destroy();
        this.lifeBars.damage.destroy();
    }

    private getLifeRectangle(max = false): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(this.x + 6, this.y - 11, max ? -12 : -12 * (this.life / this.maxLifeCount), 2);
    }

    private attack(player: Player) {
        // the sound should be lounder if the player is closer
        const distanceToPlayer = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            this.x,
            this.y);
        this.scene.sound.play('fire', { volume: 0.5 / Math.max((distanceToPlayer / 50), 1) });
        this.shotGroup.add(new FireBall(this.scene as MainScene, this.x, this.y, spriteSheetConfig.name, player));
    }

    /**
     * Check if the player can be see (no tiles between the enemy and the player)
     * @param player
     */
    private canSee(player: Player) {
        const line = new Phaser.Geom.Line(this.x, this.y, player.x, player.y);
        const hiddingTiles = (this.scene as MainScene).ground.getTilesWithinShape(line).filter(tile => tile.index !== -1);
        return hiddingTiles.length === 0;
    }
}