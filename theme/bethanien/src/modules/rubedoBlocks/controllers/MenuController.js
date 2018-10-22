    angular.module("rubedoBlocks").lazy.controller("MenuController",['$scope','$location','RubedoMenuService','RubedoPagesService','RubedoContentsService', '$http','$route',
								     function($scope,$location,RubedoMenuService,RubedoPagesService,RubedoContentsService,$http,$route){
        var me=this;
        var themePath="/theme/"+window.rubedoConfig.siteTheme;
        me.menu={};
        var lang = $route.current.params.lang;
        me.rootUrl = ""; // sera chargé dans RubedoMenuService.getMenu
        me.currentLang = $scope.rubedo.current.site.languages[$route.current.params.lang];
        me.currentRouteline=$location.path();
        var config=$scope.blockConfig;
	
        me.searchEnabled = (config.useSearchEngine && config.searchPage);
        if (config.rootPage){
            var pageId=config.rootPage;
        } else if (config.fallbackRoot&&config.fallbackRoot=="parent"&&mongoIdRegex.test($scope.rubedo.current.page.parentId)){
            var pageId=$scope.rubedo.current.page.parentId;
        } else {
            var pageId=$scope.rubedo.current.page.id;
        }

        me.urls = {}
        // va stocker l'url relative correspondant à page_id (id d'une page ou d'un contenu) dans me.urls[page_id]
        // on peut l'utiliser comme ça : faire un ng-init="menuCtrl.getUrlById('12345')" puis on insère un <a ng-href="{{menuCtrl.urls['12345']}}"">link</a>
        me.getUrlById = function(page_id) { 
            console.log('getUrlById going to ', page_id)
            RubedoPagesService.getPageById(page_id, true).then(function(response){
                console.log('getUrlById', response.data)
                if (!response.data.success) throw "Error1 in MenuController > getUrlById";
                me.urls[page_id] = response.data.url;
            }).catch(err => {
                RubedoContentsService.getContentById(page_id).then(contentResponse => {
                    console.log('getUrlById2', page_id, contentResponse)
                    if (!contentResponse.data.success) throw "Error2 in MenuController > getUrlById";
                    var contentSegment = contentResponse.data.content.text;
                    if (contentResponse.data.content.fields.urlSegment && contentResponse.data.content.fields.urlSegment != ""){
                        contentSegment = contentResponse.data.content.fields.urlSegment;
                    }
                    let root = (me.rootUrl) ? me.rootUrl: $location.path();
                    console.log('getUrlById3', root)
                    me.urls[page_id] = root + "/" + page_id + "/" + angular.lowercase(contentSegment.replace(/ /g, "-"));
                })
            })
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
                me.rootUrl = me.menu.url;
            } else {
                me.menu={};
            }
        });
	
        var lang = $route.current.params.lang;
	/*Ajouter les traductions*/
	$scope.rubedo.getCustomTranslations = function(){
	        $http.get('/theme/cte/localization/'+lang+'/Texts.json').then(function(res){
            	$scope.rubedo.translations = JSON.parse((JSON.stringify($scope.rubedo.translations) + JSON.stringify(res.data)).replace(/}{/g,","))
          });	
        }
      $scope.rubedo.getCustomTranslations(); 
	
}]);
    
    
angular.module("rubedoBlocks").lazy.controller("LanguageMenuController", ['$scope', 'RubedoPagesService','RubedoModuleConfigService', 'RubedoContentsService', '$route', '$location',
    function ($scope, RubedoPagesService,RubedoModuleConfigService, RubedoContentsService, $route, $location) {
        var me = this;
        var config = $scope.blockConfig;
        var urlArray = [];
        var contentId = "";
        me.languages = $scope.rubedo.current.site.languages;
        me.currentLang = $scope.rubedo.current.site.languages[$route.current.params.lang];
        me.mode = config.displayAs == "select";
        me.showFlags = config.showFlags;
        me.isDisabled =  function(lang){
            return me.currentLang.lang == lang;
        };
        if(!config.showCurrentLanguage){
            delete me.languages[$route.current.params.lang];
        }
        me.getFlagUrl = function(flagCode){
            return '/assets/flags/16/'+flagCode+'.png';
        };
        
        me.changeLang = function (lang) {
            if(lang != me.currentLang.lang){
                RubedoModuleConfigService.changeLang(lang);
                  
                if ($scope.rubedo.current.site.locStrategy == 'fallback'){
                    RubedoModuleConfigService.addFallbackLang($scope.rubedo.current.site.defaultLanguage);
                }
                RubedoPagesService.getPageById($scope.rubedo.current.page.id,true).then(function(response){
                    if (response.data.success){
                        if($scope.rubedo.current.page.contentCanonicalUrl) {
                            // Get content id
                            urlArray = $route.current.params.routeline.split("/");
                            contentId = urlArray[urlArray.length-2];
                            
                            // Redirect without title
                            //window.location.href = response.data.url + "/" + contentId + "/title";

                            //Redirect with title
                            RubedoContentsService.getContentById(contentId).then(function(contentResponse){
                                if (contentResponse.data.success){
                                    //console.log(contentResponse.data.content);
                                    var contentSegment=contentResponse.data.content.text;
                                        if (contentResponse.data.content.fields.urlSegment&&contentResponse.data.content.fields.urlSegment!=""){
                                            contentSegment=contentResponse.data.content.fields.urlSegment;
                                        }
                                        window.location.href =response.data.url + "/" + contentId + "/" + angular.lowercase(contentSegment.replace(/ /g, "-"));
                                        
                                    } 
                                    else {
                                        window.location.href =  response.data.url;
                                    
                                    }
                            },
                            function(){
                                window.location.href =  response.data.url;
                            });
                        } else {
                            var currentParams = angular.element.param($location.search());
                            var url = response.data.url;
                            

                            if(currentParams != "") {
                                if(response.data.url.indexOf("?") > -1) {
                                    url = response.data.url + currentParams;
                                } else {
                                    url = response.data.url + "?" + currentParams;
                                }
                            }
                           
                           
                            window.location.href = url;

                        }
                    }
                });
            }
        };
        $scope.clearORPlaceholderHeight();
        
    }]);
