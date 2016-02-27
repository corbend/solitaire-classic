
import React from 'react';


export default class Scores extends React.Component {
	render() {		
		
		return (
			<div className="scores">
				<span>{this.props.value}</span>
			</div>
		)
	}
}