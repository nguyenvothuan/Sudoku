import solver from './gameSolver.js';




function gameGenerator(difficulty) {
    //if difficulty is easy 30 clues are included, medium 25, hard 20.
    let grid = new Array(9);
    for (let i = 0; i < 9; i++) {
        grid[i] = new Array(9);
        grid[i].fill('-');
    }
    let square1 = random3x3(); let square2 = random3x3();let square3 = random3x3();
    let count=0;
    for (let i=0;i<3;i++)
    {
        for (let j=0;j<3;j++)
        {
            grid[i][j] = square1[count];
            grid[i+3][j+3] =square2[count];
            grid[i+6][j+6] = square3[count++];
        }
    }
    solver(grid); //remember to return a string of tile with 81 numbers inside
    const puzzle= new Array;
    
    puzzle[1] = [];
    grid.forEach(row => {
        puzzle[1] = puzzle[1].concat(row); //concat a full row of the solved grid into the puzzle.
    })
    let numRm;
    switch (difficulty){
        case('easy'): numRm = 81-35;
        case('medium'): numRm = 81-30;
        case('hard'): numRm=81-25;
    }
    puzzle[0] = removeOutOf81(puzzle[1], numRm).replace(/\,/g,'');
    puzzle[1] = puzzle[1].toString().replace(/\,/g,'');//solution
    console.log(puzzle);
    return puzzle;
}
function removeOutOf81(puzzle1, numToRemove) {//modify grid by removing randomly numToRemove tiles
    let arr = [];
    // console.log(puzzle1);
    let puzzle0 = puzzle1.slice(); //clone not modify
    for(let i=0;i<81;i++) arr[i] = i;
    for (let i=81;i>numToRemove;i--){
        //return a number from 0 to i-1
        let rmIndex = getRandomInt(i);
        puzzle0.splice(arr[rmIndex],1,'-');
        arr.splice(rmIndex, 1);
    }
    puzzle0 = puzzle0.toString();
    return puzzle0;
}
function random3x3() {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let res =[];
    for (let i=9;i>0;i--){
        let rmIndex = getRandomInt(i);//from 0 to i-1
        res.push(arr[rmIndex]);
        arr.splice(rmIndex, 1);
    }
    return res;
}
function getRandomInt(max) {//return a random number from zero to max-1
    return Math.floor(Math.random() * max);
}



export default gameGenerator;