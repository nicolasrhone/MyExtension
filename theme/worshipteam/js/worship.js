blocksConfig.buttonToPage={
           "template": "/templates/blocks/buttonToPage.html",
          "internalDependencies":["/src/modules/rubedoBlocks/controllers/buttonToPage.js"]
};
blocksConfig.simpleContact={
           "template": "/templates/blocks/simpleContact.html",
          "internalDependencies":["/src/modules/rubedoBlocks/controllers/simpleContact.js"]
};


blocksConfig.bg_image={
           "template": "/templates/blocks/bg_image.html",
          "internalDependencies":["/src/modules/rubedoBlocks/controllers/BgImageController.js"]
};
blocksConfig.footer={
           "template": "/templates/blocks/footer.html"
};
blocksConfig.contentDetail = {
            "template": "/templates/blocks/contentDetail.html",
            "externalDependencies":['//s7.addthis.com/js/300/addthis_widget.js'],
            "internalDependencies":["/src/modules/rubedoBlocks/controllers/BreadcrumbController.js","/src/modules/rubedoBlocks/controllers/ContentDetailController.js","/src/modules/rubedoBlocks/directives/DisqusDirective.js","/src/modules/rubedoBlocks/controllers/simpleContact.js"]
};
blocksConfig.sectionPresentation={
           "template": "/templates/blocks/sectionPresentation.html",
          "internalDependencies":["/src/modules/rubedoBlocks/controllers/sectionPresentation.js"]
};
blocksConfig.carrousel2={
           "template": "/templates/blocks/carrousel_fullWidth.html",
          "internalDependencies":["/src/modules/rubedoBlocks/controllers/carrousel_fullWidth.js"]
};
blocksConfig.redirect={
           "template": "/templates/blocks/redirect.html",
          "internalDependencies":["/src/modules/rubedoBlocks/controllers/redirectController.js"]
};


angular.module('rubedo').filter('ligneNonVide', function () {
           return function (input) {
                      var filtered = [];
		      var contentDisplay = false;
                      angular.forEach(input, function(row, index) {
				// si la 1�re colonne est terminale et non vide
                                 if (row.columns[0].isTerminal&&row.columns[0].blocks) {
				    // toujours afficher la 1�re ligne (menu) et la derni�re (footer)
				    if (index ==0 || index >= input.length-1) {
					filtered.push(row);
				    }
				    // si la page sert � afficher un contenu (en 2�me ligne) on n'affiche pas les autres lignes
				    else if (row.columns[0].blocks[0].configBloc.isAutoInjected)  {
					filtered.push(row);
					contentDisplay = true;
				    }
				    
				    // sinon on affiche tout
				    else if(!contentDisplay) {filtered.push(row);}
                                            
					    
                                 }
                      });
                      return filtered;
		    
     };
  });

angular.module('rubedoBlocks').controller("AudioFileController",["$scope","RubedoMediaService",function($scope,RubedoMediaService){
        var me=this;
        var mediaId=$scope.audioFileId;
         me.displayMedia=function(){
            if (me.media&&me.media.originalFileId){

                        me.jwSettings={
                            primary:"flash",
                            width:"100%",
                            height:40,
                            file:me.media.url,
                        };
                        setTimeout(function(){jwplayer("audio"+me.media.originalFileId).setup(me.jwSettings);}, 200);
            }
        };
        if (mediaId){
            RubedoMediaService.getMediaById(mediaId).then(
                function(response){
                    if (response.data.success){
                        me.media=response.data.media;
                        me.displayMedia();
                    }
                }
            );
        }
    }]);

 angular.module('rubedoBlocks').directive('jwplayer', ['$compile', function ($compile) {
    return {
        restrict: 'EC',
        link: function (scope, element, attrs) {
           var filmUrl = attrs.videoUrl;
            var id = 'random_player_' + Math.floor((Math.random() * 999999999) + 1),
            getTemplate = function (playerId) {
                      
                return '<div id="' + playerId + '"></div>';
            };
           var options = {
                      file: filmUrl,
                      modestbranding:0,
                      showinfo:1,
                      width:"100%",
                      aspectratio:"16:9"};
            element.html(getTemplate(id));
            $compile(element.contents())(scope);
            jwplayer(id).setup(options);
            
        }
    };
}]);

 angular.module('rubedoBlocks').directive('balanceText', function ($timeout) {
    return {
        restrict: 'C',
        link:  function (scope, element, attr) {
           function balanceText() {
                      element.balanceText();
            }
            $timeout(balanceText);
                    
        }
    };
});

angular.module('rubedoBlocks').directive('loadModal', function () {
    return {
        restrict: 'A',
        link: function(scope, $elm, attrs) {
            $elm.bind('click', function(event) {
                event.preventDefault();
                /*angular.element('#myModal iframe').attr('src', src);*/
                angular.element('#myModal').appendTo('body').modal('show');
            });
            scope.dismiss = function() {
                      angular.element('#myModal').modal('hide');
           };
        }
    }
});




    angular.module('rubedoDataAccess').factory('RubedoMailService', ['$http',function($http) {
        var serviceInstance={};
        serviceInstance.sendMail=function(payload){
            return ($http({
                url:"api/v1/mail",
                method:"POST",
                data : payload
            }));
        };
        return serviceInstance;
    }]);
    angular.module('rubedoDataAccess').factory('TaxonomyService', ['$http',function($http) {
        var serviceInstance={};
        serviceInstance.getTaxonomyByContentId=function(pageId,contentIds){
            return ($http.get("/api/v1/taxonomies",{
                params:{
                    pageId:pageId,
                    type:contentIds
                }
            }));
        };
        return serviceInstance;
    }]);
angular.module('rubedoDataAccess').factory('InscriptionService', ['$http',function($http) {
    var serviceInstance={};
    serviceInstance.inscrire=function(inscription, workspace){
        return($http({
                url:"/api/v1/inscription",
                method:"POST",
                data:{
                    inscription:inscription,
                    workspace: workspace
                }
            }));
    };
    return serviceInstance;
}]);


  angular.module('rubedoBlocks').directive('focusOnClick', function ($timeout) {
    return {
         link: function ( scope, element, attrs ) {
            scope.$watch( attrs.ngFocus, function ( val ) {
                if ( angular.isDefined( val ) && val ) {
                    $timeout( function () { element[0].focus();element[0].value=""; } );
                }
            }, true);
         }}
  });
  
angular.module('rubedoBlocks').directive('addthisToolbox', ['$timeout','$location', function($timeout,$location) {
  return {
    restrict : 'A',
	  transclude : true,
	  replace : true,
	  template : '<div ng-transclude></div>',
	  link : function($scope, element, attrs) {
		 $timeout(function () {
                      addthis.init();
                      var contentUrl = $location.absUrl();
                      addthis.toolbox(angular.element('.addthis_toolbox').get(), {}, {
                                 url: contentUrl,
                                 title : attrs.title,
                                 description : ''        
                      });
		/*if ($window.addthis.layers && $window.addthis.layers.refresh) {
                        $window.addthis.layers.refresh();
                    }*/
	           addthis.counter(angular.element('.addthis_counter').get(), {}, {url: contentUrl});
           /*addthis.sharecounters.getShareCounts({service: ['facebook','twitter'], countUrl: $location.absUrl()}, function(obj) {
                      console.log(obj)
           });*/
      });
	  }
	};
}]);
