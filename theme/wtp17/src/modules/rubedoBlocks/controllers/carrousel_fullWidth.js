angular.module("rubedoBlocks").lazy.controller("FWCarouselController",["$scope","RubedoContentsService",function($scope,RubedoContentsService){
    var me=this;
    me.contents=[];
    var blockConfig=$scope.blockConfig;
    var queryOptions={
        start: blockConfig.resultsSkip ? blockConfig.resultsSkip : 0,
        limit: blockConfig.pageSize ? blockConfig.pageSize : 6,
        'fields[]' : ["text","summary",blockConfig.imageField]/*,
        'requiredFields[]':[blockConfig.imageField]*/
    };
    var stopOnHover=blockConfig.stopOnHover;
    if(blockConfig.stopOnHover==true) stopOnHover="hover";
    else stopOnHover="false";
    var pageId=$scope.rubedo.current.page.id;
    var siteId=$scope.rubedo.current.site.id;
    me.getContents=function(){
        RubedoContentsService.getContents(blockConfig.query,pageId,siteId, queryOptions).then(
            function(response){
                if (response.data.success){
                    me.contents=response.data.contents;
                    me.count = response.data.count;
                    setTimeout(function(){me.initCarousel();},100);
                }
            }
        );
    };
    me.initCarousel=function(){
        var targetElSelector="#block"+$scope.block.id;
        angular.element(targetElSelector).carousel({
            interval: blockConfig.duration*1000, //changes the speed
            pause: blockConfig.stopOnHover?"hover":"false"
        });
        $scope.clearORPlaceholderHeight();
    };
    me.slideTo=function(index){
        var targetElSelector="#block"+$scope.block.id;
        angular.element(targetElSelector).carousel(index);
    }
    me.getImageOptions=function(){
        return({
            height:blockConfig.imageHeight,
            width:blockConfig.imageWidth ? blockConfig.imageWidth : angular.element("#block"+$scope.block.id).width(),
            mode:blockConfig.imageResizeMode
        });
    };
    if (blockConfig.query){
        me.getContents();
    }
}]);




