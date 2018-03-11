// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import FinancialDetailsScreen from './financialDetailsScreen';


const mapStateToProps = state => {
	console.log('financialDetailsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('financialDetailsMAPPINGDISPATCHTOPROPS');
	return {
		setPerson: person => dispatch(Action.setPerson(person)),
		setPersons: persons => dispatch(Action.setPersons(persons)),
	};
}

const FinancialDetailsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(FinancialDetailsScreen);

export default FinancialDetailsContainer;
