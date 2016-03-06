
import React, {PropTypes} from 'react';

import Card from './Card';
import Placeholder from './Placeholder';


export default class Foundation extends React.Component {
	constructor() {
		super();
	}
	render() {
		//console.log("foundation", this.props.items);
		let placeholders = [1, 2, 3, 4].map((_, index) => {	

			let placeholderItems = this.props.items.filter((c) => c.finalPosition == _)
			//console.log("items to placeholder", _, placeholderItems);
			return (<Placeholder items={placeholderItems} key={index} type="base-foundation" x={index}/>)
		});

		return (
			<div className="foundation">
				{placeholders}
			</div>
		)
	}
}