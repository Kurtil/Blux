import Entity from "../entity";
import MainScene from "../../scenes/mainScene";
import Player from "./player";

export default class PlayerShot extends Entity {

    speed = 200;
    player: Player = null;

    constructor(scene: MainScene, x, y, key, player: Player) {
        super(scene, x, y, key, "PlayerShot");

        this.player = player;

        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        this.setScale(0.5);
        this.play('playerShot');
        this.setSize(12, 12).setOffset(2, 2);
        (<Phaser.Physics.Arcade.Body>this.body).setVelocityX(player.flipX ? - this.speed : this.speed);
    }

    hit() {
        this.disableBody();
        this.play('playerShotExplodes');
        // the sound should be lounder if the player is closer
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.x,
            this.y);
        this.scene.sound.play('playerShotExplodes', { volume: 0.1 / Math.max((distanceToPlayer / 50), 1) });
        this.once('animationcomplete-playerShotExplodes', () => this.destroy());
    }

}