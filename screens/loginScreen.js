// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';

// Our imports
import { env } from '../environment';


class LoginScreen extends React.Component {

	constructor (props) {

		super(props);
		console.log('LOGINSCREENCONSTRUCTOR', props);

		this.state = {
			email: '',
			password: '',
			localDb: false,
		};

		// Bind local methods
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
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
	handleLogin (email, password, localDb) {
		console.log('HANDLELOGIN', email, password, localDb);

		let beApiUrl = localDb ? env.localApiUrl : env.beApiUrl;

		email = localDb ? 'jjj' : email;
		password = localDb ? '123' : password;

		fetch(beApiUrl + 'login', {
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

					// Call the redux action = set the store
					this.props.setGroup(response.group);
					this.props.setPerson(response.person);
					this.props.setPersons(response.persons);
					this.props.setToken(response.token);
					this.props.setLocalDb(localDb);

					// Go to next screen
					this.props.navigation.navigate('Book'); // Booked

				} else {
					this.setState({
						person: {},
						afterLoginMessage: response._bodyText,
					})
				}
			})
			.catch(err => {
				console.log('LOGINERROR', err);
				this.setState({
					afterLoginMessage: err
				})
			});
	}

	render () {

		console.log('RENDERINGLOGINSCREEN', this.props, this.state);

		return (
			<View style={{flex: 1}}>

				{/* Background image */}
				<View style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
				}}>
					<Image
						style={{flex: 1, resizeMode: 'cover'}}
						source={{uri: env.imagesUrl + 'mob/backgrounds/background-login.jpg'}}/>
				</View>

				{/* Logo */}
				<View style={{flex: 2, justifyContent: 'flex-end', alignItems: 'center'}}>
					<Image
						style={{resizeMode: 'contain', height: '70%', width: '70%'}}
						source={{uri: env.imagesUrl + 'common/streamline-logo.png'}}/>
				</View>

				{/* Login form */}
				<View style={{flex: 3, justifyContent: 'center'}}>
					<FormInput placeholder={'Email address'} onChangeText={this.handleEmail}/>
					<FormInput placeholder={'Password'} secureTextEntry={true} onChangeText={this.handlePassword}/>

					<FormValidationMessage
						containerStyle={{backgroundColor: 'transparent'}}>{this.state.afterLoginMessage || ''}</FormValidationMessage>

					<Button
						icon={{name: 'paper-plane', type: 'font-awesome'}}
						backgroundColor='green'
						title='Login'
						onPress={(event) => this.handleLogin(this.state.email, this.state.password, this.state.localDb) }/>
				</View>

				<View style={{flex: 2, justifyContent: 'space-between'}}>

					<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
						<Button
							icon={{name: 'thumbs-up', type: 'font-awesome'}}
							backgroundColor='transparent'
							title='Create new account'
							style={{width: 10}}
						/>
						<Button
							iconRight={{name: 'thumbs-down', type: 'font-awesome'}}
							backgroundColor='transparent'
							title='Forgot password'
							style={{width: 10}}
						/>
					</View>

					<CheckBox
						title='Local'
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						containerStyle={{backgroundColor: 'pink', marginBottom: 20}}
						checked={this.state.localDb}
						onPress={this.handleLocalDb}
					/>

				</View>
			</View>
		)
	}
};

export default LoginScreen;