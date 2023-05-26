import firebase,{ initializeApp } from 'firebase/app';
import React, { useState, useEffect } from 'react';

import { Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, DocumentData, DocumentReference} from 'firebase/firestore'
import appFirebase from './firebase-config';

const database = getFirestore(appFirebase)


const uri = 'https://www.solofondos.com/wp-content/uploads/2018/08/bonita-imagen-de-lago-para-fondo-de-pantalla.jpg'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Lista" component={ProducsScreen} />
        <Stack.Screen name="Create" component={crearProductos}/>
    
        <Stack.Screen name="Home" component={homeScreen}/>
        <Stack.Screen name="Servicios" component={ServicesScreen}/>
        <Stack.Screen name="crearServicios" component={crearServices}/>
      </Stack.Navigator>

    </NavigationContainer>
  );
}



const crearProductos = () =>{
  const navigation = useNavigation();
  const initialState = {
    nombre:'',
    venta:'',
    compra:'',
    unidades:''

  }

  const [state, setState] = useState(initialState)
  const handleChangeText = (value:any, name:any)=>{
    setState({...state,[name]:value})

  }


  const saveProducts = async()=>{
    //console.log(state)
    
    try{
      await addDoc(collection(database, 'productos'),{
        ...state
      })

      Alert.alert('Alerta', 'guardado con exito')
      navigation.navigate('Lista' as never)
      //console.log(state)
     
    }
    catch{
      
    }
  }


  return(
    <ScrollView style={styles.Pantalla}>
      <Text style ={styles.TextoTitulo}> Crear Producto</Text>

      <View style = {styles.inputgroup}>
        <TextInput placeholder='nombre' value={state.nombre} onChangeText={(value)=>handleChangeText(value, 'nombre')}
        />
      </View>
      <View  style = {styles.inputgroup}>
        <TextInput placeholder='venta'value={state.venta} onChangeText={(value)=>handleChangeText(value, 'venta')}/>
      </View>
      <View  style = {styles.inputgroup}>
        <TextInput placeholder='compra' value={state.compra} onChangeText={(value)=>handleChangeText(value, 'compra')}/>
      </View>
      <View  style = {styles.inputgroup}>
        <TextInput placeholder='unidades' value={state.unidades} onChangeText={(value)=>handleChangeText(value, 'unidades')}/>
      </View>


      <View>
        <Button title='Guardar Producto' onPress={saveProducts}/>
      </View>
    </ScrollView>
  )
}
const ProducsScreen = () => {
  const navigation = useNavigation();

  const [lista, setLista] = useState([])

  // logica para llamara la lista de documentos de la coleccion proteinas
  useEffect(() => {
    const getLista = async()=>{
        try {
            const querySnapshot = await getDocs(collection(database, 'productos'))
            const docs = []
            querySnapshot.forEach((doc)=>{
                const {nombre, venta, compra, unidades} = doc.data()
                docs.push({
                    id:doc.id,
                    nombre,
                    venta,
                    compra,
                    unidades,
                })
            })
            setLista(docs);
        } catch (error) {
            console.log(error);
        }
    }
    getLista()
}, [lista])


  return(<View>
    <ScrollView>
      <TouchableOpacity style={styles.SecButton} onPress={() => navigation.navigate('Create' as never)} >
        <Text style = {styles.TextoBoton}> Agregar Productos</Text>
      </TouchableOpacity>

      <View>
        <Text style={styles.TextoTitulo}>Lista De Productos</Text>
      </View>


      <View>
        {
          lista.map((producto)=>(
            <TouchableOpacity key={producto.id} style={styles.BotonLista} >
                <Text style={styles.TextoNombre}>{producto.nombre},{producto.venta},{producto.compra},{producto.unidades}</Text>
            </TouchableOpacity>
          ))
        }
      </View>

    </ScrollView>

  </View>);
}

/* const showDetails = (props) => {
  
  const [producto, setProducto] = useState()
  
  const getProduct = async(productoId: string) => {
    try {
      const docRef = doc(database, 'productos', productoId)
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()
      console.log("El producto es: "+data);
      console.log("El nombre es: "+data.nombre);
      console.log("El id: "+data.id);
      console.log("La venta es: "+data.venta);
      console.log("La compra es: "+data.compra);
      console.log("Las unidades son: "+data.unidades);


    } catch (error) {
      console.log(error)
    }
  }

  const deleteProduct = async (id:string) => {
    await deleteDoc(doc(database, "productos", id))
    Alert.alert("Se borró el producto");
  }

  useEffect(() => {
    getProduct(props.route.params.productoId)
  }, [])

  return(
    <View>
      <Text>{props.route.params.productoId}</Text>
      <Text>{producto.nombre}</Text>
      <TouchableOpacity onPress={() => {deleteProduct(id)}}><Text>Borrar</Text></TouchableOpacity>
    </View>
  );
} */


