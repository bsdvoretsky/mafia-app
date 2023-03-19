import { useContext } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { LeaveVotesContext } from "../context/LeaveVotesContext";
import { PlayersContext } from "../context/PlayersContext";
import { SetSelectedBreakingVoteState } from "../context/SetSelectedBreakingVoteStateContext";
import { buttons, playerButtons } from "../styles";

const VoteBreakingMenu = (props) => {
    const styles = StyleSheet.create({
        container: {
            width: 200,
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: '#FFFFFF'
        }
    });

    const setSelectedBreakingVoteState = useContext(SetSelectedBreakingVoteState);
    const leaveVotes = useContext(LeaveVotesContext);
    const players = useContext(PlayersContext);

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

    return (
        <View style={[styles.container, props.style]}>
            <Text> За то, чтобы все игроки покинули стол: </Text>
            <View style={{ width: 60, height: 60 }}>
                <Pressable
                    style={({ pressed }) =>
                        [
                            playerButtons.primary,
                            pressed ? buttons.pressed : buttons.primary
                        ]}
                    onPress={() => {
                        setSelectedBreakingVoteState(1);
                    }}
                >
                    <Text> {leaveVotes} </Text>
                </Pressable>
            </View>

            <Text> За то, чтобы все игроки остались: </Text>
            <View style={{ width: 60, height: 60 }}>
                <Pressable style={playerButtons.primary}>
                    <Text> {defineStayVotes()} </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default VoteBreakingMenu;