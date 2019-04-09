var app = angular.module('myApp', []);
var pok_1 = 0;
var pok_2 = 0;
app.controller('myCtrl', function($scope, $http) {
    // load available pokemon for battle prediction
    $scope.pok_1_id = '';
    $scope.pok_1_img = '';
    $scope.pok_1_name = '';
    $scope.pok_2_id = '';
    $scope.pok_2_img = '';
    $scope.pok_2_name = '';

    $http.get('/data/PokemonList')
        .then(function(response) {
            $scope.data = response.data;
            // select pokemon
            $scope.select_pok = function(p_id, p_name, p_img) {
                if ($scope.pok_1_name == '') {
                    pok_1 = p_id;
                    $scope.pok_1_name = p_name;
                    $scope.pok_1_img = p_img;
                } else if ($scope.pok_2_name == '') {
                    pok_2 = p_id;
                    $scope.pok_2_name = p_name;
                    $scope.pok_2_img = p_img;
                }
            }
        });
});
app.controller('submitPokemon', function($scope, $http) {
    $scope.win_pok = '';
    $scope.win_rate = '';
    // submite pokemon data to get battle predition data
    $scope.submit = function() {
        // check if both two pokemon are selected
        if (pok_1 != 0 && pok_2 != 0) {
            var Indata = { 'pok_1': pok_1, 'pok_2': pok_2 }
            $http.post('/pokemon-go', Indata).then(function(response) {
                data = response.data;
                $scope.win_pok = data.win_predict;
                $scope.win_rate = data.win_rate;
            });
            // http post END !!!
        }
    }
});
//bind data with dropdown list
var pok_list = d3.select('tbody').attr('ng-repeat', 'x in data | filter: dataFilter');
var tr = pok_list.append('tr').attr('ng-click', 'select_pok(x.pokemon_id, x.name, x.sprite)');
var name = tr.append('td').text('{{x.name}}');
var img = tr.append('td').append('img').attr('src', '{{x.sprite}}');
var type_1 = tr.append('td').text('{{x.type_1}}');
var type_2 = tr.append('td').text('{{x.type_2}}');

var submit_btn = d3.select('#submit_pok').attr('ng-click', 'submit()');