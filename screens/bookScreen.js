// Third party imports
import React from 'react';
import { Alert, StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button, ButtonGroup, CheckBox, Badge, Icon, List, ListItem } from 'react-native-elements';

let moment = require('moment');

// Our imports
import { env } from '../environment';
import { Header } from './header';
import { BookDetailsScreen } from './bookDetailsScreen';


class BookScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BOOKCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let persons = props.persons;
		let dependantSwimmers = [];
		if (persons && persons.length > 0) {
			dependantSwimmers = persons.filter(p => p.isSwimmer);
		}

		this.state = {
			classes: [],
			dependantChosen: props.dependantsChosen && props.dependantsChosen.length > 0 ? props.dependantsChosen[0] : dependantSwimmers[0],
			errorText: false,
			fullName: fullName,
			group: props.group,
			localDb: props.localDb,
			persons: persons,
			token: props.token,
		};

		this.colorPool = ['lightpink', 'lightseagreen', 'lightyellow', 'lightcyan', 'lightblue', 'orange', 'lightgreen', 'lightgrey', 'yellow', 'aqua', 'lightsteelblue'];
	}

	componentDidMount(props) {
		// Update the cards
		this.handleChooseDependant(this.state.dependantChosen);
	}

	handleChooseDependant (person) {

		if (!person) return;

		this.setState({
			dependantChosen: person
		});

		// Update the redux store with the chosen dependant + reset the classes
		this.props.setDependantsChosen([ person ]);
		this.setState({ classes: [] });

		if (!person.atLevels || person.atLevels.length == 0) return;

		// Find classes for the level of this person
		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;

		fetch(beApiUrl + 'calendar/classes', {
			method: 'post',
			body: JSON.stringify({
				levelId: person.atLevels[0].id,
				token: this.state.token,
			})
		})
			.then(response => {
				console.log('CLASSESFETCHRAWRESPONSE', response);
				if (response.status == 200) return response.json();
				return response;
			})
			.then(response => {
				console.log('CLASSESRESPONSE', response);

				// Discover which classes are already booked, and, discover if the swimmer is on a waiting list for this class
				let classes = response.classes.map(oneClass => {
					oneClass.alreadyBooked = this.state.dependantChosen.classes.findIndex(c => c.id === oneClass.id) > -1 ? true : false;

					let placeInList = oneClass.waiters.findIndex(c => c.id === this.state.dependantChosen.id);
					oneClass.onWaitingList = placeInList > -1 ? true : false;
					oneClass.placeInWaitingList = placeInList + 1;

					return oneClass;
				});

				if (response.classes) {
					this.setState({ classes: classes });

					// Update the redux store with the dependant's level's classes
					this.props.setDependantsClasses(classes);
				}
			})
			.catch(err => {
				console.log('CLASSESERROR', err);
				Alert.alert('Error while fetching classes: ' + err);
			});

	}

	handleBook (oneClass) {
		console.log('HANDLEBOOKACLASS', oneClass);

		// Repeating classes: find the number of remaining lessons in the series (to calculate restOfTerm price)
		if (oneClass.repeatId) {

			let series = this.state.classes.filter(c => c.repeatId === oneClass.repeatId);

			// series.sort((a, b) => {
			// 	// a.datetime.localeCompare(b.datetime);
			// 	return a < b ? 1 : -1
			// });

			let place = false;
			series.forEach((c, index) => {
				if (moment(c.datetime).isSame(oneClass.datetime, 'minute')) {
					place = index;
				}
			});
			if (place === false) {
				Alert.alert('Can\'t find this class in the series of repeated classes. PLease contact us');
				return;
			}

			oneClass.remainingLessons = series.length - place;
			oneClass.totalLessons = series.length;
		}

		// Update the redux store with the chosen class
		this.props.setClassChosen(oneClass);

		// Go to next screen
		this.props.navigation.navigate('BookDetails');
	}

	//
	// Rendering
	//
	render() {

		const ChooseDependants = () => {

			console.log('creating dependants', this.state);

			if (!this.state.persons || this.state.persons.length <= 1) return;

			const dependants = this.state.persons.map(person => {

				if (!person.isSwimmer) return;

				return (
					<CheckBox
						key={ person.id }
						title={ person.firstName }
						iconType='font-awesome'
						checkedIcon='check'
						checkedColor='red'
						containerStyle={{ width: (this.state.persons.length <= 5 ? '32%' : '20%') }}
						checked={ this.state.dependantChosen.id === person.id ? true : false }
						onPress={ () => this.handleChooseDependant(person) }
					/>
				);
			});

			return (
				<View flexDirection='row' justifyContent='flex-start'>
					<ScrollView horizontal={ true }>
						{ dependants }
					</ScrollView>
				</View>
			);
		}

		const BookClasses = () => {

			console.log('creating list of classes', this.state);

			if (!this.state.classes) return;

			let colorPerRepeatingClass = {};

			return (

				<List>

					{ this.state.classes.map((oneClass, classIndex) => {

						// Define the text style
						let textStyle;
						if (oneClass.alreadyBooked || oneClass.isFull) textStyle = localStyles.greyedText;

						// Define background color of repeating class
						let repeatedClassStyle;
						let color;
						if (!colorPerRepeatingClass[oneClass.repeatId]) {
							color = this.colorPool[classIndex % this.colorPool.length];
							colorPerRepeatingClass[oneClass.repeatId] = color;
						} else {
							color = colorPerRepeatingClass[oneClass.repeatId];
						}

						// Define an icon
						let statusIcon = null;
						if (oneClass.isFull) statusIcon = ( <Icon name='times' type='font-awesome' color='grey' size={ 12 }/> );
						if (oneClass.alreadyBooked) statusIcon = ( <Icon name='thumbs-up' type='font-awesome' color='grey' size={ 12 }/> );
						if (oneClass.onWaitingList) statusIcon = ( <Icon name='hourglass' type='font-awesome' color='grey' size={ 12 }/> );

						// Define the instructors
						let instructors = oneClass.instructors.map(inst => inst.displayName).join(',');

						return (
							<ListItem key={ oneClass.id }
							          onPress={ () => this.handleBook(oneClass) }
							          title={
							          	<View flexDirection='row'>
											<View style={{ flex: 1, justifyContent: 'space-around' }}>
												{ statusIcon }
											</View>
											<View style={{ flex: 11 }}>
												<View flexDirection='row' justifyContent='space-between'>
													<Text style={ textStyle }>{ moment(oneClass.datetime).format('dddd Do MMMM, h:mma') }</Text>
													<Text style={ textStyle }>{ oneClass.level.name || ''}</Text>
												</View>
												<View flexDirection='row' justifyContent='space-between'>
													<Text style={ oneClass.repeatId ? [repeatedClassStyle, {backgroundColor: color}] : textStyle }>{
														(oneClass.repeatId ? oneClass.repeatShortDescription  : 'Single class')}
													</Text>
													<Text style={ textStyle }>{ (instructors || '') + ' lane ' + oneClass.laneId}</Text>
												</View>
												<View flexDirection='row' justifyContent='space-between'>
													<Text style={ textStyle }>{ oneClass.duration ? oneClass.duration + ' minutes' : '' }</Text>
													<Text style={ textStyle }>{
														!oneClass.countBooked
															? oneClass.cap + ' Places available'
															: oneClass.cap
																? Math.max(0, oneClass.cap - oneClass.countBooked) + ' available (max ' + oneClass.cap + ')'
																: oneClass.countBooked + ' other swimmers'
													}</Text>
												</View>
											</View>
							            </View>
							          }
							></ListItem>
						)
					})}

				</List>
			)
		}

		return (
			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        // image={ 'mob/backgrounds/background-book.jpg' }
				        image={ 'mob/backgrounds/background-book.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Home' }
				        title='Book a Class'
				/>

				{/* Book classes cards */}
				<View style={{ flex: 4 }}>

						{ ChooseDependants() }

					<ScrollView>
						{ BookClasses() }
					</ScrollView>

				</View>

			</View>
		);
	}
}

localStyles = {
	greyedText: { color:  'grey' },
	repeatedClass: { backgroundColor: 'yellow' },
};

export default BookScreen;
