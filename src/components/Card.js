
import React, {PropTypes} from 'react';
import consts from './consts'
import { DragSource } from 'react-dnd';
import CardGroup from './CardGroup';

const cardSource = {

  canDrag(props) {
	return props.checkDrag(props);
  },
  beginDrag(props) {
    return !props.final && props;
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
	    console.log("drop", item, props, dropResult);
	    if (props.onDrop) {
	    	return props.onDrop(item, dropResult.position, dropResult);
	    }
    }
  }
};	

@DragSource('card', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card extends React.Component {
	static propTypes = {
    	// Injected by React DnD:
    	connectDragSource: PropTypes.func.isRequired,
    	isDragging: PropTypes.bool.isRequired
    	//type: PropTypes.string.isRequired
  	};
	constructor() {
		super();
	}
	render() {		
		const { isDragging, connectDragSource } = this.props;
		let isHide = this.props.hide;
		let cardImage = isHide ? 'back.png': this.props.type + ".png";

		let siblings = [];

		let draggable = this.props.drop;
		let canDrag = true;

		if (isDragging && this.props.drag) {
			let child = this.props.child;
			while (child) {
				siblings.push(child);
				child = child.child;				
			}
		}
		
		let style = {
			position: 'absolute',
			top: (this.props.y * 30) + "px",
			left: (this.props.x * (99 + 20)) + "px",
			//opacity: (isDragging && canDrag) ? 0.5 : 1,
			zIndex: this.props.zIndex
		}

		if (canDrag) {
			return connectDragSource(
				<div className="cards-holder" style={style} onClick={this.props.onClickCard}>			
					<CardGroup drop={this.props.drop} isDragging={isDragging} style={style} top={this.props} items={siblings}/>
				</div>
			)
		} else {
			return (
				<div className="cards-holder" style={style} onClick={this.props.onClickCard}>			
					<CardGroup style={style} top={this.props} items={[]}/>
				</div>
			)
		}
	}
}