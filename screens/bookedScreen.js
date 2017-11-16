// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox, Badge } from 'react-native-elements';


export default class BookedScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BOOKEDCONSTRUCTOR', props);

		let params = props.navigation.state.params

		let fullName = params && params.fullName || 'Not logged in'

		this.state = {
			errorText: false,
			localDb: false,
			fullName: fullName,
		}

		this.beApiUrl = this.state.localDb ? 'http://192.168.0.3:9057/api/' : 'https://streamlinebookings.com:9056/api/';
		this.imagesUrl = 'https://streamlinebookings.com:9056/imgs/';

		// Bind local methods
		this.handleMenu = this.handleMenu.bind(this);
	}

	handleMenu () {
		this.props.navigation.navigate('DrawerOpen');
	}

	//
	// Rendering
	//
	render() {

		return (

			<View style={{ flex: 1 }}>

				{/* Header image */}
				<View style={{
					flex: 1,
				}}>
					<Image
						style={{
							flex: 1,
							resizeMode: 'cover',
							opacity: 0.5,
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
						}}
						source={{ uri: this.imagesUrl + 'mob/backgrounds/background-booked.jpg' }}/>

					<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-end' }}>
						<Button
							icon={{ name: 'bars', type: 'font-awesome' }}
							style={{ }}
							backgroundColor='transparent'
							onPress={ this.handleMenu }
							 />
						<Badge value={ this.state.fullName } containerStyle={{ backgroundColor: 'orange', marginBottom: 10, marginRight: 10 }}/>
					</View>
				</View>

				<View style={{ flex: 4 }}>
					<Text>Booked lessons</Text>
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

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: '#fff',
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 	},
// });