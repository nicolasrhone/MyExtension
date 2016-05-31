angular.module("rubedoBlocks").lazy.controller("CheckoutController",["$scope","RubedoPagesService","$rootScope","RubedoShoppingCartService","RubedoUserTypesService","RubedoCountriesService","RubedoUsersService","RubedoAuthService","RubedoShippersService","RubedoPaymentMeansService","RubedoOrdersService","$location","RubedoMailingListService", function($scope,RubedoPagesService,$rootScope,RubedoShoppingCartService,RubedoUserTypesService,RubedoCountriesService,RubedoUsersService,RubedoAuthService,RubedoShippersService,RubedoPaymentMeansService,RubedoOrdersService,$location,RubedoMailingListService){
    var me = this;
    var config = $scope.blockConfig;
    if (config.signupContentId){
        config.contentId=config.signupContentId;
    }
    config.displayMode="form";
    if (config.tCPage){
        RubedoPagesService.getPageById(config.tCPage).then(function(response){
            if (response.data.success){
                me.tCPageUrl=response.data.url;
            }
        });
    }
    if (config.orderDetailPage){
        RubedoPagesService.getPageById(config.orderDetailPage).then(function(response){
            if (response.data.success){
                me.orderDetailPageUrl=response.data.url;
            }
        });
    }
    me.blockId=($scope.block.id);
    RubedoCountriesService.getCountries().then(
        function(response){
            if (response.data.success){
                me.countriesArray=response.data.countries;
            }
        }
    );
    RubedoPaymentMeansService.getActivePaymentMeans().then(
        function(response){
            if (response.data.success){
                me.activePaymentMeans=response.data.paymentMeans;
            }
        }
    );
    me.cartIsEmpty=false;
    me.detailedCart={};
    me.itIsAGift=false
    me.getCart=function(){
        RubedoShoppingCartService.getCart({includeDetail:true}).then(
            function(response){
                if (response.data.success){
                    if (response.data.shoppingCart.detailedCart&&response.data.shoppingCart.detailedCart.totalItems>0){
                        me.detailedCart=response.data.shoppingCart.detailedCart;
                        me.cartIsEmpty=false;
                        var Mycart=response.data.shoppingCart.detailedCart.cart;
                        var i= 0
                        while (typeof Mycart[i]!= 'undefined' && i<1000){
                            if (Mycart[i]["productId"]['$id']=="57304df3c445eca2008b7b0f"){
                                me.itIsAGift=true;
                            }
                            i++
                        }
                        me.initializeCheckout();
                    } else  {
                        me.cartIsEmpty=true;
                        me.detailedCart={};
                    }
                }
            }
        );
    };
    me.getCart();
    $scope.$on("shoppingCartUpdated",function(event,args){
        if (args&&args.emitter!=me.blockId){
            me.getCart();
        }
    });
    $scope.addPaperToCart=function(){
        if (me.itIsAGift){console.log('it is already a gift')}
        else{
            //var content={"text":"Papier Cadeau","typeId":"55c87ae245205e8019c62e08","version":2,"online":true,"lastUpdateTime":1462784813,"createTime":1462783475,"productProperties":{"sku":"545848","basePrice":2,"preparationDelay":1,"canOrderNotInStock":"true","outOfStockLimit":1,"notifyForQuantityBelow":1,"resupplyDelay":1,"variations":[{"price":2,"stock":10000,"sku":"545848","id":"57304cf5c445ec58008b7a4a","specialOffers":[],"Couleur":"none","noSoTPrice":2,"finalPrice":2}],"lowestNoSoPrice":2,"lowestFinalPrice":2},"lastUpdateUser":{"id":"568fbed93bc32513318b458a","login":"elaval","fullName":"Etienne Laval"},"createUser":{"id":"568fbed93bc32513318b458a","login":"elaval","fullName":"Etienne Laval"},"id":"57304df3c445eca2008b7b0f","fields":{"image":"","text":"Papier Cadeau","summary":"Emballage cadeau pour votre commande"},"status":"published","taxonomy":{"navigation":["55c8777145205ef317c62e09"],"56961076c445ecd5008b5113":["56961113c445ec75018b5153"],"56bcbb07c445ecc31a8b4bc3":""},"startPublicationDate":null,"endPublicationDate":null,"target":["5693b19bc445ecba018b4cb7"],"writeWorkspace":"5693b19bc445ecba018b4cb7","nativeLanguage":"fr","readOnly":true,"locale":"fr","detailPageUrl":"#"}
            var options={
                productId:"57304df3c445eca2008b7b0f",
                variationId:"57304cf5c445ec58008b7a4a",
                // productId:content.id,
                //variationId:content.productProperties.variations[0].id,
                amount:1
            };
            RubedoShoppingCartService.addToCart(options).then(
                function(response){
                    $rootScope.$broadcast("shoppingCartUpdated",{emitter:"searchProductBox"});
                }
            );
        }
    }
    me.currentStage=1;
    me.maxStages=6;
    me.getProgress=function(){
        return parseInt(me.currentStage/me.maxStages*100);
    };
    me.setCurrentStage=function(newStage){
        if (newStage!=me.currentStage){
            angular.element("#checkoutStage"+me.currentStage).collapse("hide");
            angular.element("#checkoutStage"+newStage).collapse("show");
            me.currentStage=newStage;
        }
    };
    me.parseUserType=function(userType){
        me.userType=userType;
        $scope.fieldIdPrefix="checkout"+"_"+me.userType.type;
        if (!$scope.rubedo.current.user){
            me.userType.fields.unshift({
                cType:"textfield",
                config:{
                    name:"confirmPassword",
                    fieldLabel:$scope.rubedo.translate("Blocks.SignUp.label.confirmPassword"),
                    allowBlank:false,
                    vtype:"password"
                }
            });
            me.userType.fields.unshift({
                cType:"textfield",
                config:{
                    name:"password",
                    fieldLabel:$scope.rubedo.translate("Blocks.SignUp.label.password"),
                    allowBlank:false,
                    vtype:"password"
                }
            });
        }
        me.userType.fields.unshift({
            cType:"textfield",
            config:{
                name:"email",
                fieldLabel:$scope.rubedo.translate("Label.Email"),
                allowBlank:false,
                vtype:"email"
            }
        });
        me.userType.fields.unshift({
            cType:"textfield",
            config:{
                name:"name",
                fieldLabel:$scope.rubedo.translate("Blocks.SignUp.label.name"),
                allowBlank:false
            }
        });
        me.inputFields=me.userType.fields;
    };
    me.initializeCheckout=function(){
        $scope.fieldIdPrefix="checkout";
        $scope.fieldEntity={
            address:{},
            billingAddress:{},
            shippngAddress:{}
        };
        $scope.fieldInputMode=true;
        me.stage2Error=null;
        if (!$scope.rubedo.current.user){
            me.setCurrentStage(1);
            if (config.userType){
                RubedoUserTypesService.getUserTypeById(config.userType).then(
                    function(response){
                        if (response.data.success){
                            me.parseUserType(response.data.userType);
                            me.useSameAddressForBilling=true;
                            me.useSameAddressForShipping=true;
                        }
                    }
                );
            }
        } else {
            RubedoUsersService.getUserById($scope.rubedo.current.user.id).then(
                function(response){
                    if (response.data.success){
                        me.currentUser=response.data.user;
                        var existingData=angular.copy(me.currentUser.fields);
                        if (angular.element.isEmptyObject(existingData.address)){
                            existingData.address={};
                        }
                        if (angular.element.isEmptyObject(existingData.billingAddress)){
                            existingData.billingAddress={};
                        }
                        if (angular.element.isEmptyObject(existingData.shippngAddress)){
                            existingData.shippngAddress={};
                        }
                        $scope.fieldEntity=existingData;
                        me.parseUserType(me.currentUser.type);
                        me.setCurrentStage(2);
                    }
                }
            );
        }
    };
    me.createUser=function(){
        if ($scope.fieldEntity.confirmPassword!=$scope.fieldEntity.password){
            me.stage2Error="Passwords do not match.";
            return;
        }
        var newUserFields=angular.copy($scope.fieldEntity);
        delete (newUserFields.confirmPassword);
        newUserFields.login=newUserFields.email;
        if (me.useSameAddressForBilling){
            newUserFields.billingAddress=newUserFields.address;
        }
        if (me.useSameAddressForShipping){
            newUserFields.shippingAddress=newUserFields.address;
        }
        RubedoUsersService.createUser(newUserFields,me.userType.id).then(
            function(response){
                if (response.data.success){
                    RubedoAuthService.generateToken({login:newUserFields.login,password:newUserFields.password},me.rememberMe).then(
                        function(authResponse){
                            var mailingListsSuscribe=[];
                            angular.forEach(me.mailingLists, function(mailingList){
                                if(mailingList.checked){
                                    mailingListsSuscribe.push(mailingList.id);
                                }
                            });
                            if (mailingListsSuscribe.length>0){
                                var mloptions = {
                                    mailingLists: mailingListsSuscribe,
                                    email: newUserFields.email
                                };
                                RubedoMailingListService.subscribeToMailingLists(mloptions).then(function(mlresponse){
                                    window.location.reload();
                                },function(mlresponse){
                                    window.location.reload();
                                });
                            } else{
                                window.location.reload();
                            }
                        }
                    );
                }
            },
            function(response){
                me.stage2Error=response.data.message;
            }
        );
    };
    me.refreshShippers=function(){
        RubedoShippersService.getShippers().then(
            function(response){
                me.shippersArray=response.data.shippers;
                me.currentShipper=response.data.shippers[0];
                me.setCurrentStage(me.currentStage+1);
            }
        );
    };
    me.persistUserChanges=function(errorHolder,refreshShippers){
        var payload=angular.copy(me.currentUser);
        payload.fields=angular.copy($scope.fieldEntity);
        delete (payload.type);
        RubedoUsersService.updateUser(payload).then(
            function(response){
                if (refreshShippers){
                    me.refreshShippers();
                } else {
                    me.setCurrentStage(me.currentStage+1);
                }
            },
            function(response){
                me.errorHolder=response.data.message;
            }
        );
    };
    me.handleStage2Submit=function(){
        me.stage2Error=null;
        if (!$scope.rubedo.current.user){
            me.createUser();
        } else {
            me.persistUserChanges(me.stage2Error);
        }
    };

    me.handleStage3Submit=function(){
        me.stage3Error=null;
        me.persistUserChanges(me.stage3Error);
    };

    me.handleStage4Submit=function(){
        me.stage4Error=null;
        me.persistUserChanges(me.stage4Error,true);
    };

    me.handleStage5Submit=function(){
        me.stage5Error=null;
        if (!me.currentShipper){
            me.stage5Error="Please choose a shipper"
        } else {
            me.setCurrentStage(me.currentStage+1);
        }
    };

    me.handleOrderCreate=function(){
        me.orderCreateError=null;
        if (!me.currentPaymentMeans){
            me.orderCreateError="Please choose a payment means";
            return;
        }
        var options={
            paymentMeans:me.currentPaymentMeans.paymentMeans,
            shipperId:me.currentShipper.shipperId,
            shippingComments:me.shippingComments
        };
        RubedoOrdersService.createOrder(options).then(
            function(response){
                if (response.data.success){
                    var myOrderId=response.data.order.id;
                    $location.url(me.orderDetailPageUrl+"?order="+myOrderId);
                    $scope.rubedo.sendGaEvent('/form/', 'order');
                }
            }
        );

    };
    me.mailingLists={};
    RubedoMailingListService.getAllMailingList().then(function(response){
        if(response.data.success){
            angular.forEach(config.mailingListId, function(mailing){
                var newMailing = {};
                angular.forEach(response.data.mailinglists, function(mailingInfo){
                    if(mailingInfo.id == mailing){
                        newMailing.id = mailing;
                        newMailing.name = mailingInfo.name;
                        newMailing.checked = false;
                        me.mailingLists[mailing] = newMailing;
                    }
                });
            });
        }
    });


}]);