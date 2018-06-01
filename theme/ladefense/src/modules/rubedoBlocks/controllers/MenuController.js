angular.module("rubedoBlocks").lazy.controller("MenuController",['$scope','$http','$location','$route','RubedoMenuService','RubedoPagesService',function($scope,$http,$location,$route,RubedoMenuService,RubedoPagesService){
        var me=this;
        me.menu={};
        me.currentRouteline=$location.path();
        var config=$scope.blockConfig;
								var lang = $route.current.params.lang;
        me.searchEnabled = (config.useSearchEngine && config.searchPage);
        if (config.rootPage){
            var pageId=config.rootPage;
        } else if (config.fallbackRoot&&config.fallbackRoot=="parent"&&mongoIdRegex.test($scope.rubedo.current.page.parentId)){
            var pageId=$scope.rubedo.current.page.parentId;
        } else {
            var pageId=$scope.rubedo.current.page.id;
        }
        me.onSubmit = function(){
            var paramQuery = me.query?'?query='+me.query:'';
            RubedoPagesService.getPageById(config.searchPage).then(function(response){
                if (response.data.success){
                    $location.url(response.data.url+paramQuery);
                    $scope.handleCSEvent("useSearch");
                }
            });
        };
        RubedoMenuService.getMenu(pageId, config.menuLevel).then(function(response){
            if (response.data.success){
                me.menu=response.data.menu;
                $scope.clearORPlaceholderHeight();
            } else {
                me.menu={};
                $scope.clearORPlaceholderHeight();
            }
        });
								/*Ajouter les traductions*/
								$scope.rubedo.getCustomTranslations = function(){
	        $http.get('/theme/foyers/localization/'+lang+'/Texts.json').then(function(res){
            	$scope.rubedo.translations = JSON.parse((JSON.stringify($scope.rubedo.translations) + JSON.stringify(res.data)).replace(/}{/g,","))
          });	
        }
								$scope.rubedo.getCustomTranslations(); 
	
}]);
