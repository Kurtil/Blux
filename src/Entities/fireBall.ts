import Entity from "./entity";
import MainScene from "../scenes/mainScene";

export default class FireBall extends Entity {

    speed = 100;

    constructor(scene: MainScene, x, y, key, target) {
        super(scene, x, y, key, "FireBall");

        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        this.play('fireBall');
        this.setSize(6, 6);
        var dx = target.x - this.x;
        var dy = target.y - this.y;
        var angle = Math.atan2(dy, dx);
        var speed = 100;
        // this.setAngle(angle * Math.PI / 180);
        this.setRotation(angle + Math.PI / 2);
        (<Phaser.Physics.Arcade.Body>this.body).setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        // TODO find a better way to register the fireBall collider
        (this.scene as MainScene).enemiesFireBalls.add(this);
    }

}