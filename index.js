const tileHolder = document.querySelector('.tile-holder')
const rack = document.querySelector('.rack')
const boxStack = document.querySelectorAll('.box-stack')
const checkBtn = document.querySelector('.check')
const listOfWords = document.querySelector('.words')
const tPoint = document.querySelector('.point')
const overLay = document.querySelector('.overlay')
const blanks = document.querySelector('.blanks')
const confirmBlanks = document.querySelector('.confirm-blank')
const replaceBlank = document.querySelector('.replacement')

let gameCount = 0

let totalTile = []

let rackArray = []

let board = []

let countTile = 0

let arrayOfTotalWordsAndPoint = []

let trippleMult = []
let isTripple = false

let doubleMult = []
let isDouble = false

let isLeftToRightDirect = false
let isTopBottomDirect = false 

let firstClick = false

let saveFirstBtn = []

let leftRightArray = [] 
let isLeftInnerBranch =[] 

let topBottomArray = []
let isTopInnerBranch =[]

let countDracula = 0

let exp

let isValid 
let fillter1 

//class for rack
let className = " "

let clickedRep = 0
let miniA = []
let reScan = false

let isRackFull = false

createBoard()

createTotalTile()

//move tiles from tile holder to rack
tileHolder.addEventListener('click', ()=>{
    moveTileToRack()
    tileHolder.innerHTML = `${totalTile.length} tiles left`
    refillRack() 
})

//move from totalTile to rackArray
function moveTileToRack() {
    if (rackArray.length < 7  && totalTile.length > 0 && isRackFull == false){
        let num = Math.floor(Math.random() * totalTile.length)
        totalTile[num].countTile = countTile
        rackArray.push(totalTile[num])
        totalTile.splice(num, 1)
        countTile++
    }else{
        return
    }

    if (rackArray.length >= 7) {
        isRackFull = true
    }
}

//function to refill Rack
function refillRack() {
    const mapTiles = rackArray.map((tile, index) => {
        let p = `<span class="tile-span">${tile.point}</span>`
        if (tile.point == 0) {
            p = ""
        }

        if (tile.isClicked == true) {
            className = "selected"
        }else {
            className = "tile"
        }
        return `
            <div class=${className} onClick="checkRackClick(${index})"><p class="tile-para">${tile.letter}</p>${p}</div>
        `
    })
    
    rack.innerHTML = mapTiles.join("")
}
//fuction to change specified rack.isClicked to true
function checkRackClick(index){
    for (let i = 0; i < rackArray.length; i++) {
       rackArray[i].isClicked = false
    }
    rackArray[index].isClicked = true

    refillRack()
}

for (let i = 0; i < 15; i++) {
    createBox(i)
}

let trippleWord = [[0, 1], [0, 8], [0, 15], [7, 1], [7, 15], [14, 1], [14, 8], [14, 15]]
let trippleLetter = [[1, 6], [1, 10], [5, 2], [5, 6], [5, 10], [5, 14], [9, 2], [9, 6], [9, 10], [9, 14], [13, 6], [13, 10]]

let doubleWord = [[1, 2], [1, 14], [2, 3], [2, 13], [3, 4], [3, 12], [4, 5], [4, 11], [10, 5],
[10, 11], [11, 4], [11, 12], [12, 3], [12, 13], [13, 2], [13, 14]]
let doubleLetter = [[0, 4], [7, 8], [0, 12], [2, 7], [2, 9], [3, 1], [3, 8], [3, 15], [6, 3], [6, 7], [6, 9], [6, 13], [7, 4], [7, 12], 
[8, 3], [8, 7], [8, 9], [8, 13], [11, 1], [11, 8], [11, 15], [12, 7], [12, 9], [14, 4], [14, 12]]

checkBtn.addEventListener('click', ()=>{
    let confirm = []
    let checkFalse = 0
    isValid = true
    fillter1 = true
    if (leftRightArray.length > 0) {
       checkLeftArray(confirm, checkFalse)
    }else if (topBottomArray.length > 0) {
        checkTopArray(confirm, checkFalse)
        
    }else {
        isValid = false
    }
    if (isValid == true) {
        joinWordAndCalculateTripplePoint()
        joinWordAndCalculateDoubleWord()
        calTrippleLetterSideWay()
        calTrippleLetteTop()
        calDoubleLetterSideWay() 
        calDoubleLetterTop()
        concatWordLeft()
        concatWordTop()
        createList()
        calTotalWord()
        console.log(doubleMult)
        resetGame()
    }else {
        return
    }
    for (let i = 0; i < 15; i++) {
        createBox(i)
    }
})
function calTotalWord() {
    let totalPoint = 0
    arrayOfTotalWordsAndPoint.forEach(word => {
        totalPoint += word[1]
    })
    tPoint.innerHTML = totalPoint

}

function createList() {
    const list = arrayOfTotalWordsAndPoint.map((word, i) => {
        return `
            <div class="word-child">
                <p>${word[0]}</p>
                <p>${word[1]}</p>
            </div>
        `
    })

    listOfWords.innerHTML = list.join("")
}

