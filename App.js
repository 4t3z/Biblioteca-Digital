import React, {Component} from "react";
import BottomTabNavigator from "./Components/BottomTabNavigator";
import { Comfortaa_600SemiBold } from "@expo-google-fonts/comfortaa";
import * as Font from "expo-font"

export default class App extends Component{
  constructor(){
    super();
    this.state = {
      fontLoaded: false
    }
  }
  async loadFonts(){
    await Font.loadAsync({
      Comfortaa_600SemiBold: Comfortaa_600SemiBold
    });
    this.setState({
      fontLoaded: true
    })
  }

  componentDidMount(){
    this.loadFonts();
  }

  render(){
    const {fontLoaded} = this.state;
    if(fontLoaded){
      return <BottomTabNavigator/>
    }
    return null;
  }
}