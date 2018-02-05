// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class CarersScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('CarersCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		// let from = !props.person && props.navigation.state && props.navigation.state.params && props.navigation.state.params.from || null;

		this.state = {
			group: props.group || {},
			persons: props.persons || [],
			errorText: false,
			// from: from,
			fullName: fullName,
			isRegistering: !props.person ? true : false,
			// localDb: props.localDb || false,
		};

		// Bind local methods
		// this.handleInput = this.handleInput.bind(this);
		// this.handleAddress = this.handleAddress.bind(this);
		// this.handleName = this.handleName.bind(this);
		// this.handlePostcode = this.handlePostcode.bind(this);
		// this.handleState = this.handleState.bind(this);
		// this.handleSuburb = this.handleSuburb.bind(this);
		// this.handleSaveOrNext = this.handleSaveOrNext.bind(this);
	}

	// handleInput (inputSource, data) {
	// 	console.log('HANDLEINPUT', inputSource, data);
	// 	let newData = Object.assign({}, this.state.carer);
	// 	newData[inputSource] = data;
	// 	this.setState({ carer: newData});
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
	//
	// handleSaveOrNext () {
	// 	console.log('HANDLESAVEORNEXT', this.state);
	//
	// 	if (this.state.isRegistering) {
	// 		// Next
	// 		if (this.validateCarer()) {
	//
	// 			// Fill redux store with new carer details
	// 			this.props.setCarer(this.state.carer);
	//
	// 			// Go to new screen
	// 			this.props.navigation.navigate('CarersDetails')
	// 		}
	// 	} else {
	// 		// Save
	//
	// 		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;
	//
	// 		/////////////// NEXT
	//
	// 		// fetch(beApiUrl + 'group/update', {
	// 		// 	method: 'put',
	// 		// 	body: JSON.stringify({
	// 		// 		fromMobile: true,
	// 		// 		group: this.state.group,
	// 		// 	})
	// 		// })
	// 		// 	.then(response => {
	// 		// 		console.log('FETCHRAWRESPONSE', response);
	// 		// 		if (response.status == 200) return response.json();
	// 		// 		return response;
	// 		// 	})
	// 		// 	.then(response => {
	// 		// 		console.log('SAVEGROUPREPONSE', response);
	// 		// 	});
	// 	}
	// }
	//
	// validateCarer() {
	// 	this.setState({errorText: ''});
	//
	// 	if (this.state.carer && !this.state.carer.name) {
	// 		this.setState({errorText: 'Please give a family or carer name'});
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

		console.log('rendering carer details', this.state, this.props);

		const carersList = () => {

			console.log('creating list carers', this.state);

			let allCarers = this.state.persons.filter(person => {

				if (!person.isCarer) return false;

				return true;
			});

			// Create a list of all................
			// let allCarers = [];
			// carers.map(person => {
			//
			// 	person.classes.map(carer => {
			//
			// 		// Ignore empty objects
			// 		if (!Object.keys(carer).length) return;
			//
			// 		// Add person info to the class
			// 		carer.person = person;
			//
			// 		// Only display the classes in the requested period
			// 		if (this.state.periodTab === 'future') {
			// 			if (moment(carer.datetime).isAfter(/* now */)) allCarers.push(carer);
			// 		} else {
			// 			if (moment(carer.datetime).isBefore(/* now */)) allCarers.push(carer);
			// 		}
			// 	});
			// });

			// Sort the carers on first name
			allCarers.sort((a, b) => {
				return a.firstName.localeCompare(b.firstName);
			});

			return (

				<List>

					{ allCarers.map(carer => {

						let textStyle = {};
						// textStyle = carer.alreadyBooked ? { color:  'grey' } : null;
						// textStyle = carer.isFull ? { color:  'grey' } : textStyle;

						return (
							<ListItem key={ carer.id }
							          onPress={ () => this.handleCarerActions(carer) }
							          title={
								          <View>
									          <View flexDirection='row' justifyContent='space-between'>
										          <Text style={textStyle}>{
										          	carer.firstName + ' ' + carer.lastName +
										            (carer.relationship ? ' (' + carer.relationship + ')' : '' )
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
				<View style={{ flex: 1 }} flexDirection='row' justifyContent='space-around'>
					<Button
						icon={{name: 'plus', type: 'font-awesome'}}
						backgroundColor='green'
						title='Add a carer'
						onPress={ this.handlePaid }
					/>
				</View>
			)
		}



		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
						backTo={ 'Account' }
					    title='Carers and Adults'
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>
						{ carersList() }

						{ buttons() }
					</ScrollView>
				</View>

			</View>
		);
	}
}

export default CarersScreen
