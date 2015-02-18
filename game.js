var board, next, offset, gameOver, score, animationIntv, commitMove, previewing, previewKey;

function newGame() {
	var elements = document.querySelectorAll('[data-pos]');
	for (var i = 0; i < elements.length; i++) {
		elements[i].innerHTML = '';
		elements[i].style.backgroundColor = 'black';
	}
	startGame();
}

function startGame() {
	$('#next-number').html('Next Number:');
	$('#score').html('0');
	gameOver = false;
	commitMove = true;
	previewing = false;
	previewKey = undefined;
	score = 0;
	offset = 0;
	board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	next = [];
	//set height to table
	$("table td").height($("table td").width());
	
	//initialize the board with 9 numbers, 1-3
	var usedNums = [], pos, number, element, i;
	getNumbers();
	while (usedNums.length < 9) {
		number = next[0];
		pos = getRandomNumberLow(16);
		if (notIncluded(usedNums, pos)) {
			next.shift();
			usedNums.push(pos);
			element = getElement('data-pos~=', pos);
			$(element).html(number);
			$(element).css('background-color', getColor(number));
			board[pos] = number;
		}
	}
	nextNumber();
}

function previewMove(direction) {
	resetElementClasses();
	var i, len = board.length, element, moved = [];
	var tmp = board.slice(0);
	switch (direction) {
		case 'up':
			for (i = 0; i < len; i++) {
				element = getElement('data-pos~=', i);
				if (tmp[i] != 0 && i < 4) {
					/*first row is blocked by 'wall' unless no number is there
						those tiles are given the class 'blocked'
					*/
					$(element).addClass('blocked');
				} //if 
				
				else if (tmp[i] != 0 && i >= 4) {
					//tile evaluated is not in first row, and not a 0
					if (!(getElement('data-pos~=', i - 4).hasClass('blocked'))) {
						// position above current tile is empty 
						tmp[i - 4] += tmp[i];
						tmp[i] = 0;
						moved.push(i);
						moveMade = true;
					} //if position above current tile is empty
					else {
						// position above current tile is NOT empty
						if ((tmp[i] == 1 && tmp[i - 4] == 2) || (tmp[i] == 2 && tmp[i - 4] == 1) || (tmp[i] == tmp[i - 4] && tmp[i] > 2)) {
							tmp[i - 4] += tmp[i];
							tmp[i] = 0;
							moved.push(i);
							moveMade = true;
							mergeMade = true;
						} //if
						else {
							$(element).addClass('blocked');
						} // else
					} // else
				} //else if 
			} // for
			break;
			
		case 'down':
			for (i = len - 1; i >= 0; i--) {
				element = getElement('data-pos~=', i);
				if (tmp[i] != 0 && i > 11) {
					/*bottom row is blocked by 'wall' unless no number is there
						those tiles are given the class 'blocked'
					*/
					$(element).addClass('blocked');
				} //if 
				
				else if (tmp[i] != 0 && i <= 11) {
					//tile evaluated is not in first row, and not a 0
					if (!(getElement('data-pos~=', i + 4).hasClass('blocked'))) {
						// position above current tile is empty 
						tmp[i + 4] += tmp[i];
						tmp[i] = 0;
						moved.push(i);
						moveMade = true;
					} //if position above current tile is empty
					else {
						// position above current tile is NOT empty
						if ((tmp[i] == 1 && tmp[i + 4] == 2) || (tmp[i] == 2 && tmp[i + 4] == 1) || (tmp[i] == tmp[i + 4] && tmp[i] > 2)) {
							tmp[i + 4] += tmp[i];
							tmp[i] = 0;
							moved.push(i);
							moveMade = true;
							mergeMade = true;
						} //if
						else {
							$(element).addClass('blocked');
						} // else
					} // else
				} //else if 
			} // for
			break;
			
		case 'left':
			/* rowTop = [0, 1, 2, 3],
			rowMidTop = [4, 5, 6, 7],
			rowMidBottom = [8, 9, 10, 11],
			rowBottom = [12, 13, 14, 15]; */
			var tmpArr = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
			for (i = 0; i < tmpArr.length; i++) {
				element = getElement('data-pos~=', tmpArr[i]);
				if ((tmp[tmpArr[i]] != 0) && (tmpArr[i] == 0 || tmpArr[i] == 4 || tmpArr[i] == 8 || tmpArr[i] == 12)) {
					/*left column is blocked by 'wall' unless no number is there
						those tiles are given the class 'blocked'
					*/
					$(element).addClass('blocked');
				} //if 
				
				else if ((tmp[tmpArr[i]] != 0) && (tmpArr[i] != 0 && tmpArr[i] != 4 && tmpArr[i] != 8 && tmpArr[i] != 12)) {
					//tile evaluated is not in first row, and not a 0
					if (!(getElement('data-pos~=', tmpArr[i] - 1).hasClass('blocked'))) {
						// position above current tile is empty 
						tmp[tmpArr[i] - 1] += tmp[tmpArr[i]];
						tmp[tmpArr[i]] = 0;
						moved.push(tmpArr[i]);
						moveMade = true;
					} //if position above current tile is empty
					else {
						// position above current tile is NOT empty
						if ((tmp[tmpArr[i]] == 1 && tmp[tmpArr[i] - 1] == 2) || (tmp[tmpArr[i]] == 2 && tmp[tmpArr[i] - 1] == 1) || (tmp[tmpArr[i]] == tmp[tmpArr[i] - 1] && tmp[tmpArr[i]] > 2)) {
							tmp[tmpArr[i] - 1] += tmp[tmpArr[i]];
							tmp[tmpArr[i]] = 0;
							moved.push(tmpArr[i]);
							moveMade = true;
							mergeMade = true;
						} //if
						else {
							$(element).addClass('blocked');
						} // else
					} // else
				} //else if 
			} // for
			break;
			
		case 'right':
			/* rowTop = [0, 1, 2, 3],
			rowMidTop = [4, 5, 6, 7],
			rowMidBottom = [8, 9, 10, 11],
			rowBottom = [12, 13, 14, 15]; */
			var tmpArr = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
			for (i = tmpArr.length - 1; i >= 0; i--) {
				element = getElement('data-pos~=', tmpArr[i]);
				if ((tmp[tmpArr[i]] != 0) && (tmpArr[i] == 15 || tmpArr[i] == 11 || tmpArr[i] == 7 || tmpArr[i] == 3)) {
					/*left column is blocked by 'wall' unless no number is there
						those tiles are given the class 'blocked'
					*/
					$(element).addClass('blocked');
				} //if 
				
				else if ((tmp[tmpArr[i]] != 0) && (tmpArr[i] != 15 && tmpArr[i] != 11 && tmpArr[i] != 7 && tmpArr[i] != 3)) {
					//tile evaluated is not in first row, and not a 0
					if (!(getElement('data-pos~=', tmpArr[i] + 1).hasClass('blocked'))) {
						// position above current tile is empty 
						tmp[tmpArr[i] + 1] += tmp[tmpArr[i]];
						tmp[tmpArr[i]] = 0;
						moved.push(tmpArr[i]);
						moveMade = true;
					} //if position above current tile is empty
					else {
						// position above current tile is NOT empty
						if ((tmp[tmpArr[i]] == 1 && tmp[tmpArr[i] + 1] == 2) || (tmp[tmpArr[i]] == 2 && tmp[tmpArr[i] + 1] == 1) || (tmp[tmpArr[i]] == tmp[tmpArr[i] + 1] && tmp[tmpArr[i]] > 2)) {
							tmp[tmpArr[i] + 1] += tmp[tmpArr[i]];
							tmp[tmpArr[i]] = 0;
							moved.push(tmpArr[i]);
							moveMade = true;
							mergeMade = true;
						} //if
						else {
							$(element).addClass('blocked');
						} // else
					} // else
				} //else if 
			} // for
			break;
	}
	if (moveMade){
		printBoard(tmp);
	}
}

