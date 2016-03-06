import React, {PropTypes} from 'react';
import { DropTarget } from 'react-dnd';
import Card from './Card';


const dropFoundationTarget = {
  drop(target) {
  	//console.log("drop to", arguments);
    return { 
    	name: target.type == "base-tableau" ? "tableau" : 'foundation', 
    	target: {type: 'placeholder'}, 
    	position: target.x};
  }
};

@DropTarget('card', dropFoundationTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class Placeholder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: []
		}
	}
	render() {		

		const { canDrop, isOver, connectDropTarget } = this.props;

		let cls = `placeholder ${this.props.type}`;
		let style = {			
			top: (this.props.y * 30) + "px",
			left: 20 + (this.props.x * (99 + 20)) + "px"
		}

		let cards = this.props.items && this.props.items.map((c) => {
			return (
				<Card key={c.type} type={c.type} />
			)
		}) || [];

		return connectDropTarget(
			<div style={style} className={cls} onClick={this.props.onClickPlaceholder}>
				{cards}
			</div>
		)
	}
}