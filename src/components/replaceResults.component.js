(function () {
  'use strict';
    
  angular.module('OPCLinksReplaceApp')
  .component('replaceResults', {
      templateUrl: 'src/components/replaceResults.component.html',
      controller: ReplaceResultsController
  });
    
  ReplaceResultsController.$inject = ['$element', '$rootScope']
  function ReplaceResultsController($element, $rootScope) {
    var $ctrl = this;

    $ctrl.$onInit = function () {
        ;
    };

    $ctrl.returnReplacedTagsAmount = function(){
        return $rootScope.replacedTagsAmount;
    }
    
    var cancelListener = $rootScope.$on('Spinner:on', function (event, data) {

    
      if (data.on) {
        $ctrl.showSpinner = true;
        var warningElem = $element.find('div.error');
        warningElem.slideDown(5000);


      }
      else {
        $ctrl.showSpinner = false;

        var warningElem = $element.find('div.error');
        warningElem.slideUp(5000);
          
          

      }
    });
    
    $ctrl.$onDestroy = function () {
      cancelListener();
    };
  }
})();