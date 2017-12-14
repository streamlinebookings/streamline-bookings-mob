// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, CheckBox, Badge, Card } from 'react-native-elements';

let moment = require('moment');


export default class BookedScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BOOKCONSTRUCTOR', props);

		let params = props.navigation.state.params

		let fullName = params && params.fullName || 'Not logged in';
		let persons = params && params.persons || [];

		this.state = {
			errorText: false,
			localDb: false,
			fullName: fullName,
			persons: persons,
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

		const BookedClasses = () => {

			console.log('creating cards', this.state);

			return this.state.persons.map(person => {

				if (!person.isSwimmer) return;
console.log('card for ', person);
				return (
					<Card key={ person.id }>
						<View flexDirection='row' justifyContent='space-between'>
							<Text>{ moment(person.class.datetime).format('dddd Do MMMM, h:mma') }</Text>
							<Text>{ person.class.levelName }</Text>
						</View>
						<View flexDirection='row' justifyContent='space-between'>
							<Text>{ person.firstName }</Text>
							<Text>{ person.class.cancelled ? 'CANCELLED' : '' }</Text>
							<Text>{ person.class.recurring ? 'Recurring' : 'Not recurring' }</Text>
						</View>
					</Card>
				)
			});

		}

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

				{/* Booked classes cards */}
				<View style={{ flex: 4 }}>
					{ BookedClasses() }
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