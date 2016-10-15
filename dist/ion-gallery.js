(function () {
  'use strict';

  angular
    .module('ion-gallery', ['templates'])
    .directive('ionGallery', ionGallery);

  ionGallery.$inject = ['$ionicPlatform', 'ionGalleryHelper', 'ionGalleryConfig'];

  function ionGallery($ionicPlatform, ionGalleryHelper, ionGalleryConfig) {
    controller.$inject = ["$scope"];
    return {
      restrict: 'AE',
      scope: {
        ionGalleryItems: '=ionGalleryItems',
        ionGalleryRowSize: '=?ionGalleryRow',
        ionItemAction: '&?ionItemAction',
        ionZoomEvents: '=?ionZoomEvents'
      },
      controller: controller,
      link: link,
      replace: true,
      templateUrl: ionGalleryConfig.template_gallery
    };

    function controller($scope) {
      var _rowSize = parseInt($scope.ionGalleryRowSize);

      var _drawGallery = function () {
        $scope.ionGalleryRowSize = ionGalleryHelper.getRowSize(_rowSize || ionGalleryConfig.row_size, $scope.ionGalleryItems.length);
        $scope.actionLabel = ionGalleryConfig.action_label;
        $scope.responsiveGrid = parseInt((1 / $scope.ionGalleryRowSize) * 100);
        ionGalleryHelper.addPositionToImages($scope.ionGalleryItems);
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
      }());

    }

    function link(scope, element, attrs) {
      scope.customItemAction = angular.isFunction(scope.ionItemAction) && attrs.hasOwnProperty('ionItemAction');
      scope.ionSliderToggle = attrs.ionGalleryToggle === 'false' ? false : ionGalleryConfig.toggle;
    }
  }
})();

(function(){
  'use strict';

  angular
    .module('ion-gallery')
    .provider('ionGalleryConfig',ionGalleryConfig);

  ionGalleryConfig.$inject = [];

  function ionGalleryConfig(){
    this.config = {
      action_label: 'Done',
      template_gallery: 'gallery.html',
      template_slider:  'slider.html',
      toggle: true,
      row_size: 3,
      fixed_row_size: true,
      zoom_events: true
    };

    this.$get = function() {
        return this.config;
    };

    this.setGalleryConfig = function(config) {
        angular.extend(this.config, this.config, config);
    };
  }

})();

(function () {
  'use strict';

  angular
    .module('ion-gallery')
    .service('ionGalleryHelper', ionGalleryHelper);

  ionGalleryHelper.$inject = ['ionGalleryConfig'];

  function ionGalleryHelper(ionGalleryConfig) {

    this.getRowSize = function (size, length) {
      var rowSize;

      if (isNaN(size) === true || size <= 0) {
        rowSize = ionGalleryConfig.row_size;
      }
      else if (size > length && !ionGalleryConfig.fixed_row_size) {
        rowSize = length;
      }
      else {
        rowSize = size;
      }

      return rowSize;

    };

    this.buildGallery = function (items, rowSize) {
      var _gallery = [];
      var row = -1;
      var col = 0;

      for (var i = 0; i < items.length; i++) {

        if (i % rowSize === 0) {
          row++;
          _gallery[row] = [];
          col = 0;
        }

        items[i].position = i;

        _gallery[row][col] = items[i];
        col++;
      }

      return _gallery;
    };

    this.addPositionToImages = function (items) {
      for (var i = 0; i < items.length; i++) {
        items[i].position = i;
      }
    };
    
  }
})();

