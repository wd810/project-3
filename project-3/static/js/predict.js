var app = angular.module('myApp', []);
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
                //var p_id = d;
                if ($scope.pok_1_id == '') {
                    $scope.pok_1_id = p_id;
                    $scope.pok_1_name = p_name;
                    $scope.pok_1_img = p_img;
                }
            }
        });
});
//bind data with dropdown list
var pok_list = d3.select('tbody').attr('ng-repeat', 'x in data | filter: dataFilter');
var tr = pok_list.append('tr').attr('ng-click', 'select_pok(x.pokemon_id, x.name, x.sprite)');
var name = tr.append('td').text('{{x.name}}');
var img = tr.append('td').append('img').attr('src', '{{x.sprite}}');
var type_1 = tr.append('td').text('{{x.type_1}}');
var type_2 = tr.append('td').text('{{x.type_2}}');