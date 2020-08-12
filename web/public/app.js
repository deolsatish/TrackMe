$('#navbar').load('navbar.html');


const API_URL = 'https://trackme.deolsatish.vercel.app/api';
const MQTT_URL = 'http://localhost:5001';

const response = $.get(`${API_URL}/devices`);

const isAuthenticated=JSON.parse(localStorage.getItem('isAuthenticated')) || false;
const currentUser = localStorage.getItem('user');
if (currentUser) 
{
    $.get(`${API_URL}/users/${currentUser}/devices`).then(response => {
        response.forEach((device) => {
                console.log("'#devices tbody'");
                $('#devices tbody').append(`
                <tr data-device-id=${device._id}>
                <td>${device.user}</td>
                <td>${device.name}</td>
                </tr>`
                );
                });console.log("'#devices tbody endeededed");
                $('#devices tbody tr').on('click', (e) => {
                    console.log("#devices tbody trasdasdasdasdasdasqwd");
                    const deviceId = e.currentTarget.getAttribute('data-device-id');
                    $.get(`${API_URL}/devices/${deviceId}/device-history`).then(response => {response.map(sensorData => {
                        $('#historyContent').empty();
                        $('#historyContent').append(`
                        <tr>
                        <td>${sensorData.ts}</td>
                        <td>${sensorData.temp}</td>
                        <td>${sensorData.loc.lat}</td>
                        <td>${sensorData.loc.lon}</td>
                        </tr>
                        `);
                        });
                        $('#historyModal').modal('show');
                    });
            });
            })
            .catch(error => {
                console.error(`Error: ${error}`);
            });
        }
        else
        {
            const path = window.location.pathname;
            
            if (path !== '/login')
            {
                //location.href = '/login';
            }
        }
    


var adddeviceapp=angular.module('adddeviceapp',[]);
adddeviceapp.controller('formCtrl',function($scope)
{
    $scope.username="";
    $scope.name="";
    $scope.save = function() {
        const user = $scope.username;
        const devicename = $scope.name;
        console.log("username: "+user);
        console.log("name: "+name);
        const sensorData = [];
        const body = {
        devicename,
        user,
        sensorData
        };
        $.post(`${API_URL}/devices`, body)
        .then(response => {
        location.href = '/';
        })
        .catch(error => {
        console.error(`Error: ${error}`);
    });
        
        
    }
});


var registerapp=angular.module('registerapp',[]);
registerapp.controller('formCtrl',function($scope)
{
    $scope.username="";
    $scope.password="";
    $scope.confirm="";
    $scope.register = function() {
        const user = $scope.username;
        const password = $scope.password;
        const confirm = $scope.confirm;
        const isAdmin=false;
        console.log("name: "+user);
        console.log("password: "+password);
        console.log("confirm: "+confirm);
        $.post(`${API_URL}/authenticate`, { "name":user, "password":password })
    .then((response) =>{
        console.log("response");
        console.log(response);
        if(password!=confirm)
        {
            $(".message").empty();
            $(".message").append("<p> Your Password and Confirm Password inputs do not match.</p>");
            //location.href = '/registration';
        }
        else
        {
            $.post(`${API_URL}/registration`, { "name":user, "password":password, "isAdmin":isAdmin}).then((response) =>{if (response.success) {
        //location.href = '/login';
        console.log("registration successfull");
        }
        else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
    }
});
        
    }
});
    }
});

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
    }

var sendcommandapp = angular.module('sendcommandapp',[]);

sendcommandapp.controller('formCtrl',function($scope)
{
    $scope.deviceId="";
    $scope.command="";
    $scope.send= function() {
        const deviceId = $scope.deviceId;
    const command = $scope.command;
    console.log("send-commad entered"+deviceId+command);
    $.post(`${MQTT_URL}/send-command`, { "deviceId":deviceId, "command":command })
    .then((response) =>{
        console.log("response");
        console.log(response);
    if (response.success) 
    {
        $('#message').append(`<p>${response}</p>`);
    }
    else
    {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
    }
    });
}
});




var loginapp=angular.module('loginapp',[]);
loginapp.controller('formCtrl',function($scope,$http)
{
    $scope.username="";
    $scope.password="";
    $scope.bool=false;
    $scope.submit = function() {
        const user = $scope.username;
        const password = $scope.password;
        //console.log("name: "+user);
        //console.log("password: "+password);
        $.post(`${API_URL}/authenticate`, { "name":user, "password":password })
    .then((response) =>{
        // console.log("response");
        // console.log(response);
    if (response.success) 
    {
        //console.log("response");
        //console.log(response);
        localStorage.setItem('user', user);
        localStorage.setItem('isAdmin', response.isAdmin);
        localStorage.setItem('isAuthenticated',true);
        location.href = '/';
    }
    else
    {
        $scope.message=response;
        $scope.bool=true;
    }
    });
        
    }
});