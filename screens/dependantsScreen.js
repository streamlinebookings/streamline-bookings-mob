// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class DependantsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('DependantsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		// let from = !props.person && props.navigation.state && props.navigation.state.params && props.navigation.state.params.from || null;

		this.state = {
			group: props.group || {},
			persons: props.persons || [],
			errorText: false,
			// from: from,
			fullName: fullName,
			isRegistering: !props.person ? true : false,
			localDb: props.localDb || false,
		};

		// Bind local methods
		// this.handleInput = this.handleInput.bind(this);
		// this.handleAddress = this.handleAddress.bind(this);
		// this.handleName = this.handleName.bind(this);
		// this.handlePostcode = this.handlePostcode.bind(this);
		// this.handleState = this.handleState.bind(this);
		// this.handleSuburb = this.handleSuburb.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.handleAddDependant = this.handleAddDependant.bind(this);
	}

	handleDependantActions (dependant) {
		console.log('HANDLEDEPENDANTACTIONSFOR', dependant);

		// Update the redux store with the chosen dependant
		this.props.setDependantsChosen([dependant]);

		// Go to next screen
		this.props.navigation.navigate('DependantDetails');
	}

	handleAddDependant () {
		console.log('HANDLEADDDEPENDANT');

		// Ensure nobody is chosen in the redux store
		this.props.setDependantsChosen();

		// Go to next screen
		this.props.navigation.navigate('DependantDetails');
	}


	// handleInput (inputSource, data) {
	// 	console.log('HANDLEINPUT', inputSource, data);
	// 	let newData = Object.assign({}, this.state.dependant);
	// 	newData[inputSource] = data;
	// 	this.setState({ dependant: newData});
	// }
	// handleAddress (data) {
	// 	this.handleInput('address', data);
	// }
	// handleName (data) {
	// 	this.handleInput('name', data);
	// }
	// handlePostcode (data) {
	// 	this.handleInput('postcode', data);
	// }
	// handleState (data) {
	// 	this.handleInput('state', data);
	// }
	// handleSuburb (data) {
	// 	this.handleInput('suburb', data);
	// }

	handleNext () {
		console.log('HANDLENEXT', this.state);

		if (this.state.isRegistering) {
			// Next
			if (this.validateDependant()) {

				// Fill redux store with new dependant details
				this.props.setDependantsChosen([this.state.dependant]);

				// Go to new screen
				this.props.navigation.navigate('DependantsDetails')
			}
		} else {
			// Save

			let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

			/////////////// NEXT

			// fetch(beApiUrl + 'group/update', {
			// 	method: 'put',
			// 	body: JSON.stringify({
			// 		fromMobile: true,
			// 		group: this.state.group,
			// 	})
			// })
			// 	.then(response => {
			// 		console.log('FETCHRAWRESPONSE', response);
			// 		if (response.status == 200) return response.json();
			// 		return response;
			// 	})
			// 	.then(response => {
			// 		console.log('SAVEGROUPREPONSE', response);
			// 	});
		}
	}

	// validateDependant() {
	// 	this.setState({errorText: ''});
	//
	// 	if (this.state.dependant && !this.state.dependant.name) {
	// 		this.setState({errorText: 'Please give a family or dependant name'});
	// 		this.formInputName.shake();
	// 		return false;
	// 	}
	// 	return true;
	// }
	
	//
	//
	// Rendering
	//
	render() {

		console.log('rendering dependant details', this.state, this.props);

		const dependantsList = () => {

			console.log('creating list dependants', this.state);

			let allDependants = this.state.persons.filter(person => {

				if (!person.isDependant) return false;

				return true;
			});

			// Sort the dependants on first name
			allDependants.sort((a, b) => {
				return a.firstName.localeCompare(b.firstName);
			});

			return (

				<List>

					{ allDependants.map(dependant => {

						let textStyle = {};
						// textStyle = dependant.alreadyBooked ? { color:  'grey' } : null;
						// textStyle = dependant.isFull ? { color:  'grey' } : textStyle;

						return (
							<ListItem key={ dependant.id }
							          onPress={ () => this.handleDependantActions(dependant) }
							          title={
								          <View>
									          <View flexDirection='row' justifyContent='space-between'>
										          <Text style={textStyle}>{
										          	dependant.firstName + ' ' + dependant.lastName
										          }</Text>
									          </View>
								          </View>
							          }
							></ListItem>
						)
					})}

				</List>
			)
		}

		const buttons = () => {
			return (
				<View style={{ flex: 1 }} flexDirection='row' justifyContent='space-around' alignItems='center'>
					<Button
						icon={{name: 'plus', type: 'font-awesome'}}
						backgroundColor='green'
						title='Add a dependant'
						onPress={ this.handleAddDependant }
					/>

					{ this.state.isRegistering ?
						<Button
							icon={{ name: 'paper-plane', type: 'font-awesome' }}
							backgroundColor='green'
							title={ 'Next' }
							onPress={ this.handleNext }
						/>
						: null
					}

				</View>
			)
		}



		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
						backTo={ 'Account' }
					    title='Dependants and Children'
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>

						{ dependantsList() }

						{ buttons() }

					</ScrollView>
				</View>

			</View>
		);
	}
}

export default DependantsScreen
