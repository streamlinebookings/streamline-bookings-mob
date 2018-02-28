// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class VenuesScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('VenuesCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		// let from = !props.person && props.navigation.state && props.navigation.state.params && props.navigation.state.params.from || null;

		this.state = {
			afterRegisterMessage: '',
			// carer: props.carerChosen || {},
			fullName: fullName,
			group: props.group || {},
			highlightVenueId: props.venueChosen && props.venueChosen.id || null,
			isRegistering: !props.person ? true : false,
			localDb: props.localDb || false,
			persons: props.persons || [],
			venues: [],
		};

		// Bind local methods
		this.handleRegister = this.handleRegister.bind(this);
		this.handleVenueActions = this.handleVenueActions.bind(this);
	}

	componentDidMount() {

		// Get the venues and their schools

		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;
		fetch(beApiUrl + 'venues', {
			method: 'post',
		})
			.then(response => {
				console.log('VENUEFETCHRAWRESPONSE', response);
				if (response.status == 200) return response.json();
				return response;
			})
			.then(response => {
				console.log('VENUEREPONSE', response);

				if (response.venues) this.setState({ venues: response.venues });
			})
			.catch(err => {
				console.log('VENUEERROR', err);
			});
	}

	handleVenueActions (venue) {
		console.log('HANDLEVENUEACTIONSFOR', venue);

		// Update the redux store with the chosen venue
		this.props.setVenueChosen(venue);

		this.setState({
			highlightVenueId: venue.id,
		});
	}

	handleRegister () {
		console.log('HandleRegister', this.state);

		if (this.state.isRegistering) {
			// Register

			let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;
			fetch(beApiUrl + 'register', {
				method: 'post',
				body: JSON.stringify({
					person: this.props.carerChosen,
					venue: this.props.venueChosen,
				}),
			})
				.then(response => {
					console.log('REGISTERRAWRESPONSE', response);
					if (response.status == 200) return response.json();
					return response;
				})
				.then(response => {
					console.log('REGISTERREPONSE', response);

					if (response.person) {
						// Call the redux actions = set the store
						this.props.setGroup(response.group);
						this.props.setPerson(response.person);
						this.props.setPersons(response.persons);
						this.props.setToken(response.token);

						// Go to next screen
						this.props.navigation.navigate('Account', {
							afterRegister: true,
						});

					} else {
						this.setState({
							person: {},
							afterRegisterMessage: response._bodyText,
						})
					}
				})
				.catch(err => {
					console.log('REGISTERERROR', err);
					this.setState({
						afterRegisterMessage: err
					})
				});
		}
	}

	//
	//
	// Rendering
	//
	render() {

		console.log('rendering venue details', this.state, this.props);

		const venuesList = () => {

			console.log('creating list venues', this.state);

			let allVenues = this.state.venues;

			// Sort the venues on first name
			allVenues.sort((a, b) => {
				return a.name.localeCompare(b.name);
			});

			return (

				<List>

					{ allVenues.map(venue => {

						let textStyle = {};

						return (
							<ListItem key={ venue.id }

							          containerStyle={ this.state.highlightVenueId === venue.id ? {backgroundColor: '#c2f7b2'} : {} }

							          onPress={ () => this.handleVenueActions(venue) }
							          title={
								          <View>
									          <View flexDirection='row' justifyContent='space-between'>
										          <Text style={ textStyle }>{ venue.school.name + ' - ' + venue.name }</Text>
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

					{ this.state.isRegistering ?
						<Button
							icon={{ name: 'paper-plane', type: 'font-awesome' }}
							backgroundColor='green'
							title={ 'Register' }
							onPress={ this.handleRegister }
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
						backTo={ 'CarerDetails' }
					    title='Schools'
					    noMenu={ this.state.isRegistering ? true : false }
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>

						{ this.state.isRegistering ?
							<Card containerStyle={{backgroundColor: 'lightgreen'}}>
								<Text>
									Select your swimming school and complete the registration.
								</Text>
								<Text style={{ paddingTop: 5 }}>
									Please then continue to add the swimmers' details.
								</Text>
								<Text style={{ paddingTop: 5 }}>
									Thank you!
								</Text>
							</Card>
						: null }

						{ venuesList() }

						<FormValidationMessage
							containerStyle={{ backgroundColor: 'transparent' }}>
							<Text style={{ fontWeight: 'bold' }}>{ this.state.afterRegisterMessage || '' }</Text>
						</FormValidationMessage>

						{ buttons() }

					</ScrollView>
				</View>

			</View>
		);
	}
}

export default VenuesScreen
