const gameState = {
    player: {

    }
}

class StartScreen extends Phaser.Scene{
    constructor(){
        super({key: 'StartScreen'});
    }

    create(){
        this.add.text( 300, 300, 'Click To Play', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);

        this.input.on('pointerup', () => {
            this.scene.stop('StartScreen');
            this.scene.start('GameScreen');
        })
    }
}

class GameScreen extends Phaser.Scene{
    constructor(){
        super({key: 'GameScreen'})
    }

    create(){
        gameState.tick = 0;
        gameState.gameOver = false;

        gameState.board = Array.from(Array(20), () => new Array(20));
        for(let i = 0; i < 20; i++){
            for(let j = 0; j < 20; j++){
                gameState.board[i][j] = 0;
            }
        }

        gameState.board[10][1] = 1;
        gameState.board[10][2] = 1;

        gameState.player.position = [[10, 1],[10, 2]];
        gameState.player.render = [];

        for(let i = 0; i < 2; i++){
            gameState.player.render[i] = this.add.rectangle(gameState.player.position[i][1]*30, gameState.player.position[i][0]*30, 30, 30, 0x3f8c5a).setOrigin(0, 0);
        }

        gameState.board[10][10] = 2;
        gameState.ateApple = false;
        gameState.score = 2;
        gameState.direction = 1;
        gameState.lastMove = 1;

        gameState.applePosition = [10, 10];
        gameState.appleRender = this.add.rectangle(gameState.applePosition[1]*30, gameState.applePosition[0]*30, 30, 30, 0xe31b68).setOrigin(0, 0);

        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        gameState.tick++;

        if(gameState.tick == 10 && !gameState.gameOver){

            if(!gameState.ateApple){
                gameState.board[gameState.player.position[0][0]][gameState.player.position[0][1]] = 0;
                gameState.player.position.shift();
                gameState.player.render[0].destroy();
                gameState.player.render.shift();
            }
            else{
                gameState.ateApple = false;
            }

            if(gameState.direction == 0){
                if(gameState.player.position[gameState.player.position.length-1][0] == 0){
                    gameState.gameOver = true;
                }else{
                    gameState.player.position.push([gameState.player.position[gameState.player.position.length-1][0]-1, gameState.player.position[gameState.player.position.length-1][1]]);
                    gameState.lastMove = 0;
                }
            }
            else if(gameState.direction == 1){
                if(gameState.player.position[gameState.player.position.length-1][1] == 19){
                    gameState.gameOver = true;
                }
                else{
                    gameState.player.position.push([gameState.player.position[gameState.player.position.length-1][0], gameState.player.position[gameState.player.position.length-1][1]+1]);
                    gameState.lastMove = 1;
                }
            }
            else if(gameState.direction == 2){
                if(gameState.player.position[gameState.player.position.length-1][0] == 19){
                    gameState.gameOver = true;
                }
                else{
                    gameState.player.position.push([gameState.player.position[gameState.player.position.length-1][0]+1, gameState.player.position[gameState.player.position.length-1][1]]);
                    gameState.lastMove = 2;
                }
            }
            else{
                if(gameState.player.position[gameState.player.position.length-1][1] == 0){
                    gameState.gameOver = true;
                }
                else{
                    gameState.player.position.push([gameState.player.position[gameState.player.position.length-1][0], gameState.player.position[gameState.player.position.length-1][1]-1]);
                    gameState.lastMove = 3;
                }
            }

            gameState.player.render.push(this.add.rectangle(gameState.player.position[gameState.player.position.length-1][1]*30, gameState.player.position[gameState.player.position.length-1][0]*30, 30, 30, 0x3f8c5a).setOrigin(0, 0));

            if(gameState.player.position[gameState.player.position.length-1][0] == gameState.applePosition[0] && gameState.player.position[gameState.player.position.length-1][1] == gameState.applePosition[1]){
                gameState.ateApple = true;
                gameState.score++;
                newApple();
                gameState.appleRender.setPosition(gameState.applePosition[1]*30, gameState.applePosition[0]*30);
            }

            gameState.board[gameState.player.position[gameState.player.position.length-1][0]][gameState.player.position[[gameState.player.position.length-1]][1]] = 1;

            for(let i = 0; i < gameState.player.position.length-1; i++){
                if(gameState.player.position[gameState.player.position.length-1][0] == gameState.player.position[i][0] && gameState.player.position[gameState.player.position.length-1][1] == gameState.player.position[i][1]){
                    gameState.gameOver = true;
                }
            }

            if(gameState.gameOver){
                this.add.text( 300, 280, 'Game Over', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                this.add.text( 300, 300, 'Score: '+gameState.score, {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);
                this.add.text( 300, 320, 'Click To Play Again ', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5, 0.5);

                this.input.on('pointerup', () => {
                    this.scene.stop('GameScreen');
                    this.scene.start('StartScreen')
                })
            }

            gameState.tick = 0;
        }

        if(gameState.cursors.up.isDown && gameState.lastMove != 2){
            gameState.direction = 0;
        }
        else if(gameState.cursors.right.isDown && gameState.lastMove != 3){
            gameState.direction = 1;
        }
        else if(gameState.cursors.down.isDown && gameState.lastMove != 0){
            gameState.direction = 2;
        }
        else if(gameState.cursors.left.isDown && gameState.lastMove != 1){
            gameState.direction = 3;
        }

        function newApple(){
            let available = [];

            for(let i = 0; i < 20; i++){
                for(let j = 0; j < 20; j++){
                    if(gameState.board[i][j] == 0){
                        available.push([i, j]);
                    }
                }
            }

            let applePlacement = Math.floor(Math.random()*available.length);

            gameState.applePosition = available[applePlacement];
            gameState.board[available[applePlacement][1]][available[applePlacement][0]] = 2;
        }
    }
}



const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    backgroundColor: "4ab06c",
    scene: [StartScreen, GameScreen],

    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

const game = new Phaser.Game(config);