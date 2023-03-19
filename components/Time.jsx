import { View, Text } from "react-native";

const Time = (props) => {
    const getStringTime = (time) => {
        let res = "";
        res += Math.floor(time / 10000).toString();
        res += Math.floor(time % 10000 / 1000).toString();
        res += "."
        res += Math.floor(time % 1000 / 100).toString();
        res += Math.floor(time % 100 / 10).toString();
        return res;
    }

    return (
        <View>
            <Text style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 40,
            }}>
                {getStringTime(props.time)}
            </Text>
        </View>
    );
}

export default Time;