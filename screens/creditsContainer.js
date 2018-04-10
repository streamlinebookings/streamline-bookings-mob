// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import CreditsScreen from './creditsScreen';


const mapStateToProps = state => {
	console.log('creditscontainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('creditsMAPPINGDISPATCHTOPROPS');
	return {
		setClassChosen: classChosen => dispatch(Action.setClassChosen(classChosen)),
		setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
	};
}

const CreditsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(CreditsScreen);

export default CreditsContainer;
