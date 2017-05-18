 angular.module('rubedoFields').filter('firstword', function() {
        return function(input, splitIndex) {
            // do some bounds checking here to ensure it has that index

												if (!splitIndex) {
																						 return input.split(" ")[0];
												}
												else return input.split(' ').slice(1).join(' ');
        }
    });

angular.module("rubedoBlocks").lazy.controller("AscensorController",["$scope",function($scope){
											var me=this;
											var targetElSelector="#ascensorBuilding";
											angular.element(targetElSelector).css( "visibility", "hidden" );
											setTimeout(function(){me.initAscensor();},100);
											me.initAscensor = function(){
																						angular.element(targetElSelector).css("visibility", "visible");
																						var options={
																																	direction: [[0,0],[0,1],[1,0],[1,1]],
																																	time: 1900,
																																	 easing: 'easeInOutCubic',
																																		touchSwipeIntegration: true,
																																		ascensorFloorName: ['Accueil','PourQuoi-PourQui-ParQui','Contact','Foyers']
																						};
																						angular.element(targetElSelector).ascensor(options);
											}
											
        
}]);
/*

<script>
    			$(document).ready(function(){ 
    			     $('#ascensorBuilding').hide();

    			    setTimeout(function(){ 
    			        var ascensor = $('#ascensorBuilding').ascensor({direction: [[0,0],[0,1],[1,0],[1,1]],
															time: 1900, easing: 'easeInOutCubic',
															touchSwipeIntegration: true,
															ascensorFloorName: ['Accueil','PourQuoi-PourQui-ParQui','Contact','Foyers']
															});
						$('#ascensorBuilding').show();
						var floorAdded = false;
            			$(".add-floor").click(function(){
            				if(!floorAdded){
            				$('#ascensorBuilding').append('<div class="floor-8">This floor has been dynamically appended!</div>');
            				ascensor.trigger("refresh");
            				$(this).text("Floor Added!");
            				floorAdded = true;
            				}
            			});
            				
            			$(".links-to-floor li").click(function(event, index) {
            				ascensor.trigger("scrollToStage", $(this).index());
            			});
            			
            			$(".links-to-floor li:eq("+ ascensor.data("current-floor") +")").addClass("selected");
            
            			ascensor.on("scrollStart", function(event, floor){
            				$(".links-to-floor li").removeClass("selected");
            				$(".links-to-floor li:eq("+floor.to+")").addClass("selected");
            			});
            	
            			$(".prev").click(function() {
            				ascensor.trigger("prev");
            			});
            				
            			$(".next").click(function() {
            				ascensor.trigger("next");
            			});
            				
            			$(".up").click(function() {
            				ascensor.trigger("scrollToDirection" ,"up");
            			});
            				
            			$(".down").click(function() {
            				ascensor.trigger("scrollToDirection" ,"down");
            			});
            				
            			$(".left").click(function() {
            				ascensor.trigger("scrollToDirection" ,"left");
            			});
            				
            			$(".right").click(function() {
            				ascensor.trigger("scrollToDirection" ,"right");
            			});	
														
    			       
    			        }, 500);

			
				
			
			})
</script>*/