//function to create board
function createBox(index) {
    let currentName
    let p
    const mapBox = board[index].map((box, i) => {
            if ((index == 0 && i == 1) || (index == 0 && i == 8) || (index == 0 && i == 15) ||
                (index == 7 && i == 1) || (index == 7 && i == 15) || (index == 14 && i == 1) || (index == 14 && i == 8) || 
                (index == 14 && i == 15)){
                if(box != 'empty' && box.isClicked == true) {
                    currentName = "tw-filled"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else if (box != 'empty' && box.isClicked == false) {
                    currentName = "tw-filled-false"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else{
                    currentName = "tripple-word"
                    p = "TW"
                }   

            }else if ((index == 1 && i == 6) || (index == 1 && i == 10) || (index == 5 && i == 2) || 
                (index == 5 && i == 6) || (index == 5 && i == 10) || (index == 5 && i == 14) || 
                (index == 9 && i == 2) || (index == 9 && i == 6) || (index == 9 && i == 10) || (index == 9 && i == 14) || 
                (index == 13 && i == 6) || (index == 13 && i == 10) ) {
                if(box != 'empty' && box.isClicked == true) {
                    currentName = "tl-filled"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else if (box != 'empty' && box.isClicked == false) {
                    currentName = "tl-filled-false"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else{
                    currentName = "tripple-letter"
                    p = "TL"
                }   

            }else if ((index == 1 && i == 2) || (index == 1 && i == 14) || (index == 2 && i == 3) || (index == 2 && i == 13) ||
                (index == 3 && i == 4) || (index == 3 && i == 12) || (index == 4 && i == 5) || (index == 4 && i == 11) || (index == 10 && i == 5) ||
                (index == 10 && i == 11) || (index == 11 && i == 4) || (index == 11 && i == 12) || (index == 12 && i == 3) || (index == 12 && i == 13) ||
                (index == 13 && i == 2) || (index == 13 && i == 14)) {

                if(box != 'empty' && box.isClicked == true) {
                    currentName = "dw-filled"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else if (box != 'empty' && box.isClicked == false) {
                    currentName = "dw-filled-false"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else{
                    currentName = "double-word"
                    p = "DW"
                }

            }else if ((index == 0 && i == 4) || (index == 0 && i == 12) || (index == 2 && i == 7) || (index == 2 && i == 9) || (index == 3 && i == 1) ||
                (index == 3 && i == 8) || (index == 3 && i == 15) || (index == 6 && i == 3) || (index == 6 && i == 7) || (index == 6 && i == 9) || (index == 6 && i == 13) ||
                (index ==  7 && i == 4) || (index == 7 && i == 12) || (index == 8 && i == 3) ||  (index == 8 && i == 7) || (index == 8 && i == 9) ||
                (index == 8 && i == 13) || (index == 11 && i == 1) || (index == 11 && i == 8) || (index == 11 && i == 15) || (index == 12 && i == 7) ||
                (index == 12 && i == 9) || (index == 14 && i == 4) || (index == 14 && i == 12)) {
                
                if(box != 'empty' && box.isClicked == true) {
                    currentName = "dl-filled"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else if (box != 'empty' && box.isClicked == false) {
                    currentName = "dl-filled-false"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else{
                    currentName = "double-letter"
                    p = "DL"
                }

            }else {
                if(box != 'empty' && box.isClicked == true) {
                    currentName = "filled"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else if (box != 'empty' && box.isClicked == false) {
                    currentName = "filled-false"
                    p = `<p>${box.letter}</p><span>${box.point}</span>`
                }else{
                    currentName = "box"
                    p = ""
                }
                
            }  
                
            if (box.point == 0) {
                p = `<p>${box.letter}</p>`
            }
            

     
        if (i == 0 || i == 16) {
            currentName = "invicible"
        }

        if (index == 7 && i == 8 && box == 'empty') {
            currentName = "middle-box"
        }

        return `
            <div class=${currentName} onclick="boxClicked(${index},${i})">${p}</div>
        `
    })
    
    boxStack[index].innerHTML = mapBox.join("")
}

let arrayOfBlanksReplacement = [{letter: 'A', selected: false}, {letter: 'B', selected: false}, {letter: 'C', selected: false}, {letter: 'D', selected: false},
{letter: 'E', selected: false}, {letter: 'F', selected: false}, {letter: 'G', selected: false}, {letter: 'H', selected: false}, {letter: 'I', selected: false}, 
{letter: 'J', selected: false}, {letter: 'K', selected: false}, {letter: 'L', selected: false}, {letter: 'M', selected: false}, {letter: 'N', selected: false},
{letter: 'O', selected: false}, {letter: 'P', selected: false}, {letter: 'Q', selected: false}, {letter: 'R', selected: false}, {letter: 'S', selected: false}, 
{letter: 'T', selected: false}, {letter: 'V', selected: false}, {letter: 'W', selected: false}, {letter: 'X', selected: false}, {letter: 'Y', selected: false}, 
{letter: 'Z', selected: false}]

let hasbeenConfirmed = false
function fillInTheBlank(index, j, isEm) {
    blanks.classList.add('active')
    overLay.classList.add('active')
    mapRePlacementBlank(index, j, isEm)
}

function mapRePlacementBlank(index, j, isEm) {
    const mapLetter = arrayOfBlanksReplacement.map((blank, k) => {
        return`
            <div class="mini-blank" onClick="saveLetter(${k} ,${index}, ${j}, ${isEm})" >${blank.letter}</div>
        `
    } )
    replaceBlank.innerHTML = mapLetter.join("")
}

function saveLetter(blank, index, j, isEm) {
    miniA = []
    arrayOfBlanksReplacement[blank].selected = true

    const repindex = arrayOfBlanksReplacement.findIndex((rep) => rep.selected == true) 

    rackArray[isEm].letter = arrayOfBlanksReplacement[repindex].letter
    clickedRep++

    miniA.push(index, j)

    arrayOfBlanksReplacement.forEach(b => {
        b.selected = false
    })
}


confirmBlanks.addEventListener('click', () =>{
    if (clickedRep > 0) {
        blanks.classList.remove('active')
        overLay.classList.remove('active')
        reScan = false
        hasbeenConfirmed = true
        boxClicked(miniA[0], miniA[1])
        console.log(miniA)
        clickedRep = 0
    }
})

//function to transfer tile from rack to board
function boxClicked(index, j) {
    let isEm
    for (let i = 0; i < rackArray.length; i++) {   
        if (rackArray[i].isClicked == true) {
            isEm = i
        }
    }

    if (hasbeenConfirmed == false && board[index][j] == "empty") {
        if (rackArray[isEm].letter == "") {
            fillInTheBlank(index, j, isEm)
            reScan = true 
        }
    }

    if (index == 0 && reScan == false && isRackFull == true) {
        const checkLeft = board[index][j-1]
        const checkRight = board[index][j+1]
        const checkBottom = board[index + 1][j]
        let howManyTruthLeft = 0
        let howManyTruthTop = 0
        let typeofcountleft = 0
        let typeofcountTop = 0
        
        let isEmpty
        for (let i = 0; i < rackArray.length; i++) {   
            if (rackArray[i].isClicked == true) {
                isEmpty = rackArray[i]
            }
        }

        countDraculafuncI(checkLeft, checkRight, checkBottom)

        if ((checkLeft != "empty" || checkRight != "empty" || checkBottom != "empty") && isEmpty  && board[index][j] == "empty") {
            countDracula++
            console.log(countDracula)
        }

        if (board[index][j] == "empty") {
            exp = true
        }else {
            exp = false
        }
        
        //calling function to remove tile
        if(board[index][j].isClicked == true && exp == false) {  
            removeTileFromBoard(index, j, howManyTruthLeft, howManyTruthTop, typeofcountleft, typeofcountTop)
        }

        //this statement saves the first tile index
        if (firstClick == false && exp == true && isEmpty) {  
            if (checkLeft != "empty" || checkRight != "empty" ) {
                checkLeftAndRightI(index, j, checkLeft, checkRight)  
                isLeftToRightDirect = true
            }else if (checkBottom != "empty") {
                checkTopToBottomI(index, j, checkBottom) 
                isTopBottomDirect = true
            }else{
                moveToBox(index, j) 
            } 
            countDracula = 1  
            saveFirstBtn = [index, j]
            firstClick = true
        } 
        
    
        //this statement determines the directio of the game
        if(isEmpty  && exp == true && firstClick == true){  
                if (saveFirstBtn.length > 0) {
                    if(index == saveFirstBtn[0]){      
                        checkLeftAndRightI(index, j, checkLeft, checkRight)   
                        if (countDracula < 2) {
                            isLeftToRightDirect = true
                        } 
                    }else if(j == saveFirstBtn[1] ) { 
                        checkTopToBottomI(index, j, checkBottom)  
                        if (countDracula < 2) {
                            isTopBottomDirect = true
                        } 
                    }
                    if(index == saveFirstBtn[0] && j == saveFirstBtn[1]){
                        if (checkBottom.isClicked == true) {
                            checkTopToBottomI(index, j, checkBottom)
                        }else if(checkLeft.isClicked == true || checkRight.isClicked == true){
                            checkLeftAndRightI(index, j, checkLeft, checkRight)
                        }
                        console.log("this left:", leftRightArray, "and", "this top: ", topBottomArray)
                    }
                }
                    
        }


        for (let i = 0; i < 15; i++) {
            createBox(i)
        }
        refillRack()
    }else if (index == 14 && reScan == false && isRackFull == true) {
        const checkLeft = board[index][j-1]
        const checkRight = board[index][j+1]
        const checkTop = board[index - 1][j]
        let howManyTruthLeft = 0
        let howManyTruthTop = 0
        let typeofcountleft = 0
        let typeofcountTop = 0
        
        let isEmpty
        for (let i = 0; i < rackArray.length; i++) {   
            if (rackArray[i].isClicked == true) {
                isEmpty = rackArray[i]
            }
        }

        countDraculafuncZ(checkLeft, checkRight, checkTop)

        if ((checkLeft != "empty" || checkRight != "empty" || checkTop != "empty" ) && isEmpty  && board[index][j] == "empty") {
            countDracula++
            console.log(countDracula)
        }

        if (board[index][j] == "empty") {
            exp = true
        }else {
            exp = false
        }
        
        //calling function to remove tile
        if(board[index][j].isClicked == true && exp == false) {  
            removeTileFromBoard(index, j, howManyTruthLeft, howManyTruthTop, typeofcountleft, typeofcountTop)
        }

        //this statement saves the first tile index
        if (firstClick == false && exp == true && isEmpty) {  
            if (checkLeft != "empty" || checkRight != "empty" ) {
                checkLeftAndRightZ(index, j, checkLeft, checkRight) 
                isLeftToRightDirect = true
            }else if (checkTop != "empty") {
                checkTopToBottomZ(index, j, checkTop) 
                isTopBottomDirect = true
            }else{
                moveToBox(index, j) 
            } 
            countDracula = 1 
            saveFirstBtn = [index, j]
            firstClick = true
        } 
        
    
        //this statement determines the directio of the game
        if(isEmpty  && exp == true && firstClick == true){  
                if (saveFirstBtn.length > 0) {
                    if(index == saveFirstBtn[0]){      
                        checkLeftAndRightZ(index, j, checkLeft, checkRight)    
                    }else if(j == saveFirstBtn[1] ) { 
                        checkTopToBottomZ(index, j, checkTop)   
                    }
                    if(index == saveFirstBtn[0] && j == saveFirstBtn[1]){
                        if (checkTop.isClicked == true) {
                            checkTopToBottomZ(index, j, checkTop) 
                        }else if(checkLeft.isClicked == true || checkRight.isClicked == true){
                            checkLeftAndRightZ(index, j, checkLeft, checkRight)
                        }
                        console.log("this left:", leftRightArray, "and", "this top: ", topBottomArray)
                    }
                }
                    
        }


        for (let i = 0; i < 15; i++) {
            createBox(i)
        }
        refillRack()
    }else if ((index != 0 || index != 14) && reScan == false && isRackFull == true){
        const checkLeft = board[index][j-1]
        const checkRight = board[index][j+1]
        const checkBottom = board[index + 1][j]
        const checkTop = board[index - 1][j]
        let howManyTruthLeft = 0
        let howManyTruthTop = 0
        let typeofcountleft = 0
        let typeofcountTop = 0
        let isEmpty
        
        for (let i = 0; i < rackArray.length; i++) {   
            if (rackArray[i].isClicked == true) {
                isEmpty = rackArray[i]
            }
        }

        countDraculafunc(checkLeft, checkRight, checkTop, checkBottom)

        if ((checkLeft != "empty" || checkRight != "empty" || checkTop != "empty" || checkBottom != "empty" ) && isEmpty  && board[index][j] == "empty") {
            countDracula++
            console.log(countDracula)
        }

        if (board[index][j] == "empty") {
            exp = true
        }else {
            exp = false
        }
        
        //calling function to remove tile
        if(board[index][j].isClicked == true && exp == false) {  
            removeTileFromBoard(index, j, howManyTruthLeft, howManyTruthTop, typeofcountleft, typeofcountTop)
        }

        //this statement saves the first tile index
        if (firstClick == false && exp == true && isEmpty) { 
            if (checkLeft != "empty" || checkRight != "empty" ) {
                checkLeftAndRight(index, j, checkLeft, checkRight) 
                isLeftToRightDirect = true
            }else if (checkTop != "empty" || checkBottom != "empty") {
                checkTopToBottom(index, j, checkTop, checkBottom)
                isTopBottomDirect = true
            }else{
                moveToBox(index, j) 
            } 
            countDracula = 1 
            saveFirstBtn = [index, j]
            firstClick = true 
            
        }else if(isEmpty  && exp == true && firstClick == true){  
                if (saveFirstBtn.length > 0) {
                    if(index == saveFirstBtn[0]){         
                        checkLeftAndRight(index, j, checkLeft, checkRight) 
                        if (countDracula < 3) {
                           isLeftToRightDirect = true 
                        }
                    }else if(j == saveFirstBtn[1] ) {   
                        checkTopToBottom(index, j, checkTop, checkBottom)  
                        if (countDracula < 3) {
                            isTopBottomDirect = true 
                         }
                    }
                    if(index == saveFirstBtn[0] && j == saveFirstBtn[1]){
                        console.log('merp')
                        if (checkTop.isClicked == true || checkBottom.isClicked ==true) {
                            checkTopToBottom(index, j, checkTop, checkBottom) 
                        }else if(checkLeft.isClicked == true || checkRight.isClicked == true){
                            checkLeftAndRight(index, j, checkLeft, checkRight) 
                        }
                        console.log("this left:", leftRightArray, "and", "this top: ", topBottomArray)
                    }
                }
                    
        }

        console.log(leftRightArray)
        console.log(topBottomArray)

        for (let i = 0; i < 15; i++) {
            createBox(i)
        }
        refillRack()
    }
    hasbeenConfirmed = false
    
}



function checkLeftArray(confirm, checkFalse) {
    for (let i = 0; i < board.length; i++) {
        for (let k = 0; k < board[i].length; k++) {
            leftRightArray.find(left =>{
                if (left.countTile == board[i][k].countTile) {
                    confirm.push([i,k])
                }
            })  
        } 
    }
    for (let f = 1; f < confirm.length; f++) {
        let x = confirm[f][0] - confirm[f - 1][0]
        let y = confirm[f][1] - confirm[f - 1][1]
    
        if (x == 0 && y == 1) {
           console.log('apple')
        }else {
            fillter1 = false
        }
    }

    if (fillter1 == true) {
        leftRightArray.forEach(left => {
            if (left.isClicked == false) {
               checkFalse++ 
            }
        })
        
        if (gameCount > 0) {
            if (checkFalse == 0 && isLeftInnerBranch.length == 0) {
                isValid = false
            }
        }else{
            if (board[7][8] == "empty") {
                isValid = false
            }
        }
        
    }else{
        isValid = false
    }

    console.log(isValid)
}

function checkTopArray(confirm, checkFalse) {
    for (let i = 0; i < board.length; i++) {
        for (let k = 0; k < board[i].length; k++) {
            topBottomArray.find(top => {
                if (top.countTile == board[i][k].countTile) {
                    confirm.push([i,k])
                }
            })  
        } 
    }
    for (let f = 1; f < confirm.length; f++) {
        let x = confirm[f][0] - confirm[f - 1][0]
        let y = confirm[f][1] - confirm[f - 1][1]
        if (x == 1 && y == 0) {
            console.log('orange')
        }else{
            fillter1 = false
        }
    }

    if (fillter1 == true) {
        topBottomArray.forEach(top => {
            if (top.isClicked == false) {
               checkFalse++ 
            }
        })
        
        if (gameCount > 0) {
            if (checkFalse == 0 && isTopInnerBranch.length == 0) {
                isValid = false
            }
        }else{
            if (board[7][8] == "empty") {
                isValid = false
            }
        }
    }else{
        isValid = false
    }
    console.log(isValid)
}

function concatWordLeft() {
    if (leftRightArray.length > 0) {
        let rev = []
        let word = ''
        let pointleft = 0
        let howManyDoubleLeft = 0
        let howManyTrippleLeft = 0
        for (let i = 0; i < leftRightArray.length; i++) {
           word = word.concat(leftRightArray[i].letter) 
        }
        rev.push(word)
        for (let k = 0; k < leftRightArray.length; k++) {
            pointleft += leftRightArray[k].point
            if (isDouble) {
                for (let o = 0; o < doubleMult.length; o++) {
                    if (doubleMult[o] == leftRightArray[k].countTile) {
                       howManyDoubleLeft++ 
                    }  
                }
            }
            if (isTripple) {
                for (let o = 0; o < trippleMult.length; o++) {
                    if (trippleMult[o] == leftRightArray[k].countTile) {
                       howManyTrippleLeft++ 
                    }  
                }
            }
        }
        if (howManyDoubleLeft > 0) {
            pointleft = pointleft * howManyDoubleLeft * 2
        }
        if (howManyTrippleLeft > 0) {
            pointleft = pointleft * howManyTrippleLeft * 3
        }
        rev.push(pointleft)
        arrayOfTotalWordsAndPoint.push(rev)
    }
    if (isLeftInnerBranch.length > 0) {
        for (let i = 0; i < isLeftInnerBranch.length; i++) {
            let rev = []
            let word = ''
            let pointleft = 0
            let howManyDoubleLeftBranch = 0
            let howManyTrippleLeftBranch = 0
            for (let j = 0; j < isLeftInnerBranch[i].length; j++) {
               word = word.concat(isLeftInnerBranch[i][j].letter) 
               pointleft += isLeftInnerBranch[i][j].point
               if (isDouble) {
                   for (let f = 0; f < doubleMult.length; f++) {
                       if (doubleMult[f] == isLeftInnerBranch[i][j].countTile) {
                           howManyDoubleLeftBranch++
                        }
                   }
               }

               if (isTripple) {
                for (let f = 0; f < trippleMult.length; f++) {
                    if (trippleMult[f] == isLeftInnerBranch[i][j].countTile) {
                        howManyTrippleLeftBranch++
                     }
                }
            }
            }
            if (howManyDoubleLeftBranch > 0) {
               pointleft = howManyDoubleLeftBranch * pointleft * 2
            }
            if (howManyTrippleLeftBranch > 0) {
                pointleft = howManyTrippleLeftBranch * pointleft * 3
            }

            rev.push(word, pointleft)
            arrayOfTotalWordsAndPoint.push(rev)
        }
        console.log(arrayOfTotalWordsAndPoint)
    }
}

function concatWordTop() {
    if (topBottomArray.length > 0) {
        let rev = []
        let word = ''
        let pointleft = 0
        let howManyDoubleTop = 0
        let howManyTrippleTop = 0
        for (let i = 0; i < topBottomArray.length; i++) {
           word = word.concat(topBottomArray[i].letter) 
        }
        rev.push(word)

        for (let k = 0; k < topBottomArray.length; k++) {
            pointleft += topBottomArray[k].point
            if (isDouble) {
                for (let o = 0; o < doubleMult.length; o++) {
                    if (doubleMult[o] == topBottomArray[k].countTile) {
                       howManyDoubleTop++ 
                    }  
                }
            }
            if (isTripple) {
                for (let o = 0; o < trippleMult.length; o++) {
                    if (trippleMult[o] == topBottomArray[k].countTile) {
                       howManyTrippleTop++
                    }  
                }
            }
        }
        if (howManyDoubleTop > 0) {
            pointleft = pointleft * howManyDoubleTop * 2
        }
        if (howManyTrippleTop > 0) {
            pointleft = pointleft * howManyTrippleTop * 3
        }
        rev.push(pointleft)
        arrayOfTotalWordsAndPoint.push(rev)
    }
    if (isTopInnerBranch.length > 0) {
        for (let i = 0; i < isTopInnerBranch.length; i++) {
            let rev = []
            let word = ''
            let pointleft = 0
            let howManyDoubleTopBranch = 0
            let howManyTrippleTopBranch = 0
            for (let j = 0; j < isTopInnerBranch[i].length; j++) {
               word = word.concat(isTopInnerBranch[i][j].letter) 
               pointleft += isTopInnerBranch[i][j].point
               if (isDouble) {
                    for (let f = 0; f < doubleMult.length; f++) {
                        if (doubleMult[f] == isTopInnerBranch[i][j].countTile) {
                            howManyDoubleTopBranch++
                        }
                    }
                }
        
                if (isTripple) {
                    for (let f = 0; f < trippleMult.length; f++) {
                        if (trippleMult[f] == isTopInnerBranch[i][j].countTile) {
                            howManyTrippleTopBranch++
                        }
                    }
                }
            }
            if (howManyDoubleTopBranch > 0) {
                pointleft = pointleft * howManyDoubleTopBranch * 2
            }
            if (howManyTrippleTopBranch > 0) {
                pointleft = pointleft * howManyTrippleTopBranch * 3
            }

            rev.push(word, pointleft)
            arrayOfTotalWordsAndPoint.push(rev)
        }
        console.log(arrayOfTotalWordsAndPoint)
    }
}


function joinWordAndCalculateTripplePoint() {
    if (leftRightArray.length > 0 || topBottomArray.length > 0) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != "empty" && board[i][j].isClicked == true) {
                    for (let t = 0; t < trippleWord.length; t++) {
                        if (trippleWord[t][0] == i && trippleWord[t][1] == j) {
                            isTripple = true 
                            trippleMult.push(board[i][j].countTile)
                        }       
                    }
                }
            }
            
        }
    }
}

function joinWordAndCalculateDoubleWord() {
    if (leftRightArray.length > 0 || topBottomArray.length > 0) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != "empty" && board[i][j].isClicked == true && board.point !== 0) {
                    for (let d = 0; d < doubleWord.length; d++) {
                        if (doubleWord[d][0] == i && doubleWord[d][1] == j) {
                            isDouble = true
                            doubleMult.push(board[i][j].countTile)
                        }       
                    }
                }
            }
            
        }
    }
}

function calTrippleLetterSideWay() {
    if (leftRightArray.length > 0) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != "empty" && board[i][j].isClicked == true && board[i][j].point !== 0) {
                    for (let t = 0; t < trippleLetter.length; t++) {
                        if (trippleLetter[t][0] == i && trippleLetter[t][1] == j) {
                            for (let l = 0; l < leftRightArray.length; l++) {
                                if (board[i][j].countTile == leftRightArray[l].countTile) {
                                    leftRightArray[l].point *= 3
                                }
                            }

                            if (isLeftInnerBranch.length > 0) {
                                for (let u = 0; u < isLeftInnerBranch.length; u++) {
                                    for (let z = 0; z < isLeftInnerBranch[u].length; z++) {
                                        if (board[i][j].countTile == isLeftInnerBranch[u][z].countTile) {
                                            isLeftInnerBranch[u][z].point *= 3
                                        }     
                                    }
                                    
                                }
                            }
                        }       
                    }
                }
            }
            
        }
        console.log(leftRightArray)
    }
}

