// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button, ButtonGroup, CheckBox, Badge, Card, List, ListItem } from 'react-native-elements';

let moment = require('moment');

// Our imports
import { env } from '../environment';
import { Header } from './header';


class BookDetailsScreen extends React.Component {

	constructor(props) {
		super(props);
		console.log('BOOKDETAILSCONSTRUCTOR', props);

		let fullName = props.person && props.person.firstName + ' ' + props.person.lastName || 'Not logged in';

		let persons = props.persons;

		let dependantSwimmers = [];
		if (persons && persons.length > 0) {
			dependantSwimmers = persons.filter(p => p.isSwimmer);
		}

		this.state = {
			classChosen: props.classChosen,
			dependantChosen: props.dependantsChosen[0],
			fullName: fullName,
			group: props.group,
			localDb: props.localDb,
			persons: persons,
			token: props.token,
			waitingListButtonText: 'Join wait list',
		};

		// Bind local methods
		this.handleBook = this.handleBook.bind(this);
		this.handleWaitingList = this.handleWaitingList.bind(this);
	}

	handleBook (oneOrTerm) {
		console.log('HANDLEBOOK1ORTERM', oneOrTerm, this.state);

		let restOfTermPrice = this.state.classChosen.term.termRate;

		// Navigate to pay screen:
		this.props.navigation.navigate('BookPay', {
			amount: oneOrTerm === 1 ? this.state.classChosen.term.singleRate : restOfTermPrice,
			oneOrTerm: oneOrTerm,
		});
	}

	handleWaitingList () {
		console.log('HANDLEWaitingList', this.state);



		////////////////////////
		// notify user: payment will be executed
		// add flag in be
		// conffrm the waiting join
		// unjoin btn




		// Notify back end
		let beApiUrl = this.state.localDb ? env.localApiUrl : env.beApiUrl;
		fetch(beApiUrl + 'calendar/joinwait', {
			method: 'put',
			body: JSON.stringify({
				class: this.state.classChosen,

				// Removing the classes from the chosen dependant. This avoids a circular JSON structure
				swimmer: Object.assign({}, this.state.dependantChosen, {classes: []}),

				token: this.state.token,
			})
		})
			.then(response => {
				console.log('JOINWAITFETCHRAWRESPONSE', response);
				if (response.status == 200) return response.json();
				return response;
			})
			.then(response => {
				console.log('JOINWAITREPONSE', response);

				let text = response.queueLength ? response.queueLength.toString() + 'p waiting' : 'On wait list'
				this.setState({
					waitingListButtonText: text,
				});
			})
			.catch(err => {
				console.log('JOINWAITERROR', err);
				this.setState({
					waitingListButtonText: 'ERROR!',
				});
			});

		// Change button text
		this.setState({
			waitingListButtonText: 'Joining...'
		});
	}

