import { useEffect, useContext } from "react"
import { StyleSheet, View } from "react-native"
import { UserContext } from "../context/UserContext"
import Posts from "../components/Posts"

export default function HomeScreen({ navigation }) {
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (!user) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth", params: { screen: "Signup" } }],
            })
        }
    }, [user]);

    return (
        <Posts />
    )
}

const styles = StyleSheet.create({
})