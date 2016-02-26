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
		if (!this.state.start) {			
			this.timer = setInterval(() => {
				
				let secs = (this.state.seconds % 59 == 0 && this.state.seconds > 0) ? 0: this.state.seconds + 1;
				let mins = (this.state.seconds % 59 == 0 && this.state.seconds > 0) ? this.state.minutes + 1: this.state.minutes;

				this.setState({
					seconds: secs,
					minutes: mins
				})
			}, 1000)
			this.start = true;
		}
	}
	formatTime(t) {
		let pad = (t) => ("0" + t).slice(-2);
		return pad(t);
	}
	render() {

		if (this.props.start && !this.start) {
			this.onStart();
		} else if (this.props.start && this.start) {
			this.start = false;
			setTimeout(() => {
				if (this.timer) {
					clearInterval(this.timer);
				}
				this.setState({
					seconds: 0,
					minutes: 0
				})
				this.onStart();
			})
		}
		
		return (
			<div className="timer">{this.formatTime(this.state.minutes)}:{this.formatTime(this.state.seconds)}</div>
		)
	}
}