const mongoose = require('mongoose');
//mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
mongoose.connect('mongodb+srv://deolsatish:debarati@sit209.udjho.mongodb.net/test');


const express = require('express');
const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
* @api {get} /api/test tests if api is working
* @apiGroup Test
* @apiSuccessExample {String} Success-Response:
*"The API is working!"
*/



app.get('/api/test', (req, res) => {
res.send('The API is working!');
});
app.listen(port, () => {
console.log(`listening on port ${port}`);
});
const Device = require('./models/device');
const User = require('./models/user');





/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
*{
*"_id": "dsohsdohsdofhsofhosfhsofh",
*"name": "Mary's iPhone",
*"user": "mary",
*"sensorData": [
*{
*"ts": "1529542230",
*"temp": 12,
*"loc": {
*"lat": -37.84674,
*"lon": 145.115113
*}
*},
*{
*"ts": "1529572230",
*"temp": 17,
*"loc": {
*"lat": -37.850026,
*"lon": 145.117683
*}
*}
*]
*}
* ]
* @apiErrorExample {json} Error-Response:
* {
*
"User does not exist"
* }
*/

app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
    if (err == true) {
    return res.send(err);
    } else {
    return res.send(devices);
    }
    });
});
/**
* @api {post} /api/devices Adds new device
* @apiGroup Device
* @apiParam {json}:
* [
*    {
*        "name": "Mary's iPhone",
*        "user": "mary",
*        "sensorData": [
*            {
*                "ts": "1529542230",
*                "temp": 12,
*                "loc": 
*                {
*                    "lat": -37.84674,
*                   "lon": 145.115113
*                }
*            },
*            {
*               "ts": "1529572230",
*                "temp": 17,
*                "loc": 
*                {
*                    "lat": -37.850026,
*                    "lon": 145.117683
*               }
*           }
*        ]
*    }
*] 
* @apiSuccessExample {String} Success-Response: 
*"successfully added device and data'" 
* @apiErrorExample {json} Error-Response:
{
    "User does not exist"
}
*/


app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
    name,
    user,
    sensorData
    });
    newDevice.save(err => {
    return err
    ? res.send(err)
    : res.send('successfully added device and data');
    });
});
/**
* @api {post} /api/authenticate Verifies User
* @apiGroup Users
* @apiParam {json}:
* {
*    "name": "Mary's iPhone",
*    "password": test123"
*        
*}
* @apiSuccessExample {json} Success-Response:{
*                    success: true,
*                    message: 'Authenticated successfully',
*                    isAdmin: result.isAdmin} 
* @apiErrorExample {String} Error-Response:
*Error:(User doesn't exist)The User in not in the Registration Database
*/




app.post('/api/authenticate', (req, res) => {
    const { name, password} = req.body;
    console.log("suthenticate name:"+name);
    console.log("authenticate password:"+password);
    
    User.findOne({"name":name}, (err, result) => {
        if(err)
        return err;
        console.log("Result");
        console.log(result);
        if(result==null)
        {
            res.send("Error:(User doesn't exist)The User in not in the Registration Database");
        }
        else
        {
            if(result.password==password)
            {
                console.log("password else");
                return res.json({
                    success: true,
                    message: 'Authenticated successfully',
                    isAdmin: result.isAdmin}
                );                
            }
            else
            {
                res.send("Error: Password is incorrect");
            }
        }
    });

    
});
/**
* @api {post} /api/registration Adds new Users
* @apiGroup Users
* @apiParam {json}:
* {
*    "name": "Mary's iPhone",
*    "password": test123",
*    "isAdmin":0
*        
*}
* @apiSuccessExample {String} Success-Response:
*"Created new user" 
* @apiErrorExample {String} Error-Response:
*"Error!!! User already exists"
*/

app.post('/api/registration', (req, res) => {
    const { name, password, isAdmin } = req.body;
    User.find({}, (err, users) => {
        console.log("users");
        console.log(users);
    });
    User.findOne({"name":name}, (err, result) => {
        if(err)
        return err;
        console.log("Result");
        console.log(result);
        if(result!=null)
        {
            res.send("Error!!! User already exists");
        }
        else
        {
            const newUser = new User({
                name: name,
                password,
                isAdmin
            });
            newUser.save(err => {
                return err
                ? res.send(err)
                : res.json({
                success: true,
                message: 'Created new user'
                });
            });
        }
    });
    
});


/**
* @api {get} /api/devices/:deviceId/device-history Returns Device History for specific device id
* @apiGroup Device
* @apiParam {json}:
* {
*    "_id": "dsohsdohsdofhsofhosfhsofh"
*}
* @apiSuccessExample {json} Success-Response:
*"sensorData": [
*            {
*                "ts": "1529542230",
*                "temp": 12,
*                "loc": 
*                {
*                    "lat": -37.84674,
*                    "lon": 145.115113
*                }
*            },
*            {
*                "ts": "1529572230",
*                "temp": 17,
*                "loc": 
*                {
*                    "lat": -37.850026,
*                    "lon": 145.117683
*                }
*    }
*] 
* @apiErrorExample {json} Error-Response: 
{
    Device Does not Exist
}
*/



app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({"_id": deviceId }, (err, devices) => {
    const { sensorData } = devices;
    return err
    ? res.send(err)
    : res.send(sensorData);
    });
    });


//app.post('/api/send-command', (req, res) => {
//    console.log(req.body);
//});
/**
* @api {get} /api/users/:user/devices Returns device for specific user
* @apiGroup User
* @apiSuccessExample {String} Success-Response:
* [
*    {
*        "_id": "dsohsdohsdofhsofhosfhsofh",
*        "name": "Mary's iPhone",
*        "user": "mary",
*        "sensorData": [
*            {
*                "ts": "1529542230",
*                "temp": 12,
*                "loc": 
*                {
*                    "lat": -37.84674,
*                    "lon": 145.115113
*                }
*            },
*            {
*                "ts": "1529572230",
*                "temp": 17,
*                "loc": 
*                {
*                    "lat": -37.850026,
*                    "lon": 145.117683
*                }
*            }
*        ]
*    }
*] 
* @apiErrorExample {json} Error-Response:
{
    "Device does not exist"
}
*/

app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
    return err
    ? res.send(err)
    : res.send(devices);
    });
});

app.use(express.static(`${__dirname}/public`));

/**
* @api {get} /docs sends documentation
* @apiGroup docs
* @apiSuccessExample {html} Success-Response: 
*index.html 
*/


app.get('/docs', (req, res) => {
res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});