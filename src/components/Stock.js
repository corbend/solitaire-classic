
import React from 'react';
import Card from './Card';
import Placeholder from './Placeholder';


export default class Stock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//selectedPile: [],
			items: props.items,
			//reservedItems: []
		}
	}
	onClickPile(card) {

		let selectedPile = [];
		//let reservedItems = this.state.reservedItems;
		let stockItems = this.props.items;//.filter((i) => this.state.reservedItems.indexOf(i) == -1);
		for (let n = 0; n < 3; n++) {

			if (stockItems.length) {
				let c = stockItems.pop();
				selectedPile.push(c);
				//reservedItems.push(c);
			}
		}

		let state = {			
			//selectedPile,
			stockItems
		}

		this.setState(state);
		//console.log("add waste", selectedPile);
		this.props.onClickStock(selectedPile);

	}
	repeat() {			
		this.props.onRepeatStockClick();
	}
	render() {

		let items = this.props.items;//.filter((c) => this.state.reservedItems.indexOf(c) == -1);

		let stocks = items.map((c, index) => {		
			if (index == items.length - 1) {
				return (<Card drop={false} key={c.type} type={c.type} hide={true} onClickCard={(e) => {e.stopPropagation(); this.onClickPile(c)}}/>)
			} else {		
				return (<Card drop={false} key={c.type} type={c.type} hide={true} />)
			}
		
		});

		return (
			<div className="stock">
				<Placeholder type="empty" onClickPlaceholder={this.repeat.bind(this)}/>
				{stocks}
			</div>
		)
	}
}