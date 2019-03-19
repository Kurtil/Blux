export default class HealthBar {

    scene: Phaser.Scene = null;
    health: number = null;
    maxHealth: number = null;
    healthBar: Phaser.GameObjects.Rectangle = null;
    damageBar: Phaser.GameObjects.Rectangle = null;
    container: Phaser.GameObjects.Container = null;
    healthBarWidth: number = null;

    constructor(scene, x, y, width, height, health, maxHealth,
        healthColor = 0x00ff00,
        damageColor = 0xff0000) {

        this.scene = scene;
        this.container = this.scene.add.container(x, y);
        this.health = health;
        this.maxHealth = maxHealth;
        this.healthBarWidth = width;

        this.healthBar = this.scene.add.rectangle(- width / 2, 0, width * (health / maxHealth),
            height, healthColor).setOrigin(0, 0.5);
        this.damageBar = this.scene.add.rectangle(0, 0, width, height, damageColor);

        this.container.add([this.damageBar, this.healthBar]);
    }

    updateHealthBarPosition(x, y) {
        this.container.x = x;
        this.container.y = y;
    }

    setVisible(isVisible: boolean) {
        this.container.setVisible(isVisible);
    }

    destroy() {
        this.container.destroy();
    }

    updateHealthBar(health, maxHealth?) {
        if (maxHealth) {
            this.maxHealth = maxHealth;
        }
        this.healthBar.width = this.healthBarWidth * (health / this.maxHealth);
    }
}