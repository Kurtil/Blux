import Entity from "./entity";
import PickUp from "./pickup";

export default class ExtraLife extends Entity implements PickUp {

    effect = { maxHealth: 1 };

    constructor(scene, x, y, key) {
        super(scene, x + 1, y + 1, key, "Gem", Phaser.Physics.Arcade.DYNAMIC_BODY, 97);

        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        this.scene.add.tween({
            targets: this,
            x: {
                value: this.x - 2,
            },
            y: {
                value: this.y - 2,
                delay: 100,
            },
            ease: Phaser.Math.Easing.Circular.InOut,
            yoyo: true,
            duration: 100,
            hold: 100,
            repeatDelay: 100,
            repeat: -1,
        });
    }

    onPickedUp(): any {
        this.scene.sound.play("healthUp", { detune: 500 });
        this.destroy();
    }

    getEffect() {
        return this.effect;
    }
}
