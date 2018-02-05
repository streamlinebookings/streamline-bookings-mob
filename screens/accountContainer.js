// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import AccountScreen from './accountScreen';


const mapStateToProps = state => {
	console.log('accountContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('accountMAPPINGDISPATCHTOPROPS');
	return {
		// setClassChosen: classChosen => dispatch(Action.setClassChosen(classChosen)),
		// setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
	};
}

const AccountContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(AccountScreen);

export default AccountContainer;
