import Player from "../player";
import PlayerCommands from "../playerCommands";
export default interface PlayerState {
    player: Player;
    update(time);
    handleUserInputs(commandes: PlayerCommands, time?);
    nextState(nextState: PlayerState);
}
