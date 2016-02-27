import React from 'react';
import ReactDOM from 'react-dom';

export default class Ball extends React.Component {
	constructor() {
		super();
		this.showed = false;
		this.state = {
			selected: false,
			dirty: false,
			hide: false
		}
	}
	onClickTile(event) {
		event.stopPropagation();
		var conf = this.props.conf;
		conf.el = event.target;
		this.props.onClickRow(this.props.conf.idx, conf);
	}
	select(value) {

		// if (value) {
		// 	console.log("select", this);
		// }

		this.setState({
			hide: false,
			selected: value,
			dirty: true
		})
	}
	hide(value) {
		this.setState({
			selected: false,
			hide: value
		})
	}
	render() {
		// if (!this.props.conf.size || !this.props.conf.x || !this.props.conf.y) {
		// 	console.warn("ball has missing configuration params");
		// }
		let left = this.props.conf.x * this.props.conf.size;
		let top = this.props.conf.y * this.props.conf.size;

		//console.log("render ball", left, top, this.props.conf.x, this.props.conf.y);
		let style = {
			position: 'absolute',
			top,
			left,
			backgroundImage: 'url(' + 'img/' + this.props.conf.image + ")",
			display: (!this.props.conf.hide && "block") || "none"
		}; 

		this.cls = ['ball', ''];

		if (this.state.hide) {
			this.cls[1] = 'hiding';
		} else if (this.state.selected) {
			this.cls[1] = 'bouncing';
		} else {
			if (!this.state.dirty) {
				this.cls[1] = "showing";
			}
		}

		return (
			<div className={this.cls.join(" ")} style={style} onClick={this.onClickTile.bind(this)}>
			</div>
		)
	}
}