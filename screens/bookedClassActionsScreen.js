// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button, ButtonGroup, CheckBox, Badge, Card, List, ListItem } from 'react-native-elements';

let moment = require('moment');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class BookedClassActionsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BookedClassActionsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let persons = props.persons;

		let dependantSwimmers = [];
		if (persons && persons.length > 0) {
			dependantSwimmers = persons.filter(p => p.isSwimmer);
		}

		this.state = {
			classChosen: props.classChosen,
			dependantChosen: props.dependantsChosen[0],
			fullName: fullName,
			group: props.group,
			localDb: props.localDb,
			persons: persons,
			token: props.token,
		};

		// Bind local methods
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleCancel () {
		console.log('HandleCancel', this.state);

		// Send cancel message to be
		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

		fetch(beApiUrl + 'messages/cancel-class', {
			method: 'put',
			body: JSON.stringify({
				classChosen: this.state.classChosen,
				token: this.state.token,
			})
		})
		.then(response => {
			console.log('CANCELFETCHRAWRESPONSE', response);
			if (response.status == 200) return response.json();
			return response;
		})
		.then(response => {
			console.log('CANCELREPONSE', response);

			// expect only a status response: message sent or not

		})
		.catch(err => {
			console.log('CANCELERROR', err);
		});

	}

	//
	// Rendering
	//
	render() {

		const buttons = () => {

			let hoursDiff = -1 * moment().diff(this.state.classChosen.datetime, 'hours');
console.log('BUTTONS', this.state.classChosen, hoursDiff);
			return (
				<View style={{ flex: 1 }} flexDirection='row' justifyContent='flex-left' alignContent='flex-start'>
					<Button
						icon={{ name: 'power-off', type: 'font-awesome' }}
						backgroundColor='green'
						title={ this.state.dependantChosen.firstName + ' won\'t attend' }
						onPress={ () => this.handleCancel() }
						disabled={ hoursDiff < 24 ? true : false }
					/>
					{ hoursDiff < 24 ? <Text>You must cancel more than 24 hours in advance</Text> : null }

				</View>
			)
		}

		// let childNameStatus = this.state.dependantChosen.firstName;
		// if (this.state.classChosen.alreadyBooked ) {
		// 	childNameStatus += ' is already booked into this class';
		// } else if (this.state.classChosen.isFull) {
		// 	childNameStatus = 'Sorry, ' + this.state.dependantChosen.firstName + ', this class is full';
		// }

		return (

			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-book.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Book' }
				        title='Book a Class - Details'
				/>

				{/* Book classes cards */}
				<View style={{ flex: 4 }}>
					<View style={{ flex: 4 }}>

						<ScrollView>
						<List>
							<ListItem
								leftIcon={{ name: 'child', type: 'font-awesome' }}
								title={ this.state.dependantChosen.firstName }
								hideChevron={ true }
							/>
							<ListItem
								leftIcon={{ name: 'bar-chart', type: 'font-awesome' }}
								title={ this.state.classChosen.level.name }
								hideChevron={ true }
							/>
							<ListItem
								leftIcon={{ name: 'calendar', type: 'font-awesome' }}
								title={
									this.state.classChosen.recurring
										? moment(this.state.classChosen.datetime).format('dddd h:mma')
										: moment(this.state.classChosen.datetime).format('dddd Do MMMM h:mma')
								}
								subtitle={ this.state.classChosen.duration ? this.state.classChosen.duration + ' minutes' : null }
								hideChevron={ true }
							/>
						</List>
						</ScrollView>
					</View>
					{ buttons() }
				</View>
			</View>
		);
	}
}

export default BookedClassActionsScreen;
