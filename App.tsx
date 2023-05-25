import { initializeApp } from 'firebase/app';
import React from 'react';

import { Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const uri = 'https://www.solofondos.com/wp-content/uploads/2018/08/bonita-imagen-de-lago-para-fondo-de-pantalla.jpg'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

const HomeScreen = () => {
  return(<View>
    <Text>Hola</Text>
  </View>);
}

const LoginScreen = () => {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const navigation = useNavigation();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log("Cuenta creada");

      const user = userCredential.user;
      console.log(user);
    })
      .catch(error => {
        console.log(error)
        Alert.alert(error.message)
      })
  }
  const handleSingIn = () => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential: { user: any; }) => {
      console.log('signed in')
      const user = userCredential;
      console.log(user);
      navigation.navigate('Home')
    })
      .catch((error: any) => {
        console.log(error)
      })
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
      <View style={styles.login}>
        <Text
          style={{ fontSize: 17, fontWeight: '400' }}>
          Correo
        </Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          placeholder='Correo'></TextInput>
        <Text
          style={{ fontSize: 17, fontWeight: '400' }}>
          Contraseña
        </Text>
        <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder='Contraseña' secureTextEntry={true}></TextInput>
        <TouchableOpacity onPress={handleSingIn} style={styles.button}>
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    width: 350,
    height: 350,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    overflow: 'scroll'

  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
    width: 250,
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#ffffff90',
    marginBottom: 20
  },
  button: {
    width: 250,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#00CFEB90',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  }
});
