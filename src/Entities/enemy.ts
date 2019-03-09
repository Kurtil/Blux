import Entity from "./entity";
import MainScene from "../scenes/mainScene";
import FireBall from "./fireBall";
import Player from "./player";

export default class Enemy extends Entity {

    attackDelay = 2000;
    lastAttack = 0;
    graphics: any;
    debug = false;
    attackDistanceLimit = 100;

    constructor(scene: MainScene, x, y, key) {
        super(scene, x, y, key, "Enemy");

        this.setSize(8, 10).setOffset(4, 6);
        if (this.debug) this.graphics = this.scene.add.graphics();
    }

    update(time) {
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

    private attack(player: Player) {
        new FireBall(this.scene as MainScene, this.x, this.y, 'spriteSheet', player);
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