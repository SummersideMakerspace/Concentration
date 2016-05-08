(function($){
	
	var game_in_progress = false;
	var field_size = {
		rows: 4, cols: 6, col_size: 2
	}
	var cards_flipped = 0;
	var pair_flips = 0;
	var pairs_left = 0;
	var first_card = second_card = '';
	var tileset = [];
	
	var decks = {
		upper_lower_alphabet: {
			init: function(){
				codeset = [];

				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					tile = {id: idx, code: Math.random().toString(36).substr(4, 1)};
					if(!isNaN(tile.code) || codeset.indexOf(tile.code) >= 0){
						idx--;
					} else {
						codeset.push(tile.code);
						tileset.push(tile);
					}
				}
				
				for(idx = 0; idx < total_pairs; idx++){
					tile = {id: tileset[idx].id, code: tileset[idx].code.toUpperCase()};
					tileset.push(tile);
				}
				
				idx = total_pairs << 1;
				while(idx != 0){
					random_idx = Math.floor(Math.random() * idx);
					idx--;
					
					temp = tileset[idx];
					tileset[idx] = tileset[random_idx];
					tileset[random_idx] = temp;
				}
			}
		}
	}
	
	$(document).ready(function(){
		$('.deal').click(function(){
			if(game_in_progress){
				$('.concentration-overlay .modal-dialog').addClass('modal-sm');
				$('.concentration-overlay .modal-content').html(
					"<p>Hmmm, Your game is already in progress. Are you sure you want to deal a new game?</p>"
					+ "<div class='text-center'><button class='deal-confirm btn btn-success btn-lg'>Yes, deal!</button></div>"
					+ "<div class='text-center'><button class='dismiss btn btn-default btn-lg'>No, keep playing</button></div>"
				);
				$('.deal-confirm').click(function(){
					$('.concentration-overlay').modal('hide');
					init();
				});
				$('.dismiss').click(function(){
					$('.concentration-overlay').modal('hide');
				});
				$('.concentration-overlay').modal();
				
				return;
			}
			init();			
		});
	});
	
	function init(){
		game_in_progress = true;
		pair_flips = 0;
		pairs_left = (field_size.rows * field_size.cols) >> 1;
		tileset = [];
		
		//TODO(cjw) support more decks
		decks[$('#deck-select').val()].init();
		
		$field = $('.field');
		$field.empty();		
		var even_odd_toggle = false;
		for(idx = 0; idx < field_size.rows; idx++){
			var row = $(document.createElement('div')).addClass('row');
			for(idy = 0; idy < field_size.cols; idy++){
				tile = tileset.pop();
				var col = $(document.createElement('div'))
					.addClass('col-xs-' + field_size.col_size);
				col.append(
					$(document.createElement('div'))
					.addClass('card')
					.addClass((even_odd_toggle ? 'card-even' : 'card-odd'))
					.addClass('card-' + idx + '-' + idy)
					.attr('data-card-id', idx + '-' + idy)
					.attr('data-tile-id', tile.id)
					.html(
						"<div class='front'>?</div>"
						+ "<div class='back'>" + tile.code + "</div>"
					)
					.flip({
						autosize: [true, true], 
						trigger: 'manual'}
					)
				);
				row.append(col);
				even_odd_toggle = !even_odd_toggle;
			}
			$field.append(row);
		}
		$('.card').each(function(){
			$(this).on('flip:done', function(){
				if(cards_flipped == 2){
					if(cardsMatch()){
						setTimeout(function(){
							$('.card-' + first_card).addClass('match');
							$('.card-' + second_card).addClass('match');
						}, 125);
						setTimeout(function(){
							$('.card-' + first_card).removeClass('match');
							$('.card-' + second_card).removeClass('match');
							triedAPair(true);
						}, 550);
					} else {
						setTimeout(function(){
							$('.card-' + first_card).addClass('no-match');
							$('.card-' + second_card).addClass('no-match');
						}, 550);
						setTimeout(function(){
							$('.card-' + first_card).removeClass('no-match');
							$('.card-' + second_card).removeClass('no-match');							
							$('.card-' + first_card).flip(false);
							$('.card-' + second_card).flip(false);
							triedAPair();
						}, 1150);
					}
				}
			});
		});
		$('.card').click(function(){
			if(cards_flipped < 2){
				if(cards_flipped == 0){
					first_card = $(this).attr('data-card-id');
					$(this).flip(true);					
				} else {
					second_card = $(this).attr('data-card-id');
					$(this).flip(true);	
				}
				cards_flipped++;
			}
		});
	}
	
	function triedAPair(matched = false){
		pair_flips++;
		cards_flipped = 0;
		if(matched && (--pairs_left == 0)){
			gameOver();
		}
	}
	
	function gameOver(){
		$('.concentration-overlay .modal-dialog').removeClass('modal-sm');
		$('.concentration-overlay .modal-content').html(
			"<h1>You win!</h1>"
			+ "<p>You found all " + (field_size.rows * field_size.cols) + " pairs in " + pair_flips + " tries.</p>"
		);
		$('.concentration-overlay').modal();
		game_in_progress = false;
	}
	
	function cardsMatch(){
		return $('.card-' + first_card).attr('data-tile-id') 
			== $('.card-' + second_card).attr('data-tile-id');
	}
	
})(jQuery);