import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


export default function UserDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [name, setName] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serie, setSerie] = useState('');
  const [Mark, setMark] = useState('');
  const [image, setImage] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [driver, setDriver] = useState(null);

  const userId = AsyncStorage.getItem('userIdorderried');
  // Fetch ride data by ID
  const fetchRideData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.7:5000/user/user/${id}`);
      const userData = response.data;
      

      setName(userData.name);
      setlastname(userData.lastname);
      setEmail(userData.email);
      setPhone(userData.phone);
      setSerie(userData.serie);
      setMark(userData.Mark);
      setImage(userData.image);
      setImageUri(userData.imageUri);
      


      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchRideData();
    }
  }, [id]);
 

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
                <TouchableOpacity style={styles.button} /* onPress={handlePress} */>
          <Text style={styles.buttonText}>Order your Car </Text>
        </TouchableOpacity>
        
                </View>
      </View>
      <View style={styles.return}>
              <TouchableOpacity style={styles.buttonrtn}  onPress={() => router.push('/Driver/HomeDriver')}>
                <Text style={styles.buttonText}>Driver details</Text>
              </TouchableOpacity>
              </View>
             <View style={styles.return}>
              <TouchableOpacity style={styles.buttonrtn}  onPress={() => router.push('/Driver/HomeDriver')}>
                <Text style={styles.buttonText}>  Return</Text>
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
