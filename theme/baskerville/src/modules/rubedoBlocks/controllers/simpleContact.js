angular.module("rubedoBlocks").lazy.controller('ContactBlockController',['$scope','$location','RubedoMailService',function($scope,$location,RubedoMailService){
    var me = this;
    var config = $scope.blockConfig;
    me.contactData={ };
    me.contactError=null;
    $scope.clearORPlaceholderHeight();
    me.submit=function($scope){
        me.contactError=null;
        var contactSnap=angular.copy(me.contactData);
        var sujet = contactSnap.subject?contactSnap.subject : "Demande de prestation";
        var payload={
            to:config.email,
            from:me.contactData.email,
            subject:sujet
        };
        /*var destinataires = {'Nicolas':'nicolas.rhone@gmail.com' ,'Nicolas Rhoné':'nicolas.rhone@wanadoo.fr' }*/
        delete (contactSnap.subject);
        delete (contactSnap.to);
        payload.fields=contactSnap;
        angular.element('#myModal').modal('hide');
        payload.fields["website"] = $location.absUrl();
        RubedoMailService.sendMail(payload).then(
            function(response){
                if (response.data.success){
                    me.contactData={ };
                    me.showForm=false;
                    me.showConfirmMessage=true;
                } else {
                    me.contactError=response.data.message;
                }
            },
            function(response){
                me.contactError=response.data.message;
            }
        );
    };
}]);