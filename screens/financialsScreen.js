// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class FinancialsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('FinancialsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		// let from = !props.person && props.navigation.state && props.navigation.state.params && props.navigation.state.params.from || null;

		this.state = {
			group: props.group || {},
			person: props.person || {},
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
		this.handleAddPaymentMethod = this.handleAddPaymentMethod.bind(this);
	}

	handleFinancialActions (financial) {
		console.log('HANDLEFINANCIALACTIONSFOR', financial);

		// Update the redux store with the chosen financial
		this.props.setPaymentMethodChosen([financial]);

		// Go to next screen
		this.props.navigation.navigate('FinancialDetails');
	}

	handleAddPaymentMethod () {
		console.log('HandleAddPaymentMethod');

		// Ensure nobody is chosen in the redux store
		this.props.setPaymentMethodChosen();

		// Go to next screen
		this.props.navigation.navigate('FinancialDetails');
	}


	// handleInput (inputSource, data) {
	// 	console.log('HANDLEINPUT', inputSource, data);
	// 	let newData = Object.assign({}, this.state.financial);
	// 	newData[inputSource] = data;
	// 	this.setState({ financial: newData});
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
			if (this.validateFinancial()) {

				// Fill redux store with new financial details
				this.props.setFinancialsChosen([this.state.financial]);

				// Go to new screen
				this.props.navigation.navigate('FinancialsDetails')
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

	// validateFinancial() {
	// 	this.setState({errorText: ''});
	//
	// 	if (this.state.financial && !this.state.financial.name) {
	// 		this.setState({errorText: 'Please give a family or financial name'});
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

		console.log('rendering financials', this.state, this.props);

		const financialsList = () => {

			console.log('creating list financials', this.state);

			let allFinancials = this.state.person.paymentMethods || [];

			return (

				<List>

					{ allFinancials.map(financial => {

						let textStyle = {};
						// textStyle = financial.alreadyBooked ? { color:  'grey' } : null;
						// textStyle = financial.isFull ? { color:  'grey' } : textStyle;

						return (
							<ListItem key={ financial.id }
							          onPress={ () => this.handleFinancialActions(financial) }
							          title={
								          <View>
									          <View flexDirection='row' justifyContent='space-between'>
										          <Text style={textStyle}>{
											         _.capitalize(financial.type) + ' **** **** **** ' + financial.last4
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
						title='Add a payment method'
						onPress={ this.handleAddPaymentMethod }
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
					    title='Financial'
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>

						{ financialsList() }

						{ buttons() }

					</ScrollView>
				</View>

			</View>
		);
	}
}

export default FinancialsScreen
