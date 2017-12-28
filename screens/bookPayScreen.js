// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button, ButtonGroup, CheckBox, Badge, Card, List, ListItem } from 'react-native-elements';

// Our imports
import { env } from '../environment';
import { Header } from './header';


class BookPayScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BOOKPAYCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';
		
		this.state = {
			amount: props.navigation.state.params.amount,
			oneOrTerm: props.navigation.state.params.oneOrTerm,
			classChosen: props.classChosen,
			dependantChosen: props.dependantsChosen[0],
			fullName: fullName,
			group: props.group,
			localDb: props.localDb,
			persons: props.persons,
			token: props.token,
		};

		// Bind local methods
		this.handlePaid = this.handlePaid.bind(this);
	}

	handlePaid () {
		console.log('HANDLEPAID', this.state);

		// Call backend to update class status
		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

		fetch(beApiUrl + 'calendar/book', {
			method: 'put',
			body: JSON.stringify({
				class: this.state.classChosen,
				swimmer: this.state.dependantChosen,
				oneOrTerm: this.state.oneOrTerm,
				token: this.state.token,
			})
		})
		.then(response => {
			console.log('BOOKCLASSFETCHRAWRESPONSE', response);
			if (response.status == 200) return response.json();
			return response;
		})
		.then(response => {
			console.log('BOOKCLASSREPONSE', response, response.classes);

			// Update state with the result (not that state's really needed anymore)
			let dependantChosen = this.state.dependantChosen;
			dependantChosen.classes = response.classes;

			let persons = this.state.persons.map(person => {
				if (person.id === dependantChosen.id) {
					person.classes = response.classes;
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
			this.props.setPrices(response.prices);

			// Navigate to bookedscreen. Force selection of the chosen dependant
			this.props.navigation.navigate('Booked', {
				dependantChosen: dependantChosen,
				newClassId: this.state.classChosen.id,
			});

		})
		.catch(err => {
			console.log('BOOKCLASSERROR', err);

			// Notify user
		});
	}

	//
	// Rendering
	//
	render() {

		const buttons = () => {
			return (
				<View style={{ flex: 1 }} flexDirection='row' justifyContent='space-around'>
					<Button
						icon={{name: 'remove', type: 'font-awesome'}}
						title='Cancel'
						onPress={ () => this.props.navigation.navigate('BookDetails') }
					/>
					<Button
						icon={{name: 'thumbs-up', type: 'font-awesome'}}
						backgroundColor='green'
						title='Paid'
						onPress={ this.handlePaid }
					/>
				</View>
			)
		}

		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-book.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'BookDetails' }
				        title='Book a Class - Payment'
				/>

				{/* Payment screen */}
				<View style={{ flex: 4 }} alignItems='center'>
					<Text> Pay screen for { this.state.amount } cents </Text>
					{ buttons() }
				</View>
			</View>
		);
	}
}

export default BookPayScreen;
