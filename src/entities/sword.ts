import Entity from "./entity";
import spriteSheetConfig from "../../assets/spriteSheets/spriteSheet.json";

export default class Sword extends Entity {

    constructor(scene: Phaser.Scene, x, y, key) {
        super(scene, x + 1, y + 1, key, "Sword", Phaser.Physics.Arcade.DYNAMIC_BODY,
            spriteSheetConfig.content.sword.from);

        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        scene.anims.create({
            key: "sword",
            frames: this.scene.anims.generateFrameNumbers(spriteSheetConfig.name,
                {
                    start: spriteSheetConfig.content.sword.from,
                    end: spriteSheetConfig.content.sword.to
                }),
            frameRate: 30,
        });

        this.play("sword");
    }
}