(function(){
  'use strict';

  angular
    .module('ion-gallery')
    .directive('ionImageScale',ionImageScale);

  ionImageScale.$inject = [];

  function ionImageScale(){
    
    return {
      restrict: 'A',
      link : link
    };

    function link(scope, element, attrs) {
      
      var scaleImage = function(context,value) {
        if(value>0){
          if(context.naturalHeight >= context.naturalWidth){
            element.attr('width','100%');
          }
          else{
            element.attr('height',element.parent()[0].offsetHeight+'px');
          }
        } 
      };
      
      element.bind("load" , function(e){
        var _this = this;
        if(element.parent()[0].offsetHeight > 0){
          scaleImage(this,element.parent()[0].offsetHeight);
        }
        
        scope.$watch(function(){
          return element.parent()[0].offsetHeight;
        },function(newValue){
          scaleImage(_this,newValue);
        });
      });
    }
  }
})();
(function(){
  'use strict';

  angular
    .module('ion-gallery')
    .directive('ionRowHeight',ionRowHeight);

  ionRowHeight.$inject = ['ionGalleryConfig'];

  function ionRowHeight(ionGalleryConfig){
    
    return {
      restrict: 'A',
      link : link
    };

    function link(scope, element, attrs) {
      scope.$watch( 
        function(){
          return scope.ionGalleryRowSize;
        },
        function(newValue,oldValue){
          if(newValue > 0){
            element.css('height',element[0].offsetWidth * parseInt(scope.responsiveGrid)/100 + 'px');
          }
        });
    }
  }
})();
(function(){
  'use strict';

  angular
    .module('ion-gallery')
    .directive('ionSlideAction',ionSlideAction);

  ionSlideAction.$inject = ['$ionicGesture','$timeout'];

  function ionSlideAction($ionicGesture, $timeout){

    return {
      restrict: 'A',
      link : link
    };

    function link(scope, element, attrs) {
      var isDoubleTapAction = false;

      var pinchZoom = function pinchZoom(){
          scope.$emit('ZoomStarted');
      };

      var imageDoubleTapGesture = function imageDoubleTapGesture(event) {

        isDoubleTapAction = true;

        $timeout(function(){
          isDoubleTapAction = false;
          scope.$emit('DoubleTapEvent',{ 'x': event.gesture.touches[0].pageX, 'y': event.gesture.touches[0].pageY});
        },200);
      };

      var imageTapGesture = function imageTapGesture(event) {

        if(isDoubleTapAction === true){
          return;
        }
        else{
          $timeout(function(){
            if(isDoubleTapAction === true){
              return;
            }
            else{
              scope.$emit('TapEvent');
            }
          },200);
        }
      };

      var pinchEvent = $ionicGesture.on('pinch',pinchZoom,element);
      var doubleTapEvent = $ionicGesture.on('doubletap', function(e){imageDoubleTapGesture(e);}, element);
      var tapEvent = $ionicGesture.on('tap', imageTapGesture, element);

      scope.$on('$destroy', function() {
        $ionicGesture.off(doubleTapEvent, 'doubletap', imageDoubleTapGesture);
        $ionicGesture.off(tapEvent, 'tap', imageTapGesture);
        $ionicGesture.off(pinchEvent, 'pinch', pinchZoom);
      });
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('ion-gallery')
    .directive('ionSlider', ionSlider);

  ionSlider.$inject = ['$ionicModal', '$timeout', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'ionSliderHelper', 'ionGalleryConfig'];

  function ionSlider($ionicModal, $timeout, $ionicScrollDelegate, $ionicSlideBoxDelegate, ionSliderHelper, ionGalleryConfig) {

    controller.$inject = ["$scope"];
    return {
      restrict: 'A',
      controller: controller,
      link: link
    };

    function controller($scope) {
      var lastSlideIndex;
      var currentImage;

      var rowSize = $scope.ionGalleryRowSize;
      var zoomStart = false;

      $scope.selectedSlide = 1;
      $scope.hideAll = false;
      $scope.ionZoomEvents = ionSliderHelper.setZoomEvents($scope.ionZoomEvents)

      $scope.openSlider = function (index) {
        $scope.slides = [];
        currentImage = index;

        var galleryLength = $scope.ionGalleryItems.length;
        var previndex = index - 1 < 0 ? galleryLength - 1 : index - 1;
        var nextindex = index + 1 >= galleryLength ? 0 : index + 1;

        $scope.slides[0] = $scope.ionGalleryItems[previndex];
        $scope.slides[1] = $scope.ionGalleryItems[index];
        $scope.slides[2] = $scope.ionGalleryItems[nextindex];

        lastSlideIndex = 1;
        $ionicSlideBoxDelegate.slide(1);
        $scope.openModal();
      };

      $scope.slideChanged = function (currentSlideIndex) {

        if (currentSlideIndex === lastSlideIndex) {
          return;
        }

        var slideToLoad = $scope.slides.length - lastSlideIndex - currentSlideIndex;
        var galleryLength = $scope.ionGalleryItems.length;
        var imageToLoad;
        var slidePosition = lastSlideIndex + '>' + currentSlideIndex;

        if (slidePosition === '0>1' || slidePosition === '1>2' || slidePosition === '2>0') {
          currentImage++;

          if (currentImage >= galleryLength) {
            currentImage = 0;
          }

          imageToLoad = currentImage + 1;

          if (imageToLoad >= galleryLength) {
            imageToLoad = 0;
          }
        }
        else if (slidePosition === '0>2' || slidePosition === '1>0' || slidePosition === '2>1') {
          currentImage--;

          if (currentImage < 0) {
            currentImage = galleryLength - 1;
          }

          imageToLoad = currentImage - 1;

          if (imageToLoad < 0) {
            imageToLoad = galleryLength - 1;
          }
        }

        if ($scope.ionZoomEvents === true) {
          //Clear zoom
          $ionicScrollDelegate.$getByHandle('slide-' + slideToLoad).zoomTo(1);
        }

        $scope.slides[slideToLoad] = $scope.ionGalleryItems[imageToLoad];

        lastSlideIndex = currentSlideIndex;
      };

      var _zoomStart = function () {
        zoomStart = true;
        $scope.hideAll = true;
        $ionicSlideBoxDelegate.enableSlide(false);
      };

      var _zoomEnd = function () {
        zoomStart = false;
        $scope.hideAll = false;
        $ionicSlideBoxDelegate.enableSlide(true);
      };

      $scope.$on('ZoomStarted', function (e) {
        $timeout(function () {
          _zoomStart();
        });

      });

      $scope.$on('TapEvent', function (e) {
        $timeout(function () {
          _onTap();
        });

      });

      $scope.$on('DoubleTapEvent', function (event, position) {
        $timeout(function () {
          _onDoubleTap(position);
        });

      });

      var _onTap = function _onTap() {
        if (zoomStart === true) {
          if ($scope.ionZoomEvents === true) {
            $ionicScrollDelegate.$getByHandle('slide-' + lastSlideIndex).zoomTo(1, true);
          }

          _zoomEnd();

          return;
        }

        if (($scope.hasOwnProperty('ionSliderToggle') && $scope.ionSliderToggle === false && $scope.hideAll === false) || zoomStart === true) {
          return;
        }

        $scope.hideAll = !$scope.hideAll;
      };

      var _onDoubleTap = function _onDoubleTap(position) {
        if (zoomStart === false) {
          if ($scope.ionZoomEvents === true) {
            $ionicScrollDelegate.$getByHandle('slide-' + lastSlideIndex).zoomTo(3, true, position.x, position.y);
          }

          _zoomStart();
        }
        else {
          _onTap();
        }
      };

    }

    function link(scope, element, attrs) {
      var _modal;

      $ionicModal.fromTemplateUrl(ionGalleryConfig.template_slider, {
        scope: scope,
        animation: 'fade-in'
      }).then(function (modal) {
        _modal = modal;
      });

      scope.openModal = function () {
        _modal.show();
      };

      scope.closeModal = function () {
        _modal.hide();
      };

      scope.$on('$destroy', function () {
        try {
          _modal.remove();
        } catch (err) {
          console.log(err.message);
        }
      });
    }
  }
})();

(function(){
  'use strict';

  angular
    .module('ion-gallery')
    .service('ionSliderHelper',ionSliderHelper);

  ionSliderHelper.$inject = ['ionGalleryConfig'];

  function ionSliderHelper(ionGalleryConfig) {

    this.setZoomEvents = function setZoomEvents(zoomEvents){
      if (zoomEvents === false){
        ionGalleryConfig.zoom_events = false;
      }

      return ionGalleryConfig.zoom_events;
    }

  }
})();

angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("gallery.html","<div class=\"gallery-view\">\r\n\r\n	<div class=\"row unlimited-items\" ng-class=\"\'row-size-\' + ionGalleryRowSize\" ion-row-height>\r\n		<div class=\"col col-{{responsiveGrid}}\" ng-repeat=\"item in ionGalleryItems track by $index\">\r\n			<img ion-image-scale ng-src=\"{{item.thumb || item.src}}\" ng-click=\"customItemAction ? ionItemAction({item: item}) : openSlider(item.position)\">\r\n		</div>\r\n	</div>\r\n\r\n	<div ion-slider></div>\r\n</div>");
$templateCache.put("slider.html","<ion-modal-view class=\"imageView\">\r\n  <ion-header-bar class=\"headerView\" ng-show=\"!hideAll\">\r\n    <button class=\"button button-outline button-light close-btn\" ng-click=\"closeModal()\">{{::actionLabel}}</button>\r\n  </ion-header-bar>\r\n\r\n  <ion-content class=\"has-no-header\" scroll=\"false\">\r\n    <ion-slide-box does-continue=\"true\" active-slide=\"selectedSlide\" show-pager=\"false\" class=\"listContainer\" on-slide-changed=\"slideChanged($index)\">\r\n      <ion-slide ng-repeat=\"single in slides track by $index\">\r\n        <ion-scroll direction=\"xy\"\r\n                    locking=\"false\"\r\n                    zooming=\"{{ionZoomEvents}}\"\r\n                    min-zoom=\"1\"\r\n                    scrollbar-x=\"false\"\r\n                    scrollbar-y=\"false\"\r\n                    ion-slide-action\r\n                    delegate-handle=\"slide-{{$index}}\"\r\n                    overflow-scroll=\"false\"\r\n                    >\r\n        <div class=\"item item-image gallery-slide-view\">\r\n          <img ng-src=\"{{single.src}}\">\r\n        </div>\r\n        <div ng-if=\"single.sub && single.sub.length > 0\" class=\"image-subtitle\" ng-show=\"!hideAll\">\r\n            <span ng-bind-html=\'single.sub\'></span>\r\n        </div>\r\n        </ion-scroll>\r\n      </ion-slide>\r\n    </ion-slide-box>\r\n  </ion-content>\r\n</ion-modal-view>\r\n");}]);