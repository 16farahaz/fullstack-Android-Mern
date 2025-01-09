import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Text, TextInput, SafeAreaView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import{Link} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';

interface DropdownOption {
  value: string ;
  label: string;
  image: any; // For images, you can use 'require' or import statements.
  
}
export default function Index() {
  const router = useRouter();
 
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [timeDate, setTimeDate] = useState('');
  const [passenger, setPassenger] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // State for toggling dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const navigation = useNavigation();
  const options :DropdownOption[] = [
    { value: 'Signin', label: 'Sign in', image: require('../assets/images/user.png') },
    { value: 'Signup', label: 'Sign up', image: require('../assets/images/user2.png') },
    { value: 'About', label: 'About us', image: require('../assets/images/about.png') },
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);  // Toggle the dropdown visibility
  };

  const handleDropdownChange = (item: DropdownOption) => {
    setSelectedValue(item.value);
    setIsDropdownOpen(false);  // Close the dropdown after selection
  
    // Define valid paths
    const validPaths = ['/Signin', '/Signup', '/About'];
  
    // Dynamically create the path
    const selectedPath = `/${item.value}`;
  
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




  
  const handlePress = async () => {
    const data = {
      destination,
      currentLocation,
      timeDate,
      passenger,
    };

    // Save data to AsyncStorage
    try { 
        await AsyncStorage.setItem('userRideData', JSON.stringify(data));
        console.log(data.destination);
        console.log(data.currentLocation);
        console.log(data.timeDate);
        console.log(data.passenger);
    } catch (error) {
        console.error('Failed to save data', error);
    }

   
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cont1}>
        <View>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
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
        <View style={styles.choix1}>
          <Image source={require('../assets/images/des.png')} style={styles.logo3} />
          <TextInput
            style={styles.textInput}
            placeholder="      Your destination"
            onChangeText={setDestination}
            value={destination}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../assets/images/loc.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="      Where are you now !"
            onChangeText={setCurrentLocation}
            value={currentLocation}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../assets/images/cal.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="      Time and Date"
            onChangeText={setTimeDate}
            value={timeDate}
          />
        </View>

        <View style={styles.choix1}>
          <Image source={require('../assets/images/pas.png')} style={styles.logo2} />
          <TextInput
            style={styles.textInput}
            placeholder="      1 passenger"
            onChangeText={setPassenger}
            value={passenger}
          />
        </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}  onPress={() => router.push('/Signin')}>
          <Text style={styles.buttonText}>Find your Ride !</Text>
        </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>LET'S GO © 2024 All Right Reserved</Text>
      </View>
    </SafeAreaView>
  );
}

// Styles remain unchanged


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
    marginTop: 100,
    height: 430,
    width: 350,
    marginLeft: 30,
    padding: 20,
    boxShadow: '0px 0px 50px rgba(0, 0, 0, 1)'

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
});