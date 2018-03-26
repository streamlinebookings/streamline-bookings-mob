// Third party imports
import React from 'react';
import { Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ButtonFinancial, Card, CheckBox, FormLabel, FormInput, FormValidationMessage, Icon, Input } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';
import VenuesScreen from "./venuesScreen";


class FinancialDetailsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('FinancialDetailsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let paymentMethod = {
			creditcard: {},
			paypal: {},
		};
		let paymentMethodType = '';
		if (props.paymentMethodChosen && props.paymentMethodChosen.length > 0) {
			paymentMethodType = props.paymentMethodChosen[0].type;
			paymentMethod[paymentMethodType] = props.paymentMethodChosen[0];
		}
		let editable = true;
		if (paymentMethodType === 'creditcard') editable = false;

		this.state = {
			errorText: false,
			fullName: fullName,
			hasErrors: {},
			localDb: props.localDb || false,
			paymentMethod: paymentMethod,
			paymentMethodType: paymentMethodType,
			paymentMethodEditable: editable,
			persons: props.persons || [],
			showDatePicker: false,
		};

		// Bind local methods
		this.handleChooseMethod = this.handleChooseMethod.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.toggleDatePicker = this.toggleDatePicker.bind(this);
	}

	handleChooseMethod (method) {
		console.log('HandleChooseMethod', method);
		this.setState({ paymentMethodType: method });
	}
	handleCreditCard(property, data) {
		let newData = {};
		newData[property] = data;
		newData = Object.assign({}, this.state.paymentMethod.creditcard, newData);
		newData = Object.assign({}, this.state.paymentMethod, {creditcard: newData});
		console.log('handleCreditCard', property, data, newData);
		this.setState({
			paymentMethod: newData,
		});
	}

	toggleDatePicker (data) {
		this.setState({
			showDatePicker: !this.state.showDatePicker,
		});
		Keyboard.dismiss();
	}

	async handleDelete () {
		console.log('HandleDelete', this.state);

		// Update the be with paymentGateway tokens
		this.setState({
			errorText: 'Updating your details...',
		});

		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

		response = await fetch(beApiUrl + 'person/update', {
			method: 'put',
			body: JSON.stringify({
				fromMobile: true,
				paymentMethodTokenized: this.state.paymentMethod[this.state.paymentMethodType],
				paymentMethodDelete: true,
				token: this.props.token,
			})
		});
		console.log('FETCHRAWRESPONSE', response);

		if (response.status != 200) {
			this.setState({
				errorText: response._bodyText.replace('[', '').replace(']', '').replace(/\"/g, '').trim(),
			});
			return;
		}

		// TODO try/catch around this
		responseData = await response.json();
		console.log('DELETEINANCIALREPONSE', responseData);

		// TODO Void the card at the gateway

		// this.setState({
		// 	errorText: 'Revoking card details...',
		// });
		//
		// let response, responseData;
		// response = await fetch(env.payGateUrl + 'transactions/voids', {
		// 	method: 'post',
		// 	headers: {
		// 		'API-Version': '5.2',
		// 		'Content-Type': 'application/json',
		// 		'Authorization': env.payGateAuth,
		// 	},
		// 	body: JSON.stringify({
		// 		yourConsumerReference: this.props.person.id,
		// 		cardToken: this.state.paymentMethod[this.state.paymentMethodType].cardToken,
		// 		// yourPaymentReference: timestamp,
		// 		// cardNumber: this.state.paymentMethod.creditcard.number,
		// 		// expiryDate: moment(this.state.paymentMethod.creditcard.expiryDate).format('MM/YY'),
		// 		// cv2: this.state.paymentMethod.creditcard.cv2,
		// 		judoId: env.payGateId,
		// 	}),
		// });
		// console.log('JUDOVOIDRAWRESPONSE', response);
		//
		// responseData = await response.json();
		// console.log('JUDOVOIDEPONSE', response.status, responseData);
		//

		// Update state and redux
		this.replacePersonInGroup(responseData.person);
		this.props.setPerson(responseData.person);
		this.props.setPersons(this.state.persons);

		// Go back to financials
		this.props.navigation.navigate('Financials')
	}

	async handleSave () {
		console.log('HandleSave', this.state);

		if (this.validateCreditcard()) {

			this.setState({
				errorText: 'Please wait while checking card details...',
			});


			let timestamp = new Date().getTime();
			let response, responseData;

			response = await fetch(env.payGateUrl + 'transactions/registercard', {
				method: 'post',
				headers: {
					'API-Version': '5.2',
					'Content-Type': 'application/json',
					'Authorization': env.payGateAuth,
				},
				body: JSON.stringify({
					yourConsumerReference: this.props.person.id,
					yourPaymentReference: timestamp,
					cardNumber: this.state.paymentMethod.creditcard.number,
					expiryDate: moment(this.state.paymentMethod.creditcard.expiryDate).format('MM/YY'),
					cv2: this.state.paymentMethod.creditcard.cv2,
					judoId: env.payGateId,
				}),
			});
			console.log('JUDOREGISTERRAWRESPONSE', response);

			responseData = await response.json();
			console.log('JUDOREGISTERREPONSE', response.status, responseData);

			if (response.status != 200) {
				let allMessages = [responseData.message];
				responseData.details && responseData.details.forEach(detail => allMessages.push(detail.message));
				console.log('ALLMESSAGES', responseData.message, allMessages.join(', '));
				this.setState({
					errorText: allMessages.join(', '),
				});
				return;
			}

			// Update the be with paymentGateway tokens
			this.setState({
				errorText: 'Please wait while updating your personal details...',
			});

			let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;
			let methodTokenized = {
				type: this.state.paymentMethodType,
				cardDetails: responseData.cardDetails,
				// consumer: responseData.consumer,
			};

			response = await fetch(beApiUrl + 'person/update', {
				method: 'put',
				body: JSON.stringify({
					fromMobile: true,
					paymentMethodTokenized: methodTokenized,
					token: this.props.token,
				})
			});
			console.log('FETCHRAWRESPONSE', response);

			if (response.status != 200) {
				this.setState({
					errorText: response._bodyText.replace('[', '').replace(']', '').replace(/\"/g, '').trim(),
				});
				return;
			}

			// TODO try/catch around this
			responseData = await response.json();
			console.log('SAVEFINANCIALREPONSE', responseData);

			// TODO Prefer a toast message 'saved'
			// https://www.npmjs.com/package/react-native-simple-toast
			this.setState({
				errorText: 'Saved',
			});

			// Update state and redux store with new person and group persons
			this.replacePersonInGroup(responseData.person);
			this.props.setPerson(responseData.person);
			this.props.setPersons(this.state.persons);

			// Go back to financials
			this.props.navigation.navigate('Financials')
		}
	}

	replacePersonInGroup(newPerson) {
		// Replace in the group the current person with the new version
		let newPersons = this.state.persons ? this.state.persons.slice(0) : [];  // create clone of all persons
		let replaced = false;
		newPersons = newPersons.map(person => {
			if (person.id === newPerson.id) {
				replaced = true;
				return newPerson;
			}
			return person;
		});

		if (!replaced) console.log('ERROR - LOGGED IN PERSON NOT FOUND IN GROUP ARRAY');

		this.setState({
			person: newPerson,
			persons: newPersons,
		});
	}

	validateCreditcard() {
		let errorsList = {};
		let errorText = '';

		if (!this.state.paymentMethod.creditcard.brand) {
			errorText = 'Please choose the creditcard type',
			errorsList.brand = true;
		}
		if (!this.state.paymentMethod.creditcard.name) {
			this.formInputCreditCardName.shake();
			errorText = 'Please enter all creditcard details',
			errorsList.name = true;
		}
		if (!this.state.paymentMethod.creditcard.number) {
			this.formInputCreditCardNumber.shake();
			errorText = 'Please enter all creditcard details',
			errorsList.number = true;
		}
		if (!this.state.paymentMethod.creditcard.expiryDate) {
			errorText = 'Please enter all creditcard details',
			errorsList.expiryDate = true;
		}
		if (!this.state.paymentMethod.creditcard.cv2) {
			this.formInputCreditCardCv2.shake();
			errorText = 'Please enter all creditcard details',
			errorsList.cv2 = true;
		}

		this.setState({
			errorText: errorText,
			hasErrors: errorsList,
		});

		return _.isEmpty(errorsList);
	}

	//
	// Rendering
	//
	render() {

		console.log('rendering financial details', this.state, this.props);

		const errorStyle = { backgroundColor: '#f7edf6' };

		const chooseMethod = () => {

			if (!this.state.paymentMethodEditable) return null;

			return (
				<View flexDirection='row' justifyContent='space-around'>
					<CheckBox
						key={'creditcard'}
						title={'Credit/Debit Card'}
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						containerStyle={{width: '32%'}}
						checked={this.state.paymentMethodType === 'creditcard' ? true : false}
						onPress={() => this.handleChooseMethod('creditcard')}
					/>
					<CheckBox
						key={'paypal'}
						title={'PayPal'}
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						containerStyle={{width: '32%'}}
						checked={this.state.paymentMethodType === 'paypal' ? true : false}
						onPress={() => this.handleChooseMethod('paypal')}
					/>
				</View>
			)
		}

		const creditCardForm = () => {

			if (this.state.paymentMethodType !== 'creditcard') return null;

			return (
				<View>

					{/*<FormLabel>Card Type</FormLabel>*/}

					<View flexDirection='row' justifyContent='space-around'>
						<CheckBox title={
							          <View flexDirection='row' justifyContent='flex-start'>
								          <Text> Visa </Text>
								          <Icon name='cc-visa' type='font-awesome' color='grey' size={ 14 } onPress={ () => this.handleCreditCard('brand', 'visa') }/>
							          </View>
						          }
						          containerStyle={ this.state.hasErrors.brand ? errorStyle : { backgroundColor: 'transparent' }}
						          onPress={ this.state.paymentMethodEditable ?
						          	() => this.handleCreditCard('brand', 'visa')
						            : null
						          }
						          onIconPress={ () => this.handleCreditCard('brand', 'visa') }
						          checked={ this.state.paymentMethod.creditcard.brand === 'visa' ? true : false }
						/>

						<CheckBox title={
							          <View flexDirection='row' justifyContent='flex-start'>
								          <Text> Mastercard </Text>
								          <Icon name='cc-mastercard' type='font-awesome' color='grey' size={ 16 } onPress={ () => this.handleCreditCard('brand', 'mastercard') }/>
							          </View>
						          }
						          containerStyle={ this.state.hasErrors.brand ? errorStyle : { backgroundColor: 'transparent' }}
						          onPress={ this.state.paymentMethodEditable ?
							          () => this.handleCreditCard('brand', 'mastercard')
							          : null
						          }
						          onIconPress={ () => this.handleCreditCard('brand', 'mastercard') }
						          checked={ this.state.paymentMethod.creditcard.brand === 'mastercard' ? true : false }
						          editable={ this.state.paymentMethodEditable ? true : false }
						/>
					</View>

					{/*<FormLabel>Card Details</FormLabel>*/}

					<FormInput placeholder={'Name on card'}
					           value={ this.state.paymentMethod.creditcard.name || '' }
					           editable={ this.state.paymentMethodEditable ? true : false }
					           containerStyle={ this.state.hasErrors.name ? errorStyle : null }
					           onChangeText={ data => this.handleCreditCard('name', data) }
					           ref={ ref => this.formInputCreditCardName = ref }/>

					<FormInput placeholder={'Card number'}
					           value={
					           	    this.state.paymentMethodEditable
						                ? this.state.paymentMethod.creditcard.number || ''
						                : '**** **** **** ' + this.state.paymentMethod.creditcard.last4
					           }
					           editable={ this.state.paymentMethodEditable ? true : false }
					           containerStyle={ this.state.hasErrors.number ? errorStyle : null }
					           onChangeText={ data => this.handleCreditCard('number', data) }
					           keyboardType={ 'numeric' }
					           ref={ ref => this.formInputCreditCardNumber = ref }/>

					<FormInput
						placeholder={ 'Expiry Date' }
						value={ this.state.paymentMethod.creditcard.expiryDate
							? moment(this.state.paymentMethod.creditcard.expiryDate).format('MMMM YYYY')
							: null }
						editable={ this.state.paymentMethodEditable ? true : false }
						containerStyle={ this.state.hasErrors.expiryDate ? errorStyle : null }
						onFocus={ this.toggleDatePicker }/>
					<DateTimePicker
						isVisible={ this.state.showDatePicker }
						onConfirm={ data => this.handleCreditCard('expiryDate', data) }
						onCancel={  this.toggleDatePicker }
						date={ new Date(moment(this.state.paymentMethod.creditcard.expiryDate).format()) || new Date() }
						minimumDate={ new Date() }
					/>

					<FormInput placeholder={'CSV or CVV'}
					           value={
						           this.state.paymentMethodEditable
							           ? this.state.paymentMethod.creditcard.cv2 || ''
							           : ''
					           }
					           editable={ this.state.paymentMethodEditable ? true : false }
					           containerStyle={ this.state.hasErrors.cv2 ? errorStyle : null }
					           onChangeText={ data => this.handleCreditCard('cv2', data) }
					           keyboardType={ 'numeric' }
					           ref={ ref => this.formInputCreditCardCv2 = ref }/>

				</View>
			)
		}

		const payPalForm = (
			<View>
			</View>
		)

		const buttons = () => {

			if (!this.state.paymentMethodType) return;

			return (
				<View style={{ flex: 1 }} flexDirection='row' justifyContent='space-around'>

					{!this.state.paymentMethodEditable
						?
							<Button
								icon={{ name: 'trash', type: 'font-awesome' }}
								title='Delete'
								onPress={ this.handleDelete }
								buttonStyle={{ width: '100%', borderRadius: 5}}
							/>
						:
							<Button
								icon={{ name: 'paper-plane', type: 'font-awesome' }}
								backgroundColor='green'
								title={ 'Save' }
								onPress={ this.handleSave }
								buttonStyle={{ width: '100%', borderRadius: 5}}
							/>
					}
				</View>
			)
		}


		return (
			<View style={{ flex: 1 }} flexDirection='column'>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Financials' }
				        title='Payment Method Details'
				/>

				<View style={{ flex: 4 }}>
					<KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>

						{ chooseMethod() }

						{ creditCardForm() }

						{ payPalForm }

						<FormValidationMessage
							containerStyle={{ backgroundColor: 'transparent' }}>
							<Text style={{ fontWeight: 'bold' }}>{ this.state.errorText || '' }</Text>
						</FormValidationMessage>

						{ buttons() }

					</KeyboardAwareScrollView>
				</View>
			</View>
		);
	}
}

export default FinancialDetailsScreen
