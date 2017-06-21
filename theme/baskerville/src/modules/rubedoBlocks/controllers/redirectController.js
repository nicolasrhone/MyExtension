angular.module("rubedoBlocks").lazy.controller('RedirectController',['$scope','RubedoContentsService','RubedoPagesService',function($scope,RubedoContentsService,RubedoPagesService){
   var me = this;
    var config = $scope.blockConfig;
    me.redirectUrl = "";
    $scope.clearORPlaceholderHeight();
   me.getContentById = function (contentId){
        var options = {
            siteId: $scope.rubedo.current.site.id,
            pageId: $scope.rubedo.current.page.id
        };
        RubedoContentsService.getContentById(contentId, options).then(
            function(response){
                if(response.data.success){
                    me.redirectUrl = response.data.content.canonicalUrl;
                }
            }
        );
   }

    if (config.contentId){
        me.getContentById(config.contentId);
    }
    else if (config.url) {
        me.redirectUrl = config.url;
    }
    else if (config.linkedPage&&mongoIdRegex.test(config.linkedPage)) {
        RubedoPagesService.getPageById(config.linkedPage).then(function(response){
            if (response.data.success){
                me.redirectUrl=response.data.url;
            }
        });
    }
    
    window.location.href= me.redirectUrl;







}]);