import Entity from "./entity";

export default class Heart extends Entity {

    constructor(scene, x, y, key) {
        super(scene, x + 1, y + 1, key, "Gem", Phaser.Physics.Arcade.DYNAMIC_BODY, 95);

        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        this.scene.add.tween({
            targets: this,
            scaleX: 0.8,
            scaleY: 0.8,
            yoyo: true,
            repeat: -1,
            duration: 200,
        });
    }

    onPickedUp(): any {
        this.scene.sound.play('lifeUp');
        this.destroy();
    }
}