function calTrippleLetteTop() {
    if (topBottomArray.length > 0) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != "empty" && board[i][j].isClicked == true && board[i][j].point !== 0) {
                    for (let t = 0; t < trippleLetter.length; t++) {
                        if (trippleLetter[t][0] == i && trippleLetter[t][1] == j) {
                            for (let l = 0; l < topBottomArray.length; l++) {
                                if (board[i][j].countTile == topBottomArray[l].countTile) {
                                    topBottomArray[l].point *= 3
                                }
                            }

                            if (isTopInnerBranch.length > 0) {
                                for (let u = 0; u < isTopInnerBranch.length; u++) {
                                    for (let z = 0; z < isTopInnerBranch[u].length; z++) {
                                        if (board[i][j].countTile == isTopInnerBranch[u][z].countTile) {
                                            isTopInnerBranch[u][z].point *= 3
                                        }     
                                    }
                                    
                                }
                            }
                        }       
                    }
                }
            }
            
        }
        console.log(topBottomArray)
        
    }
}

function calDoubleLetterSideWay() {
    if (leftRightArray.length > 0) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != "empty" && board[i][j].isClicked == true && board[i][j].point !== 0) {
                    for (let d = 0; d < doubleLetter.length; d++) {
                        if (doubleLetter[d][0] == i && doubleLetter[d][1] == j) {
                            for (let l = 0; l < leftRightArray.length; l++) {
                                if (board[i][j].countTile == leftRightArray[l].countTile) {
                                    leftRightArray[l].point *= 2
                                }
                            }
                            if (isLeftInnerBranch.length > 0) {
                                for (let u = 0; u < isLeftInnerBranch.length; u++) {
                                    for (let z = 0; z < isLeftInnerBranch[u].length; z++) {
                                        if (board[i][j].countTile == isLeftInnerBranch[u][z].countTile) {
                                            isLeftInnerBranch[u][z].point *= 2
                                        }     
                                    }
                                    
                                }
                            }
                        }       
                    }
                }
            }
            
        }
    }
    console.log(leftRightArray)
}

