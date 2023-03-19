import { useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { PlayerNumberContext } from "../context/PlayerNumberContext";
import { PlayersContext } from "../context/PlayersContext";
import { GameStateContext } from "../context/GameStateContext";
import PlayerFallsButton from "./PlayerFallsButton";
import PlayerRoleButton from "./PlayerRoleButton";
import PlayerVoteButton from "./PlayerVoteButton";
import PlayerKillButton from "./PlayerKillButton";

const Player = (props) => {
    const number = useContext(PlayerNumberContext);
    const players = useContext(PlayersContext);
    const gameState = useContext(GameStateContext);

    const styles = StyleSheet.create({
        container: {
            width: '94%',
            height: '9%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            position: 'absolute',
            top: `${number * 10}%`,
            left: '3%'
        },
    });

    if (
        players[number].status === 2 ||
        players[number].status === 3 ||
        players[number].status === 4 ||
        players[number].status === 5
    ) {
        return (
            <View style={
                [
                    styles.container,
                    {
                        backgroundColor: '#F74E4E',
                        opacity: players[number].status === 4 ? 0.5 : 1
                    }
                ]
            }>
                <Text style={{ fontSize: 18 }}> №{number + 1} </Text>
                <Text style={{ fontSize: 18 }}>
                    {
                        players[number].status === 5
                            ? "4 фола"
                            : null
                    }
                    {
                        players[number].status === 2
                            ? "Заголосован"
                            : null
                    }
                    {
                        players[number].status === 4
                            ? "Мертв"
                            : null
                    }
                    {
                        players[number].status === 3
                            ? "Убит ночью"
                            : null
                    }
                </Text>
                {
                    (
                        gameState === 11 ||
                        gameState === 12
                    )
                        ?
                        <PlayerRoleButton role={players[number].role} canChange={false} />
                        : null
                }
            </View>
        );
    }

    if (gameState === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 18 }}> №{number + 1} </Text>
                <PlayerFallsButton />
                <PlayerRoleButton role={players[number].role} canChange={true} />
            </View>
        );
    } else if (gameState === 1) {
        return (
            <View style={[styles.container,
            {
                backgroundColor: players[number].canSpeak ? number === props.firstSpeaker ? '#90EE90' : '#FFFFFF' : '#2a74db',
            }]}>
                <Text style={{ fontSize: 18 }}> №{number + 1} </Text>
                <PlayerFallsButton />
                <PlayerVoteButton />
            </View>
        );
    } else if (gameState === 2) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 18 }}> №{number + 1} </Text>
                <PlayerFallsButton />
                <PlayerKillButton />
                <PlayerRoleButton role={players[number].role} canChange={false} />
            </View>
        );
    } else if (gameState === 4 || gameState === 7) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 18 }}> №{number + 1} </Text>
                <PlayerFallsButton />
            </View>
        );
    } else if (
        gameState === 3
        || gameState === 5
        || gameState === 6
        || gameState === 8
        || gameState === 9
        || gameState === 10
    ) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 18 }}> №{number + 1} </Text>
                <PlayerFallsButton />
            </View>
        );
    } else if (
        gameState === 11
        || gameState === 12
    ) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 18 }}> №{number + 1} </Text>
                <PlayerRoleButton role={players[number].role} canChange={false} />
            </View>
        );
    }
}

export default Player;