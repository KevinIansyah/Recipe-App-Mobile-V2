import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NewPassword = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.replace('SignIn')}
            >
                <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>New Password</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                Your new password must be different from previously used passwords
            </Text>

            {/* Input Fields */}
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                secureTextEntry 
                placeholderTextColor="#BDBDBD" 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Confirm Password" 
                secureTextEntry 
                placeholderTextColor="#BDBDBD" 
            />

            {/* Button */}
            <TouchableOpacity 
                onPress={() => navigation.replace('VerifyCode')} 
                style={styles.button}
            >
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#FFFFFF', 
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        textAlign: 'center',
        marginTop: 50,
    },
    subtitle: { 
        fontSize: 16, 
        color: '#888888', 
        marginBottom: 40, 
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        marginBottom: 15,
        color: '#333333',
    },
    button: {
        backgroundColor: '#FF7F50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NewPassword;
