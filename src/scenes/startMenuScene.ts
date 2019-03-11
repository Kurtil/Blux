export default class StartMenuScene extends Phaser.Scene {

    keySpace: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "startMenuScene"
        });
    }

    preload() {
        this.load.spritesheet("spriteSheet", "assets/spriteSheets/BluxSpriteSheet.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.tilemapTiledJSON("map", "assets/tileMaps/tileMap01.json");
        this.load.audio("playerJump", "assets/sounds/jump.wav");
        this.load.audio("playerDie", "assets/sounds/die.wav");
        this.load.audio("playerHit", "assets/sounds/hit.wav");
        this.load.audio("playerAttack", "assets/sounds/attack.wav");
        this.load.audio("gemPickedUp", "assets/sounds/gemPickedUp.wav");
        this.load.audio("playerShotExplodes", "assets/sounds/playerShotExplodes.wav");
        this.load.audio("enemyDestroy", "assets/sounds/enemyDestroy.wav");
        this.load.audio("fire", "assets/sounds/fire.wav");
        this.load.audio("explodes", "assets/sounds/explodes.wav");
        this.load.audio("victory", "assets/sounds/victory.wav");
        this.load.audio("mainTheme", "assets/sounds/mainTheme.wav");
    }

    create() {
        this.add
            .text(
                // TODO find a way to get the width of the text to replace 135 Magic Number
                (<number>this.game.config.width) * 0.5 - 135,
                (<number>this.game.config.height) * 0.5,
                'Press Space to start',
                {
                    font: "18px monospace",
                    fill: "#000000",
                    padding: { x: 20, y: 10 },
                    backgroundColor: "#ffffff"
                });

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.keySpace.isDown) {
            this.scene.start("mainScene");
        }
    }
}