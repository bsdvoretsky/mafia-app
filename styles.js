import { StyleSheet } from "react-native";

const buttons = StyleSheet.create({
    primary: {
        transform: [{ scale: 1 }]
    },
    pressed: {
        transform: [{ scale: 0.97 }]
    }
});

const playerButtons = StyleSheet.create({
    primary: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    cancel: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 25,
        height: 25,
        backgroundColor: '#FF7F7F',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export { buttons, playerButtons }