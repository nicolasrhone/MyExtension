angular.module("rubedoBlocks").lazy.controller("CarouselController",["$scope","$sce","RubedoContentsService",function($scope,$sce,RubedoContentsService){
    var me=this;
    me.contents=[];
    var blockConfig=$scope.blockConfig;
    var queryOptions={
        start: blockConfig.resultsSkip ? blockConfig.resultsSkip : 0,
        limit: blockConfig.pageSize ? blockConfig.pageSize : 6,
        'fields[]' : ["text","summary",blockConfig.imageField,"imageDroite","imageGauche","color1","color2","icone","text_color","icon_color"],
        //'requiredFields[]':[blockConfig.imageField],
        ismagic: blockConfig.magicQuery ? blockConfig.magicQuery : false
    };
    var pageId=$scope.rubedo.current.page.id;
    var siteId=$scope.rubedo.current.site.id;
    me.getContents=function(){
        RubedoContentsService.getContents(blockConfig.query,pageId,siteId, queryOptions).then(
            function(response){
                if (response.data.success){
                    me.contents=response.data.contents;
                    setTimeout(function(){me.initCarousel();},100);
                }
            }
        );
    };
    me.initCarousel=function(){
        var targetElSelector="#block"+$scope.block.id;
        var owlOptions={
            responsiveBaseWidth:targetElSelector,
            singleItem:true,
            pagination: blockConfig.showPager,
            navigation: blockConfig.showNavigation,
            autoPlay: blockConfig.autoPlay,
            stopOnHover: blockConfig.stopOnHover,
            paginationNumbers:blockConfig.showPagingNumbers,
            navigationText: ['<span class="glyphicon glyphicon-chevron-left"></span>','<span class="glyphicon glyphicon-chevron-right"></span>'],
            lazyLoad:true
        };
        angular.element(targetElSelector).owlCarousel(owlOptions);
        $scope.clearORPlaceholderHeight();

    };
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
    me.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
  }

    
    
}]);
