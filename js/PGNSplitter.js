//decompressed game
(function(window) {
	function PGNSplitter(pgn_file, id) {
		this.initialize(pgn_file, id);
	}

	var p = PGNSplitter.prototype;
	p.games = {};
	p.split;
		// constructor:
	p.initialize = function(pgn_file, id) {
		p.split = new signals.Signal()
		if(pgn_file){
			if(!id){
				id = 'anon';
			}
			this.loadPGN(pgn_file, id);
		}
	}

	p.loadPGN = function(file_name, identifier){
		var client = new XMLHttpRequest();
		client.open('GET', file_name);
		var that = this;
		client.onreadystatechange = function(){
			if(client.readyState == 4){
				that.games[identifier] = client.responseText.replace(/\[Event/g, "!NEW GAME![Event").split('!NEW GAME!');
				that.split.dispatch('complete', identifier);
		  	}
		}
		client.send();
	}

	p.createGameObject = function(pgn){
		return pgn;
	} 

	//TODO: dispatch event when ready

	window.PGNSplitter = PGNSplitter;
}(window));