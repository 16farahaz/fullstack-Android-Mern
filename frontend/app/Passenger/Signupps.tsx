import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

interface FormErrors {
  name?: string;
  lastName?: string;
  country?: string;
  email?: string;
  motpasse?: string;
  phone?: string;
  gender?: string;
  imageUri?: string;
  error?: string;
}

const Signupps = () => {
  const onlyLettersRegex = /^[A-Za-z]+$/;
  const onlyLettersOrNumbersWithoutSpecialCharsRegex = /^[a-zA-Z0-9]+$/;
  const uppercaseLetterRegex = /[A-Z]/; // Regex to check for at least one uppercase letter
  const specialCharsRegex = /[+\-./]/; // Regex to detect forbidden special characters like +, -, ., /

  const router = useRouter();
  const navigation = useNavigation();
  
  const [selectedValue, setSelectedValue] = useState('Male');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [motpasse, setmotpasse] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [touched, setTouched] = useState({ gender:false, email: false, password: false,country: false, phone:false, Serie:false,Mark:false,name:false,lastName:false,imageUri:false});

  // Image Picker function
  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      setImageName(result.assets[0].fileName);
    }
  };
  useEffect(() => {
    validateForm();
  }, [name, lastName, email,motpasse, phone, imageUri]);

  const validateForm = () => {
    let errors: FormErrors = {};

    if (!name) {
      errors.name = 'Le nom est requis.';
    } else if (!onlyLettersRegex.test(name)) {
      errors.name = 'the name must contain just letters.';
    }
  
    if (!lastName) {
      errors.lastName = 'Le prénom est requis.';
    } else if (!onlyLettersRegex.test(lastName)) {
      errors.lastName = 'Last Name must contain alphabetic letters only.';
    }
  
    if (!country) {
      errors.country = 'Le pays est requis.';
    } else if (!onlyLettersRegex.test(country)) {
      errors.country = 'Country must contain alphabetic letters only.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid.';
    }

    if (!motpasse) {
      errors.motpasse = 'Password is required.';
    } else if (motpasse.length < 6) {
      errors.motpasse = 'Password must be at least 6 characters.';
    } else if (!/(?=.*[A-Z])/.test(motpasse)) {
      errors.motpasse = 'Password must contain at least one uppercase letter.';
    } else if (!/(?=.*\d)/.test(motpasse)) {
      errors.motpasse = 'Password must contain at least one number.';
    }

    if (!phone) {
      errors.phone = 'Phone number is required.';
    } 


    

  

    if (!imageUri) {
      errors.imageUri = 'You need to add the CIN image for security reasons.';
    } 

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };
  // Signup handler
