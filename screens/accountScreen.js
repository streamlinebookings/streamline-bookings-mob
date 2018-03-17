// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { Card, FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

let moment = require('moment');
let _ = require('lodash');

// Our imports
// import { env } from '../environment';
import { Header } from './header';


class AccountScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('ACCOUNTCONSTRUCTOR', props);

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
				        backTo={ 'Home' }
				        title='Account'
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>

						{ this.state.afterRegister ?
							<Card containerStyle={{backgroundColor: 'lightgreen'}}>
								<Text>
									Thank you for registering! You will be contacted with a few days.
								</Text>
								<Text style={{ paddingTop: 5 }}>
									Please add the swimmers' details and complete your personal details.
								</Text>
								<Text style={{ paddingTop: 5 }}>
									See you soon!
								</Text>
							</Card>
						: null }

						<List>
							{ this.state.isRegistering ?
			                    <ListItem key={ 'chooseVenue' }
			                              onPress={ () => { this.props.navigation.navigate('Venues') }}
			                              title={ <View flexDirection='row' justifyContent='space-between'>
			                                          <Text>Choose a swimming school</Text>
			                                      </View>}
							              disabled={ !this.state.isRegistering ? true : false }
			                      ></ListItem>
							: null }
		   					<ListItem key={ 'groupDetails' }
		   					          onPress={ () => { this.props.navigation.navigate('GroupDetails') }}
		   					          title={ <View flexDirection='row' justifyContent='space-between'>
		   								          <Text>Family details</Text>
		   							          </View>}
		   			          ></ListItem>
		   					<ListItem key={ 'carers' }
		   					          onPress={ () => this.props.navigation.navigate('Carers') }
		   					          title={ <View flexDirection='row' justifyContent='space-between'>
		   								          <Text>Carers and adults</Text>
		   							          </View>}
		   			          ></ListItem>
		   					<ListItem key={ 'dependants' }
		   					          onPress={ () => this.props.navigation.navigate('Dependants') }
		   					          title={ <View flexDirection='row' justifyContent='space-between'>
		   								          <Text>Dependants and children</Text>
		   							          </View> }
						              subtitle={ this.props.persons.filter(person => person.isDependant).length <= 0
						                            ? 'You haven\'t registered any dependants yet'
							                        : null }
		   			          ></ListItem>
		   					<ListItem key={ 'financials' }
		   					          onPress={ () => this.props.navigation.navigate('Financials') }
		   					          title={ <View flexDirection='row' justifyContent='space-between'>
		   								          <Text>Financial details</Text>
		   							          </View>}
						              subtitle={ !this.props.person.paymentMethods.length
							              ? 'You haven\'t given a payment method yet'
							              : null }
						    ></ListItem>
						</List>
					</ScrollView>
				</View>
			</View>
		);
	}
}

export default AccountScreen
