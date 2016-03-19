import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Tableau from './components/Tableau';
import Waste from './components/Waste';
import Stock from './components/Stock';
import Foundation from './components/Foundation';
import Placeholder from './components/Placeholder';

import FreeCell from './components/FreeCell';

import FreeCellLogic from './logic/freecell';
import KlondikeLogic from './logic/klondike';
import SpiderLogic from './logic/spider';

require('./less/style.less');

function addClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}

function removeClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}

@DragDropContext(HTML5Backend)
export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.gameName = "SOLITAIRE";

		this.state = {
			movesCounter: 0,
			foundationItems: [],
			stockItems: [],
			tableauItems: [],
			wasteItems: [],
			freeCellItems: []
		}

	}
	setFieldSize() {		
		let field = document.querySelector(".game-field");
		if (field) {
			field.style.width =  "90%";
			field.style.height = "750px";
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
	resetGame() {
		this.newGame(true);
	}
	setEndGameState(reset) {
		debugger;	
		this.setState({
			end: true,
			reset: reset,
			stopGame: true
		});
	}
	newGame(reset) {

		let startGame = () => {
			this.prepareCards();
			this.setState({
				gameType: this.state.gameType,
				end: false,
				reset: false,
				movesCounter: 0,
				startGame: true,
				stopGame: false
			});
		}

		if (reset) {
			this.setEndGameState();

			setTimeout(() => {
				startGame();
			})

			return;
		} else {
			startGame();
		}

	}
	setScreenLock(value) {
		if (value != this.screenLock) {
			//console.log("screen - " + (value ? "LOCK": "UNLOCK"));
			this.screenLock = value;
		}
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
	onSaveClick() {

	}
	getCards() {

		let freeItems = [];
		let counter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '11', '12', '13'];
		let face = ['s', 'h', 'c', 'd'];

		this.allCards = [];

		counter.forEach((c) => {
			face.forEach((f) => {
				this.allCards.push({
					type: c + f
				})
			});
		})


		this.allCards.forEach((c) => {
			freeItems.push(c);
		})

		return freeItems;
	}
	getEngine() {
		let engine;
		switch (this.state.gameType || "Klondike") {
			case "Klondike":
				engine = new KlondikeLogic();
				break;
			case "Free Cell":
				engine = new FreeCellLogic();
				break;
			case "Spider":
				engine = new SpiderLogic();
				break;
		}

		return engine;
	}
	prepareCards() {
		return this.setState(this.getEngine().prepareCards(this.getCards(), this.shuffleFY));
	}
	onClickStock(props) {		
		return this.setState(this.getEngine().handleZoneClick(this.state, props, "stock"));
	}
	onRepeatStock() {
		this.setState({
			stockItems: this.state.wasteItems.reverse(),
			wasteItems: []
		})
	}
	onDrag(props) {
		if (props.hide) return false;
		else {
			return this.getEngine().handleDrag(props);
		}
	}
	onDropTo(card, position, dropTarget, from) {

		//save for undo move
		this.onSaveMove();

		if (card.hide) return false;

		let nextState = this.getEngine().handleMove(this.state, card, position, dropTarget, from);
		
		let end1 = typeof nextState == "object" && nextState.end;
		let end2 = typeof nextState == "boolean" && !nextState;

		if (typeof nextState == "object" && (!end1 && !end2)) {
			this.setState(nextState);
		} else if (end1 || end2) {
			this.setState(nextState);
			this.setEndGameState();
		}
	}
	bruteForceGenerator() {
		//TODO
	}
	solveGame() {
		//TODO
	}
	onHintClick() {
		let pairs = {};

		this.state.tableauItems.forEach(() => {

		});
	}
	onUndoClick() {
		this.setState(this.state.prevStateSnapshot);
	}
	onSaveMove(source, target) {
		let key = `solitaire.${this.state.gameType}`;
		let moveConfig = JSON.stringify(this.state);
		window.localStorage.setItem(key, moveConfig);

		this.setState({
			prevStateSnapshot: this.state
		})
	}
	renderField() {
		
		switch (this.state.gameType) {
			case "Klondike":				
				return (
					<div className="game-field" style={{position: 'relative'}}>	
						<div className="board" style={{width: "90%", height: "750px"}}>
							<Stock onClickStock={this.onClickStock.bind(this)} onRepeatStockClick={this.onRepeatStock.bind(this)} items={this.state.stockItems}/>
							<Foundation items={this.state.foundationItems}/>	
							<Tableau checkDrag={this.onDrag.bind(this)} columns={7} type={"klondike"} items={this.state.tableauItems} onDrop={this.onDropTo.bind(this)}/>
							<Waste items={this.state.wasteItems} onDrop={this.onDropTo.bind(this)}/>
						</div>
					</div>
				)
			case "Free Cell":
				return (
					<div className="game-field" style={{position: 'relative'}}>
						<div className="board" style={{width: "992px", height: "750px"}}>
							<FreeCell items={this.state.freeCellItems} onDrop={this.onDropTo.bind(this)}/>
							<Foundation items={this.state.foundationItems}/>	
							<Tableau checkDrag={this.onDrag.bind(this)} columns={8} type={"freecell"} items={this.state.tableauItems} onDrop={this.onDropTo.bind(this)}/>
						</div>
					</div>
				)
			case "Spider":				
				return (
					<div className="game-field" style={{position: 'relative'}}>
						<div className="board" style={{width: "1258px", height: "750px"}}>
							<Stock onClickStock={this.onClickStock.bind(this)} items={this.state.stockItems}/>
							<Foundation placeholders={8} items={this.state.foundationItems}/>
							<Tableau checkDrag={this.onDrag.bind(this)} columns={10} type={"spider"} items={this.state.tableauItems} onDrop={this.onDropTo.bind(this)}/>
						</div>
					</div>
				)
			case "Castle":
				break;
		}
	}
	onSelectGameType(event) {
		this.setState({
			gameType: event.target.value
		});
		setTimeout(() => {
			this.newGame();
		});			
	}
	render() {
		let top = 0;
		let stateScreen = null;
		let gameScreen = null;

		this.setFieldSize();

		if (this.state.start) {

			let self = this;
			gameScreen = (
				<div>

					<div className="title">
						<h1>{this.gameName}</h1>
						<div className="game-type-selector">
							<select onChange={this.onSelectGameType.bind(this)}>
								<option value="Klondike">Klondike</option>
								<option value="Free Cell">Free Cell</option>
								<option value="Spider">Spider</option>
								<option value="Castle">Castle</option>
							</select>
						</div>
						<div className="tools">
							<button onClick={this.onUndoClick.bind(this)}>Undo</button>	
							<button onClick={this.resetGame.bind(this)}>Reset</button>
							<button onClick={this.onSaveClick.bind(this)}>Save</button>
							<button onClick={this.onHintClick.bind(this)}>Hint</button>														
						</div>
						<div className="moves-counter">Moves: <span>{this.state.movesCounter}</span></div>
					</div>
					{this.renderField.bind(this)()}
				</div>
			)
			setTimeout(() => {
				if (!this.newGameStarted) {
					this.newGameStarted = true;
					this.newGame();	
				}
			});
		} else {
			this.currentYear = ", " + new Date().getFullYear();
			gameScreen = (			
				<div>
					<div className="start-menu">
						<label>{this.gameName}</label>					
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

		if (this.state.end && !this.state.reset) {
			stateScreen = (
				<h1 className="end-title">Game finished!</h1>
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