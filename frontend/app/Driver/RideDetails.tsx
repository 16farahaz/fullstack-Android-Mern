import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Text, TextInput, SafeAreaView, Alert, Pressable, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function UpdateRide({ route }) {
  const router = useRouter();
  // Access the `id` from route.params
  const { id } = route.params;
  console.log(id);

  // State variables for the ride details and form
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [passenger, setPassenger] = useState('');
  const [price, setPrice] = useState('');
  const [Datee, setDatee] = useState('');
  const [timeText, setTimeText] = useState('');
  /* const [rideId, setRideId] = useState(route?.params?.ride_id); // let's take the rideId from the url
console.log(rideId); */
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Function to fetch ride data by ID
  const fetchRideData = async () => {
    console.log(id);
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.7:5000/ride/rides/${rideId}`);
      const rideData = response.data;

      // Update state with the fetched data
      setDestination(rideData.destination);
      setCurrentLocation(rideData.currentLocation);
      setPassenger(rideData.passenger);
      setPrice(rideData.price);
      setDatee(rideData.Datee);
      setTimeText(rideData.timeText);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ride data');
      setLoading(false);
    }
  };

  // Fetch ride data when the component mounts or rideId changes
  useEffect(() => {
    if (rideId) {
      fetchRideData();
    }
  }, [rideId]);

  const handleUpdate = async () => {
    const data = { destination, currentLocation, Datee, timeText, passenger, price };
    try {
      const response = await axios.put(`http://192.168.1.7:5000/ride/rides/${rideId}`, data);
      if (response.status === 200) {
        alert('Your ride was updated successfully!');
        setTimeout(() => {
          router.push(`/Driver/AllRide`);
        }, 1000);
      }
    } catch (error) {
      alert('Failed to update the ride. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
      <View style={styles.box}>
        <View style={styles.choix1}>
          <Image source={require('../../assets/images/des.png')} style={styles.logo3} />
          <TextInput
            style={styles.textInput}
            placeholder="Your destination"
            onChangeText={setDestination}
            value={destination}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/loc.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="Where are you now!"
            onChangeText={setCurrentLocation}
            value={currentLocation}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/cal.png')} style={styles.logo2} />
          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={(e, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
                setDatee(formatDate(currentDate));
              }}
            />
          )}
          {!showPicker && (
            <Pressable onPress={() => setShowPicker(true)}>
              <TextInput
                style={styles.textInput}
                placeholder="Date"
                onChangeText={setDatee}
                value={Datee}
                editable={false}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/cal.png')} style={styles.logo2} />
          {showTimePicker && (
            <DateTimePicker mode="time" display="spinner" value={time} onChange={(e, selectedTime) => setTimeText(formatTime(selectedTime || time))} />
          )}
          {!showTimePicker && (
            <Pressable onPress={() => setShowTimePicker(true)}>
              <TextInput
                style={styles.textInput}
                placeholder="Select Time"
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
            placeholder="1 passenger"
            onChangeText={setPassenger}
            value={passenger}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/money.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="Price"
            onChangeText={setPrice}
            value={price}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Update Your Ride</Text>
        </TouchableOpacity>
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
      boxShadow: '0px 2px 50px rgba(0, 0, 0, 0.8)',
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
      marginTop:30,
    },
    buttonrtn:{
      marginTop:10,
      marginLeft:20,
      width:90,
      height:40,
  
    }
  });