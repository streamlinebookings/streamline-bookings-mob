// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { Badge, FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';

// Our imports
import { env } from '../environment';
import VenuesScreen from "./venuesScreen";


class LoginScreen extends React.Component {

	constructor (props) {

		super(props);
		console.log('LOGINSCREENCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		this.state = {
			buttonPressed: false,
			email: '',
			fullName: fullName,
			localDb: false,
			password: '',
		};

		// Bind local methods
		this.handleEmail = this.handleEmail.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handleLocalDb = this.handleLocalDb.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
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

		email = localDb ? 'joe@smith.com' : email;
		password = localDb ? '123456789' : password;

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
					this.props.navigation.navigate('Home'); // Account

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
					afterLoginMessage: 'Unknown error :-(  Possibly the internet or the server is unavailable'
				})
			});
	}
	handleLogout () {
		console.log('HANDLELOGOUT');

		// Call the redux action = set the store
		this.props.setGroup();
		this.props.setPerson();
		this.props.setPersons();
		this.props.setToken();
		this.props.setLocalDb();

		this.setState({
			fullName: 'Not logged in',
		});

	}
	handleRegister () {
		this.setState({
			buttonPressed: true,
		});

		// Go to next screen
		this.props.navigation.navigate('CarerDetails', {from: 'Login'});
	}

	render () {

		console.log('RENDERINGLOGINSCREEN', this.props, this.state, env);

		const LoginForm = () => {

			return (
				<View style={{flex: 3, justifyContent: 'center'}}>

					<View>
						<FormInput
							placeholder={ 'Email address' }
							placeholderTextColor={ '#666060' }
							onChangeText={ this.handleEmail }
							keyboardType={ 'email-address' }
							selectionColor={ 'red' }
							style={{ color: '#000000' }}/>
						<FormInput
							placeholder={ 'Password' }
							placeholderTextColor={ '#666060' }
							secureTextEntry={ true }
							onChangeText={ this.handlePassword }
							selectionColor={ 'red' }
							style={{ color: '#000000' }}/>

						<FormValidationMessage
							containerStyle={{ backgroundColor: 'transparent' }}>
							<Text style={{ fontWeight: 'bold' }}>{ this.state.afterLoginMessage || '' }</Text>
						</FormValidationMessage>

						<Button
							icon={{name: 'paper-plane', type: 'font-awesome'}}
							backgroundColor='green'
							title='Login'
							onPress={(event) => this.handleLogin(this.state.email, this.state.password, this.state.localDb) }/>
					</View>

					<View style={{ flex: 2, justifyContent: 'space-between' }}>

						{/* Register and forgot buttons */}
						<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
							<Button
								backgroundColor={ this.state.buttonPressed ? 'pink' : 'transparent' }
								color='black'
								icon={{ name: 'thumb-up', type: 'fontello', color: 'black' }}
								style={{ width: 10 }}
								title='Create an account'
								onPress={ this.handleRegister }
							/>
							<Button
								backgroundColor={ this.state.buttonPressed ? 'pink' : 'transparent' }
								color='black'
								iconRight={{ name: 'thumb-down', type: 'fontello', color: 'black' }}
								style={{ width: 10 }}
								title='Forgot password'
							/>
						</View>

						{/* Dev database */}
						{ env.env === 'development' ?
							<CheckBox
								title='Use development database'
								iconType='font-awesome'
								checkedIcon='check'
								checkedColor='red'
								containerStyle={{ backgroundColor: 'pink', marginBottom: 20 }}
								checked={ this.state.localDb }
								onPress={ this.handleLocalDb }
							/>
							: null }

					</View>
				</View>
			);
		}

		const LogoutForm = () => {
			return (
				<View style={{ flex: 3 }}>

					<View style={{ flex: 2, justifyContent: 'space-around' }}>
						<Button
							icon={{name: 'power-off', type: 'font-awesome'}}
							backgroundColor='green'
							title='Log out'
							onPress={ this.handleLogout }/>

						<Button
							icon={{name: 'bars', type: 'font-awesome'}}
							backgroundColor='green'
							title='Return'
							onPress={ () => this.props.navigation.navigate('Home') }/>
					</View>
					<View style={{ flex: 2 }}></View>
				</View>
			);
		}


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
						source={{uri: env.imagesUrl + 'mob/backgrounds/background-login.jpg'}}/>
				</View>

				{/* Name and Logo */}
				<View style={{flex: 2, justifyContent: 'flex-end', alignItems: 'center'}}>
					{ this.props.person ?
						<View style={{ alignSelf: 'flex-end' }}>
							<Badge
								value={ this.state.fullName }
								containerStyle={{ backgroundColor: 'orange', marginBottom: 0, marginRight: 10 }}/>
						</View>
					: null }
					<Image
						style={{resizeMode: 'contain', height: '70%', width: '70%'}}
						source={{uri: env.imagesUrl + 'common/streamline-logo.png'}}/>
				</View>

				{ this.props.person ? LogoutForm() : LoginForm() }

			</View>
		)
	}
};

export default LoginScreen;