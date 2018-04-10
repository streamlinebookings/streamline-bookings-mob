// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
// import { env } from '../environment';
import { Header } from './header';


class FinancialsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('FINANCIALSCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let afterRegister = props.navigation.state && props.navigation.state.params && props.navigation.state.params.afterRegister || null;

		this.state = {
			afterRegister: afterRegister,
			fullName: fullName,
			isRegistering: !props.person ? true : false,
		}
	}

	//
	// Rendering
	//
	render() {

		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-account.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Account' }
				        title='Financial Details'
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>

						<List>
							<ListItem key={ 'paymentMethods' }
							          onPress={ () => this.props.navigation.navigate('PaymentMethods') }
							          title={ <View flexDirection='row' justifyContent='space-between'>
								          <Text>Payment Methods</Text>
							          </View>}
							          subtitle={ !this.props.person.paymentMethods || !this.props.person.paymentMethods.length
								          ? 'You haven\'t given a payment method yet'
								          : null }
							></ListItem>
							<ListItem key={ 'credits' }
							          onPress={ () => this.props.navigation.navigate('Credits') }
							          title={ <View flexDirection='row' justifyContent='space-between'>
								          <Text>Credits</Text>
							          </View>}
							></ListItem>
						</List>
					</ScrollView>
				</View>
			</View>
		);
	}
}

export default FinancialsScreen
