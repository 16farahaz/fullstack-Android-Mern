import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


export default function RideDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
 const router = useRouter();
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [passenger, setPassenger] = useState('');
  const [price, setPrice] = useState('');
  const [Datee, setDatee] = useState('');
  const [timeText, setTimeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [driver, setDriver] = useState(null);

  const [rideId,setRideId]=useState('');

  
  const fetchUserId = async () => {
    const passengerId = await AsyncStorage.getItem('userId');
    return passengerId;
  };
  // Fetch ride data by ID
  const fetchRideData = async () => {
    
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.7:5000/ride/rides/${id}`);
      const rideData = response.data;
      await AsyncStorage.setItem('userIdorderried', response.data.userId);

      setDestination(rideData.destination);
      setCurrentLocation(rideData.currentLocation);
      setPassenger(rideData.passenger);
      setPrice(rideData.price);
      setDatee(rideData.Datee);
      setTimeText(rideData.timeText);
      setDriver(rideData.userId);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ride data');
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      const passengerId = fetchUserId();
      console.log(passengerId);
      fetchRideData();
      console.log(passengerId)
      console.log(driver);
      console.log(rideId);
    }
  }, [id]);
  const PassOrder = async () => {
    setLoading(true);
    try {
      // Send a request to create the order in the backend
      const passengerId = await fetchUserId();
      const orderData = {
        passengerId,
        driverId: driver, // Ensure you are using the correct driver ID
        rideId: id, // You already have rideId from URL params
      };
      console.log(orderData);
      
      const response = await axios.post('http://192.168.1.7:5000/order/Orders', orderData); // Adjust the URL to the correct endpoint
      console.log(response.data); // Log the response for debugging
  
      // Optionally, update local state or show confirmation to the user
      if (response.status === 201) {
        setLoading(false);
        // You can show success message or navigate to another page
        router.push('/Passenger/Home'); // Redirect after the order is placed
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to place the order');
      console.error(err);
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
            value={destination}
            editable={false}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/loc.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="Where are you now!"
            value={currentLocation}
            editable={false}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/cal.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="Date"
            value={Datee}
            editable={false}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/cal.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="Select Time"
            value={timeText}
            editable={false}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/pas.png')} style={styles.logo2} />
          <Text>    {passenger}</Text>
        </View>

        <View style={styles.choix1}>
          <Image source={require('../../assets/images/money.png')} style={styles.logo2} />
            <Text>{price}</Text>
        </View>
        <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}  onPress={PassOrder} >
          <Text style={styles.buttonText}>Order your Car </Text>
        </TouchableOpacity>
        
                </View>
      </View>
            <View style={styles.lesbuttons}>   
            <View style={styles.return}>
              <TouchableOpacity style={styles.buttonrtn}  onPress={() => router.push('/Driver/DriverProfil')}>
                <Text style={styles.buttonText}>Driver details</Text>
              </TouchableOpacity>
              </View>
             <View style={styles.return}>
              <TouchableOpacity style={styles.buttonrtn}  onPress={() => router.push('/Passenger/Home')}>
                <Text style={styles.buttonText}>      Return</Text>
              </TouchableOpacity>
              </View>
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
  },
  box: {
    borderRadius: 50,
    backgroundColor: 'white',
    marginTop: 30,
    height: 550,
    width: 350,
    marginLeft: 30,
    padding: 20,
  },
  choix1: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
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
  driverInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  driverHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  driverimg: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonContainer: {
   
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
    marginTop:10,
  },
  return:{
    backgroundColor: '#abb9e5',
    margin:20,
    width:140,
    marginLeft:40,
    borderRadius:20,
    marginTop:30,
  },
  buttonrtn:{
    marginTop:10,
    marginLeft:20,
    width:130,
    height:50,

  },
  lesbuttons:{
  
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

});