function move(direction) {
	var moveMade = false, mergeMade = false;
	resetElementClasses();
	var i, len = board.length, element, moved = [];
	switch (direction) {
		case 'up':
			for (i = 0; i < len; i++) {
				element = getElement('data-pos~=', i);
				if (board[i] != 0 && i < 4) {
					/*first row is blocked by 'wall' unless no number is there
						those tiles are given the class 'blocked'
					*/
					$(element).addClass('blocked');
				} //if 
				
				else if (board[i] != 0 && i >= 4) {
					//tile evaluated is not in first row, and not a 0
					if (!(getElement('data-pos~=', i - 4).hasClass('blocked'))) {
						// position above current tile is empty 
						board[i - 4] += board[i];
						board[i] = 0;
						moved.push(i);
						moveMade = true;
					} //if position above current tile is empty
					else {
						// position above current tile is NOT empty
						if ((board[i] == 1 && board[i - 4] == 2) || (board[i] == 2 && board[i - 4] == 1) || (board[i] == board[i - 4] && board[i] > 2)) {
							board[i - 4] += board[i];
							board[i] = 0;
							moved.push(i);
							moveMade = true;
							mergeMade = true;
						} //if
						else {
							$(element).addClass('blocked');
						} // else
					} // else
				} //else if 
			} // for
			break;
			
		case 'down':
			for (i = len - 1; i >= 0; i--) {
				element = getElement('data-pos~=', i);
				if (board[i] != 0 && i > 11) {
					/*bottom row is blocked by 'wall' unless no number is there
						those tiles are given the class 'blocked'
					*/
					$(element).addClass('blocked');
				} //if 
				
				else if (board[i] != 0 && i <= 11) {
					//tile evaluated is not in first row, and not a 0
					if (!(getElement('data-pos~=', i + 4).hasClass('blocked'))) {
						// position above current tile is empty 
						board[i + 4] += board[i];
						board[i] = 0;
						moved.push(i);
						moveMade = true;
					} //if position above current tile is empty
					else {
						// position above current tile is NOT empty
						if ((board[i] == 1 && board[i + 4] == 2) || (board[i] == 2 && board[i + 4] == 1) || (board[i] == board[i + 4] && board[i] > 2)) {
							board[i + 4] += board[i];
							board[i] = 0;
							moved.push(i);
							moveMade = true;
							mergeMade = true;
						} //if
						else {
							$(element).addClass('blocked');
						} // else
					} // else
				} //else if 
			} // for
			break;
			
		case 'left':
			/* rowTop = [0, 1, 2, 3],
			rowMidTop = [4, 5, 6, 7],
			rowMidBottom = [8, 9, 10, 11],
			rowBottom = [12, 13, 14, 15]; */
			var tmpArr = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
			for (i = 0; i < tmpArr.length; i++) {
				element = getElement('data-pos~=', tmpArr[i]);
				if ((board[tmpArr[i]] != 0) && (tmpArr[i] == 0 || tmpArr[i] == 4 || tmpArr[i] == 8 || tmpArr[i] == 12)) {
					/*left column is blocked by 'wall' unless no number is there
						those tiles are given the class 'blocked'
					*/
					$(element).addClass('blocked');
				} //if 
				
				else if ((board[tmpArr[i]] != 0) && (tmpArr[i] != 0 && tmpArr[i] != 4 && tmpArr[i] != 8 && tmpArr[i] != 12)) {
					//tile evaluated is not in first row, and not a 0
					if (!(getElement('data-pos~=', tmpArr[i] - 1).hasClass('blocked'))) {
						// position above current tile is empty 
						board[tmpArr[i] - 1] += board[tmpArr[i]];
						board[tmpArr[i]] = 0;
						moved.push(tmpArr[i]);
						moveMade = true;
					} //if position above current tile is empty
					else {
						// position above current tile is NOT empty
						if ((board[tmpArr[i]] == 1 && board[tmpArr[i] - 1] == 2) || (board[tmpArr[i]] == 2 && board[tmpArr[i] - 1] == 1) || (board[tmpArr[i]] == board[tmpArr[i] - 1] && board[tmpArr[i]] > 2)) {
							board[tmpArr[i] - 1] += board[tmpArr[i]];
							board[tmpArr[i]] = 0;
							moved.push(tmpArr[i]);
							moveMade = true;
							mergeMade = true;
						} //if
						else {
							$(element).addClass('blocked');
						} // else
					} // else
				} //else if 
			} // for
			break;
			
		case 'right':
			/* rowTop = [0, 1, 2, 3],
			rowMidTop = [4, 5, 6, 7],
			rowMidBottom = [8, 9, 10, 11],
			rowBottom = [12, 13, 14, 15]; */
			var tmpArr = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
			for (i = tmpArr.length - 1; i >= 0; i--) {
				element = getElement('data-pos~=', tmpArr[i]);
				if ((board[tmpArr[i]] != 0) && (tmpArr[i] == 15 || tmpArr[i] == 11 || tmpArr[i] == 7 || tmpArr[i] == 3)) {
					/*left column is blocked by 'wall' unless no number is there
						those tiles are given the class 'blocked'
					*/
					$(element).addClass('blocked');
				} //if 
				
				else if ((board[tmpArr[i]] != 0) && (tmpArr[i] != 15 && tmpArr[i] != 11 && tmpArr[i] != 7 && tmpArr[i] != 3)) {
					//tile evaluated is not in first row, and not a 0
					if (!(getElement('data-pos~=', tmpArr[i] + 1).hasClass('blocked'))) {
						// position above current tile is empty 
						board[tmpArr[i] + 1] += board[tmpArr[i]];
						board[tmpArr[i]] = 0;
						moved.push(tmpArr[i]);
						moveMade = true;
					} //if position above current tile is empty
					else {
						// position above current tile is NOT empty
						if ((board[tmpArr[i]] == 1 && board[tmpArr[i] + 1] == 2) || (board[tmpArr[i]] == 2 && board[tmpArr[i] + 1] == 1) || (board[tmpArr[i]] == board[tmpArr[i] + 1] && board[tmpArr[i]] > 2)) {
							board[tmpArr[i] + 1] += board[tmpArr[i]];
							board[tmpArr[i]] = 0;
							moved.push(tmpArr[i]);
							moveMade = true;
							mergeMade = true;
						} //if
						else {
							$(element).addClass('blocked');
						} // else
					} // else
				} //else if 
			} // for
			break;
	}
	if (moveMade){
		printBoard(board);
		addTile(direction, moved);
		if (next.length < 1)
			getNumbers();
		nextNumber();
	}
	if (mergeMade)
		getScore();
}

