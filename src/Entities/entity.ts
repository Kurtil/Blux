export default class Entity extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);

        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this);

        this.setData("type", type);

    }
}