import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import LoginScreen from './screens/loginScreen';
import BookedScreen from './screens/bookedScreen';


const RootNavigator = DrawerNavigator(
	{
		Login: {
			screen: LoginScreen,
			headerMode: 'none',
			navigationOptions: {
				drawerLabel: 'Login',
				headerMode: 'none',
				headerTitle: 'Welcome to Streamline Bookings',
			}
		},
		Booked: {
			screen: BookedScreen,
			navigationOptions: {
				drawerLabel: 'My Classes',
				// headerTitle: 'My Classes',
				drawerIcon: ({ tintColor }) => (
					<Image
						source={ require('./icons/chats-icon.png') }
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

// const RootNavigator = StackNavigator(
// 	{
// 		Login: {
// 			screen: LoginScreen,
// 			headerMode: 'none',
// 			navigationOptions: {
// 				headerMode: 'none',
// 				headerTitle: 'Welcome to Streamline Bookings',
// 			}
// 		},
// 		Booked: {
// 			screen: BookedScreen,
// 			navigationOptions: {
// 				headerTitle: 'My Classes',
// 			}
// 		}
//
// 	}, {
// 		initialRouteName: 'Login'
// 	}
// );

export default RootNavigator;


