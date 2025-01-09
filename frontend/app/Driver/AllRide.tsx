import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
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

const AllRide = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const router = useRouter();
  const [rides, setRides] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRides, setFilteredRides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  
  const options: DropdownOption[] = [
    { value: 'HomeDriver', label: 'Home', image: require('../../assets/images/home.png') },
    // { value: 'DriverProfil', label: 'Profil', image: require('../../assets/images/user.png') },
    { value: 'AddRide', label: 'Add new Ride', image: require('../../assets/images/pas.png') },
    { value: 'AllRide', label: 'All my rides', image: require('../../assets/images/searchride.png') },
    { value: 'Actualities', label: 'About us', image: require('../../assets/images/about.png') },
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownChange = (item: DropdownOption) => {
    setSelectedValue(item.value);
    setIsDropdownOpen(false);
    const validPaths = ['/Driver/HomeDriver', '/Driver/AddRide', '/Driver/AllRide', '/Driver/Actualities'];
    const selectedPath = `/Driver/${item.value}`;

    if (validPaths.includes(selectedPath)) {
      router.push(selectedPath);
    } else {
      console.error('Invalid path', selectedPath);
    }
  };

 // Fonction de formatage de la date
 const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0, donc ajoutons 1.
  const day = String(d.getDate()).padStart(2, '0'); // Ajoute un zéro devant le jour si nécessaire.

  return `${year}-${month}-${day}`;
};
useEffect(() => {
  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log(userId);
      if (userId) {
        const response = await axios.get(`http://192.168.1.7:5000/ride/myride/${userId}`);
        console.log(response.data);

        await AsyncStorage.setItem('userId', userId);

        // Iterate through each ride to log its ride_id
        response.data.forEach((ride) => {
          console.log('Navigating to: ', ride._id);
        });

        // Optionally log the first ride's ride_id
        console.log('Navigating to the first ride: ', response.data[0]?._id);

        // Formate the date of each ride
        const formattedRides = response.data.map((ride) => ({
          ...ride,
          Datee: formatDate(ride.Datee), // Format the date here
        }));

        setRides(formattedRides);
        setFilteredRides(formattedRides);
      }
    } catch (err) {
      console.log(err);
    }
  };
  fetchData();
}, []);



  useEffect(() => {
    if (searchQuery) {
      setFilteredRides(
        rides.filter((ride) =>
          ride.destination.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredRides(rides);
    }
    setCurrentPage(1);
  }, [searchQuery, rides]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRides.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <SafeAreaView>
      <View style={styles.navbarhome}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

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

      <View style={styles.tabride}>
                 <Text style={styles.snt}>All My Rides</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search for ride"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>Rides</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>time</DataTable.Title>

            {/* <DataTable.Title>Price</DataTable.Title> */}
            <DataTable.Title>Available</DataTable.Title>
            {/* <DataTable.Title>Actions</DataTable.Title> */}
          </DataTable.Header>
          {currentItems.map((ride, index) => (
          <TouchableOpacity 
          key={index} 
          onPress={() => router.push({
            pathname: "/Driver/[id]", 
            params: { id: ride._id }
          })} 
          activeOpacity={0.8} 
        >
          <DataTable.Row>
            <DataTable.Cell>{ride.currentLocation} - {ride.destination}</DataTable.Cell>
            <DataTable.Cell>{ride.Datee}</DataTable.Cell>
            <DataTable.Cell>{ride.timeText}</DataTable.Cell>
            <DataTable.Cell>{ride.available ? 'Available' : 'Not Available'}</DataTable.Cell>
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
            Page {currentPage} of {Math.ceil(filteredRides.length / itemsPerPage)}
          </Text>
          <TouchableOpacity
            onPress={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= filteredRides.length}
            style={styles.pageButton}
          >
            <Text style={styles.pageText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllRide;

const styles = StyleSheet.create({
  // Your styles remain unchanged


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
    padding: 15,
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
  marginLeft:270,
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
  snt:{
    marginBottom:10,
    marginLeft:40,
    fontSize:20,
    fontWeight:'bold',
    color:'#2F2BAA',
  },
  
});
