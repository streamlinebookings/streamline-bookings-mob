// Third party imports
import React from 'react';
import { connect } from 'react-redux';

// Our imports
// import * as Action from '../common/actions';
import BookedClassActionsScreen from './bookedClassActionsScreen';


const mapStateToProps = state => {
	console.log('bookedClassActionsContainerMAPPINGSTATETOPROPS', state);
	return state;
}

// const mapDispatchToProps = dispatch => {
// 	console.log('bookDetailsMAPPINGDISPATCHTOPROPS');
// 	return {
// 		setClassChosen: classChosen => dispatch(Action.setClassChosen(classChosen)),
// 		setDependantsChosen: dependants => dispatch(Action.setDependantsChosen(dependants)),
// 	};
// }

const BookedClassActionsContainer = connect (
	mapStateToProps,
	// mapDispatchToProps,
)(BookedClassActionsScreen);

export default BookedClassActionsContainer;