function calDoubleLetterTop() {
    if (topBottomArray.length > 0) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != "empty" && board[i][j].isClicked == true && board[i][j].point !== 0) {
                    for (let d = 0; d < doubleLetter.length; d++) {
                        if (doubleLetter[d][0] == i && doubleLetter[d][1] == j) {
                            let p = topBottomArray.findIndex(top => (board[i][j].countTile == top.countTile) )
                            topBottomArray[p].point *= 2 

                            if (isTopInnerBranch.length > 0) {
                                for (let u = 0; u < isTopInnerBranch.length; u++) {
                                    for (let z = 0; z < isTopInnerBranch[u].length; z++) {
                                        if (board[i][j].countTile == isTopInnerBranch[u][z].countTile) {
                                            isTopInnerBranch[u][z].point *= 2
                                        }     
                                    }
                                    
                                }
                            }
                        }       
                    }
                }
            }
            
        }

        console.log(topBottomArray)
    }
}


function resetGame() {
    gameCount ++
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] != "empty") {
                board[i][j].isClicked = false
            }
        }
    }
    isDouble = false
    isTripple = false
    trippleMult = []
    doubleMult = []
    leftRightArray = []
    topBottomArray = []
    firstClick = false
    isLeftToRightDirect = false
    isTopBottomDirect = false
    saveFirstBtn = []
    countDracula = 0   
    isRackFull = false
}


