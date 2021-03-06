export default class Entity extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key, type, bodyType = Phaser.Physics.Arcade.DYNAMIC_BODY, frame?) {
        super(scene, x, y, key, frame);

        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, bodyType);

        this.setData("type", type);

    }
}