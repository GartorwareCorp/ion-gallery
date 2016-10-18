(function () {
  'use strict';

  angular
    .module('ion-gallery')
    .provider('ionGalleryConfig', ionGalleryConfig);

  ionGalleryConfig.$inject = [];

  function ionGalleryConfig() {
    this.config = {
      action_label: 'Done',
      template_gallery: 'gallery.html',
      template_slider: 'slider.html',
      toggle: true,
      row_size: 3,
      fixed_row_size: true,
      zoom_events: true,
      cancel_label: 'Cancel',
      elements_selected_label: 'selected',
      select_all_label: 'Select all',
      unselect_all_label: 'Unselect all'
    };

    this.$get = function () {
      return this.config;
    };

    this.setGalleryConfig = function (config) {
      angular.extend(this.config, this.config, config);
    };
  }

})();
