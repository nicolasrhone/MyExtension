angular.module("rubedoBlocks").lazy.controller("GeoSearchResultsController",["$scope","$location","$routeParams","$compile","RubedoSearchService","$element","$route","RubedoPagesService","$http",
    function($scope,$location,$routeParams,$compile,RubedoSearchService,$element,$route,RubedoPagesService,$http){
        var me = this;
        me.showColors=false;
        $scope.lang=$route.current.params.lang;
        var config = $scope.blockConfig;
        var themePath="/theme/"+window.rubedoConfig.siteTheme;
        me.data = [];
        me.facets = [];
        me.activeFacets = [];
        me.activateSearch=config.activateSearch;
        me.start = 0;
        me.limit = config.pageSize ? config.pageSize : 5000;
        me.height = config.height ? config.height + "px" : "500px";
        me.map={
            center:{
                latitude:48.8567,
                longitude:2.3508
            },
            zoom:config.zoom ? config.zoom : 14
        };
        me.geocoder = new google.maps.Geocoder();
        me.displayedItemId=0;
        //places search
        if (config.showPlacesSearch){
            me.activatePlacesSearch=true;
            me.placesSearchTemplate=themePath+"/templates/blocks/geoSearchResults/placesSearch.html";
        }
        
        //cluster icon
        var clusterStyles = [
          {
            textColor: '#333333',
            textSize: 14,
            url: '/theme/netforgod/img/maps/cluster.png',
            height: 50,
            width: 50
          },
        ];
        //clustering options
        me.clusterOptions={
            batchSize : 20000,
            averageCenter : true,
            gridSize : 80,
            zoomOnClick:false,
            batchSizeIE : 20000,
            enableRetinaIcons :true,
            styles : clusterStyles

        };
        //api clustering options
        me.apiClusterOptions={
            batchSize : 20000,
            averageCenter : false,
            minimumClusterSize:1,
            zoomOnClick:false,
            maxZoom : 7,
            calculator:function (markers, numStyles) {
                var index = 0;
                var count = 0;
                angular.forEach(markers,function(marker){
                    if (marker&&marker.counter){
                        count=count+marker.counter;
                    }
                });
                var dv = count;
                while (dv !== 0) {
                    dv = parseInt(dv / 10, 10);
                    index++;
                }
                index = Math.min(index, numStyles);
                return {
                    text: count,
                    index: index
                };
            },
            gridSize : 20,
            batchSizeIE : 20000
        };
        //set initial map center
        if (config.useLocation&&navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position) {
                me.map.center={
                    latitude:position.coords.latitude,
                    longitude:position.coords.longitude
                };
            }, function() {
                console.log("location error");
                $http({
                    method: 'GET',
                    url: '//ip-api.com/json'
                }).then(function successCallback(response) {
                    console.log(response);
                    me.map.center={
                        latitude:response.lat,
                        longitude:response.lon
                    };
                    // this callback will be called asynchronously
                    // when the response is available
                  }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                  });
                    //handle geoloc error
                });
        }
        else if(config.useLocation&&!navigator.geolocation) {
            $http({
                method: 'GET',
                url: '//freegeoip.net/json/?callback=?'
            }).then(function successCallback(response) {
                console.log(response);
                // this callback will be called asynchronously
                // when the response is available
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
        }
        else if (config.centerAddress){
            me.geocoder.geocode({
                'address' : config.centerAddress
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    me.map.center={
                        latitude:results[0].geometry.location.lat(),
                        longitude:results[0].geometry.location.lng()
                    };
                }
            });

        } else if (config.centerLatitude && config.centerLongitude){
            me.map.center={
                latitude:config.centerLatitude,
                longitude:config.centerLongitude
            };
        }
        //map control object recieves several control methods upon map render
        me.mapControl={ };
        //map events
        me.mapTimer = null;
        me.mapEvents = {
            "bounds_changed": function (map) {
                clearTimeout(me.mapTimer);
                me.mapTimer = setTimeout(function() {
                    me.searchByQuery(options);
                }, 300);
            }
        };
        
        //marker events
        me.markerEvents = {
            click: function (gMarker, eventName, model) {
                var isFirst = !(model.id==me.displayedItemId); // true si c'est la première fois qu'on clique
                console.log(isFirst);
                if (isFirst) {
                    $scope.$apply(function () {
                        me.displayedItemId = model.id;
                    });

                    $scope.$apply(function(){
                        angular.forEach(me.data, function(item){
                            if (item.id != model.id) {
                                item.markerOptions = {
                                    title:item.title,
                                    icon: new google.maps.MarkerImage("/theme/netforgod/img/maps/"+item.itemData['class']+"sel.png", null, null, null, new google.maps.Size(50, 50))
                                }
                            }
                            else
                                item.markerOptions = {
                                    title:item.title,
                                    icon: new google.maps.MarkerImage("/theme/netforgod/img/maps/"+item.itemData['class']+"sel.png", null, null, null, new google.maps.Size(100, 100))
                                }
                        });
                    })
                
                    var target=angular.element(".search-result[id='"+model.id+"']");
                    var scrollEl = angular.element(".geo-search");
                    if (target&&target.length>0){
                        scrollEl.animate({scrollTop: target.offset().top+scrollEl.scrollTop()}, "fast");
                    }


                }
                console.log("displayedID :"+me.displayedItemId);

            }
        };
        me.setDisplayedId = function(currentId){

                angular.forEach(me.data, function(item){
                    if (item.id != currentId) {
                        item.markerOptions = {
                            title:item.title,
                            icon: new google.maps.MarkerImage("/theme/netforgod/img/maps/"+item.itemData['class']+"sel.png", null, null, null, new google.maps.Size(50, 50))
                        }
                    }
                    else
                        item.markerOptions = {
                            title:item.title,
                            icon: new google.maps.MarkerImage("/theme/netforgod/img/maps/"+item.itemData['class']+"sel.png", null, null, null, new google.maps.Size(100, 100))
                        }
                });
                me.displayedItemId = currentId;
            
        }

        me.clusterEvents= {
            click: function(cluster){
                var map=cluster.getMap();
                map.setCenter(cluster.getCenter());
                map.setZoom(map.getZoom()+2);
            }
        };
        me.smallClusterEvents= {
            click: function(cluster,markers){
                if (cluster.getMap().getZoom()>19){
                    var targetId=markers[0].id;
                    var markerHolder=cluster.getMarkerClusterer().getMarkers().get(targetId);

                    if ($element.find('#gmapitem'+targetId).length==0){
                        if (me.activeInfoWindow){
                            me.activeInfoWindow.close();
                        }
                        var newInfoWin = new google.maps.InfoWindow({
                            content : '<div class="rubedo-gmapitem" id="gmapitem'+targetId+'" ><div ng-repeat="mData in mDatas" ng-init="itemData = mData.itemData" ng-include="\''+themePath+'/templates/blocks/geoSearchResults/detail/\'+itemData.objectType+\'.html\'"></div></div>',
                            position : markerHolder.getPosition()
                        });
                        var map=cluster.getMap();
                        newInfoWin.open(map);
                        me.activeInfoWindow=newInfoWin;
                        setTimeout(function(){
                            var newScope=$element.find('#gmapitem'+targetId).scope();
                            newScope.mDatas=markers;
                            $compile($element.find('#gmapitem'+targetId)[0])(newScope);
                            cluster.getMap().setCenter(cluster.getMap().getCenter());
                        }, 200);
                    }
                } else {
                    var map=cluster.getMap();
                    map.setCenter(cluster.getCenter());
                    map.setZoom(map.getZoom()+2);
                }
            }
        };
        if (config.activateSearch){
            if (!config.displayMode){
                config.displayMode="default";
            }
            me.template = themePath+"/templates/blocks/geoSearchResults/"+config.displayMode+".html";
        } else {
            me.template = themePath+"/templates/blocks/geoSearchResults/map.html";
        }
        var predefinedFacets = config.predefinedFacets==""?{}:JSON.parse(config.predefinedFacets);
        var facetsId = ['objectType','type','damType','userType','author','userName','lastupdatetime','price','inStock','query'];
        if (config.displayedFacets=="all"){
            config.displayedFacets="['all']";
        }
        var defaultOptions = {
            start: me.start,
            limit: me.limit,
            constrainToSite: config.constrainToSite,
            predefinedFacets: config.predefinedFacets,
            displayMode: config.displayMode,
            displayedFacets: config.displayedFacets,
            pageId: $scope.rubedo.current.page.id,
            siteId: $scope.rubedo.current.site.id,
            detailPageId:"56a63f4ac445ec795f8b4dd5"
        };
        if (config.singlePage){
            defaultOptions.detailPageId = config.singlePage;
        }
        var options = angular.copy(defaultOptions);
        var parseQueryParamsToOptions = function(){
            angular.forEach($location.search(), function(queryParam, key){
                if(typeof queryParam !== "boolean"){
                    if(key == 'taxonomies'){
                        options[key] = JSON.parse(queryParam);
                    } else {
                        if(key == 'query'){
                            me.query = queryParam;
                        }
                        options[key] = queryParam;
                    }
                }
            });
        };
        if(predefinedFacets.query) {
            me.query = options.query = predefinedFacets.query;
            $location.search('query',me.query);
        }
        $scope.$on('$routeUpdate', function(scope, next, current) {
            options = angular.copy(defaultOptions);
            options.start = me.start;
            options.limit = me.limit;
            parseQueryParamsToOptions();
            me.searchByQuery(options, true);
        });
        me.checked = function(term){
            var checked = false;
            angular.forEach(me.activeTerms,function(activeTerm){
                if (!checked){
                    checked = activeTerm.term==term;
                }
            });
            return checked;
        };
        me.disabled = function(term){
            var disabled = false;
            angular.forEach(me.notRemovableTerms,function(notRemovableTerm){
                disabled = notRemovableTerm.term == term;
            });
        };
        me.onSubmit = function(){
            me.start = 0;
            options = angular.copy(defaultOptions);
            options.start = me.start;
            options.limit = me.limit;
            options.query = me.query;
            $location.search('query',me.query);
        };
        me.clickOnFacets =  function(facetId,term){
            var del = false;
            angular.forEach(me.activeTerms,function(activeTerm){
                if(!del){
                    del = (activeTerm.term==term && activeTerm.facetId==facetId);
                }
            });
            if(del){
                if(facetsId.indexOf(facetId)==-1){
                    options.taxonomies[facetId].splice(options.taxonomies[facetId].indexOf(term),1);
                    if(options.taxonomies[facetId].length == 0){
                        delete options.taxonomies[facetId];
                    }
                    if(Object.keys(options['taxonomies']).length == 0){
                        $location.search('taxonomies',null);
                    } else {
                        $location.search('taxonomies',JSON.stringify(options.taxonomies));
                    }
                } else if (facetId == 'query') {
                    $location.search('query',null);
                    delete options.query;
                } else if(facetId == 'lastupdatetime'||facetId == 'price'||facetId == 'inStock') {
                    delete options[facetId];
                    $location.search(facetId,null);
                } else {
                    if(angular.isArray(options[facetId+'[]'])){
                        options[facetId+'[]'].splice(options[facetId+'[]'].indexOf(term),1);
                    } else {
                        delete options[facetId+'[]'];
                    }
                    if(!options[facetId+'[]'] || options[facetId+'[]'].length == 0){
                        $location.search(facetId+'[]',null)
                    } else {
                        $location.search(facetId+'[]',options[facetId+'[]']);
                    }
                }
            } else {
                if(facetsId.indexOf(facetId)==-1){
                    if(!options.taxonomies){
                        options.taxonomies = {};
                    }
                    if(!options.taxonomies[facetId]){
                        options.taxonomies[facetId] = [];
                    }
                    options.taxonomies[facetId].push(term);
                    $location.search('taxonomies',JSON.stringify(options.taxonomies));
                } else if(facetId == 'lastupdatetime'||facetId == 'price'||facetId == 'inStock') {
                    options[facetId] = term;
                    $location.search(facetId,options[facetId]);
                } else {
                    if(!options[facetId+'[]']){
                        options[facetId+'[]'] = [];
                    }
                    options[facetId+'[]'].push(term);
                    $location.search(facetId+'[]',options[facetId+'[]']);
                }
            }
            me.start = 0;
            options.start = me.start;
        };
        me.preprocessData=function(data){
            var refinedData=[];
            if (data.count>me.limit){
                me.apiClusterMode=true;
                angular.forEach(data.results.Aggregations.buckets,function(item){
                    refinedData.push({
                        id:item.key+item["doc_count"],
                        coordinates:{
                            latitude:item.medlat,
                            longitude:item.medlon
                        },
                        markerOptions:{
                            counter:item["doc_count"]
                        }
                    });
                });
            } else {
                me.apiClusterMode=false;
                var today = new Date();
                angular.forEach(data.results.data,function(item){
                    var dateDist=9999999999;
                    var oneDay = 24 * 60 * 60 * 1000;
                    if (item['fields.date']) {
                        angular.forEach(item['fields.date'],function(candidateDate){
                            if ( candidateDate*1000 - today.getTime() >0 && candidateDate*1000 - today.getTime()<dateDist) {
                                dateDist = candidateDate*1000 - today.getTime();
                                item['nextDate']=candidateDate;
                            }
                        });
                        if (item['nextDate']) {
                           if(dateDist/oneDay<=7) {
                                item['class'] = "date1";
                            }
                           else if(dateDist/oneDay<=14) {
                                item['class'] = "date2";
                            }
                            else if(dateDist/oneDay<=30) {
                                item['class'] = "date3";
                            }      
                            else if(dateDist/oneDay<=60) {
                                item['class'] = "date4";
                            }
                            else item['class'] = "date5";
                        }
                        else item['class'] = "date5";
                     }
                     else item['class'] = "date5";
                    if (item['fields.position.location.coordinates']&&item['fields.position.location.coordinates'][0]){
                        var coords=item['fields.position.location.coordinates'][0].split(",");
                        var icon = new google.maps.MarkerImage("/theme/netforgod/img/maps/"+item['class']+"sel.png", null, null, null, new google.maps.Size(50, 50));
                        var icon2 = new google.maps.MarkerImage("/theme/netforgod/img/maps/"+item['class']+"sel.png", null, null, null, new google.maps.Size(100, 100));
                        if (coords[0]&&coords[1]){
                            refinedData.push({
                                coordinates:{
                                    latitude:coords[0],
                                    longitude:coords[1]
                                },
                                id:item.id,
                                objectType:item.objectType,
                                title:item.title,
                                itemData:item,
                                //distance:me.distance(coords[0],coords[1]),
                                markerOptions:{
                                    title:item.title,
                                    icon: me.displayedItemId==item['class'] ? icon2 : icon
                                }
                            });
                        }
                    }
                   
                });
            }
            return refinedData;
        };
        
    /*distance from center of map*/    
    me.distance = function(lat2, lon2){
            var lat1=me.map.center.latitude;
            var lon1=me.map.center.longitude;
            var R = 6371000; // metres
            var φ1 = lat1 * Math.PI / 180;
            var φ2 = lat2 * Math.PI / 180;
            var Δφ = (lat2-lat1) * Math.PI / 180;
            var Δλ = (lon2-lon1)* Math.PI / 180;
               
            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                       Math.cos(φ1) * Math.cos(φ2) *
                       Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
               
            var d = R * c;
            return d;
        };

        me.searchByQuery = function(options){
            var bounds=me.mapControl.getGMap().getBounds();
            options.inflat=bounds.getSouthWest().lat();
            options.suplat=bounds.getNorthEast().lat();
            options.inflon=bounds.getSouthWest().lng();
            options.suplon=bounds.getNorthEast().lng();
            RubedoSearchService.searchGeo(options).then(function(response){
                if(response.data.success){
                    me.query = response.data.results.query;
                    me.count = response.data.count;
                    me.data =  me.preprocessData(response.data);
                    me.facets = response.data.results.facets;
                    me.notRemovableTerms = [];
                    me.activeTerms = [];
                    var previousFacetId;
                    angular.forEach(response.data.results.activeFacets,function(activeFacet){
                        if(activeFacet.id != 'navigation'){
                            angular.forEach(activeFacet.terms,function(term){
                                var newTerm = {};
                                newTerm.term = term.term;
                                newTerm.label = term.label;
                                newTerm.facetId = activeFacet.id;
                                if(previousFacetId == activeFacet.id){
                                    newTerm.operator =' '+(activeFacet.operator)+' ';
                                } else if (previousFacetId && me.notRemovableTerms.length != 0){
                                    newTerm.operator = ', ';
                                }
                                if(predefinedFacets.hasOwnProperty(activeFacet.id) && predefinedFacets[activeFacet.id]==term.term){
                                    me.notRemovableTerms.push(newTerm);
                                } else {
                                    me.activeTerms.push(newTerm);
                                }
                                previousFacetId = activeFacet.id;
                            });
                        }
                    });
                    $scope.clearORPlaceholderHeight();
                }
            })
        };
        parseQueryParamsToOptions();
        if (me.activatePlacesSearch){
            setTimeout(function(){
                var input=$element.find(".rubedo-places-search");
                var searchBox = new google.maps.places.SearchBox(input[0]);
                google.maps.event.addListener(searchBox, 'places_changed', function() {
                    var places = searchBox.getPlaces();
                    me.mapControl.getGMap().setCenter(places[0].geometry.location);
                    if (config.zoomOnAddress) {
                        me.mapControl.getGMap().setZoom(config.zoomOnAddress);
                    } else {
                        me.mapControl.getGMap().setZoom(14);
                    }

                });
            },4000);
        }
        me.display = function () {
            /**
             * Hack to avoid the partial loading map (gray parts)
             *
             * With this hack, the map will be added to the dom after the HTML rendering
             */
            return true;
        };
        if (config.height&&config.height!=500){
            setTimeout(function(){
                $element.find(".angular-google-map-container").height(config.height);
            },190);
        }
        setTimeout(function(){
            if(!me.count||me.count==0){
                google.maps.event.trigger(me.mapControl.getGMap(), 'resize');
                if (config.useLocation&&navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function(position) {
                        me.mapControl.getGMap().setCenter(new google.maps.LatLng({
                            lat:position.coords.latitude,
                            lng:position.coords.longitude
                        }));


                    }, function() {
                        //handle geoloc error
                    });
                } else if (config.centerAddress){
                    me.geocoder.geocode({
                        'address' : config.centerAddress
                    }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            me.mapControl.getGMap().setCenter(new google.maps.LatLng({
                                lat:results[0].geometry.location.lat(),
                                lng:results[0].geometry.location.lng()
                            }));

                        }
                    });

                } else if (config.centerLatitude && config.centerLongitude){
                    me.mapControl.getGMap().setCenter(new google.maps.LatLng({
                        lat:config.centerLatitude,
                        lng:config.centerLongitude
                    }));

                }
            }
        },3200);
        /*GEt Edition page*/
        RubedoPagesService.getPageById("571682f2c445ecf7148c3806").then(function(response){
            if (response.data.success){
                    me.editorPageUrl=response.data.url;
                }
        });
        
    }]);
