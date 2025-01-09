import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Text, TextInput, SafeAreaView, Alert, Pressable,Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import{Link} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';


interface DropdownOption {
  value: string ;
  label: string;
  image: any; // For images, you can use 'require' or import statements.
  
}
export default function AddRide() {
  const router = useRouter();
 
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [passenger, setPassenger] = useState('');
  const [price, setPrice] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // State for toggling dropdown visibility
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  //for date 
  const [Datee, setDatee] = useState('');
  const [date,setDate]=useState(new Date());
  const [showPicker, setShowPicker]=useState(false); 

  //for time 
 
const [time, setTime] = useState(new Date());
const [timeText, setTimeText] = useState('');
const [showTimePicker, setShowTimePicker] = useState(false);


  //logique date
 const ToggleDatepicker=()=>{
  setShowPicker(!showPicker);
 };
 const onChange=({type},selectedDate)=>{

  if (type=="set"){
    const currentDate=selectedDate;
    setDate(currentDate);
    if (Platform.OS=== "android"){ToggleDatepicker();}
    setDatee(formatDate(currentDate)); 
  }else{
    ToggleDatepicker();
  }
 };

 const formatDate = (rawDate) => {
  let date = new Date (rawDate);
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day =date.getDate();
  return ` ${year}-${month}-${day} `;
 }

// Calcule l'heure actuelle comme minimum
const minimumTime = new Date();
minimumTime.setMinutes(minimumTime.getMinutes() + 1);  // Par exemple, ajoute 1 minute à l'heure actuelle

//logique heur
// Fonction pour afficher/cacher le TimePicker
const toggleTimePicker = () => {
  setShowTimePicker(!showTimePicker);
};

// Fonction pour formater l'heure sélectionnée
const formatTime = (rawTime) => {
  let date = new Date(rawTime);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

// Gestion de la sélection d'heure
const onTimeChange = ({ type }, selectedTime) => {
  if (type === "set") {
    const currentTime = selectedTime;
    setTime(currentTime);
    setTimeText(formatTime(currentTime));
    if (Platform.OS === "android") {
      toggleTimePicker();
    }
  } else {
    toggleTimePicker();
  }
};
  const options :DropdownOption[] = [
    { value: 'HomeDriver', label: 'Home', image: require('../../assets/images/home.png') },
    // { value: 'DriverProfil', label: 'Profil', image: require('../../assets/images/user.png') }, 
    { value: 'AddRide', label: 'Add new Ride', image: require('../../assets/images/pas.png') },
    { value: 'AllRide', label: 'All my rides', image: require('../../assets/images/searchride.png') },
    { value: 'Actualities', label: 'About us', image: require('../../assets/images/about.png') },
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);  // Toggle the dropdown visibility
  };

  const handleDropdownChange = (item: DropdownOption) => {
    setSelectedValue(item.value);
    setIsDropdownOpen(false);  // Close the dropdown after selection
  
    // Define valid paths
    const validPaths = ['/Driver/HomeDriver', '/Driver/DriverProfil','/Driver/AddRide', '/Driver/AllRide' ,'/Driver/Actualities'];
  
    // Dynamically create the path
    const selectedPath = `/Driver/${item.value}`;
  
    // Check if the path is valid before navigating
    if (validPaths.includes(selectedPath)) {
      router.push(selectedPath);
    } else {
      console.error('Invalid path', selectedPath);
    }
  };

  const renderDropdownItem = (item:DropdownOption) => (
    <TouchableOpacity onPress={() => handleDropdownChange(item)} style={styles.dropdownItem}>
    <Image source={item.image} style={styles.dropdownImage} />
    <Text style={styles.dropdownLabel}>{item.label}</Text>
  </TouchableOpacity>
  );


// Inside the AddRide component
const handlePress = async () => {
  const userId =await AsyncStorage.getItem('userId');
  const data = { userId,destination, currentLocation, Datee , timeText , passenger ,price};
  console.log(data); // Log the data to check its structure and values
  
  try {
    // Save to AsyncStorage
    await AsyncStorage.setItem('userRideData', JSON.stringify(data));
    const userId =await AsyncStorage.getItem('userId');
   

    // Send to backend
    const response = await axios.post(`http://192.168.1.7:5000/ride/ridescreate`, data);
    if (response.status === 201) {
      console.log(data);
      console.log('Ride saved to backend:', response.data);
      // Retrieve the ride ID from the response
      const rideId = response.data.rideId;
      AsyncStorage.setItem('rideId', rideId);
      console.log('Created Ride ID:', rideId);
      
   
      alert("your ride is added seccessfully click to get out ");
      setTimeout(() => {
        // Navigate to the next page
        router.push(`/Driver/AllRide/`);
      }, 1000); // 3000 ms = 3 seconds
    }
  } catch (error) {
    console.error('Failed to save data', error);
    console.error('Failed to save data', error.response?.data || error.message);
    alert('Failed to save the ride. Please try again.');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cont1}>
        <View>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        </View>
        
        <TouchableOpacity onPress={handleDropdownToggle} style={styles.dropdownButton}>
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownList}>
            {options.map((item) => renderDropdownItem(item))}
          </View>
        )}
        
      
      </View>
      

      <View style={styles.box}>
          <Text style={styles.snt}>Add new Ride</Text>
        <View style={styles.choix1}>
          <Image source={require('../../assets/images/des.png')} style={styles.logo3} />
          <TextInput
            style={styles.textInput}
            placeholder="      Your destination"
            onChangeText={setDestination}
            value={destination}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/loc.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="      Where are you now !"
            onChangeText={setCurrentLocation}
            value={currentLocation}
          />
        </View>

         {/* date*/}

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/cal.png')} style={styles.logo2} />

          {showPicker && ( <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
          maximumDate={new Date('2025-12-31')}
          minimumDate={new Date('2024-12-01')}
          />
          )}
          {!showPicker && (<Pressable onPress={ToggleDatepicker}>
              <TextInput
              style={styles.textInput}
               placeholder="      Date"
               onChangeText={setDatee}
               value={Datee}
              editable={false}
             />
          </Pressable>)}
         
        </View>



        <View style={styles.choix1}>
  <Image source={require('../../assets/images/cal.png')} style={styles.logo2} />
  
  {showTimePicker && (
    <DateTimePicker
      mode="time"
      display="spinner"
      value={time}
      onChange={onTimeChange}
      minimumDate={minimumTime}  
    />
  )}
  
  {!showTimePicker && (
    <Pressable onPress={toggleTimePicker}>
      <TextInput
        style={styles.textInput}
        placeholder="      Select Time"
        onChangeText={setTimeText}
        value={timeText}
        editable={false}
      />
    </Pressable>
  )}
