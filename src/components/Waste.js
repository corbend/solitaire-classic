
import React from 'react';
import Card from './Card';

export default class Waste extends React.Component {
	constructor(props) {
		super(props);
		this.selectBy = 3;

		this.state = {
			items: props.items,
			selectedPile: null
		}
	}
	onDrop(card, position, dropTarget) {
		this.props.onDrop(card, position, dropTarget, "waste");
	}
	render() {		

		let stocks = [];
		let cnt = 1;
		let noCheck = () => {return true};
		let noDrag = () => {return false};

		stocks = this.props.items.map((c, index) => {
			
			let left = cnt > 0 ? (cnt - 1) * 0.2: 0;		
			let card;
			let cardKey = c.type + "#" + index;

			if (index == this.props.items.length - 1) {

				card = (
					<Card checkDrag={noCheck} x={left} zIndex={Math.round(left * 100)} key={cardKey} type={c.type} hide={false} 
						drag={true} drop={false} index={c.index}
						onDrop={this.onDrop.bind(this)} 
						onClickCard={() => this.onClickPile(c)}/>)
			} else {
				card = (
					<Card checkDrag={noDrag} zIndex={Math.round(left * 100)} 
						index={c.index} 
						drop={false} x={left} key={cardKey} type={c.type} hide={false} />)				
			}

			if ((this.props.items.length - index) <= 3) {
				cnt++;
			}

			return card;
		});

		return (
			<div className="waste">
				{stocks}
			</div>
		)
	}
}