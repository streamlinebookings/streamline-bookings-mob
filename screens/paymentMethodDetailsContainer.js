// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import PaymentMethodDetailsScreen from './paymentMethodDetailsScreen';


const mapStateToProps = state => {
	console.log('paymentMethodDetailsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('paymentMethodDetailsMAPPINGDISPATCHTOPROPS');
	return {
		setPerson: person => dispatch(Action.setPerson(person)),
		setPersons: persons => dispatch(Action.setPersons(persons)),
	};
}

const PaymentMethodDetailsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(PaymentMethodDetailsScreen);

export default PaymentMethodDetailsContainer;
