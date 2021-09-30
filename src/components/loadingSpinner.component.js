(function () {
  'use strict';
  
  angular.module('OPCLinksReplaceApp')
  .component('loadingSpinner', {
    templateUrl: 'src/components/loadingSpinner.component.html',
    controller: SpinnerController
  });
    
  SpinnerController.$inject = ['$rootScope']
  function SpinnerController($rootScope) {
      var controller = this;
      
      var cancelListener = $rootScope.$on('Spinner:on', function (event, data) {

      
        if (data.on) {
          controller.showSpinner = true;
        }
        else {
          controller.showSpinner = false;
        }
      });
      
      controller.$onDestroy = function () {
        cancelListener();
      };

      controller.returnReplacedTagsAmount = function(){
        return $rootScope.replacedTagsAmount;
    }
  };

  })();