import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import React from 'react';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


interface DropdownOption {
  value: string;
  label: string;
  image: any; // For images, use 'require' or imported files.
}

const Actualities = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const router = useRouter();
  

  const options: DropdownOption[] = [
    { value: 'HomeDriver', label: 'Home', image: require('../../assets/images/home.png') },
    /* { value: 'PassengerProfil', label: 'Profil', image: require('../../assets/images/user.png') }, */
    { value: 'AllRide', label: 'Find a ride', image: require('../../assets/images/searchride.png') },
    { value: 'Actualities', label: 'About us', image: require('../../assets/images/about.png') },
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownChange = (item: DropdownOption) => {
    setSelectedValue(item.value);
    setIsDropdownOpen(false);

    const validPaths = ['/Driver/HomeDriver'];
    const selectedPath = `/Driver/${item.value}`;

    if (validPaths.includes(selectedPath)) {
      router.push(selectedPath);
    } else {
      console.error('Invalid path', selectedPath);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.navbarhome}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => router.push('/profilP')} style={styles.dropdownButton1}>
          <MaterialIcons name="account-circle" size={35} color="#4169E1" />
        </TouchableOpacity>
        <View style={styles.notificationblock}>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => router.push('/Passenger/Note')}>
            <MaterialIcons name="notifications" size={30} color="#4169E1" />
            <View style={styles.numberofnotification}><Text style={styles.notiftext}>2</Text></View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleDropdownToggle} style={styles.dropdownButton}>
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownList}>
            {options.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleDropdownChange(item)}
                style={styles.dropdownItem}
              >
                <Image source={item.image} style={styles.dropdownImage} />
                <Text style={styles.dropdownLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <Text style={styles.aboutUsText}>
  About Us
  {"\n\n"}
  At Let's Go, we’re revolutionizing carpooling by providing a simple, eco-friendly,
  and cost-effective way to travel. Our app connects drivers with passengers looking to share rides, making daily commuting more affordable, social, and sustainable. Whether you’re heading to work, running errands,
  or going on a road trip, Let's Go offers a smart solution for everyone.
</Text>


     
    </SafeAreaView>
  );
};

export default Actualities;

const styles = StyleSheet.create({
  navbarhome: {
    backgroundColor: 'white',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginLeft: 10,
    height: 50,
    width: 80,
  },
  dropdownButton: {
    padding: 10,
  },
  dropdownButton1: {
    marginLeft: 150,
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 200,
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
  mapview: {
    marginTop: 5,
  },
  video: {
    height: 200,
    width: '100%',
  },
  notificationblock: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberofnotification: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 12,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notiftext: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  aboutUsText: {
    fontSize: 16,  // Adjust font size to suit your design
    fontWeight: '400', // Regular weight for a readable, approachable text
    lineHeight: 24,   // Add spacing between lines for better readability
    marginHorizontal: 15, // Add margin to prevent text from touching edges
    color: '#333',  // Set a dark color for readability
    textAlign: 'left', // Align text to the left for a formal tone
    marginTop: 20,   // Add margin-top for spacing
  },
});
