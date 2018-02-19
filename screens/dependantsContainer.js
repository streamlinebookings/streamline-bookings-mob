// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import DependantsScreen from './dependantsScreen';


const mapStateToProps = state => {
	console.log('dependantsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('dependantsMAPPINGDISPATCHTOPROPS');
	return {
		setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
	};
}

const DependantsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(DependantsScreen);

export default DependantsContainer;
