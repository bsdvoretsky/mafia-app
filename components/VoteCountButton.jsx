import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { buttons, playerButtons } from "../styles";
import { PlayersContext } from "../context/PlayersContext";
import { SelectedPlayerContext } from "../context/SelectedPlayerContext";
import { SetSelectedPlayerContext } from "../context/SetSelectedPlayerContext";

const VoteCountButton = (props) => {
    const players = useContext(PlayersContext);
    const selectedPlayer = useContext(SelectedPlayerContext);
    const setSelectedPlayer = useContext(SetSelectedPlayerContext);

    return (
        <View style={{ width: 60, height: 60 }}>
            <Pressable
                style={({ pressed }) =>
                    [
                        playerButtons.primary,
                        pressed ? buttons.pressed : buttons.primary,
                        {
                            backgroundColor: props.number === selectedPlayer ? "#ADD8E6" : "#F5F5F5",
                        }
                    ]}
                onPress={() => {
                    if (selectedPlayer === props.number) {
                        setSelectedPlayer(-1);
                    } else {
                        setSelectedPlayer(props.number);
                    }
                }}
            >
                <Text style={{ fontSize: 18 }}> {players[props.number].voteCount} </Text>
            </Pressable>
        </View>
    );
}

export default VoteCountButton;