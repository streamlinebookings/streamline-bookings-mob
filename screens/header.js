// Third party imports
import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { Button, Badge } from 'react-native-elements';

// Our imports
import { env } from '../environment';


export class Header extends React.Component {

	constructor(props) {
		super(props);

		console.log('HEADERCONSTRUCTOR', props);

		this.state = {
			backTo: props.backTo,
			fullName: props.fullName,
			headerTitle: props.title,
			image: props.image,
			noMenu: props.noMenu || false,
		}

		// Bind local methods
		this.handleMenu = this.handleMenu.bind(this);
		this.handleGoBack = this.handleGoBack.bind(this);
	}

	handleGoBack () {
		if (this.state.backTo) {
			this.props.navigation.navigate(this.state.backTo);
		} else {
			this.props.navigation.goBack();
		}
	}

	handleMenu () {
		this.props.navigation.navigate('DrawerOpen');
	}

	//
	// Rendering
	//
	render() {

		return (

			<View style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-end' }}>
				<Image
					style={{
						flex: 1,
						resizeMode: 'cover',
						opacity: 0.5,
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
					}}
					source={{ uri: env.imagesUrl + this.state.image }}/>

				<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
					<Text style={{ fontWeight: 'bold', marginRight: 10 }}>{ this.state.headerTitle }</Text>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
					<View style={{ flexDirection: 'row', width: 100, justifyContent: 'flex-start', paddingLeft: 10 }}>
						<Button
							icon={{name: 'arrow-left', type: 'font-awesome', color: 'green' }}
							backgroundColor='transparent'
							onPress={ this.handleGoBack }
						/>
						{ !this.state.noMenu ?
							<Button
								icon={{ name: 'bars', type: 'font-awesome', color: 'green' }}
								backgroundColor='transparent'
								onPress={ this.handleMenu }
							 />
						: null }
					</View>
					<Badge value={ this.state.fullName } containerStyle={{ backgroundColor: 'orange', marginBottom: 10, marginRight: 10 }}/>
				</View>
			</View>
		);
	}
}
