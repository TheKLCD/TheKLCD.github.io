//Save all global game Data in gameState so in can be accessed globally 
const gameState = {
    xWins: 0,
    oWins: 0,
    startX: true,    
};

//Screen at the start of the game
class StartScreen extends Phaser.Scene {
    constructor(){
        super({ key: 'StartScreen' });
    }

    create(){
        //Welcome Text
        this.add.text( 400, 400, 'Click To Play', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);

        //Onclick go to the game
        this.input.on('pointerup', () => {
            this.scene.stop('StartScreen');
            this.scene.start('GameScreen');
        })
    }
};

//Screen of the game
class GameScreen extends Phaser.Scene {
    constructor(){
        super({ key: 'GameScreen'});
    }

    //Set up the game
    create(){
        //Make the board
        gameState.board = Array.from(Array(3), () => new Array(3));
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                gameState.board[i][j] = this.add.rectangle(110+i*200, 110+j*200, 180, 180, 0xde6dd4).setOrigin(0, 0);
                gameState.board[i][j].setInteractive().on('pointerup', () => {
                    gameState.board[i][j].destroy();
                    gameState.board[i][j] = gameState.turn;

                    if(gameState.turn){
                        this.add.line(0,0, 110+i*200, 110+j*200, 290+i*200, 290+j*200, 0xed2f21).setOrigin(0, 0);
                        this.add.line(0,0, 290+i*200, 110+j*200, 110+i*200, 290+j*200, 0xed2f21).setOrigin(0, 0);
                    }else{
                        this.add.circle(200+i*200, 200+j*200, 90, 0x1c6bb0);
                        this.add.circle(200+i*200, 200+j*200, 88, 0xde6dd4)
                    }

                    if(checkWin()){
                        gameState.startX = !gameState.startX;
                        if(gameState.turn){
                            this.add.text( 400, 50, 'X Wins', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                            gameState.xWins++;
                            gameState.xText.destroy();
                            gameState.xText = this.add.text(80, 50, 'X Wins: '+gameState.xWins, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                        }
                        else{
                            this.add.text( 400, 50, 'O Wins', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                            gameState.oWins++;
                            gameState.oText.destroy();
                            gameState.oText = this.add.text(720, 50, 'O Wins: '+gameState.oWins, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                        }

                        this.add.text(400, 750, 'Click to Play Again', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                        this.input.on('pointerup', () => {
                            this.scene.stop('GameScreen');
                            this.scene.start('StartScreen');
                        })
                        gameState.board = null;
                    }
                    else if(checkDraw()){
                        gameState.startX = !gameState.startX;
                        this.add.text(400, 50, 'Draw', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                        this.add.text(400, 750, 'Click to Play Again', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                        this.input.on('pointerup', () => {
                            this.scene.stop('GameScreen');
                            this.scene.start('StartScreen');
                        })
                        gameState.board = null;
                    }
                    

                    gameState.turn = !gameState.turn;  
                })
            }
        }

        gameState.xText = this.add.text(80, 50, 'X Wins: '+gameState.xWins, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
        gameState.oText = this.add.text(720, 50, 'O Wins: '+gameState.oWins, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);

        this.add.line(0,0, 300, 100, 300, 700, 0x000000).setOrigin(0, 0);
        this.add.line(0,0, 500, 100, 500, 700, 0x000000).setOrigin(0, 0);
        this.add.line(0,0, 100, 300, 700, 300, 0x000000).setOrigin(0, 0);
        this.add.line(0,0, 100, 500, 700, 500, 0x000000).setOrigin(0, 0);

        //Make the player turn (True = X, false = O)
        gameState.turn = gameState.startX;
    }
}

//Phaser settings
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor: "de6dd4", //Light pink
    scene: [StartScreen, GameScreen],

    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

//Checks if a player has won the game
function checkWin() {
    for(let i = 0; i < 3; i++){
        if((gameState.board[i][0] == true || gameState.board[i][0] == false) && gameState.board[i][0] == gameState.board[i][1] && gameState.board[i][0] == gameState.board[i][2]){
            return true;
        }
    }
    for(let i = 0; i < 3; i++){
        if((gameState.board[0][i] == true || gameState.board[0][i] == false) && gameState.board[0][i] == gameState.board[1][i] && gameState.board[0][i] == gameState.board[2][i]){
            return true;
        }
    }
    if((gameState.board[0][0] == true || gameState.board[0][0] == false) && gameState.board[0][0] == gameState.board[1][1] && gameState.board[0][0] == gameState.board[2][2]){
        return true;
    }
    if((gameState.board[0][2] == true || gameState.board[0][2] == false) && gameState.board[0][2] == gameState.board[1][1] && gameState.board[0][2] == gameState.board[2][0]){
        return true;
    }
}

//Check for draw
function checkDraw() {
    let draw = true;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(gameState.board[i][j] != true && gameState.board[i][j] != false){
                draw = false;
            }
        }
    }

    if(draw){
        return true;
    }
}

//Make the game
const game = new Phaser.Game(config);