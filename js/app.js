
const getLocalStorage = () => JSON.parse(localStorage.getItem('banca')) ?? [];

const setLocalStorage = (banca) => localStorage.setItem('banca', JSON.stringify(banca));




const displayOdds = () => {
    document.querySelector('.header').innerHTML = title
    
    const container = document.querySelector('.odds-container')
    if (games[0].odds.length === 3){
        document.querySelector('.sub-header').innerHTML = `
            <div class="odd-description">
                <span>Time 1</span>
                <span>Empate</span>
                <span>Time 2</span>
            </div>
        `
        games.forEach(element => {
            container.innerHTML +=
                `<div class = 'game-row'>
                    <div class= 'game'>${element.jogo + 1}</div>
                    <div class = 'team-odds'>
                        <div class= 'team'>${element.times[0]} - ${element.times[1]}</div>
                        <div class= 'odds-wraper'>
                            <div class='odds' data-game=${element.jogo} data-number=0>${element.odds[0]}</div>
                            <div class='odds' data-game=${element.jogo} data-number=1>${element.odds[1]}</div>
                            <div class='odds' data-game=${element.jogo} data-number=2>${element.odds[2]}</div>
                        </div>
                    </div>
                </div>
            `
        })
    }else{
        games.forEach(element => {
            container.innerHTML +=
                `<div class = 'game-row'>
                    <div class= 'game'>${element.jogo + 1}</div>
                    <div class = 'team-odds'>
                        <div class= 'team'>${element.times[0]} - ${element.times[1]}</div>
                        <div class= 'odds-wraper'>
                            <div class='odds' data-game=${element.jogo} data-number=0>${element.odds[0]}</div>
                            <div class='odds' data-game=${element.jogo} data-number=1>${element.odds[1]}</div>
                        </div>
                    </div>
                </div>
            `
        })
    }
    ;   
    ;
}

const displayBets = (event) => {
    const gameNumber = event.target.dataset.game
    const oddNumber = event.target.dataset.number
    document.querySelector('.bets-container').innerHTML += `
        <div class = 'bet-wraper' id=wraper${gameNumber}${oddNumber}>
            <div class = 'bet-header'>
                <div class = 'bet-description'><p>${games[gameNumber].times[oddNumber]}</p>(${games[gameNumber].times[0]} x ${games[gameNumber].times[1]})</div>
                <div class = 'bet-odd'>${games[gameNumber].odds[oddNumber]}</div>
            </div>
            <div class = 'bet-value'>
                <input class= 'input' id=bet${gameNumber}${oddNumber} placeholder='valor apostado' ></input> 
                <button class='bet-button' data-game=${gameNumber} data-number=${oddNumber}>Apostar</button>
                <button class='cancel-button' data-game=${gameNumber} data-number=${oddNumber}>X</button>
            </div>
        </div>
        
    `

}

const clickBet = (event)=> {
    displayBets(event)
    document.querySelectorAll('.bet-button').forEach(element => element.addEventListener('click', confirmBet))
    document.querySelectorAll('.cancel-button').forEach(element => element.addEventListener('click', cancelBet))
}


const confirmBet = (event)=> {
    const gameNumber = event.target.dataset.game
    const oddNumber = event.target.dataset.number
    const betValue = document.getElementById(`bet${gameNumber}${oddNumber}`).value
    if(betValue > 0 && betValue<= carteira){
        lockBet(betValue,gameNumber,oddNumber)
    }else{
        alert('insira um valor válido para a aposta')
    }
    document.querySelectorAll('.yes-button').forEach(element => element.addEventListener('click', winBet))
    document.querySelectorAll('.cancel-button').forEach(element => element.addEventListener('click', loseBet))   
}

const cancelBet = (event) => {
    const gameNumber = event.target.dataset.game
    const oddNumber = event.target.dataset.number
    document.getElementById(`wraper${gameNumber}${oddNumber}`).remove()
}

const lockBet = (value, gameNumber, oddNumber) => {
    updateWallet('bet',value)
    document.getElementById(`bet${gameNumber}${oddNumber}`).parentNode.innerHTML = `
        <button class='yes-button' data-game=${gameNumber} data-number=${oddNumber}>GANHOU</button>
        <button class='cancel-button' data-game=${gameNumber} data-number=${oddNumber}>PERDEU</button>
        <p id=bet${gameNumber}${oddNumber} data-value = ${value}>R$ ${value}</p>
    `
}

const winBet = (event) => {
    const gameNumber = event.target.dataset.game
    const oddNumber = event.target.dataset.number
    element = document.getElementById(`bet${gameNumber}${oddNumber}`)
    income = parseFloat(element.dataset.value) * parseFloat(games[gameNumber].odds[oddNumber])
    profit = parseFloat(element.dataset.value) * (parseFloat(games[gameNumber].odds[oddNumber]) - 1)
    element.parentNode.innerHTML = `
        <p>Voce ganhou R$ ${profit.toFixed(2)}</p>
        <button class='cancel-button' data-game=${gameNumber} data-number=${oddNumber}>X</button>
    `
    document.querySelectorAll('.cancel-button').forEach(element => element.addEventListener('click', cancelBet))
    updateWallet('win',income)
}

const loseBet = (event) => {
    const gameNumber = event.target.dataset.game
    const oddNumber = event.target.dataset.number
    element = document.getElementById(`bet${gameNumber}${oddNumber}`)
    element.parentNode.innerHTML = `
        <p>Voce perdeu R$ ${element.dataset.value} nessa aposta</p>
        <button class='cancel-button' data-game=${gameNumber} data-number=${oddNumber}>X</button>
    `
    document.querySelectorAll('.cancel-button').forEach(element => element.addEventListener('click', cancelBet))
}

const updateWallet = (winOrBet, value) => {
    if (winOrBet == 'win'){
        carteira = carteira + value
    }if(winOrBet == 'bet'){
        carteira = carteira - value
    }
    document.querySelector('.wallet').innerHTML = `R$ ${carteira}`
    setLocalStorage(carteira)
}

const addMoney = () => {
    document.querySelector('#add-input').classList.remove('none')
    document.querySelector('#add-input').addEventListener('keypress',enter)
    
}

const enter = (event) => {
    const value = parseFloat(event.target.value)
    if (event.key == 'Enter'){
        updateWallet('win',value)
        closeDeposit()
    }
}

const closeDeposit = () => {
    document.querySelector('#add-input').classList.add('none')
    document.querySelector('#add-button').addEventListener('click', addMoney)
}

displayOdds()
let carteira = getLocalStorage()
updateWallet()
document.querySelectorAll('.odds').forEach(element => {element.addEventListener('click',clickBet)})
document.querySelector('#add-button').addEventListener('click', addMoney)