import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useState, useEffect } from 'react';
import React from 'react';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DataTable } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DropdownOption {
  value: string;
  label: string;
  image: any;
}

const Notifcation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const router = useRouter();
  const [nots, setNots] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNots, setFilteredNots] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [formattedDate, setFormattedDate] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [passengerData, setPassengerData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count

  const userid = AsyncStorage.getItem('userId');

  const options: DropdownOption[] = [
    { value: 'HomeDriver', label: 'Home', image: require('../../assets/images/home.png') },
    { value: 'DriverProfil', label: 'Profil', image: require('../../assets/images/user.png') },
    { value: 'AddRide', label: 'Add new Ride', image: require('../../assets/images/pas.png') },
    { value: 'AllRide', label: 'Your Ride', image: require('../../assets/images/searchride.png') },
    { value: 'Actualities', label: 'About us', image: require('../../assets/images/about.png') },
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownChange = (item: DropdownOption) => {
    setSelectedValue(item.value);
    setIsDropdownOpen(false);
    const validPaths = ['/Driver/HomeDriver', '/Driver/DriverProfil', '/Driver/AddRide', '/Driver/AllRide', '/Driver/Actualities'];
    const selectedPath = `/Driver/${item.value}`;
    if (validPaths.includes(selectedPath)) {
      router.push(selectedPath);
    } else {
      console.error('Invalid path', selectedPath);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

/*   const fetchPassengerData = async (passengerId: string) => {
    try {
      const response = await axios.get(`http://192.168.1.7:5000/passenger/one/${passengerId}`);
      
      setPassengerData(response.data.passenger);
      setName(response.data.passenger.name);
      setLastname(response.data.passenger.lastname);
      return response.data.passenger;
    } catch (err) {
      console.log('Error fetching passenger data:', err);
      return null;
    }
  }; */

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const driverId = await AsyncStorage.getItem('userId');
        const response = await axios.get(`http://192.168.1.7:5000/notification/mynotif/${driverId}`);
        console.log(response.data);
        const formattedNots = await Promise.all(
          response.data.map(async (not: any) => {
            const passengerId = not.passengerId;
            console.log(passengerId);
            // const passengerData = await fetchPassengerData(passengerId);
            return {
              ...not,
              passenger: passengerData,
              CreatedAt: formatDate(not.CreatedAt),
            };
          })
        );

        setNots(formattedNots);
        setFilteredNots(formattedNots);
        setNotificationCount(formattedNots.length); // Update notification count
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredNots(
        nots.filter((not: any) =>
          not.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredNots(nots);
    }
    setCurrentPage(1);
  }, [searchQuery, nots]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNots.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <SafeAreaView>
      <View style={styles.navbarhome}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.notificationblock}>
          <TouchableOpacity onPress={() => router.push(`/Driver/Note`)} style={styles.dropdownButton1}>
            <MaterialIcons name="notifications" size={30} color="#4169E1" />
            <View style={styles.numberofnotification}>
              <Text style={styles.notiftext}>1</Text> {/* Display notification count */}
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleDropdownToggle} style={styles.dropdownButton}>
          <MaterialIcons name="arrow-drop-down" size={40} color="#4169E1" />
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

      

      <View style={styles.tabride}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for specifique notification"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>Order request</DataTable.Title>
           
            <DataTable.Title>phone</DataTable.Title>
            <DataTable.Title>Response </DataTable.Title>
       
          </DataTable.Header>

          {currentItems.map((not, index) => (
            <TouchableOpacity key={index} onPress={() => router.push(`/Passenger/PassengerProfil`)}>
              <DataTable.Row>
              
                <DataTable.Cell>
                  <Text> From {not.passengerName} {not.passengerLastName}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{not.passengerPhone}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                 <TouchableOpacity  onPress={()=>{router.push('/Driver/Orders')}} > <Text style={styles.accept}>Accept </Text></TouchableOpacity> <TouchableOpacity > <Text style={styles.reject}>   Reject </Text></TouchableOpacity> 
                </DataTable.Cell>
                
              </DataTable.Row>
            </TouchableOpacity>
          ))}
        </DataTable>

        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={styles.pageButton}
          >
            <Text style={styles.pageText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.pageText}>
            Page {currentPage} of {Math.ceil(filteredNots.length / itemsPerPage)}
          </Text>
          <TouchableOpacity
            onPress={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= filteredNots.length}
            style={styles.pageButton}
          >
            <Text style={styles.pageText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Notifcation;
const styles = StyleSheet.create({

  body:{
    marginTop: 0,
      flex: 1,
      backgroundColor: '#6270BA',
      zIndex: 10,
  },
  navbarhome:{
    backgroundColor: 'white',
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center'
  },
  search:{
    marginTop:15,
    marginLeft:200,
  },
  tabride:{
    marginTop:20,
    margin:0,
  },
  searchInput:{
marginLeft:180,
    borderWidth: 2, // Maintains the visible border
    borderColor: '#2F2BAA', // Retains the blue color for consistency
    borderRadius: 70, // Keeps the rounded corners
    width: '50%', // Full width for uniformity
    paddingHorizontal: 15, // Adjusted for even spacing inside the input
    paddingVertical: 8, // Adds better top-bottom padding for the text
    fontSize: 14, // Slightly larger font for readability
    color: '#333', // A standard dark color for the text
    backgroundColor: '#fff', // Ensures contrast with the text
    height: 39, // Provides more height for better touchability
    marginBottom: 5, // Adds consistent spacing between inputs
    },
  container: {
    padding: 0,
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
  mapview:{
    marginTop:5,
    
  },
  map:{
    height:200,
    width:410,
  },
  pub:{},
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },
  dropdownButton: {
    position: 'relative',
    padding: 10,
    marginLeft:0,
    
  },
  dropdownButton1: {
    position: 'relative',
  
    marginLeft:220,
    
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
  image:{},
  
  
  logo:{
    marginLeft: 10,
      height: 50,
      width: 80,
  
  },
  imgg:{
    width:20,
    height:20,
  
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#6270BA',
    borderRadius: 8,
  },
  pageText: {
    color: 'white',
    fontSize: 16,
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

accept:{
  color:'green',
},
reject:{
  color:'red',
}

})