import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, ScrollView, TouchableOpacity} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Carousel from './Carousel';
import ContactInfo from './ContactInfo';
import ReviewList from './ReviewList';
import JobList from './JobList';

 const renderReviews = (reviews, navigation) => {
  if (typeof reviews !== 'undefined'){
    reviews.forEach(function(obj, index) {
      if (typeof obj.createDate !== 'undefine'){
        try {obj.id = index}
        catch(e){
          // obj.createDate = "Recently"
        } 
      }
    })
    return (
      <View>
            <ReviewList data={reviews} navigation={navigation} userType={0}/>
          </View>
    )
  }
 }

 const renderJobs = (jobs) => {
  console.log(jobs)
  console.log("jobs")
  if (typeof jobs !== 'undefined'){
    jobs.forEach(function(obj, index) {
      if (typeof obj.createDate !== 'undefine'){
        try {obj.id = index}
        catch(e){
          // obj.createDate = "Recently"
        } 
      }
    })
    
    return (
      <View>
            <JobList data={jobs} />
          </View>
    )
  }
 }

const onAddNewJobPress = (navigation, id) =>{
  console.log("add new job")
  console.log(id)

  navigation.navigate('AddNewJobPage',{id})

}

const onAddReviewPress = (navigation, id) =>{
  console.log("add new review")
  console.log(id)

  const data = {receiverId: id, userType: 0}

  navigation.navigate('AddReviewPage',{data})

}

const FirstRoute = (props) => (
    <View style={[styles.scene, { backgroundColor: Colors.white }]}>
        {props.signIn===1 &&
        
          <TouchableOpacity
              style={styles.button}
              onPress={() => onAddNewJobPress(props.navigation, props.id)}>
              <Text style={styles.buttonTitle}>Add New Job</Text>
          </TouchableOpacity>
        }
        {renderJobs(props.jobs)}
    </View>
);

const SecondRoute = (props) => (
  <View style={[styles.scene, { backgroundColor: '#FFF' }]}>
      {props.signIn===0 &&
        
        <TouchableOpacity
            style={styles.button}
            onPress={() => onAddReviewPress(props.navigation, props.id)}>
            <Text style={styles.buttonTitle}>Add Review</Text>
        </TouchableOpacity>
      }
    {renderReviews(props.reviews, props.navigation)}
  </View>
);

const ThirdRoute = (props) => (
    <View style={[styles.scene, { backgroundColor: '#FFF' }]}>
        <ContactInfo email={props.email} phone={props.phone}/>
      </View>
  );



const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: '#788eec' }}
  />
);

const initialLayout = { width: Dimensions.get('window').width };

export default function FreelanceProfileTabView(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: "Job" },
    { key: 'second', title: 'Review' },
    { key: 'third', title: 'Contact' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute jobs={props.item["profileData"]["jobs"]} 
                          id={props.item["id"]} 
                          signIn={props.item["signIn"]}
                          navigation={props.navigation}/>;
      case 'second':
        return <SecondRoute reviews={props.item["profileData"]["reviews"]} 
                                      id={props.item["id"]} 
                                      signIn={props.item["signIn"]} 
                                      navigation={props.navigation}/>;
    case 'third':
        return <ThirdRoute 
                email={props.item["email"]}
                phone={props.item["profileData"]["phoneNumber"]}
                />;
      default:
        return null;
    }
  };
  

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.container}
      scrollEnabled={true}
      bounces={true}
    />
  );
}

const Colors = {
    red: '#FF3B30',
    orange: '#FF9500',
    yellow: '#FFCC00',
    green: '#4CD964',
    tealBlue: '#5AC8FA',
    blue: '#788eec',
    purple: '#5856D6',
    pink: '#FF2D55',
  
    white: '#FFFFFF',
    customGray: '#EFEFF4',
    lightGray: '#E5E5EA',
    lightGray2: '#D1D1D6',
    midGray: '#C7C7CC',
    gray: '#8E8E93',
    black: '#000000',
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 12,
  },
  scene: {
    flex: 1,
  },
  detailText: {
    color: Colors.black,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginHorizontal: 20,
    marginVertical: 8,
  },

  subDetailText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 28,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 80,
    marginRight: 80,
    marginTop: 20,
    height: 35,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
},
buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
},
});