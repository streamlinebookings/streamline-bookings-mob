// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import PaymentMethodsScreen from './paymentMethodsScreen';


const mapStateToProps = state => {
	console.log('paymentMethodsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('paymentMethodsMAPPINGDISPATCHTOPROPS');
	return {
		setPaymentMethodChosen: paymentMethodChosen => dispatch(Action.setPaymentMethodChosen(paymentMethodChosen)),
	};
}

const PaymentMethodsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(PaymentMethodsScreen);

export default PaymentMethodsContainer;