const LoginScreen = () => {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const navigation = useNavigation();
  const auth = getAuth(appFirebase)

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
      navigation.navigate('Home' as never)
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
const homeScreen = () =>{
  const navigation = useNavigation();
  return(
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Lista')}>
        <Text style={styles.TextoBoton}>Lista De Productos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Servicios')}>
        <Text>Lista De Servicios</Text>
      </TouchableOpacity>
    </View>
    
  );

}


const ServicesScreen = () => {
  const navigation = useNavigation();

  const [lista, setLista] = useState([])

  // logica para llamara la lista de documentos de la coleccion proteinas
  useEffect(() => {
    const getLista = async()=>{
        try {
            const querySnapshot = await getDocs(collection(database, 'servicios'))
            const docs = []
            querySnapshot.forEach((doc)=>{
                const {nombre, precio, costo} = doc.data()
                docs.push({
                    id:doc.id,
                    nombre,
                    precio,
                    costo,
                })
            })
            setLista(docs);
        } catch (error) {
            console.log(error);
        }
    }
    getLista()
}, [lista])


  return(<View>
    <ScrollView>
      <TouchableOpacity style={styles.SecButton} onPress={() => navigation.navigate('crearServicios' as never)} >
        <Text style = {styles.TextoBoton}> Agregar Servicio</Text>
      </TouchableOpacity>

      <View>
        <Text style={styles.TextoTitulo}>Lista De Servicios</Text>
      </View>


      <View>
        {
          lista.map((producto)=>(
            <TouchableOpacity key={producto.id} style={styles.BotonLista}>
                <Text style={styles.TextoNombre}>{producto.nombre},{producto.precio},{producto.costo}</Text>
            </TouchableOpacity>
          ))
        }
      </View>

    </ScrollView>

  </View>);
}
const crearServices = () =>{
  const navigation = useNavigation();
  const initialState = {
    nombre:'',
    precio:'',
    costo:''
    

  }

  const [state, setState] = useState(initialState)
  const handleChangeText = (value:any, name:any)=>{
    setState({...state,[name]:value})

  }


  const saveProducts = async()=>{
    //console.log(state)
    
    try{
      await addDoc(collection(database, 'servicios'),{
        ...state
      })

      Alert.alert('Alerta', 'guardado con exito')
      navigation.navigate('Servicios' as never)
      //console.log(state)
     
    }
    catch{
      
    }
  }


  return(
    <ScrollView style={styles.Pantalla}>
      <Text style ={styles.TextoTitulo}> Crear Servicio</Text>

      <View style = {styles.inputgroup}>
        <TextInput placeholder='nombre' value={state.nombre} onChangeText={(value)=>handleChangeText(value, 'nombre')}
        />
      </View>
      <View  style = {styles.inputgroup}>
        <TextInput placeholder='venta'value={state.precio} onChangeText={(value)=>handleChangeText(value, 'venta')}/>
      </View>
      <View  style = {styles.inputgroup}>
        <TextInput placeholder='compra' value={state.costo} onChangeText={(value)=>handleChangeText(value, 'compra')}/>
      </View>


      <View>
        <Button title='Guardar Servicio' onPress={saveProducts}/>
      </View>
    </ScrollView>
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
  },
  SecButton:{
    backgroundColor:'cyan',
     height:35,
     borderColor:'black',
    borderWidth:1     
  },
  TextoBoton:{
    fontSize:18,
    textAlign:'center'
  },
  TextoTitulo:{
    textAlign:'center',
    marginTop:20,
    marginBottom:10,
    fontSize: 25
  },  
  TextoNombre:{
    fontSize:16
  },
  BotonLista:{
    backgroundColor:'#DDDDDD',
    borderBottomWidth:1,
    borderBottomColor:'#cccccc',
    marginBottom:3,
    padding:5
  },
  Pantalla:{
    flex:1,
    padding:35
  },  
  inputgroup:{
    flex:1,
    padding:0,
    marginBottom:20,
    borderBottomWidth:1,
    borderBottomColor:'#cccccc'
  },  


  
});
