import { useContext } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { GameStateContext } from "../context/GameStateContext";
import { SelectedPlayerContext } from "../context/SelectedPlayerContext";
import { SetSelectedBreakingVoteStateContext } from "../context/SetSelectedBreakingVoteStateContext";
import { VotedPlayersContext } from "../context/VotedPlayersContext";
import { buttons, playerButtons } from "../styles";
import { LeaveVotesContext } from "../context/LeaveVotesContext";
import { PlayersContext } from "../context/PlayersContext";
import VoteCountButton from "./VoteCountButton";

const GameState = (props) => {
    const gameState = useContext(GameStateContext);
    const votedPlayers = useContext(VotedPlayersContext);
    const selectedPlayer = useContext(SelectedPlayerContext);
    const setSelectedBreakingVoteState = useContext(SetSelectedBreakingVoteStateContext);
    const leaveVotes = useContext(LeaveVotesContext);
    const players = useContext(PlayersContext);

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
        },
        voteBreakingContainer: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row'
        }
    });

    const defineStayVotes = () => {
        let availableVotes = 0;

        for (let i = 0; i < 10; i++) {
            if (
                players[i].status === 0
                || players[i].status === 1
                || players[i].status === 3
            ) {
                availableVotes++;
            }
        }

        return availableVotes - leaveVotes;
    }

    const generateVotePlayers = () => {
        let players = [];

        for (let i = 0; i < votedPlayers.length; i++) {
            players.push(
                <View
                    key={i}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Text>№{votedPlayers[i]}</Text>
                    <VoteCountButton number={votedPlayers[i] - 1} />
                </View>
            )
        }

        return players;
    }

    return (
        <View style={[styles.container, props.style]}>
            <Text style={{ fontSize: 24 }}>
                {
                    gameState === 0
                        ? "Нулевая ночь"
                        : null
                }
                {
                    gameState === 1
                        ? "День №" + props.dayNumber 
                        : null
                }
                {
                    gameState === 2
                        ? "Ночь №" + props.nightNumber
                        : null
                }
                {
                    gameState === 3
                        ? "Результаты ночи"
                        : null
                }
                {
                    gameState === 4
                        ? "Голосование"
                        : null
                }
                {
                    gameState === 5
                        ? "Результаты голосования"
                        : null
                }
                {
                    gameState === 6
                        ? "Перестрелка"
                        : null
                }
                {
                    gameState === 7
                        ? "Переголосование"
                        : null
                }
                {
                    gameState === 8
                        ? "Результаты переголосования"
                        : null
                }
                {
                    gameState === 9
                        ? "Автокатастрофа"
                        : null
                }
                {
                    gameState === 10
                        ? "Результаты автокатастрофы"
                        : null
                }
                {
                    gameState === 11
                        ? "Победа мафии"
                        : null
                }
                {
                    gameState === 12
                        ? "Победа мирного города"
                        : null
                }
            </Text>
            {
                (
                    gameState === 6 ||
                    gameState === 9 ||
                    gameState === 10
                )
                    ?
                    <View>
                        <Text> Между игроками:</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}> {votedPlayers.join(", ")}</Text>
                    </View>
                    : null
            }
            {
                (
                    gameState === 4 ||
                    gameState === 7
                )
                    ?
                    <View>
                        {generateVotePlayers()}
                    </View>
                    : null
            }
            {
                (
                    gameState === 2
                    && selectedPlayer !== -1
                )
                    ?
                    <Text> Был убит игрок <Text style={{ fontWeight: 'bold' }}> №{selectedPlayer + 1} </Text> </Text>
                    : null

            }
            {
                (
                    gameState === 1
                    && votedPlayers.length !== 0
                )
                    ?
                    <View>
                        <Text> На голосование выставлены игроки: </Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}> {votedPlayers.join(", ")}</Text>
                    </View>
                    : null
            }
            {
                (
                    gameState === 1
                    && votedPlayers.length === 0
                )
                    ?
                    <View>
                        <Text> Никто не выставлен на голосование </Text>
                    </View>
                    : null
            }
            {
                (
                    gameState === 9
                        ?
                        <View>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Text> Покинуть: </Text>
                                <View style={{ width: 60, height: 60 }}>
                                    <Pressable
                                        style={({ pressed }) =>
                                            [
                                                playerButtons.primary,
                                                pressed ? buttons.pressed : buttons.primary,
                                            ]}
                                        onPress={() => {
                                            setSelectedBreakingVoteState(1);
                                        }}
                                    >
                                        <Text> {leaveVotes} </Text>
                                    </Pressable>
                                </View>
                            </View>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Text> Остаться: </Text>
                                <View style={{ width: 60, height: 60 }}>
                                    <Pressable style={[
                                        playerButtons.primary,
                                    ]}>
                                        <Text> {defineStayVotes()} </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        : null
                )
            }
        </View>
    );
}

export default GameState;