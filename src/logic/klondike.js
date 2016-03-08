
export default class KlondikeLogic {

	handleMove(state, card, position, dropTarget, from) {

		let tableauCopy = state.tableauItems.slice();
		let stockCopy = state.stockItems.slice();
		let wasteCopy = state.wasteItems.slice();
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
		} else if (from == "waste") {
			sourceCollection = state.wasteItems;
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
			let cardsByType = state.foundationItems.filter((c) => c.type.slice(-1) == sourceType).slice(-1);
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

		if (state.foundationItems.length == 52) {
			return false;
		} else {
			return {
				movesCounter: state.movesCounter + 1,
				tableauItems: tableauCopy,
				stockItems: stockCopy,
				wasteItems: wasteCopy,
				foundationItems: foundationItems
			}
		}
	}
	prepareCards(cards, shuffleFn) {
		//tableau

		let stockItems = [];
		let tableauItems = [];

		let ct = 1;
		for (let x = 0; x < 7; x++) {

			let parent = null;
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

				if (parent) {
					parent.child = card;
				}

				parent = card;	
				tableauItems.push(card);
			}

			ct++;
		}

		//stock
		let stockItemsCount = cards.length;
		for (let c = 0; c < stockItemsCount; c++) {

			let card = shuffleFn(cards)[0];
			cards.splice(cards.indexOf(card), 1);
			stockItems.push(card);
		}

		return {
			foundationItems: [],
			wasteItems: [],
			tableauItems,
			stockItems,
			gameType: 'Klondike'
		};
	}
}