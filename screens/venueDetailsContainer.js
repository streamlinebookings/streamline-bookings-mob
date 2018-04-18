// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import VenueDetailsScreen from './venueDetailsScreen';


const mapStateToProps = state => {
	console.log('venueDetailscontainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('venueDetailsMAPPINGDISPATCHTOPROPS');
	return {
		// setClassChosen: classChosen => dispatch(Action.setClassChosen(classChosen)),
		// setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
	};
}

const VenueDetailsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(VenueDetailsScreen);

export default VenueDetailsContainer;
