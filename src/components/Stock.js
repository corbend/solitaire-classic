
import React from 'react';
import Card from './Card';
import Placeholder from './Placeholder';


export default class Stock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: props.items,
		}
	}
	onClickPile(card) {
		this.props.onClickStock(this.props, card);
	}
	repeat() {
		if (this.props.onRepeatStockClick) {
			this.props.onRepeatStockClick();
		}
	}
	render() {

		let items = this.props.items;//.filter((c) => this.state.reservedItems.indexOf(c) == -1);
		let noDrag = () => {return false};

		let stocks = items.map((c, index) => {		
			let cardKey = c.type + "#" + index;
			if (index == items.length - 1) {
				return (<Card checkDrag={noDrag} drop={false} key={cardKey} index={c.index} type={c.type} hide={true} onClickCard={(e) => {e.stopPropagation(); this.onClickPile(c)}}/>)
			} else {		
				return (<Card checkDrag={noDrag} drop={false} key={cardKey} index={c.index} type={c.type} hide={true} />)
			}
		
		});

		let emptyIcon = "empty";

		console.log("stock length", stocks.length);
		return (
			<div className="stock">
				<Placeholder type={emptyIcon} onClickPlaceholder={this.repeat.bind(this)}/>
				{stocks}
			</div>
		)
	}
}