//function to determine when to start or stop adding tile top and bottom / left and right
function countDraculafuncI(checkLeft, checkRight, checkBottom) {
    if (countDracula < 2) { 
        if (checkLeft.isClicked == true || checkRight.isClicked == true ) {
            isLeftToRightDirect = true
            isTopBottomDirect = false
        }else if (checkBottom.isClicked == true) {
            isTopBottomDirect = true
            isLeftToRightDirect = false
        }else {
            isTopBottomDirect = false
            isLeftToRightDirect = false
        }
    }
}

function countDraculafuncZ(checkLeft, checkRight, checkTop) {
    if (countDracula < 2) { 
        if (checkLeft.isClicked == true || checkRight.isClicked == true ) {
            isLeftToRightDirect = true
            isTopBottomDirect = false
        }else if (checkTop.isClicked == true) {
            isTopBottomDirect = true
            isLeftToRightDirect = false
        }else {
            isTopBottomDirect = false
            isLeftToRightDirect = false
        }
    }
}

function countDraculafunc(checkLeft, checkRight, checkTop, checkBottom) {
    if (countDracula < 2) { 
        if (checkLeft.isClicked == true || checkRight.isClicked == true ) {
            isLeftToRightDirect = true
            isTopBottomDirect = false
        }else if (checkBottom.isClicked == true || checkTop.isClicked == true) {
            isTopBottomDirect = true
            isLeftToRightDirect = false
        }
    }
}  

