import Entity from "./entity";
import MainScene from "../scenes/mainScene";

export default class Enemy extends Entity {
    constructor(scene: MainScene, x, y, key) {
        super(scene, x, y, key, "Enemy");
    }
}