</View>


        <View style={styles.choix1}>
          <Image source={require('../../assets/images/pas.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="      1 passenger"
            onChangeText={setPassenger}
            value={passenger}
          />
        </View>
        <View style={styles.choix1}>
          <Image source={require('../../assets/images/money.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="      Price"
            onChangeText={setPrice}
            value={price}
          />
        </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
  <Text style={styles.buttonText}>Save the ride</Text>
</TouchableOpacity>

        </View>
      </View>

      <View style={styles.return}>
        <TouchableOpacity style={styles.buttonrtn}  onPress={() => router.push('/Driver/HomeDriver')}>
          <Text style={styles.buttonText}>  Return</Text>
        </TouchableOpacity>
        </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>LET'S GO © 2024 All Right Reserved</Text>
      </View>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#6270BA',
    zIndex: 10,
  },
  cont1: {
    backgroundColor: 'white',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  box: {
    borderRadius: 50,
    backgroundColor: 'white',
    marginTop: 30,
    height: 570,
    width: 350,
    marginLeft: 30,
    padding: 20,
    boxShadow: '0px 2px 50px rgba(0, 0, 0, 0.8)'
  },
  choix1: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  logo: {
    marginLeft: 10,
    height: 50,
    width: 50,
  },
  logo2: {
    marginLeft: 10,
    height: 40,
    width: 40,
  },
  logo3: {
    marginLeft: 4,
    height: 50,
    width: 50,
  },
  textInput: {
    height: 40,
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#abb9e5',
    padding: 40,
    
    width: '113%',
    alignItems: 'center',
    borderBottomRightRadius:50,
    borderBottomLeftRadius:50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    color: '#000',
  },
  
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },
  dropdownButton: {
 marginLeft:280,
  },
  dropdownList: {
    position: 'absolute', // Absolute positioning
    top: 50, // Adjust the position to appear higher on screen
    left: 200,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
   
    width:200,
    zIndex: 10000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownImage: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  dropdownLabel: {
    fontSize: 16,
  },
  return:{
    backgroundColor: '#abb9e5',
    margin:20,
    width:120,
    marginLeft:40,
    borderRadius:20,
    marginTop:60,
  },
  buttonrtn:{
    marginTop:10,
    marginLeft:20,
    width:90,
    height:40,

  },
  snt:{
    marginBottom:10,
    marginLeft:90,
    fontSize:20,
    fontWeight:'bold',
    color:'#2F2BAA',
  },
  
});