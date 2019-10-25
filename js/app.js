/**
 * Created by user on 23/10/2016.
 */
var myapp = angular.module('demoMongo',[]);
myapp.run(function ($http) {
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.post['dataType'] = 'json'
});


myapp.controller('gethistory',function($scope,$http){
    var url=window.location.href;
    var userName=(url.substring(url.indexOf("?")+1,url.length)).replace("%20"," ");
    console.log("It is angular get profile !!!!!!!!!!!"+localStorage.getItem("userid123"));
    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }
    // // var req = $http.get('http://127.0.0.1:8081/getData');
    $http.get('http://127.0.0.1:8081/getHistoryData?keywords='+localStorage.getItem("userid123")).then(function(d)
        {
            // console.log("document is ok"+document);
            console.log("val "+JSON.stringify({d: d}));
            var document=[];
            var fromDate;
            var toDate;
            var budget;
            var interest;
            var no_of_days1;
            for (i=0;i<d.data.length;i++)
            {
                if(d.data[i].from)
                {
                    fromDate = d.data[i].from.substring(0,10);
                }
                else {
                    fromDate = "";
                }

                if(d.data[i].to)
                {
                    console.log("It is ",typeof(d.data[i].to))
                    toDate = d.data[i].to.substring(0,10);
                }
                else {
                    toDate = "";
                }

                if(d.data[i].budget)
                {
                    budget = d.data[i].budget;
                }
                else {
                    budget = "";
                }
                if(d.data[i].numDays)
                {
                    no_of_days1 = d.data[i].numDays;
                }
                else {
                    no_of_days1 = "";
                }

                if(d.data[i].interest.toString() =="Select")
                {
                    interest = 'All';
                }
                else
                {
                    interest = d.data[i].interest;
                }



                document.push(new Array(i+1+'^^^'+d.data[i].username+'!!!'+d.data[i].destination+'@@@'+no_of_days1+'###'+budget+'%%%'+interest));
            }

            $scope.fullDocument =[];
            for(var x=0;x<document.length;x++) {
                var val= document[x];
                console.log('Data is '+document[x]);
                $scope.fullDocument.push(val.toString());
            }

        },function(err)
        {
            console.log(err);
        }
    )

});


myapp.controller('getprofile',function($scope,$http){
    console.log("It is angular get profile !!!!!!!!!!!"+localStorage.getItem("userid123"));
    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }
    // // var req = $http.get('http://127.0.0.1:8081/getData');
    $http.get('http://127.0.0.1:8081/getData?keywords='+localStorage.getItem("userid123")).then(function(d)
        {
            console.log("document is ok"+document);
            console.log("val "+JSON.stringify({d: d}));
            console.log("Before "+$scope.zzzname);
            $scope.zzzname= d.data[0].firstname;
            $scope.lname= d.data[0].lastname;
            $scope.uname= d.data[0].username;
            $scope.phone= d.data[0].mobileNumber;
            console.log("After "+d.data[0].phone);
            // $window.location.href = 'profile.html';
        },function(err)
        {
            console.log(err);
        }
    )

    $scope.updatedoc = function() {
        // var url=window.location.href;
        // var userName=(url.substr(53)).replace("%20"," ");
        console.log("It is angular get profile !!!!!!!!!!!"+localStorage.getItem("userid123"));
        $http.get('http://127.0.0.1:8081/updateData?keywords='+localStorage.getItem("userid123")+'@@@'+$scope.phone).success(function(d)
            {
                console.log("Updated");
                // $window.location.href = 'profile.html?'+'userName';
            },function(err)
            {
                console.log(err);
            }
        )
    };

});

