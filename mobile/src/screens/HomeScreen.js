import { useEffect, useContext } from "react";
import { Button, Text, View } from "react-native";
import { UserContext } from "../context/UserContext";

export default function HomeScreen({ navigation }) {
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth", params: { screen: "Signup" } }],
            });
        }
    }, [user]);

    return (
        <View>
            <Text>Home Page</Text>
            <Button
                title="Vai al login"
                onPress={() =>
                    navigation.navigate("Auth", { screen: "Signin" })
                }
            />
        </View>
    );
}