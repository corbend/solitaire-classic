import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Tableau from './components/Tableau';
import Waste from './components/Waste';
import Stock from './components/Stock';
import Foundation from './components/Foundation';

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
			foundationItems: [],
			stockItems: [],
			tableauItems: [],
			wasteItems: []
		}

	}
	setFieldSize() {		
		let field = document.querySelector(".game-field");
		if (field) {
			field.style.width =  "70%";
			//field.style.height = "600px";
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
				end: false,
				reset: false,
				startGame: true,
				stopGame: false
			});

			this.getNext();
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
	changeState() {
				
	}
	onNextClick() {
		if (!this.screenLock) {
			this.getNext();
		}
	}
	getNext() {

		if (this.state.end) {
			return;
		};

		this.setScreenLock(true);
		//add new balls
		this.changeState();
	}
	onSaveClick() {

	}
	prepareCards() {

		let stockItems = [];
		let tableauItems = [];

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

		let freeItems = [];

		this.allCards.forEach((c) => {
			freeItems.push(c);
		})

		
		//tableau
		let ct = 1;
		for (let x = 0; x < 7; x++) {

			let parent = null;
			for (let y = 0; y < ct; y++) {
				let card = this.shuffleFY(freeItems)[0];
			
				freeItems.splice(freeItems.indexOf(card), 1);
				card.x = x;
				card.y = y;
				card.columnIndex = y;

				if (y == ct - 1) {
					card.hide = false;
				} else {
					card.hide = true;
				}
				//FIXME - test
				card.hide = false;

				if (parent) {
					parent.child = card;
				}

				parent = card;	
				tableauItems.push(card);
			}

			ct++;
		}

		//stock
		let stockItemsCount = freeItems.length;
		for (let c = 0; c < stockItemsCount; c++) {

			let card = this.shuffleFY(freeItems)[0];
			freeItems.splice(freeItems.indexOf(card), 1);
			stockItems.push(card);
		}

		this.setState({
			tableauItems,
			stockItems
		});

	}
	onClickStock(pile) {
		console.log("add to waste", pile);
		this.setState({
			wasteItems: this.state.wasteItems.concat(pile)
		});

		this.setState({
			stockItems: this.state.stockItems.filter((x) => pile.indexOf(x) == -1)
		})
	}
	onRepeatStock() {
		this.setState({
			stockItems: this.state.wasteItems.reverse(),
			wasteItems: []
		})
	}
	onDropTo(card, position, dropTarget, from) {

		let tableauCopy = this.state.tableauItems.slice();
		let stockCopy = this.state.stockItems.slice();
		let wasteCopy = this.state.wasteItems.slice();
		let foundationItems = this.state.foundationItems.slice();

		let source = null;
		let sourceIndex = null;
		let target = null;
		let parent = null;

		let sourceCollection = null;
		let sourceCollectionCopy = null;		
		let targetCollection = null;
		let clearCollections = [];

		let to = dropTarget.name;
		let removeSource = false;
		let finalizeSource = false;
		let mustClearChild = false;
		let mustRearange = from == to;
		let onlyLeaf = false;
		let refill = false;

		if (from == "tableau") {
			sourceCollection = this.state.tableauItems;
			sourceCollectionCopy = tableauCopy;
			mustClearChild = true;
		} else if (from == "waste") {
			sourceCollection = this.state.wasteItems;
			sourceCollectionCopy = wasteCopy;	
		}

		if (to == "foundation") {
			removeSource = true;
			finalizeSource = true;
			targetCollection = foundationItems;
			onlyLeaf = true;
		} else if (to == "tableau") {
			if (from == "waste") {
				removeSource = true;	
			}
			targetCollection = tableauCopy;
		}

		sourceCollection.forEach((i, index) => {
			if (i.type == card.type) {
				source = i;
				sourceIndex = index;
				console.log("SOURCE", card, sourceIndex);
			}
		});
		//validation
		if (onlyLeaf && source.child) {		
			console.warn("must copy only leaf cards");	
			return;
		}

		if (to == "tableau" && dropTarget.target.type == "placeholder") {
			if (parseInt(source.type) != 13) {
				console.warn("not king");
				return;
			}
		}

		if (to == "tableau" && dropTarget.target.type != "placeholder") {
			let sourceNominal = parseInt(source.type);
			let targetNominal = parseInt(dropTarget.target.top.type);
			let sourceType = source.type.slice(-1);
			let targetType = dropTarget.target.top.type.slice(-1);

			let sType = ['s', 'c'].indexOf(sourceType);
			let tType = ['s', 'c'].indexOf(targetType);

			if ((sType == -1 && tType == -1) || (sType != -1 && tType != -1)) {
				console.warn("type illegal", sourceType, targetType);
				return;
			}

			if (sourceNominal != targetNominal - 1) {
				console.warn("nominal illegal", sourceNominal, targetNominal);
				return;
			}
		}

		if (to == "foundation") {
			let sourceNominal = parseInt(source.type);
			let sourceType = source.type.slice(-1);		
			let cardsByType = this.state.foundationItems.filter((c) => c.type.slice(-1) == sourceType).slice(-1);
			let lastCardNom = (cardsByType[0] && parseInt(cardsByType[0].type)) || 0;
			console.log("validate foundation", sourceNominal, sourceType, lastCardNom + 1);
			if ((!cardsByType[0] && lastCardNom > 1) || sourceNominal != lastCardNom + 1) {
				console.warn("foundation drop failed");
				return;
			}		
		}

		console.log("FROM", from, "->", to);

		if (mustClearChild) {
			console.log("PARENT ->");
			sourceCollection.forEach((i, index) => {
				if (i.child && i.child.type == source.type) {						
					console.log("CLEAR CHILD", i);
					i.hide = false;
					i.child = null;
				}
			});
		}

		if (removeSource) {
			console.log("REMOVE", sourceCollectionCopy);
			sourceCollectionCopy.splice(sourceIndex, 1);
		}

		if (finalizeSource) {
			console.log("FINALIZE");
			source.final = true;
			source.finalPosition = position + 1;
		}

		if (targetCollection) {

			if (!mustRearange) {
				console.log("COPY TO", source);
				targetCollection.push(source);
			}

			let siblings = [];

			let child = source.child;
			while (child) {
				siblings.push(child);
				child = child.child;
			}

			if (dropTarget.target.type == "placeholder") {

				siblings.forEach((s, index) => {
					s.x = dropTarget.position;
					s.y = index + 1;
				});

				source.x = dropTarget.position;
				source.y = 0;

				console.log("PUT TO -> PLACE", dropTarget.position);

			} else {

				targetCollection.forEach((i, index) => {

					if (i.type == dropTarget.target.top.type && !i.child) {

						siblings.forEach((s, index) => {
							s.x = i.x;
							s.y = i.y + index + 2;
						});
						source.x = i.x;
						source.y = i.y + 1;

						i.child = source;					

						console.log("PUT TO -> CARD", i);
					}

				});
		
			}
		}

		this.setState({
			tableauItems: tableauCopy,
			stockItems: stockCopy,
			wasteItems: wasteCopy,
			foundationItems: foundationItems
		})
	}
	render() {
		let top = 0;
		let stateScreen = null;
		let gameScreen = null;

		this.setFieldSize();

		if (this.state.start) {

			let btnCls = (this.screenLock && "disabled") || "";
			let self = this;
			gameScreen = (
				<div>
					<div className="title">
						<h1>{this.gameName}</h1>
						<div className="tools">
							<button className={btnCls} onClick={this.resetGame.bind(this)}>Reset</button>
							<button className={btnCls} onClick={this.onSaveClick.bind(this)}>Save</button>														
						</div>			
					</div>
					<div className="game-field" style={{position: 'relative'}}>	
						<Stock onClickStock={this.onClickStock.bind(this)} onRepeatStockClick={this.onRepeatStock.bind(this)} items={this.state.stockItems}/>
						<Foundation items={this.state.foundationItems}/>
						<Tableau items={this.state.tableauItems} onDrop={this.onDropTo.bind(this)}/>
						<Waste items={this.state.wasteItems} onDrop={this.onDropTo.bind(this)}/>
					</div>
					<span>Stock {this.state.stockItems.length}</span><br></br>
					<span>Waste {this.state.wasteItems.length}</span>
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