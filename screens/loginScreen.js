import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';


export default class LoginScreen extends React.Component {

	constructor(props) {

		super(props);
		console.log('MOBAPPCONSTRUCTOR', props);

		this.state = {
			errorText: false,
			localDb: false,
		};

		this.beApiUrl = this.state.localDb ? 'http://192.168.0.3:9057/api/' : 'https://streamlinebookings.com:9056/api/';
		this.imagesUrl = 'https://streamlinebookings.com:9056/imgs/';

		// Bind local methods
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLocalDb = this.handleLocalDb.bind(this);
	}

	handleEmail (email) {
		this.setState({
			email: email,
		})
	}

	handlePassword (password) {
		this.setState({
			password: password,
		})
	}
	handleLocalDb () {
		this.setState({
			localDb: !this.state.localDb
		});
	}

	handleLogin () {
		console.log('HANDLELOGIN', this.state);

		this.beApiUrl = this.state.localDb ? 'http://192.168.0.3:9057/api/' : 'https://streamlinebookings.com:9056/api/';

		let email = this.state.localDb ? 'jjj' : this.state.email;
		let password = this.state.localDb ? '123' : this.state.email;

		fetch(this.beApiUrl + 'login', {
			method: 'post',
			body: JSON.stringify({
				fromMobile: true,
				email: email,
				password: password,
			})
		})
			.then(response => {
				console.log('FETCHRAWRESPONSE', response);
				if (response.status == 200) return response.json();
				return response;
			})
			.then(response => {
				console.log('LOGINREPONSE', response);
				if (response.person) {
					this.setState({
						errorText: 'Welcome ' + response.person.firstName,
						fullName: response.person.firstName + ' ' + response.person.lastName,
						person: response.person,
						group: response.group,
						persons: response.persons,
					}, () => {
						console.log('StateAfterLogin', this.state);
					});

					// Go to the booked screen
					this.props.navigation.navigate('Booked', {
						fullName: response.person.firstName + ' ' + response.person.lastName,
						person: response.person,
						persons: response.persons,
					});

				} else {
					this.setState({
						person: {},
						errorText: response._bodyText,
					})
				}
			})
			.catch(err => {
				console.log('LOGINERROR', err);
			});
	}


	//
	// Rendering
	//
	render() {

		return (

			<View style={{ flex: 1 }}>

				{/* Background image */}
				<View style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
				}}>
					<Image
						style={{ flex: 1, resizeMode: 'cover' }}
						source={{ uri: this.imagesUrl + 'mob/backgrounds/background-login.jpg' }}/>
				</View>

				{/* Logo */}
				<View style={{ flex: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
					<Image
						style={{ resizeMode: 'contain', height: '70%', width: '70%' }}
						source={{ uri: this.imagesUrl + 'common/streamline-logo.png' }}/>
				</View>

				{/* Login form */}
				<View style={{ flex: 3, justifyContent: 'center' }}>
					<FormInput placeholder={'Email address'} onChangeText={ this.handleEmail }/>
					<FormInput placeholder={'Password'} secureTextEntry={ true } onChangeText={ this.handlePassword }/>

					<FormValidationMessage containerStyle={{ backgroundColor: 'transparent' }}>{ this.state.errorText || '' }</FormValidationMessage>

					<Button
						icon={{name: 'paper-plane', type: 'font-awesome'}}
						backgroundColor='green'
						title='Login'
						onPress={ this.handleLogin } />
				</View>

				<View style={{ flex: 2, justifyContent: 'space-between' }}>

					<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
						<Button
							icon={{name: 'thumbs-up', type: 'font-awesome'}}
							backgroundColor='transparent'
							title='Create new account'
							style={{ width:  10 }}
						/>
						<Button
							iconRight={{name: 'thumbs-down', type: 'font-awesome'}}
							backgroundColor='transparent'
							title='Forgot password'
							style={{ width:  10 }}
						/>
					</View>

					<CheckBox
						title='Local'
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						containerStyle={{ backgroundColor: 'pink', marginBottom: 20 }}
						checked={ this.state.localDb }
						onPress={ this.handleLocalDb }
					/>

				</View>


			</View>
		);
	}
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: '#fff',
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 	},
// });