// Third party imports
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// Our imports
import * as Action from './common/actions';
import LoginContainer from './screens/loginContainer';
import BookedContainer from './screens/bookedContainer';
import BookedClassActionsContainer from './screens/bookedClassActionsContainer';
import BookContainer from './screens/bookContainer';
import BookDetailsContainer from './screens/bookDetailsContainer';
import BookPayContainer from './screens/bookPayContainer';
import AccountContainer from './screens/accountContainer';
import GroupDetailsContainer from './screens/groupDetailsContainer';
import CarersContainer from './screens/carersContainer';

// Define redux store
let store = createStore(Action.Slb);

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
			},
		},
		Booked: {
			screen: BookedContainer,
			navigationOptions: {
				drawerLabel: 'My Classes',
				drawerIcon: ({ tintColor }) => (
					<Image
						source={ require('./icons/hamburger-menu.png') }
						style={ [styles.icon, {tintColor: tintColor}] }
					/>
				),
			},
		},
		BookedClassActions: {
			screen: BookedClassActionsContainer,
			navigationOptions: {
				drawerLabel: () => null
			},
		},
		Book: {
			screen: BookContainer,
			navigationOptions: {
				drawerLabel: 'Book a Class',
				drawerIcon: ({ tintColor }) => (
					<Image
						source={ require('./icons/hamburger-menu.png') }
						style={ [styles.icon, {tintColor: tintColor}] }
					/>
				),
			},
		},
		BookDetails: {
			screen: BookDetailsContainer,
			navigationOptions: {
				drawerLabel: () => null
			},
		},
		BookPay: {
			screen: BookPayContainer,
			navigationOptions: {
				drawerLabel: () => null
			}
		},
		Account: {
			screen: AccountContainer,
			navigationOptions: {
				drawerLabel: 'Account',
				drawerIcon: ({tintColor}) => (
					<Image
						source={require('./icons/hamburger-menu.png')}
						style={[styles.icon, {tintColor: tintColor}]}
					/>
				),
			},
		},
		GroupDetails: {
			screen: GroupDetailsContainer,
			navigationOptions: {
				drawerLabel: () => null
			},
		},
		Carers: {
			screen: CarersContainer,
			navigationOptions: {
				drawerLabel: () => null
			},
		},
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

export default App
