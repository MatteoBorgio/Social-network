import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import axios from "axios"
import Post from "./Post"

export default function Posts() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://192.168.1.6:5000/api/post/get-all-posts')
            if (response.data.success) {
                const data = response.data.results
                setPosts(data)
            } else {
                throw new Error(response.data.error)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        getPosts()
    }, [])

    if (isLoading && posts.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0064E0" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => <Post post={item} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F2F5'
    },
    listContainer: {
        paddingBottom: 20
    }
})