function getScore() {
	/*var scores = {3 : 6, 6 : 9, 12 : 27, 24 : 81, 48 : 243,  96 : 729, 192 : 2187, 384 : 6561, 768 : 19683, 1536 : 59049, 3072 : 177147, 6144 : 531441}; */
	var total = 0;
	for (var i = 0; i < board.length; i++) {
		if (board[i] > 3) { 
			var tmp = 3, count = 1, totalt;
			do {
				count++; // 2 // 3 
				tmp *= 2; // 3 * 2 => 6 // 6 * 2 => 12
				totalt = Math.pow(3, count);
			} while (tmp < board[i]); // 6 < 24 // 
			total += totalt;
		}
		else if (board[i] == 3) 
			total += 3;
	}
	score = total; // score = 3 * 3 => 6
	$('#score').html(score);
}

function getNumbers() {
	var tmp;
	//10 numbers added to array
	while (next.length < 10) {
		tmp = getRandomNumber(3);
		if (tmp == 1) {
			if (offset > 2) {
				while (offset != 0) {
					next.push(2);
					offset -= 1;
				}
			}
			else {next.push(tmp); offset += 1;}
		}
		else if (tmp == 2) {
			if (offset < -2){
				while (offset != 0){
					next.push(1);
					offset += 1;
				}
			}
			else {next.push(tmp); offset -= 1;}
		}
		
		else next.push(tmp);
	}
	// shuffle array

/*	for (var i = 0; i < next.length; i++) {
		var j, tmp;
		j = Math.floor(Math.random() * next.length);
		tmp = next[i];
		next[i] = next[j];
		next[j] = tmp;
	}*/
}

