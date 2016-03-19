
import React, {PropTypes} from 'react';
import { DropTarget } from 'react-dnd';

import Card from './Card';

const dropTarget = {
  drop(target, props) {
    return props.canDrop && { name: 'tableau', target: target};
  },
  canDrop(props) {
  	return props.drop;
  }
};

@DropTarget('card', dropTarget, (connect, monitor) => 
	{
		return {
  			connectDropTarget: connect.dropTarget(),
  			isOver: monitor.isOver(),
  			canDrop: monitor.canDrop()
		}
	}
)
export default class CardGroup extends React.Component {
	render() {

		const { canDrop, isOver, connectDropTarget } = this.props;

		let cards = this.props.items.map((card, index) => {
			//console.log("card group", card);
			let cardStyle = {
			 	top: (card.y * 30) + "px"
			}
			let cardKey = card.type + "#" + index;
			return (
				<Card style={cardStyle} key={cardKey} type={card.type} />
			)
		});

		let topCard = this.props.top;		
		let isHide = topCard.hide;
		let cardImage = isHide ? 'back.png': topCard.type + ".png";

		let topCardStyle = {
			backgroundImage: ("url(/img/" + cardImage + ')'),
			//opacity: this.props.isDragging ? 0.5 : 1,
			zIndex: this.props.style.zIndex
		}

		if (canDrop) {
			return connectDropTarget(
				<div className="card-group">
					<div className="card" style={topCardStyle} onClick={this.props.onClickCard}></div>
					{cards}
				</div>
			)
		} else {
			return (
				<div className="card-group">
					<div className="card" style={topCardStyle} onClick={this.props.onClickCard}></div>
					{cards}
				</div>
			)
		}
	}
}