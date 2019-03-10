import PlayerState from "./playerState";
import PlayerCommands from "../playerCommands";
import Player from "../player";
import AirPlayerState from "./airPlayerState";
import IdlePlayerState from "./idlePlayerState";

export default class RunPlayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
        this.player.anims.play("walk");
    }

    update(commandes: PlayerCommands, time) {
        // is player in good state
        if (!this.player.body.blocked.down) {
            return this.player.setCurrentState(new AirPlayerState(this.player));
        }
        // player commands may change the state
        if (commandes.up) {
            if (this.player.jump(time)) return this.player.setCurrentState(new AirPlayerState(this.player));
        }
        if (commandes.left) {
            this.player.setVelocityX(-140);
            this.player.setFlipX(true);
        } else if (commandes.right) {
            this.player.setVelocityX(140);
            this.player.setFlipX(false);
        }
        if (!commandes.left && !commandes.right) {
            this.player.setVelocityX(0);
            return this.player.setCurrentState(new IdlePlayerState(this.player));
        }
    }
}