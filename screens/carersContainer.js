// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import CarersScreen from './carersScreen';


const mapStateToProps = state => {
	console.log('carersContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('carersMAPPINGDISPATCHTOPROPS');
	return {
		setCarerChosen: carer => dispatch(Action.setCarerChosen(carer)),
	};
}

const CarersContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(CarersScreen);

export default CarersContainer;
