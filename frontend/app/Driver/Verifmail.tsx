import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


const Verifmail = () => {
  const router = useRouter();
const handleVerification =async()=>{

  Alert.alert('Verified,You can verify with your phon number');
  router.push('/Signin');



}

  return (
    <SafeAreaView style={styles.cont}>
      <View>
        <Image source={require('../../assets/images/verif.jpeg')} style={styles.imgg} />
        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.subtitle}>We are verifying your email. Please press the button below to verify.</Text>
        
        <TouchableOpacity style={styles.verifyBtn} onPress={handleVerification}>
          <Text style={styles.btnText}>Verify Email</Text>
        </TouchableOpacity>
        
       
      </View>
    </SafeAreaView>
  );
};

export default Verifmail;

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#CACACA',
    height: '100%',
    width: '100%',
  },
  cont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  imgg: {
    width: 400,
    height: 220,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  verifyBtn: {
    backgroundColor: '#4169E1',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
 
});
