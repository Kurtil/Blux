import Entity from "./entity";
import MainScene from "../scenes/mainScene";

export default class FireBall extends Entity {

    speed = 100;
    target = null;

    constructor(scene: MainScene, x, y, key, target) {
        super(scene, x, y, key, "FireBall");

        this.target = target;

        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        this.play("fireBall");
        this.setSize(6, 6);
        var dx = target.x - this.x;
        var dy = target.y - this.y;
        var angle = Math.atan2(dy, dx);
        this.setRotation(angle);
        (<Phaser.Physics.Arcade.Body>this.body).setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );
    }

    hit() {
        this.disableBody();
        this.play("fireBallExplodes");
        // the sound should be lounder if the player is closer
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.target.x,
            this.target.y,
            this.x,
            this.y);
        this.scene.sound.play("explodes", { volume: 0.5 / Math.max((distanceToPlayer / 50), 1) });
        this.once("animationcomplete-fireBallExplodes", () => this.destroy());
    }

}