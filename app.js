var app=angular.module("ErgastApplication",[]);

app.controller("Controller",function($scope,$http,myService){	
	$scope.O={}; 
	$scope.showOtherWinnersTable=false;
	$scope.arrayRaces=[];
	$scope.P={};

	for ( var i = 2005; i < 2016; i++ ) {
		var myDataPromise = myService.getData(i);
		myDataPromise.then(function(result) {  
			$scope.numberOfRecords=result.MRData.total;
			$scope.year=result.MRData.StandingsTable.season;
			$scope.yearlyWinner=result.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.givenName+" "+result.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.familyName;
			$scope.O[result.MRData.StandingsTable.season]=$scope.yearlyWinner;       
		});
	}

	$scope.listOtherPlayers = function(year,champion){
		$http.get("http://ergast.com/api/f1/"+year+"/results/1.json")
		.then(function(response) {
			$scope.numberOfRaces=response.data.MRData.total;
			$scope.records = response.data.MRData.RaceTable.Races;
			for ( var i = 0; i < $scope.numberOfRaces; i++ ) {
				var c=$scope.records[i].Results[0].number;
				$scope.P[$scope.records[i].raceName]=$scope.records[i].Results[0].Driver.givenName+" "+$scope.records[i].Results[0].Driver.familyName; 
			}
		});	
		$scope.showOtherWinnersTable=true;
		$scope.champToBeHighlighted=champion;
		$scope.yearSelected=year;
	}
});

app.factory('myService', function($http) {
	var getData = function(i) {        
		return $http(
		{
			method:"GET", 
			url:"http://ergast.com/api/f1/"+i+"/driverStandings/1.json"
		}).then(function(result){
			return result.data;
		});
	};
	return { getData: getData };
});
