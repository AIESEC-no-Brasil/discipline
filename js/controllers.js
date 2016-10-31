/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl($http,$scope,$localStorage,$sessionStorage) {
    var token = null;
    $scope.$storage = $localStorage;
    $scope.lcs = {1606:{
		"id": 1606,
		"name": "BRAZIL",
		"full_name": "AIESEC in BRAZIL",
		"email": "aiesec.brasil@aiesec.org.br",
		"url": "https://gis.aiesec.org/v2/committees/1606",
		'analytics': {2015:{1:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},2:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},3:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},4:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},5:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},6:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},7:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},8:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},9:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},10:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},11:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},12:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}}},2016:{1:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},2:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},3:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},4:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},5:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},6:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},7:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},8:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},9:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},10:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},11:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},12:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}}}}
	}};
    $scope.analysis = {};
	$scope.total_applications = 0;
	$scope.total_applicants = 0;
	$scope.total_acceptions = 0;
	$scope.total_accepteds = 0;
	$scope.total_approveds = 0;
	$scope.total_realizes = 0;
	$scope.selected_lc = '1606';
	$scope.actual_program = 'All';
	$scope.actual_period = 'Year';
	$scope.national_ranking = [];

	if ($localStorage.last_update != null) {
		small_init();
	} else {
		big_init();
	}

	function small_init() {
		$scope.analysis = $localStorage.analysis;
		$scope.lcs = $localStorage.lcs;
        last_date = $localStorage.last_update;
		$localStorage.last_update = new Date();
		var types = ['person','opportunity']

		for(i = 1;i<=2;i++){
			for(j = 0; j < types.length; j++){
				for(k = 1;k <= ($localStorage.last_update.getMonth()); k++) {
                    $scope.total_applications += $scope.analysis[i][types[j]][2016][k].total_applications.doc_count;
                    $scope.total_applicants += $scope.analysis[i][types[j]][2016][k].total_applications.applicants.value;
                    $scope.total_acceptions += $scope.analysis[i][types[j]][2016][k].total_matched.doc_count;
                    $scope.total_accepteds += $scope.analysis[i][types[j]][2016][k].total_an_accepted.unique_profiles.value;
                    $scope.total_approveds += $scope.analysis[i][types[j]][2016][k].total_approvals.doc_count;
                    $scope.total_realizes += $scope.analysis[i][types[j]][2016][k].total_realized.doc_count;
                }
			}
		}

	    $http.get('http://bazicon.aiesec.org.br/simple_token', {}).then(
	        function(response) {
	            token = response.data.token;
		        [1,2].forEach(function(program, index, array) {
		            types.forEach(function(type, index, array) {
		                [new Date().getFullYear()].forEach(function(year, index, array) { //vai dar problema na virada
		                	months = []
		                	actual_month = new Date().getMonth();
		                	for (i = $localStorage.last_update.getMonth(); i <= actual_month; i++) {months.push(i+1)}

			                months.forEach(function(month, index, array) {
		                        param = {
		                            'access_token':token,
		                            'programmes[]':program,
		                            'basic[type]':type,
		                            'basic[home_office_id]':1606,
		                            'start_date':new Date(year, month-1, 1).toISOString().slice(0,10),
		                            'end_date':new Date(year, month, 0).toISOString().slice(0,10)
		                        };
		                        $http.get('https://gis-api.aiesec.org:443/v2/applications/analyze.json', {params:param}).then(
		                            function(response) {
		                                $scope.analysis[program][type][year][month] = response.data.analytics;
		                                $scope.lcs[1606]['analytics'][year][month][program][type] = response.data.analytics;
		                                if (year == 2016){
		                                    $scope.total_applications += $scope.analysis[program][type][year][month].total_applications.doc_count;
		                                    $scope.total_applicants += $scope.analysis[program][type][year][month].total_applications.applicants.value;
		                                    $scope.total_acceptions += $scope.analysis[program][type][year][month].total_matched.doc_count;
		                                    $scope.total_accepteds += $scope.analysis[program][type][year][month].total_an_accepted.unique_profiles.value;
		                                    $scope.total_approveds += $scope.analysis[program][type][year][month].total_approvals.doc_count;
		                                    $scope.total_realizes += $scope.analysis[program][type][year][month].total_realized.doc_count;
		                                }
		                                response.data.analytics.children.buckets.forEach(function(lc, index, array) {
		                                	if ($scope.lcs[lc.key] != null && lc.key != 1606) $scope.lcs[lc.key]['analytics'][year][month][program][type] = lc;
		                                });
		                                $localStorage.analysis = $scope.analysis;
		                            }, 
		                            function(response) {
		                                console.log('Não rolou '+response.data);
		                                $localStorage.last_update = last_date;
		                        });
		                    });
		                });
		            });
		        });
	        }, 
	        function(response) {
	            console.log('Não rolou '+response.data);
	    });
	}

	function big_init() {
	    $http.get('http://bazicon.aiesec.org.br/simple_token', {}).then(
	        function(response) {
	            token = response.data.token;

	            $http.get('https://gis-api.aiesec.org:443/v2/lists/lcs.json', {params:{'access_token':token}}).then(
	                function(response) {
	                	for (i in response.data) {
	                		if (response.data[i]['parent'] != null && response.data[i]['parent']['id'] == 1606 && response.data[i]['name'].indexOf("LC CLOSED") == -1) {
	                			$scope.lcs[response.data[i]['id']] = response.data[i];
	                			$scope.lcs[response.data[i]['id']]['analytics'] = {2015:{1:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},2:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},3:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},4:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},5:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},6:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},7:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},8:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},9:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},10:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},11:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},12:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}}},2016:{1:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},2:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},3:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},4:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},5:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},6:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},7:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},8:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},9:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},10:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},11:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}},12:{1:{'person':null,'opportunity':null},2:{'person':null,'opportunity':null}}}};
	                		}
	                	}
                        $localStorage.lcs = $scope.lcs;
                        $localStorage.last_update = new Date();

	                	$scope.analysis = {};
			            [1,2].forEach(function(program, index, array) {
			                $scope.analysis[program] = {};
			                ['person','opportunity'].forEach(function(type, index, array) {
			                    $scope.analysis[program][type] = {};
			                    [2015,2016].forEach(function(year, index, array) {
			                        $scope.analysis[program][type][year] = {};
			                        [1,2,3,4,5,6,7,8,9,10,11,12].forEach(function(month, index, array) {
			                            param = {
			                                'access_token':token,
			                                'programmes[]':program,
			                                'basic[type]':type,
			                                'basic[home_office_id]':1606,
			                                'start_date':new Date(year, month-1, 1).toISOString().slice(0,10),
			                                'end_date':new Date(year, month, 0).toISOString().slice(0,10)
			                            };
			                            $http.get('https://gis-api.aiesec.org:443/v2/applications/analyze.json', {params:param}).then(
			                                function(response) {
			                                    $scope.analysis[program][type][year][month] = response.data.analytics;
			                                    $scope.lcs[1606]['analytics'][year][month][program][type] = response.data.analytics;
			                                    if (year == 2016){
			                                        $scope.total_applications += $scope.analysis[program][type][year][month].total_applications.doc_count;
			                                        $scope.total_applicants += $scope.analysis[program][type][year][month].total_applications.applicants.value;
			                                        $scope.total_acceptions += $scope.analysis[program][type][year][month].total_matched.doc_count;
			                                        $scope.total_accepteds += $scope.analysis[program][type][year][month].total_an_accepted.unique_profiles.value;
			                                        $scope.total_approveds += $scope.analysis[program][type][year][month].total_approvals.doc_count;
			                                        $scope.total_realizes += $scope.analysis[program][type][year][month].total_realized.doc_count;
			                                    }
		                                        response.data.analytics.children.buckets.forEach(function(lc, index, array) {
		                                        	if ($scope.lcs[lc.key] != null && lc.key != 1606) $scope.lcs[lc.key]['analytics'][year][month][program][type] = lc;
		                                        });
		                                        $localStorage.analysis = $scope.analysis;
			                                }, 
			                                function(response) {
			                                    console.log('Não rolou '+response.data);
		                                        $localStorage.last_update = null;
			                            });
			                        });
			                    });
			                });
			            });
	                }, 
	                function(response) {
	                    console.log('Não rolou '+response.data);
	            })
	            
	        }, 
	        function(response) {
	            console.log('Não rolou '+response.data);
	    });
	}

	$scope.calc_growth = function(last,actual) {
		return (actual-last)/last * 100;
	}

    $scope.order_ranking = function(){
    	if($scope.analysis[1]['person'][2016][8] != null &&
	    		$scope.analysis[1]['opportunity'][2015][5] != null &&
	    		$scope.analysis[2]['opportunity'][2016][12] != null &&
	    		$scope.analysis[2]['person'][2016][12] != null) {
    		
			programs = [1,2];
			types = ['person','opportunity'];
			months = [1,2,3,4,5,6,7,8,9,10,11,12];
			if ($scope.actual_program == 'oGV'){
				programs = [1];
				types = ['person'];
			} else if ($scope.actual_program == 'oGT'){
				programs = [2];
				types = ['person'];
			} else if ($scope.actual_program == 'iGV'){
				programs = [1];
				types = ['opportunity'];
			} else if ($scope.actual_program == 'iGT'){
				programs = [2];
				types = ['opportunity'];
			}
			months = ($scope.actual_period == 'Q1') ? [1,2,3] : months;
			months = ($scope.actual_period == 'Q2') ? [4,5,6] : months;
			months = ($scope.actual_period == 'Q3') ? [7,8,9] : months;
			months = ($scope.actual_period == 'Q4') ? [10,11,12] : months;
			months = ($scope.actual_period == 'S1') ? [1,2,3,4,5,6] : months;
			months = ($scope.actual_period == 'S2') ? [7,8,9,10,11,12] : months;

			$scope.national_ranking = [];
			for (id in $scope.lcs) {
				if ($scope.lcs[id]['analytics'] != null && id != 1606) {
					$scope.lcs[id]['ranking'] = 0;
					for (i_program in programs) {
						for (i_type in types) {
							for (i_month in months) {
								if ($scope.lcs[id]['analytics'][2016][months[i_month]][programs[i_program]][types[i_type]] != null) {
									$scope.lcs[id]['ranking'] += $scope.lcs[id]['analytics'][2016][months[i_month]][programs[i_program]][types[i_type]].total_approvals.doc_count;
								}
							}
						}
					}
					$scope.national_ranking.push($scope.lcs[id]);
				}
			}
			$scope.national_ranking.sort(function(a,b){return b.ranking-a.ranking});
    	}
    };

	$scope.filter_operations = function(period,program) {
		$scope.total_applications = 0;
		$scope.total_applicants = 0;
		$scope.total_acceptions = 0;
		$scope.total_accepteds = 0;
		$scope.total_approveds = 0;
		$scope.total_realizes = 0;
		$scope.actual_program = program;
		$scope.actual_period = period;

		programs = [1,2];
		types = ['person','opportunity'];
		months = [1,2,3,4,5,6,7,8,9,10,11,12];
		if ($scope.actual_program == 'oGV'){
			programs = [1];
			types = ['person'];
		} else if ($scope.actual_program == 'oGT'){
			programs = [2];
			types = ['person'];
		} else if ($scope.actual_program == 'iGV'){
			programs = [1];
			types = ['opportunity'];
		} else if ($scope.actual_program == 'iGT'){
			programs = [2];
			types = ['opportunity'];
		}
		months = ($scope.actual_period == 'Q1') ? [1,2,3] : months;
		months = ($scope.actual_period == 'Q2') ? [4,5,6] : months;
		months = ($scope.actual_period == 'Q3') ? [7,8,9] : months;
		months = ($scope.actual_period == 'Q4') ? [10,11,12] : months;
		months = ($scope.actual_period == 'S1') ? [1,2,3,4,5,6] : months;
		months = ($scope.actual_period == 'S2') ? [7,8,9,10,11,12] : months;

		programs.forEach(function(program, index, array) {
			types.forEach(function(type, index, array) {
				[2016].forEach(function(year, index, array) {
					months.forEach(function(month, index, array) {
						$scope.total_applications += $scope.analysis[program][type][year][month].total_applications.doc_count;
						$scope.total_applicants += $scope.analysis[program][type][year][month].total_applications.applicants.value;
						$scope.total_acceptions += $scope.analysis[program][type][year][month].total_matched.doc_count;
						$scope.total_accepteds += $scope.analysis[program][type][year][month].total_an_accepted.unique_profiles.value;
						$scope.total_approveds += $scope.analysis[program][type][year][month].total_approvals.doc_count;
						$scope.total_realizes += $scope.analysis[program][type][year][month].total_realized.doc_count;
					});
				});
			});
		});
		$scope.order_ranking();
	};
