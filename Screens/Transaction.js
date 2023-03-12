import React, {Component} from "react"
import { 
   StyleSheet,
   Text, 
   View, 
   TouchableOpacity, 
   TextInput, 
   Image, 
   ImageBackground, 
   ToastAndroid,
   KeyboardAvoidingView,
  } from 'react-native';
//import { TouchableOpacity } from "react-native-gesture-handler";
import * as Permissions from "expo-permissions";
import {BarCodeScanner} from "expo-barcode-scanner";
//import firebase from "firebase";
import db from "../config";

const bgImage = require("../assets/background2.png")
const appIcon = require("../assets/appIcon.png")
const appName = require("../assets/appName.png")

export default class TransactionScreen extends Component{
  constructor(props){
    super(props);
      this.state={
        bookId: "",
        studentId: "",
        domState: "normal",
        hasCameraPermissions: null,
        scanned: false,
        bookName: "",
        studentName: ""
    }
  }

  getCameraPermissions = async domState => {
    const{status} = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({
        hasCameraPermissions: status === "granted",
        domState: domState,
        scanned: false
      });
  };

  handleBarCodeScanned = async ({type, data}) => {
    const{domState} = this.state;
    if(domState === "bookId"){
        this.setState({
        scannedData: data,
        domState: "normal",
        scanned: true
      });
    }else if(domState === "studentId"){
      this.setState({
        scannedData: data,
        domState: "normal",
        scanned: true
      });
    }
  };

  handleTransaction = async () => {
    var {bookId, studentId} = this.state;
    await this.getBookDetails(bookId);
    await this.getStudentDetails(studentId);

    db.collection("book")
    .doc(bookId)
    .get()
    .then(doc => {
      var book = doc.data()
      if(book.is_book_available){
        var {bookName, studentName} = this.state;
        this.initiateBookIssue(bookId, studentId, bookName, studentName);
        ToastAndroid.show(
          "Libro emitido al Alumno", ToastAndroid.SHORT
        );
      }
      else{
        var {bookName, studentName} = this.state;
        this.initiateBookReturn(bookId, studentId, bookName, studentName);
        ToastAndroid.show(
          "Libro devuelto a la Biblioteca", ToastAndroid.SHORT
        );
      }
    });
  }

  getBookDetails = bookId => {
    bookId = bookId.trim();
    db.collection("books")
    .where("book_ID","==",bookId)
    .get()
    .then(snapshot => {
      snapshot.docs.map(doc => {
        this.setState({
          bookName: doc.data().book_details.book_name
        });
      });
    });
  };

  getStudentDetails = studentId => {
    studentId = studentId.trim();
    db.collection("stundents")
    .where("student_ID","==",studentId)
    .get()
    .then(snapshot => {
      snapshot.docs.map(doc => {
        this.setState({
          studentName: doc.data().student_details.student_name
        });
      });
    });
  };
  
  initiateBookIssue = async (bookId, studentId, bookName, studentName) => {
    db.collection("transactions").add({
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: firebase.firestore.Timestamp.now().toDate(),
      transaction_type: "issue"
    });
    db.collection("books")
      .doc(bookId)
      .update({
        is_book_available: false
      });
    db.collection("students")
      .doc(studentId)
      .update({
        number_of_books_issued: firebase.firestore.FieldValue.increment(1)
      });
    this.setState({
      bookId: "",
      studentId: ""
    });
  };
  
  initiateBookReturn = async (bookId, studentId, bookName, studentName) => {
    db.collection("transactions").add({
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: firebase.firestore.Timestamp.now().toDate(),
      transaction_type: "return"
    });
    db.collection("books")
      .doc(bookId)
      .update({
        is_book_available: true
      });
    db.collection("students")
      .doc(studentId)
      .update({
        number_of_books_issued: firebase.firestore.FieldValue.increment(-1)
      });
    this.setState({
      bookId: "",
      studentId: ""
    });
  };

  render(){
    const {domState, scanned, studentId, bookId} = this.state;
    if(domState !== "normal"){
      return(
        <BarCodeScanner 
          onBarCodeScanned={scanned ? undefined: this.handleBarCodeScanned}
          style = {StyleSheet.absoluteFillObject}
        />
      );
    }

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ImageBackground source={bgImage} style = {styles.bgImage}>
        <View style = {styles.upperContainer}>
          <Image source={appIcon} style = {styles.appIcon}/>
          <Image source={appName} style = {styles.appName}/>
        </View>
        <View style = {styles.lowerContainer}>
          <View style = {styles.textInputContainer}>
            <TextInput 
              style = {styles.textInput}
              placeholder = {"ID del Libro"}
              placeholderTextColor = {"#ffffff"}
              value = {bookId}
              onChangeText = {text => this.setState({
                bookId: text
              })}
            />
            <TouchableOpacity style={styles.scanButton} onPress = {()=> this.getCameraPermissions("bookId")}>
             <Text style={styles.scanButtonText}>
                Escanear
             </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.textInputContainer, {marginTop: 25}]}>
            <TextInput 
              style = {styles.textInput}
              placeholder = {"ID del Alumno"}
              placeholderTextColor = {"#ffffff"}
              value = {studentId}
              onChangeText = {text => this.setState({
                studentId: text
              })}
            />
            <TouchableOpacity style={styles.scanButton} onPress = {()=> this.getCameraPermissions("studdentId")}>
              <Text style={styles.scanButtonText}>
                Escanear
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button,{
              marginTop: 25,
              marginLeft: 140,
              width: "45%",
              borderWidth: 3,
              borderColor: "white"
              }]} onPress = {this.handleTransaction}>
              <Text style={{
                color: "white",
                fontSize: 24,
                marginLeft: 76,
                fontFamily: "Comfortaa_600SemiBold",
              }}>Enviar</Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5653d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color:"#ffff",
    fontSize:20
  },
  button:{
    width: "65%",
    height:60,
    justifyContent: "center",
    alingItems: "center",
    backgroundColor: "#f48d20",
    borderRadius:15
  },
  textInputContainer:{
    width: "69%",
    marginLeft: 80,
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9dfd24",
    borderColor: "#ffffff",
    textAlign: "center"
  },
  textInput:{
    width: "57%",
    height: 50,
    padding: 10,
    fontFamily: "Comfortaa_600SemiBold",
    borderColor: "#ffffff",
    borderWidth: 3,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: "#5653d4"
  },
  scanButtonText:{
    fontSize: 24,
    color: "#0a0101",
    fontFamily: "Comfortaa_600SemiBold",
    justifyContent: "center",
    marginLeft: 15
  },
  upperContainer:{
    flex: 0.5,
    justifyContent: "center",
    alingItems: "center"
  },
  lowerContainer:{
    flex: 0.5,
    alingItems: "center"
  },
  bgImage:{
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  appIcon:{
    witdh: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 30,
    marginLeft: "23%"
  },
  appName:{
    witdh: 80,
    height: 80,
    resizeMode: "contain",
    marginTop: 50
  }
});