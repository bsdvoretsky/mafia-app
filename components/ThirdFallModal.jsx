import { useContext } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { PlayersContext } from "../context/PlayersContext";
import { SelectedPlayerContext } from "../context/SelectedPlayerContext";
import { SetPlayersContext } from "../context/SetPlayersContext";
import { SetShowThirdFallModalContext } from "../context/SetShowThirdFallModalContext";

const ThirdFallModal = (props) => {
    const players = useContext(PlayersContext);
    const selectedPlayer = useContext(SelectedPlayerContext);
    const setShowThirdFallModal = useContext(SetShowThirdFallModalContext);
    const setPlayers = useContext(SetPlayersContext);

    const styles = StyleSheet.create({
        wrapper: {
            backgroundColor: '#f5f5f5',
            padding: 10,
            margin: 3,
        },
        text: {
            color: '#000'
        }
    });

    return (
        <View
            style={{
                position: 'absolute',
                left: '30%',
                top: `${5 + selectedPlayer * 9 - 3}%`,
                backgroundColor: '#333'
            }}
        >
            <Pressable
                style={styles.wrapper}
                onPress={() => {
                    const newPlayers = JSON.parse(JSON.stringify(players));

                    newPlayers[selectedPlayer].canSpeak = false;
                    newPlayers[selectedPlayer].hadVoiceLimit = true;
                    
                    setPlayers(newPlayers);
                    setShowThirdFallModal(false);
                }}
            >
                <Text style={styles.text}> В этот день</Text>
            </Pressable>
            <Pressable
                style={styles.wrapper}
                onPress={() => {
                    setShowThirdFallModal(false);
                }}
            >
                <Text style={styles.text}> В следующий день</Text>
            </Pressable>
        </View>
    );
}

export default ThirdFallModal;