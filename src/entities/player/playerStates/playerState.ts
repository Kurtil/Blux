import Player from "../player";
import PlayerCommands from "../playerCommands";
export default interface PlayerState {
    player: Player;
    update(commandes: PlayerCommands, time);
    nextState(nextState: PlayerState);
}
