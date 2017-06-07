angular.module("rubedoBlocks").lazy.controller("SearchFormController",['$scope','$location','RubedoPagesService','RubedoProductsService',function($scope, $location, RubedoPagesService,RubedoProductsService){
    var me = this;
    var config = $scope.blockConfig;
    me.show = config.searchPage;
				me.searchQuery="";
    me.placeholder = config.placeholder;
				var pageId=$scope.rubedo.current.page.id;
    var siteId=$scope.rubedo.current.site.id;
				var options = {
        start: 0,
        limit: 1000,
        'fields[]' : ["text"]
    };
    me.onSubmit = function(){
        var paramQuery = me.query?'?query='+me.query:'';
        RubedoPagesService.getPageById(config.searchPage).then(function(response){
            if (response.data.success){
                $location.url(response.data.url+paramQuery);
            }
        });
    };
				me.getProducts = function (queryId, pageId, siteId, options){
        RubedoProductsService.getContents(queryId,pageId,siteId, options).then(function(response){
            if (response.data.success){
																$scope.products = response.data.contents;
                
            }
        });
    };
				//me.getProducts("5899fa6f9b1bdee822000029", pageId, siteId, options);
}]);