import React from 'react';


export default class Ball extends React.Component {
	onClickTile(event) {

		var conf = this.props.conf;
		conf.el = event.target;
		this.props.onClickRow(this.props.conf.idx, conf);
	}
	render() {		
		let left = this.props.conf.x * this.props.conf.size;
		let top = this.props.conf.y * this.props.conf.size;

		//console.log("render ball", left, top, this.props.conf.x, this.props.conf.y);
		let style = {
			position: 'absolute',
			top,
			left,
			backgroundImage: 'url(' + 'img/' + this.props.conf.image + ")"
		}; 
		return (
			<div className="ball" style={style} onClick={this.onClickTile.bind(this)}>
			</div>
		)
	}
}