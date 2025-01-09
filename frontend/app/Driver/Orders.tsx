import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

const Orders = () => {
   const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch the orders data
  const fetchOrders = async (userId) => {
    try {
      const response = await axios.get(`http://192.168.1.7:5000/order/ors/${userId}`);
      console.log(response);
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  // Fetch userId from AsyncStorage and call fetchOrders
  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          fetchOrders(userId);  // Call fetchOrders with the userId
        } else {
          setError('User not authenticated');
          setLoading(false);
        }
      } catch (err) {
        setError('Error retrieving user ID');
        setLoading(false);
      }
    };

    getUserId();
  }, []);

  // Render each order in a table-like format
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.cell}>{item.passengerName} {item.passengerLastName}</Text>
        <Text style={styles.cell}>{item.passengerPhone}</Text>
        <Text style={styles.cell}>{item.destination}</Text>
        <Text style={[styles.cell, item.conf ? styles.confirmed : styles.notConfirmed]}>
          {item.conf ? 'Confirmed' : 'Not Confirmed'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Passenger Name</Text>
        <Text style={styles.headerText}>Phone</Text>
        <Text style={styles.headerText}>Destination</Text>
        <Text style={styles.headerText}>Confirmation</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.rideId}
        renderItem={renderItem}
      />
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
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  container: {
    marginTop:10,
    flex: 1,

    backgroundColor: '#ffffff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2F2BAA',
    paddingVertical: 12,
   margin:3,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
  
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
   
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  confirmed: {
    color: '#4CAF50',  // Green color for confirmed
    fontWeight: 'bold',
  },
  notConfirmed: {
    color: '#FF5722',  // Red color for not confirmed
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  footer: {
    backgroundColor: 'white',
    padding: 5,
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
  return:{
    backgroundColor: '#abb9e5',
    margin:20,
    width:120,
    marginLeft:40,
    borderRadius:20,
   marginBottom:50,
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
});

export default Orders;
