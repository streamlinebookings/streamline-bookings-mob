// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
import * as Action from '../common/actions';
import BookedScreen from './bookedScreen';


const mapStateToProps = state => {
	console.log('bookedcontainerMAPPINGSTATETOPROPS', state);
	return state;
}

const mapDispatchToProps = dispatch => {
	console.log('bookedMAPPINGDISPATCHTOPROPS');
	return {
		setClassChosen: classChosen => dispatch(Action.setClassChosen(classChosen)),
		// setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
	};
}

const BookedContainer = connect (
	mapStateToProps,
	mapDispatchToProps,
)(BookedScreen);

export default BookedContainer;
