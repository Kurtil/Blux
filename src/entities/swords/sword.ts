import spriteSheetConfig from "../../../assets/spriteSheets/spriteSheet.json";

export default class Sword extends Phaser.Physics.Arcade.Sprite {

    hitPower = null;

    constructor(scene: Phaser.Scene, x, y, key, sprite: number, hitPower: number) {
        super(scene, x, y, key, sprite);
        this.hitPower = hitPower;
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
