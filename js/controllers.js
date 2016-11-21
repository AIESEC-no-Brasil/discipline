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
		console.log($scope.email);
		console.log($scope.password);
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
						$location.path('/index/minor');
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

function ExtractionCtrl($scope,$http,$localStorage,$sessionStorage) {
	$scope.logging = 'Nothing to log yet';
	$scope.selected_type = 'date_approved';
	$scope.selected_month = '11';
	$scope.selected_program = 'oGV';
	$scope.applications = [];
	$scope.applications_array = [];
	$scope.loading_applications = false;
	console.log($localStorage.token);
    
    function generateParams(page){
    	param = {}
	    param['access_token'] = $localStorage.token;
	    param['filters['+$scope.selected_type+'][from]'] = new Date(2016, $scope.selected_month-1, 1).toISOString().slice(0,10);
	    param['filters['+$scope.selected_type+'][to]'] = new Date(2016,  $scope.selected_month, -1).toISOString().slice(0,10);
	    param['per_page'] = 100;
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
	        	param['filters[is_ge]'] = 'false';
	    		break;
	    	case 'iGT':
	    		param['filters[opportunity_committee]'] = 1606;
	    		param['filters[programmes][]'] = 2;
	    		param['filters[for]'] = 'opportunities';
	        	param['filters[is_ge]'] = 'false';
	    		break;
	    	case 'oGE':
	    		param['filters[person_committee]'] = 1606;
	    		param['filters[programmes][]'] = 2;
	    		param['filters[for]'] = 'people';
	        	param['filters[is_ge]'] = 'true';
	    		break;
	    	case 'iGE':
	    		param['filters[opportunity_committee]'] = 1606;
	    		param['filters[programmes][]'] = 2;
	    		param['filters[for]'] = 'opportunities';
	        	param['filters[is_ge]'] = 'true';
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
	    	if(response.data.paging.current_page <= response.data.paging.total_pages) {
	    		return $http.get('https://gis-api.aiesec.org:443//v2/applications.json', {params:p}).then(success, error);
	    	} else {
	    		console.log('FINISHED');
	    		$scope.logging += ' -> FINISHED!!!'
	    	}
		}
		function error(response) {
	        console.log('Não rolou '+response.status);
	        console.log(param);
			$scope.logging += 'Got a error on page '+param['page']+'\r\n';
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

angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
    .controller('SigninCtrl', SigninCtrl)
    .controller('ExtractionCtrl', ExtractionCtrl);

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