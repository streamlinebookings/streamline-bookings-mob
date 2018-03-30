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

	async handleCancel () {
		console.log('HandleCancel', this.state);

		// Call backend to cancel the  class
		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

		let classChosen = _.clone(this.state.classChosen);
		classChosen.person.classes = [];                    // Remove recursive classes

console.log('CHECK: DEPcHOSEN = CLASS.PERSON', this.state.dependantChosen.id, classChosen.person.id);

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

		// Update state with the new classes for this dependant
		let dependantChosen = this.state.dependantChosen;
		dependantChosen.classes = responseData.classes;

		let persons = this.state.persons.map(person => {
			if (person.id === dependantChosen.id) {
				person.classes = responseData.classes;
			}
			return person;
		});

		this.setState({
			dependantChosen: dependantChosen,
			persons: persons,
		});

		// Update redux store with the result
		this.props.setDependantsChosen([dependantChosen]);
		this.props.setPersons(persons);

		// TODO notify user that cancelled and credits given

		// Navigate back to bookedscreen. Force selection of the chosen dependant
		this.props.navigation.navigate('Booked', {
			dependantChosen: dependantChosen,
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
						title={ this.state.dependantChosen.firstName + ' won\'t attend' }
						onPress={ () => this.handleCancel() }
						disabled={ hoursDiff < 24 ? true : false } />

					{ hoursDiff < 24 ?
						<Text style={{ width: '50%', color: '#6b6b6b' }}>You may only cancel more than 24 hours in advance</Text>
						: null }

				</View>
			);
		};

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
