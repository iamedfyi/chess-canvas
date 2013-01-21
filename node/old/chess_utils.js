exports.build_move_tree = build_tree;

function build_tree(sequences){
	var move_tree = {
		name:"move 0", 
		children:[]
	};
	var node_lookup = {}

	for(var i = 0; i<sequences.length;i++){
		var game = new ch.Chess();
		game.load_pgn(sequences[i].moves);
		var history = game.history();
		var current_node = move_tree;
		var node_name = "";
		for(var m = 0; m<history.length; m++){
			var move = history[m];
			var next_index = -1;
			//get the index of the node with this move as its name
			node_name = node_name + "_" + move;	 // SHOULD give us a unique and repeatable id
			for(var c = 0; c < current_node.children.length; c++){
				if(current_node.children[c].move == move){
					next_index = c;
				}
			}
			//if it doesn't exist create it
			if(next_index < 0){	
				current_node.children.push({
					name:node_name,
					move:move,
					children:[]
				});
				next_index = current_node.children.length - 1; 
			}
			if(!node_lookup[node_name]){
				node_lookup[node_name] = {
					weight:0,
					opening_groups:[],
					opening_ending:""
				};
			}	
			//set it as the current node
			current_node = current_node.children[next_index];
			//update counts
			node_lookup[node_name].weight ++;
			node_lookup[node_name].opening_groups.push(sequences[i].ECO[0]);
			if(m == history.length-1){
				node_lookup[node_name].opening_ending = sequences[i].name + "(" +  sequences[i].ECO + ")";
			}
			if(next_index < 0){
				util.puts("ERROR! current_node = " + current_node);
			}
		}
	}

	//de duplicate all the opening group arrays
	for(var n in node_lookup){
		node_lookup[n].opening_groups = uniqueArray(node_lookup[n].opening_groups);
	}

	var output_struct = {
		tree:move_tree,
		lookup:node_lookup
	};

	return output_struct;
}

function uniqueArray(unordered) { //return a de-duplicated version of an array
	var result = [];
	var object = {};
	unordered.forEach(function(item) {
		object[item] = null;
	});
	result = Object.keys(object);
	return result.sort();
}