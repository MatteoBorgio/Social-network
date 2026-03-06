import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CreatePostIcon() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('CreatePost')}
            activeOpacity={0.8}
        >
            <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#0064E0',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    }
});