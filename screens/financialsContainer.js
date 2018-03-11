// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import FinancialsScreen from './financialsScreen';


const mapStateToProps = state => {
	console.log('financialsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('financialsMAPPINGDISPATCHTOPROPS');
	return {
		setPaymentMethodChosen: paymentMethodChosen => dispatch(Action.setPaymentMethodChosen(paymentMethodChosen)),
	};
}

const FinancialsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(FinancialsScreen);

export default FinancialsContainer;
