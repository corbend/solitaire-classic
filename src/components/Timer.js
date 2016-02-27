import React from 'react';


export default class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			minutes: 0,
			seconds: 0
		};
		this.timer = null;
		this.start = this.props.start;
	}
	onStart() {
		if (!this.state.start && !this.timer) {
			this.timer = setInterval(() => {
				let secs = (this.state.seconds % 59 == 0 && this.state.seconds > 0) ? 0: this.state.seconds + 1;
				let mins = (this.state.seconds % 59 == 0 && this.state.seconds > 0) ? this.state.minutes + 1: this.state.minutes;

				if (!this.start) {
					this.start = true;
				}

				this.setState({
					seconds: secs,
					minutes: mins,
				})
			}, 1000)
			
		}
	}
	formatTime(t) {
		let pad = (t) => ("0" + t).slice(-2);
		return pad(t);
	}
	render() {

		if (this.props.start && !this.start) {
			this.onStart();
			setTimeout(() => {
				this.setState({
					start: true
				})	
			})		
		}
		else if (this.props.stop) {
			console.log("stop game");
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		} 
		else if (this.props.start && this.start && !this.state.start) {
			this.start = false;
			setTimeout(() => {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
				this.setState({
					seconds: 0,
					minutes: 0
				})
				this.onStart();
			})
		} else if (this.props.start && this.start && this.state.start) {
			setTimeout(() => {
				this.setState({
					start: false
				})	
			})
		}
		
		return (
			<div className="timer">{this.formatTime(this.state.minutes)}:{this.formatTime(this.state.seconds)}</div>
		)
	}
}