const handleSignup = async () => {
  validateForm();
  if (!isFormValid) {
    Alert.alert("Error", "Please fix the errors in the form before submitting.");
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('lastName', lastName);
  formData.append('country', country);
  formData.append('email', email);
  formData.append('motpasse', motpasse);
  formData.append('phone', phone);
  formData.append('gender', selectedValue);

  // Append the image if available
  if (imageUri) {
    const imageType = imageUri.split('.').pop()?.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';
    formData.append('image', {
      uri: imageUri,
      type: imageType, // Set the image type dynamically
      name: imageName || 'upload.jpg',
    });
  }

  try {
    const response = await axios.post('http://localhost:5000/passenger/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Account Created Successfully!');

    setSuccessMessage('Account Created Successfully!');
    
    console.log(imageUri);
    router.push('/Driver/Verifmail'); // Navigate after success
  } catch (error) {
    if (error.response) {
      console.error('Response Error:', error.response.data);
      alert(`Error1: ${error.response.data.message || 'Error creating account'}`);
      console.log(imageUri);
    } else if (error.request) {
      console.error('No response received:', error.request);
      alert('No response from server. Please try again later.');
      console.log(imageUri);
    } else {
      console.error('Error:', error.message);
      alert(`Error: ${error.message}`);
      console.log(imageUri);
    }
  }
};
  
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.im}>
        <Image source={require('../../assets/images/sign2.png')} style={styles.img1} />
      </View>
      <View style={styles.signform}>
         <Text style={styles.snt}>Sign up</Text>
      <TextInput
          style={styles.inputsp}
          placeholder="Name *"
          value={name}
          onChangeText={setName}
          onBlur={() => handleBlur('name')}
        />
        {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={styles.inputsp}
          placeholder="Last Name * "
          value={lastName}
          onChangeText={setLastName}
          onBlur={() => handleBlur('lastName')}
        />
        {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

        <TextInput
          style={styles.inputsp}
          placeholder="Country * "
          value={country}
          onChangeText={setCountry}
          onBlur={() => handleBlur('country')}
        />
{touched.country && errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

        <TextInput
          style={styles.inputsp}
          placeholder="Email * "
          value={email}
          onChangeText={setEmail}
          onBlur={() => handleBlur('email')}
        />
        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.inputsp}
          placeholder="Password * "
          secureTextEntry
          value={motpasse}
          onChangeText={setmotpasse}
          onBlur={() => handleBlur('password')}
        />
        {touched.password && errors.motpasse && <Text style={styles.errorText}>{errors.motpasse}</Text>}

        <View style={styles.numtlf}>
          <TextInput style={styles.input216} placeholder="+216" defaultValue='+216' />
          <TextInput
            style={styles.inputnum}
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            onBlur={() => handleBlur('phone')}
          />
          
        </View>
        {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton.Android
              value="Male"
              status={selectedValue === 'Male' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedValue('Male')}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Male</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton.Android
              value="Female"
              status={selectedValue === 'Female' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedValue('Female')}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Female</Text>
          </View>
        </View>
        {touched.gender && errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}


<View style={styles.cin}>  
  <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
          <Text style={styles.uploadText}>Upload Your CIN image</Text>
        </TouchableOpacity>
        {touched.imageUri && errors.imageUri && <Text style={styles.errorText}>{errors.imageUri}</Text>}
       

      {imageName && <Text style={styles.fileNameText}>{imageName}</Text>}</View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create Account</Text> 
        </TouchableOpacity>
        
      </View>
      
    
      <TouchableOpacity  style={styles.title1}onPress={() => router.push('/Signin')}>
        <Text style={styles.buttonText}>I have an account</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.title3}onPress={() => router.push('/Driver/Signup')}>
        <Text style={styles.buttonText}>Sign up as a Driver</Text>
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
    height: 825,
    width:410,
  },
  im: {
    borderBottomRightRadius: 150,
    borderBottomLeftRadius: 150,
   
   
  },
  img1: {
    width: 410,
    height: 180,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderBottomRightRadius: 110,
    borderBottomLeftRadius: 110,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 2,
    borderRadius: 50,
    padding: 0,
    borderWidth: 2,
    borderColor: '#2F2BAA',
    marginBottom:10,
    backgroundColor:'#fff',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 11,
    color: '#333',
  },
  signform: {
    marginLeft:30,
    backgroundColor:'#B7B7B7', 
    height :540,
    width : 350,
    padding:20,
    borderRadius:50,
  
   
  },
  inputsp: {
    borderWidth: 2, // Maintains the visible border
    borderColor: '#2F2BAA', // Retains the blue color for consistency
    borderRadius: 70, // Keeps the rounded corners
    width: '100%', // Full width for uniformity
    paddingHorizontal: 15, // Adjusted for even spacing inside the input
    paddingVertical: 8, // Adds better top-bottom padding for the text
    fontSize: 14, // Slightly larger font for readability
    color: '#333', // A standard dark color for the text
    backgroundColor: '#fff', // Ensures contrast with the text
    height: 39, // Provides more height for better touchability
    marginBottom: 5, // Adds consistent spacing between inputs
  },
  
  numtlf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  input216: {
    borderWidth: 2,
    borderColor: '#2F2BAA',
    borderRadius: 70,
    width: '25%',
    paddingLeft: 10,
    height: 39, // Provides more height for better touchability
    marginBottom: 5,
    backgroundColor:'#fff',
  },
  inputnum: {
    borderWidth: 2,
    marginBottom: 5,
    borderColor: '#2F2BAA',
    borderRadius: 70,
    width: '70%',
    paddingLeft: 10,
    height: 40,
    backgroundColor:'#fff',
  },
  button: {
    backgroundColor: '#2F2BAA',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    width:150,
    marginLeft:80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googlegithub:{
    marginLeft:80,
    backgroundColor:'#B7B7B7', 
    height :120,
    width : 250,
    padding:20,
    borderRadius:50,
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    

  },
  imgg:{
width:70,
height:70,


  },
  title1:{
    fontSize:10,
    fontWeight:'bold',
    color:'#2F2BAA',
    marginTop:7,
   
    marginLeft:230,
    
  },
  title3:{
    fontSize:10,
    fontWeight:'bold',
    color:'#2F2BAA',
    marginTop:7,
   
    marginLeft:230,
    
  },
  title:{
    fontSize:10,
    fontWeight:'bold',
    color:'#2F2BAA',
    marginTop:10,
    marginLeft:130,
    
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
  uploadButton: {
    backgroundColor: '#2F2BAA',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '60%',
  },
  uploadText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  previewImage: {
    width: 60,
    height: 30,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  fileNameText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  errorText:{
    color:'red',
  },
  btncontainer:{
    padding:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snt:{
    marginBottom:10,
    marginLeft:120,
    fontSize:20,
    fontWeight:'bold',
    color:'#2F2BAA',
  },
  cin:{

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default Signupps;