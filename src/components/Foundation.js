
import React, {PropTypes} from 'react';

import Card from './Card';
import Placeholder from './Placeholder';


export default class Foundation extends React.Component {
	constructor() {
		super();
	}
	render() {
		let placeholdersCnt = 4;
		let placeholders = [1, 2, 3, 4];
		if (this.props.placeholders) {
			placeholdersCnt = this.props.placeholders;
			placeholders = [];
			for (let i = 0; i < placeholdersCnt; i++) {
				placeholders.push(i);
			}
		}

		placeholders = placeholders.map((_, index) => {	

			let placeholderItems = this.props.items.filter((c) => c.finalPosition == _)
			//console.log("items to placeholder", _, placeholderItems);
			return (<Placeholder items={placeholderItems} key={index} type="foundation" x={index}/>)
		});

		let style = {
			right: (placeholdersCnt/2) * (99 + 20) + 20
		}

		return (
			<div className="foundation" style={style}>
				{placeholders}
			</div>
		)
	}
}