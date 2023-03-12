import React, {Component} from "react";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TransactionScreen from "../Screens/Transaction";
import SearchScreen from "../Screens/Search";
import Ionicons from "react-native-vector-icons/Ionicons"

const Tab = createBottomTabNavigator();

export default class BottomTabNavigator extends Component{
    render(){
        return(
            <NavigationContainer>
                <Tab.Navigator 
                    screenOptions = {({route})=>({
                        tabBarIcon: ({focused, color, size})=>{
                            let iconName
                            if(route.name === "Transaction"){
                                iconName = "book"
                            } else if(route.name === "Search"){
                                iconName = "search"
                            }
                            return(
                                <Ionicons 
                                    name = {iconName}
                                    size = {size}
                                    color = {color}
                                />
                            )
                        }
                    })}
                    tabBarOptions = {{
                        activeTintColor: "#ffffff",
                        inactiveTintColor: "black",
                        style:{
                            height: 130,
                            width: 200,
                            borderTopWidth: 100,
                            backgroudColor: "#5653d4",
                        },
                        labelSytle:{
                            fontSize: 20,
                            fontFamily: "Comfortaa_600SemiBold"    
                        },
                        labelPosition: "beside-icon",
                        tabStyle:{
                            marginTop: 5,
                            marginLeft: 10,
                            marginRight: 10,
                            borderRadius: 30,
                            borderWidth: 2,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#5653d4",
                        },
                    }}
                >
                    <Tab.Screen name = "Transaction" component = {TransactionScreen}/>
                    <Tab.Screen name = "Search" component = {SearchScreen}/>
                </Tab.Navigator>
            </NavigationContainer>
        )
    }
}