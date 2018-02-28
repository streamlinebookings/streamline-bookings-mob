// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class GroupDetailsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('GroupDetailsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let from = !props.person && props.navigation.state && props.navigation.state.params && props.navigation.state.params.from || null;

		this.state = {
			group: props.group || {},
			errorText: false,
			from: from,
			fullName: fullName,
			hasErrors: {},
			isRegistering: !props.person ? true : false,
			localDb: props.localDb || false,
		};

		// Bind local methods
		this.handleInput = this.handleInput.bind(this);
		this.handleAddress = this.handleAddress.bind(this);
		this.handleName = this.handleName.bind(this);
		this.handlePostcode = this.handlePostcode.bind(this);
		this.handleState = this.handleState.bind(this);
		this.handleSuburb = this.handleSuburb.bind(this);
		this.handleSaveOrNext = this.handleSaveOrNext.bind(this);
	}

	handleInput (inputSource, data) {
		console.log('HANDLEINPUT', inputSource, data);
		let newData = Object.assign({}, this.state.group);
		newData[inputSource] = data;
		this.setState({ group: newData});
	}
	handleAddress (data) {
		this.handleInput('address', data);
	}
	handleName (data) {
		this.handleInput('name', data);
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

	handleSaveOrNext () {
		console.log('HANDLESAVEORNEXT', this.state);

		if (this.state.isRegistering) {
			// Next
			if (this.validateGroup()) {

				// Fill redux store with new group details
				this.props.setGroup(this.state.group);

				// Go to new screen
				this.props.navigation.navigate('Carers')
			}

		} else {

			// Save
			if (this.validateGroup()) {

				let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

				fetch(beApiUrl + 'group/update', {
					method: 'put',
					body: JSON.stringify({
						fromMobile: true,
						group: this.state.group,         // if group.id => update existing, else add new
						token: this.props.token,
					})
				})
					.then(response => {
						console.log('FETCHRAWRESPONSE', response);
						if (response.status == 200) return response.json();

						this.setState({
							errorText: response._bodyText,
						});
						return response;
					})
					.then(response => {
						console.log('SAVEGROUPREPONSE', response);

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

						// Fill redux store with new group
						this.props.setGroup(response.group);

						// Go back to carers
						this.props.navigation.navigate('Account')
					});
			}
		}
	}

	validateGroup() {
		this.setState({
			errorText: '',
			hasErrors: {},
		});

		if (this.state.group && !this.state.group.name) {
			this.setState({
				errorText: 'Please give a family or group name',
				hasErrors: { name: true },
			});
			this.formInputName.shake();
			return false;
		}
		return true;
	}

	//
	// Rendering
	//
	render() {

		console.log('rendering group details', this.state, this.props);

		const errorStyle = { backgroundColor: '#f7edf6' };

		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ this.state.from || 'Account' }
				        title='Family / Group Details'
				/>

				<View style={{ flex: 4 }}>
					<KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>

						{ this.state.isRegistering ?
							<Card containerStyle={{backgroundColor: 'lightgreen'}}>
								<Text>To register, please complete this and the following screens with family and person details</Text>
							</Card>
						: null}

						<FormLabel>Family / Group</FormLabel>
						<FormInput placeholder={ 'Family or Group name' }
						           value={ this.state.group.name }
						           containerStyle={ this.state.hasErrors.name ? errorStyle : null }
						           onChangeText={ this.handleName }
						           ref={ ref => this.formInputName = ref }/>

						<FormLabel>Address</FormLabel>
						<FormInput placeholder={ 'Address' }
						           value={ this.state.group.address }
						           onChangeText={ this.handleAddress }/>

						<FormInput placeholder={ 'Suburb' }
						           value={ this.state.group.suburb }
						           onChangeText={ this.handleSuburb }/>

						<View style={{ flex: 11 }} flexDirection='row' justifyContent='space-around'>
							<View style={{ flex: 5 }}>
							<FormInput placeholder={ 'State' }
							           value={ this.state.group.state }
							           onChangeText={ this.handleState }/>
							</View>
							<View style={{ flex: 5 }}>
							<FormInput placeholder={ 'Postcode' }
							           value={ this.state.group.postcode }
							           onChangeText={ this.handlePostcode }/>
							</View>
						</View>

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

export default GroupDetailsScreen
