import Gem from "../entities/gem";
import MainScene from "../scenes/mainScene";

export default class GemFactory {

    scene: Phaser.Scene = null;
    /**
     * The key to the texture
     */
    textureKey: string = null;

    /**
     * @param scene the scene the factory belongs to
     * @param textureKey the spriteSheet key for textures
     */
    constructor(scene: Phaser.Scene, textureKey: string) {
        this.scene = scene;
        this.textureKey = textureKey;
        this.createAnimations();
    }

    generateGemsFromMap(map) {
        return map.getObjectLayer("gems").objects.map((gem: any) =>
            new Gem(this.scene as MainScene, gem.x + gem.width / 2, gem.y - gem.height / 2, this.textureKey,
                gem.width === 32 ? true : false)
        );
    }

    private createAnimations() {
        this.scene.anims.create({
            key: "gem",
            frames: this.scene.anims.generateFrameNumbers(this.textureKey, { start: 80, end: 86 }),
            frameRate: 10,
            repeat: -1,
        });
    }
}