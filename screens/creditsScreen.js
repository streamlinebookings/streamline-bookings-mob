// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Badge, Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
// import { env } from '../environment';
import { Header } from './header';


class CreditsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('CREDITSCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		// // These params passed in after leaving a previous screen (e.g. the pay screen)
		// let params = this.props.navigation.state.params || {};
		//
		// // Find the swimmers: either 1) passed in from the caller, or 2) in redux store, or 3) all swimmers from the persons in the group
		// let persons = this.props.persons;
		// let dependantSwimmers = [];
		// if (params.dependantChosen) {
		// 	dependantSwimmers = [params.dependantChosen];
		//
		// } else if(props.dependantsChosen && props.dependantsChosen.length > 0) {
		// 	dependantSwimmers = props.dependantsChosen;
		//
		// } else if (persons && persons.length > 0) {
		// 	dependantSwimmers = persons.filter(p => p.isSwimmer);
		// }

		this.state = {
			// dependantsChosen: dependantsChosenndantSwimmers,
			errorText: false,
			fullName: fullName,
			// highlightClassId: params.newClassId,
			localDb: false,
			// message: params.message || '',
			// periodTab: 'future',
			person: props.person,
		}

		// Bind local methods
		// this.handleChooseDependant = this.handleChooseDependant.bind(this);
		// this.handlePeriodTab = this.handlePeriodTab.bind(this);
		// this.handleClassActions = this.handleClassActions.bind(this);

		// Reset the parameters to avoid constant messages
		this.props.navigation.state.params = {};
	}

	// handleChooseDependant (person) {
	// 	let found = this.state.dependantsChosen.find(p => p.id === person.id)
	//
	// 	let newChosen = this.state.dependantsChosen;
	// 	if (!found) {
	// 		newChosen.push(person)
	// 	} else {
	// 		newChosen = newChosen.filter(p => p.id !== person.id);
	// 	}
	//
	// 	this.setState({
	// 		dependantsChosen: newChosen
	// 	});
	// }
	//
	// handlePeriodTab (index) {
	// 	this.setState({
	// 		periodTab: index == 0 ? 'future' : 'past'
	// 	});
	// }
	//
	// handleClassActions (credit) {
	// 	console.log('HANDLECLASSACTIONSFOR', credit);
	//
	// 	// Update the redux store with the chosen dependant
	// 	this.props.setDependantsChosen([credit.person]);
	// 	this.props.setClassChosen(credit);
	//
	// 	// Go to next screen
	// 	this.props.navigation.navigate('CreditsClassActions');
	// }
	//

	//
	// Rendering
	//
	render() {

		// const ChooseDependants = () => {
		//
		// 	console.log('creating dependants', this.state);
		//
		// 	if (!this.state.persons || this.state.persons.length <= 1) return;
		//
		// 	const dependants = this.state.persons.map(person => {
		//
		// 		if (!person.isSwimmer) return;
		//
		// 		return (
		// 			<CheckBox
		// 				key={ person.id }
		// 				title={ person.firstName }
		// 				iconType='font-awesome'
		// 				checkedIcon='check'
		// 				checkedColor='red'
		// 				containerStyle={{ width: (this.state.persons.length <= 5 ? '32%' : '20%') }}
		// 				checked={ this.state.dependantsChosen.find(p => p.id === person.id) ? true : false }
		// 				onPress={ () => this.handleChooseDependant(person) }
		// 			/>
		// 		);
		// 	});
		//
		// 	return (
		// 		<View flexDirection='row' justifyContent='flex-start'>
		// 			<ScrollView horizontal={ true }>
		// 				{ dependants }
		// 			</ScrollView>
		// 		</View>
		// 	);
		// }
		//

		const TotalCredit = () => {

 			let totalCredit = 0;
			this.state.person.credits && this.state.person.credits.forEach(credit => totalCredit += credit.amount);

			console.log('credits for ', this.state.person, totalCredit);

			return (
				<Badge
					value={'Total credit is $' + (totalCredit / 100).toFixed(2)}
					textStyle={{ color: 'black' }}
					containerStyle={{ width: '70%', backgroundColor: 'lightgreen', alignSelf: 'center', margin: 10 }}
				/>
			)
		};
		
		const Credits = () => {

			console.log('creating list credits', this.state);

			if (!this.state.person.credits || !this.state.person.credits.length) return;

			// Sort the credit by timestamp desc
			this.state.person.credits.sort((a,b) => b.datetime.localeCompare(a.datetime));

			return (

				<List>

					{ this.state.person.credits.map(credit => {

						let textStyle = {};

						return (
							<ListItem key={ credit.id + new Date().getTime() }
							          hideChevron={ true }
							          title={
								          <View>
									          <View flexDirection='row' justifyContent='space-between'>
										          <Text style={ textStyle }>{ '$' + (credit.amount/100).toFixed(2) }</Text>
										          <Text
											          style={textStyle}>{moment(credit.datetime).format('dddd, Do MMM YYYY h:mma')}</Text>
									          </View>
								          </View>
							          }
					          ></ListItem>
						)
					})}

				</List>
			)
		}

		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Financials' }
				        title={ 'Credits' }
				/>

				{/* Credits list */}
				<View style={{ flex: 4 }}>

					{ TotalCredit() }

					<ScrollView>

						{ Credits() }

					</ScrollView>
				</View>

			</View>
		);
	}
}

export default CreditsScreen;