function nextNumber() {
	var el = document.getElementById('number');
	el.innerHTML = next[0];
	el.style.backgroundColor = getColor(next[0]);
	el.style.color = 'white';
	el.style.fontSize = '200%';
	el.style.textAlign = 'center';
	checkAvailableMoves();
}

function checkAvailableMoves() {
	/*
	var rowTop = [0, 1, 2, 3],
			rowMidTop = [4, 5, 6, 7],
			rowMidBottom = [8, 9, 10, 11],
			rowBottom = [12, 13, 14, 15]; 
	var columnLeft = [0, 4, 8, 12],
			columnMidLeft = [1, 5, 9, 13],
			columnMidRight = [2, 6, 10, 14],
			columnRight = [3, 7, 11, 15];
	*/
	var moveAvailable = false;
	for (var i = 0; i < board.length; i++) {
		if (board[i] == 0){
			moveAvailable = true;}
		if (i === 1 || i === 2 || i === 5 || i === 6 || i === 9 || i === 10 || i === 13 || i === 14) { //middle numbers, checking left or right won't have a chance of changing rows
			if ((board[i] === 2) && (board[i - 1] === 1 || board[i - 4] === 1 || board[i + 1] === 1 || board[i + 4] === 1)){
				moveAvailable = true;}
			else if ((board[i] === 1) && (board[i - 1] === 2 || board[i - 4] === 2 || board[i + 1] === 2 || board[i + 4] === 2)){
				moveAvailable = true;}
			else if ((board[i] > 2) && (board[i] === board[i - 1] || board[i] === board[i - 4] || board[i] === board[i + 1] || board[i] === board[i + 4])){
				moveAvailable = true;}
		}
		else if (i === 0 || i === 4 || i === 8 || i === 12) {
			//left column, only check up and down and to right
			if ((board[i] === 2) && (board[i + 1] === 1 || board[i - 4] === 1 || board[i + 4] === 1)){
				moveAvailable = true;}
			else if ((board[i] === 1) && (board[i + 1] === 2 || board[i - 4] === 2 || board[i + 4] === 2)){
				moveAvailable = true;}
			else if ((board[i] > 2) && (board[i] === board[i - 4] || board[i] === board[i + 1] || board[i] === board[i + 4])) {
				moveAvailable = true;}
		}
		else if (i === 3 || i === 7 || i === 11 || i === 15) {
			//right column, only check up and down and to left
			if ((board[i] === 2) && (board[i - 1] === 1 || board[i - 4] === 1 || board[i + 4] === 1)){
				moveAvailable = true;}
			else if ((board[i] === 1) && (board[i - 1] === 2 || board[i - 4] === 2 || board[i + 4] === 2)){
				moveAvailable = true;}
			else if ((board[i] > 2) && (board[i] === board[i - 4] || board[i] === board[i - 1] || board[i] === board[i + 4])) {
				moveAvailable = true;}
		}
	}
	if (moveAvailable == false) {
		gameOver = true;
		$('#next-number').html('No moves Available!');
		$('#number').html('');
		animateScore();
	}
}

