import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const VerifyCode = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.replace('NewPassword')}
            >
                <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Verify Code</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                Please enter the code we just sent to your email {'\n'}
                <Text style={styles.email}>reman@gmail.com</Text>
            </Text>

            {/* Code Inputs */}
            <View style={styles.codeContainer}>
                <TextInput style={styles.codeInput} maxLength={1} keyboardType="numeric" />
                <TextInput style={styles.codeInput} maxLength={1} keyboardType="numeric" />
                <TextInput style={styles.codeInput} maxLength={1} keyboardType="numeric" />
                <TextInput style={styles.codeInput} maxLength={1} keyboardType="numeric" />
            </View>

            {/* Resend Code */}
            <TouchableOpacity>
                <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>

            {/* Verify Button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#fff', 
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
        marginTop: 50, // Beri jarak agar tidak bertabrakan dengan panah
    },
    subtitle: { 
        fontSize: 16, 
        color: '#888888', 
        marginBottom: 25, 
        textAlign: 'center',
    },
    email: { 
        color: '#FF7F50', 
        fontWeight: 'bold',
    },
    codeContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 25,
        width: '80%', 
        alignSelf: 'center', 
    },
    codeInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 18,
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    resendText: { 
        textAlign: 'center', 
        color: '#FF7F50', 
        marginBottom: 20,
    },
    button: { 
        backgroundColor: '#FF7F50', 
        padding: 15, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
});

export default VerifyCode;
