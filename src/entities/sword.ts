import spriteSheetConfig from "../../assets/spriteSheets/spriteSheet.json";

export default class Sword extends Phaser.Physics.Arcade.Sprite {

    hitPower = 1;

    constructor(scene: Phaser.Scene, x, y, key) {
        super(scene, x, y, key, spriteSheetConfig.content.sword.frame);
        this.scene.add.existing(this);
        this.setOrigin(0, 1);
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

    setAngle(value) {
        return super.setAngle(this.flipX ? - value : value);
    }
}
