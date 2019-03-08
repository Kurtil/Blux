import MainScene from "./mainScene";

export default class MainSceneHUD extends Phaser.Scene {

    constructor() {
        super({ key: 'mainSceneHUD' });
    }

    create() {
        const hud = this.add.text(10, 10, '0 / 10 gems', {
            font: "24px monospace",
            fill: "#ffffff",
        })
            .setDepth(30)
            .setScrollFactor(0);

        const mainScene = this.scene.get('mainScene') as MainScene;
        const sub = mainScene.events.on('gem-picked', () => {
            hud.setText(`${mainScene.player.getData('score')} / 10 gems`);
        });

        this.events.on('shutdown', () => {
            if (sub) sub.removeAllListeners('gem-picked');
            this.events.removeAllListeners('shutdown');
        });
    }
}