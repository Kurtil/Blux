import spriteSheetConfig from "../../../assets/spriteSheets/spriteSheet.json";
import Sword from './sword'

export default class ForrestSword extends Sword {
    constructor(scene: Phaser.Scene, x, y, key) {
        super(scene, x, y, key, spriteSheetConfig.content.forrestSword.frame, 2);
        this.scene.add.existing(this);
        this.setOrigin(0, 1);
    }
}
