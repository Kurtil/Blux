import PlayerState from "./playerState";
import Player from "../player";
import PlayerCommands from "../playerCommands";
import IdlePlayerState from "./idlePlayerState";

export default class AttackPLayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
        this.player.anims.play("attack");
        this.player.on("animationupdate-attack", (animation, frame) => {
            if (frame.textureFrame === 32) this.player.attack();
        });
    }

    update(commandes: PlayerCommands, time): void {
        if (!commandes.attack) {
            this.player.removeListener("animationupdate-attack");
            return this.player.setCurrentState(new IdlePlayerState(this.player));
        }
    }
}