import Entity from "./entity";

export default class Heart extends Entity {

    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Gem", Phaser.Physics.Arcade.DYNAMIC_BODY, 95);

        this.setScale(1);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    onPickedUp(): any {
        this.scene.sound.play('gemPickedUp');
        this.destroy();
    }
}
