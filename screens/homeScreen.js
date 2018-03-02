// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';

// Our imports
import { env } from '../environment';


class HomeScreen extends React.Component {

	constructor (props) {

		super(props);
		console.log('HOMESCREENCONSTRUCTOR', props);

		this.state = {
			buttonPressed: false,
			email: '',
			password: '',
			localDb: false,
		};

		// Bind local methods
		// this.handleEmail = this.handleEmail.bind(this);
		// this.handlePassword = this.handlePassword.bind(this);
		// this.handleLocalDb = this.handleLocalDb.bind(this);
		// this.handleRegister = this.handleRegister.bind(this);
	}

	// handleEmail (email) {
	// 	this.setState({
	// 		email: email,
	// 	})
	// }
	// handlePassword (password) {
	// 	this.setState({
	// 		password: password,
	// 	})
	// }
	// handleLocalDb () {
	// 	this.setState({
	// 		localDb: !this.state.localDb
	// 	});
	// }
	// handleHome (email, password, localDb) {
	// 	console.log('HANDLEHOME', email, password, localDb);
	//
	// 	let beApiUrl = localDb ? env.localApiUrl : env.beApiUrl;
	//
	// 	email = localDb ? 'sam@jones.com' : email;
	// 	password = localDb ? '123456789' : password;
	//
	// 	fetch(beApiUrl + 'home', {
	// 		method: 'post',
	// 		body: JSON.stringify({
	// 			fromMobile: true,
	// 			email: email,
	// 			password: password,
	// 		})
	// 	})
	// 		.then(response => {
	// 			console.log('FETCHRAWRESPONSE', response);
	// 			if (response.status == 200) return response.json();
	// 			return response;
	// 		})
	// 		.then(response => {
	// 			console.log('HOMEREPONSE', response);
	// 			if (response.person) {
	//
	// 				// Call the redux action = set the store
	// 				this.props.setGroup(response.group);
	// 				this.props.setPerson(response.person);
	// 				this.props.setPersons(response.persons);
	// 				this.props.setToken(response.token);
	// 				this.props.setLocalDb(localDb);
	//
	// 				// Go to next screen
	// 				this.props.navigation.navigate('Account'); // Booked Book
	//
	// 			} else {
	// 				this.setState({
	// 					person: {},
	// 					afterHomeMessage: response._bodyText,
	// 				})
	// 			}
	// 		})
	// 		.catch(err => {
	// 			console.log('HOMEERROR', err);
	// 			this.setState({
	// 				afterHomeMessage: err
	// 			})
	// 		});
	// }
	// handleRegister () {
	// 	this.setState({
	// 		buttonPressed: true,
	// 	});
	//
	// 	// Go to next screen
	// 	this.props.navigation.navigate('CarerDetails', {from: 'Home'});
	// }

	render () {

		console.log('RENDERINGHOMESCREEN', this.props, this.state, env);

		return (
			<View style={{flex: 1}}>

				{/* Background image */}
				<View style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					opacity: 0.6,
				}}>
					<Image
						style={{flex: 1, resizeMode: 'cover'}}
						source={{uri: env.imagesUrl + 'mob/backgrounds/background-home.jpg'}}/>
				</View>

				{/* Logo */}
				<View style={{flex: 2, justifyContent: 'flex-end', alignItems: 'center'}}>
					<Image
						style={{resizeMode: 'contain', height: '70%', width: '70%'}}
						source={{uri: env.imagesUrl + 'common/streamline-logo.png'}}/>
				</View>

				{/* Home form */}
				<View style={{flex: 2, justifyContent: 'space-around'}}>

					<Button
						icon={{name: 'clipboard', type: 'font-awesome'}}
						backgroundColor='green'
						title='My Classes'
						onPress={ () => this.props.navigation.navigate('Booked') }
					/>
					<Button
						icon={{name: 'tag', type: 'font-awesome'}}
						backgroundColor='green'
						title='Book a Class'
						onPress={ () => this.props.navigation.navigate('Book') }
					/>
					<Button
						icon={{name: 'bars', type: 'font-awesome'}}
						backgroundColor='green'
						title='Menu'
						onPress={ () => this.props.navigation.navigate('DrawerOpen') }
					/>
				</View>

				<View style={{ flex: 1 }}></View>


				</View>
		)
	}
};

export default HomeScreen;