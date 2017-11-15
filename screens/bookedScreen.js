// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';


export default class BookedScreen extends React.Component {

	constructor(props) {

		super(props);
		console.log('BOOKEDCONSTRUCTOR', props);

		this.state = {
			errorText: false,
			localDb: false,
		}

		this.beApiUrl = this.state.localDb ? 'http://192.168.0.3:9057/api/' : 'https://streamlinebookings.com:9056/api/';
		this.imagesUrl = 'https://streamlinebookings.com:9056/imgs/';

		// Bind local methods
		// this.handleEmail = this.handleEmail.bind(this);
		// this.handlePassword = this.handlePassword.bind(this);
		// this.handleLogin = this.handleLogin.bind(this);
		// this.handleLocalDb = this.handleLocalDb.bind(this);
	}

	// handleEmail (email) {
	// 	console.log('EMAIL', email);
	// 	this.setState({
	// 		email: email,
	// 	})
	// }
	//
	// handlePassword (password) {
	// 	console.log('PASSWORD', password);
	// 	this.setState({
	// 		password: password,
	// 	})
	// }
	// handleLocalDb () {
	// 	this.setState({
	// 		localDb: !this.state.localDb
	// 	});
	// }
	//
	// handleLogin () {
	// 	console.log('HANDLELOGIN', this.state);
	//
	// 	let beUrl = this.state.localDb ? 'http://192.168.0.3:9057/api/login' : 'https://streamlinebookings.com:9056/api/login';
	//
	// 	fetch(beUrl, {
	// 		method: 'post',
	// 		body: JSON.stringify({
	// 			fromMobile: true,
	// 			email: this.state.email,
	// 			password: this.state.password,
	// 		})
	// 	})
	// 		.then(response => {
	// 			console.log('FETCHRAWRESPONSE', response);
	// 			if (response.status == 200) return response.json();
	// 			return response;
	// 		})
	// 		.then(response => {
	// 			console.log('LOGINREPONSE', response);
	// 			if (response.person) {
	// 				this.setState({
	// 					errorText: 'Welcome ' + response.person.firstName,
	// 					fullName: response.person.firstName + ' ' + response.person.lastName,
	// 					person: response.person,
	// 					group: response.group,
	// 					persons: response.persons,
	// 				});
	// 			} else {
	// 				this.setState({
	// 					person: {},
	// 					errorText: response._bodyText,
	// 				})
	// 			}
	// 		})
	// 		.catch(err => {
	// 			console.log('LOGINERROR', err);
	// 		});
	// }


	//
	// Rendering
	//
	render() {

		console.log('rendering booked');
		return (

			<View style={{ flex: 1 }}>

				<Text>Booked lessons!</Text>

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
						source={{ uri: this.imagesUrl + 'mob/backgrounds/background-booked.jpg' }}/>
				</View>

				{/*/!* Logo *!/*/}
				{/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>*/}
					{/*<Text style={{ fontSize: 50 }}>LOGO</Text>*/}
				{/*</View>*/}

				{/*/!* Login form *!/*/}
				{/*<View style={{ flex: 2, justifyContent: 'center' }}>*/}
					{/*/!*<FormLabel>Please login</FormLabel>*!/*/}
					{/*<FormInput placeholder={'Email address'} onChangeText={ this.handleEmail }/>*/}
					{/*<FormInput placeholder={'Password'} secureTextEntry={ true } onChangeText={ this.handlePassword }/>*/}

					{/*<FormValidationMessage>{ this.state.errorText || '' }</FormValidationMessage>*/}

					{/*<Button*/}
						{/*icon={{name: 'paper-plane', type: 'font-awesome'}}*/}
						{/*backgroundColor='green'*/}
						{/*title='Login'*/}
						{/*onPress={ this.handleLogin } />*/}
				{/*</View>*/}

				{/*<View style={{ flex: 2, justifyContent: 'space-between' }}>*/}

					{/*<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>*/}
						{/*<Button*/}
							{/*icon={{name: 'thumbs-up', type: 'font-awesome'}}*/}
							{/*backgroundColor='transparent'*/}
							{/*title='Create new account'*/}
							{/*style={{ width:  10 }}*/}
						{/*/>*/}
						{/*<Button*/}
							{/*icon={{name: 'thumbs-down', type: 'font-awesome'}}*/}
							{/*backgroundColor='transparent'*/}
							{/*title='Forgot password'*/}
							{/*style={{ width:  10 }}*/}
						{/*/>*/}
					{/*</View>*/}

					{/*<CheckBox*/}
						{/*title='Local'*/}
						{/*iconType='font-awesome'*/}
						{/*checkedIcon='check'*/}
						{/*checkedColor='red'*/}
						{/*containerStyle={{ backgroundColor: 'pink', marginBottom: 20 }}*/}
						{/*checked={ this.state.localDb }*/}
						{/*onPress={ this.handleLocalDb }*/}
					{/*/>*/}

				{/*</View>*/}


			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});