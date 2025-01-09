import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, ActivityIndicator,TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function PassengerProfil() {
   const router = useRouter();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserId = async () => {
    const passengerId = await AsyncStorage.getItem('passengerIdprofil');
    return passengerId;
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const passengerId = await fetchUserId();
      console.log(passengerId,'hay te5dem ');
      const response = await axios.get(`http://192.168.1.7:5000/passenger/one/${passengerId}`);
      console.log(response,'response 7af');
      const userData = response.data.passenger;
      console.log(userData,'t5dem');
      setName(userData.name);
      setLastname(userData.lastname);
      setEmail(userData.email);
      setPhone(userData.phone);
      setImageUri(userData.imageUri);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlereturn=async()=>{
    await AsyncStorage.removeItem('passengerId');
     
  
      // Redirect to login page
      router.push('/Driver/Note');  
  


  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cont1}>
              <View>
                <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
              </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <View style={styles.profileContainer}>
          <Image
            style={styles.avatar}
            source={
               require('../../assets/images/profile.png')
            }
          />
          <Text style={styles.name}>{name} {lastname}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={24} color="#4169E1" />
              <Text style={styles.infoText}>{phone}</Text>
            </View>
            <View style={styles.infoRow}>
            <MaterialIcons name="chat-bubble-outline" size={24} color="#4169E1" />
              <Text style={styles.infoText}>send message for more information</Text>
            </View>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.acrej}>
          <View style={styles.return}>
              <TouchableOpacity style={styles.buttonrtn}  /* onPress={() => router.push('/Driver/HomeDriver')} */>
                <Text style={styles.buttonText}>  Accept</Text>
              </TouchableOpacity>
              </View>
              <View style={styles.return}>
              <TouchableOpacity style={styles.buttonrtn}  /* onPress={() => router.push('/Driver/HomeDriver')} */>
                <Text style={styles.buttonText}>  Reject </Text>
              </TouchableOpacity>
              </View>
          </View>
             
         
        </View>
      )}
      <View style={styles.acrej}>
      <View style={styles.return}>
              <TouchableOpacity style={styles.buttonrtn}  onPress={handlereturn}>
                <Text style={styles.buttonText}>  Return</Text>
              </TouchableOpacity>
              </View>
      <View style={styles.return}>
              <TouchableOpacity style={styles.buttonrtn}  /* onPress={() => router.push('/Driver/HomeDriver')} */>
                <Text style={styles.buttonText}>  messages </Text>
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
    zIndex: 10,
  },
  profileContainer: {
    alignItems:'center',
     borderRadius: 50,
    backgroundColor: 'white',
    marginTop: 30,
    height: 570,
    width: 350,
    marginLeft: 30,
    padding: 20,
    boxShadow: '0px 2px 50px rgba(0, 0, 0, 0.8)'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007BFF',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4169E1',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#444',
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    fontSize: 16,
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
   cont1: {
    backgroundColor: 'white',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginLeft: 10,
    height: 50,
    width: 50,
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

    
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  acrej:{
    flexDirection: 'row', // Ensures the child elements are displayed in a row
    justifyContent: 'space-between', // Space out the buttons evenly
    alignItems: 'center', // Center the buttons vertically within the parent viewa

  }
});
