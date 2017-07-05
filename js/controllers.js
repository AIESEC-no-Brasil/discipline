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
	setInterval(reload, 600000);

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

	function reload() {
		d = new Date();
		approveds_oGV = $scope.lcs[$scope.selected_lc]['analytics'][d.getFullYear()][d.getMonth()+1][1]['person'].total_approvals.doc_count;
		approveds_iGV = $scope.lcs[$scope.selected_lc]['analytics'][d.getFullYear()][d.getMonth()+1][1]['opportunity'].total_approvals.doc_count;
		approveds_oGT = $scope.lcs[$scope.selected_lc]['analytics'][d.getFullYear()][d.getMonth()+1][2]['person'].total_approvals.doc_count;
		approveds_iGT = $scope.lcs[$scope.selected_lc]['analytics'][d.getFullYear()][d.getMonth()+1][2]['opportunity'].total_approvals.doc_count;
		small_init();
		$scope.total_applications = 0;
		$scope.total_applicants = 0;
		$scope.total_acceptions = 0;
		$scope.total_accepteds = 0;
		$scope.total_approveds = 0;
		$scope.total_realizes = 0;
		if (approveds_oGV != $scope.lcs[$scope.selected_lc]['analytics'][d.getFullYear()][d.getMonth()+1][1]['person'].total_approvals.doc_count) {
			toastr.success('oGV have a new approved','Uhuuuuuuulllll!');
		}
		if (approveds_iGV != $scope.lcs[$scope.selected_lc]['analytics'][d.getFullYear()][d.getMonth()+1][1]['opportunity'].total_approvals.doc_count) {
			toastr.info('iGV have a new approved','Maravilhosooooooo!');
		}
		if (approveds_oGT != $scope.lcs[$scope.selected_lc]['analytics'][d.getFullYear()][d.getMonth()+1][2]['person'].total_approvals.doc_count) {
			toastr.warning('oGT/GE have a new approved','Lésbica futurista');
		}
		if (approveds_iGT != $scope.lcs[$scope.selected_lc]['analytics'][d.getFullYear()][d.getMonth()+1][2]['opportunity'].total_approvals.doc_count) {
			toastr.error('iGT/GE have a new approved','Siiiiiiiimmmm! ^^');
		}
	}

	$scope.calc_growth = function(last,actual) {
		return (actual-last)/last * 100;
	}

    $scope.order_ranking = function(){
    	if($scope.analysis[1]['person'][2016][8] != null &&
	    		$scope.analysis[1]['opportunity'][2015][5] != null &&
	    		$scope.analysis[2]['opportunity'][2016][12] != null &&
	    		$scope.analysis[2]['person'][2016][12] != null) {
    		console.log('order_ranking');
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
};

function SigninCtrl($scope,$http,$location,$localStorage,$sessionStorage) {
	$scope.loading = false;
	$scope.message = '';
	$scope.login = function() {
		$scope.loading = true;
		if ($scope.email != undefined && $scope.password != undefined) {
			$http.post('http://bazicon.aiesec.org.br/login_expa',{'email':$scope.email,'password':$scope.password},{}
				).then(function successCallback(response) {
					console.log(response.status);
					console.log(response.data);
					console.log(response);
					console.log(response.cache);
					if (response.data['token'] == null) {
						$scope.message = 'Email or Password incorrect';
					} else {
						$localStorage.token = response.data['token'];
						$location.path('/index/analysis');
					}
					$scope.loading = false;
				}, function errorCallback(response) {
					console.log(response.status);
					console.log(response.data);
					console.log(response);
					console.log(response.cache);
					$scope.message = 'Something is incorrect, try again';
					$scope.loading = false;
				});
		} else {
			$scope.loading = false;
		}
	}
}

function ExtractionCtrl($scope,$http,$localStorage,$sessionStorage,$state) {
	$scope.logging = 'Nothing to log yet';
	$scope.selected_type = 'date_approved';
	$scope.selected_month = (new Date().getMonth() + 1) + '';
	$scope.selected_year = '2017';
	$scope.selected_program = 'oGV';
	$scope.applications = [];
	$scope.applications_array = [];
	$scope.loading_applications = false;
	console.log($localStorage.token);
    
    function generateParams(page){
    	//$scope.selected_month = parseInt($scope.selected_month);
    	//$scope.selected_year = parseInt($scope.selected_year);
    	param = {}
	    param['access_token'] = $localStorage.token;
	    param['filters['+$scope.selected_type+'][from]'] = new Date($scope.selected_year, $scope.selected_month-1, 1).toISOString().slice(0,10);
	    param['filters['+$scope.selected_type+'][to]'] = new Date($scope.selected_year,  $scope.selected_month, -1).toISOString().slice(0,10);
	    //param['per_page'] = 50;
	    param['page'] = page;

	    switch($scope.selected_program){
	    	case 'oGV':
	    		param['filters[person_committee]'] = 1606;
	    		param['filters[programmes][]'] = 1;
	    		param['filters[for]'] = 'people';
	    		break;
	    	case 'iGV':
	    		param['filters[opportunity_committee]'] = 1606;
	    		param['filters[programmes][]'] = 1;
	    		param['filters[for]'] = 'opportunities';
	    		break;
	    	case 'oGT':
	    		param['filters[person_committee]'] = 1606;
	    		param['filters[programmes][]'] = 2;
	    		param['filters[for]'] = 'people';
	    		break;
	    	case 'iGT':
	    		param['filters[opportunity_committee]'] = 1606;
	    		param['filters[programmes][]'] = 2;
	    		param['filters[for]'] = 'opportunities';
	    		break;
	    	case 'oGE':
	    		param['filters[person_committee]'] = 1606;
	    		param['filters[programmes][]'] = 5;
	    		param['filters[for]'] = 'people';
	    		break;
	    	case 'iGE':
	    		param['filters[opportunity_committee]'] = 1606;
	    		param['filters[programmes][]'] = 5;
	    		param['filters[for]'] = 'opportunities';
	    		break;

	    }
	    return param;
    }

	$scope.get_aplications = function() {
		$scope.applications = [];
		$scope.logging = 'Getting '+$scope.selected_program+' applications!';
		$scope.loading_applications = true;

		function success(response) {
			console.log(response);
	    	$scope.applications = $scope.applications.concat(response.data.data);
			$scope.logging += ' -> Got '+response.data.data.length+' applications of '+response.data.paging.total_items+' -> ';
	    	p = generateParams(response.data.paging.current_page+1);
	    	if(response.data.paging.current_page <= response.data.paging.total_pages && response.data.paging.total_pages != 1) {
	    		return $http.get('https://gis-api.aiesec.org:443/v2/applications.json', {params:p}).then(success, error);
	    	} else {
	    		console.log('FINISHED');
	    		$scope.logging += ' -> FINISHED!!!'
	    	}
		}
		function error(response) {
	        console.log('Não rolou '+response.status);
	        console.log(param);
			$scope.logging += 'Got a error on page '+param['page']+'\r\n';
			$state.go('login');
		}
		return $http.get('https://gis-api.aiesec.org:443//v2/applications.json', {params:generateParams(1)}).then(success, error).then(function(){
			$scope.applications_array = [{id:"Application ID",created_at:"Application Date",status:"Status",person_id:"Person ID",person_name:"EP Name",person_email:"Email",person_lc:"LC",opportunity_program:"Programme",opportunity_id:"Opportunity ID",opportunity_title:"Title",opportunity_location:"Location",opportunity_office:"Host LC",opportunity_early_start_date:"Earliest Start Date",opportunity_latest_end_date:"Latest End Date",opportunity_applications_close_date:"Applications Close Date"}]
			for (i = 0 ;i < $scope.applications.length ; i++){
				$scope.applications_array.push({
					id:$scope.applications[i].id,
					created_at:$scope.applications[i].created_at,
					status:$scope.applications[i].status,
					person_id:$scope.applications[i].person.id,
					person_name:$scope.applications[i].person.full_name,
					person_email:$scope.applications[i].person.email,
					person_lc:$scope.applications[i].person.home_lc.name,
					opportunity_program:$scope.applications[i].opportunity.programmes[0]['short_name'],
					opportunity_id:$scope.applications[i].opportunity.id,
					opportunity_title:$scope.applications[i].opportunity.title,
					opportunity_location:$scope.applications[i].opportunity.location,
					opportunity_office:$scope.applications[i].opportunity.office.full_name,
					opportunity_early_start_date:$scope.applications[i].opportunity.earliest_start_date,
					opportunity_latest_end_date:$scope.applications[i].opportunity.latest_end_date,
					opportunity_applications_close_date:$scope.applications[i].opportunity.applications_close_date,
				}) 
			}
			$scope.loading_applications = false;
		});

		$scope.get_header() = function() {
			return ["Application ID","Application Date","Status","Person ID","EP Name","Email","LC","Programme","Opportunity ID",
	  			"Title","Location","Host LC","Earliest Start Date","Latest End Date","Applications Close Date"]
		}
	}
}

function AnalysisCtrl($scope,$http,$localStorage,$sessionStorage,$state,ListsService,AnalyticsService,DTOptionsBuilder,CSVService) {
	$scope.selected_month_from = '';
	$scope.selected_month_to = '';
	$scope.selected_year = '2017';
	$scope.selected_program = '';
	$scope.selected_process = 'apd';
	$scope.selected_lc = '1606';
	$scope.analysis = [];
	$scope.loading = false;
    $scope.lcs = {1606:{
		"id": 1606,
		"name": "BRAZIL",
		"full_name": "AIESEC in BRAZIL",
		"email": "aiesec.brasil@aiesec.org.br",
		"url": "https://gis.aiesec.org/v2/committees/1606"
	}};
	$scope.dtInstance = {};
	$scope.result_2016 = {}
	$scope.planed_2016 = {}

	CSVService.get_achievement(function(data){
		for (i in data) {
			if ($scope.result_2016[parseInt(data[i]['ID'])] == undefined) {
				$scope.result_2016[parseInt(data[i]['ID'])] = {};
				$scope.result_2016[parseInt(data[i]['ID'])]['OGX'] = {};
				$scope.result_2016[parseInt(data[i]['ID'])]['ICX'] = {};
				$scope.lcs[parseInt(data[i]['ID'])]['cluster'] = data[i]['CLUSTER'];
			}
			if (data[i]['Type'] == 'People') {
				$scope.result_2016[parseInt(data[i]['ID'])]['OGX'][data[i]['KPI']] = data[i];
			} else {
				$scope.result_2016[parseInt(data[i]['ID'])]['ICX'][data[i]['KPI']] = data[i];
			}
		}
	});

	CSVService.get_goals(function(data){
		console.log(data);
		opens = data.Open.all();
		apds = data.APD.all();
		res = data.RE.all();
		cps = data.CO.all();
		for (i in apds) {
			if ($scope.planed_2016[parseInt(apds[i]['ID'])] == undefined) {
				$scope.planed_2016[parseInt(apds[i]['ID'])] = {};
				$scope.planed_2016[parseInt(apds[i]['ID'])]['open'] = {};
				$scope.planed_2016[parseInt(apds[i]['ID'])]['apd'] = {};
				$scope.planed_2016[parseInt(apds[i]['ID'])]['re'] = {};
				$scope.planed_2016[parseInt(apds[i]['ID'])]['cp'] = {};
			}
			if (apds[i]['Type'] == 'People' && apds[i]['Operation'] == 'GV') {
				$scope.planed_2016[parseInt(apds[i]['ID'])]['open']['oGV'] = opens[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['apd']['oGV'] = apds[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['re']['oGV'] = res[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['cp']['oGV'] = cps[i];
			} else if (apds[i]['Type'] == 'People' && apds[i]['Operation'] == 'GE') {
				$scope.planed_2016[parseInt(apds[i]['ID'])]['open']['oGE'] = opens[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['apd']['oGE'] = apds[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['re']['oGE'] = res[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['cp']['oGE'] = cps[i];
			} else if (apds[i]['Type'] == 'People' && apds[i]['Operation'] == 'GT') {
				$scope.planed_2016[parseInt(apds[i]['ID'])]['open']['oGT'] = opens[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['apd']['oGT'] = apds[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['re']['oGT'] = res[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['cp']['oGT'] = cps[i];
			} else if (apds[i]['Type'] == 'Opportunity' && apds[i]['Operation'] == 'GV') {
				$scope.planed_2016[parseInt(apds[i]['ID'])]['open']['iGV'] = opens[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['apd']['iGV'] = apds[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['re']['iGV'] = res[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['cp']['iGV'] = cps[i];
			} else if (apds[i]['Type'] == 'Opportunity' && apds[i]['Operation'] == 'GE') {
				$scope.planed_2016[parseInt(apds[i]['ID'])]['open']['iGE'] = opens[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['apd']['iGE'] = apds[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['re']['iGE'] = res[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['cp']['iGE'] = cps[i];
			} else if (apds[i]['Type'] == 'Opportunity' && apds[i]['Operation'] == 'GT') {
				$scope.planed_2016[parseInt(apds[i]['ID'])]['open']['iGT'] = opens[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['apd']['iGT'] = apds[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['re']['iGT'] = res[i];
				$scope.planed_2016[parseInt(apds[i]['ID'])]['cp']['iGT'] = cps[i];
			}
		}
		console.log($scope.planed_2016);
	});

	function get_apd_by_month(id,month,type,kpi) {
		switch (month) {
			case 1 : return parseInt($scope.result_2016[id][type][kpi]['Jan']);
			case 2 : return parseInt($scope.result_2016[id][type][kpi]['Feb']);
			case 3 : return parseInt($scope.result_2016[id][type][kpi]['Mar']);
			case 4 : return parseInt($scope.result_2016[id][type][kpi]['Apr']);
			case 5 : return parseInt($scope.result_2016[id][type][kpi]['May']);
			case 6 : return parseInt($scope.result_2016[id][type][kpi]['Jun']);
			case 7 : return parseInt($scope.result_2016[id][type][kpi]['Jul']);
			case 8 : return parseInt($scope.result_2016[id][type][kpi]['Ago']);
			case 9 : return parseInt($scope.result_2016[id][type][kpi]['Sep']);
			case 10 : return parseInt($scope.result_2016[id][type][kpi]['Oct']);
			case 11 : return parseInt($scope.result_2016[id][type][kpi]['Nov']);
			case 12 : return parseInt($scope.result_2016[id][type][kpi]['Dec']);
		}
	}

	function get_plan_by_month(id,month,operation,kpi) {
		switch (month) {
			case 1 : return parseInt($scope.planed_2016[id][kpi][operation]['Jan']);
			case 2 : return parseInt($scope.planed_2016[id][kpi][operation]['Feb']);
			case 3 : return parseInt($scope.planed_2016[id][kpi][operation]['Mar']);
			case 4 : return parseInt($scope.planed_2016[id][kpi][operation]['Apr']);
			case 5 : return parseInt($scope.planed_2016[id][kpi][operation]['May']);
			case 6 : return parseInt($scope.planed_2016[id][kpi][operation]['Jun']);
			case 7 : return parseInt($scope.planed_2016[id][kpi][operation]['Jul']);
			case 8 : return parseInt($scope.planed_2016[id][kpi][operation]['Ago']);
			case 9 : return parseInt($scope.planed_2016[id][kpi][operation]['Sep']);
			case 10 : return parseInt($scope.planed_2016[id][kpi][operation]['Oct']);
			case 11 : return parseInt($scope.planed_2016[id][kpi][operation]['Nov']);
			case 12 : return parseInt($scope.planed_2016[id][kpi][operation]['Dec']);
		}
	}

	function map_arch_by_kpi(analytics,kpi) {
		switch (kpi) {
			case 'open' : return analytics['total_approvals']['doc_count'];
			case 'apd' : return analytics['total_approvals']['doc_count'];
			case 're' : return analytics['total_realized']['doc_count'];
			case 'cp' : return analytics['total_completed']['doc_count'];
		}
	}

	function get_planned(id,operation,kpi) {
		planned = 0;
		for (m = parseInt($scope.selected_month_from); m <= parseInt($scope.selected_month_to); m++) {
			planned += get_plan_by_month(parseInt(id),m,operation,kpi);
		}
		return planned;
	}

    function generateParams(past){
    	//$scope.selected_month = parseInt($scope.selected_month);
    	//$scope.selected_year = parseInt($scope.selected_year);
    	param = {}
	    param['access_token'] = $localStorage.token;
	    param['start_date'] = new Date($scope.selected_year-past, $scope.selected_month_from-1, 1).toISOString().slice(0,10);
	    param['end_date'] = new Date($scope.selected_year-past,  $scope.selected_month_to, -1).toISOString().slice(0,10);
	    param['basic[home_office_id]'] = '1606';

	    switch($scope.selected_program){
	    	case 'oGV':
	    		param['programmes[]'] = 1;
	    		param['basic[type]'] = 'person';
	    		break;
	    	case 'iGV':
	    		param['programmes[]'] = 1;
	    		param['basic[type]'] = 'opportunity';
	    		break;
	    	case 'oGT':
	    		param['programmes[]'] = 2;
	    		param['basic[type]'] = 'person';
	    		break;
	    	case 'iGT':
	    		param['programmes[]'] = 2;
	    		param['basic[type]'] = 'opportunity';
	    		break;
	    	case 'oGE':
	    		param['programmes[]'] = 5;
	    		param['basic[type]'] = 'person';
	    		break;
	    	case 'iGE':
	    		param['programmes[]'] = 5;
	    		param['basic[type]'] = 'opportunity';
	    		break;
	    }
	    return param;
    }

    if ($localStorage.lcs == null) {
    	ListsService.get_lcs($localStorage.token).then(
    		function(response) {
            	for (i in response.data) {
            		if (response.data[i]['parent'] != null && response.data[i]['parent']['id'] == 1606 && response.data[i]['name'].indexOf("LC CLOSED") == -1) {
            			$scope.lcs[response.data[i]['id']] = response.data[i];
            		}
            	}
                $localStorage.lcs = $scope.lcs;
            },
            function(response) {
            	console.log('Não rolou '+response.data);
            }
        );
    } else {
    	$scope.lcs = $localStorage.lcs;
    }

  	//TODO pegar resultado de janeiro e fereveiro a partir da planilha
    $scope.get_analysis = function() {	
    	AnalyticsService.get_application_analitics(localStorage.token,generateParams(0)).then(
    		function(success) {
    			lcs = success.data['analytics']['children']['buckets'];
            	for (i in lcs) {
            		if (lcs[i]['key'] in $scope.lcs) {
        				$scope.lcs[lcs[i]['key']]['ach'] = map_arch_by_kpi(lcs[i],$scope.selected_process);
        				//$scope.lcs[lcs[i]['key']]['cluster'] = $scope.result_2016[lcs[i]['key']]['OGX']['CLUSTER'];
        				$scope.lcs[lcs[i]['key']]['plan'] = get_planned(lcs[i]['key'],$scope.selected_program,$scope.selected_process);
        				$scope.lcs[lcs[i]['key']]['ach_plan'] = (get_planned(lcs[i]['key'],$scope.selected_program,$scope.selected_process) == 0) ? 0 : (100* map_arch_by_kpi(lcs[i],$scope.selected_process) ) / get_planned(lcs[i]['key'],$scope.selected_program,$scope.selected_process);
            		}
            	}
            	$scope.lcs[1606]['total_approvals'] = success.data['analytics']['total_approvals'];
            	$scope.lcs[1606]['total_realized'] = success.data['analytics']['total_realized'];
			    //$scope.dtInstance.rerender();
    			console.log($scope.lcs);
    		},
    		function(fail) {
    			console.log('Não rolou '+fail.data);
    		}
		).then(function(){
			if ($scope.selected_program == 'oGV'|| $scope.selected_program == 'iGV') {
				type = ($scope.selected_program == 'oGV') ? 'OGX' : 'ICX';
				for (i in $scope.lcs) {
					last_year_apds = 0;
					for (m = parseInt($scope.selected_month_from); m <= parseInt($scope.selected_month_to); m++) {
						last_year_apds += get_apd_by_month(parseInt(i),m,type,$scope.selected_process);
					}
        			if (last_year_apds > 0 && $scope.lcs[i]['ach'] != undefined) {
						$scope.lcs[i]['grow'] = ($scope.lcs[i]['ach'] - last_year_apds) / last_year_apds * 100;
					} else {
						$scope.lcs[i]['grow'] = 0;
					}
					$scope.lcs[i]['old'] = last_year_apds;
				}
			    $scope.dtInstance.rerender();
			} else {
				AnalyticsService.get_application_analitics(localStorage.token,generateParams(1)).then(
		    		function(success) {
		    			console.log(success.data);
		    			lcs = success.data['analytics']['children']['buckets'];
		            	for (i in lcs) {
		            		if (lcs[i]['key'] in $scope.lcs) {
		            			if (lcs[i]['ach'] > 0) {
		        					$scope.lcs[lcs[i]['key']]['grow'] = ($scope.lcs[lcs[i]['key']]['ach'] - lcs[i]['total_approvals'].doc_count) / lcs[i]['total_approvals'].doc_count * 100;
		        				} else {
		        					$scope.lcs[lcs[i]['key']]['grow'] = 0;
		        				}
		        				$scope.lcs[i]['old'] = lcs[i]['total_approvals'].doc_count;
		            		}
		            	}
					    $scope.dtInstance.rerender();
		    		},
		    		function(fail) {
		    			console.log('Não rolou '+fail.data);
		    		}
				);
			}
		});
    }

    $scope.growth_style = function(grow) {
    	if (grow < 0) {
    		return 'color: red;';
    	} else if (grow >= 30) {
    		return 'color: blue;'
    	}
    }

    $scope.absolute_style = function(grow) {
    	if (grow < 0) {
    		return 'color: red;';
    	}
    }

    $scope.arch_style = function(arch) {
    	if (arch < 50 || arch == undefined) {
    		return 'color: red;';
    	} else if (arch >= 50 && arch < 80) {
    		return 'color: green;';
    	} else if (arch >= 80) {
    		return 'color: blue;';
    	}
    }

    $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(25)
      .withOption('dom', '<"html5buttons"B>lTfgitp')
      .withOption('buttons', [
                    { extend: 'copy'},
                    {extend: 'csv'},
                    {extend: 'excel', title: 'ODAnalytics'},
                    {extend: 'pdf', title: 'ODAnalytics'},

                    {extend: 'print',
                        customize: function (win){
                            jQuery(win.document.body).addClass('white-bg');
                            jQuery(win.document.body).css('font-size', '10px');

                            jQuery(win.document.body).find('table')
                                    .addClass('compact')
                                    .css('font-size', 'inherit');
                        }
                    }
                ]);

    $scope.columnDefs = [ 
        { "mDataProp": "name", "aTargets":[0]},
        { "mDataProp": "cluster", "aTargets":[1] },
        { "mDataProp": "plan", "aTargets":[2] },
        { "mDataProp": "total_approvals", "aTargets":[3] },
        { "mDataProp": "arch", "aTargets":[4] },
        { "mDataProp": "grow", "aTargets":[5] },
        { "mDataProp": "total_realized", "aTargets":[6] }
    ]; 
}

function PeopleCtrl($scope,$http,$localStorage,$uibModal,$timeout,ListsService,PeopleService) {

	$scope.error_msg = false;
    $scope.busy_scroll = false;

    $scope.loading_list = false;
    $scope.loading_detail = false;

    $scope.commettees = [];
    $scope.selected_lc = null;

    $scope.status_filter = 'all';
    $scope.ops_filter = false;
    $scope.epi_filter = false;

    if ($localStorage.lcs == null) {
    	ListsService.get_lcs($localStorage.token).then(
    		function(response) {
            	for (i in response.data) {
            		if (response.data[i]['parent'] != null && response.data[i]['parent']['id'] == 1606 && response.data[i]['name'].indexOf("LC CLOSED") == -1) {
            			$scope.lcs[response.data[i]['id']] = response.data[i];
            		}
            	}
                $localStorage.lcs = $scope.lcs;
            },
            function(response) {
            	console.log('Não rolou '+response.data);
            }
        );
    } else {
    	$scope.lcs = $localStorage.lcs;
    }

    $scope.list = function() {
    	$scope.people = [];
    	$scope.loading_list = true;

	    PeopleService.list($localStorage.token,1,undefined).then(
	    	function successCallback(response) {
	    		$scope.people = response.data.data;
    			$scope.busy_scroll = (response.data.length < 30) ? true : false;
	    		$scope.person = $scope.people[0];
		    	$scope.loading_list = false;
		    	console.log($scope.people);
	    	}, function errorCallback(response) {
	    		$scope.error_msg = true;
		    	$scope.loading_list = false;
	    	});
    };
    $scope.list();

    $scope.list_more = function() {
    	$scope.busy_scroll = true;
    	$scope.loading_list = true;

	    PeopleService.list($localStorage.token,Math.floor($scope.people.length / 30),undefined).then(
	    	function successCallback(response) {
    			$scope.people = $scope.people.concat(response.data.data);
    			$scope.busy_scroll = (response.data.length < 30) ? true : false;
    			$scope.loading_list = false;
		    	console.log($scope.people);
	    	}, function errorCallback(response) {
	    		$scope.error_msg = true;
    			$scope.loading_list = false;
	    	});
    }

    $scope.load_analysis = function() {
	    params = { lc: $scope.selected_lc.id };
	    $http.get('/disrupt/ogx/kpis', {params: params}).then(
	    	function successCallback(response) {
		    	$scope.analysis = {
		    		total_open : response.data['open'],
		    		month_open : 'later',
		    		total_applied : response.data['applied'],
		    		month_applied : 'later',
		    		total_accepted : response.data['accepted'],
		    		month_accepted : 'later',
		    		total_realized : response.data['realized'],
		    		month_realized : 'later',
		    		total_completed : response.data['completed'],
		    		month_completed : 'later',
		    		total_returnee : response.data['other'],
		    		month_returnee : 'later',
		    	};
	    	}, function errorCallback(response) {
	    		$scope.error_msg = true;
	    	});
    }

    $scope.select_ep = function(ep) {
    	$scope.person = null;
    	$scope.loading_detail = true;
    	$scope.person = ep;
	    $scope.loading_detail = false;
		console.log($scope.person);
    };

    $scope.open_edit_modal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'ogx/_edit_modal.html'
        });
    };


    $scope.status_color = function(ep_status) {
	    switch(ep_status){
	    	case 'open':
	    		return '';
	    	case 'in_progress':
	    		return 'primary';
	    	case 'matched':
	    		return 'info';
	    	case 'realized':
	    		return 'success'
	    	case 'completed':
	    		return 'danger'
	    	default:
	    		return 'danger';
	    }
    };

    $scope.cf_step = function(step) {
	    switch(step){
	    	case 'all':
	    		return 'Todos';
	    	case 'open':
	    		return 'Open';
	    	case 'in_progress':
	    		return 'Applied';
	    	case 'matched':
	    		return 'Accepted';
	    	case 'realized':
	    		return 'Realizing';
	    	case 'completed':
	    		return 'Completed'
	    	default:
	    		return 'danger';
	    }
    };

    $scope.no_personal_info = function(person) {
    	return person != null && person.xp_contact_info == null &&
    		person.xp_address_info == null && 
    		person.xp_home_lc_id == null && 
    		person.product == null;
    }
};

angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
    .controller('AnalysisCtrl', AnalysisCtrl)
    .controller('SigninCtrl', SigninCtrl)
    .controller('ExtractionCtrl', ExtractionCtrl)
    .controller('PeopleCtrl', PeopleCtrl);

toastr.options = {
  "closeButton": true,
  "debug": false,
  "progressBar": true,
  "preventDuplicates": false,
  "positionClass": "toast-top-right",
  "onclick": null,
  "showDuration": "400",
  "hideDuration": "1000",
  "timeOut": "7000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}