	//
	// Rendering
	//
	render() {

		const exceptions = () => {
			return this.state.classChosen.recurring
				? <ListItem
						title={ 'Exceptions' }
						hideChevron={true}
				  />
				: null;
		}

		const priceInfo = () => {
			return this.state.classChosen.recurring
				? <ListItem
					leftIcon={{ name: 'usd', type: 'font-awesome' }}
					title={ 'Price single and to endOfTerm'}
					hideChevron={ true }
				/>
				: <ListItem
					leftIcon={{ name: 'usd', type: 'font-awesome' }}
					title={ formatPrice(this.state.classChosen.term.singleRate)}
					hideChevron={ true }
				/>
		}

		const formatPrice = price => {
			return '$ ' + (price / 100).toFixed(2);
		}

		const buttons = () => {
			return (
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
					{ !this.state.classChosen.alreadyBooked && !this.state.classChosen.isFull ?
						<Button
							icon={{name: 'tag', type: 'font-awesome'}}
							backgroundColor='green'
							title='Book 1 lesson'
							onPress={() => this.handleBook(1)}
						/>
						: null
					}
					{ this.state.classChosen.recurring ?
						<Button
							icon={{name: 'tags', type: 'font-awesome'}}
							backgroundColor='green'
							title='Book all term'
							onPress={ () => this.handleBook('term') }
						/>
						: null
					}
				</View>
			)
		}

		let childNameStatus = this.state.dependantChosen.firstName;
		if (this.state.classChosen.alreadyBooked) {
			childNameStatus += ' is already booked into this class';
		} else if (this.state.classChosen.isFull) {
			childNameStatus = 'Sorry, ' + this.state.dependantChosen.firstName + ', this class is full';
		}

		return (

			<View style={{ flex: 1 }}>

				<Header fullName={ this.state.fullName }
				        image={ 'mob/backgrounds/background-book.jpg' }
				        navigation={ this.props.navigation }
				        backTo={ 'Book' }
				        title='Book a Class - Details'
				/>

				{/* Book classes cards */}
				<View style={{ flex: 5 }}>

					<View style={{ flex: 4 }}>
						<ScrollView>
						<List>
							<ListItem
								leftIcon={{ name: 'child', type: 'font-awesome' }}
								title={
									<View style={{ flex: 1 }} flexDirection='row' justifyContent='space-between' alignItems='center'>
										<Text>{ childNameStatus }</Text>
										{ this.state.classChosen.isFull && !this.state.classChosen.alreadyBooked && !this.state.classChosen.onWaitingList ?
											<Button
												icon={{ name: 'hourglass', type: 'font-awesome' }}
												backgroundColor='green'
												title={ this.state.waitingListButtonText }
												onPress={ this.handleWaitingList }
												buttonStyle={{ width: 130, borderRadius: 5 }}
											/>
										: null }
									</View>
								}
								subtitle={
									this.state.classChosen.onWaitingList ?
										this.state.dependantChosen.firstName + ' is on the waiting list (' + this.state.classChosen.waiters.length.toString() + ' persons)'
										: null
								}
								hideChevron={ true }
							/>
							<ListItem
								leftIcon={{ name: 'bar-chart', type: 'font-awesome' }}
								title={ this.state.classChosen.level.name }
								hideChevron={ true }
							/>
							<ListItem
								leftIcon={{ name: 'calendar', type: 'font-awesome' }}
								title={
									this.state.classChosen.recurring
										? moment(this.state.classChosen.datetime).format('dddd h:mma')
										: moment(this.state.classChosen.datetime).format('dddd Do MMMM h:mma')
								}
								subtitle={ this.state.classChosen.duration ? this.state.classChosen.duration + ' minutes' : null }
								hideChevron={ true }
							/>
							<ListItem
								leftIcon={{ name: 'repeat', type: 'font-awesome' }}
								title={ this.state.classChosen.recurring ? 'Recurring' : 'Single lesson' }
								hideChevron={ true }
							/>
							{ exceptions() }
							{ priceInfo() }
							<ListItem
								leftIcon={{ name: 'sort-numeric-asc', type: 'font-awesome' }}
								title={
									!this.state.classChosen.countBooked
										? this.state.classChosen.cap + ' Places available'
										: this.state.classChosen.cap
											? Math.max(0, this.state.classChosen.cap - this.state.classChosen.countBooked) + ' places left (max ' + this.state.classChosen.cap + ' swimmers)'
											: this.state.classChosen.countBooked + ' other swimmers'
								}
								hideChevron={ true }
							/>
							<ListItem
								leftIcon={{ name: 'male', type: 'font-awesome' }}
								title={ this.state.classChosen.instructor.displayName || '' }
								subtitle={ this.state.classChosen.instructor.displayName
											? this.state.classChosen.instructor.firstName + ' ' + this.state.classChosen.instructor.lastName
											: '' }
								hideChevron={ true }
							/>
							<ListItem
								leftIcon={{ name: 'columns', type: 'font-awesome' }}
								title={ 'Lane ' + this.state.classChosen.laneId }
								hideChevron={ true }
							/>
						</List>
						</ScrollView>
					</View>

					{ buttons() }
				</View>
			</View>
		);
	}
}

export default BookDetailsScreen;
