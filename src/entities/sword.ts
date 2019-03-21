
import spriteSheetConfig from "../../assets/spriteSheets/spriteSheet.json";

export default class Sword extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x, y, key) {
        super(scene, x, y, key, spriteSheetConfig.content.sword.from);
        this.scene.add.existing(this);
        this.setOrigin(0, 1);
    }

    set flipX(value) {
        this.setDirectionOrigin(value);
        super.flipX = value;
    }

    setFlipX(value) {
        this.setDirectionOrigin(value);
        return super.setFlipX(value);
    }

    setDirectionOrigin(leftDirection) {
        if (leftDirection) {
            this.setOrigin(1, 1);
        } else {
            this.setOrigin(0, 1);
        }
    }
}
