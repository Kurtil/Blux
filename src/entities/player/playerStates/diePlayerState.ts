import PlayerState from "./playerState";
import Player from "../player";
import PlayerCommands from "../playerCommands";

export default class DiePLayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
    }

    init() {
        this.player.anims.play("die");
        this.player.once("animationcomplete-die", (animation, frame) => {
            if (frame.isLast) this.player.onDead();
        });
    }

    update(time): void { }

    handleUserInputs(commandes: PlayerCommands) { }

    nextState(nextState) { }
}