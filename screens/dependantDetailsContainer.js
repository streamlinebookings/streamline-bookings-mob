// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import DependantDetailsScreen from './dependantDetailsScreen';


const mapStateToProps = state => {
	console.log('dependantDetailsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('dependantDetailsMAPPINGDISPATCHTOPROPS');
	return {
		// setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
	};
}

const DependantDetailsContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(DependantDetailsScreen);

export default DependantDetailsContainer;
