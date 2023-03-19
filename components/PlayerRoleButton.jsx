import { Pressable, View, Image } from "react-native";
import { buttons, playerButtons } from "../styles";
import { SelectedPlayerContext } from "../context/SelectedPlayerContext";
import { useContext } from "react";
import { SetSelectedPlayerContext } from "../context/SetSelectedPlayerContext";
import { PlayerNumberContext } from "../context/PlayerNumberContext";
import { GameStateContext } from "../context/GameStateContext";

const PlayerRoleButton = (props) => {
    const selectedPlayer = useContext(SelectedPlayerContext);
    const setSelectedPlayer = useContext(SetSelectedPlayerContext);
    const gameState = useContext(GameStateContext);
    const number = useContext(PlayerNumberContext);

    return (
        <View style={{width: 60, height: 60}}>
            <Pressable
                style={({ pressed }) =>
                    [
                        playerButtons.primary,
                        pressed ? buttons.pressed : buttons.primary,
                        {
                            backgroundColor: 
                            (
                                selectedPlayer === number 
                                && gameState === 0
                            )
                            ? "#ADD8E6" : "#F5F5F5",
                        }
                    ]}
                onPress={() => {
                    if (!props.canChange) return;
                    setSelectedPlayer(number);
                }}
            >
                {
                    props.role === "Дон"
                        ? <Image source={require("../icons/don.png")}
                            style={{ width: 30, height: 30 }} />
                        : null
                }
                {
                    props.role === "Мафия"
                        ? <Image source={require("../icons/mafia.png")}
                            style={{ width: 30, height: 30 }} />
                        : null
                }
                {
                    props.role === "Шериф"
                        ? <Image source={require("../icons/chief.png")}
                            style={{ width: 30, height: 30 }} />
                        : null
                }
                {
                    props.role === "Мирный"
                        ? <Image source={require("../icons/civilian.png")}
                            style={{ width: 30, height: 30 }} />
                        : null
                }
            </Pressable>
        </View>
    );
}

export default PlayerRoleButton;