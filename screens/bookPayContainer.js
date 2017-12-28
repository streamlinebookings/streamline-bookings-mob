// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import BookPayScreen from './bookPayScreen';


const mapStateToProps = state => {
	console.log('bookPaycontainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('bookPayMAPPINGDISPATCHTOPROPS');
	return {
		setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
		setPersons: persons => dispatch(Action.setPersons(persons)),
		setPrices: prices => dispatch(Action.setPrices(prices)),
	};
}

const BookPayContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(BookPayScreen);

export default BookPayContainer;
