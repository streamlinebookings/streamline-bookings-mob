// Third party imports
import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
// import { env } from '../environment';
import { Header } from './header';


class BookedScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BOOKEDCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		// These params passed in after leaving a previous screen (e.g. the pay screen)
		let params = this.props.navigation.state.params || {};

		// Find the swimmers: either 1) passed in from the caller, or 2) in redux store, or 3) all swimmers from the persons in the group
		let persons = this.props.persons;
		let dependantSwimmers = [];
		if (params.dependantChosen) {
			dependantSwimmers = [params.dependantChosen];

		} else if(props.dependantsChosen && props.dependantsChosen.length > 0) {
			dependantSwimmers = props.dependantsChosen;

		} else if (persons && persons.length > 0) {
			dependantSwimmers = persons.filter(p => p.isSwimmer);
		}

		this.state = {
			dependantsChosen: dependantSwimmers,
			errorText: false,
			fullName: fullName,
			highlightClassId: params.newClassId,
			localDb: false,
			message: params.message || '',
			periodTab: 'future',
			persons: persons,
		}

		// Bind local methods
		this.handleChooseDependant = this.handleChooseDependant.bind(this);
		this.handlePeriodTab = this.handlePeriodTab.bind(this);
		this.handleClassActions = this.handleClassActions.bind(this);

		// Reset the parameters to avoid constant messages
		this.props.navigation.state.params = {};
	}

	handleChooseDependant (person) {
		let found = this.state.dependantsChosen.find(p => p.id === person.id)

		let newChosen = this.state.dependantsChosen;
		if (!found) {
			newChosen.push(person)
		} else {
			newChosen = newChosen.filter(p => p.id !== person.id);
		}

		this.setState({
			dependantsChosen: newChosen
		});
	}

	handlePeriodTab (index) {
		this.setState({
			periodTab: index == 0 ? 'future' : 'past'
		});
	}

	handleClassActions (oneClass) {
		console.log('HANDLECLASSACTIONSFOR', oneClass);

		// Update the redux store with the chosen dependant
		this.props.setDependantsChosen([oneClass.person]);
		this.props.setClassChosen(oneClass);

		// Go to next screen
		this.props.navigation.navigate('BookedClassActions');
	}


	//
	// Rendering
	//
	render() {

		const ChooseDependants = () => {

			console.log('creating dependants', this.state);

			if (!this.state.persons || this.state.persons.length <= 1) return;

			const dependants = this.state.persons.map(person => {

				if (!person.isSwimmer) return;

				return (
					<CheckBox
						key={ person.id }
						title={ person.firstName }
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						containerStyle={{ width: (this.state.persons.length <= 5 ? '32%' : '20%') }}
						checked={ this.state.dependantsChosen.find(p => p.id === person.id) ? true : false }
						onPress={ () => this.handleChooseDependant(person) }
					/>
				);
			});

			return (
				<View flexDirection='row' justifyContent='flex-start'>
					<ScrollView horizontal={ true }>
						{ dependants }
					</ScrollView>
				</View>
			);
		}

		const PeriodTabs = () => {

			return (
				<ButtonGroup
					buttons={ ['Upcoming', 'Past'] }
					// buttonStyle={{ backgroundColor: 'transparent', borderBottomColor: 'blue' }}
					onPress={ this.handlePeriodTab }
					selectedIndex={ this.state.periodTab === 'future' ? 0 : 1 }
				/>
			)
		}

		const BookedClasses = () => {

			console.log('creating list booked lessons', this.state);

			let thesePersons = !this.state.persons ? [] :
				this.state.persons.filter(person => {

				if (!person.isSwimmer) return false;

				if (!this.state.dependantsChosen.find(p => p.id === person.id)) return false;

				return true;
			});

			// Create a list of all classes for the chosen dependants
			let allClasses = [];
			thesePersons.map(person => {

				person.classes && person.classes.map(oneClass => {

					// Ignore empty objects
					if (!Object.keys(oneClass).length) return;

					// Add person info and a unique key to the class
					oneClass.person = person;
					oneClass.key = oneClass.id + person.id;

					// Only display the classes in the requested period
					if (this.state.periodTab === 'future') {
						if (moment(oneClass.datetime).isAfter(/* now */)) allClasses.push(oneClass);
					} else {
						if (moment(oneClass.datetime).isBefore(/* now */)) allClasses.push(oneClass);
					}
				});
			});

			// Sort the classes depending of future or past
			allClasses.sort((a, b) => {
				return a.datetime.localeCompare(b.datetime) * (this.state.periodTab === 'future' ? 1 : -1);
			});

			return allClasses;
		}

		const BookedClass = (item) => {

			let oneClass = item.item;

			let textStyle = {};

			return (
				<ListItem key={oneClass.person.id + oneClass.id}
				          onPress={ () => this.handleClassActions(oneClass) }
				          containerStyle={ this.state.highlightClassId === oneClass.id ? { backgroundColor: '#c2f7b2' } : {} }
				          title={
					          <View>
						          <View flexDirection='row' justifyContent='space-between'>
							          <Text
								          style={ textStyle }>{ moment(oneClass.datetime).format('dddd h:mma') + (oneClass.repeatId ? ' (Recurring)' : ' (Once)') }</Text>
							          <Text style={ textStyle }>{ oneClass.level.name || '' }</Text>
						          </View>
						          <View flexDirection='row' justifyContent='space-between'>
							          <Text
								          style={ textStyle }>{ moment(oneClass.datetime).format('Do MMMM') }</Text>
							          <Text
								          style={ textStyle }>{ (oneClass.instructor && oneClass.instructor.firstName ? oneClass.instructor.firstName + ', ' : '') + 'lane ' + oneClass.laneId }</Text>
						          </View>
						          <View flexDirection='row' justifyContent='space-between'>
							          <Text
								          style={ textStyle }>{ oneClass.duration ? oneClass.duration + ' minutes' : '' }</Text>
							          <Text style={ textStyle }>{
								          oneClass.countBooked && oneClass.countBooked > 1
									          ? oneClass.person.firstName + ' and ' + (oneClass.countBooked - 1).toString() + ' other swimmers'
									          : oneClass.person.firstName
							          }</Text>
						          </View>
					          </View>
				          }
				></ListItem>
			);
		}

		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-booked.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Home' }
				        title='My Classes'
				/>

				{/* Booked classes cards */}
				<View style={{ flex: 4 }}>

					{ PeriodTabs() }

					{ ChooseDependants() }

					{ this.state.message ?
						<Card containerStyle={{backgroundColor: 'lightgreen'}}>
							<Text>
								{ this.state.message }
							</Text>
						</Card>
						: null }

					<FlatList
						data={ BookedClasses() }
						renderItem={ BookedClass }
					/>

				</View>

			</View>
		);
	}
}

export default BookedScreen
