    angular.module("rubedoBlocks").lazy.controller("MenuController",['$scope','$rootScope','$location','RubedoMenuService','RubedoPagesService',function($scope,$rootScope,$location,RubedoMenuService,RubedoPagesService){
        var me=this;
        me.menu={};
        me.currentRouteleine=$location.path();
        var config=$scope.blockConfig;
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
                }
            });
        };
        RubedoMenuService.getMenu(pageId, config.menuLevel).then(function(response){
            if (response.data.success){
                me.menu=response.data.menu;
            } else {
                me.menu={};
            }
        });
	
	$rootScope.toggleNav = "false";
	$rootScope.ToggleNav = function(){$rootScope.toggleNav = !$rootScope.toggleNav};   
    }]);
