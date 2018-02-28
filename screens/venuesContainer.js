// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import VenuesScreen from './venuesScreen';


const mapStateToProps = state => {
	console.log('venuesContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('venuesMAPPINGDISPATCHTOPROPS');
	return {
		setGroup: group => dispatch(Action.setGroup(group)),
		setPerson: person => dispatch(Action.setPerson(person)),
		setPersons: persons => dispatch(Action.setPersons(persons)),
		setToken: token => dispatch(Action.setToken(token)),
		setVenueChosen: venue => dispatch(Action.setVenueChosen(venue)),
	};
}

const VenuesContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(VenuesScreen);

export default VenuesContainer;
