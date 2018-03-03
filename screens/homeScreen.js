// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { Badge, FormLabel, FormInput, FormValidationMessage, Button, CheckBox } from 'react-native-elements';

// Our imports
import { env } from '../environment';


class HomeScreen extends React.Component {

	constructor (props) {

		super(props);
		console.log('HOMESCREENCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		this.state = {
			buttonPressed: false,
			email: '',
			fullName: fullName,
			password: '',
			localDb: false,
		};
	}

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
						style={{ flex: 1, resizeMode: 'cover' }}
						source={{ uri: env.imagesUrl + 'mob/backgrounds/background-login.jpg' }}/>
				</View>

				{/* Name and Logo */}
				<View style={{ flex: 2, justifyContent: 'flex-end', alignItems: 'center' }}>

					<View style={{ alignSelf: 'flex-end' }}>
						<Badge
							value={ this.state.fullName }
							containerStyle={{ backgroundColor: 'orange', marginBottom: 0, marginRight: 10 }}/>
					</View>
					<Image
						style={{ resizeMode: 'contain', height: '70%', width: '70%' }}
						source={{ uri: env.imagesUrl + 'common/streamline-logo.png' }}/>
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