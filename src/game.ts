import * as Phaser from "phaser";
import StartMenuScene from "./scenes/startMenuScene";
import MainScene from "./scenes/mainScene";
import DieScene from "./scenes/dieScene";
import WinScene from "./scenes/winScene";

const config: GameConfig | any = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        StartMenuScene,
        MainScene,
        DieScene,
        WinScene,
    ],
};

const game: any = new Phaser.Game(config);
