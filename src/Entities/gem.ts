import Entity from "./entity";

export default class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Gem");

        // Animations management
        this.createAnimations();
    }
    createAnimations(): any {
        this.scene.anims.create({
            key: "gem",
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 49, end: 55 }),
            frameRate: 2
        });
    }

    update() {
        this.anims.play("gem", true);
    }
}
