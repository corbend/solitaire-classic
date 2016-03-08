
import React from 'react';
import Card from './Card';
import Placeholder from './Placeholder';

export default class FreeCell extends React.Component {
	constructor() {
		super();
	}
	onDrop(card, position, dropTarget) {

		let child = card.child;

		if (!child) {
			this.props.onDrop(card, position, dropTarget, "freecell");
		}
	}
	render() {

		let placeholders = [1, 2, 3, 4].map((_, index) => {
			let placeholderItems = [];

			if (this.props.items.filter((c) => c.x == index).length > 0) {
				placeholderItems.push(this.props.items.filter((c) => c.x == index)[0]);
			}
		
			return (<Placeholder onDrop={this.onDrop.bind(this)} draggable={true} items={placeholderItems} key={index} type="freecell" x={index}/>)
		});

		return (
			<div className="free-cell-place">
				{placeholders}
			</div>
		)
	}
}