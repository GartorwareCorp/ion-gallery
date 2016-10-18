# ion-gallery
Ionic gallery with slider

    $ bower install --save https://github.com/GartorwareCorp/ion-gallery.git

# Features

 - Define number of collums to present (1 to 12)
 - Pinch and double tap do zoom on picture

# Usage

Load script and css on the html

    <link href="lib/ion-gallery/dist/ion-gallery.css" rel="stylesheet">
    ...
    <script src="lib/ion-gallery/dist/ion-gallery.min.js"></script>

Add ion-gallery as dependency to your project

    angular
     .module('starter', ['ionic','ion-gallery'])

Add gallery directive with array of photos:

    <ion-gallery ion-gallery-items="items"></ion-gallery>

Data source example

    $scope.items = [
      {
        src:'http://www.wired.com/images_blogs/rawfile/2013/11/offset_WaterHouseMarineImages_62652-2-660x440.jpg',
        sub: 'This is a <b>subtitle</b>'
      },
      {
        src:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg',
        sub: '' /* Not showed */
      },
      {
        src:'http://www.hdwallpapersimages.com/wp-content/uploads/2014/01/Winter-Tiger-Wild-Cat-Images.jpg',
        thumb:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg'
      }
    ]

Thumbnail property is also optional. If no thumbnail, the source content will be used

Subtitle property is optional. If no property present, nothing is showed (Same for empty string).
Supports html tags.

UI will reflect changes on the content object passed to the directive. Example of adding and removing pictures can be seen in the ionic view app.

# Selection mode

ion-gallery can enter in selection mode calling `activateSelectionMode()` on the gallery template. For instance:

```
<img ... on-hold="activateSelectionMode();toggleSelection(item);">
```

When in selection mode you can choose a subset of items to work with.

Selection mode let's you pass an array of actions with this structure:

```
$scope.selectionModeActions = [
            {
                buttonIcon: 'ion-trash-a',
                buttonLabel: 'Delete',
                buttonAction: function (items) {
                    ...
                }
            }
        ];
```

This array can be passed to directive:

```
<ion-gallery ion-gallery-items="items" ion-selection-mode-actions="selectionModeActions"></ion-gallery>
```

This will show a footer with these actions when in selection mode.

- buttonIcon - The icon of the button
- buttonLabel - The label of the button
- buttonAction - Function which receive an array of (selected) items to work with.

# Config

- Via provider:

Default values in example.

```
app.config(function(ionGalleryConfigProvider) {
  ionGalleryConfigProvider.setGalleryConfig({
                          action_label: 'Close',
                          template_gallery: 'gallery.html',
                          template_slider: 'slider.html',
                          toggle: false,
                          row_size: 3,
                          fixed_row_size: true,
                          cancel_label: 'Cancel',
                          elements_selected_label: 'selected',
                          select_all_label: 'Select all',
                          unselect_all_label: 'Unselect all'
  });
});
```

```
Default values
action_label - 'Close' (String)
template_gallery - 'gallery.html' (String)
template_slider - 'slider.html' (String)
toggle - false (Boolean)
row_size - 3 (Int)
fixed_row_size - true (boolean). If true, thumbnails in gallery will always be sized as if there are "row_size" number of images in a row (even if there aren't). If set to false, the row_size will be dynamic until it reaches the set row_size (Ex: if only 1 image it will be rendered in the entire row, if 2 images, both will be rendered in the entire row)
zoom_events - true (Boolean)
cancel_label - 'Cancel' (String)
elements_selected_label - 'selected' (String)
select_all_label - 'Select all' (String)
unselect_all_label - 'Unselect all' (String)
```

# Markup Config

Markup overrides provider definitions

- ion-gallery-row: Defines size of the row. Default to 3 images per row (max 12)

          <ion-gallery ion-gallery-items="items" ion-gallery-row="5"></ion-gallery>

- ion-gallery-toggle: Sets one tap action on slideshow to hide/show subtitles and "Done" button. Default: true

          <ion-gallery ion-gallery-items="items" ion-gallery-toggle="false"></ion-gallery>

- ion-item-action: Overrides the default action when a gallery item is tapped. Default: opens the slider modal

          <ion-gallery ion-gallery-items="items" ion-item-action="itemAction(item)"></ion-gallery>

- ion-zoom-events: Enable/Disable all zoom events in slider (pinchToZoom, tap and double tap). Default: true

          <ion-gallery ion-gallery-items="items" ion-zoom-events="true"></ion-gallery>

- ion-selection-mode-actions: Defines an array of actions to show on footer when selection mode is enabled. Default: null

          <ion-gallery ion-gallery-items="items" ion-selection-mode-actions="selectionModeActions"></ion-gallery>

