(function($){
	console.log($(window).width());
	var game_in_progress = false;
	var field_size = {
		rows: 4, cols: 4, col_size: 3
	}
	if(992 <= Math.max(document.documentElement.clientWidth, window.innerWidth || 0)){
		var field_size = {
			rows: 4, cols: 6, col_size: 2
		}		
	}
	var cards_flipped = 0;
	var pair_flips = 0;
	var pairs_left = 0;
	var first_card = second_card = '';
	var tile_set = [];
	var streak = 0;
	
	var decks = {
		upper_lower_alphabet: {
			init: function(){
				code_set = [];

				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					tile = {id: idx, code: Math.random().toString(36).substr(4, 1), matched: false};
					if(!isNaN(tile.code) || code_set.indexOf(tile.code) >= 0){
						idx--;
					} else {
						code_set.push(tile.code);
						tile_set.push(tile);
					}
				}
				
				for(idx = 0; idx < total_pairs; idx++){
					tile = {id: tile_set[idx].id, code: tile_set[idx].code.toUpperCase(), matched: false};
					tile_set.push(tile);
				}
			}
		},
		element_atomic_number: {
			init: function(){
				code_set = [];
				full_set = fullSetPeriodicTable();			
				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					temporary_element = Math.floor(Math.random() * full_set.length);
					if(code_set.indexOf(temporary_element) >= 0){
						idx--;
					} else {
						code_set.push(temporary_element);
						tile = {
							id: idx, 
							code: full_set[temporary_element].symbol 
								+ "<span class='tiny bottom'>" 
								+ full_set[temporary_element].title 
								+ "</span>",
							matched: false
						};
						tile_set.push(tile);
						tile = {id: idx, code: temporary_element + 1, matched: false};
						tile_set.push(tile);					
					}
				}
			}
		},
		element_atomic_symbol: {
			init: function(){
				code_set = [];
				full_set = fullSetPeriodicTable();			
				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					temporary_element = Math.floor(Math.random() * full_set.length);
					if(code_set.indexOf(temporary_element) >= 0){
						idx--;
					} else {
						code_set.push(temporary_element);
						tile = {
							id: idx, 
							code: temporary_element + 1
								+ "<span class='tiny bottom'>" 
								+ full_set[temporary_element].title 
								+ "</span>",
							matched: false
						};
						tile_set.push(tile);
						tile = {id: idx, code: full_set[temporary_element].symbol, matched: false};
						tile_set.push(tile);					
					}
				}
			}
		},		
		morse_english: {
			init: function(){
				code_set = [];
				full_set = fullSetMorse();
				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					temporary_element = Math.floor(Math.random() * full_set.length);
					if(code_set.indexOf(temporary_element) >= 0){
						idx--;
					} else {
						code_set.push(temporary_element);
						tile = {
							id: idx, 
							code: full_set[temporary_element].morse,
							matched: false
						};
						tile_set.push(tile);
						tile = {id: idx, code: full_set[temporary_element].english, matched: false};
						tile_set.push(tile);					
					}
				}				
				
			}
		},
		braille_english_uncontracted: {
			init: function(){
				code_set = [];
				full_set = fullSetBraille();				
				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					temporary_element = Math.floor(Math.random() * full_set.length);
					if(code_set.indexOf(temporary_element) >= 0){
						idx--;
					} else {
						code_set.push(temporary_element);
						tile = {
							id: idx, 
							code: full_set[temporary_element].braille,
							matched: false
						};
						tile_set.push(tile);
						tile = {id: idx, code: full_set[temporary_element].english, matched: false};
						tile_set.push(tile);					
					}
				}				
				
			}			
		},
		japanese_katakana_english: {
			init: function(){
				code_set = [];
				full_set = fullSetKana();				
				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					temporary_element = Math.floor(Math.random() * full_set.length);
					if(code_set.indexOf(temporary_element) >= 0){
						idx--;
					} else {
						code_set.push(temporary_element);
						tile = {
							id: idx, 
							code: full_set[temporary_element].katakana,
							matched: false
						};
						tile_set.push(tile);
						tile = {id: idx, code: full_set[temporary_element].romaji, matched: false};
						tile_set.push(tile);					
					}
				}				
				
			}			
		},
		japanese_hiragana_english: {
			init: function(){
				code_set = [];
				full_set = fullSetKana();				
				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					temporary_element = Math.floor(Math.random() * full_set.length);
					if(code_set.indexOf(temporary_element) >= 0){
						idx--;
					} else {
						code_set.push(temporary_element);
						tile = {
							id: idx, 
							code: full_set[temporary_element].hiragana,
							matched: false
						};
						tile_set.push(tile);
						tile = {id: idx, code: full_set[temporary_element].romaji, matched: false};
						tile_set.push(tile);					
					}
				}				
				
			}			
		},
		japanese_katakana_hiragana: {
			init: function(){
				code_set = [];
				full_set = fullSetKana();				
				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					temporary_element = Math.floor(Math.random() * full_set.length);
					if(code_set.indexOf(temporary_element) >= 0){
						idx--;
					} else {
						code_set.push(temporary_element);
						tile = {
							id: idx, 
							code: full_set[temporary_element].katakana,
							matched: false
						};
						tile_set.push(tile);
						tile = {id: idx, code: full_set[temporary_element].hiragana, matched: false};
						tile_set.push(tile);					
					}
				}				
				
			}			
		},
		japanese_kanji_grade_1: {
			init: function(){
				code_set = [];
				full_set = fullSetKanjiGrade1();				
				total_pairs = (field_size.rows * field_size.cols) >> 1;
				for(idx = 0; idx < total_pairs; idx++){
					temporary_element = Math.floor(Math.random() * full_set.length);
					if(code_set.indexOf(temporary_element) >= 0){
						idx--;
					} else {
						code_set.push(temporary_element);
						tile = {
							id: idx, 
							code: full_set[temporary_element].kanji,
							matched: false
						};
						tile_set.push(tile);
						tile = {id: idx, code: '<span class="small middle">' + full_set[temporary_element].meaning + '</span>', matched: false};
						tile_set.push(tile);					
					}
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
		tile_set = [];
		
		decks[$('#deck-select').val()].init();
		drawShuffledField();
	}
	
	function drawShuffledField(){
		shuffle();
		drawField();
	}
	
	function shuffle(){
		idx = total_pairs << 1;
		while(idx != 0){
			random_idx = Math.floor(Math.random() * idx);
			idx--;
			
			temp = tile_set[idx];
			tile_set[idx] = tile_set[random_idx];
			tile_set[random_idx] = temp;
		}				
	}	
	
	function drawField(){
		$field = $('.field');
		$field.empty();
		var even_odd_toggle = false;
		for(idx = 0; idx < field_size.rows; idx++){
			var row = $(document.createElement('div')).addClass('row');
			for(idy = 0; idy < field_size.cols; idy++){
				tile = tile_set[idx * field_size.cols + idy];
				var card = $(document.createElement('div'))
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
					);
				
				if(tile.matched){
					card.attr('data-matched', true);
					card.flip(true);
				}
					
				row.append($(document.createElement('div'))
					.addClass('col-xs-' + field_size.col_size)
					.append(card)
				);
				even_odd_toggle = !even_odd_toggle;
			}
			$field.append(row);
		}	

		$('.card').each(function(){
			$(this).click(function(){
				if($(this).attr('data-matched')){
					return;
				}
				if(cards_flipped < 2){
					if(cards_flipped == 0){
						first_card = $(this).attr('data-card-id');
					} else {
						if($(this).attr('data-card-id') == first_card){
							return;
						}
						second_card = $(this).attr('data-card-id');
					}
					$(this).flip(true);	
					if(++cards_flipped == 2){
						triedAPair();
					}
				}
			});
		});		
	}
	
	function triedAPair(){
		pair_flips++;
		if(cardsMatch()){
			pairs_left--;
			$.each(tile_set, function(index, entry){				
				if(entry.id == $('.card-' + first_card).attr('data-tile-id')){
					tile_set[index].matched = true;
				}
			});
			setTimeout(function(){
				$('.card-' + first_card).addClass('match').attr('data-matched', true);
				$('.card-' + second_card).addClass('match').attr('data-matched', true);
			}, 125);
			setTimeout(function(){
				$('.card-' + first_card).removeClass('match');
				$('.card-' + second_card).removeClass('match');
				cards_flipped = 0;
				streak++;
				if($('#streak-penalty').val() > 0 && ($('#streak-penalty').val() <= streak)){
					streakPenalty();
				}
				if(pairs_left == 0){
					gameOver();
				}				
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
				cards_flipped = 0;
				streak = 0;
			}, 1150);
		}		
	}
	
	function streakPenalty(){
		streak = 0;
		setTimeout(function(){
			drawShuffledField();
		}, 500);
	}
	
	function gameOver(){
		$('.concentration-overlay .modal-dialog').removeClass('modal-sm');
		$('.concentration-overlay .modal-content').html(
			"<h1>You win!</h1>"
			+ "<p>You found all " + ((field_size.rows * field_size.cols) >> 1) + " pairs in " + pair_flips + " tries.</p>"
		);
		$('.concentration-overlay').modal();
		game_in_progress = false;
	}
	
	function cardsMatch(){
		return $('.card-' + first_card).attr('data-tile-id') 
			== $('.card-' + second_card).attr('data-tile-id');
	}
	
	function fullSetPeriodicTable(){
		return [
			{title: "Hydrogen", symbol: "H", mole: 1.00794},
			{title: "Helium", symbol: "He", mole: 4.002602},
			{title: "Lithium", symbol: "Li", mole: 6.941},
			{title: "Beryllium", symbol: "Be", mole: 9.012182},
			{title: "Boron", symbol: "B", mole: 10.811},
			{title: "Carbon", symbol: "C", mole: 12.0107},
			{title: "Nitrogen", symbol: "N", mole: 14.0067},
			{title: "Oxygen", symbol: "O", mole: 15.9994},
			{title: "Fluorine", symbol: "F", mole: 18.998404},
			{title: "Neon", symbol: "Ne", mole: 20.1797},
			{title: "Sodium", symbol: "Na", mole: 22.989769},
			{title: "Magnesium", symbol: "Mg", mole: 24.305},
			{title: "Aluminium", symbol: "Al", mole: 26.981539},
			{title: "Silicon", symbol: "Si", mole: 28.0855},
			{title: "Phosphorus", symbol: "P", mole: 30.973763},
			{title: "Sulfur", symbol: "S", mole: 32.065},
			{title: "Chlorine", symbol: "Cl", mole: 35.453},
			{title: "Argon", symbol: "Ar", mole: 39.948},
			{title: "Potassium", symbol: "K", mole: 39.0983},
			{title: "Calcium", symbol: "Ca", mole: 40.078},
			{title: "Scandium", symbol: "Sc", mole: 44.955914},
			{title: "Titanium", symbol: "Ti", mole: 47.867},
			{title: "Vanadium", symbol: "V", mole: 50.9415},
			{title: "Chromium", symbol: "Cr", mole: 51.9961},
			{title: "Manganese", symbol: "Mn", mole: 54.938046},
			{title: "Iron", symbol: "Fe", mole: 55.845},
			{title: "Cobalt", symbol: "Co", mole: 58.933193},
			{title: "Nickel", symbol: "Ni", mole: 58.6934},
			{title: "Copper", symbol: "Cu", mole: 63.546},
			{title: "Zinc", symbol: "Zn", mole: 65.38},
			{title: "Gallium", symbol: "Ga", mole: 69.723},
			{title: "Germanium", symbol: "Ge", mole: 72.63},
			{title: "Arsenic", symbol: "As", mole: 74.9216},
			{title: "Selenium", symbol: "Se", mole: 78.96},
			{title: "Bromine", symbol: "Br", mole: 79.904},
			{title: "Krypton", symbol: "Kr", mole: 83.798},
			{title: "Rubidium", symbol: "Rb", mole: 85.4678},
			{title: "Strontium", symbol: "Sr", mole: 87.62},
			{title: "Yttrium", symbol: "Y", mole: 88.90585},
			{title: "Zirconium", symbol: "Zr", mole: 91.224},
			{title: "Niobium", symbol: "Nb", mole: 92.90638},
			{title: "Molybdenum", symbol: "Mo", mole: 95.96},
			{title: "Technetium", symbol: "Tc", mole: 98},
			{title: "Ruthenium", symbol: "Ru", mole: 101.07},
			{title: "Rhodium", symbol: "Rh", mole: 102.9055},
			{title: "Palladium", symbol: "Pd", mole: 106.42},
			{title: "Silver", symbol: "Ag", mole: 107.8682},
			{title: "Cadmium", symbol: "Cd", mole: 112.411},
			{title: "Indium", symbol: "In", mole: 114.818},
			{title: "Tin", symbol: "Sn", mole: 118.71},
			{title: "Antimony", symbol: "Sb", mole: 121.76},
			{title: "Tellurium", symbol: "Te", mole: 127.6},
			{title: "Iodine", symbol: "I", mole: 126.90447},
			{title: "Xenon", symbol: "Xe", mole: 131.293},
			{title: "Caesium", symbol: "Cs", mole: 132.90546},
			{title: "Barium", symbol: "Ba", mole: 137.327},
			{title: "Lanthanum", symbol: "La", mole: 138.90547},
			{title: "Cerium", symbol: "Ce", mole: 140.116},
			{title: "Praseodymium", symbol: "Pr", mole: 140.90765},
			{title: "Neodymium", symbol: "Nd", mole: 144.242},
			{title: "Promethium", symbol: "Pm", mole: 145},
			{title: "Samarium", symbol: "Sm", mole: 150.36},
			{title: "Europium", symbol: "Eu", mole: 151.964},
			{title: "Gadolinium", symbol: "Gd", mole: 157.25},
			{title: "Terbium", symbol: "Tb", mole: 158.92535},
			{title: "Dysprosium", symbol: "Dy", mole: 162.5},
			{title: "Holmium", symbol: "Ho", mole: 164.93031},
			{title: "Erbium", symbol: "Er", mole: 167.259},
			{title: "Thulium", symbol: "Tm", mole: 168.9342},
			{title: "Ytterbium", symbol: "Yb", mole: 173.054},
			{title: "Lutetium", symbol: "Lu", mole: 174.9668}, 
			{title: "Hafnium", symbol: "Hf", mole: 178.49},
			{title: "Tantalum", symbol: "Ta", mole: 180.94788},
			{title: "Tungsten", symbol: "W", mole: 183.84},
			{title: "Rhenium", symbol: "Re", mole: 186.207},
			{title: "Osmium", symbol: "Os", mole: 190.23},
			{title: "Iridium", symbol: "Ir", mole: 192.217},
			{title: "Platinum", symbol: "Pt", mole: 195.084},
			{title: "Gold", symbol: "Au", mole: 196.96657},
			{title: "Mercury", symbol: "Hg", mole: 200.59},
			{title: "Thallium", symbol: "Tl", mole: 204.3833},
			{title: "Lead", symbol: "Pb", mole: 207.2},
			{title: "Bismuth", symbol: "Bi", mole: 208.9804},
			{title: "Polonium", symbol: "Po", mole: 209},
			{title: "Astatine", symbol: "At", mole: 210},
			{title: "Radon", symbol: "Rn", mole: 222},
			{title: "Francium", symbol: "Fr", mole: 223},
			{title: "Radium", symbol: "Ra", mole: 226},
			{title: "Actinium", symbol: "Ac", mole: 227},
			{title: "Thorium", symbol: "Th", mole: 232.03806},
			{title: "Protactinium", symbol: "Pa", mole: 231.03587},
			{title: "Uranium", symbol: "U", mole: 238.02892},
			{title: "Neptunium", symbol: "Np", mole: 237},
			{title: "Plutonium", symbol: "Pu", mole: 244},
			{title: "Americium", symbol: "Am", mole: 243},
			{title: "Curium", symbol: "Cm", mole: 247},
			{title: "Berkelium", symbol: "Bk", mole: 247},
			{title: "Californium", symbol: "Cf", mole: 251},
			{title: "Einsteinium", symbol: "Es", mole: 252},
			{title: "Fermium", symbol: "Fm", mole: 257},
			{title: "Mendelevium", symbol: "Md", mole: 258},
			{title: "Nobelium", symbol: "No", mole: 259},
			{title: "Lawrencium", symbol: "Lr", mole: 262},
			{title: "Rutherfordium", symbol: "Rf", mole: 267},
			{title: "Dubnium", symbol: "Db", mole: 268},
			{title: "Seaborgium", symbol: "Sg", mole: 271},
			{title: "Bohrium", symbol: "Bh", mole: 272},
			{title: "Hassium", symbol: "Hs", mole: 270},
			{title: "Meitnerium", symbol: "Mt", mole: 276},
			{title: "Darmstadtium", symbol: "Ds", mole: 281},
			{title: "Roentgenium", symbol: "Rg", mole: 280},
			{title: "Copernicium", symbol: "Cn", mole: 285},
			{title: "Ununtrium", symbol: "Uut", mole: 284},
			{title: "Flerovium", symbol: "Fl", mole: 289},
			{title: "Ununpentium", symbol: "Uup", mole: 288},
			{title: "Livermorium", symbol: "Lv", mole: 293},
			{title: "Ununseptium", symbol: "Uus", mole: 294},
			{title: "Ununoctium", symbol: "Uuo", mole: 294}
		];	
	}
	
	function fullSetMorse(){
		return [
			{morse: '&middot;-',	english: 'A'},
			{morse: '-&middot;&middot;&middot;',	english: 'B'},
			{morse: '-&middot;-&middot;',	english: 'C'},
			{morse: '-&middot;&middot;',	english: 'D'},
			{morse: '&middot;',	english: 'E'},
			{morse: '&middot;&middot;-&middot;',	english: 'F'},
			{morse: '--&middot;',	english: 'G'},
			{morse: '&middot;&middot;&middot;&middot;',	english: 'H'},
			{morse: '&middot;&middot;',	english: 'I'},
			{morse: '&middot;---',	english: 'J'},
			{morse: '-&middot;-',	english: 'K'},
			{morse: '&middot;-&middot;&middot;',	english: 'L'},
			{morse: '--',	english: 'M'},
			{morse: '-&middot;',	english: 'N'},
			{morse: '---',	english: 'O'},
			{morse: '&middot;--&middot;',	english: 'P'},
			{morse: '--&middot;-',	english: 'Q'},
			{morse: '&middot;-&middot;',	english: 'R'},
			{morse: '&middot;&middot;&middot;',	english: 'S'},
			{morse: '-',	english: 'T'},
			{morse: '&middot;&middot;-',	english: 'U'},
			{morse: '&middot;&middot;&middot;-',	english: 'V'},
			{morse: '&middot;--',	english: 'W'},
			{morse: '-&middot;&middot;-',	english: 'X'},
			{morse: '-&middot;--',	english: 'Y'},
			{morse: '--&middot;&middot;',	english: 'Z'},
			{morse: '-----',	english: '0'},
			{morse: '&middot;----',	english: '1'},
			{morse: '&middot;&middot;---',	english: '2'},
			{morse: '&middot;&middot;&middot;--',	english: '3'},
			{morse: '&middot;&middot;&middot;&middot;-',	english: '4'},
			{morse: '&middot;&middot;&middot;&middot;&middot;',	english: '5'},
			{morse: '-&middot;&middot;&middot;&middot;',	english: '6'},
			{morse: '--&middot;&middot;&middot;',	english: '7'},
			{morse: '---&middot;&middot;',	english: '8'},
			{morse: '----&middot;',	english: '9'},
		];
	}
	
	function fullSetBraille(){
		return [
			{braille: '&#x2801;',	english: 'A'},
			{braille: '&#x2803;',	english: 'B'},
			{braille: '&#x2809;',	english: 'C'},
			{braille: '&#x2819;',	english: 'D'},
			{braille: '&#x2811;',	english: 'E'},
			{braille: '&#x280b;',	english: 'F'},
			{braille: '&#x281b;',	english: 'G'},
			{braille: '&#x2813;',	english: 'H'},
			{braille: '&#x280a;',	english: 'I'},
			{braille: '&#x281a;',	english: 'J'},
			{braille: '&#x2805;',	english: 'K'},
			{braille: '&#x2807;',	english: 'L'},
			{braille: '&#x280d;',	english: 'M'},
			{braille: '&#x281d;',	english: 'N'},
			{braille: '&#x2815;',	english: 'O'},
			{braille: '&#x280f;',	english: 'P'},
			{braille: '&#x281f;',	english: 'Q'},
			{braille: '&#x2817;',	english: 'R'},
			{braille: '&#x280e;',	english: 'S'},
			{braille: '&#x281e;',	english: 'T'},
			{braille: '&#x2825;',	english: 'U'},
			{braille: '&#x2827;',	english: 'V'},
			{braille: '&#x283a;',	english: 'W'},
			{braille: '&#x282d;',	english: 'X'},
			{braille: '&#x283d;',	english: 'Y'},
			{braille: '&#x2835;',	english: 'Z'},
			{braille: '&#x2802;',	english: ','},
			{braille: '&#x2806;',	english: ';'},
			{braille: '&#x2812;',	english: ':'},
			{braille: '&#x2832;',	english: '.'},
			{braille: '&#x2816;',	english: '!'},
			{braille: '&#x2836;',	english: '()'},
			{braille: '&#x2826;',	english: '?&ldquo;'},
			{braille: '&#x2814;',	english: '*'},
			{braille: '&#x2834;',	english: '&rdquo;'},
			{braille: '&#x2804;',	english: '&apos;'},
			{braille: '&#x2824;',	english: '-'},
			{braille: '&#x283c;&#x281a;',	english: '0'},
			{braille: '&#x283c;&#x2801;',	english: '1'},
			{braille: '&#x283c;&#x2803;',	english: '2'},
			{braille: '&#x283c;&#x280c;',	english: '3'},
			{braille: '&#x283c;&#x281c;',	english: '4'},
			{braille: '&#x283c;&#x2811;',	english: '5'},
			{braille: '&#x283c;&#x280b;',	english: '6'},
			{braille: '&#x283c;&#x281b;',	english: '7'},
			{braille: '&#x283c;&#x2813;',	english: '8'},
			{braille: '&#x283c;&#x280a;',	english: '9'},
		];		
	}
	
	function fullSetKana(){
		return [
			{romaji: 'a', katakana: 'ア', hiragana: 'あ'},
			{romaji: 'i', katakana: 'イ', hiragana: 'い'},
			{romaji: 'u', katakana: 'ウ', hiragana: 'う'},
			{romaji: 'e', katakana: 'エ', hiragana: 'え'},
			{romaji: 'o', katakana: 'オ', hiragana: 'お'},
			{romaji: 'ka', katakana: 'カ', hiragana: 'か'},
			{romaji: 'ki', katakana: 'キ', hiragana: 'き'},
			{romaji: 'ku', katakana: 'ク', hiragana: 'く'},
			{romaji: 'ke', katakana: 'ケ', hiragana: 'け'},
			{romaji: 'ko', katakana: 'コ', hiragana: 'こ'},
			{romaji: 'sa', katakana: 'サ', hiragana: 'さ'},
			{romaji: 'shi', katakana: 'シ', hiragana: 'し'},
			{romaji: 'su', katakana: 'ス', hiragana: 'す'},
			{romaji: 'se', katakana: 'セ', hiragana: 'せ'},
			{romaji: 'so', katakana: 'ソ', hiragana: 'そ'},
			{romaji: 'ta', katakana: 'タ', hiragana: 'た'},
			{romaji: 'te', katakana: 'チ', hiragana: 'ち'},
			{romaji: 'tsu', katakana: 'ツ', hiragana: 'つ'},
			{romaji: 'te', katakana: 'テ', hiragana: 'て'},
			{romaji: 'to', katakana: 'ト', hiragana: 'と'},
			{romaji: 'na', katakana: 'ナ', hiragana: 'な'},
			{romaji: 'ni', katakana: 'ニ', hiragana: 'に'},
			{romaji: 'nu', katakana: 'ヌ', hiragana: 'ぬ'},
			{romaji: 'ne', katakana: 'ネ', hiragana: 'ね'},
			{romaji: 'no', katakana: 'ノ', hiragana: 'の'},
			{romaji: 'ha', katakana: 'ハ', hiragana: 'は'},
			{romaji: 'hi', katakana: 'ヒ', hiragana: 'ひ'},
			{romaji: 'fu', katakana: 'フ', hiragana: 'ふ'},
			{romaji: 'he', katakana: 'ヘ', hiragana: 'へ'},
			{romaji: 'ho', katakana: 'ホ', hiragana: 'ほ'},
			{romaji: 'ma', katakana: 'マ', hiragana: 'ま'},
			{romaji: 'mi', katakana: 'ミ', hiragana: 'み'},
			{romaji: 'mu', katakana: 'ム', hiragana: 'む'},
			{romaji: 'me', katakana: 'メ', hiragana: 'め'},
			{romaji: 'mo', katakana: 'モ', hiragana: 'も'},
			{romaji: 'ya', katakana: 'ヤ', hiragana: 'や'},
			{romaji: 'yu', katakana: 'ユ', hiragana: 'ゆ'},
			{romaji: 'yo', katakana: 'ヨ', hiragana: 'よ'},
			{romaji: 'ra', katakana: 'ラ', hiragana: 'ら'},
			{romaji: 'ri', katakana: 'リ', hiragana: 'り'},
			{romaji: 'ru', katakana: 'ル', hiragana: 'る'},
			{romaji: 're', katakana: 'レ', hiragana: 'れ'},
			{romaji: 'ro', katakana: 'ロ', hiragana: 'ろ'},
			{romaji: 'wa', katakana: 'ワ', hiragana: 'わ'},
			{romaji: 'wi', katakana: 'ヰ', hiragana: 'ゐ'},
			{romaji: 'we', katakana: 'ヱ', hiragana: 'ゑ'},
			{romaji: 'wo', katakana: 'ヲ', hiragana: 'を'},
			{romaji: 'n', katakana: 'ン', hiragana: 'ん'},
			{romaji: 'ga', katakana: 'ガ', hiragana: 'が'},
			{romaji: 'ge', katakana: 'ギ', hiragana: 'ぎ'},
			{romaji: 'gu', katakana: 'グ', hiragana: 'ぐ'},
			{romaji: 'ge', katakana: 'ゲ', hiragana: 'げ'},
			{romaji: 'go', katakana: 'ゴ', hiragana: 'ご'},
			{romaji: 'za', katakana: 'ザ', hiragana: 'ざ'},
			{romaji: 'ji', katakana: 'ジ', hiragana: 'じ'},
			{romaji: 'zu', katakana: 'ズ', hiragana: 'ず'},
			{romaji: 'ze', katakana: 'ゼ', hiragana: 'ぜ'},
			{romaji: 'zo', katakana: 'ゾ', hiragana: 'ぞ'},
			{romaji: 'da', katakana: 'ダ', hiragana: 'だ'},
			{romaji: 'ji', katakana: 'ヂ', hiragana: 'ぢ'},
			{romaji: 'zu', katakana: 'ヅ', hiragana: 'づ'},
			{romaji: 'de', katakana: 'デ', hiragana: 'で'},
			{romaji: 'do', katakana: 'ド', hiragana: 'ど'},
			{romaji: 'ba', katakana: 'バ', hiragana: 'ば'},
			{romaji: 'bi', katakana: 'ビ', hiragana: 'び'},
			{romaji: 'bu', katakana: 'ブ', hiragana: 'ぶ'},
			{romaji: 'be', katakana: 'ベ', hiragana: 'べ'},
			{romaji: 'bo', katakana: 'ボ', hiragana: 'ぼ'},
			{romaji: 'pa', katakana: 'パ', hiragana: 'ぱ'},
			{romaji: 'pe', katakana: 'ピ', hiragana: 'ぴ'},
			{romaji: 'pu', katakana: 'プ', hiragana: 'ぷ'},
			{romaji: 'pe', katakana: 'ペ', hiragana: 'ぺ'},
			{romaji: 'po', katakana: 'ポ', hiragana: 'ぽ'},
			{romaji: 'kya', katakana: 'キャ', hiragana: 'きゃ'},
			{romaji: 'kyu', katakana: 'キュ', hiragana: 'きゅ'},
			{romaji: 'kyo', katakana: 'キョ', hiragana: 'きょ'},
			{romaji: 'sha', katakana: 'シャ', hiragana: 'しゃ'},
			{romaji: 'shu', katakana: 'シュ', hiragana: 'しゅ'},
			{romaji: 'sho', katakana: 'ショ', hiragana: 'しょ'},
			{romaji: 'cha', katakana: 'チャ', hiragana: 'ちゃ'},
			{romaji: 'chu', katakana: 'チュ', hiragana: 'ちゅ'},
			{romaji: 'cho', katakana: 'チョ', hiragana: 'ちょ'},
			{romaji: 'nya', katakana: 'ニャ', hiragana: 'にゃ'},
			{romaji: 'nyu', katakana: 'ニュ', hiragana: 'にゅ'},
			{romaji: 'nyo', katakana: 'ニョ', hiragana: 'にょ'},
			{romaji: 'hya', katakana: 'ヒャ', hiragana: 'ひゃ'},
			{romaji: 'hyu', katakana: 'ヒュ', hiragana: 'ひゅ'},
			{romaji: 'hyo', katakana: 'ヒョ', hiragana: 'ひょ'},
			{romaji: 'mya', katakana: 'ミャ', hiragana: 'みゃ'},
			{romaji: 'myu', katakana: 'ミュ', hiragana: 'みゅ'},
			{romaji: 'myo', katakana: 'ミョ', hiragana: 'みょ'},
			{romaji: 'rya', katakana: 'リャ', hiragana: 'りゃ'},
			{romaji: 'ryu', katakana: 'リュ', hiragana: 'りゅ'},
			{romaji: 'ryo', katakana: 'リョ', hiragana: 'りょ'},
			{romaji: 'gya', katakana: 'ギャ', hiragana: 'ぎゃ'},
			{romaji: 'gyu', katakana: 'ギュ', hiragana: 'ぎゅ'},
			{romaji: 'gyo', katakana: 'ギョ', hiragana: 'ぎょ'},
			{romaji: 'ja', katakana: 'ジャ', hiragana: 'じゃ'},
			{romaji: 'ju', katakana: 'ジュ', hiragana: 'じゅ'},
			{romaji: 'jo', katakana: 'ジョ', hiragana: 'じょ'},
			{romaji: 'bya', katakana: 'ビャ', hiragana: 'びゃ'},
			{romaji: 'byu', katakana: 'ビュ', hiragana: 'びゅ'},
			{romaji: 'byo', katakana: 'ビョ', hiragana: 'びょ'},
			{romaji: 'pya', katakana: 'ピャ', hiragana: 'ぴゃ'},
			{romaji: 'pyu', katakana: 'ピュ', hiragana: 'ぴゅ'},
			{romaji: 'pyo', katakana: 'ピョ', hiragana: 'ぴょ'}
		];
	}
	
	function fullSetKanjiGrade1(){
		return [
			{kanji: '一', meaning: 'one'},
			{kanji: '二', meaning: 'two'},
			{kanji: '三', meaning: 'three'},
			{kanji: '四', meaning: 'four'},
			{kanji: '五', meaning: 'five'},
			{kanji: '六', meaning: 'six'},
			{kanji: '七', meaning: 'seven'},
			{kanji: '八', meaning: 'eight'},
			{kanji: '九', meaning: 'nine'},
			{kanji: '十', meaning: 'ten'},
			{kanji: '百', meaning: 'hundred'},
			{kanji: '千', meaning: 'thousand'},
			{kanji: '上', meaning: 'top, above'},
			{kanji: '下', meaning: 'bottom, below'},
			{kanji: '左', meaning: 'left'},
			{kanji: '右', meaning: 'right'},
			{kanji: '中', meaning: 'inside, middle'},
			{kanji: '大', meaning: 'large'},
			{kanji: '小', meaning: 'small'},
			{kanji: '月', meaning: 'month; moon'},
			{kanji: '日', meaning: 'day; sun'},
			{kanji: '年', meaning: 'year'},
			{kanji: '早', meaning: 'early'},
			{kanji: '木', meaning: 'tree'},
			{kanji: '林', meaning: 'woods'},
			{kanji: '山', meaning: 'mountain'},
			{kanji: '川', meaning: 'river'},
			{kanji: '土', meaning: 'soil'},
			{kanji: '空', meaning: 'sky'},
			{kanji: '田', meaning: 'rice paddy'},
			{kanji: '天', meaning: 'heaven'},
			{kanji: '生', meaning: 'life, bare; raw'},
			{kanji: '花', meaning: 'flower'},
			{kanji: '草', meaning: 'grass'},
			{kanji: '虫', meaning: 'insect'},
			{kanji: '犬', meaning: 'dog'},
			{kanji: '人', meaning: 'person'},
			{kanji: '名', meaning: 'name'},
			{kanji: '女', meaning: 'female'},
			{kanji: '男', meaning: 'male'},
			{kanji: '子', meaning: 'child'},
			{kanji: '目', meaning: 'eye'},
			{kanji: '耳', meaning: 'ear'},
			{kanji: '口', meaning: 'mouth'},
			{kanji: '手', meaning: 'hand'},
			{kanji: '足', meaning: 'foot'},
			{kanji: '見', meaning: 'see'},
			{kanji: '音', meaning: 'sound'},
			{kanji: '力', meaning: 'power'},
			{kanji: '気', meaning: 'spirit; air'},
			{kanji: '円', meaning: 'yen; circle'},
			{kanji: '入', meaning: 'enter'},
			{kanji: '出', meaning: 'exit'},
			{kanji: '立', meaning: 'stand up'},
			{kanji: '休', meaning: 'rest'},
			{kanji: '先', meaning: 'previous'},
			{kanji: '夕', meaning: 'evening'},
			{kanji: '本', meaning: 'book'},
			{kanji: '文', meaning: 'text'},
			{kanji: '字', meaning: 'character'},
			{kanji: '学', meaning: 'study'},
			{kanji: '校', meaning: 'school'},
			{kanji: '村', meaning: 'village'},
			{kanji: '町', meaning: 'town'},
			{kanji: '森', meaning: 'forest'},
			{kanji: '正', meaning: 'correct'},
			{kanji: '水', meaning: 'water'},
			{kanji: '火', meaning: 'fire'},
			{kanji: '玉', meaning: 'gem'},
			{kanji: '王', meaning: 'king'},
			{kanji: '石', meaning: 'stone'},
			{kanji: '竹', meaning: 'bamboo'},
			{kanji: '糸', meaning: 'thread'},
			{kanji: '貝', meaning: 'shellfish'},
			{kanji: '車', meaning: 'vehicle'},
			{kanji: '金', meaning: 'gold, money'},
			{kanji: '雨', meaning: 'rain'},
			{kanji: '赤', meaning: 'red'},
			{kanji: '青', meaning: 'blue'},
			{kanji: '白', meaning: 'white'}		
		];
	}
	
})(jQuery);