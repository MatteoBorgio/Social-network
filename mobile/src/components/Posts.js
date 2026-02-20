import { ActivityIndicator, FlatList, Text, View, Image, StyleSheet } from "react-native"
import {useEffect, useState} from "react"
import axios from "axios"

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
                renderItem={({ item }) => {
                    return (
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <Image
                                    source={{
                                        uri: item.user?.profilePicture || 'https://via.placeholder.com/150'
                                    }}
                                    style={styles.avatar}
                                />
                                <Text style={styles.username}>
                                    {item.user?.username || 'Utente anonimo'}
                                </Text>
                            </View>

                            <View style={styles.body}>
                                {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
                                {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
                            </View>

                            {item.image ? (
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.postImage}
                                    resizeMode="cover"
                                />
                            ) : null}

                            <View style={styles.footer}>
                                <Text style={styles.likes}>
                                    {item.likes?.length || 0} {item.likes?.length === 1 ? "Like" : "Likes"}
                                </Text>
                                <Text style={styles.date}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    )
                }}
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
    card: {
        backgroundColor: '#FFFFFF',
        marginBottom: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E4E6EB'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#E4E6EB'
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#050505'
    },
    body: {
        paddingHorizontal: 12,
        paddingBottom: 10
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#050505',
        marginBottom: 4
    },
    description: {
        fontSize: 14,
        color: '#050505',
        lineHeight: 20
    },
    postImage: {
        width: '100%',
        height: 350,
        backgroundColor: '#E4E6EB'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E4E6EB'
    },
    likes: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0064E0'
    },
    date: {
        fontSize: 13,
        color: '#65676B'
    }
})