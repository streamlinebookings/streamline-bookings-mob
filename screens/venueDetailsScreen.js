// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class VenueDetailsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('VenueDetailsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		// These params passed in after leaving a previous screen (e.g. the pay screen)
		let params = this.props.navigation.state.params || {};

		this.state = {
			errorText: false,
			fullName: fullName,
			localDb: false,
			message: params.message || '',
		}

		// Reset the parameters to avoid constant messages
		this.props.navigation.state.params = {};
	}

	//
	// Rendering
	//
	render() {

		const VenueDetails = () => {

			console.log('creating venueDetails', this.state);

			let textStyle = {};

			let address = [];
			this.props.venue.address1 && address.push(this.props.venue.address1);
			this.props.venue.address2 && address.push(this.props.venue.address2);
			this.props.venue.address3 && address.push(this.props.venue.address3);
			address = address.join(', ');

			return (

				<List>

					<ListItem key={ 'name' }
					          leftIcon={{ name: 'barcode', type: 'font-awesome' }}
					          title={
								<View flexDirection='row' justifyContent='space-between' alignItems='center' >
									<Text style={textStyle}>{ this.props.venue.name }</Text>
									<Image style={{ height: 40, width: 40 }}
									       source={{ uri: env.imagesUrl + 'app/' + this.props.venue.logo }}/>
								</View>
					          }
							  hideChevron={ true }
					></ListItem>

					<ListItem key={ 'address' }
					          leftIcon={{ name: 'home', type: 'font-awesome' }}
					          title={ address }
							  hideChevron={ true }
					></ListItem>

					<ListItem key={ 'phoneNumber' }
					          leftIcon={{ name: 'phone', type: 'font-awesome' }}
					          title={ this.props.venue.phoneNumber }
							  hideChevron={ true }
					></ListItem>

					<ListItem key={ 'email' }
					          leftIcon={{ name: 'envelope', type: 'font-awesome' }}
					          title={ this.props.venue.email }
							  hideChevron={ true }
					></ListItem>

					<ListItem key={ 'website' }
					          leftIcon={{ name: 'cloud', type: 'font-awesome' }}
					          title={ this.props.venue.website }
							  hideChevron={ true }
					></ListItem>

					{ this.props.venue.bsb ?
						<ListItem key={ 'bank' }
						          leftIcon={{ name: 'bank', type: 'font-awesome' }}
						          title={ 'BSB: ' + this.props.venue.bsb + ', Account: ' + this.props.venue.accountNumber }
								  hideChevron={ true }
						></ListItem>
						: null }

				</List>
			)
		}

		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Account' }
				        title='Swim School'
				/>

				<View style={{ flex: 4 }}>

					<ScrollView>

						{ this.state.message ?
							<Card containerStyle={{backgroundColor: 'lightgreen'}}>
								<Text>
									{ this.state.message }
								</Text>
							</Card>
							: null }

						{ VenueDetails() }

					</ScrollView>
				</View>

			</View>
		);
	}
}

export default VenueDetailsScreen