function animateScore() {
	var colors = ['blue', 'red', 'yellow', 'green'],
			count = -1, el = document.getElementById('score');
	animationIntv = setInterval(function(){
		if (gameOver)	{
			count++;
			if (count == colors.length)
				count = 0;
			el.style.color = colors[count];
		}
		else {
			clearInterval(animationIntv);
			animationIntv = undefined;
			el.style.color = 'white';
		}
	}, 50);
}

function addTile(direction, moved) {
	var columnLeft = [0, 4, 8, 12],
			columnMidLeft = [1, 5, 9, 13],
			columnMidRight = [2, 6, 10, 14],
			columnRight = [3, 7, 11, 15];
	var rowTop = [0, 1, 2, 3],
			rowMidTop = [4, 5, 6, 7],
			rowMidBottom = [8, 9, 10, 11],
			rowBottom = [12, 13, 14, 15];
	var tmpIdx = getRandomNumberLow(moved.length);
		// ^^ this gets a random number from the number of tiles that were involved in the last move
		//    this is then used as a random index to select a position to replace one of the moved tiles 
	var tmpTile = moved[tmpIdx]; 
		// ^^ set the new tile's position to a random index of one of the moved columns/rows 

	switch(direction) {
	case 'right':
		if (rowTop.indexOf(tmpTile) != -1)
			board[0] += next[0];
		else if (rowMidTop.indexOf(tmpTile) != -1)
			board[4] += next[0];
		else if (rowMidBottom.indexOf(tmpTile) != -1)
			board[8] += next[0];
		else if (rowBottom.indexOf(tmpTile) != -1)
			board[12] += next[0];
		break;
	case 'left':
		if (rowTop.indexOf(tmpTile) != -1)
			board[3] += next[0];
		else if (rowMidTop.indexOf(tmpTile) != -1)
			board[7] += next[0];
		else if (rowMidBottom.indexOf(tmpTile) != -1)
			board[11] += next[0];
		else if (rowBottom.indexOf(tmpTile) != -1)
			board[15] += next[0];
		break;
		case 'up':
			if (columnLeft.indexOf(tmpTile) != -1)
				board[12] += next[0];
			else if (columnMidLeft.indexOf(tmpTile) != -1)
				board[13] += next[0];
			else if (columnMidRight.indexOf(tmpTile) != -1)
				board[14] += next[0];
			else if (columnRight.indexOf(tmpTile) != -1)
				board[15] += next[0];
			break;
		case 'down':
			if (columnLeft.indexOf(tmpTile) != -1)
				board[0] += next[0];
			else if (columnMidLeft.indexOf(tmpTile) != -1)
				board[1] += next[0];
			else if (columnMidRight.indexOf(tmpTile) != -1)
				board[2] += next[0];
			else if (columnRight.indexOf(tmpTile) != -1)
				board[3] += next[0];
			break;
	}
	next.shift();
	printBoard(board);
}

