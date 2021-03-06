import spriteSheetConfig from "../../../assets/spriteSheets/spriteSheet.json";
import Sword from './sword'

export default class HellSword extends Sword {
    constructor(scene: Phaser.Scene, x, y, key) {
        super(scene, x, y, key, spriteSheetConfig.content.hellSword.frame, 3);
    }
}
