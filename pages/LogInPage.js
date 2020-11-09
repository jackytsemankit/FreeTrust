
import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import styles from './LoginPageStyles';

const firebase = require("firebase");
require("firebase/firestore");
import ApiKeys from '../constants/ApiKeys';

export default function LoginPage({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // const onFooterLinkPress = () => {
    //     navigation.navigate('Registration')
    // }

    const onLoginPress = () => {
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
            const uid = response.user.uid
            const usersRef = firebase.firestore().collection('users')
            usersRef
                .doc(uid)
                .get()
                .then(firestoreDocument => {
                    if (!firestoreDocument.exists) {
                        alert("User does not exist")
                        return;
                    }
                    const user = firestoreDocument.data()

                    // navigation.navigate('Home', {user})
                })
                .catch(error => {
                    alert(error)
                });
        })
        .catch(error => {
            alert(error)
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image
                    style={styles.logo}
                    source={require('../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                {/* <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View> */}
            </ScrollView>
        </View>
    )
}