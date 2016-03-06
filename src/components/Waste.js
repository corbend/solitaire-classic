
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

		stocks = this.props.items.map((c, index) => {
			
			let left = cnt > 0 ? (cnt - 1) * 0.2: 0;		
			let card;
			if (index == this.props.items.length - 1) {

				card = (<Card x={left} zIndex={Math.round(left * 100)} key={c.type} type={c.type} hide={false} 
					drag={true} drop={false}
					onDrop={this.onDrop.bind(this)} 
					onClickCard={() => this.onClickPile(c)}/>)
			} else {
				card = (<Card zIndex={Math.round(left * 100)} drop={false} x={left} key={c.type} type={c.type} hide={false} />)
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