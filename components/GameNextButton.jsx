import { useContext } from "react";
import { Pressable, StyleSheet, Text, Vibration } from "react-native";
import { buttons } from "../styles";
import { GameStateContext } from "../context/GameStateContext";
import { SetGameStateContext } from "../context/SetGameStateContext";
import { VotedPlayersContext } from "../context/VotedPlayersContext";
import { PlayersContext } from "../context/PlayersContext";
import { LeaveVotesContext } from "../context/LeaveVotesContext";

const GameNextButton = (props) => {
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    });

    const gameState = useContext(GameStateContext);
    const setGameState = useContext(SetGameStateContext);
    const votedPlayers = useContext(VotedPlayersContext);
    const players = useContext(PlayersContext);
    const leaveVotes = useContext(LeaveVotesContext);

    return (
        <Pressable
            style={({ pressed }) =>
                [
                    styles.container,
                    pressed ? buttons.pressed : buttons.primary,
                    props.style,
                ]
            }
            onLongPress={() => {
                Vibration.vibrate();
                if (gameState === 0) {
                    props.functions.moveAfterZeroNight();
                } else if (gameState === 1) {
                    props.functions.moveAfterDay();
                } else if (gameState === 2) {
                    props.functions.moveAfterNight();
                } else if (gameState === 3) {
                    props.functions.moveAfterNightResult();
                } else if (
                    gameState === 4 ||
                    gameState === 7
                ) {
                    props.functions.moveAfterVoiting();
                } else if (
                    gameState === 5 ||
                    gameState === 8 ||
                    gameState === 10
                ) {
                    props.functions.moveAfterVoitingResult();
                } else if (gameState === 6) {
                    setGameState(7);
                } else if (gameState === 9) {
                    props.functions.moveAfterPopil();
                } else if (
                    gameState === 11 ||
                    gameState === 12
                ) {
                    props.functions.restartGame();
                }
            }}
        >
            <Text style={{ fontSize: 24 }}> Далее </Text>
            {
                gameState === 0 ||
                    gameState === 3
                    ?
                    <Text> День </Text>
                    : null
            }
            {
                gameState === 1 &&
                    votedPlayers.length === 0 ||
                    gameState === 5 ||
                    gameState === 8 ||
                    gameState === 10 ||
                    (
                        gameState === 9 &&
                        leaveVotes <= props.getAvailableVotes(players) - leaveVotes
                    )
                    ?
                    <Text> Ночь </Text>
                    : null
            }
            {
                gameState === 1 &&
                    votedPlayers.length !== 0
                    ?
                    <Text> Голосование </Text>
                    : null
            }
            {
                gameState === 2
                    ?
                    <Text> Результаты ночи </Text>
                    : null
            }
            {
                gameState === 4 &&
                    props.functions.getPlayersWithMaxVotes(JSON.parse(JSON.stringify(players))).length === 1
                    ?
                    <Text> Результаты голосования </Text>
                    : null
            }
            {
                gameState === 4 &&
                    props.functions.getPlayersWithMaxVotes(JSON.parse(JSON.stringify(players))).length > 1
                    ?
                    <Text> Перестрелка между игроками </Text>
                    : null
            }
            {
                gameState === 6
                    ?
                    <Text> Переголосование </Text>
                    : null
            }
            {
                gameState === 7 &&
                    props.functions.getPlayersWithMaxVotes(JSON.parse(JSON.stringify(players))).length === 1
                    ?
                    <Text> Результаты переголосования </Text>
                    : null
            }
            {
                gameState === 7 &&
                    props.functions.getPlayersWithMaxVotes(JSON.parse(JSON.stringify(players))).length > 1
                    ?
                    <Text> Автокатастрофа </Text>
                    : null
            }
            {
                gameState === 9 &&
                    leaveVotes > props.getAvailableVotes(players) - leaveVotes
                    ?
                    <Text> Результаты автокатастрофы </Text>
                    : null
            }
            {
                gameState === 11 ||
                    gameState === 12
                    ?
                    <Text> Нулевая ночь </Text>
                    : null
            }
        </Pressable >
    );
}

export default GameNextButton;