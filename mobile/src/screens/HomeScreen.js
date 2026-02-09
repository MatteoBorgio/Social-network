import {Button, Text, View} from "react-native";

export default function HomeScreen({ navigation }) {
    return (
        <View>
            <Text>Home Page</Text>
            <Button title={"Vai al login"} onPress={navigation.navigate('Signin')} />
        </View>
    )
}