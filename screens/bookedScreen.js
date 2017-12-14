// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { FormLabel, FormInput, FormValidationMessage, Button, ButtonGroup, CheckBox, Badge, Card } from 'react-native-elements';

let moment = require('moment');

// Our imports
// get env for imagesUrl


class BookedScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BOOKEDCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let persons = this.props.persons;
		let dependantSwimmers = [];
		if (persons && persons.length > 0) {
			dependantSwimmers = persons.filter(p => p.isDependant);  // && p.isSwimmer
		}

		this.state = {
			errorText: false,
			localDb: false,
			fullName: fullName,
			persons: persons,
			dependantsChosen: dependantSwimmers,
		}

		this.imagesUrl = 'https://streamlinebookings.com:9056/imgs/';

		// Bind local methods
		this.handleMenu = this.handleMenu.bind(this);
	}

	handleMenu () {
		this.props.navigation.navigate('DrawerOpen');
	}

	handleChooseDependant (person) {
		// let person = this.state.persons.find(p => p.id === personId)
		let found = this.state.dependantsChosen.find(p => p.id === person.id)

		let newChosen = this.state.dependantsChosen;
		if (!found) {
			newChosen.push(person)
		} else {
			newChosen = newChosen.filter(p => p.id !== person.id);
		}

		this.setState({
			dependantsChosen: newChosen
		});
	}

	handlePeriodTab (index) {
		console.log('PERIODTAB', index);
	}

	//
	// Rendering
	//

	/*
		NEXT
			current + hist tabs
			header as a component
			refactor to container/component ?
	*/
	render() {

		const ChooseDependants = () => {

			console.log('creating dependants', this.state);

			if (this.state.persons.length <= 1) return;

			const dependants = this.state.persons.map(person => {

				// if (!person.isSwimmer || !person.isDependant) return; // reinsatte after booking is poossible
				if (!person.isDependant) return;

				return (
					<CheckBox
						key={ person.id }
						title={ person.firstName }
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						containerStyle={{width: '32%'}}
						checked={ this.state.dependantsChosen.find(p => p.id === person.id) ? true : false }
						onPress={ () => this.handleChooseDependant(person) }
					/>
				);
			});

			return (
				<View flexDirection='row' justifyContent='left'>
					{ dependants }
				</View>
			);
		}

		const PeriodTabs = () => {

			return (
				<ButtonGroup
					buttons={ ['Upcoming', 'Past'] }
					containerStyle={{ backgroundColor: 'transparent', borderBottomColor: 'blue' }}
					onPress={ this.handlePeriodTab }
					selectedIndex={ 0 }
				/>
			)

		}

		const BookedClasses = () => {

			console.log('creating cards', this.state);

			return this.state.persons.map(person => {

				if (!person.isSwimmer) return;

				if (!this.state.dependantsChosen.find(p => p.id === person.id)) return;

console.log('card for ', person);
				return (
					<Card key={ person.id }>
						<View flexDirection='row' justifyContent='space-between'>
							<Text>{ moment(person.class.datetime).format('dddd Do MMMM, h:mma') }</Text>
							<Text>{ person.class.levelName }</Text>
						</View>
						<View flexDirection='row' justifyContent='space-between'>
							<Text>{ person.firstName }</Text>
							<Text>{ person.class.cancelled ? 'CANCELLED' : '' }</Text>
							<Text>{ person.class.recurring ? 'Recurring' : 'Not recurring' }</Text>
						</View>
					</Card>
				)
			});
		}

		return (
			<View style={{ flex: 1 }}>

				{/* Header image */}
				<View style={{
					flex: 1,
				}}>
					<Image
						style={{
							flex: 1,
							resizeMode: 'cover',
							opacity: 0.5,
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
						}}
						source={{ uri: this.imagesUrl + 'mob/backgrounds/background-booked.jpg' }}/>

					<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-end' }}>
						<Button
							icon={{ name: 'bars', type: 'font-awesome' }}
							style={{ }}
							backgroundColor='transparent'
							onPress={ this.handleMenu }
							 />
						<Badge value={ this.state.fullName } containerStyle={{ backgroundColor: 'orange', marginBottom: 10, marginRight: 10 }}/>
					</View>
				</View>

				{/* Booked classes cards */}
				<View style={{ flex: 4 }}>
					{ ChooseDependants() }
					{ PeriodTabs() }
					{ BookedClasses() }
				</View>

			</View>
		);
	}
}

const mapStateToProps = (state, p2) => {
	console.log('BOOKEDMAPPINGSTATETOPROPS', state, p2);
	return {
		group: state.group,
		person: state.person,
		persons: state.persons,
	};
}

BookedScreen = connect (
	mapStateToProps
)(BookedScreen)

export default BookedScreen