myapp.controller('MongoRestController',function($scope,$http,$window){

    $scope.focusfn = function () {
        $scope.focus = true;
        $scope.alreadyExists="";
    };


    // $scope.unamefocusfn = function () {
    //     $scope.focus = true;
    //     $scope.finalErr="";
    // };
    // $scope.passfocusfn = function () {
    //     $scope.focus = true;
    //     $scope.finalErr="";
    // };
    // $scope.confirmpassfocusfn = function () {
    //     $scope.focus = true;
    //     $scope.finalErr="";
    // };

    $scope.blurfn = function () {
        $scope.focus = false;

        $http.get('http://127.0.0.1:8081/getData?keywords='+$scope.uname).then(function(d)
            {
                console.log("Len is already present"+d.data.length);
                console.log("val already present"+JSON.stringify({d: d}));
                if(d.data.length!=0) {
                    console.log("it is already present" + d.data[0].username);
                    $scope.alreadyExists="User Name Already Exists";
                }
                else
                {
                    $scope.alreadyExists="";
                }
            },function(err)
            {
                console.log(err);
            }
        )

    };
    $scope.insertData = function(){
        // console.log($scope.formData.lname);
        console.log($scope.fname);


        // $scope.formData.confirmpassword= "tst";
        var dataParams = {
            'firstname' : $scope.fname,
            'lastname' : $scope.lname,
            'username' : $scope.uname,
            'password' : $scope.password,
            'confirmpassword' : $scope.confirmpassword,
            'mobileNumber' : $scope.mobile
        };
        x=true;
        if (!($scope.fname)  || !($scope.uname) || !($scope.password) || !($scope.confirmpassword))
        {
            $scope.finalErr = '              Mandatory columns should be entered';
            x=false;
            console.log("In mandatory error");
        }
        var alpha= new RegExp('.*\\d.*');
        if ((alpha.test($scope.fname)) && ($scope.fname)) { // not email
            $scope.finalErr = '              Numbers are not allowed in First Name';
            x=false;
        }
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!(re.test($scope.uname)) && ($scope.uname)) {
            $scope.finalErr = '                  Please enter correct Email Address';
            x=false;
        }
        if (!($scope.confirmpassword==$scope.password)) {
            $scope.finalErr = '                  Passwords should be same';
            x=false;
        }

        var re1 = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
        if (!(re1.test($scope.mobile)) && ($scope.mobile)) {
            $scope.finalErr = '                  Please enter valid number';
            x=false;
        }

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        if(x==true) {
            $http.get('http://127.0.0.1:8081/getData?keywords='+$scope.uname).then(function(d)
                {
                    console.log("Len is "+d.data.length);
                    console.log("val "+JSON.stringify({d: d}));
                    if(d.data.length!=0) {
                        console.log("it is " + d.data[0].username);
                        var eamilAdd = d.data[0].username;
                        if (eamilAdd != "")
                        {
                            $scope.finalErr = '                         User Name Already Exists';
                            console.log("User Name Already Exists");
                        }
                    }
                    else
                    {
                        $scope.alert = window.alert;
                        var req = $http.post('http://127.0.0.1:8081/enroll', dataParams);
                        req.success(function (data, status, headers, config) {
                            $scope.message = data;
                            console.log("here " + data);
                            $scope.finalMsg = "Registration Successful";
                            alert("You have been successfully Registered");
                            $window.location.href = 'LoginPage.html';
                        });
                        req.error(function (data, status, headers, config) {
                            // alert( "failure message: " + JSON.stringify({data: data}));
                            console.log("failure message: " + JSON.stringify({data: data}));
                        });
                    }
                },function(err)
                {
                    console.log(err);
                }
            )
        }
    };
});
myapp.controller('getController',function($scope,$http,$window){
    $scope.getDbData = function(){
        console.log($scope.uname);
        $scope.finalErr = "";

        x=true;
        if (!($scope.uname) || !($scope.password) )
        {
            $scope.finalErr = '              Mandatory columns should be entered';
            x=false;
            console.log("In mandatory error");
        }

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        // var req = $http.get('http://127.0.0.1:8081/getData');

        if(x==true) {
            $http.get('http://127.0.0.1:8081/getData?keywords=' + $scope.uname).then(function (d) {
                    console.log(typeof(d));
                    console.log("length is " + d.data.length);
                    if (d.data.length != 0) {
                        var document = [];
                        for (i = 0; i < d.data.length; i++) {
                            if (d.data[i].password == $scope.password) {
                                console.log("matched");
                                localStorage.setItem("userid123",d.data[i].username);
                                localStorage.setItem("firstname",d.data[i].firstname);
                                $window.location.href = 'index.html?'+d.data[i].firstname;
                            }
                            else {
                                $scope.finalErr = "            Please enter valid user name and password";
                                console.log("Not matched");
                            }
                            document.push(new Array(d.data[i].username + '-' + d.data[i].password));
                        }
                        console.log("document is " + document);
                    }
                    else {
                        $scope.finalErr = "                       Username is not available";
                        console.log("Username is not available");
                    }
                }, function (err) {
                    console.log(err);
                }
            )
        }
    };
    $scope.getPassword = function(){
        console.log($scope.uname);
        $scope.alert = window.alert;
        var req = $http.get('http://127.0.0.1:8081/getpwd?keywords='+$scope.uname);
        req.success(function (data, status, headers, config) {
            console.log("Password has been sent successfully");
            alert("Password has been sent successfully to your email");
        });
        req.error(function (data, status, headers, config) {
            // alert( "failure message: " + JSON.stringify({data: data}));
            console.log("failure message: " + JSON.stringify({data: data}));
        });
    };

});