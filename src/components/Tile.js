import React from 'react';


export default class Tile extends React.Component {
	onClickTile() {
		this.props.onClickRow(this.props.conf.idx, this.props.conf, "tile");
	}
	render() {
		let [left, top] = this.props.position;
		left = left  * this.props.size;
		top = top * this.props.size;
		return (
			<div onClick={this.onClickTile.bind(this)} className="tile" style={{position: 'absolute', top, left}}>
				<span>{this.props.conf.trace_id}</span>
			</div>
		)
	}
}