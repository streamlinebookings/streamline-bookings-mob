// Third party imports
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, WebView } from 'react-native';
import { connect } from 'react-redux';
import { Button, ButtonGroup, CheckBox, Badge, Card, FormValidationMessage, List, ListItem } from 'react-native-elements';

let _ = require('lodash');
let moment = require('moment');
let shortid = require('shortid');


// Our imports
import { env } from '../environment';
import { Header } from './header';
import VenuesScreen from "./venuesScreen";


class BookPayScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BOOKPAYCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		// These params passed in after leaving a previous screen
		let params = props.navigation.state.params || {};

		this.state = {
			agree: false,
			amount: params.amount,
			classChosen: props.classChosen,
			currency: 'GBP',
			dependantChosen: props.dependantsChosen[0],
			errorText: '',
			fullName: fullName,
			group: props.group,
			localDb: props.localDb,
			oneOrTerm: params.oneOrTerm,
			paymentMethodChosen: {},
			person: props.person,
			persons: props.persons,
			preAuthorise: params.preAuthorise || false,
			token: props.token,
		};

		// Bind local methods
		this.handleAgree = this.handleAgree.bind(this);
		this.handleAuthorisation = this.handleAuthorisation.bind(this);
		this.handlePay = this.handlePay.bind(this);
		this.handlePaymentMethod = this.handlePaymentMethod.bind(this);
	}

	handlePaymentMethod (paymentMethod) {
		console.log('HANDLEPAYMENTMETHOD', this.state);

		if (!paymentMethod) return;

		this.setState({
			paymentMethodChosen: paymentMethod,
		});
	}

	handleAgree () {
		console.log('HANDLEAGREE', this.state);

		this.setState({
			agree: !this.state.agree,
		});
	}

	async handlePay() {
		console.log('HANDLEPAY', this.state);

		// Check agree + payment method
		if (!this.state.agree) {
			this.setState({
				errorText: 'Please agree with stuff',
			})
			return;
		}
		if (_.isEmpty(this.state.paymentMethodChosen)) {
			this.setState({
				errorText: 'Please select a payment method',
			})
			return;
		}

		this.setState({
			errorText: 'Please wait while checking card details...',
		});

		// Create payment Id, pass it to the be to use there
		paymentId = shortid.generate();

		// Request payment thru payment gateway
		let response, responseData;

		response = await fetch(env.payGateUrl + 'transactions/payments', {
			method: 'post',
			headers: {
				'API-Version': '5.2',
				'Content-Type': 'application/json',
				'Authorization': env.payGateAuth,
			},
			body: JSON.stringify({
				yourConsumerReference: this.state.person.id,
				yourPaymentReference: paymentId,
				cardToken: this.state.paymentMethodChosen.cardToken,
				amount: (this.state.amount / 100).toFixed(2),
				currency: this.state.currency,
				judoId: env.payGateId,
			}),
		});
		console.log('JUDOPAYRAWRESPONSE', response);

		responseData = await response.json();
		console.log('JUDOPAYREPONSE', responseData);

		if (response.status != 200) {
			let allMessages = [responseData.message];
			responseData.details && responseData.details.forEach(detail => allMessages.push(detail.message));
			console.log('ALLMESSAGES', responseData.message, allMessages.join(', '));
			this.setState({
				errorText: allMessages.join(', '),
			});
			return;
		}

		this.setState({
			errorText: responseData.result + ': ' + responseData.message,
		});

		//////////// NEXT - see JUDOPAY
		//////////// if (responseData.result != 'Success') return;

		// Update backend
		this.setState({
			errorText:  responseData.result.toUpperCase() + ': ' + 'Please wait while updating account details...',
		});

		// Call backend to update class status
		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

		response = await fetch(beApiUrl + 'calendar/book', {
			method: 'put',
			body: JSON.stringify({
				class: this.state.classChosen,
				oneOrTerm: this.state.oneOrTerm,
				payment: {
					amount: this.state.amount,
					id: paymentId,
					paymentMethod: this.state.paymentMethodChosen,
					receiptId: responseData.receiptId,
				},
				// Removing the classes from the chosen dependant. This avoids a circular JSON structure
				swimmer: Object.assign({}, this.state.dependantChosen, {classes: []}),
				token: this.state.token,
			})
		});
		// console.log('BOOKCLASSFETCHRAWRESPONSE', response);

		responseData = await response.json();
		console.log('BOOKCLASSREPONSE', responseData);

		// Update the dependants' classes.
		// The response contains a list of all classes for that leve. Get the class we just booked and add that to the dependant
		let dependantChosen = this.state.dependantChosen;
		let classChosen = responseData.classes.filter(oneClass => oneClass.id === this.state.classChosen.id);
		dependantChosen.classes.push(classChosen[0]);
		console.log('BOOKCLASSREPONSE2', classChosen, dependantChosen);

		// Update the persons array
		let persons = this.state.persons.map(person => {
			if (person.id === dependantChosen.id) {
				person.classes = dependantChosen.classes;
			}
			return person;
		});

		// // Update state with the result (not that state's really needed anymore)
		// this.setState({
		// 	dependantChosen: dependantChosen,
		// 	persons: persons,
		// });

		// Update redux store with the result
		this.props.setDependantsChosen([dependantChosen]);
		this.props.setPersons(persons);

		// Navigate to bookedscreen. Force selection of the chosen dependant
		this.props.navigation.navigate('Booked', {
			dependantChosen: dependantChosen,
			newClassId: this.state.classChosen.id,
		});
	}

	async handleAuthorisation() {
		console.log('HANDLEAUTHORISATION', this.state);

		// Check agree + payment method
		if (!this.state.agree) {
			this.setState({
				errorText: 'Please agree with stuff',
			})
			return;
		}
		if (_.isEmpty(this.state.paymentMethodChosen)) {
			this.setState({
				errorText: 'Please select a payment method',
			})
			return;
		}

		// Notify back end
		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;
		fetch(beApiUrl + 'calendar/joinwait', {
			method: 'put',
			body: JSON.stringify({
				class: this.state.classChosen,
				paymentMethod: this.state.paymentMethodChosen,
				// Removing the classes from the chosen dependant. This avoids a circular JSON structure
				swimmer: Object.assign({}, this.state.dependantChosen, {classes: []}),
				token: this.state.token,
			})
		})
			.then(response => {
				console.log('JOINWAITFETCHRAWRESPONSE', response);
				if (response.status == 200) return response.json();
				return response;
			})
			.then(response => {
				console.log('JOINWAITREPONSE', response);
				this.props.navigation.navigate('Book');
			})
			.catch(err => {
				console.log('JOINWAITERROR', err);
				this.setState({
					errorText: 'ERROR: ' + err,
				});
			});

		// Change button text
		this.setState({
			errorText: 'Please wait while adding authorisation...'
		});
	}

	//
	// Rendering
	//
	render() {

		console.log('RENDERING PAYSCREEN',  isNaN(this.state.amount), _.isNaN(this.state.amount));

		const description = (
			<View style={{ flex: 1, borderBottomColor: 'darkgrey', borderBottomWidth: 3, padding: 10 }}>

				<Text>
					{ this.state.preAuthorise ? 'Authorise payment for ' : 'Book' } a
					{ this.state.classChosen.recurring ? ' recurring' : ' single' } lesson for
					{ ' ' + this.state.dependantChosen.firstName } in
					{ ' ' + this.state.classChosen.level.name } on
					{ ' ' + moment(this.state.classChosen.datetime).format('dddd Do MMMM h:mma') }.
					The cost is $ { (this.state.amount / 100).toFixed(2) }
				</Text>
			</View>
		);

		const choosePaymentMethod = () => {

			console.log('creating list payment methods', this.state);

			if (!this.state.person || !this.state.person.paymentMethods || this.state.person.paymentMethods.length <= 0) {
				return (
					<View style={{ flex: 6, borderBottomColor: 'darkgrey', borderBottomWidth: 3, padding: 30 }}>
						<Text>Please add a payment method in your 'account' details</Text>
					</View>
				);
			}

			const paymentMethods = this.state.person.paymentMethods.map(paymentMethod => {

				return (
					<CheckBox
						key={ paymentMethod.id }
						title={ _.capitalize(paymentMethod.type) + '   **** **** **** ' + paymentMethod.last4 }
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						checked={ this.state.paymentMethodChosen.id === paymentMethod.id ? true : false }
						onPress={ () => this.handlePaymentMethod(paymentMethod) }
					/>
				);
			});

			return (
				<View flexDirection='row'
				      justifyContent='flex-start'
				      style={{ flex: 7, borderBottomColor: 'darkgrey', borderBottomWidth: 3, padding: 10 }}>
					<ScrollView>

						{ this.state.preAuthorise ?
							<Card containerStyle={{backgroundColor: 'lightgreen'}}>
								<Text>
									Authorise the payment method for when { this.state.dependantChosen.firstName } leaves
									the waiting list and actually joins the class. The payment will only then be executed.
								</Text>
								<Text>
									Joining the class can happen automatically at any time. You will be notified.
								</Text>
							</Card>
							:
							<Text>
								Please select your payment method
							</Text>
						}

						{ paymentMethods }

					</ScrollView>
				</View>
			);
		}

		const buttons = () => {
			return (
				<View style={{ flex: 2, padding: 10 }}>
					<CheckBox
						key={ 'agree' }
						title={ 'I agree with stuff' }
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						checked={ this.state.agree }
						onPress={ this.handleAgree }
					/>

					<View flexDirection='row' justifyContent='space-around'>
						<Button
							icon={{ name: 'remove', type: 'font-awesome' }}
							buttonStyle={{ width: 130, borderRadius: 5}}
							title='Cancel'
							onPress={ () => this.props.navigation.navigate('BookDetails') }
						/>
						<Button
							icon={{ name: 'dollar', type: 'font-awesome' }}
							buttonStyle={{ width: 130, borderRadius: 5}}
							backgroundColor='green'
							title={ this.state.preAuthorise ? 'Authorise' : 'Pay' }
							onPress={ this.state.preAuthorise ? this.handleAuthorisation : this.handlePay }
							disabled={ isNaN(this.state.amount) }
						/>
					</View>
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
				<View style={{ flex: 5 }}>

					{ description }

					{ choosePaymentMethod() }

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

export default BookPayScreen;
