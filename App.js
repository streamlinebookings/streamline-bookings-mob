// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

// Our imports
import LoginScreen from './screens/loginScreen';
import BookedScreen from './screens/bookedScreen';


const RootNavigator = DrawerNavigator(
	{
		Login: {
			screen: LoginScreen,
			navigationOptions: {
				drawerLabel: 'Login',
				drawerIcon: ({ tintColor }) => (
					<Image
						source={ require('./icons/hamburger-menu.png') }
						style={ [styles.icon, {tintColor: tintColor}] }
					/>
				),
			}
		},
		Booked: {
			screen: BookedScreen,
			navigationOptions: {
				drawerLabel: 'My Classes',
				drawerIcon: ({ tintColor }) => (
					<Image
						source={ require('./icons/hamburger-menu.png') }
						style={ [styles.icon, {tintColor: tintColor}] }
					/>
				),
			}
		}

	}, {
		initialRouteName: 'Login'
	}
);

const styles = StyleSheet.create({
	icon: {
		width: 24,
		height: 24,
	},
});

export default RootNavigator;


