'use strict';

// Declare app level module which depends on views, and components
angular.module('example', ['ImgCache', 'angular-imgloader'])

.controller("Example", function ($scope) {

    $scope.initiated = false;

    $scope.model = [
        { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499631515873',text : "Test 1"},
        { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499631521595',text : "Test 2"},
        { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499631519467',text : "Test 3"},
        { imgSrc : 'https://storage.googleapis.com/vivamais-images/1499611149844',text : "Test 4"},
        { imgSrc : 'https://anywhare.com.br',text : "Test 5"},
        { imgSrc : 'https://anywhare.com.br',text : "Test 6"},
    ];
})

.config(function (ImgCacheProvider, $compileProvider) {

    // or more options at once
    ImgCacheProvider.setOptions({
        debug: true,
        usePersistentCache: true
    });

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|filesystem):/);
});