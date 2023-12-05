// Define constants for elements
const ELEMENTS = {
    gridContainer: document.getElementById('gridContainer'),
    checkSolutionBtn: document.getElementById('checkSolutionBtn'),
    resultMessage: document.getElementById('resultMessage'),
    randomPuzzleBtn: document.getElementById('randomPuzzleBtn'),
    colorButtonContainer: document.getElementById('colorButtonContainer'),
    letterButtonContainer: document.getElementById('letterButtonContainer'),
    clearCellBtn: document.getElementById('clearCellBtn'),
	clearAllBtn: document.getElementById('clearAllBtn')
};

// Define state variables
let state = {
    currentPuzzle: null,
    selectedColor: '',
    selectedLetter: '',
    selectedCell: null,
    usedCombinations: new Set(),
    colorCount: {},
    letterCount: {}
};

// Define constants for colors and letters
const COLORS = ['red', 'green', 'blue'];
const LETTERS = ['A', 'B', 'C'];

// Initialize color and letter count
COLORS.forEach(color => state.colorCount[color] = 0);
LETTERS.forEach(letter => state.letterCount[letter] = 0);

// Create buttons for selecting colors
COLORS.forEach(color => {
    const colorBtn = document.createElement('button');
    colorBtn.textContent = color;
    colorBtn.classList.add('color-btn');
    colorBtn.dataset.color = color;
    colorBtn.addEventListener('click', () => {
        if (state.selectedColor === color) {
            state.selectedColor = ''; // Unselect the color
            colorBtn.style.backgroundColor = ''; // Change the background color back to normal
        } else if (state.colorCount[color] < 3) {
            // Unselect the previously selected color button
            if (state.selectedColor) {
                const prevColorBtn = document.querySelector(`.color-btn[data-color="${state.selectedColor}"]`);
                if (prevColorBtn) prevColorBtn.style.backgroundColor = '';
            }
            state.selectedColor = color; // Set the selected color here
            colorBtn.style.backgroundColor = 'black'; // Change the background color to black
        } else {
            console.log('Maximum limit for this color reached');
        }
    });
    ELEMENTS.colorButtonContainer.appendChild(colorBtn);
});

// Create buttons for selecting letters
LETTERS.forEach(letter => {
    const letterBtn = document.createElement('button');
    letterBtn.textContent = letter;
    letterBtn.classList.add('letter-btn');
    letterBtn.dataset.letter = letter; // Set the data-letter attribute here
    letterBtn.addEventListener('click', () => {
        if (state.selectedLetter === letter) {
            state.selectedLetter = ''; // Unselect the letter
            letterBtn.style.backgroundColor = ''; // Change the background color back to normal
        } else if (state.letterCount[letter] < 3) {
            // Unselect the previously selected letter button
            if (state.selectedLetter) {
                const prevLetterBtn = document.querySelector(`.letter-btn[data-letter="${state.selectedLetter}"]`);
                if (prevLetterBtn) prevLetterBtn.style.backgroundColor = '';
            }
            state.selectedLetter = letter; // Set the selected letter here
            letterBtn.style.backgroundColor = 'black'; // Change the background color to black
        } else {
            console.log('Maximum limit for this letter reached');
        }
    });
    ELEMENTS.letterButtonContainer.appendChild(letterBtn);
});

// Define puzzles
let PUZZLES = [];

fetch('puzzles.json')
    .then(response => response.json())
    .then(data => {
        PUZZLES = data;
        const randomPuzzle = generateRandomPuzzle();
        generateGridFromPuzzle(randomPuzzle);
    })
    .catch(error => console.error('Error:', error));

// Function to log messages
function log(message) {
    console.log(message);
}

// Function to generate grid from puzzle
function generateGridFromPuzzle(puzzleData) {
    state.currentPuzzle = puzzleData;
    log('Generating grid from puzzle');
    const rows = 3;
    const cols = 3;

    for (let row = 0; row < rows; row++) {
        const currentRowContainer = document.createElement('div');
        currentRowContainer.classList.add('grid-row');
        ELEMENTS.gridContainer.appendChild(currentRowContainer);

        for (let col = 0; col < cols; col++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.setAttribute('data-row', row);
            gridItem.setAttribute('data-col', col);
            gridItem.addEventListener('click', handleGridClick);
            gridItem.style.backgroundColor = 'white';
            currentRowContainer.appendChild(gridItem);
        }
    }

    // Display hints
    const hintContainer = document.getElementById('hintsList'); // Use the hintsList as the container for hints
    hintContainer.innerHTML = ''; // Clear previous hints
    puzzleData.hints.forEach(hint => { // Assuming each puzzle has a 'hints' property which is an array of strings
        const hintElement = document.createElement('li');
        hintElement.textContent = hint;
        hintContainer.appendChild(hintElement);
    });
}

// Event listener for clear cell button click
ELEMENTS.clearCellBtn.addEventListener('click', () => {
    // Deselect any selected color or letter
    if (state.selectedColor) {
        const prevColorBtn = document.querySelector(`.color-btn[data-color="${state.selectedColor}"]`);
        if (prevColorBtn) prevColorBtn.style.backgroundColor = '';
        state.selectedColor = '';
    }
    if (state.selectedLetter) {
        const prevLetterBtn = document.querySelector(`.letter-btn[data-letter="${state.selectedLetter}"]`);
        if (prevLetterBtn) prevLetterBtn.style.backgroundColor = '';
        state.selectedLetter = '';
    }

    // Highlight the Clear Cell button
    ELEMENTS.clearCellBtn.style.backgroundColor = 'black';

    // Set a flag to indicate that the next cell click should clear the cell
    state.clearCellNextClick = true;
});

