import Entity from "./entity";
import MainScene from "../scenes/mainScene";
import FireBall from "./fireBall";

export default class Enemy extends Entity {

    attackDelay = 2000;
    lastAttack = 0;

    constructor(scene: MainScene, x, y, key) {
        super(scene, x, y, key, "Enemy");

        this.setSize(10, 16);
    }

    update(time) {
        const player = (this.scene as MainScene).player;
        const distanceToPlayer = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            this.x,
            this.y);

        if (distanceToPlayer < 100 && time - this.lastAttack > this.attackDelay) {
            this.attack(player);
            this.lastAttack = time;
        }
    }

    private attack(player) {
        new FireBall(this.scene as MainScene, this.x, this.y, 'spriteSheet', player);
    }
}