/*
	$scope.database = {
		1606:{
			'goals': [],
			'cluster': 
		},
		100:{
			'goals': [],
			'cluster': 
		},
		1731:{
			'goals': [],
			'cluster': 
		},
		32:{
			'goals': [],
			'cluster': 
		},
		1248:{
			'goals': [],
			'cluster': 
		},
		1300:{
			'goals': [],
			'cluster': 
		},
		1766:{
			'goals': [],
			'cluster': 
		},
		283:{
			'goals': [],
			'cluster': 
		},
		1178:{
			'goals': [],
			'cluster': 
		},
		436:{
			'goals': [],
			'cluster': 
		},
		988:{
			'goals': [],
			'cluster': 
		},
		286:{
			'goals': [],
			'cluster': 
		},
		284:{
			'goals': [],
			'cluster': 
		},
		943:{
			'goals': [],
			'cluster': 
		},
		434:{
			'goals': [],
			'cluster': 
		},
		233:{
			'goals': [],
			'cluster': 
		},
		1368:{
			'goals': [],
			'cluster': 
		},
		479:{
			'goals': [],
			'cluster': 
		},
		1666:{
			'goals': [],
			'cluster': 
		},
		232:{
			'goals': [],
			'cluster': 
		},
		2061:{
			'goals': [],
			'cluster': 
		},
		437:{
			'goals': [],
			'cluster': 
		},
		231:{
			'goals': [],
			'cluster': 
		},
		723:{
			'goals': [],
			'cluster': 
		},
		148:{
			'goals': [],
			'cluster': 
		},
		854:{
			'goals': [],
			'cluster': 
		},
		288:{
			'goals': [],
			'cluster': 
		},
		541:{
			'goals': [],
			'cluster': 
		},
		467:{
			'goals': [],
			'cluster': 
		},
		777:{
			'goals': [],
			'cluster': 
		},
		1121:{
			'goals': [],
			'cluster': 
		},
		958:{
			'goals': [],
			'cluster': 
		},
		1816:{
			'goals': [],
			'cluster': 
		},
		435:{
			'goals': [],
			'cluster': 
		},
		230:{
			'goals': [],
			'cluster': 
		},
		2098:{
			'goals': [],
			'cluster': 
		},
		287:{
			'goals': [],
			'cluster': 
		},
		1003:{
			'goals': [],
			'cluster': 
		},
		909:{
			'goals': [],
			'cluster': 
		}
	}*/

};


angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)