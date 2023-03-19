import { useState, useContext } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { buttons, playerButtons } from "../styles";
import { PlayerNumberContext } from "../context/PlayerNumberContext";
import { PlayersContext } from "../context/PlayersContext";
import { SetPlayersContext } from "../context/SetPlayersContext";
import { VotedPlayersContext } from "../context/VotedPlayersContext";
import { SetVotedPlayersContext } from "../context/SetVotedPlayersContext";
import { SetGameStateContext } from "../context/SetGameStateContext";
import PlayerCancelButton from "./PlayerCancelButton";
import { SetSelectedPlayerContext } from "../context/SetSelectedPlayerContext";
import { CheckIsGameEndingContext } from "../context/CheckIsGameEndingContext";
import { ShowThirdFallModalContext } from "../context/ShowThirdFallModalContext";
import { SetShowThirdFallModalContext } from "../context/SetShowThirdFallModalContext";
import { GameStateContext } from "../context/GameStateContext";

const PlayerFallsButton = () => {
    const [isCancelActive, setIsCancelActive] = useState(false);
    const [isFourFallActive, setIsFourFallActive] = useState(false);
    const number = useContext(PlayerNumberContext);
    const players = useContext(PlayersContext);
    const setPlayers = useContext(SetPlayersContext);
    const votedPlayers = useContext(VotedPlayersContext);
    const setVotedPlayers = useContext(SetVotedPlayersContext);
    const setGameState = useContext(SetGameStateContext);
    const setSelectedPlayer = useContext(SetSelectedPlayerContext);
    const checkIsGameEnding = useContext(CheckIsGameEndingContext);
    const showThirdFallModal = useContext(ShowThirdFallModalContext);
    const setShowThirdFallModal = useContext(SetShowThirdFallModalContext);
    const gameState = useContext(GameStateContext);

    const cancelFunction = () => {
        const newPlayers = JSON.parse(JSON.stringify(players));
        if (
            newPlayers[number].falls === 3 &&
            gameState === 1 &&
            !newPlayers[number].canSpeak 
        ) {
            newPlayers[number].canSpeak = true;
            newPlayers[number].hadVoiceLimit = false;
        }
        newPlayers[number].falls--;
        setPlayers(newPlayers);
        setIsCancelActive(false);
        setIsFourFallActive(false);
    }

    const styles = StyleSheet.create({
        fourFallButton: {
            width: 25,
            height: 25,
            backgroundColor: '#D3D3D3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    return (
        <View style={{ width: 60, height: 60 }}>
            <Pressable
                style={({ pressed }) =>
                    [
                        playerButtons.primary,
                        pressed ? buttons.pressed : buttons.primary
                    ]}
                onPress={() => {
                    if (isCancelActive) {
                        setIsCancelActive(false);
                        setIsFourFallActive(false);
                        return;
                    }

                    if (players[number].falls === 3) {
                        return;
                    }

                    if (
                        players[number].falls === 2 &&
                        gameState === 1
                    ) {
                        setSelectedPlayer(number);
                        setShowThirdFallModal(true);
                    }

                    const newPlayers = JSON.parse(JSON.stringify(players));
                    newPlayers[number].falls++;
                    setPlayers(newPlayers);
                }}
                onLongPress={() => {
                    if (players[number].falls === 0) return;
                    setIsCancelActive(true);
                    if (players[number].falls === 3) {
                        setIsFourFallActive(true);
                    }
                }}
            >
                <Text style={{ fontSize: 18 }}> {players[number].falls} </Text>
            </Pressable>
            {
                isCancelActive
                    ? <PlayerCancelButton cancelFunction={cancelFunction}
                        setIsCancelActive={setIsCancelActive} />
                    : null
            }
            {
                isFourFallActive
                    ? <Pressable
                        style={styles.fourFallButton}
                        onPress={() => {
                            const newPlayers = JSON.parse(JSON.stringify(players));
                            newPlayers[number].status = 5;

                            for (let i = 0; i < votedPlayers.length; i++) {
                                if (votedPlayers[i] === number + 1) {
                                    let newVotedPlayers = [...votedPlayers];
                                    newVotedPlayers = newVotedPlayers.slice(0, i).concat(newVotedPlayers.slice(i + 1));
                                    setVotedPlayers(newVotedPlayers);
                                    break;
                                }
                            }

                            setPlayers(newPlayers);
                        }}
                    >
                        <Text> 4 </Text>
                    </Pressable>
                    : null
            }
        </View>
    );
}

export default PlayerFallsButton;