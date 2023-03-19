import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { SelectedPlayerContext } from "../context/SelectedPlayerContext";
import RolePickerButton from "./RolePickerButton";

const RolePicker = () => {
    const selectedPlayer = useContext(SelectedPlayerContext);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            position: 'absolute',
        },
    });

    return (
        <View style={styles.container}>
            <RolePickerButton role={"Дон"} />
            <RolePickerButton role={"Мафия"} />
            <RolePickerButton role={"Шериф"} />
            <RolePickerButton role={"Мирный"} />
        </View>
    );
}

export default RolePicker;