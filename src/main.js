import React from 'react';
import ReactDOM from 'react-dom';
import Tile from './components/Tile';
import Ball from './components/Ball';
import Timer from './components/Timer';
require('./less/style.less');

const RED_IMAGE = 'ball-red.png';
const GREEN_IMAGE = 'ball-green.png';
const BLUE_IMAGE = 'ball-blue.png';
const AQUA_IMAGE = 'ball-aqua.png';
const PINK_IMAGE = 'ball-pink.png';
const YELLOW_IMAGE = 'ball-yellow.png';
const VIOLET_IMAGE = 'ball-violet.png';

function addClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}


function removeClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}


export default class App extends React.Component {
	constructor(props) {
		super(props);
		const size = 9;
		this.tileSize = 62;
		this._animation = "css";
		this.state = {
			tiles: [],
			moves: [],
			end: false,
			balls: [],
			selectedBall: null,
			nextLine: [],
			startGame: false,
			gameType: size * size
		}

		this.colors = [
			{name: 'red', img: RED_IMAGE},
			{name: 'blue', img: BLUE_IMAGE},
			{name: 'green', img: GREEN_IMAGE},
			{name: 'aqua', img: AQUA_IMAGE},
			{name: 'pink', img: PINK_IMAGE},
			{name: 'yellow', img: YELLOW_IMAGE},
			{name: 'violet', img: VIOLET_IMAGE}
		]
	}
	setFieldSize() {
		this.fieldSize = {81: 9}[this.state.gameType];
		let field = document.querySelector(".game-field");
		if (field) {
			field.style.width = this.fieldSize * (this.tileSize) + 14 + "px";
			field.style.height = this.fieldSize * (this.tileSize) + 14 + "px";
		}
	}
	shuffleFY(array) {
		//shuffling with Fisher-Yeits algorithm
		let rand = (min, max) => {return Math.floor(Math.random() * (max - min + 1)) + min;}
		for (let i = array.length - 1; i > 0; i--) {
			let j = rand(0, i);
			let sw = array[j];
			array[j] = array[i];
			array[i]= sw;
		}

		return array;
	}
	newGame() {

		let winCondition = [];

		this.winCondition = winCondition;
		console.log("cells", this.state.gameType);

		let tilesCount = this.state.gameType;
		let tiles = Array(tilesCount);
		this.setState({
			end: false
		});

		for (let i = 0; i < tilesCount; i++) {
			tiles[i] = {idx: i + 1, occupy: false};
		}

		//this.shuffleFY(tiles);
		this.setState({
			tiles: tiles,
			startGame: true
		});

		this.getNext({startGame: false});
	
	}
	replayGame() {

	}
	checkCondition(tiles) {

		let over = tiles.filter((t) => t.occupy).length == tiles.length;

		if (!over) {
			let line = this.getMatchLine();

			if (line) this.removeLine(line);
		}

		return over;
	}
	getMatchLine() {
		let selectedBall = this.state.selectedBall;
	}
	selectBall(ballIndex, conf, isTile) {

		console.log("select tile", arguments)

		if (ballIndex && !isTile) {
			//select ball

			let ball = this.state.balls.find((b) => b.idx == ballIndex);
			ball.el = conf.el;
			let prevSelectedBall = this.state.selectedBall;
			console.log("select a ball", ball, prevSelectedBall);
			//keyframes animation
			if (this._animation == "css") {
				setTimeout(() => {

					if (prevSelectedBall) {
						removeClass(prevSelectedBall.el, 'bouncing');
					}

					addClass(ball.el, 'bouncing');

				})
			}

			this.setState({
				selectedBall: ball				
			});
		} else {
			//select tile
			if (this.state.selectedBall && isTile && !conf.occupy) {
				let x = conf.idx % this.fieldSize;
				let y = Math.floor(conf.idx / this.fieldSize);
				this.moveBall(this.state.selectedBall, x - 1, y);
				//this.getNext();
			} else {
				console.log("illegal move!");
			}
		}
	}
	onPlayWave() {
		this.getShortWay(this.nextTile, this.testTo);
	}
	getShortWay(from, to, clear) {
		//Lee algorithm

		let traced = [];

		console.log("trace from", from, ", to", to, "Traced=", traced.length);
		if (traced.length == 0) {
			this.state.tiles.forEach((t) => {
				delete t.trace_id;
				if (t.idx != from.idx && !t.occupy) {
					traced.push(t);
				}
			});
		}

		if (from) {
			let ft = this.state.tiles.find((t) => t.x == from.x && t.y == from.y)
			ft.trace_id = from.trace_id = from.trace_id || 0;
		}
		let marked = [from];

		let checkDestMark = (t) => {
			return t.x == to.x && t.y == to.y
		}
		//search for near tiles
		while (traced.length > 0 && !to.trace_id) {

			let loc = [];

			for (let m = 0; m < marked.length; m++) {
				let mk = marked[m];
				if ((mk.x - 1) >= 0) {
					let tl = this.state.tiles.find((t) => t.x == mk.x - 1 && t.y == mk.y)
					console.log("left sibling", tl);
					if (!tl.occupy && !tl.trace_id) {
						tl.trace_id = mk.trace_id + 1;			
						let idx = traced.indexOf(tl);
						traced.splice(idx, 1);
						loc.push(tl);
						if (checkDestMark(tl)) {alert("point ok");return tl;}
					}				
				}

				if ((mk.x + 1) <= (this.fieldSize - 1)) {
					let tl = this.state.tiles.find((t) => t.x == mk.x + 1 && t.y == mk.y)
					console.log("right sibling", tl);
					if (!tl.occupy && !tl.trace_id) {
						tl.trace_id = mk.trace_id + 1;
						let idx = traced.indexOf(tl);
						traced.splice(idx, 1);
						loc.push(tl);
						if (checkDestMark(tl)) {alert("point ok");return tl;}
					}
				}

				if ((mk.y - 1) >= 0) {
					let tl = this.state.tiles.find((t) => t.x == mk.x && t.y == mk.y - 1)
					console.log("top sibling", tl);
					if (!tl.occupy && !tl.trace_id) {
						tl.trace_id = mk.trace_id + 1;
						let idx = traced.indexOf(tl);
						traced.splice(idx, 1);
						loc.push(tl);
						if (checkDestMark(tl)) {alert("point ok");return tl;}
					}
				}

				if ((mk.y + 1) <= (this.fieldSize - 1)) {				
					let tl = this.state.tiles.find((t) => t.x == mk.x && (t.y == mk.y + 1))
					console.log("bottom", tl);
					if (!tl.occupy && !tl.trace_id) {
						tl.trace_id = mk.trace_id + 1;
						let idx = traced.indexOf(tl);
						traced.splice(idx, 1);
						loc.push(tl);
						if (checkDestMark(tl)) {alert("point ok");return tl;}
					}
				}				
			};
			
			loc.forEach((l) => {
				marked.push(l);
			})

		}

		this.setState({
			tiles: this.state.tiles
		})

	}
	findBestWay(from, to) {
		let lastPoint = to;
		let way = [];
		console.log("find way to", from, to);
		if (typeof to.trace_id == "undefined") {
			console.warn("way not found!");
			return 
		}
		while (!(lastPoint.x == from.x && lastPoint.y == from.y)) {

			if ((lastPoint.x - 1) >= 0) {
				let tl = this.state.tiles.find((t) => t.x == lastPoint.x - 1 && t.y == lastPoint.y)
				if (typeof tl.trace_id != "undefined" && tl.trace_id == lastPoint.trace_id - 1) {
					way.push(lastPoint);
					lastPoint = tl;
					continue;
				}
			}
			if ((lastPoint.x + 1) <= (this.fieldSize - 1)) {
				let tl = this.state.tiles.find((t) => t.x == lastPoint.x + 1 && t.y == lastPoint.y)
				if (typeof tl.trace_id != "undefined" && tl.trace_id == lastPoint.trace_id - 1) {
					way.push(lastPoint);
					lastPoint = tl;
					continue;
				}
			}
			if ((lastPoint.y - 1) >= 0) {
				let tl = this.state.tiles.find((t) => t.x == lastPoint.x && t.y == lastPoint.y - 1)
				if (typeof tl.trace_id != "undefined" && tl.trace_id == lastPoint.trace_id - 1) {
					way.push(lastPoint);
					lastPoint = tl;
					continue;
				}
			}	
			if ((lastPoint.y + 1) <= (this.fieldSize - 1)) {
				let tl = this.state.tiles.find((t) => t.x == lastPoint.x && t.y == lastPoint.y + 1)
				if (typeof tl.trace_id != "undefined" && tl.trace_id == lastPoint.trace_id - 1) {
					way.push(lastPoint);
					lastPoint = tl;
					continue;
				}
			}		
		}

		return way;
	}
	moveBall(ball, x, y) {

		let destPoint = this.getShortWay(ball, {x, y}, true);
		let pathWays = this.findBestWay(ball, destPoint);

		if (!pathWays) return;

		this.setState({
			tiles: this.state.tiles
		});

		console.log("way", pathWays);

		pathWays.unshift({x: x, y: y});

		if (pathWays.length > 0) {

			let preTile = this.state.tiles.find((b) => {
				return (
					b.x == this.state.selectedBall.x && 
					b.y == this.state.selectedBall.y
				)
			});

			preTile.occupy = false;

			let animate = () => {

				let nextTile = pathWays.pop();

				console.log("move ball", x, y)
				this.state.selectedBall.x = nextTile.x;
				this.state.selectedBall.y = nextTile.y;

				this.setState({
					selectedBall: this.state.selectedBall
				})

				if (pathWays.length) {
					setTimeout(animate, 1000);
				} else {
					let movedBall = this.state.balls.find((b) => {
						return (
							b.x == this.state.selectedBall.x && 
							b.y == this.state.selectedBall.y
						)
					});

					movedBall.x = this.state.selectedBall.x;
					movedBall.y = this.state.selectedBall.y;
					console.log("ball", movedBall);

					let postTile = this.state.tiles.find((b) => {
						return (
							b.x == this.state.selectedBall.x && 
							b.y == this.state.selectedBall.y
						)
					});

					postTile.occupy = true;

					this.setState({
						balls: this.state.balls
					})
					this.getNext();
				}
			}

			animate();
		}
		
	}
	removeLine() {

	}
	getFreeTiles(reservedTiles) {
		return this.state.tiles.filter((t) => {
			return !t.occupy && reservedTiles.indexOf(t) == -1;
		})
	}
	nextTurn(forceColors) {

		let nextBalls = [];
		let reservedTiles = [];

		for (let b = 0; b < 3; b++) {

			let color;

			if (!this.state.nextLine || this.state.nextLine.length == 0 || forceColors) {
				color = this.shuffleFY(this.colors)[0];
			} else if (this.state.nextLine.length) {
				color = this.state.nextLine[b].color;
			}

			let unocuppyTiles = this.getFreeTiles(reservedTiles);

			let tile = this.shuffleFY(unocuppyTiles)[0];

			if (!tile) return;

			reservedTiles.push(tile);
			let index = tile.idx;

			console.log(unocuppyTiles.length, color, tile);
			let next = {
				idx: index,
				color: color,
				image: color.img,
				x: ((index - 1) % this.fieldSize),
				y: (Math.floor((index - 1) / this.fieldSize)),
				size: this.tileSize
			}

			nextBalls.push(next);
			
			console.log("next ball", next);
		}

		return nextBalls;
	}
	setGameState(event) {
		let menuItem = event.target;
		let gameState = menuItem.getAttribute('data-mode');

		switch (gameState) {
			case "start":
				this.setState({start: true});
				break;
			case "scores":
				this.setState({scores: true});
				break;
			case "publish":
				this.setState({publish: true});
				break;
		}

	}
	getNext(stateParams) {

		if (this.state.end) return;

		let nextBalls = this.nextTurn();

		if (!nextBalls) {
			this.setState({
				end: true
			});
			return;
		}

		let updatedTiles = [];
		nextBalls.forEach((b) => {
			let tile = this.state.tiles.find((t) => t.idx == b.idx);
			console.log("set tile occupy", tile);
			tile.occupy = true;
			updatedTiles.push(tile);
		});

		let balls = this.state.balls;

		let forceGetColors = true;
		let nextLine = this.nextTurn(forceGetColors);

		if (!nextLine) {
			nextLine = [];
			stateParams = stateParams || {};
			stateParams.end = true;
		}

		nextBalls.forEach((nb)=> {
			balls.push(nb);
		})

		console.log("occupy tiles", updatedTiles);

		this.state.tiles.forEach((t) => {
			delete t.trace_id;
		})

		let newState = {
			balls: balls,
			nextLine: nextLine,
			tiles: this.state.tiles
		}

		if (stateParams) {
			if (typeof stateParams.startGame != "undefined") {
				newState.startGame = stateParams.startGame
			}
			if (typeof stateParams.end != "undefined") {
				newState.end = stateParams.end;
			}
		}

		this.setState(newState);
	}
	render() {
		let top = 0;
		let stateScreen = null;
		let gameScreen = null;

		this.setFieldSize();

		if (this.state.start) {

			let nextBallsBlock = (function() {
				if (this.state.nextLine.length > 0) {
					return (
						<div className="next-line">
							<h4>NEXT</h4>
							<div className="ball bordered">
								<img src={'img/' + this.state.nextLine[0].image}/>
							</div>
							<div className="ball bordered">
								<img src={'img/' + this.state.nextLine[1].image}/>
							</div>
							<div className="ball bordered">
								<img src={'img/' + this.state.nextLine[2].image}/>
							</div>
						</div>
					);
				} else {
					return (<div></div>);
				}
			}).call(this);

			gameScreen = (
				<div>
					<div className="title">
						<h1>LINES</h1>
						<div className="tools">
							<Timer start={this.state.startGame}></Timer>
							<button onClick={this.newGame.bind(this)}>Reset</button>
							<button onClick={this.getNext.bind(this)}>Next</button>
							<button onClick={this.onPlayWave.bind(this)}>Play</button>
						</div>						
					</div>
					{nextBallsBlock}
					<div className="game-field" style={{position: 'relative'}}>	
					{ this.state.tiles.map((tile, index) => {
						let left = index % this.fieldSize == 0 ? 0: index - top * this.fieldSize;
						top += (index % this.fieldSize == 0 && index > 0) ? 1: 0;
						tile.x = left;
						tile.y = top;
						return (
							<Tile onClickRow={this.selectBall.bind(this)} key={index} position={[left, top]} conf={tile} size={this.tileSize}/>
						)
					}, this)}
					{ this.state.balls.map((ball, index) => {
						//console.log("render ball", ball);
						return (
							<Ball onClickRow={this.selectBall.bind(this)} key={index} conf={ball}/>
						)
					}, this)}
					</div>
				</div>
			)
			setTimeout(() => {
				if (!this.newGameStarted) {
					this.newGameStarted = true;
					this.newGame();	
				}
			})			
		} else {
			this.currentYear = new Date().getFullYear();
			gameScreen = (			
				<div>
					<div className="start-menu">
						<label>LINES</label>					
						<ul className="menu">
							<li className="menu-item" data-mode="start" 
							onClick={this.setGameState.bind(this)}>START GAME</li>
							<li className="menu-item" data-mode="scores" 
							onClick={this.setGameState.bind(this)}>SCORE BOARD</li>
							<li className="menu-item" data-mode="publish" 
							onClick={this.setGameState.bind(this)}>PUBLISH RESULTS</li>
						</ul>
					</div>
					<div className="footer">
						<span>Monolith Games</span>
						<span>{this.currentYear}</span>
					</div>
				</div>
			)
		}

		if (this.state.end) {
			stateScreen = (
				<h1>Game finished!</h1>
			);
		}

		return (
			<div className="game-field-wrapper">
				{gameScreen}
				{stateScreen}
			</div>
		)
	}
}

window.onload = () => {
	ReactDOM.render(<App/>, document.getElementById('gameField'));
};