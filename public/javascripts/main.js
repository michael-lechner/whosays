/**
* static game constants
*/
var startLevel = 1;
var logMultiplier = 9;
var soundHold = 1;
var pitch0 = 200;
var pitch1 = 300;
var pitch2 = 400;
var pitch3 = 500;
var moveInterval = 300;
var sqAnimSpd = 100;
var resultAnimInSpd = 800;
var resultAnimOutSpd = 2000;
var wKey = 87;
var eKey = 69;
var nKey = 78;
var mKey = 77;
var spaceKey = 32;
var timerSpd = 500;
/**
* end static game constants
*/


var timer = null;
var timeSecs = 3;

var aiPlayer = null;
var hPlayer = null;

var gameInProgress = false;
var isRecording = false;
var level = startLevel;

$(document).ready(function(){

	var navHeight = $('.navbar').height();

	var windowResize = function(){
		$('.main').css('height', $(window).height() - navHeight*2);
		$('.sq').css('height', (($(window).height() - navHeight*2)/2));
	};

	$(window).resize(function(){
		windowResize();
	});

	$(window).load(function(){
		windowResize();
	});

	var Move = function(color){
		this.color = color;
		this.sound = new Wad({source: 'sine'});
		this.sound.env.hold = soundHold

		switch(color){
			case 0:
				this.pitch = pitch0;
			break;
			case 1:
				this.pitch = pitch1;
			break;
			case 2:
				this.pitch = pitch2;
			break;
			case 3:
				this.pitch = pitch3;
			break;
			default:
		}
	};

	var Player = function(){
		this.moves = [];
		this.moveCount = 0;
		this.timer = null;
	};

	Player.prototype.playMove = function(){
		initMove(this.moves[this.moveCount]);
		this.moveCount++;		
	};

	Player.prototype.playMoveSequence = function(){
		this.timer = window.setInterval((function(){
			if(this.moveCount < this.moves.length){
				initMove(this.moves[this.moveCount]);
				this.moveCount++;
			}else{
				this.moveCount = 0;
				window.clearInterval(this.timer);
				isRecording = true;
			}
		}).bind(this), moveInterval);
	};

	Player.prototype.randMoves = function(numMoves){
		for(var i = 0; i < numMoves; i++){
			this.moves.push(new Move(getRandomInt(0,3)));
		}
	};

	Player.prototype.recordMoveSequence = function(){
		if(aiPlayer.moves.length >= hPlayer.moves.length){	
			if(aiPlayer.moves[hPlayer.moveCount].color === hPlayer.moves[hPlayer.moveCount].color){
				gameInProgress = false;
				if(aiPlayer.moves.length === hPlayer.moves.length){
					isRecording = false;
					resultToScreen(true);
					level += 1;
					updateLevel();
				}
			}else{
				resultToScreen(false);
				isRecording = false;
				gameInProgress = false;
				level = startLevel;
			}
		}else{
			isRecording = false;
			gameInProgress = false;
		}


	};

	var updateLevel = function(){
		$('.level').html('round: ' + level);
	}

	var initGame = function(){
			aiPlayer = new Player();
			hPlayer = new Player();
			var logLevel = Math.floor(Math.log(level*logMultiplier))

			aiPlayer.randMoves(logLevel);
			aiPlayer.playMoveSequence(hPlayer.recordMoveSequence);
	};

	var initMove = function(obj){
		$('.sq-' + obj.color).animate({opacity: 0.5}, sqAnimSpd, function(){
			obj.sound.play({pitch: obj.pitch});
			$('.sq-' + obj.color).animate({opacity: 1.0}, sqAnimSpd);
		});
	};

	var resultToScreen = function(isSuccess){
		if(isSuccess){
			$('.main').prepend('<div class="result-display">{0}</div>'.supplant(['WIN']));
			$('.result-display').fadeOut(0);
			$('.result-display').fadeIn(resultAnimInSpd, function(){
				$(this).fadeOut(resultAnimOutSpd, function(){
					$(this).remove();	
				});
			});
		}else{
			$('.main').prepend('<div class="result-display">{0}</div>'.supplant(['FAIL']));
			$('.result-display').fadeOut(0);
			$('.result-display').fadeIn(resultAnimInSpd, function(){
				$(this).fadeOut(resultAnimOutSpd, function(){
					$(this).remove();	
				});
			});			
		}
	};

	var startTimer = function(){
		if(timer === null){
			timeToScreen();
			timer = window.setInterval(timeToScreen, timerSpd);			
		}else{
			clearInterval(timer);
			timer = null;
			timeSecs = 3;
			initGame();
			$('.status').html('space to start');
		};
	};

	var timeToScreen = function(){

		$('.status').html(timeSecs);

   		timeSecs--;

   		if(timeSecs < 0){
   			startTimer();
   		};
	};

	$(document).on('keydown', function(e){
		if(isRecording){
			switch(e.which){
				case wKey:
					hPlayer.moves.push(new Move(0));
					hPlayer.recordMoveSequence();
					hPlayer.playMove();
				break;
				case eKey:
					hPlayer.moves.push(new Move(1));
					hPlayer.recordMoveSequence();
					hPlayer.playMove();				
				break;
				case nKey:
					hPlayer.moves.push(new Move(2));
					hPlayer.recordMoveSequence();
					hPlayer.playMove();				
				break;
				case mKey:
					hPlayer.moves.push(new Move(3));
					hPlayer.recordMoveSequence();
					hPlayer.playMove();				
				break;
				default:
			}
		}
	});

	$(document).on('click', '.sq', function(e){
		e.stopPropagation();
		if(isRecording){	
			if($(this).hasClass('sq-0')){
					hPlayer.moves.push(new Move(0));
					hPlayer.recordMoveSequence();
					hPlayer.playMove();
			}else if($(this).hasClass('sq-1')){
					hPlayer.moves.push(new Move(1));
					hPlayer.recordMoveSequence();
					hPlayer.playMove();				
			}else if($(this).hasClass('sq-2')){
			 		hPlayer.moves.push(new Move(2));
			 		hPlayer.recordMoveSequence();
			 		hPlayer.playMove();				
			}else if($(this).hasClass('sq-3')){
					hPlayer.moves.push(new Move(3));
					hPlayer.recordMoveSequence();
					hPlayer.playMove();		
			}
		}else{
			if(!gameInProgress){
				gameInProgress = true;
				updateLevel();
				startTimer();
			}else if(gameInProgress){
				gameInProgress = false;
				level = startLevel;
			}
		}
	});

	//spacebar
	$(document).on('keydown', function(e){
		if(e.which === spaceKey){
			if(!gameInProgress){
				gameInProgress = true;
				updateLevel();
				startTimer();
			}else if(gameInProgress){
				gameInProgress = false;
				level = startLevel;
			}
		}
	});

	$(document).on('click', '.start-game', function(){
			if(!gameInProgress){
				gameInProgress = true;
				updateLevel();
				startTimer();
			}else if(gameInProgress){
				gameInProgress = false;
				level = startLevel;
			}
	});

	$(document).on('click', '.new-game', function(){
		gameInProgress = false;
		level = startLevel;
		updateLevel();
	})

	$(document).on('mouseover', '.li-icon img', function(){
		$(this).attr('src', '/images/li-blue.png')
	})

	$(document).on('mouseout', '.li-icon img', function(){
		$(this).attr('src', '/images/li-black.png')
	})

	// $(document).on('mouseout', '.li-icon img', function(){
	// 	$('.li-icon a').html('');
	// 	$('.li-icon a').html('<img src="/images/li-black.png">');
	// })

	updateLevel();
	$('.status').html('space to start');

});