// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, List, ListItem } from 'react-native-elements';

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

		this.state = {
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
				        // backTo={ 'Book' }
				        title='Account'
				/>

				<View style={{ flex: 4 }}>
					<ScrollView>
						<List>
							{ this.state.isRegistering ?
			                    <ListItem key={ 'chooseVenue' }
			                              onPress={ () => { this.props.navigation.navigate('ChooseVenue') }}
			                              title={ <View flexDirection='row' justifyContent='space-between'>
			                                          <Text>Choose a swimming school</Text>
			                                      </View>}
							              disabled={ !this.state.isRegistering ? true : false }
			                      ></ListItem>
							: null }
		   					<ListItem key={ 'groupDetails' }
		   					          onPress={ () => { this.props.navigation.navigate('GroupDetails') }}
		   					          title={ <View flexDirection='row' justifyContent='space-between'>
		   								          <Text>Family or Group details</Text>
		   							          </View>}
		   			          ></ListItem>
		   					<ListItem key={ 'carers' }
		   					          onPress={ () => this.props.navigation.navigate('Carers') }
		   					          title={ <View flexDirection='row' justifyContent='space-between'>
		   								          <Text>Carers and adults</Text>
		   							          </View>}
		   			          ></ListItem>
		   					<ListItem key={ 'dependants' }
		   					          onPress={ () => this.handleNext('dependants') }
		   					          title={ <View flexDirection='row' justifyContent='space-between'>
		   								          <Text>Dependants and children</Text>
		   							          </View>}
		   			          ></ListItem>
		   					<ListItem key={ 'financials' }
		   					          onPress={ () => this.handleNext('financials') }
		   					          title={ <View flexDirection='row' justifyContent='space-between'>
		   								          <Text>Financial details</Text>
		   							          </View>}
		   			          ></ListItem>
						</List>
					</ScrollView>
				</View>
			</View>
		);
	}
}

export default AccountScreen
