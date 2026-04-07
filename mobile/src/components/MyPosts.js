/**
 * File for the render of all the user posts
 * in the setting section
 * Need a verified user
 */

import { ActivityIndicator, FlatList, View, StyleSheet, Text, ListEmptyComponent } from "react-native"
import { useEffect, useState, useContext } from "react"
import axios from "axios"
import Post from "./Post"
import { UserContext } from "../context/UserContext";
import { SERVER_URL } from "../../config/config.js";

export default function MyPosts() {
    const [myPosts, setMyPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useContext(UserContext)

    const getPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${ SERVER_URL }/post/get-my-posts`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            })

            if (response.data.success) {
                const data = response.data.results
                setMyPosts(data)
            } else {
                throw new Error(response.data.error)
            }
        } catch (error) {
            console.log("Errore nel recupero dei post:", error.response?.data || error.message)
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (user?.token) {
            getPosts()
        }
    }, [user?.token])

    if (isLoading && myPosts.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0064E0" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={myPosts}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => <Post post={item} />}
                ListEmptyComponent={
                    !isLoading && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Non hai ancora pubblicato nulla.</Text>
                        </View>
                    )
                }
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
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        fontSize: 16,
        color: '#65676B',
        fontWeight: '500'
    }
})