function resetElementClasses() {
	var elements = document.querySelectorAll('[data-pos]');
  for (var i = 0; i < elements.length; i++) {
		elements[i].className = '';
  }
}

function getElement(attrib, p) {
	return $('[' + attrib + p + ']');
}

function getColor(number) {
	if (number >= 3) 
		return 'gray';
	else if (number == 2) 
		return 'red';
	else if (number == 1)
		return 'blue';
	else if (number == 0)
		return 'black';
}
function notIncluded(arr, num) {
	for (var i in arr)
		if (num == arr[i])
			return false;
	return true;
}

function getRandomNumber(num) {
	return Math.floor((Math.random() * num) + 1);
}

function getRandomNumberLow(num) {
	//used for populating the board initially
	return Math.floor(Math.random() * num);
}

function printBoard(b) {
	var len = b.length, i, element;
	for (i = 0; i < len; i++) {
		element = getElement('data-pos~=', i);
		if (b[i] != 0) {
			$(element).html(b[i]);
			$(element).css('background-color', getColor(b[i]));
		}
		else {
			$(element).html('');
			$(element).css('background-color', getColor(b[i]));
		}
	}
}

/* MOVING */
function keyEvent(e, type) {
	//type is 'preview' on keydown
	//type is 'commit' on keyup
	if (gameOver) return;
	var key = e.keyCode;
	if (type == 'commit' && commitMove) {
		if (previewing && previewKey == key)
		switch(key) {
			case 32: // spacebar
				commitMove = false;
				previewing = false;
				printBoard(board);
				console.log('setting commitMove to false');
				break;
			case 37:
				previewing = false;
				move('left');
				break;
			case 38: 
				previewing = false;
				move('up');
				break;
			case 39:
				previewing = false;
				move('right');
				break;
			case 40:
				previewing = false;
				move('down');
				break;
		}
		else if (previewing && key == 32)
		{
			commitMove = false;
			previewing = false;
			printBoard(board);
			console.log('setting commitMove to false');
		}
		else return;
	}
	else if (commitMove == false) {
			commitMove = true;
	}
	else if (type == 'preview') {
	if (!previewing)
		switch(key) {
			case 32: // spacebar
				commitMove = false;
				previewing = false;
				printBoard(board);
				console.log('setting commitMove to false');
				break; 
			case 37:
				previewing = true;
				previewKey = key;
				previewMove('left');
				break;
			case 38: 
				previewing = true;
				previewKey = key;
				previewMove('up');
				break;
			case 39:
				previewing = true;
				previewKey = key;
				previewMove('right');
				break;
			case 40:
				previewing = true;
				previewKey = key;
				previewMove('down');
				break;
		}
	else return;
	}
}
