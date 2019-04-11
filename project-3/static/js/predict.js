var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
    // load available pokemon for battle prediction
    $scope.pok_1_s = {
        'name': 'Pokémon 1',
        'id': 0,
        'type1': '',
        'type2': '',
        'win_rate': ''
    };
    $scope.pok_2_s = {
        'name': 'Pokémon 2',
        'id': 0,
        'type1': '',
        'type2': '',
        'win_rate': ''
    };
    $scope.data

    $scope.win_pok = '';

    $http.get('/data/PokemonList')
        .then(function(response) {
            $scope.data = response.data;
            // select pokemon one
            $scope.select_pok_1 = function(x) {
                $('#pok_1_img').attr('src', x.sprite);
                $scope.pok_1_s.id = x.pokemon_id;
                $scope.pok_1_s.name = x.name;
                $scope.pok_1_s.type1 = x.type_1;
                $scope.pok_1_s.type2 = x.type_2 != 'n.a' ? x.type_2 : '';

                $scope.data = response.data;
                $scope.data = $scope.data.filter(function(data) {
                    return data.pokemon_id != $scope.pok_1_s.id && data.pokemon_id != $scope.pok_2_s.id;
                });
                $('.easy-pokemon').removeClass('focus');
            }

            // select pokemon two
            $scope.select_pok_2 = function(x) {
                $('#pok_2_img').attr('src', x.sprite);
                $scope.pok_2_s.id = x.pokemon_id;
                $scope.pok_2_s.name = x.name;
                $scope.pok_2_s.type1 = x.type_1;
                $scope.pok_2_s.type2 = x.type_2 != 'n.a' ? x.type_2 : '';

                $scope.data = response.data;
                $scope.data = $scope.data.filter(function(data) {
                    return data.pokemon_id != $scope.pok_1_s.id && data.pokemon_id != $scope.pok_2_s.id;
                });
                $('.easy-pokemon').removeClass('focus');
            }

            // submite pokemon data to get battle predition data
            $scope.submit = function() {
                // check if both two pokemon are selected
                if ($scope.pok_1_s.id != 0 && $scope.pok_2_s.id != 0) {
                    var Indata = { 'pok_1': $scope.pok_1_s.id, 'pok_2': $scope.pok_2_s.id }
                    $('#submit_pok').hide();
                    $('.select-box').hide();
                    $http.post('/pokemon-go', Indata).then(function(response) {
                        data = response.data;
                        console.log(data);
                        //var lose_rate = Math.round((100 - data.win_rate) * 100) / 100;

                        if ($scope.pok_1_s.id == data.win_predict) {
                            $('#pok_1_box').addClass('winner-box');
                            $scope.pok_1_s.win_rate = 'Win Rate: ' + data.win_rate + '%';
                            //$scope.pok_2_s.win_rate = 'Win Rate: ' + lose_rate + '%';
                        } else {
                            $('#pok_2_box').addClass('winner-box');
                            $scope.pok_2_s.win_rate = 'Win Rate: ' + data.win_rate + '%';
                            //$scope.pok_1_s.win_rate = 'Win Rate: ' + lose_rate + '%';
                        }
                        //$scope.win_pok = data.win_predict;
                        $('#play-again').show();
                    });
                    // http post END !!!
                } else {
                    if ($scope.pok_1_s.id == 0) {
                        $scope.pok_1_not_select = 'Please select Pokémon one.';
                    }
                    if ($scope.pok_2_s.id == 0) {
                        $scope.pok_2_not_select = 'Please select Pokémon Two.';
                    }
                }

            }

            // play again btn click: intial page 
            $scope.initial = function() {
                $scope.data = response.data;
                $scope.pok_1_s = {
                    'name': 'Pokémon 1',
                    'id': 0,
                    'type1': '',
                    'type2': '',
                    'win_rate': ''
                };
                $scope.pok_2_s = {
                    'name': 'Pokémon 2',
                    'id': 0,
                    'type1': '',
                    'type2': '',
                    'win_rate': ''
                };
                $('#pok_1_img').attr('src', '');
                $('#pok_2_img').attr('src', '');
                $('#submit_pok').show();
                $('.select-box').show();
                $('#play-again').hide();
                $scope.pok_1_not_select = '';
                $scope.pok_2_not_select = '';
                $('.pokemon-box').removeClass('winner-box');
            }

        });

});
//initial pokemon filter 1
var pok_list_1 = d3.select('#pok_list_1 tbody').attr('ng-repeat', 'x in data | filter: pok_filter_1');
var tr_pok_list_1 = pok_list_1.append('tr').attr('ng-click', 'select_pok_1(x)');
var name = tr_pok_list_1.append('td').attr('class', 'td-name').text('{{x.name}}');
var img = tr_pok_list_1.append('td').append('img').attr('src', '{{x.sprite}}');
//initial pokemon filter 2
var pok_list_2 = d3.select('#pok_list_2 tbody').attr('ng-repeat', 'x in data | filter: pok_filter_2');
var tr_pok_list_2 = pok_list_2.append('tr').attr('ng-click', 'select_pok_2(x)');
var name = tr_pok_list_2.append('td').attr('class', 'td-name').text('{{x.name}}');
var img = tr_pok_list_2.append('td').append('img').attr('src', '{{x.sprite}}');
// pokemon dropdown select list hide() and show()
$('.input-filter').on('focus', function(e) {
    $(this).next().addClass('focus');
});
// add submit function when 2 pokemons are selected
var submit_btn = d3.select('#submit_pok').attr('ng-click', 'submit()');