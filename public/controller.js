var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.s3Url = 'https://s3-<your-region>.amazonaws.com/<your-bucketName>/';
    $scope.loading = true;
    getImages();
    function getImages () {
        $http.get('/api/images').then(function(res){
            $scope.allImages = res.data.Contents;
            $scope.loading = false;
        });
    }
});