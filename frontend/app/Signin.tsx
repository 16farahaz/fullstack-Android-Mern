import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';  */

interface FormErrors {
  email?: string;
  motpasse?: string;
  error?: string;
}

const Signin = () => {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [motpasse, Setmotpasse] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  useEffect(() => {
    const checkIfStorageIsEmpty = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();

        if (keys.length === 0) {
          console.log('AsyncStorage is completely empty.');
        } else {
          console.log('AsyncStorage contains data.');
        }
      } catch (error) {
        console.error('Error checking AsyncStorage:', error);
      }
    };

    checkIfStorageIsEmpty();
  }, []); // Empty dependency array means this will run once when the component mounts

  useEffect(() => {

    validateForm();
  }, [email, motpasse]);

  const validateForm = () => {
    let errors: FormErrors = {};
    if (!email) {
      errors.email = 'Email is required.';
    }
    if (!motpasse) {
      errors.motpasse = 'Password is required.';
    }
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.1.7:5000/user/login', {
        email,
        motpasse,
      });

      if (response.data.success) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userId', response.data.id);
        alert('Successfully logged in');
        console.log(response.data.id);
        router.push(response.data.redirectUrl);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

/* GoogleSignin.configure({
      webClientId: '810015844591-51iv2vru4e2stq7ob1q1hvuf4ejpvbk3.apps.googleusercontent.com',
    });
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
  
    // Try the new style of google-sign in result, from v13+ of that module
    idToken = signInResult.data?.idToken;
    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.token);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
  */
  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.im}>
        <Image source={require('../assets/images/sign2.png')} style={styles.img1} />
      </View>
      <View style={styles.signform}>
        <TextInput
          style={styles.inputsp}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateForm();
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        />
        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.inputsp}
          placeholder="Password"
          value={motpasse}
          onChangeText={(text) => {
            Setmotpasse(text);
            validateForm();
          }}
          secureTextEntry
          onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
        />
        {touched.password && errors.motpasse && <Text style={styles.errorText}>{errors.motpasse}</Text>}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]}
          onPress={handleLogin}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>

        {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
      </View>

      <Text style={styles.title}>You can sign in with</Text>
      <View style={styles.googlegithub}>
        <TouchableOpacity onPress={'/'}>
          <Image source={require('../assets/images/gmail2.png')} style={styles.imgg} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/#')}>
          <Image source={require('../assets/images/facebook.png')} style={styles.imgg} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/Passenger/Signupps')}>
        <Text style={styles.title1}>I don't have an account</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>LET'S GO © 2024 All Right Reserved</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#CACACA',
    height: 830,
    width: 410,
  },
  im: {
    borderBottomRightRadius: 150,
    borderBottomLeftRadius: 150,
  },
  img1: {
    width: 410,
    height: 210,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
  },
  signform: {
    marginLeft: 30,
    backgroundColor: '#B7B7B7',
    height: 350,
    width: 350,
    padding: 20,
    borderRadius: 50,
  },
  inputsp: {
    borderWidth: 2,
    borderColor: '#2F2BAA',
    borderRadius: 70,
    width: '100%',
    paddingLeft: 20,
    height: 40,
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#2F2BAA',
    borderRadius: 30,
    paddingVertical: 10,
    marginLeft: 80,
    alignItems: 'center',
    marginTop: 20,
    width: 150,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googlegithub: {
    marginLeft: 85,
    backgroundColor: '#B7B7B7',
    height: 110,
    width: 230,
    padding: 40,
    borderRadius: 50,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgg: {
    width: 60,
    height: 60,
  },
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F2BAA',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 90,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2F2BAA',
    marginTop: 10,
    marginLeft: 130,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  successMessage: {
    color: 'green',
    fontSize: 14,
    marginTop: 10,
  },
});

export default Signin;
