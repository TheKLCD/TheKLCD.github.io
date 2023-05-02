const gameState = {
    player1Start: true,
    redWins: 0,
    blackWins: 0,
};


class StartScreen extends Phaser.Scene {
    constructor(){
        super({key: 'StartScreen'});
    }

    create(){
        this.add.text( 450, 400, 'Connect 4', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
        this.add.text( 450, 420, 'Click to Play', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);

        this.input.on('pointerup', () => {
            this.scene.stop('StartScreen');
            this.scene.start('GameScreen');
        })
    }
}

class GameScreen extends Phaser.Scene {
    constructor(){
        super({key: 'GameScreen'});
    }

    create(){
        gameState.board = [[], [], [], [], [], [], []];
        gameState.input = new Array(6);
        gameState.turn = gameState.player1Start;
        gameState.redWinText = this.add.text(100, 50, 'Red Wins: '+gameState.redWins, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
        gameState.blackWinText = this.add.text(800, 50, 'Black Wins: '+gameState.blackWins, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
        
        
        gameState.redBorder = this.add.rectangle(95, 95, 710, 610, 0xd42222).setOrigin(0, 0);
        gameState.blackBorder = this.add.rectangle(95, 95, 710, 610, 0x000000).setOrigin(0, 0);

        if(gameState.turn){
            gameState.blackBorder.setVisible(false);
        }
        else{
            gameState.redBorder.setVisible(false);
        }

        this.add.rectangle(100, 100, 700, 600, 0x346eeb).setOrigin(0, 0)

        for(let i = 0; i < 7; i++){
            for(let j = 0; j < 6; j++){
                this.add.circle(150+i*100, 150+j*100, 45, 0x7a3ca3);
            }
        }

        for(let i = 0; i < 7; i++){
            gameState.input[i] = this.add.rectangle(100+i*100, 100, 100, 600, 0xde6dd4, 0).setOrigin(0, 0);
            gameState.input[i].setInteractive().on('pointerup', () => {
                if(placeTile(i) == true){
                    gameState.input[i].destroy();
                }

                if(gameState.turn){
                    this.add.circle(150+gameState.lastX*100, 150+gameState.lastY*100, 45, 0xd42222);
                }
                else{
                    this.add.circle(150+gameState.lastX*100, 150+gameState.lastY*100, 45, 0x000000);
                }

                if(checkWin()){
                    gameState.player1Start = !gameState.player1Start;

                    if(gameState.turn){
                        this.add.text( 450, 50, 'Red Wins', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                        gameState.redWins++;
                        gameState.redWinText.destroy();
                        gameState.redWinText = this.add.text(100, 50, 'Red Wins: '+gameState.redWins, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                    }
                    else{
                        this.add.text( 450, 50, 'Black Wins', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                        gameState.blackWins++;
                        gameState.blackWinText.destroy();
                        gameState.blackWinText = this.add.text(800, 50, 'Black Wins: '+gameState.blackWins, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                    }
                    
                    for(let j = 0; j < 7; j++){
                        gameState.input[j].destroy();
                    }
                    this.add.text(450, 750, 'Click to Play Again', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                    this.input.on('pointerup', () => {
                        this.scene.stop('GameScreen');
                        this.scene.start('StartScreen');
                    })
                    
                }
                else if(checkDraw()){
                    this.add.text(450, 50, 'Draw', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);

                    for(let j = 0; j < 7; j++){
                        gameState.input[j].destroy();
                    }
                    this.add.text(450, 750, 'Click to Play Again', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                    this.input.on('pointerup', () => {
                        this.scene.stop('GameScreen');
                        this.scene.start('StartScreen');
                    })
                }

                if(gameState.turn){
                    gameState.redBorder.setVisible(false);
                    gameState.blackBorder.setVisible(true);
                }
                else{
                   gameState.redBorder.setVisible(true);
                   gameState.blackBorder.setVisible(false);
                }

                gameState.turn = !gameState.turn;
            })
        }
    }
}

function placeTile(column){
    for(let i = 5; i >= 0; i--){
        if(gameState.board[i][column] != true && gameState.board[i][column] != false){
            gameState.board[i][column] = gameState.turn;
            gameState.lastX = column;
            gameState.lastY = i;

            if(i == 0){
                return true;
            }

            return false;
        }
    }
}

function checkWin(){
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 4; j++){
            if((gameState.board[i][j] == true || gameState.board[i][j] == false) && gameState.board[i][j] == gameState.board[i][j+1] && gameState.board[i][j] == gameState.board[i][j+2] && gameState.board[i][j] == gameState.board[i][j+3]){
                return true;
            }
        }
    }

    for(let i = 0; i < 7; i++){
        for(let j = 0; j < 3; j++){
            if((gameState.board[j][i] == true || gameState.board[j][i] == false) && gameState.board[j][i] == gameState.board[j+1][i] && gameState.board[j][i] == gameState.board[j+2][i] && gameState.board[j][i] == gameState.board[j+3][i]){
                return true;
            }
        }
    }
    
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 4; j++){
            if((gameState.board[i][j] == true || gameState.board[i][j] == false) && gameState.board[i][j] == gameState.board[i+1][j+1] && gameState.board[i][j] == gameState.board[i+2][j+2] && gameState.board[i][j] == gameState.board[i+3][j+3]){
                return true;
            }
        }
    }

    for(let i = 5; i >= 3; i--){
        for(let j = 0; j < 4; j++){
            if((gameState.board[i][j] == true || gameState.board[i][j] == false) && gameState.board[i][j] == gameState.board[i-1][j+1] && gameState.board[i][j] == gameState.board[i-2][j+2] && gameState.board[i][j] == gameState.board[i-3][j+3]){
                return true;
            }
        }
    }

    return false;
}

function checkDraw(){
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 7; j++){
            if(gameState.board[i][j] != true && gameState.board[i][j] != false){
                return false;
            }
        }
    }

    return true;
}

//Phaser settings
const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 800,
    backgroundColor: "7a3ca3",
    scene: [StartScreen, GameScreen],

    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);