//this function remove tile from the board
function removeTileFromBoard(index, j, howManyTruthLeft, howManyTruthTop) {
    let clout = false

    if (board[index][j].point == 0) {
        board[index][j].letter = ""
    }
    if (leftRightArray.length == 0 && topBottomArray.length == 0) {
       countDracula = 0 
       saveFirstBtn = []
       firstClick = false
    }

    if (leftRightArray.length > 0 || isLeftInnerBranch.length > 0) {
        const indexToSlice = leftRightArray.findIndex(left => {
            return  left.countTile == board[index][j].countTile
        })

        leftRightArray.splice(indexToSlice, 1)  
    
        const result = leftRightArray.every(left => {
            if (left.isClicked == false && left) {
                return true
            }
        })
        if (result == true) {
            leftRightArray = []
        }

        leftRightArray.forEach(left => {
            if (left.isClicked == true) {
                howManyTruthLeft++
            }
        });

        if (isLeftInnerBranch.length > 0) {
            let temp
             for (let i = 0; i < isLeftInnerBranch.length; i++) {
                for (let o = 0; o < isLeftInnerBranch[i].length; o++) {
                    if (board[index][j].countTile == isLeftInnerBranch[i][o].countTile) {
                        temp = i
                    }
                }  
            }
            if (temp == undefined) {
                console.log('hell')
            }else {
                isLeftInnerBranch.splice(temp, 1)
            }     
        }

        if (leftRightArray == "") {
            isLeftToRightDirect = false
            firstClick = false
            saveFirstBtn = []
            isLeftInnerBranch = []
            countDracula = 0            
        }else if (howManyTruthLeft == 1){
            for (let i = 0; i < board.length; i++) {
                for (let l = 0; l < board[i].length; l++) {
                    if (board[i][l].isClicked == true && board[i][l] != board[index][j]) {
                        if (board[i][l -1 ] != "empty" || board[i][l + 1] != "empty" || board[i - 1][l] != "empty" || board[i + 1][l] != "empty") {
                            saveFirstBtn = [i, l]
                            isLeftToRightDirect = false
                            countDracula = 1
                        }
                    }
                }
            }
            if (leftRightArray.length == 1 && isLeftInnerBranch.length > 0) {
                leftRightArray = []
                isLeftInnerBranch = []
                removeTileFromBox(index, j)
                checkTopToBottom(saveFirstBtn[0], saveFirstBtn[1], saveFirstBtn[0]-1, saveFirstBtn[0]+1 ) 
                clout = true
            }
        }
        console.log("leftArray: ",leftRightArray)
        console.log("leftBranch: ", isLeftInnerBranch)
        console.log("topBottomArray: ", topBottomArray)
        console.log("topBranch", isTopInnerBranch)
    }else if(topBottomArray.length > 0 || isTopInnerBranch.length > 0){
        const indexTopSlice = topBottomArray.findIndex(top => {
            return top.countTile == board[index][j].countTile
        })      
      
        topBottomArray.splice(indexTopSlice, 1)        
        
            const resultTop = topBottomArray.every(top => {
                if (top.isClicked == false && top) {
                    return true
                }
            })

            if (resultTop == true) {
                topBottomArray = []
            }

            topBottomArray.forEach(top => {
                if (top.isClicked == true) {
                    howManyTruthTop++
                }
            })

            if (isTopInnerBranch.length > 0) {
               let temp
               for (let i = 0; i < isTopInnerBranch.length; i++) {
                   for (let o = 0; o < isTopInnerBranch[i].length; o++) {
                       if (isTopInnerBranch[i][o].countTile == board[index][j].countTile) {
                           temp = i
                        }  
                    }   
               }
               if (temp == undefined) {
                  console.log('em')
               }else {
                    console.log(temp)
                    isTopInnerBranch.splice(temp, 1)
               }
               
            }

            if (topBottomArray.length == 0) {
                isTopBottomDirect = false
                saveFirstBtn = []
                firstClick = false
                countDracula = 0
            }else if (howManyTruthTop == 1) {
                for (let i = 0; i < board.length; i++) {
                    for (let l = 0; l < board[i].length; l++) {
                        if (board[i][l].isClicked == true && board[i][l] != board[index][j]) {
                            if (board[i][l -1 ] != "empty" || board[i][l + 1] != "empty" || board[i - 1][l] != "empty" || board[i + 1][l] != "empty") {
                                saveFirstBtn = [i, l]
                                isTopBottomDirect = false
                                countDracula = 1
                            }
                        }
                    }
                }
                if (topBottomArray.length == 1 && isTopInnerBranch.length > 0) {
                    topBottomArray = []
                    isTopInnerBranch = []
                    removeTileFromBox(index, j)
                    if (saveFirstBtn[0] == 0) {
                        checkLeftAndRightI(saveFirstBtn[0], saveFirstBtn[1], saveFirstBtn[1]- 1, saveFirstBtn[1] + 1)
                    }else if (saveFirstBtn[0] == 14) {
                        checkLeftAndRightZ(saveFirstBtn[0], saveFirstBtn[1], saveFirstBtn[1]- 1, saveFirstBtn[1] + 1) 
                    }else {
                        checkLeftAndRight(saveFirstBtn[0], saveFirstBtn[1], saveFirstBtn[1]- 1, saveFirstBtn[1] + 1 ) 
                    }
                    clout = true
                }
            }
            console.log("leftArray: ",leftRightArray)
            console.log("leftBranch: ", isLeftInnerBranch)
            console.log("topBottomArray: ", topBottomArray)
            console.log("topBranch", isTopInnerBranch)     
    
    }
    if (clout == true) {
        return
    }else{
        removeTileFromBox(index, j)
    }
    
}

//this function check if scans from left to right and runs if index is is not equals to 0 or 14
function checkLeftAndRight(index, j, checkLeft, checkRight) {
    if (isLeftToRightDirect == false && isTopBottomDirect == true) {
            return
    }else {
        if (checkLeft !== "empty" || checkRight !== "empty" ) {
            leftRightArray = []
            topBottomArray = []
            isLeftInnerBranch = []
            isTopInnerBranch =[]
        }
        if (checkLeft !== "empty") {
            moveToBox(index, j)
            let goLeft = j - 1  

             if (leftRightArray.length == 0) {
                leftRightArray.unshift({...board[index][j]})
                let temporaryTopBottomArray = []
                addBranchToBranchArray(temporaryTopBottomArray, index, j)
             }

            while (board[index][goLeft] != "empty") {
                leftRightArray.unshift({...board[index][goLeft]})
                let temporaryTopBottomArray = []
                addBranchToBranchArray(temporaryTopBottomArray, index, goLeft)
                goLeft--
            }
            
        }
        
        if (checkRight !== "empty"){
            moveToBox(index, j)
            let goRight = j + 1
            if (leftRightArray.length == 0) {
                leftRightArray.push({...board[index][j]})
                let temporaryTopBottomArray = []
                addBranchToBranchArray(temporaryTopBottomArray, index, j) 
            }
            while (board[index][goRight] != "empty") {
                leftRightArray.push({...board[index][goRight]})
                let temporaryTopBottomArray = []
                addBranchToBranchArray(temporaryTopBottomArray, index, goRight)
                goRight++
            }    
        } 
    }
    console.log(leftRightArray)
    console.log(isLeftInnerBranch)
}

//this runs when index is equal to 14
function checkLeftAndRightZ(index, j, checkLeft, checkRight) {
    leftRightArray = []
    isLeftInnerBranch = []
    if (isLeftToRightDirect == false && isTopBottomDirect == true) {
            return
    }else {
        if (checkLeft !== "empty" || checkRight !== "empty" ) {
            leftRightArray = []
            topBottomArray = []
            isLeftInnerBranch = []
            isTopInnerBranch =[]
        }
        if (checkLeft !== "empty") {
            moveToBox(index, j)
            let goLeft = j - 1  

             if (leftRightArray.length == 0) {
                leftRightArray.unshift({...board[index][j]})
                let temporaryTopBottomArray = []
                addBranchToBranchArrayZ(temporaryTopBottomArray, index, j)
             }

            while (board[index][goLeft] != "empty") {
                leftRightArray.unshift({...board[index][goLeft]})
                let temporaryTopBottomArray = []
                addBranchToBranchArrayZ(temporaryTopBottomArray, index, goLeft)
                goLeft--
            }
            
        }
        
        if (checkRight !== "empty"){
            moveToBox(index, j)
            let goRight = j + 1
            if (leftRightArray.length == 0) {
                leftRightArray.push({...board[index][j]})
                let temporaryTopBottomArray = []
                addBranchToBranchArrayZ(temporaryTopBottomArray, index, j) 
            }
            while (board[index][goRight] != "empty") {
                leftRightArray.push({...board[index][goRight]})
                let temporaryTopBottomArray = []
                addBranchToBranchArrayZ(temporaryTopBottomArray, index, goRight)
                goRight++
            }    
        } 
    }
    console.log(leftRightArray)
    console.log(isLeftInnerBranch)
}

