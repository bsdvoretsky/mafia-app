import { Pressable, Text, StyleSheet } from "react-native";
import { PlayersContext } from "../context/PlayersContext";
import { SetPlayersContext } from "../context/SetPlayersContext";
import { useContext } from "react";
import { SelectedBreakingVoteStateContext } from "../context/SelectedBreakingVoteStateContext";
import { SetLeaveVotesContext } from "../context/SetLeaveVotesContext";
import { SetSelectedBreakingVoteStateContext } from "../context/SetSelectedBreakingVoteStateContext";
import { buttons } from "../styles";
import { VotedPlayersContext } from "../context/VotedPlayersContext";
import { SelectedPlayerContext } from "../context/SelectedPlayerContext";
import { GameStateContext } from "../context/GameStateContext";
import { SetSelectedPlayerContext } from "../context/SetSelectedPlayerContext";

const CountPanelButton = (props) => {
    const styles = StyleSheet.create({
        container: {
            width: '30%',
            height: 0,
            aspectRatio: '1 / 1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
            opacity: props.available ? 1 : 0.2,
            margin: '1%',
        }
    });

    const players = useContext(PlayersContext);
    const setPlayers = useContext(SetPlayersContext);
    const gameState = useContext(GameStateContext);
    const setSelectedPlayer = useContext(SetSelectedPlayerContext);
    const selectedBreakingVoteState = useContext(SelectedBreakingVoteStateContext);
    const setSelectedBreakingVoteState = useContext(SetSelectedBreakingVoteStateContext);
    const setLeaveVotes = useContext(SetLeaveVotesContext);
    const votedPlayers = useContext(VotedPlayersContext);
    const selectedPlayer = useContext(SelectedPlayerContext);

    return (
        <Pressable
            style={({ pressed }) =>
                [
                    styles.container,
                    pressed ? buttons.pressed : buttons.primary
                ]}
            onPress={() => {
                if (!props.available) return;
                if (gameState === 4 || gameState === 7) {
                    const newPlayers = JSON.parse(JSON.stringify(players));
                    newPlayers[selectedPlayer].voteCount = props.value;
                    if (votedPlayers.indexOf(selectedPlayer + 1) === votedPlayers.length - 2) {
                        newPlayers[votedPlayers[votedPlayers.length - 1] - 1].voteCount += 
                        props.getAvailableVotes(newPlayers);
                    }
                    setPlayers(newPlayers);
                    setSelectedPlayer(-1);
                } else if (gameState === 9) {
                    setLeaveVotes(props.value);
                    setSelectedBreakingVoteState(-1);
                }
            }}
        >
            <Text style={{ fontSize: 24 }}> {props.value} </Text>
        </Pressable>
    );
}

export default CountPanelButton;