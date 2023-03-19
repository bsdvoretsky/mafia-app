import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { GameStateContext } from "../context/GameStateContext";
import { PlayersContext } from "../context/PlayersContext";
import CountPanelButton from "./CountPanelButton";

const CountPanel = (props) => {
    const styles = StyleSheet.create({
        container: {
            width: '94%',
            position: 'absolute',
            left: '3%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: '#D3D3D3',
            top: '5%',
        }
    });

    const players = useContext(PlayersContext);
    const gameState = useContext(GameStateContext);

    const generateCountPanelButtons = () => {
        let availableVotes = 0;
        let buttons = [];
        for (let i = 0; i < 10; i++) {
            if (
                players[i].status === 0
                || players[i].status === 1
                || players[i].status === 3
            ) {
                if (gameState === 4 || gameState === 7) {
                    availableVotes -= players[i].voteCount;
                }
                availableVotes++;
            }
        }

        for (let i = 0; i <= 10; i++) {
            if (i <= availableVotes) {
                buttons.push(<CountPanelButton getAvailableVotes={props.getAvailableVotes} available={true} key={i} value={i} />);
            } else {
                buttons.push(<CountPanelButton getAvailableVotes={props.getAvailableVotes} available={false} key={i} value={i} />);
            }
        }

        return buttons;
    }

    return (
        <View style={styles.container}>
            {generateCountPanelButtons()}
        </View>
    );
}

export default CountPanel;