// Event listener for clear all button click
ELEMENTS.clearAllBtn.addEventListener('click', () => {
    // Clear all cells
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.style.backgroundColor = 'white';
        item.innerHTML = '';
    });

    // Reset state variables
    state.selectedColor = '';
    state.selectedLetter = '';
    state.selectedCell = null;
    state.usedCombinations = new Set();
    COLORS.forEach(color => state.colorCount[color] = 0);
    LETTERS.forEach(letter => state.letterCount[letter] = 0);

    // Reset color and letter buttons
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => btn.style.backgroundColor = '');
    const letterBtns = document.querySelectorAll('.letter-btn');
    letterBtns.forEach(btn => btn.style.backgroundColor = '');
});

function handleGridClick(event) {
    log('Handling grid click');
    const clickedCell = event.target;
	
	// If the clearCellNextClick flag is set, clear the cell and unset the flag
	if (state.clearCellNextClick) {
		if (clickedCell.style.backgroundColor !== 'white') {
			state.colorCount[clickedCell.style.backgroundColor]--;
			if (clickedCell.innerHTML.trim() !== '') {
				state.letterCount[clickedCell.innerHTML.trim()]--;
				// Remove the combination from the usedCombinations set
				const combination = `${clickedCell.style.backgroundColor} ${clickedCell.innerHTML.trim()}`;
				state.usedCombinations.delete(combination);
			}
		}
		clickedCell.style.backgroundColor = 'white';
		clickedCell.innerHTML = '';
		state.clearCellNextClick = false;

		// Unhighlight the Clear Cell button
		ELEMENTS.clearCellBtn.style.backgroundColor = '';

		return;
	}

    const currentColor = state.selectedColor || clickedCell.style.backgroundColor;
    const currentLetter = state.selectedLetter || clickedCell.innerHTML.trim();

    // If both a color and a letter are selected, check for duplicate combinations
    if (currentColor !== 'white' && currentLetter !== '') {
        const currentCombination = `${currentColor} ${currentLetter}`;

        // Check if the combination has been used before
        if (state.usedCombinations.has(currentCombination)) {
            log('This combination has been used before.');
            return;
        } else {
            // If the cell already has a color and a letter, remove the old combination
            if (clickedCell.style.backgroundColor !== 'white' && clickedCell.innerHTML.trim() !== '') {
                const oldCombination = `${clickedCell.style.backgroundColor} ${clickedCell.innerHTML.trim()}`;
                state.usedCombinations.delete(oldCombination);
            }

            state.usedCombinations.add(currentCombination);
        }
    }
	
    // If a color or letter is selected, update the cell
    if (state.selectedColor && state.colorCount[currentColor] < 3) {
        // If the cell already has a color, decrement the count for that color
        if (clickedCell.style.backgroundColor !== 'white') {
            state.colorCount[clickedCell.style.backgroundColor]--;
        }

        clickedCell.style.backgroundColor = currentColor;
        state.colorCount[currentColor]++;
    }
    if (state.selectedLetter && state.letterCount[currentLetter] < 3) {
        // If the cell already has a letter, decrement the count for that letter
        if (clickedCell.innerHTML.trim() !== '') {
            state.letterCount[clickedCell.innerHTML.trim()]--;
        }

        clickedCell.innerHTML = currentLetter;
        state.letterCount[currentLetter]++;
    }
}

// Function to generate random puzzle
function generateRandomPuzzle() {
    log('Generating random puzzle');
    const randomIndex = Math.floor(Math.random() * PUZZLES.length);
    return PUZZLES[randomIndex];
}

// Event listener for random puzzle button click
ELEMENTS.randomPuzzleBtn.addEventListener('click', () => {
    log('Random puzzle button clicked');
    clearGrid();
    const randomPuzzle = generateRandomPuzzle();
    generateGridFromPuzzle(randomPuzzle);
});

// Event listener for check solution button click
ELEMENTS.checkSolutionBtn.addEventListener('click', () => {
    if (!state.currentPuzzle) {
        console.error('No puzzle loaded');
        return;
    }
    const currentGrid = getCurrentGrid();
    const solution = state.currentPuzzle.data;

    if (compareGrids(currentGrid, solution)) {
        ELEMENTS.resultMessage.textContent = "Congratulations! Puzzle solved correctly!";
    } else {
        ELEMENTS.resultMessage.textContent = "Oops! Puzzle solution is incorrect. Try again!";
    }
});

// Function to get current grid
function getCurrentGrid() {
    const grid = [];
    const gridItems = document.querySelectorAll('.grid-item');
    let row = [];

    gridItems.forEach((item, index) => {
        if (index !== 0 && index % 3 === 0) {
            grid.push(row);
            row = [];
        }

        const color = item.style.backgroundColor;
        const symbol = item.innerHTML.trim();
        row.push({ color, symbol });
    });

    grid.push(row);
    return grid;
}

// Function to compare grids
function compareGrids(gridA, gridB) {
    for (let row = 0; row < gridA.length; row++) {
        for (let col = 0; col < gridA[row].length; col++) {
            if (gridA[row][col].color !== gridB[row][col].color || gridA[row][col].symbol !== gridB[row][col].symbol) {
                return false;
            }
        }
    }
    return true;
}


