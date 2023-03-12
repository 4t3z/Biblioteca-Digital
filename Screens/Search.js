import React, {Component} from "react"
import { StyleSheet, Text, View } from 'react-native';

export default class SearchScreen extends Component{
    render(){
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Busqueda</Text>
    </View>
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
    fontSize:30
  }
});