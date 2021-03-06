import React, { Component } from 'react'
import { StyleSheet, Image, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native'
import RadioButton from '../Components/RadioButton'

const firebase = require("firebase");
require("firebase/firestore");
import ApiKeys from '../constants/ApiKeys';
import { NavigationContainer } from '@react-navigation/native';

export default class RegistrationPage extends Component {

    state = {
        name:'',
        email:'',
        userType:0,
        password:'',
        confirmPassword:'',
        serviceSeekerCheck:false,
        freelancerCheck:false
    }


    
    radioHandler = () => {
        if(this.state.freelancerCheck){
            this.setState({freelancerCheck:false});
        }
        this.setState({userType:0});
        this.setState({serviceSeekerCheck:true});
    }
        
    radioHandler2 = () => {
        if(this.state.serviceSeekerCheck){
            this.setState({serviceSeekerCheck:false});
        } 
        this.setState({userType:1});
        this.setState({freelancerCheck:true});
    }


    onFooterLinkPress = () => {
        this.props.navigation.navigate('LoginPage')
    }

    onRegisterPress = () => {

        if (this.state.password !== this.state.confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }

        firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( async (response) => {
                const uid = response.user.uid
                const data = {
                    id: uid,
                    email:this.state.email,
                    name:this.state.name,
                    userType:this.state.userType
                };
                const usersRef = firebase.firestore().collection('users')
                await usersRef
                    .doc(uid)
                    .set(data)
                    .catch((error) => {
                        alert(error)
                    });

                var profileData = {
                    id: uid,
                    name:this.state.name,
                };

                if (this.state.userType === 0){
                    profileData["profilePicture"] = "";
                    profileData["phoneNumber"] = "";
                    profileData["reviews"] = [];
                    profileData["jobs"] = [];
                    profileData["bio"] = "";
                    profileData["introduction"] = "";
                    profileData["credentials"] = [];
                    profileData["averageRating"] = 0.0;
                    const ssRef = firebase.firestore().collection('ss')
                    await ssRef
                    .doc(uid)
                    .set(profileData)
                    .catch((error) => {
                        alert(error)
                    });
                }

                if (this.state.userType === 1){

                    profileData["freelancerType"] = "";
                    profileData["profilePicture"] = "";
                    profileData["phoneNumber"] = "";
                    profileData["reviews"] = [];
                    profileData["bio"] = "";
                    profileData["introduction"] = "";
                    profileData["credentials"] = [];
                    profileData["averageRating"] = 0.0;
                    profileData["portfolioGallery"] = [];
                    profileData["locations"] = [];
                    profileData["serviceFee"] = "";



                    const freelancerRef = firebase.firestore().collection('freelancers')
                    await freelancerRef
                    .doc(uid)
                    .set(profileData)
                    .catch((error) => {
                        alert(error)
                    });
                }

                //this.props.navigation.navigate('LoginPage')

                Alert.alert(
                    'Registration Successful',
                    'Log in',
                    [
                      { text: 'OK', onPress: () => this.props.navigation.navigate('LoginPage', data) }
                    ],
                    { cancelable: false }
                  );
            })
            .catch((error) => {
                alert(error)
        });
    }

    render(){
        return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, width: '100%' }}>
                <Image
                    style={styles.logo}
                    source={require('../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => this.setState({name:text})}
                    value={this.state.name}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => this.setState({email:text})}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <View style={{ height: 48, flexDirection: 'row' , alignItems: "center", justifyContent: 'center'}}>
                    <Text style={{ fontSize: 16, color: "#aaaaaa"}}>Service Seeker:</Text>
                    <RadioButton checked={this.state.serviceSeekerCheck} onPress={this.radioHandler}/>
                    <Text style={{ fontSize: 16, color: "#aaaaaa"}}>Freelancer:</Text>
                    <RadioButton checked={this.state.freelancerCheck} onPress={this.radioHandler2}/>
                </View>

                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => this.setState({password:text})}
                    value={this.state.password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => this.setState({confirmPassword:text})}
                    value={this.state.confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={this.onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </ScrollView>
        </View>
    )

}
}


const styles= StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {

    },
    logo: {
        flex: 1,
        height: 90,
        width: 90,
        alignSelf: "center",
        margin: 30
    },
    input: {
        height: 48,
        width: 280,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    }
});
