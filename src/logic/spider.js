import _ from "lodash";

export default class SpiderLogic {	
	constructor(typeIdx) {
		this.types = ['four suits'];
		this.type = this.types[typeIdx || 0];
	}
	handleZoneClick(state, zone, pile) {

		let collection = state.stockItems.slice();
		let tableauItems = state.tableauItems.slice();

		for (let t = 0; t < (state.stockItems.length > 10 ? 10: state.stockItems.length); t++) {
			let card = collection.pop();
			card.x = t;
			let lastCardY = state.tableauItems.filter(c => c.x == card.x).reduce((p, c) => {return Math.max(p, c.y)}, 0);
			let parent = state.tableauItems.find(c => {return c.x == card.x && c.y === lastCardY});
			card.y = ((parent && parent.y) || 0) + ((parent && 1 ) || 0);
			if (parent) {
				parent.child = card;
			}
			tableauItems.push(card);
		}

		return {
			stockItems: collection,
			tableauItems: tableauItems
		};
	}
	handleDrag(props, zone) {

		let child = props.child;
		let parent = props;
		let canDrag = props.drag;

		while (child) {

			let selfType = parent.type.replace(/[\d]/g, '');
			let selfNominal = parseInt(parent.type);
			if (child) {
				let childType = child.type.replace(/[\d]/g, '');
				let childNominal = parseInt(child.type);
				canDrag = (childType == selfType && selfNominal == childNominal + 1);
				if (!canDrag) {
					console.warn("illegal chain", selfType, childType, selfNominal, childNominal);
					break;
				}
			}

			parent = child;
			child = child.child;				
		}

		return canDrag;
	}
	compareCard(c1, c2) {
		return c1.index == c2.index;
	}
	handleMove(state, card, position, dropTarget, from) {

		let tableauCopy = state.tableauItems.slice();
		let stockCopy = state.stockItems.slice();
		let foundationItems = state.foundationItems.slice();

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
			sourceCollection = state.tableauItems;
			sourceCollectionCopy = tableauCopy;
			mustClearChild = true;
		}

		if (to == "tableau") {
			targetCollection = tableauCopy;
		} else {
			console.log("invalid move");
			return;
		}

		sourceCollection.forEach((i, index) => {
			if (this.compareCard(i, card)) {
				source = i;
				sourceIndex = index;
				console.log("SOURCE", card, i, sourceIndex);
			}
		});
		//validation
		if (onlyLeaf && source.child) {		
			console.warn("must copy only leaf cards");	
			return;
		}

		if (to == "tableau" && dropTarget.target.type != "placeholder") {
			let sourceNominal = parseInt(source.type);
			let targetNominal = parseInt(dropTarget.target.top.type);
			let sourceType = source.type.slice(-1);
			let targetType = dropTarget.target.top.type.slice(-1);

			if (sourceNominal != targetNominal - 1) {
				console.warn("nominal illegal", sourceNominal, targetNominal);
				return;
			}
		}

		console.log("FROM", from, "->", to);

		if (mustClearChild) {
			console.log("PARENT ->");
			sourceCollection.forEach((i, index) => {
				if (i.child && this.compareCard(i.child, source)) {
					console.log("CLEAR CHILD", i, source);
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

					if (this.compareCard(i, dropTarget.target.top) && !i.child) {

						siblings.forEach((s, index) => {
							s.x = i.x;
							s.y = i.y + index + 2;
						});
						source.x = i.x;
						source.y = i.y + 1;

						i.child = source;					

						console.log("PUT TO -> CARD", i);
						
						let parents = [];
						let prnt = source;
						//find all matched parents
						while (prnt) {
							let nprnt = prnt;
							sourceCollection.forEach((i, index) => {
								if (i.child && this.compareCard(i.child, nprnt) && 
									i.child.type.slice(-1) == prnt.type.slice(-1) &&
									parseInt(i.type) == parseInt(prnt.type) + 1) {
									parents.push(i);									
									nprnt = i;
								}
							});

							if (prnt == nprnt) break;
							prnt = nprnt;
						}

						let matchedCards = parents.filter(x => x.type.slice(-1) == source.type.slice(-1));

						if (matchedCards.length + siblings.length + 1 == 13) {

							let nextFoundationIndex = Math.floor(foundationItems.length / 13);

							let clearCards = matchedCards.concat(siblings);
							clearCards.push(source);
							clearCards = _.sortBy(clearCards, x => parseInt(x.type));
							let topCard = clearCards.find((x) => parseInt(x.type) == 13);
							console.log("top card", topCard);

							sourceCollection.forEach((c) => {
								if (c.child && c.child.index == topCard.index) {
									c.child = null;
									c.hide = false;
								}
							})
						
							clearCards.forEach((c) => {
								c.final = true;
								c.finalPosition = nextFoundationIndex;
								c.child = null;							
								if (parseInt(c.type) != 13) {
									c.zIndex = 0;
									c.hide = true;						
								} else {
									c.zIndex = 10;
								}
								foundationItems.push(c);
								console.log("clear chain", c);
								targetCollection.splice(targetCollection.indexOf(c), 1);
							})
						}
					}

				});
		
			}
		}

		state = {
			movesCounter: state.movesCounter + 1,
			tableauItems: tableauCopy,
			stockItems: stockCopy,
			foundationItems: foundationItems
		}

		if (foundationItems.length == 104) {
			state.end = true;
		}

		return state;
	}
	prepareCards(cards, shuffleFn) {
		//tableau
		let cp = [];

		cards.slice().forEach((c) => {
			let copyCard = {};			
			Object.keys(c).forEach((k) => {
				copyCard[k] = c[k];
			});

			cp.push(copyCard);
		});

		cards = cards.concat(cp);

		cards.forEach((c) => {
			c.type = parseInt(c.type) + "s";
		})

		let stockItems = [];
		let tableauItems = [];
		let tableauCount = 10;
		let ct = 1;
		let indexCounter = 0;

		for (let x = 0; x < tableauCount; x++) {

			let parent = null;

			if (x > 3) {
				ct = 5;
			} else {
				ct = 6;
			}

			for (let y = 0; y < ct; y++) {
				let card = shuffleFn(cards)[0];

				cards.splice(cards.indexOf(card), 1);
				card.x = x;
				card.y = y;
				card.columnIndex = y;

				if (y == ct - 1) {
					card.hide = false;
				} else {
					card.hide = true;
				}

				card.index = indexCounter;				
				console.log("c", card.index);
				if (parent) {
					parent.child = card;
				}

				parent = card;	
				tableauItems.push(card);

				indexCounter++;
			}
		}

		//stock
		let stockItemsCount = cards.length;
		console.log("STOCK ITEMS", stockItemsCount);
		for (let c = 0; c < stockItemsCount; c++) {

			let card = shuffleFn(cards)[0];
			card.index = indexCounter;
			indexCounter++;
			cards.splice(cards.indexOf(card), 1);
			stockItems.push(card);
		}

		console.log(stockItems, tableauItems);

		return {
			foundationItems: [],
			tableauItems,
			stockItems,
			gameType: `Spider`
		};
	}
}