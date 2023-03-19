import { Pressable, Image } from "react-native";
import { buttons, playerButtons } from "../styles";

const PlayerCancelButton = (props) => {
    return (
        <Pressable
            style={({ pressed }) =>
                [
                    pressed ? buttons.pressed : buttons.primary,
                    playerButtons.cancel,
                ]}
            onPress={() => {
                props.setIsCancelActive(false);
                props.cancelFunction();
            }}
        >
            <Image
                source={require("../icons/cancel.png")}
                style={{width: 15, height: 15}}
            />
        </Pressable>
    );
}

export default PlayerCancelButton;