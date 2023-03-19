import { useContext } from "react";
import { Pressable, StyleSheet, Image } from "react-native";
import { buttons } from "../styles";
import { PlayersContext } from "../context/PlayersContext";
import { SetPlayersContext } from "../context/SetPlayersContext";
import { SelectedPlayerContext } from "../context/SelectedPlayerContext";

const RolePickerButton = (props) => {
    const players = useContext(PlayersContext);
    const setPlayers = useContext(SetPlayersContext);
    const selectedPlayer = useContext(SelectedPlayerContext);

    const styles = StyleSheet.create({
        container: {
            width: '47%',
            aspectRatio: '1 / 1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 32,
            backgroundColor: "#E9E9E9",
            margin: 2
        }
    });

    return (
        <Pressable
            style={({ pressed }) =>
                [
                    styles.container,
                    pressed ? buttons.pressed : buttons.primary
                ]
            }
            onPress={() => {
                let don = 0;
                let chief = 0;
                let mafia = 0;
                for (let i = 0; i < 10; i++) {
                    switch(players[i].role) {
                        case "Дон":
                            don++;
                            break;
                        case "Мафия":
                            mafia++;
                            break;
                        case "Шериф":
                            chief++;
                            break;
                    }
                }
                if (
                    props.role === "Дон" && don === 1
                    || props.role === "Мафия" && mafia === 2
                    || props.role === "Шериф" && chief === 1
                ) return;
                
                let newPlayers = JSON.parse(JSON.stringify(players));
                newPlayers[selectedPlayer].role = props.role;
                setPlayers(newPlayers);
            }}
        >
            {
                () => {
                    switch (props.role) {
                        case "Дон":
                            return <Image
                                source={require("../icons/don.png")}
                                style={{ width: '90%', height: '90%' }}
                            />
                        case "Мафия":
                            return <Image
                                source={require("../icons/mafia.png")}
                                style={{ width: '90%', height: '90%' }}
                            />
                        case "Шериф":
                            return <Image
                                source={require("../icons/chief.png")}
                                style={{ width: '90%', height: '90%' }}
                            />
                        case "Мирный":
                            return <Image
                                source={require("../icons/civilian.png")}
                                style={{ width: '90%', height: '90%' }}
                            />
                    }
                }
            }
        </Pressable>
    );
}

export default RolePickerButton;