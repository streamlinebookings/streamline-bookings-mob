// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class PaymentMethodsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('PaymentMethodsCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

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
		this.handleNext = this.handleNext.bind(this);
		this.handleAddPaymentMethod = this.handleAddPaymentMethod.bind(this);
	}

	handlePaymentMethodActions (paymentMethod) {
		console.log('HANDLEPaymentMethodACTIONSFOR', paymentMethod);

		// Update the redux store with the chosen paymentMethod
		this.props.setPaymentMethodChosen([paymentMethod]);

		// Go to next screen
		this.props.navigation.navigate('PaymentMethodDetails');
	}

	handleAddPaymentMethod () {
		console.log('HandleAddPaymentMethod');

		// Ensure nobody is chosen in the redux store
		this.props.setPaymentMethodChosen();

		// Go to next screen
		this.props.navigation.navigate('PaymentMethodDetails');
	}

	handleNext () {

		// Not used
		return;

		console.log('HANDLENEXT', this.state);

		if (this.state.isRegistering) {
			// Next
			if (this.validatePaymentMethod()) {

				// Fill redux store with new paymentMethod details
				this.props.setPaymentMethodsChosen([this.state.paymentMethod]);

				// Go to new screen
				this.props.navigation.navigate('PaymentMethodsDetails')
			}
		} else {
			// Save
		}
	}

	//
	//
	// Rendering
	//
	render() {

		console.log('rendering paymentMethods', this.state, this.props);

		const paymentMethodsList = () => {

			console.log('creating list paymentMethods', this.state);

			let allPaymentMethods = this.state.person.paymentMethods || [];

			return (

				<List>

					{ allPaymentMethods.map(paymentMethod => {

						let textStyle = {};

						return (
							<ListItem key={ paymentMethod.id }
							          onPress={ () => this.handlePaymentMethodActions(paymentMethod) }
							          title={
								          <View>
									          <View flexDirection='row' justifyContent='space-between'>
										          <Text style={textStyle}>{
											         _.capitalize(paymentMethod.type) + ' **** **** **** ' + paymentMethod.last4
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
				<View style={{ flex: 1, paddingTop: 5 }} flexDirection='row' justifyContent='space-around' alignItems='center'>
					<Button
						icon={{name: 'plus', type: 'font-awesome'}}
						backgroundColor='green'
						title='Add a payment method'
						buttonStyle={{ width: (this.state.isRegistering ? '80%' : '100%') }}
						onPress={ this.handleAddPaymentMethod }
					/>

					{ this.state.isRegistering ?
						<Button
							icon={{ name: 'paper-plane', type: 'font-awesome' }}
							backgroundColor='green'
							title={ 'Next' }
							buttonStyle={{ width: '80%' }}
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
						backTo={ 'Financials' }
					    title='Payment Methods'
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>

						{ paymentMethodsList() }

						{ buttons() }

					</ScrollView>
				</View>

			</View>
		);
	}
}

export default PaymentMethodsScreen