//this index runs when index is equal to 14
function checkLeftAndRightI(index, j, checkLeft, checkRight) {
    leftRightArray = []
    isLeftInnerBranch = []
    if (isLeftToRightDirect == false && isTopBottomDirect == true) {
            return
    }else {
        if (checkLeft !== "empty" || checkRight !== "empty" ) {
            leftRightArray = []
            topBottomArray = []
            isLeftInnerBranch = []
            isTopInnerBranch =[]
        }
        if (checkLeft !== "empty") {
            moveToBox(index, j)
            let goLeft = j - 1  

             if (leftRightArray.length == 0) {
                leftRightArray.unshift({...board[index][j]})
                let temporaryTopBottomArray = []
                addBranchToBranchArrayI(temporaryTopBottomArray, index, j)
             }

            while (board[index][goLeft] != "empty") {
                leftRightArray.unshift({...board[index][goLeft]})
                let temporaryTopBottomArray = []
                addBranchToBranchArrayI(temporaryTopBottomArray, index, goLeft)
                goLeft--
            }
            
        }
        
        if (checkRight !== "empty"){
            moveToBox(index, j)
            let goRight = j + 1
            if (leftRightArray.length == 0) {
                leftRightArray.push({...board[index][j]})
                let temporaryTopBottomArray = []
                addBranchToBranchArrayI(temporaryTopBottomArray, index, j) 
            }
            while (board[index][goRight] != "empty") {
                leftRightArray.push({...board[index][goRight]})
                let temporaryTopBottomArray = []
                addBranchToBranchArrayI(temporaryTopBottomArray, index, goRight)
                goRight++
            }    
        } 
    }
    console.log(leftRightArray)
    console.log(isLeftInnerBranch)
}

//this runs when the while loop of checklefttoright runs it check if the tile top and bottom is not empty and this runs if index != 0 || 14
function addBranchToBranchArray(temporaryTopArray, index, j) {
    if (board[index - 1][j] !== "empty") {
        let i = index - 1
        if (temporaryTopArray.length == 0 && board[index][j].isClicked !== false) {
            temporaryTopArray.unshift({...board[index][j]})
        }
        while (board[i][j] != "empty" && board[index][j].isClicked !== false && i >= 0) {
            temporaryTopArray.unshift({...board[i][j]})
            if (i > 0) {
                i--
            }else{
                break
            }
        }
    } 
    if (board[index + 1][j] != "empty") {
        let p = index + 1
        if (temporaryTopArray.length == 0 && board[index][j].isClicked !== false) {
            temporaryTopArray.push({...board[index][j]})
        }
        while (board[p][j] != "empty" && board[index][j].isClicked !== false && p <= 14) {
            temporaryTopArray.push({...board[p][j]})
            if (p < 14) {
                p++
            }else{
               break
            }
        }
    }
    if (temporaryTopArray.length > 0) {
        isLeftInnerBranch.push(temporaryTopArray)   
    }  
}

//this runs if index == 0
function addBranchToBranchArrayI(temporaryTopArray, index, j) {
    if (board[index + 1][j] != "empty") {
        let p = index + 1
        if (temporaryTopArray.length == 0 && board[index][j].isClicked !== false) {
            temporaryTopArray.push({...board[index][j]})
        }
        while (board[p][j] != "empty" && board[index][j].isClicked !== false) {
            temporaryTopArray.push({...board[p][j]})
            p++
        }
    }
    if (temporaryTopArray.length > 0) {
        isLeftInnerBranch.push(temporaryTopArray)   
    }  
}

//this runs if index = 14
function addBranchToBranchArrayZ(temporaryTopArray, index, j) {
    if (board[index - 1][j] != "empty") {
        let i = index - 1
        if (temporaryTopArray.length == 0 && board[index][j].isClicked !== false) {
            temporaryTopArray.unshift({...board[index][j]})
        }
        while (board[i][j] != "empty" && board[index][j].isClicked !== false) {
            temporaryTopArray.unshift({...board[i][j]})
            i--
        }
    } 
    if (temporaryTopArray.length > 0) {
        isLeftInnerBranch.push(temporaryTopArray)   
    }  
}


//function to check if function exist from top to bottom and it runs when neither the top or bottom index is clicked
function  checkTopToBottom(index, j, checkTop, checkBottom) {  
    if (isTopBottomDirect == false && isLeftToRightDirect == true) { 
        return    
    }else {
        topBottomArray = []
        leftRightArray = []
        isTopInnerBranch = []
        isLeftInnerBranch = []
        if (checkTop !== "empty") {
            moveToBox(index, j) 
            let goTop = index - 1
            if (topBottomArray.length == 0) {
                topBottomArray.push({...board[index][j]})
                let temporaryTopArray = []
                addBranchLeftBranchArray(temporaryTopArray, index, j)
            }
            while (board[goTop][j] != "empty" && goTop >= 0) {
                topBottomArray.unshift({...board[goTop][j]})
                let temporaryTopArray = []
                addBranchLeftBranchArray(temporaryTopArray, goTop, j) 
                if (goTop > 0) {
                    goTop--
                }else{
                    break
                }   
            }
        }
        if (checkBottom !== "empty"){
            moveToBox(index, j)
            let goBottom = index + 1
            if (topBottomArray.length == 0) {
                topBottomArray.push({...board[index][j]})
                let temporaryTopArray = []
                addBranchLeftBranchArray(temporaryTopArray, index, j) 
            }
            while (board[goBottom][j] != "empty" && goBottom <= 14) {
                topBottomArray.push({...board[goBottom][j]})
                let temporaryTopArray = []
                addBranchLeftBranchArray(temporaryTopArray, goBottom, j) 
                if (goBottom < 14) {
                    goBottom++   
                }else{
                    break
                }
            }     
        }
    }   
    console.log(topBottomArray)
    console.log(leftRightArray)
    console.log(isTopInnerBranch)
    
}

