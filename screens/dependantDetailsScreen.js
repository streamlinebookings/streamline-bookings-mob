// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Button, ButtonDependant, Card, CheckBox, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';
//import DateTimePicker from 'react-native-modal-datetime-picker';
// https://github.com/mmazzarolo/react-native-modal-datetime-picker

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class DependantDetailsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('DependantDetailsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		this.state = {
			dependant: props.dependantsChosen ? props.dependantsChosen[0] : {},
			errorText: false,
			fullName: fullName,
			hasErrors: {},
			isRegistering: !props.person ? true : false,
			localDb: props.localDb || false,
			passwordVisible: false,
			persons: props.persons || [],
		};

		// Bind local methods
		this.handleInput = this.handleInput.bind(this);
		this.handleAddress = this.handleAddress.bind(this);
		this.handleEmail = this.handleEmail.bind(this);
		this.handleFirstName = this.handleFirstName.bind(this);
		this.handleGender = this.handleGender.bind(this);
		this.handleLastName = this.handleLastName.bind(this);
		this.handleMedicalIndication = this.handleMedicalIndication.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handlePasswordVisible = this.handlePasswordVisible.bind(this);
		this.handlePhone = this.handlePhone.bind(this);
		this.handlePostcode = this.handlePostcode.bind(this);
		this.handleState = this.handleState.bind(this);
		this.handleSuburb = this.handleSuburb.bind(this);
		this.handleRelationship = this.handleRelationship.bind(this);
		this.handleSaveOrNext = this.handleSaveOrNext.bind(this);
	}

	handleInput (inputSource, data) {
		console.log('HANDLEINPUT', inputSource, data);
		let newData = Object.assign({}, this.state.dependant);
		newData[inputSource] = data;
		this.setState({ dependant: newData});
	}
	handleAddress (data) {
		this.handleInput('address', data);
	}
	handleEmail (data) {
		this.handleInput('email', data);
	}
	handleFirstName (data) {
		this.handleInput('firstName', data);
	}
	handleGender (data) {
		this.handleInput('gender', data);
	}
	handleLastName (data) {
		this.handleInput('lastName', data);
	}
	handleMedicalIndication (data) {
		this.handleInput('hasMedicalIndication', !this.state.dependant.hasMedicalIndication);
	}
	handlePassword (data) {
		this.handleInput('password', data);
	}
	handlePasswordVisible () {
		this.setState({
			passwordVisible: !this.state.passwordVisible,
		})
	}
	handlePostcode (data) {
		this.handleInput('postcode', data);
	}
	handlePhone (data) {
		this.handleInput('phone', data);
	}
	handleState (data) {
		this.handleInput('state', data);
	}
	handleSuburb (data) {
		this.handleInput('suburb', data);
	}
	handleRelationship (data) {
		this.handleInput('relationship', data);
	}


	handleSaveOrNext () {
		console.log('HANDLESAVEORNEXT', this.state);

		if (this.state.isRegistering) {
			// Next
			if (this.validateDependant()) {

				// Fill redux store with new dependant details
				this.props.setDependant(this.state.dependant);

				// Go to new screen
				this.props.navigation.navigate('Dependants')
			}
		} else {
			// Save
			if (this.validateDependant()) {

				let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

				fetch(beApiUrl + 'person/update', {
					method: 'put',
					body: JSON.stringify({
						fromMobile: true,
						dependant: Object.assign({}, this.state.dependant, { isDependant: true }),        // if dependant.id => update existing, else add new
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
						console.log('SAVEDEPENDANTREPONSE', response);

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

						// Replace the dependant in the group with the returned version, or just add
						let newPersons = this.state.persons ? this.state.persons.slice(0) : [];  // create clone of all persons
						let replaced = false;
						newPersons = newPersons.map(person => {
							if (person.id === response.person.id) {
								replaced = true;
								return response.person;
							}
							return person;
						});
						if (!replaced) newPersons.unshift(response.person);

						// Fill redux store with new group persons
						this.props.setPersons(newPersons);

						// Go back to dependants
						this.props.navigation.navigate('Dependants')
					})
					.catch(error => {
						console.log('SAVEDEPENDANTerror', error);

					});
			}
		}
	}

	validateDependant() {
		this.setState({
			errorText: '',
			hasErrors: {},
		});

		if (this.state.dependant && !this.state.dependant.firstName) {
			this.setState({
				errorText: 'Please give a dependant\'s first name',
				hasErrors: { firstName: true }
			});
			this.formInputFirstName.shake();
			return false;
		}
		if (this.state.dependant && !this.state.dependant.email) {
			this.setState({
				errorText: 'Please give an email address',
				hasErrors: { email: true }
			});
			this.formInputEmail.shake();
			return false;
		}
		return true;
	}

	//
	// Rendering
	//
	render() {

		console.log('rendering dependant details', this.state, this.props);

		const errorStyle = { backgroundColor: '#f7edf6' };

		return (
			<View style={{ flex: 1 }} flexDirection='column'>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Dependants' }
				        title='Dependant Details'
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>

						{ this.state.isRegistering ?
							<Card containerStyle={{backgroundColor: 'lightgreen'}}>
								<Text>To register, please complete this and the following screens with family and person details</Text>
							</Card>
						: null}

						<FormLabel>Dependant</FormLabel>
						<View style={{ flex: 11 }} flexDirection='row' justifyContent='space-between' >
							<View style={{ flex: 5 }}>
								<FormInput placeholder={ 'First name' }
								           value={ this.state.dependant.firstName }
								           containerStyle={ this.state.hasErrors.firstName ? errorStyle : null }
								           onChangeText={ this.handleFirstName }
								           ref={ ref => this.formInputFirstName = ref }/>
							</View>
							<View style={{ flex: 5 }}>
								<FormInput placeholder={ 'Last name' }
								           value={ this.state.dependant.lastName }
								           onChangeText={ this.handleLastName }/>
							</View>
						</View>

						<FormLabel>Phone & Email</FormLabel>
						<FormInput placeholder={ 'Phone' }
						           value={ this.state.dependant.phone }
						           containerStyle={ this.state.hasErrors.phone ? errorStyle : null }
						           onChangeText={ this.handlePhone }/>
						<FormInput placeholder={ 'Email address' }
						           value={ this.state.dependant.email }
						           containerStyle={ this.state.hasErrors.email ? errorStyle : null }
						           onChangeText={ this.handleEmail }/>

						<FormLabel>Date of Birth</FormLabel>

						<FormLabel>More information</FormLabel>
						{/* Medical Indication */}
						<CheckBox title={ (this.state.dependant.firstName || '') + ' has a medical indication' }
								  textStyle={{ fontWeight: 'normal', fontSize: 14, color: '#86939e' }}
						          containerStyle={{ backgroundColor: 'transparent' }}
								  onPress={ this.handleMedicalIndication }
								  onIconPress={ this.handleMedicalIndication }
								  checked={ this.state.dependant.hasMedicalIndication }/>

						{/* Gender */}
						<View style={{ flex: 3 }} flexDirection='row' justifyContent='flex-start' >
							<CheckBox title='Ms'
							          textStyle={{ fontWeight: 'normal', fontSize: 14, color: '#86939e' }}
							          containerStyle={{ backgroundColor: 'transparent' }}
							          onPress={ () => this.handleGender('ms') }
							          onIconPress={ () => this.handleGender('ms') }
							          checked={ this.state.dependant.gender === 'ms' }
							          style={{ flex: 1 }}/>
							<CheckBox title='Mr'
							          textStyle={{ fontWeight: 'normal', fontSize: 14, color: '#86939e' }}
							          containerStyle={{ backgroundColor: 'transparent' }}
							          onPress={ () => this.handleGender('mr') }
							          onIconPress={ () => this.handleGender('mr') }
							          checked={ this.state.dependant.gender === 'mr' }
							          style={{ flex: 1 }}/>
							<CheckBox title='Mx'
							          textStyle={{ fontWeight: 'normal', fontSize: 14, color: '#86939e' }}
							          containerStyle={{ backgroundColor: 'transparent' }}
							          onPress={ () => this.handleGender('mx') }
							          onIconPress={ () => this.handleGender('mx') }
							          checked={ this.state.dependant.gender !== 'ms' && this.state.dependant.gender !== 'mr' }
							          style={{ flex: 1 }}/>
						</View>

						{/*level info if we have it: this.state.dependant.atLevel.name */}





						<FormValidationMessage
							containerStyle={{ backgroundColor: 'transparent' }}>
							<Text style={{ fontWeight: 'bold' }}>{ this.state.errorText || '' }</Text>
						</FormValidationMessage>

						<Button
							icon={{ name: 'paper-plane', type: 'font-awesome' }}
							backgroundColor='green'
							title={ this.state.isRegistering ? 'Next' : 'Save' }
							onPress={ this.handleSaveOrNext }/>

					</ScrollView>
				</View>
			</View>
		);
	}
}

export default DependantDetailsScreen
