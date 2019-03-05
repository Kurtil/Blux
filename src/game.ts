import * as Phaser from 'phaser';
import MainScene from './scenes/mainScene';

const config: GameConfig | any  = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: new MainScene,
};

const game: any = new Phaser.Game(config);
