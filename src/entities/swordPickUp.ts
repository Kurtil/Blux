import spriteSheetConfig from "../../assets/spriteSheets/spriteSheet.json";
import Entity from "./entity";
import PickUp from "./pickup";
import Sword from "./sword";

export default class SwordPickUp extends Entity implements PickUp {

    effect = { weapon: Sword };

    constructor(scene, x, y, key) {
        super(scene, x, y - 4, key, "Sword", Phaser.Physics.Arcade.DYNAMIC_BODY,
            spriteSheetConfig.content.sword.frame);

        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.angle = -45;

        this.scene.add.tween({
            targets: this,
            y: this.y - 2,
            yoyo: true,
            repeat: -1,
            duration: 200,
            ease: "InOut"
        });
    }

    getEffect() {
        return this.effect;
    }

    onPickedUp(): any {
        this.scene.sound.play("healthUp", { detune: -1200 });
        this.destroy();
    }
}
