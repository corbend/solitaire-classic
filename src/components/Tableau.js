
import React from 'react';
import Card from './Card';
import Placeholder from './Placeholder';

export default class Tableau extends React.Component {
	constructor() {
		super();
		this.state = {
			columns: []
		}
	}
	onDrop(card, position, dropTarget) {
		this.props.onDrop(card, position, dropTarget, "tableau");
	}
	render() {		
		
		let columns = 7;
		let columnCounter = 1;
		let stocks = [];
		let total = 0;

		this.props.items.forEach((c, index) => {
			let hide = c.hide;
			let draggable = !hide && !c.final && !c.blocked;
			let isLeaf = true;
			this.props.items.forEach((ch) => {	
				if (c.x == ch.x && ch.y > c.y) {
					isLeaf = false;
				}
			});

			stocks.push((
				<Card drop={draggable} zIndex={c.y} key={c.type} leaf={isLeaf} drag={draggable} 
					child={c.child}
					type={c.type} hide={c.hide} 
					x={c.x} y={c.y} 
					onDrop={this.onDrop.bind(this)}/>
			))
		})			

		let placeholders = [1, 2, 3, 4, 5, 6, 7].map((_, index) => {
			let placeholderItems = [];
			return (<Placeholder items={placeholderItems} key={index} type="base-tableau" x={index}/>)
		});

		return (
			<div className="tableau">
				{placeholders}
				{stocks}
			</div>
		)
	}
}