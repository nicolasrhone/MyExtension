    angular.module("rubedoBlocks").lazy.controller("MenuController",['$scope','$location','RubedoMenuService','RubedoPagesService',function($scope,$location,RubedoMenuService,RubedoPagesService){
        var me=this;
        var themePath="/theme/"+window.rubedoConfig.siteTheme;
        me.menu={};
        me.currentRouteline=$location.path();
        var config=$scope.blockConfig;
	me.menuTab = false; //par d�faut, le menu montr� est le menu g�n�ral
	me.menuTemplate = themePath+'/templates/blocks/navigation/1418.html';
	if ($scope.block.code == '1418') {
	    me.menuClass="menu1418";
	    me.menuTab = true; //par d�faut, le menu montr� est le menu g�n�ral

	}
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
		$scope.clearORPlaceholderHeight();
            } else {
                me.menu={};
		$scope.clearORPlaceholderHeight();
            }
        });

}]);