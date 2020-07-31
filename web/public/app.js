$('#navbar').load('navbar.html');
$('#footbar').load('footer.html');

const API_URL = 'https://trackme-one.vercel.app/api';
const MQTT_URL = 'http://localhost:5001';

const response = $.get(`${API_URL}/devices`);

console.log(response);


/*$.get(`${API_URL}/devices`).then(response => {response.forEach(device => {
    $('#devices tbody').append(`
    <tr>
    <td>${device.user}</td>
    <td>${device.name}</td>
    </tr>`
    );});
})
.catch(error => {
console.error(`Error: ${error}`);
});
*/
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

const isAuthenticated=JSON.parse(localStorage.getItem('isAuthenticated')) || false;

$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
    name,
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
    });

$('#register').on('click', function() {
    const user = $('#user').val();
    const password = $('#password').val();
    const confirm = $('#confirm').val();
    const isAdmin=false;

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
    $('#message').append(`<p class="alert alert-danger">${response}
    </p>`);
    }
    });
}


});
$('#login').on('click', () => {
    const user = $('#username').val();
    const password = $('#password').val();
    //console.log("login click");
    //console.log("user:"+user);
    //console.log("password:"+password);
    
    //const _user={ "name":user, "password":password };
    //console.log("sent"+_user);
    $.post(`${API_URL}/authenticate`, { "name":user, "password":password })
    .then((response) =>{
        console.log("response");
        console.log(response);
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
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
    }
    });
});



const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
    }



$('#send-command').on('click', function() {
    const deviceId = $('#deviceId').val();
    const command = $('#command').val();
    $.post(`${MQTT_URL}send-command`, { "deviceId":deviceId, "command":command })
    .then((response) =>{
        console.log("response");
        console.log(response);
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
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
    }
    });
});
