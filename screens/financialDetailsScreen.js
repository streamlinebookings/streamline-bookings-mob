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

		this.state = {
			errorText: false,
			fullName: fullName,
			hasErrors: {},
			localDb: props.localDb || false,
			paymentMethod: {
				creditcard: {},
				paypal: {},
			},
			paymentMethodChosen: '',
			persons: props.persons || [],
			showDatePicker: false,
		};

		// Bind local methods
		this.handleChooseMethod = this.handleChooseMethod.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.toggleDatePicker = this.toggleDatePicker.bind(this);
	}

	handleChooseMethod (method) {
		console.log('HandleChooseMethod', method);
		this.setState({ paymentMethodChosen: method });
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

	handleSave () {
		console.log('HandleSave', this.state);

		if (this.validateCreditcard()) {

				let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

				let method = this.state.paymentMethod[this.state.paymentMethodChosen];
				method.type = this.state.paymentMethodChosen;

				fetch(beApiUrl + 'person/update', {
					method: 'put',
					body: JSON.stringify({
						fromMobile: true,
						paymentMethod: method,
						token: this.props.token,
					})
				})
					.then(response => {
						console.log('FETCHRAWRESPONSE', response);
						if (response.status == 200) return response.json();

						// This isn't nice. I can't force the Promise to reject here (why???), so have to pass a
						// error string and let the then() decide if the data is good or not :-(
						return response._bodyText;
					})
					.then(response => {
						console.log('SAVEFINANCIALREPONSE', response);

						if (!_.isObject(response)) {
							this.setState({
								errorText: response.replace('[', '').replace(']', '').replace(/\"/g, '').trim(),
							});
							return;
						}

						// TODO Prefer a toast message 'saved'
						// https://www.npmjs.com/package/react-native-simple-toast
						this.setState({
							errorText: 'Saved',
						});

						// Replace in redux store the current person with the returned version, and update persons
						let newPersons = this.state.persons ? this.state.persons.slice(0) : [];  // create clone of all persons
						let replaced = false;
						newPersons = newPersons.map(person => {
							if (person.id === response.person.id) {
								replaced = true;
								return response.person;
							}
							return person;
						});
						if (!replaced) console.log('ERROR - LOGGED IN PERSON NOT FOUND IN GROUP ARRAY')

						// Fill redux store with new person and group persons
						this.props.setPerson(response.person);
						this.props.setPersons(newPersons);

						// Go back to financials
						this.props.navigation.navigate('Financials')
					})
					.catch(error => {
						console.log('SAVEFINANCIALerror', error);

					});
		}
	}

	validateCreditcard() {
		let errorsList = {};
		let errorText = '';

		if (!this.state.paymentMethod.creditcard.brand) {
			errorText: 'Please choose the creditcard type',
			errorsList.brand = true;
		}
		if (!this.state.paymentMethod.creditcard.name) {
			this.formInputCreditCardName.shake();
			errorText: 'Please enter all creditcard details',
			errorsList.name = true;
		}
		if (!this.state.paymentMethod.creditcard.number) {
			this.formInputCreditCardNumber.shake();
			errorText: 'Please enter all creditcard details',
			errorsList.number = true;
		}
		if (!this.state.paymentMethod.creditcard.expiryDate) {
			errorText: 'Please enter all creditcard details',
			errorsList.expiryDate = true;
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

		const chooseMethod = (
			<View flexDirection='row' justifyContent='space-around'>
				<CheckBox
					key={ 'creditcard' }
					title={ 'Credit/Debit Card' }
					iconType='font-awesome'
					checkedIcon='check'
					checkedColor='red'
					containerStyle={{ width: '32%' }}
					checked={ this.state.paymentMethodChosen === 'creditcard' ? true : false }
					onPress={ () => this.handleChooseMethod('creditcard') }
				/>
				<CheckBox
					key={ 'paypal' }
					title={ 'PayPal' }
					iconType='font-awesome'
					checkedIcon='check'
					checkedColor='red'
					containerStyle={{ width: '32%' }}
					checked={ this.state.paymentMethodChosen === 'paypal' ? true : false }
					onPress={ () => this.handleChooseMethod('paypal') }
				/>
			</View>
		)

		const creditCardForm = () => {

			if (this.state.paymentMethodChosen !== 'creditcard') return null;

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
						          onPress={ () => this.handleCreditCard('brand', 'visa') }
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
						          onPress={ () => this.handleCreditCard('brand', 'mastercard') }
						          onIconPress={ () => this.handleCreditCard('brand', 'mastercard') }
						          checked={ this.state.paymentMethod.creditcard.brand === 'mastercard' ? true : false }
						          />
					</View>

					{/*<FormLabel>Card Details</FormLabel>*/}

					<FormInput placeholder={'Name on card'}
					           value={ this.state.paymentMethod.creditcard.name || '' }
					           containerStyle={ this.state.hasErrors.name ? errorStyle : null }
					           onChangeText={ data => this.handleCreditCard('name', data) }
					           ref={ ref => this.formInputCreditCardName = ref }/>

					<FormInput placeholder={'Card number'}
					           value={ this.state.paymentMethod.creditcard.number || '' }
					           containerStyle={ this.state.hasErrors.number ? errorStyle : null }
					           onChangeText={ data => this.handleCreditCard('number', data) }
					           ref={ ref => this.formInputCreditCardNumber = ref }/>

					<FormInput
						placeholder={ 'Expiry Date' }
						value={ this.state.paymentMethod.creditcard.expiryDate
							? moment(this.state.paymentMethod.creditcard.expiryDate).format('MMMM YYYY')
							: null }
						containerStyle={ this.state.hasErrors.expiryDate ? errorStyle : null }
						onFocus={ this.toggleDatePicker }/>
					<DateTimePicker
						isVisible={ this.state.showDatePicker }
						onConfirm={ data => this.handleCreditCard('expiryDate', data) }
						onCancel={  this.toggleDatePicker }
						date={ new Date(moment(this.state.paymentMethod.creditcard.expiryDate).format()) || new Date() }
						minimumDate={ new Date() }
					/>
				</View>
			)
		}

		const payPalForm = (
			<View>
			</View>
		)


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

						{ chooseMethod }

						{ creditCardForm() }

						{ payPalForm }

						{/*// form for either*/}

						{/*/!*{ this.state.isRegistering ?*!/*/}
							{/*/!*<Card containerStyle={{backgroundColor: 'lightgreen'}}>*!/*/}
								{/*/!*<Text>To register, please complete this and the following screens with family and person details</Text>*!/*/}
							{/*/!*</Card>*!/*/}
						{/*/!*: null}*!/*/}

						{/*// button cc or paypal*/}
						{/**/}
						{/*<FormLabel>Financial</FormLabel>*/}
						{/*<View style={{ flex: 11 }} flexDirection='row' justifyContent='space-between' >*/}
							{/*<View style={{ flex: 5 }}>*/}
								{/*<FormInput placeholder={ 'First name' }*/}
								           {/*value={ this.state.financial.firstName }*/}
								           {/*containerStyle={ this.state.hasErrors.firstName ? errorStyle : null }*/}
								           {/*onChangeText={ this.handleFirstName }*/}
								           {/*ref={ ref => this.formInputFirstName = ref }/>*/}
							{/*</View>*/}
							{/*<View style={{ flex: 5 }}>*/}
								{/*<FormInput placeholder={ 'Last name' }*/}
								           {/*value={ this.state.financial.lastName }*/}
								           {/*onChangeText={ this.handleLastName }/>*/}
							{/*</View>*/}
						{/*</View>*/}

						{/*<FormLabel>Phone & Email</FormLabel>*/}
						{/*<FormInput placeholder={ 'Phone' }*/}
						           {/*value={ this.state.financial.phone }*/}
						           {/*containerStyle={ this.state.hasErrors.phone ? errorStyle : null }*/}
						           {/*onChangeText={ this.handlePhone }*/}
						           {/*keyboardType={ 'phone-pad' }/>*/}
						{/*<FormInput placeholder={ 'Email address' }*/}
						           {/*value={ this.state.financial.email }*/}
						           {/*containerStyle={ this.state.hasErrors.email ? errorStyle : null }*/}
						           {/*onChangeText={ this.handleEmail }*/}
						           {/*keyboardType={ 'email-address' }/>*/}

						{/*<FormLabel>Date of Birth</FormLabel>*/}
						{/*<FormInput*/}
								 {/*placeholder={ 'Tap here to set the date of birth' }*/}
								 {/*value={ this.state.financial.dob*/}
											{/*? moment(this.state.financial.dob).format('D MMMM YYYY')*/}
											{/*: null }*/}
						         {/*onFocus={ this.toggleDatePicker }/>*/}
						{/*<DateTimePicker*/}
							{/*isVisible={ this.state.showDatePicker }*/}
							{/*onConfirm={ this.handleDob }*/}
							{/*onCancel={ this.toggleDatePicker }*/}
							{/*date={ new Date(moment(this.state.financial.dob).format()) || new Date() }*/}
							{/*maximumDate={ new Date() }*/}
						{/*/>*/}

						{/*<FormLabel>More information</FormLabel>*/}
						{/*/!* Medical Indication *!/*/}
						{/*<CheckBox title={ (this.state.financial.firstName || '') + ' has a medical indication' }*/}
								  {/*textStyle={{ fontWeight: 'normal', fontSize: 14, color: '#86939e' }}*/}
						          {/*containerStyle={{ backgroundColor: 'transparent' }}*/}
								  {/*onPress={ this.handleMedicalIndication }*/}
								  {/*onIconPress={ this.handleMedicalIndication }*/}
								  {/*checked={ this.state.financial.hasMedicalIndication }/>*/}

						{/*/!* Gender *!/*/}
						{/*<View style={{ flex: 3 }} flexDirection='row' justifyContent='flex-start' >*/}
							{/*<CheckBox title='Ms'*/}
							          {/*textStyle={{ fontWeight: 'normal', fontSize: 14, color: '#86939e' }}*/}
							          {/*containerStyle={{ backgroundColor: 'transparent' }}*/}
							          {/*onPress={ () => this.handleGender('ms') }*/}
							          {/*onIconPress={ () => this.handleGender('ms') }*/}
							          {/*checked={ this.state.financial.gender === 'ms' }*/}
							          {/*style={{ flex: 1 }}/>*/}
							{/*<CheckBox title='Mr'*/}
							          {/*textStyle={{ fontWeight: 'normal', fontSize: 14, color: '#86939e' }}*/}
							          {/*containerStyle={{ backgroundColor: 'transparent' }}*/}
							          {/*onPress={ () => this.handleGender('mr') }*/}
							          {/*onIconPress={ () => this.handleGender('mr') }*/}
							          {/*checked={ this.state.financial.gender === 'mr' }*/}
							          {/*style={{ flex: 1 }}/>*/}
							{/*<CheckBox title='Mx'*/}
							          {/*textStyle={{ fontWeight: 'normal', fontSize: 14, color: '#86939e' }}*/}
							          {/*containerStyle={{ backgroundColor: 'transparent' }}*/}
							          {/*onPress={ () => this.handleGender('mx') }*/}
							          {/*onIconPress={ () => this.handleGender('mx') }*/}
							          {/*checked={ this.state.financial.gender !== 'ms' && this.state.financial.gender !== 'mr' }*/}
							          {/*style={{ flex: 1 }}/>*/}
						{/*</View>*/}

						{/*/!* Show the current level *!/*/}
						{/*{ this.state.financial.atLevel && this.state.financial.atLevel.name ?*/}
							{/*<FormInput placeholder={ this.state.financial.atLevel.name }*/}
							           {/*disabled={ true }*/}
							           {/*value={ 'Current level is: ' + this.state.financial.atLevel.name }/>*/}
							{/*: null*/}
						{/*}*/}

						<FormValidationMessage
							containerStyle={{ backgroundColor: 'transparent' }}>
							<Text style={{ fontWeight: 'bold' }}>{ this.state.errorText || '' }</Text>
						</FormValidationMessage>

						<Button
							icon={{ name: 'paper-plane', type: 'font-awesome' }}
							backgroundColor='green'
							title={ 'Save' }
							onPress={ this.handleSave }/>

					</KeyboardAwareScrollView>
				</View>
			</View>
		);
	}
}

export default FinancialDetailsScreen
