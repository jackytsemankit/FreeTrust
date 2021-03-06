


import React from 'react';
import { ScrollView, TextInput, Image, TouchableHighlight ,TouchableOpacity, Alert, StyleSheet,  View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
import ImageModal from 'react-native-image-modal';
import DialogInput from 'react-native-dialog-input';
import { Divider, Text } from 'react-native-paper';

import * as firebase from 'firebase';


import SearchPage from '../SearchPage';
import PickFreelanceToSearchPage from '../PickFreelanceToSearchPage';



export default class FreelancerEditProfile extends React.Component {

    

    
    

    constructor(props){
        super(props);
        this.state = {
                  id:"",
                  profilePicture:"",
                  name:"",
                  freelancerType:"",
                  locations:[],
                  serviceFee:"",
                  bio:"",
                  introduction:"",
                  credentials:[],
                  portfolioGallery:[],
                  phoneNumber:"",
                  isDialogVisible:false,
                  PGIndex:0
                }
        if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
       
        firebase.firestore().collection("freelancers").doc(this.props.route.params.item.id).onSnapshot(doc=>{
                  

          this.setState({
            id:doc.id,
            name:doc.data().name,
            freelancerType:doc.data().freelancerType,
            locations:doc.data().locations,
            serviceFee:doc.data().serviceFee,
            bio:doc.data().bio,
            introduction:doc.data().introduction,
            credentials:doc.data().credentials,
            portfolioGallery:doc.data().portfolioGallery,
            phoneNumber:doc.data().phoneNumber
                            
          })

  
        })

        firebase
          .storage()
          .ref()
          .child(this.props.route.params.item.id+'_dp')
          .getDownloadURL()
          .then((url) => {
            this.setState({profilePicture: url});
          })
          .catch((e) => console.log('dp not uploaded ', e));
          

    }

       
        
  
          
    

saveOnPress(){
  var ref = firebase.firestore().collection("freelancers").doc(this.props.route.params.item.id);
  ref.update(
    {
      serviceFee:this.state.serviceFee,
      locations:this.state.locations,
      bio:this.state.bio,
      freelancerType:this.state.freelancerType,
      introduction:this.state.introduction,
      phoneNumber:this.state.phoneNumber,
    }
      ).then(()=>{
        Alert.alert(
    'Profile Updated',
    'Your Profile Has Updated',
    [
      { text: 'OK', onPress: () => this.props.navigation.navigate('PersonalProfilePage') }
    ],
    { cancelable: false }
    )
    })
  .catch(function error(e){
    Alert.alert(
      'Some fields are empty',
      'Please fill in all the fields',
      [
        { text: 'OK'}
      ],
      { cancelable: false }
      )



  })

        
  
  
}

locationsOnPress (loc){
  let locs = this.state.locations

  var i = locs.indexOf(loc)

  if (i>-1){
    locs.splice(i,1)
  }
  else{
    locs.push(loc)
  }

  this.setState({locations:locs})
}

locButtonStat(loc){
  if (this.state.locations.length>=4){
    if (this.state.locations.indexOf(loc)>-1){
      return false;
    }
    return true;
  }
  return false;
}


  _pickImage = async (imgType) => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaType: 'photo',
      allowsEditing: true,
      //aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult,imgType);
  };

  
  _handleImagePicked = async (pickerResult,imgType) => {
    try {

      if (!pickerResult.cancelled) {
        const uploadUrl = await this.uploadImageAsync(pickerResult.uri,imgType);

        if (imgType=='dp'){
          //console.log(uploadUrl)
          this.setState({ profilePicture: uploadUrl });
          firebase.firestore().collection("freelancers").doc(this.props.route.params.item.id).update({profilePicture:this.state.profilePicture})
        }
        if (imgType=='c'){
          //console.log(uploadUrl)
          var c = this.state.credentials
          var newC ={imgName:this.state.id+'_c_'+this.state.credentials.length,url:uploadUrl};  

          c.push(newC)

          this.setState({ credentials: c });
          firebase.firestore().collection("freelancers").doc(this.props.route.params.item.id).update({credentials:this.state.credentials})

        }

        if (imgType=='pg'){
          console.log(uploadUrl)
          var pg = this.state.portfolioGallery
          var newPg ={imgName:this.state.id+'_pg_'+this.state.portfolioGallery.length,url:uploadUrl};  

          pg.push(newPg)

          this.setState({ portfolioGallery: pg });
          firebase.firestore().collection("freelancers").doc(this.props.route.params.item.id).update({portfolioGallery:this.state.portfolioGallery})

        }
        
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } 
  };

  uploadImageAsync = async (uri,imgType)=> {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });


    let ref=null;


    if (imgType=='dp'){
      ref = firebase
      .storage()
      .ref()
      .child(this.state.id+'_dp');
    }

    else if(imgType=='c'){
      
      var cid=this.state.credentials.length;

      ref = firebase
      .storage()
      .ref()
      .child(this.state.id+'_c_'+cid);

 
    }

    else if(imgType=='pg'){
      
      var cid=this.state.portfolioGallery.length;

      ref = firebase
      .storage()
      .ref()
      .child(this.state.id+'_pg_'+cid);

 
    }
    


    const snapshot = await ref.put(blob);
  
    blob.close();

    
    return await snapshot.ref.getDownloadURL();
  };


  deleteButton(img,imgType){
    console.log(img.imgName)
    Alert.alert(
      "Delete Picture",
      "Are you sure you want to delete this?",
      [
        {
          text: "Yes",
          onPress: () => {

            firebase.storage().ref().child(img.imgName).delete().then(()=> {
              if (imgType=='c'){
                let c=this.state.credentials
                const index = c.indexOf(img);
                if (index > -1) {
                  c.splice(index, 1);
                  this.setState({ credentials: c });
                  firebase.firestore().collection("freelancers").doc(this.props.route.params.item.id).update({credentials:this.state.credentials})
                }
              }

              if (imgType=='pg'){
                let pg=this.state.portfolioGallery
                const index = pg.indexOf(img);
                if (index > -1) {
                  pg.splice(index, 1);
                  this.setState({ portfolioGallery: pg });
                  firebase.firestore().collection("freelancers").doc(this.props.route.params.item.id).update({portfolioGallery:this.state.portfolioGallery})
                }
              }
              

              Alert.alert(
                "Delete Successful",
                "Delete Successful",
                [
                  {
                    text: "OK",
                  },
                ],
                { cancelable: false }
              );
            }).catch(function(error) {
              console.log(error)
              // Uh-oh, an error occurred!
              Alert.alert(
                "Delete Failed",
                "Delete Failed",
                [
                  {
                    text: "OK",
                  },
                ],
                { cancelable: false }
              );
            });
          }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );

  }


 render() {

    
     return (  

      <ScrollView style={{ backgroundColor: 'white' }}>


        

          <TouchableHighlight style={{overflow:'hidden',borderRadius:50,alignSelf: 'center'}} onPress={()=>this._pickImage('dp')}>

          <Image 
          style={styles.tinyLogo}          
          source={this.state.profilePicture?{uri: this.state.profilePicture,}:require('../../assets/blankdp.jpg')}
          />

          
          </TouchableHighlight>
        <Text style={{alignSelf: 'center', fontSize: 15}}>(Click above to change display picture)</Text>
        <Text style={{alignSelf: 'center', fontSize: 25}}>{this.state.name}</Text>


        <View style={{flexDirection:"column", alignItems: 'center'}}>
        <DropDownPicker
         placeholder="Freelance Type: "
          items={[
              {label: 'Emcee', value: 'Emcee'},
              {label: 'Fitness Coach', value: 'Fitness Coach'},
              {label: 'Graphic Designer', value: 'Graphic Designer'},
              {label: 'Magician', value: 'Magician'},
              {label: 'Makeup Artist', value: 'Makeup Artist'},
              {label: 'Photographer', value: 'Photographer'},
              {label: 'Private Tutor', value: 'Private Tutor'},
              {label: 'Translator', value: 'Translator'},
              {label: 'Video Editor', value: 'Video Editor'},
              {label: 'Web Developer', value: 'Web Developer'},
 
              
              
          ]}
          defaultValue={this.state.freelancerType}
          containerStyle={{height: 40, width:150,alignItems: 'center'}}
          onChangeItem={item => this.setState({
            freelancerType: item.value
          })}
        />
        </View>


        <View style={{marginTop:20,width:'90%'}}>
            <View style={{flexDirection:"column", alignItems: 'flex-start'}}>
              <Text style={{marginLeft: 20, fontSize:20, fontWeight: 'bold', color: '#788eec',}}>{`Profile Highlight:`}</Text>
              <Text style={{marginLeft: 20, fontSize:15, color: 'gray',}}>{`(This will appear on the search page)`}</Text>
            </View>
            
            <TextInput

                    style={styles.input,{marginHorizontal:20,marginVertical:10,fontSize:20}}
                    placeholder='Profile Highlight'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => this.setState({bio:text})}
                    value={this.state.bio}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    maxLength={30}
                    borderBottomWidth={1}
                />
            
        </View>


        <View style={{width:'90%'}}>
            <Text style={{marginLeft: 20, fontSize:20, fontWeight: 'bold', color: '#788eec',}}>{`Service Fee:`}</Text>
            <TextInput

                    style={styles.input,{marginHorizontal:20,marginVertical:10,fontSize:20}}
                    placeholder='serviceFee'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => this.setState({serviceFee:text})}
                    value={this.state.serviceFee}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    maxLength={30}
                    borderBottomWidth={1}
                />
            
        </View>

        <View style={styles.container,{flexDirection:"column"}}>
            <View style={{flexDirection:"column", alignItems: 'flex-start'}}>
              <Text style={{marginLeft: 20, fontSize:20, fontWeight: 'bold', color: '#788eec',}}>{`Detailed Self Introduction:`}</Text>
              <Text style={{marginLeft: 20, fontSize:15, color: 'gray'}}>{`(This will appear on your profile page)`}</Text>
            </View>
            
            <View style={{marginHorizontal:20,marginVertical:10,borderWidth:1,padding:10}}>
            <TextInput

                    style={styles.input,{fontSize:20,height:100}}
                    multiline={true}
                    placeholder={`Clients will see your self introduction\nwhen they have clicked into your profile`}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => this.setState({introduction:text})}
                    value={this.state.introduction}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            </View>
            
        </View>

        <View style={styles.container,{flexDirection:"column"}}>
            <View style={{flexDirection:"column", alignItems: 'flex-start'}}>
              <Text style={{marginLeft: 20, fontSize:20, fontWeight: 'bold', color: '#788eec',}}>{`Your contact number:`}</Text>
              <Text style={{marginLeft: 20, fontSize:15, color: 'gray'}}>{`Only those who you have made a connection with can\nsee your contact number:`}</Text>
            </View>

            <View style={{marginHorizontal:20,marginVertical:10,borderWidth:1,padding:10}}>
            <TextInput

                    style={styles.input,{fontSize:20}}
                    placeholder={`Your phone number \n(for communication purposes)`}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => this.setState({phoneNumber:text})}
                    value={this.state.phoneNumber}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            </View>
            
        </View>

        
        

        <View style={{flexDirection:"column"}}>
          <Text style={{marginVertical:10,marginLeft: 20, fontSize:20, fontWeight: 'bold', color: '#788eec',}}>{`Your proof of qualification/ credentials:\n(Don't disclose sensitive information here)`}</Text>
          <View style={{flexDirection:"column"}}>
          <View style={{flexDirection:"column",alignItems:"flex-start", marginLeft:30}}>
            {this.state.credentials.map((img, index) => {
              
              return (
                <View style={{flexDirection:"row", justifyContent:"space-around"}}>

                <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="white"
                    style={{
                      width: 250,
                      height: 250,
                    }}
                    source={{
                      uri: img.url,
                    }}
                  />
                  <TouchableHighlight style={{marginLeft:30,alignSelf: 'center', borderRadius:50}}  onPress={()=>this.deleteButton(img,'c')}>
                    <Image style={{alignSelf: 'center', width: 50, height: 50}} source={require('../../assets/delete.jpg')}/>
                  </TouchableHighlight>
                  
                </View>
              )
            })}
          </View>
            <TouchableHighlight style={{marginLeft:30,alignSelf: 'flex-start'}} onPress={()=>this._pickImage('c')}>
              <Image 
              style={{width: 80, height: 80}}          
              source={require('../../assets/addImage.png')}
              />
              </TouchableHighlight>
          </View>
          <View
            style={{
              marginVertical:10,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          </View>
        

        <View style={{flexDirection:"column"}}>
          <Text style={{marginLeft: 20, fontSize:20, fontWeight: 'bold', color: '#788eec',}}>{`Your Portfolio Gallery`}</Text>
          <View style={{flexDirection:"column"}}>
          <View style={{flexDirection:"column",alignItems:"flex-start", marginLeft:20}}>
            {this.state.portfolioGallery.map((img, index) => {
              
              return (
                <View style={{flexDirection:"row", justifyContent:"space-around"}}>

                <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="white"
                    style={{
                      width: 250,
                      height: 250,
                    }}
                    source={{
                      uri: img.url,
                    }}
                  />
                  <View style={{marginTop:65,alignItems:'center',flexDirection:"column"}}>
                  <TouchableOpacity style={{marginLeft:10,marginBottom:20,width:120, height:70, borderWidth:1, borderRadius:7,backgroundColor:'#76b6fe',  justifyContent: 'center',alignItems:'center' , flexDirection:'column'}}  onPress={()=>this.setState({isDialogVisible:true,PGIndex:index})}>
                    <Image 
                      style={{borderRadius:80,width:35,height:35,overflow:"hidden"}}          
                      source={require('../../assets/write.png')}
                    />            
                    <Text style={{alignSelf:'center',fontSize:15}}>Edit Description</Text>
                  </TouchableOpacity>
                    <TouchableHighlight style={{ borderRadius:50}}  onPress={()=>this.deleteButton(img,'pg')}>
                      <Image style={{alignSelf: 'center', width: 50, height: 50}} source={require('../../assets/delete.jpg')}/>
                    </TouchableHighlight>
                  </View>


                  <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"Edit Description"}
                    message={"Description for portfolio gallery image #" + (parseInt(this.state.PGIndex)+1)}
                    initValueTextInput ={this.state.portfolioGallery[this.state.PGIndex]?this.state.portfolioGallery[this.state.PGIndex].description:null}
                    submitInput={ (inputText) => {this.state.portfolioGallery[this.state.PGIndex].description=inputText  , this.state.isDialogVisible=false, 
                    firebase.firestore().collection("freelancers").doc(this.props.route.params.item.id).update({portfolioGallery:this.state.portfolioGallery}).then(()=>{
                      Alert.alert(
                  'Profile Updated',
                  'Your Profile Has Updated',
                  [
                    { text: 'OK', onPress: () => {}}
                  ],
                  { cancelable: false }
                  )
                  })
                .catch(function error(e){
                  Alert.alert(
                    'Some fields are empty',
                    'Please fill in all the fields',
                    [
                      { text: 'OK'}
                    ],
                    { cancelable: false }
                    )
              
              
              
                })
            }}
                    closeDialog={ () => {this.setState({isDialogVisible:false})}}>
                  </DialogInput>


                </View>
              )
            })}
          </View>
            <TouchableHighlight style={{marginLeft:30,alignSelf: 'flex-start'}} onPress={()=>this._pickImage('pg')}>
              <Image 
              style={{width: 80, height: 80}}          
              source={require('../../assets/addImage.png')}
              />
              </TouchableHighlight>
          </View>

          
        </View>

 
        <View
            style={{
              marginVertical:10,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          >
          </View>
        <View  style={{marginLeft: 20,marginBottom:15,}} ><Text style={{fontSize:20, fontWeight: 'bold', color: '#788eec',}}>{`Your Work Location(s): \n(Select up to 4 choices)`}</Text></View >
        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:'white'}} ><Text style={{textAlign: 'center'}}></Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Online")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Online")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Online")}><Text style={{textAlign: 'center', fontSize:20}}>Online</Text></TouchableOpacity >
              
        </View>

        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("Central and Western")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Central and Western")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Central and Western")}><Text style={{textAlign: 'center', fontSize:15}}>Central and Western</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Eastern")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Eastern")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Eastern")}><Text style={{textAlign: 'center', fontSize:20}}>Eastern</Text></TouchableOpacity >
        </View>


        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("Islands")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Islands")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Islands")}><Text style={{textAlign: 'center', fontSize:20}}>Islands</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Kowloon City")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Kowloon City")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Kowloon City")}><Text style={{textAlign: 'center', fontSize:20}}>Kowloon City</Text></TouchableOpacity >
        </View>

        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("Kwai Tsing")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Kwai Tsing")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Kwai Tsing")}><Text style={{textAlign: 'center', fontSize:20}}>Kwai Tsing</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Kwun Tong")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Kwun Tong")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Kwun Tong")}><Text style={{textAlign: 'center', fontSize:20}}>Kwun Tong</Text></TouchableOpacity >
        </View>

        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("North")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("North")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("North")}><Text style={{textAlign: 'center', fontSize:20}}>North</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Sai Kung")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Sai Kung")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Sai Kung")}><Text style={{textAlign: 'center', fontSize:20}}>Sai Kung</Text></TouchableOpacity >
        </View>

        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("Sha Tin")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Sha Tin")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Sha Tin")}><Text style={{textAlign: 'center', fontSize:20}}>Sha Tin</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Sham Shui Po")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Sham Shui Po")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Sham Shui Po")}><Text style={{textAlign: 'center', fontSize:20}}>Sham Shui Po</Text></TouchableOpacity >
        </View> 

        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("Southern")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Southern")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Southern")}><Text style={{textAlign: 'center', fontSize:20}}>Southern</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Tai Po")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Tai Po")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Tai Po")}><Text style={{textAlign: 'center', fontSize:20}}>Tai Po</Text></TouchableOpacity >
        </View> 

        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("Tsuen Wan")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Tsuen Wan")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Tsuen Wan")}><Text style={{textAlign: 'center', fontSize:20}}>Tsuen Wan</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Tuen Mun")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Tuen Mun")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Tuen Mun")}><Text style={{textAlign: 'center', fontSize:20}}>Tuen Mun</Text></TouchableOpacity >
        </View>

        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("Wan Chai")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Wan Chai")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Wan Chai")}><Text style={{textAlign: 'center', fontSize:20}}>Wan Chai</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Wong Tai Sin")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Wong Tai Sin")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Wong Tai Sin")}><Text style={{textAlign: 'center', fontSize:20}}>Wong Tai Sin</Text></TouchableOpacity >
        </View> 

        <View style={{flexDirection:"row", justifyContent:"space-around", marginBottom:10}}>
              <TouchableOpacity  disabled={this.locButtonStat("Yau Tsim Mong")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Yau Tsim Mong")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Yau Tsim Mong")}><Text style={{textAlign: 'center', fontSize:20}}>Yau Tsim Mong</Text></TouchableOpacity >
              <TouchableOpacity  disabled={this.locButtonStat("Yuen Long")} style={{borderRadius: 15, justifyContent: 'center', height:30, width: '40%', backgroundColor:this.state.locations.indexOf("Yuen Long")>-1?'green':'grey'}} onPress={()=>this.locationsOnPress("Yuen Long")}><Text style={{textAlign: 'center', fontSize:20}}>Yuen Long</Text></TouchableOpacity >
        </View>


        
            <View style={{marginVertical:30,alignItems:'center'}}>
              <TouchableOpacity  style={{width:100,borderRadius:50,backgroundColor:'#788eec'}}  onPress={()=>this.saveOnPress()}><Text style={{alignSelf: 'center',fontSize: 25}}>Save</Text></TouchableOpacity >
            </View>
      </ScrollView>

      

     );

 
}

}



const styles = StyleSheet.create({

  container: {
    flexDirection:"row",
    flex: 2,
    alignItems: 'center'
},

  tinyLogo: {
    width: 100,
    height: 100
    
  },


  input: {
    fontSize:20,
    height: 48,
    width: '90%',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 20,
    paddingLeft: 16
},

  



});