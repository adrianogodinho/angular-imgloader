'use strict';

var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src.replace('js/angular-imgloader.js','');

angular.module('angular-imgloader', [])
.directive("ilImg", function ($log, $timeout, ImgCache) {

    var getAppPath = function (modulePath) {
        return currentScriptPath + modulePath;
    };

    var TEMPLATE_PATH = getAppPath('templates/angular-imgloader-template.html');
    var LOAD_PLACEHOLDER_IMAGE = getAppPath("default_placeholders/image_placeholder_spinning.gif");
    var LOAD_PLACEHOLDER_TEMPLATE = getAppPath("default_placeholders/default-placeholder-template.html");
    var ERROR_PLACEHOLDER_IMAGE = getAppPath("default_placeholders/image_error_placeholder.svg");
    var ERROR_PLACEHOLDER_TEMPLATE = getAppPath("default_placeholders/default-error-placeholder-template.html");
    var ERROR_PLACEHOLDER_SVG_TEMPLATE = getAppPath("default_placeholders/default-error-placeholder-template-svg.html");

    var ImageLoader = function (scope) {

        var _scope = scope;

        var _fireLoadedEvent = function (state, url, err) {
            if(angular.isDefined(_scope.onloaded) && angular.isFunction(_scope.onloaded)) {
                _scope.onloaded(state, url, err);
            }
        };

        var _onLoadError = function (err) {
            _scope.$apply(function () {

                $log.log(err);
                _scope.state = "ERROR";

                _fireLoadedEvent(_scope.state, _scope.imgSrc, err);
            });
        };

        var _displayImage = function (url, cachedUrl) {

            var updateUi = function () {
                _scope.$apply(function () {
                    _scope.actualImageSrc = cachedUrl;
                    _scope.state = "LOADED";

                    _fireLoadedEvent(_scope.state, url, '');
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

        var _downloadImage = function (imageUrl) {
            ImgCache.cacheFile(imageUrl, _getImageFromCache, _onLoadError);
        };

        var _updateImage = function(imageUrl) {

            _scope.state = "LOADING";

            ImgCache.isCached(imageUrl,
                function (path, success) {
                    if(success) {
                        //If image is cached
                        _getImageFromCache(path);
                    } else{
                        //If image is not cached
                        _downloadImage(imageUrl);
                    }
                }
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

            var noPlaceholder = false;

            if(angular.isDefined(_scope.ignorePlaceholder)) {
                noPlaceholder =  _scope.ignorePlaceholder;
            }

            if(noPlaceholder) {
                return;
            }

            if(angular.isUndefined(_scope.placeholderSrc) || _scope.placeholderSrc === "" || _scope.placeholderSrc == null) {
                _scope.placeholderSrc = LOAD_PLACEHOLDER_IMAGE;
            }

            if(angular.isUndefined(_scope.placeholderTemplate) || _scope.placeholderTemplate === "" || _scope.placeholderTemplate == null) {
                _scope.placeholderTemplate = LOAD_PLACEHOLDER_TEMPLATE;
            }

            if(angular.isUndefined(_scope.errorPlaceholderSrc) || _scope.errorPlaceholderSrc === "" || _scope.errorPlaceholderSrc == null) {
                _scope.errorPlaceholderSrc = ERROR_PLACEHOLDER_IMAGE;
            }

            if(angular.isUndefined(_scope.errorPlaceholderTemplate) || _scope.errorPlaceholderTemplate === "" || _scope.errorPlaceholderTemplate == null) {

                if(_scope.errorPlaceholderSrc.endsWith(".svg")) {
                    _scope.errorPlaceholderTemplate = ERROR_PLACEHOLDER_SVG_TEMPLATE;
                } else {
                    _scope.errorPlaceholderTemplate = ERROR_PLACEHOLDER_TEMPLATE;
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
            minLoadingTime: "=?ilMinTime",
            ignorePlaceholder: "=?ilNoPlacehoder"
        },

        //TODO use grunt-html2js
        templateUrl: TEMPLATE_PATH,

        link: function (scope, element, attrs) {

            scope.imageLoader = ImageLoader(scope);

            ImgCache.$deferred.promise.then(function () {
                scope.imageLoader.init();
            });
        }
    }
});

