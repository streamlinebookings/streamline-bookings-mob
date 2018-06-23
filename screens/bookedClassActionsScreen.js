// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button, ButtonGroup, CheckBox, Badge, Card, FormValidationMessage, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class BookedClassActionsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BookedClassActionsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let persons = props.persons;

		this.state = {
			cancelConfirm: false,
			classChosen: props.classChosen,
			dependantChosen: props.dependantsChosen[0],
			errorText: '',
			fullName: fullName,
			group: props.group,
			localDb: props.localDb,
			persons: persons,
			token: props.token,
		};

		// Bind local methods
		this.handleCancel = this.handleCancel.bind(this);
	}

	async handleCancel (confirmed) {
		console.log('HandleCancel', this.state, confirmed);

		if (!confirmed) {
			this.setState({
				cancelConfirm: true,
			});
			return;
		}

		// Call backend to cancel the  class
		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

		let classChosen = _.clone(this.state.classChosen);
		classChosen.person.classes = [];                    // Remove recursive classes

		response = await fetch(beApiUrl + 'calendar/cancel', {
			method: 'put',
			body: JSON.stringify({
				class: classChosen,
				swimmer: classChosen.person,
				token: this.state.token,
			})
		});
		console.log('CANCELFETCHRAWRESPONSE', response);

		if (response.status !== 200) {
			this.setState({
				errorText: response._bodyText + '. Please login to this app again.',
			});
			return;
		}

		let responseData = await response.json();
		console.log('CANCELREPONSE', responseData);

		// Remove this class from the swimmers classes
		// Note: it is more consistent that the be returns a new person object for this swimmer. but that seems a bit overkill for this
		if (responseData === true) {

			let newClasses = this.state.dependantChosen.classes.filter(oneClass => oneClass.id === classChosen.id ? false : true);

			let persons = this.state.persons.map(person => {
				if (person.id === this.state.dependantChosen.id) {
					person.classes = newClasses;
				}
				return person;
			});

			// Update redux store with the result
			this.props.setPersons(persons);
		}

		// Navigate back to bookedscreen. Force selection of the chosen dependant
		this.props.navigation.navigate('Booked', {
			dependantChosen: this.state.dependantChosen,
			message: 'Credits given for ' + this.state.dependantChosen.firstName + ' not attending ' + this.state.classChosen.level.name,
		});
	}

	//
	// Rendering
	//
	render() {

		const buttons = () => {
			let hoursDiff = -1 * moment().diff(this.state.classChosen.datetime, 'hours');
			return (
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
					<Button
						icon={{ name: 'power-off', type: 'font-awesome' }}
						backgroundColor='green'
						title={ this.state.cancelConfirm ? 'Click again to confirm' : this.state.dependantChosen.firstName + ' won\'t attend' }
						onPress={ () => this.state.cancelConfirm ? this.handleCancel(true) : this.handleCancel(false) }
						disabled={ hoursDiff < 24 ? true : false } />

					{ hoursDiff < 24 ?
						<Text style={{ width: '50%', color: '#6b6b6b' }}>You may only cancel more than 24 hours in advance</Text>
						: null }

					{ this.state.cancelConfirm ?
						<Text style={{ width: '50%', color: '#6b6b6b' }}>After confirming this cancellation, credit will be added to your account</Text>
						: null }

				</View>
			);
		};

		const dependantsRepeatInfo = () => {

			let repeatId = this.state.classChosen.repeatId;

			if (!repeatId) return 'Not a recurring class';

			let myRepeatedClasses = this.state.dependantChosen.classes.filter(oneClass => oneClass.repeatId === repeatId);

			console.log('STATE', this.state, myRepeatedClasses);

			return this.state.dependantChosen.firstName + ' is booked into ' + myRepeatedClasses.length.toString() + ' of the repeating classes';
		}

		return (

			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-booked.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Booked' }
				        title='My Class - Details' />

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
								<ListItem
									leftIcon={{ name: 'repeat', type: 'font-awesome' }}
									title={ this.state.classChosen.repeatId ? this.state.classChosen.repeatShortDescription : 'Single lesson' }
									hideChevron={ true }
								/>
								{ this.state.classChosen.repeatId ?
									<ListItem
										leftIcon={{ name: 'thumbs-up', type: 'font-awesome' }}
										title={ dependantsRepeatInfo() }
										hideChevron={ true }
									/>
									: null }
							</List>
						</ScrollView>
					</View>

					<FormValidationMessage
						containerStyle={{ backgroundColor: 'transparent' }}>
						<Text style={{ fontWeight: 'bold' }}>{ this.state.errorText || '' }</Text>
					</FormValidationMessage>

					{ buttons() }

				</View>
			</View>
		);
	}
}

export default BookedClassActionsScreen;
