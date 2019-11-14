angular.module("rubedoBlocks").lazy.controller('uploadXlsController',['$scope', '$http', 'RubedoPagesService', 'RubedoContentsService', 'RubedoOrdersService',
function($scope, $http, RubedoPagesService, RubedoContentsService, RubedoOrdersService){
    console.log("UploadXlsController")

    $scope.workbook = null;
    $scope.logs = [];

    $scope.uploadXLS = function() {
        let f = document.getElementById('file').files[0],
        r = new FileReader();

        r.onload = function () {
            window.result = r.result;
            let wb = XLSX.read(r.result, {type:"array"});
            window.workbook = wb;
            window.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            $scope.onesime_pns = window.data;

            // we get netforgod PN list
            window.rubedoContents = RubedoContentsService;
            updatePNs($scope.onesime_pns);
        }
        
        r.readAsArrayBuffer(f);
    }
    
    async function updatePNs(onesime_pns) {
        // the id below is the id of the Rubedo Query called "Points Net", it returns all Points Net in Rubedo
        let rubedo_pns = await RubedoContentsService.getContents("5dcdbf568e707529379d34b1",null,null,{limit:20000});
        if (rubedo_pns.status != 200) return log("error", rubedo_pns);
        if (!rubedo_pns.data.success) return log("error", rubedo_pns);
        rubedo_pns = rubedo_pns.data.contents;

        let o_pn = onesime_pns[0];
        log('info', `updating PN ${o_pn['Code PN']}`);
        let r_pn = rubedo_pns.filter(pn => pn.fields.pointNetId == o_pn['Code PN']);
        if (r_pn.length == 0) {
            log('info', `PN ${o_pn['Code PN']} does not exist yet`);
        } else if (r_pn.length > 1) {
            log('warning', `There are ${r_pn.length} PN with the code ${o_pn['Code PN']}. All will be updated`);
        } else {
            
        }
        console.log(o_pn, r_pn);
    }

    function log(level, data) {
        level = level.toLowerCase();
        let data_s = (typeof data == 'string') ? data: JSON.stringify(data);
        $scope.logs.push({level, msg: data_s});
        if (level == "error" || level == "err") console.error(data);
        else if (level == "warning" || level == 'warn') console.warn(data);
        else console.log(data);
    }
}]);