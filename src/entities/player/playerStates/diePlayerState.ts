import PlayerState from "./playerState";
import Player from "../player";
import PlayerCommands from "../playerCommands";

export default class DiePLayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
        this.player.anims.play("die");
        this.player.once("animationcomplete-die", (animation, frame) => {
            if (frame.isLast) this.player.onDead();
        });
    }

    update(commandes: PlayerCommands, time): void { }
}