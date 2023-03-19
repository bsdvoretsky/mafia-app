import { Pressable, Text, StyleSheet, Vibration } from "react-native";
import { buttons } from "../styles"

const Timer = (props) => {
    const styles = StyleSheet.create({
        container: {
            height: '80%',
            aspectRatio: '1 / 1',
            borderRadius: 4,
            borderWidth: 2,
            borderColor: "#FFFFFF",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    });

    return (
        <Pressable
            onPress={() => {
                Vibration.vibrate();
                props.setDuration(props.time);
                props.setKey(key => key + 1);
                props.setIsTimerPlaying(true);
            }}

            style={({ pressed }) =>
                [
                    pressed ? buttons.pressed : buttons.primary,
                    props.style,
                    styles.container,
                ]
            }
        >
            <Text style={{ fontSize: 20, color: '#FFFFFF' }}> {props.time} </Text>
        </Pressable>
    );
}

export default Timer;