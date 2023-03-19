import { useState, useContext } from "react";
import { Pressable, View, Image } from "react-native";
import { buttons, playerButtons } from "../styles";
import { PlayerNumberContext } from "../context/PlayerNumberContext";
import { VotedPlayersContext } from "../context/VotedPlayersContext";
import { SetVotedPlayersContext } from "../context/SetVotedPlayersContext";
import { PlayersContext } from "../context/PlayersContext";
import { SetPlayersContext } from "../context/SetPlayersContext";
import { isVoitingDayContext } from "../context/isVoitingDayContext";
import PlayerCancelButton from "./PlayerCancelButton";

const PlayerVoteButton = () => {
    const [isCancelActive, setIsCancelActive] = useState(false);
    const number = useContext(PlayerNumberContext);
    const votedPlayers = useContext(VotedPlayersContext);
    const setVotedPlayers = useContext(SetVotedPlayersContext);
    const players = useContext(PlayersContext);
    const setPlayers = useContext(SetPlayersContext);
    const isVoitingDay = useContext(isVoitingDayContext);

    const cancelFunction = () => {
        for (let i = 0; i < votedPlayers.length; i++) {
            if (votedPlayers[i] === number + 1) {
                let newVotedPlayers = [...votedPlayers];
                newVotedPlayers = newVotedPlayers.slice(0, i).concat(newVotedPlayers.slice(i + 1));
                setVotedPlayers(newVotedPlayers);
                let newPlayers = JSON.parse(JSON.stringify(players));
                newPlayers[number].status = 0;
                setPlayers(newPlayers);
                break;
            }
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
                            opacity: isVoitingDay ? 1 : 0.2
                        }
                    ]
                }
                onPress={() => {
                    if (isVoitingDay) {
                        if (isCancelActive) {
                            setIsCancelActive(false);
                            return;
                        }

                        for (let i = 0; i < votedPlayers.length; i++) {
                            if (number + 1 === votedPlayers[i])
                                return;
                        }

                        let newVotedPlayers = [...votedPlayers];
                        newVotedPlayers.push(number + 1);
                        setVotedPlayers(newVotedPlayers);
                        let newPlayers = JSON.parse(JSON.stringify(players));
                        newPlayers[number].status = 1;
                        setPlayers(newPlayers);
                    }
                }}
                onLongPress={() => {
                    if (isVoitingDay) {
                        setIsCancelActive(!isCancelActive);
                    } else {
                        for (let i = 0; i < votedPlayers.length; i++) {
                            if (number + 1 === votedPlayers[i])
                                return;
                        }

                        let newVotedPlayers = [...votedPlayers];
                        newVotedPlayers.push(number + 1);
                        setVotedPlayers(newVotedPlayers);
                        let newPlayers = JSON.parse(JSON.stringify(players));
                        newPlayers[number].status = 1;
                        setPlayers(newPlayers);
                    }
                }}
            >
                <Image
                    source={require("../icons/vote.png")}
                    style={{ width: 30, height: 30 }}
                />
            </Pressable>
            {
                isCancelActive
                    ?
                    <PlayerCancelButton cancelFunction={cancelFunction}
                        setIsCancelActive={setIsCancelActive} />
                    : null
            }
        </View>
    );
}

export default PlayerVoteButton;