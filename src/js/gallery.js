(function () {
  'use strict';

  angular
    .module('ion-gallery', ['templates'])
    .directive('ionGallery', ionGallery);

  ionGallery.$inject = ['$ionicPlatform', 'ionGalleryHelper', 'ionGalleryConfig'];

  function ionGallery($ionicPlatform, ionGalleryHelper, ionGalleryConfig) {
    return {
      restrict: 'AE',
      scope: {
        ionGalleryItems: '=ionGalleryItems',
        ionGalleryRowSize: '=?ionGalleryRow',
        ionItemAction: '&?ionItemAction',
        ionZoomEvents: '=?ionZoomEvents',
        ionSelectionModeActions: '=ionSelectionModeActions'
      },
      controller: controller,
      link: link,
      replace: true,
      templateUrl: ionGalleryConfig.template_gallery
    };

    function controller($scope) {
      var _rowSize = parseInt($scope.ionGalleryRowSize);
      $scope.ionSelectionMode = false;

      var _drawGallery = function () {
        $scope.ionGalleryRowSize = ionGalleryHelper.getRowSize(_rowSize || ionGalleryConfig.row_size, $scope.ionGalleryItems.length);
        $scope.actionLabel = ionGalleryConfig.action_label;
        $scope.responsiveGrid = parseInt((1 / $scope.ionGalleryRowSize) * 100);
        ionGalleryHelper.addPositionToImages($scope.ionGalleryItems);
        $scope.ionGallerySelectedItems = [];
        $scope.cancelLabel = ionGalleryConfig.cancel_label;
        $scope.elementsSelectedLabel = ionGalleryConfig.elements_selected_label;
        $scope.selectAllLabel = ionGalleryConfig.select_all_label;
        $scope.unselectAllLabel = ionGalleryConfig.unselect_all_label;
      };

      _drawGallery();

      (function () {
        $scope.$watch(function () {
          return $scope.ionGalleryItems.length;
        }, function (newVal, oldVal) {
          if (newVal !== oldVal) {
            _drawGallery();
          }
        });
      } ());

      $scope.activateSelectionMode = function () {
        if (!$scope.ionSelectionMode) {
          $scope.unselectAll();
          $scope.ionSelectionMode = true;
        }
      };

      $scope.cancelSelectionMode = function () {
        $scope.unselectAll();
        $scope.ionSelectionMode = false;
      };

      $scope.toggleSelection = function (item) {
        ionGalleryHelper.toggleItemSelection(item, $scope.ionGallerySelectedItems);
      };

      $scope.selectAll = function () {
        ionGalleryHelper.selectAllItems($scope.ionGalleryItems, $scope.ionGallerySelectedItems);
      };

      $scope.unselectAll = function () {
        ionGalleryHelper.unselectAllItems($scope.ionGalleryItems, $scope.ionGallerySelectedItems);
      };

    }

    function link(scope, element, attrs) {
      scope.customItemAction = angular.isFunction(scope.ionItemAction) && attrs.hasOwnProperty('ionItemAction');
      scope.ionSliderToggle = attrs.ionGalleryToggle === 'false' ? false : ionGalleryConfig.toggle;
    }
  }
})();
