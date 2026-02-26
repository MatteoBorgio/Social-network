import {Text, View, Image, StyleSheet, TouchableOpacity} from "react-native"
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";
import axios from "axios";

export default function Post({ post }) {
    const { user } = useContext(UserContext);

    const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id) || false)
    const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 0);

    const handleClick = async () => {
        const previousCount = likesCount;

        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount + -1 : likesCount + 1);

        try {
            await axios.put(`http://192.168.1.6:5000/api/post/${post._id}/like`, {
                userId: user._id
            });
        } catch (error) {
            console.log("Errore durante il like: ", error);
            setIsLiked(!isLiked);
            setLikesCount(previousCount);
        }
    }
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image
                    source={{
                        uri: post.user?.profilePicture || 'https://via.placeholder.com/150'
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.username}>
                    {post.user?.username || 'Utente anonimo'}
                </Text>
            </View>

            <View style={styles.body}>
                {post.title ? <Text style={styles.title}>{post.title}</Text> : null}
                {post.description ? <Text style={styles.description}>{post.description}</Text> : null}
            </View>

            {post.image ? (
                <Image
                    source={{ uri: post.image }}
                    style={styles.postImage}
                    resizeMode="cover"
                />
            ) : null}

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => handleClick()}>
                    <Text style={styles.likes}>
                        {likesCount} {likesCount > 1 ? "Likes" : "Like"}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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