import Entity from "./entity";
import PickUp from "./pickup";

export default class Heart extends Entity implements PickUp {

    effect = { health: 1 };

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

    getEffect() {
        return this.effect;
    }

    onPickedUp(): any {
        this.scene.sound.play("healthUp");
        this.destroy();
    }
}
