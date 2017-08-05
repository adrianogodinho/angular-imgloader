'use strict';

// Declare app level module which depends on views, and components
angular.module('example', ['ngAnimate', 'ImgCache', 'angular-imgloader'])

.controller("Example", function ($scope, $q) {

    $scope.example1 = false;
    $scope.example2 = true;

    var Example1 = function () {

        $scope.exe1 = {
            images: [
                    {imgSrc: 'https://storage.googleapis.com/vivamais-images/1499631515873', text: "Test 1", loadTime : 2000},
                    {imgSrc: 'https://storage.googleapis.com/vivamais-images/1499631521595', text: "Test 2", loadTime : 200},
                    {imgSrc: 'https://storage.googleapis.com/vivamais-images/1499631519467', text: "Test 3", loadTime : 3000},
                    {imgSrc: 'https://storage.googleapis.com/vivamais-images/1499611149844', text: "Test 4", loadTime : 0},
                    {imgSrc: 'https://anywhare.com.br', text: "Test 5"},
                    {imgSrc: 'https://anywhare.com.br', text: "Test 6"}
                ]
         };

    };

    var Example2 = function () {

        var exe2 = {
            images : [
                    { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499631515873',text : "Test 1", loadTime : 2000},
                    { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499631521595',text : "Test 2", loadTime : 200},
                    { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499631519467',text : "Test 3", loadTime : 3000},
                    { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499611149844',text : "Test 4", loadTime : 200},
                    { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499631555546',text : "Test 5", loadTime : 200},
                    { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499609974994',text : "Test 6", loadTime : 200},
                    { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499631582264',text : "Test 7", loadTime : 200},
                    { imgSrc : 'https://anywhare.com.br',text : "Test 5"},
                    { imgSrc : 'https://anywhare.com.br',text : "Test 6"}
                ],
            imgLoaded: 0,
            log: [],
            all_loaded: false
        };

        var imageLoadCallbacks = [];

        $scope.exe2 = exe2;

        var registerCallbacks = function (cb) {
            imageLoadCallbacks.push(cb);
        };

        var fireCallbacks = function (progress) {
            for(var i in imageLoadCallbacks) {
                imageLoadCallbacks[i](progress);
            }
        };

        $scope.onImgLoaded = function (status, url, error) {

            exe2.imgLoaded += 1;

            var logEntry = {
                timestamp: new Date().time,
                status: '',
                object: '',
                error: ''
            };

            logEntry.status = status;
            logEntry.object = url;

            if(angular.isDefined(error)) {
                logEntry.error = error;
            }

            fireCallbacks(exe2.imgLoaded);

            exe2.log.push(logEntry);
        };



        var waitImagesLoaded = function (total) {

            var deferred = $q.defer();

            registerCallbacks(function (progress) {
                if(progress == total) {
                    deferred.resolve();
                }
            });

            return deferred.promise;

        }(exe2.images.length).then(function () {
            $scope.exe2.all_loaded = true;
        });
    };

    Example1();
    Example2();

})

.config(function (ImgCacheProvider, $compileProvider) {

    // or more options at once
    ImgCacheProvider.setOptions({
        debug: true,
        usePersistentCache: true
    });

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|filesystem):/);
});