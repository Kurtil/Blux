import Entity from "./entity";

export default class Gem extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Gem");

        // Animations management
        this.createAnimations();
        this.anims.play("gem");
    }
    createAnimations(): any {
        this.scene.anims.create({
            key: "gem",
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 80, end: 86 }),
            frameRate: 10,
            repeat: -1,
        });
    }
}