//this function starts when the first index is clicked
function  checkTopToBottomI(index, j, checkBottom) {
    topBottomArray = []
    isTopInnerBranch = []
    if (isTopBottomDirect == false && isLeftToRightDirect == true) { 
        return    
    }else {
        topBottomArray = []
        leftRightArray = []
        isTopInnerBranch = []
        isLeftInnerBranch = []
        if (checkBottom !== "empty"){
            moveToBox(index, j)
            let goBottom = index + 1
            if (topBottomArray.length == 0) {
                topBottomArray.push({...board[index][j]})
                let temporaryTopArray = []
                addBranchLeftBranchArray(temporaryTopArray, index, j) 
            }
            while (board[goBottom][j] != "empty" && goBottom <= 14) {
                topBottomArray.push({...board[goBottom][j]})
                let temporaryTopArray = []
                addBranchLeftBranchArray(temporaryTopArray, goBottom, j) 
                if (goBottom < 14) {
                    goBottom++   
                }else {
                    break
                }
            }     
        }
    }   
    console.log(topBottomArray)
    console.log(leftRightArray)
    console.log(isTopInnerBranch)
    
}

//this function starts when the last index is clicked
function  checkTopToBottomZ(index, j, checkTop) {
    topBottomArray = []
    isTopInnerBranch = []
    if (isTopBottomDirect == false && isLeftToRightDirect == true) { 
        return    
    }else {
        topBottomArray = []
        leftRightArray = []
        isTopInnerBranch = []
        isLeftInnerBranch = []
        if (checkTop !== "empty") {
            moveToBox(index, j) 
            let goTop = index - 1
            if (topBottomArray.length == 0) {
                topBottomArray.push({...board[index][j]})
                let temporaryTopArray = []
                addBranchLeftBranchArray(temporaryTopArray, index, j)
            }
            while (board[goTop][j] != "empty" && goTop >= 0) {
                topBottomArray.unshift({...board[goTop][j]})
                let temporaryTopArray = []
                addBranchLeftBranchArray(temporaryTopArray, goTop, j)  
                
                if (goTop > 0) {
                    goTop--
                }else {
                    break
                }  
            }
        }
    }   
    console.log(topBottomArray)
    console.log(leftRightArray)
    console.log(isTopInnerBranch)
    
}

//this function runs when the while loop runs in the topBottom array it check if left or right exist and add it to the innerBranch loop
function addBranchLeftBranchArray(temporaryTopArray, index, j) {
    if (board[index][j - 1] != "empty") {
        let i = j - 1
        if (temporaryTopArray.length == 0 && board[index][j].isClicked !== false) {
            temporaryTopArray.unshift({...board[index][j]})
            temporaryTopArray
        }
        while (board[index][i] != "empty" && board[index][j].isClicked !== false) {
            temporaryTopArray.unshift({...board[index][i]})
            i--
        }
    } 
    if (board[index][j + 1] != "empty") {
        let p = j + 1
        if (temporaryTopArray.length == 0  && board[index][j].isClicked !== false) {
            temporaryTopArray.push({...board[index][j]})
        }
        while (board[index][p] != "empty"  && board[index][j].isClicked !== false) {
            temporaryTopArray.push({...board[index][p]})
            p++
        }
    }
    if (temporaryTopArray.length > 0) {
        isTopInnerBranch.push(temporaryTopArray)   
    }  
}


//function to transfer tile from rack to board
function moveToBox(index, j) {
    let getSelectedRack
    for (let i = 0; i < rackArray.length; i++) {   
        if (rackArray[i].isClicked == true) {
            getSelectedRack = rackArray[i]
        }
    }

    let indexToSlice = rackArray.findIndex(ind => {
        return ind == getSelectedRack
    })

    if (indexToSlice > -1) {
        board[index][j] = getSelectedRack
        rackArray.splice(indexToSlice, 1) 
    }
    countTile++
    refillRack()
}

//function to remove tile from box
function removeTileFromBox(index, j) {
    let save
    let indexTo = board[index].findIndex(ind => {
        return board[index][j] == ind
    })
           
    board[index][indexTo].isClicked = false
    save = board[index][indexTo]
    board[index][indexTo] = "empty"
    rackArray.unshift(save)
}

//function to create foundation of board
 function createBoard() {
     for (let i = 0; i < 15; i++) {
        let boardRow = []
        for (let j = 0; j < 17; j++) {
            boardRow.push("empty")
        }
        board.push(boardRow)
    }
}

//function to create totalTile
function createTotalTile() {
    for (let i = 0; i < 9; i++) {
        const A =  {
            letter: "A",
            point: 1,
            isClicked: false
        }
        const I =  {
            letter: "I",
            point: 1,
            isClicked: false
        }
        totalTile.push(I, A)
    }

    for (let i = 0; i < 3; i++) {
        const G =  {
            letter: "G",
            point: 2,
            isClicked: false
        }
    
        totalTile.push(G)
    }

    for (let i = 0; i < 8; i++) {
        const O =  {
            letter: "O",
            point: 1,
            isClicked: false
        }
    
        totalTile.push(O)
    }

    for (let i = 0; i < 12; i++) {
        const E =  {
            letter: "E",
            point: 1,
            isClicked: false
        }
    
        totalTile.push(E)
    }


    for (let i = 0; i < 2; i++) {
        const B =  {
            letter: "B",
            point: 3,
            isClicked: false
        }

        const C =  {
            letter: "C",
            point: 3,
            isClicked: false
        }

        const H =  {
            letter: "H",
            point: 4,
            isClicked: false
        }
        const F =  {
            letter: "F",
            point: 4,
            isClicked: false
        }

        const V =  {
            letter: "V",
            point: 4,
            isClicked: false
        } 

        const Y =  {
            letter: "Y",
            point: 4,
            isClicked: false
        }

        const M =  {
            letter: "M",
            point: 3,
            isClicked: false
        }

        const W =  {
            letter: "W",
            point: 4,
            isClicked: false
        }

        const P =  {
            letter: "P",
            point: 3,
            isClicked: false
        }

        const Blank =  {
            letter: "",
            point: 0,
            isClicked: false
        }

        totalTile.push(B, H, C, Blank, P, W, F, M, Y, V)
    }

    for (let i = 0; i < 6; i++) {
        const N  =  {
            letter: "N",
            point: 1,
            isClicked: false
        }
        const R =  {
            letter: "R",
            point: 1,
            isClicked: false
        }

        const T =  {
            letter: "T",
            point: 1,
            isClicked: false
        }
        totalTile.push(N, R, T)
    }

    for (let i = 0; i < 4; i++) {
        const D =  {
            letter: "D",
            point: 2,
            isClicked: false
        }
        const L =  {
            letter: "L",
            point: 1,
            isClicked: false
        }

        const S =  {
            letter: "T",
            point: 1,
            isClicked: false
        }

        const U =  {
            letter: "U",
            point: 1,
            isClicked: false
        }
        totalTile.push(D, L, S, U)
    }


    for (let i = 0; i < 1; i++) {
        const K =  {
            letter: "K",
            point: 5,
            isClicked: false
        }
        const X =  {
            letter: "X",
            point: 8,
            isClicked: false
        }

        const J =  {
            letter: "J",
            point: 8,
            isClicked: false
        }

        const Q =  {
            letter: "Q",
            point: 10,
            isClicked: false
        }

        const Z =  {
            letter: "Z",
            point: 10,
            isClicked: false
        }

        totalTile.push(K, X, J, Q, Z)
    }
}

tileHolder.innerHTML = `${totalTile.length} tiles left`