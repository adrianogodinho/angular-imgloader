'use strict';

angular.module('angular-imgloader', [])

.directive("ilImg", function ($log, $timeout, ImgCache) {

    var ImageLoader = function (scope) {

        var _scope = scope;

        var _onLoadError = function (err) {
            _scope.$apply(function () {
                $log.log(err);
                _scope.state = "ERROR";
            });
        };

        var _displayImage = function (url, cachedUrl) {

            var updateUi = function () {
                _scope.$apply(function () {
                    _scope.actualImageSrc = cachedUrl;
                    _scope.state = "LOADED";
                });
            };

            if(angular.isDefined(_scope.minLoadingTime) && angular.isNumber(_scope.minLoadingTime) && _scope.minLoadingTime > 0) {
                $timeout(updateUi, _scope.minLoadingTime, false);

            } else {
                updateUi();
            }
        };

        var _getImageFromCache = function (imageUrl) {
            ImgCache.getCachedFileURL(imageUrl, _displayImage, _onLoadError);
        };

        var _downloadImage = function (scope, imageUrl) {
            ImgCache.cacheFile(imageUrl, _displayImage, _onLoadError);
        };

        var _updateImage = function(imageUrl) {

            _scope.state = "LOADING";

            ImgCache.isCached(imageUrl,
                //If image is cached
                _getImageFromCache,

                //If image is not cached
                _downloadImage
            );
        };

        var _addListeners = function() {
            _scope.$watch("imgSrc",function(newValue,oldValue) {

                if(newValue === oldValue) return;

                //This gets called when data changes.
                _updateImage(newValue);
            });
        };

        var _checkPlaceholders = function () {
            if(angular.isUndefined(_scope.placeholderSrc) || _scope.placeholderSrc === "" || _scope.placeholderSrc == null) {
                _scope.placeholderSrc = "../default_placeholders/image_placeholder_spinning.gif";
            }

            if(angular.isUndefined(_scope.placeholderTemplate) || _scope.placeholderTemplate === "" || _scope.placeholderTemplate == null) {
                _scope.placeholderTemplate = "../default_placeholders/default-placeholder-template.html";
            }

            if(angular.isUndefined(_scope.errorPlaceholderSrc) || _scope.errorPlaceholderSrc === "" || _scope.errorPlaceholderSrc == null) {
                _scope.errorPlaceholderSrc = "../default_placeholders/image_error_placeholder.svg";
            }

            if(angular.isUndefined(_scope.errorPlaceholderTemplate) || _scope.errorPlaceholderTemplate === "" || _scope.errorPlaceholderTemplate == null) {

                if(_scope.errorPlaceholderSrc.endsWith(".svg")) {
                    _scope.errorPlaceholderTemplate = "../default_placeholders/default-error-placeholder-template-svg.html";
                } else {
                    _scope.errorPlaceholderTemplate = "../default_placeholders/default-error-placeholder-template.html";
                }

            }
        };

        var _init = function () {

            _scope.displayedImage = '';

            //Check if there is a valid placeholder, otherwise use a default one.
            _checkPlaceholders();

            //Add listener to directive params.
            _addListeners();

            //Check if image is cached and load it if necessary
            _updateImage(_scope.imgSrc);
        };

        return {
            init : function () {
                _init();
            }
        }

    };


    return {
        restrict: 'E',
        scope: {
            imgSrc: "=ilSrc",
            onloaded: "=?ilOnload",
            placeholderSrc: "=?ilPlaceholderSrc",
            placeholderTemplate: "=?ilPlaceholderTemplate",
            errorPlaceholderSrc: "=?ilErrorPlaceholderSrc",
            errorPlaceholderTemplate: "=?ilErrorPlaceholderTemplate",
            minLoadingTime: "=?ilMinTime"
        },

        templateUrl: '../templates/angular-imgloader-template.html',

        link: function (scope, element, attrs) {

            scope.imageLoader = ImageLoader(scope);

            ImgCache.$deferred.promise.then(function () {
                scope.imageLoader.init();
            });
        }
    }

});

