// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import CarerDetailsScreen from './carerDetailsScreen';


const mapStateToProps = state => {
	console.log('carerDetailsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('carerDetailsMAPPINGDISPATCHTOPROPS');
	return {
		setCarerChosen: carer => dispatch(Action.setCarerChosen(carer)),
		setPersons: persons => dispatch(Action.setPersons(persons)),

	};
}

const CarerDetailsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(CarerDetailsScreen);

export default CarerDetailsContainer;
