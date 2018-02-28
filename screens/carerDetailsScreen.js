// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Button, ButtonCarer, Card, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class CarerDetailsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('CarerDetailsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let from = !props.person && props.navigation.state && props.navigation.state.params && props.navigation.state.params.from || null;

		this.state = {
			carer: props.carerChosen ? props.carerChosen : {},
			errorText: false,
			from: from,
			fullName: fullName,
			hasErrors: {},
			isRegistering: !props.person ? true : false,
			localDb: props.localDb || false,
			password: null,
			passwordVisible: false,
			persons: props.persons || [],
		};

		// Bind local methods
		this.handleInput = this.handleInput.bind(this);
		this.handleAddress = this.handleAddress.bind(this);
		this.handleFirstName = this.handleFirstName.bind(this);
		this.handleLastName = this.handleLastName.bind(this);
		this.handlePhone = this.handlePhone.bind(this);
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handlePasswordVisible = this.handlePasswordVisible.bind(this);
		this.handlePostcode = this.handlePostcode.bind(this);
		this.handleState = this.handleState.bind(this);
		this.handleSuburb = this.handleSuburb.bind(this);
		this.handleRelationship = this.handleRelationship.bind(this);
		this.handleSaveOrNext = this.handleSaveOrNext.bind(this);
	}

	handleInput (inputSource, data) {
		console.log('HANDLEINPUT', inputSource, data);
		let newData = Object.assign({}, this.state.carer);
		newData[inputSource] = data;
		this.setState({ carer: newData});
	}
	handleAddress (data) {
		this.handleInput('address', data);
	}
	handleFirstName (data) {
		this.handleInput('firstName', data);
	}
	handleLastName (data) {
		this.handleInput('lastName', data);
	}
	handlePhone (data) {
		this.handleInput('phone', data);
	}
	handleEmail (data) {
		this.handleInput('email', data);
	}
	handlePassword (data) {
		this.handleInput('password', data);
		// this.handleInput('setPassword', true);
	}
	handlePasswordVisible () {
		this.setState({
			passwordVisible: !this.state.passwordVisible,
		})
	}
	handlePostcode (data) {
		this.handleInput('postcode', data);
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
			if (this.validateCarer()) {

				// Fill redux store with new carer details
				this.props.setCarerChosen(this.state.carer);

				// Go to new screen
				this.props.navigation.navigate('Venues')
			}
		} else {
			// Save
			if (this.validateCarer()) {

				let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

				fetch(beApiUrl + 'person/update', {
					method: 'put',
					body: JSON.stringify({
						fromMobile: true,
						carer: Object.assign({}, this.state.carer, { isCarer: true }),        // if carer.id => update existing, else add new
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
						console.log('SAVECARERREPONSE', response);

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

						// Replace the carer in the group with the returned version, or just add
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

						// Go back to carers
						this.props.navigation.navigate('Carers')
					})
					.catch(error => {
						console.log('SAVECARERerror', error);

					});
			}
		}
	}

	validateCarer() {
		this.setState({
			errorText: '',
			hasErrors: {},
		});

		if (this.state.carer && !this.state.carer.firstName) {
			this.setState({
				errorText: 'Please give a carer\'s first name',
				hasErrors: { firstName: true }
			});
			this.formInputFirstName.shake();
			return false;
		}
		if (this.state.isRegistering && this.state.carer && !this.state.carer.lastName) {
			this.setState({
				errorText: 'Please give a carer\'s last name',
				hasErrors: { lastName: true }
			});
			this.formInputLastName.shake();
			return false;
		}
		if (this.state.carer && !this.state.carer.email) {
			this.setState({
				errorText: 'Please give an email address',
				hasErrors: { email: true }
			});
			this.formInputEmail.shake();
			return false;
		}
		if (this.state.isRegistering && this.state.carer && !this.state.carer.password) {
			this.setState({
				errorText: 'Please give a carer\'s password',
				hasErrors: { password: true }
			});
			this.formInputPassword.shake();
			return false;
		}
		return true;
	}

	//
	// Rendering
	//
	render() {

		console.log('rendering carer details', this.state, this.props);

		const errorStyle = { backgroundColor: '#f7edf6' };

		return (
			<View style={{ flex: 1 }} flexDirection='column'>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ this.state.from || 'Carers' }
				        title='Carer Details'
				        noMenu={ this.state.isRegistering ? true : false }
				/>

				<View style={{ flex: 4 }}>
					<KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>

						{ this.state.isRegistering ?
							<Card containerStyle={{backgroundColor: 'lightgreen'}}>
								<Text>
									To register, please complete these details and continue to select your swimming school.
								</Text>
							</Card>
						: null}

						<FormLabel>Carer</FormLabel>
						<View style={{ flex: 11 }} flexDirection='row' justifyContent='space-between' >
							<View style={{ flex: 5 }}>
								<FormInput placeholder={ 'First name' }
								           value={ this.state.carer.firstName }
								           containerStyle={ this.state.hasErrors.firstName ? errorStyle : null }
								           ref={ ref => this.formInputFirstName = ref }
								           onChangeText={ this.handleFirstName }/>
							</View>
							<View style={{ flex: 5 }}>
								<FormInput placeholder={ 'Last name' }
								           value={ this.state.carer.lastName }
								           containerStyle={ this.state.hasErrors.lastName ? errorStyle : null }
								           ref={ ref => this.formInputLastName = ref }
								           onChangeText={ this.handleLastName }/>
							</View>
						</View>

						<FormLabel>Contact details { this.state.isRegistering
															? '- these will be your login details to this app'
															: this.state.carer.id
																? '- you can change your password here'
																: '' }</FormLabel>
						{ !this.state.isRegistering ?
							<FormInput placeholder={ 'Phone' }
							           value={ this.state.carer.phone }
							           containerStyle={ this.state.hasErrors.phone ? errorStyle : null }
							           onChangeText={ this.handlePhone }
									   keyboardType={ 'phone-pad' }/>
							: null
						}
						<FormInput placeholder={ 'Email address' }
						           value={ this.state.carer.email }
						           containerStyle={ this.state.hasErrors.email ? errorStyle : null }
						           onChangeText={ this.handleEmail }
						           keyboardType={ 'email-address' }
						           ref={ ref => this.formInputEmail = ref }/>
						<View style={{ flex: 11 }} flexDirection='row' justifyContent='space-between' >
							<View style={{ flex: 9 }}>
								<FormInput placeholder={ 'Password' }
								           value={ this.state.carer.password || null }
								           secureTextEntry={ !this.state.passwordVisible }
								           containerStyle={ this.state.hasErrors.password ? errorStyle : null }
								           ref={ ref => this.formInputPassword = ref }
								           onChangeText={ this.handlePassword }/>
							</View>
							<View style={{ flex: 2 }}>
								<Icon reverse raised name='eye' type='feather' color='lightgrey' size={ 14 }
								      onPress={ this.handlePasswordVisible }/>
							</View>
						</View>

						{ !this.state.isRegistering ?
							<View>
								<FormLabel>Address</FormLabel>
								<FormInput placeholder={ 'Address' }
								           value={ this.state.carer.address }
								           onChangeText={ this.handleAddress }/>

								<FormInput placeholder={ 'Suburb' }
								           value={ this.state.carer.suburb }
								           onChangeText={ this.handleSuburb }/>

								<View style={{ flex: 11 }} flexDirection='row' justifyContent='space-around'>
									<View style={{ flex: 5 }}>
										<FormInput placeholder={ 'State' }
										           value={ this.state.carer.state }
										           onChangeText={ this.handleState }/>
									</View>
									<View style={{ flex: 5 }}>
										<FormInput placeholder={ 'Postcode' }
										           value={ this.state.carer.postcode }
										           onChangeText={ this.handlePostcode }/>
									</View>
								</View>

								<FormLabel>Relationship</FormLabel>
								<FormInput placeholder={ 'Relationship to dependant(s)' }
								           value={ this.state.carer.relationship }
								           onChangeText={ this.handleRelationship }/>
							</View> : null
						}

						<FormValidationMessage
							containerStyle={{ backgroundColor: 'transparent' }}>
							<Text style={{ fontWeight: 'bold' }}>{ this.state.errorText || '' }</Text>
						</FormValidationMessage>

						<Button
							icon={{ name: 'paper-plane', type: 'font-awesome' }}
							backgroundColor='green'
							title={ this.state.isRegistering ? 'Next' : 'Save' }
							onPress={ this.handleSaveOrNext }/>

					</KeyboardAwareScrollView>
				</View>
			</View>
		);
	}
}

export default CarerDetailsScreen
