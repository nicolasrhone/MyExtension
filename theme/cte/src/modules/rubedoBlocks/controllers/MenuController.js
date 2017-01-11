    angular.module("rubedoBlocks").lazy.controller("MenuController",['$scope','$location','RubedoMenuService','RubedoPagesService','$http','$route',
								     function($scope,$location,RubedoMenuService,RubedoPagesService,$http,$route){
        var me=this;
        var themePath="/theme/"+window.rubedoConfig.siteTheme;
        me.menu={};
        me.currentRouteline=$location.path();
        var lang = $route.current.params.lang;
       var config=$scope.blockConfig;
	me.menuTab = false; 
	if ($scope.block.code == '1418') {
	    me.menuClass="menu1418";
	    me.menuTab = true;
	}
	else if ($scope.block.code == 'cana'){
	    me.menuClass="menucana";
	    me.menuTab = true;
	}
	else if ($scope.block.code && $scope.block.code!="") {
	    me.menuTab = true;
	}
	me.isFrance = false;
	if ($scope.rubedo.current.site.id == "555c4cf445205e71447e68d3") {
	    me.isFrance = true;
	}
        me.searchEnabled = (config.useSearchEngine && config.searchPage);
	me.getMenu = function(){
	    RubedoMenuService.getMenu(pageId, config.menuLevel).then(function(response){
		if (response.data.success){
		    me.menu=response.data.menu;
		    $scope.clearORPlaceholderHeight();
		} else {
		    me.menu={};
		    $scope.clearORPlaceholderHeight();
		}
	    });
	};

	if ($scope.block.code=='lvl3') {
	    if (($scope.rubedo.current.breadcrumb).length==3) {
		var pageId=$scope.rubedo.current.page.id; me.getMenu();
	    }
	    else if (($scope.rubedo.current.breadcrumb).length==4) {
		var pageId=$scope.rubedo.current.page.parentId;me.getMenu();
	    }
	    else if (($scope.rubedo.current.breadcrumb).length>=5) {
		var routeArray = $route.current.params.routeline.split("/");
		var rootPageRoute = routeArray[0]+"/"+routeArray[1]+"/"+routeArray[2]+"/";
		$http.get("/api/v1/pages",{
		    params:{
			site:$location.host(),
			route:rootPageRoute
		    }
		}).then(function(response){
		    if (response.data.success) {
			pageId = response.data.page.id;
		    }
		    else pageId=$scope.rubedo.current.page.parentId;
		    me.getMenu();
		});
	    }
	}		
	else if ($scope.block.code=='lvl2') {
	    if (($scope.rubedo.current.breadcrumb).length==2) {
		var pageId=$scope.rubedo.current.page.id; me.getMenu();
	    }
	    else if (($scope.rubedo.current.breadcrumb).length==3) {
		var pageId=$scope.rubedo.current.page.parentId;me.getMenu();
	    }
	    else if (($scope.rubedo.current.breadcrumb).length>=4) {
		var routeArray = $route.current.params.routeline.split("/");
		var rootPageRoute = routeArray[0]+"/"+routeArray[1]+"/";
		$http.get("/api/v1/pages",{
		    params:{
			site:$location.host(),
			route:rootPageRoute
		    }
		}).then(function(response){
		    if (response.data.success) {
			pageId = response.data.page.id;
		    }
		    else pageId=$scope.rubedo.current.page.parentId;
		    me.getMenu();
		});
	    }
	}		
        else if (config.rootPage){
            var pageId=config.rootPage;me.getMenu();
        } else if (config.fallbackRoot&&config.fallbackRoot=="parent"&&mongoIdRegex.test($scope.rubedo.current.page.parentId)){
            var pageId=$scope.rubedo.current.page.parentId;me.getMenu();
        } else {
            var pageId=$scope.rubedo.current.page.id;me.getMenu();
        }
	/*si ce n'est pas la France (avec un menu principal "à la main", on détermine le menu principal*/
	if (!me.isFrance) {
	    RubedoMenuService.getMenu(config.rootPage, config.menuLevel).then(function(response){
		if (response.data.success){
		    me.menuPrincipal=response.data.menu;
		} else {
		    me.menu={};
		}
	    });
	}
        me.onSubmit = function(){
            var paramQuery = me.query?'?query='+me.query:'';
            RubedoPagesService.getPageById(config.searchPage).then(function(response){
                if (response.data.success){
                    $location.url(response.data.url+paramQuery);
                }
            });
        };
	
        
	me.showMenu =function(){
	    $scope.menu = !$scope.menu;
	    if($scope.menu) angular.element('#menuModal').modal('show');
	    else angular.element('#menuModal').modal('hide');
	};
	// pour fermer le modal quand on clique sur un lien
	$scope.$on("$locationChangeStart",function(event, newLoc,currentLoc){
	    angular.element('body .modal-backdrop ').remove();
	});
	angular.element('#menuModal').on('shown.bs.modal', function() {
	     angular.element(document).off('focusin.modal');
	});
	/*Ajouter les traductions*/
	$scope.rubedo.getCustomTranslations = function(){
	        $http.get('/theme/'+window.rubedoConfig.siteTheme+'/localization/'+lang+'/Texts.json').then(function(res){
		    $scope.rubedo.translations = JSON.parse((JSON.stringify($scope.rubedo.translations) + JSON.stringify(res.data)).replace(/}{/g,","))
	      });	
        }
      $scope.rubedo.getCustomTranslations();
	
	
	
}]);
