// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';
import { DrawerNavigator } from 'react-navigation';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

// Our imports
import * as Action from './common/actions';
// import LoginScreen from './screens/loginScreen';
import LoginContainer from './screens/loginContainer';
import BookedScreen from './screens/bookedScreen';
import BookScreen from './screens/bookScreen';

// Define redux store
let store = createStore(Action.Slb, {initReduxStore: true});

// Every time the redux state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
	console.log('REDUXSTATECHANGEDTO', store.getState())
)


const RootNavigator = DrawerNavigator(
	{
		Login: {
			screen: LoginContainer,
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
		},
		Book: {
			screen: BookScreen,
			navigationOptions: {
				drawerLabel: 'Book a Class',
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

class App extends React.Component {

	constructor(props) {
		super(props);

		// Log the initial state
		console.log('INITIALSTATE', store.getState(), this.props)

	}

	render () {
		return (
			<Provider store={ store }>

				<RootNavigator />

			</Provider>
		);
	}
}

// const mapStateToProps = state => {
// 	return state;
// }
//
// App = connect (
// 	mapStateToProps
// )(App)


export default App
