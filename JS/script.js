// script.js
// ** Module creation **

// Module
var casinoApp = angular.module('casinoApp', ['ngRoute']);

//Configure routes
casinoApp.config(function($routeProvider){
	$routeProvider

		// route for home page
		.when('/',{
			templateUrl: 'views/home.html',
			controller: 'mainController'
		})

		// route for about page
		.when('/about',{
			templateUrl: 'views/about.html',
			controller: 'aboutController'
		})

		// route for contact page
		.when('/contact',{
			templateUrl: 'views/contact.html',
			controller: 'contactController'
		})

		// route for blackjack page
		.when('/blackjack',{
			templateUrl: 'views/blackjack.html',
			controller: 'blackjackController'
		});
});

casinoApp.factory('DeckFactory', function(){
	var suits = [
		{name:'Hearts', abbr:'H', symbol:'\u2665'},
		{name:'Clubs', abbr:'C', symbol:'\u2663'},
		{name:'Diamonds', abbr:'D', symbol:'\u2666'},
		{name:'Spades', abbr:'S', symbol:'\u2660'}
	];

	var ranks = [];
	ranks.push({label:'A', value:1, secondaryValue: 11});
	ranks.push({label:'K', value:13, secondaryValue: 10});
	ranks.push({label:'Q', value:12, secondaryValue: 10});
	ranks.push({label:'J', value:11, secondaryValue: 10});
	for(rank = 2; rank <= 10; rank+=1){
		ranks.push({label:rank, value:rank, secondaryValue:rank});
	}

	var deck = [];

	for(cardSuit = 0; cardSuit < suits.length; cardSuit++){
		for(cardRank = 0; cardRank < ranks.length; cardRank++){
			deck.push({suit:suits[cardSuit], rank:ranks[cardRank]});
		}
	}
	return deck;
});

//Main Controller
casinoApp.controller('mainController', function($scope){

	$scope.message = 'Welcome to the casino';
	$scope.pageClass = 'page-home';
	$scope.games = [
		{ 
			name:"Blackjack",
			link:"blackjack"
		},
		{
			name:"Texas Hold'em",
			link:"texasHoldem"
		}

	];

});

//About Controller
casinoApp.controller('aboutController', function($scope){

	$scope.message = 'About this app';
	$scope.pageClass = 'page-about';

});

//Contact Controller
casinoApp.controller('contactController', function($scope){

	$scope.message = 'Talk to me';
	$scope.pageClass = 'page-contact';

});

//Blackjack Controller
casinoApp.controller('blackjackController',  function($scope, DeckFactory){

	$scope.result = '';
	$scope.gameOver = false;
	$scope.pageClass = 'page-blackjack';
	$scope.Deck = DeckFactory;
	$scope.deckPosition = 0;
	$scope.playerCards = [];
	$scope.dealerCards = [];
	$scope.roundOver = true;
	$scope.playerMoney = 100;
	$scope.playerBet = 10;

	$scope.shuffle = function(){
		var shuffledDeck = new Array(52);

		// This is a card shuffling algorithm I found online
		for (var i = 0; i < $scope.Deck.length; i++) {    
	        var rand = Math.floor(Math.random() * (i + 1));  
	        shuffledDeck[i] = shuffledDeck[rand];
	        shuffledDeck[rand] = $scope.Deck[i];
	    }

	    $scope.Deck = shuffledDeck;
	};

	$scope.clearCards = function(){
		$scope.playerCards = [];
		$scope.dealerCards = [];
	};

	$scope.playerHandTotal = function(){
		var total = 0;
		for(var i = 0; i < $scope.playerCards.length; i++){
			total += $scope.playerCards[i].rank.secondaryValue;
		}
		if(total > 21){
			var j = 0;
			while(j < $scope.playerCards.length && total > 21){
				if($scope.playerCards[j].rank.label == 'A'){
					total -= 10;
				}
				j++;
			}
		}
		if(total > 21){
			$scope.result = "You busted";
			if($scope.playerMoney > 0){
				$scope.roundOver = true;
			}
			else{
				$scope.gameOver = true;
				$scope.roundOver = true;
			}	
		}
		return total;
	};

	$scope.dealerHandTotal = function(){
		var total = 0;
		for(var i = 0; i < $scope.dealerCards.length; i++){
			total += $scope.dealerCards[i].rank.secondaryValue;
		}
		if(total > 21){
			var j = 0;
			while(j < $scope.dealerCards.length && total > 21){
				if($scope.dealerCards[j].rank.label == 'A'){
					total -= 10;
				}
				j++;
			}
		}
		return total;
	};

	$scope.dealCard = function(target, dealerTurn){
		if(target == "p"){
			if($scope.playerCards.length < 5){
				$scope.playerCards.push($scope.Deck[$scope.deckPosition]);
			}
		}
		else{
			if($scope.dealerCards.length < 5){
				$scope.dealerCards.push($scope.Deck[$scope.deckPosition]);
			}
		}
		$scope.deckPosition++;
	};

	$scope.dealHand = function(){
		$scope.roundOver = false;
		$scope.result ='';
		$scope.shuffle();
		$scope.clearCards();
		$scope.deckPosition = 0;
		$scope.dealCard("p", false);
		$scope.dealCard("c", false);
		$scope.dealCard("p", false);
		$scope.dealCard("c", false);
	};

	$scope.hit = function(){
		$scope.dealCard("p", false);
	};

	$scope.stay = function(){
		while($scope.dealerHandTotal() < $scope.playerHandTotal() && $scope.dealerHandTotal() <= 21){
			$scope.dealCard("c", true);
		}
		if($scope.dealerHandTotal() > 21){
			$scope.result = "Dealer busted. You win " + $scope.playerBet;
			$scope.playerMoney += $scope.playerBet * 2;
		}
		else if($scope.dealerHandTotal() == $scope.playerHandTotal()){
			$scope.result = "It is a draw.";
		}
		else{
			$scope.result = "You lose";
		}
		if($scope.playerMoney > 0){
			$scope.roundOver = true;
		}
		else{
			$scope.gameOver = true;
			$scope.roundOver = true;
		}		
	};

	$scope.bet = function(){
		if($scope.playerMoney - $scope.playerBet >= 0){
			$scope.playerMoney -= $scope.playerBet;
			$scope.dealHand();
		}
	};

	$scope.reset = function(){
		$scope.playerMoney = 100;
		$scope.clearCards();
		$scope.gameOver = false;
	};
});