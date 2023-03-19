import { useState, useContext } from "react";
import { View, Pressable, Image } from "react-native";
import { buttons, playerButtons } from "../styles";
import { PlayerNumberContext } from "../context/PlayerNumberContext";
import { SelectedPlayerContext } from "../context/SelectedPlayerContext";
import { SetSelectedPlayerContext } from "../context/SetSelectedPlayerContext";
import PlayerCancelButton from "./PlayerCancelButton";

const PlayerKillButton = () => {
    const [isCancelActive, setIsCancelActive] = useState(false);
    const number = useContext(PlayerNumberContext);
    const selectedPlayer = useContext(SelectedPlayerContext);
    const setSelectedPlayer = useContext(SetSelectedPlayerContext);

    const cancelFunction = () => {
        if (selectedPlayer === number) {
            setSelectedPlayer(-1);
        }
    }

    return (
        <View style={{ width: 60, height: 60 }}>
            <Pressable
                style={({ pressed }) =>
                    [
                        playerButtons.primary,
                        pressed ? buttons.pressed : buttons.primary,
                        {
                            backgroundColor: number === selectedPlayer ? '#F74E4E' : '#F5F5F5' 
                        }
                    ]}
                onPress={() => {
                    if (isCancelActive) {
                        setIsCancelActive(false);
                        return;
                    }
                    setSelectedPlayer(number);
                }}
                onLongPress={() => {
                    if (number !== selectedPlayer) return;
                    setIsCancelActive(!isCancelActive);
                }}
            >
                <Image
                    source={require("../icons/kill.png")}
                    style={{ width: 30, height: 30 }}
                />
            </Pressable>
            {
                isCancelActive
                    ? <PlayerCancelButton cancelFunction={cancelFunction}
                        setIsCancelActive={setIsCancelActive} />
                    : null
            }
        </View>
    );
}

export default PlayerKillButton;