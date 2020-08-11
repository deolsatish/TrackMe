const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');


const randomInt = require('random-int');
const randomCoordinates= require('random-coordinates');


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://deolsatish:debarati@sit209.udjho.mongodb.net/test');
const Device = require('./models/device');



const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });
const port = process.env.PORT || 5001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));


const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
    client.subscribe('/sensorData');
    console.log('mqtt connected');
});

/**
* @api {post} /send-command publishes command to command topic 
* @apiGroup mqtt
* @apiParam {json}:
*{
*    "deviceId": "Mary's iPhone" ,
*    "command": "Enable GPS"
*}
* @apiSuccessExample {String} Success-Response:
*{
*    "published new message"
*}
*/

app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/myid/command/${deviceId}`;
    client.publish(topic, command, () => {
    res.send('published new message');
    });
    });


app.listen(port, () => {
console.log(`listening on port ${port}`);
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
    console.log("message client active");
    const data = JSON.parse(message);
    Device.find({}, (err, devices) => {
        if (err == true) {
        return console.log(err);
        } else {
        return console.log(devices);
        }
        });
    Device.findOne({"name": data.deviceId }, (err, device) => {
    if (err) console.log(err);
    console.log("device");
    console.log(device);
    console.log("after device");
    const { sensorData } = device;
    const { ts, temp, loc } = data;
    sensorData.push({ ts, loc, temp });
    device.sensorData = sensorData;
    device.save(err => {
    if (err) {
    console.log(err)
    }
    });
    });
}
});


/*app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const {ts,loc,temp} = req.body.sensorData;
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    client.publish(topic, message, () => {
        res.send('published new message');
    });
});
*/

//app.post('/api/send-command', (req, res) => {
//    console.log(req.body);
//});




/**
* @api {put} /sensor-data publishes sensor data to mtqq client 
* @apiGroup mqtt
* @apiParam {json}:
*{
*    "deviceId": "Mary's iPhone"
*}
* @apiSuccessExample {String} Success-Response:
*{
*    "published new message"
*}
*/




app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    ts = new Date().getTime();
    loc = { lat, lon };
    temp = randomInt(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    console.log("message");
    console.log(message);
    client.publish(topic, message, () => {
    res.send('published new message');
    });
    })

app.get('/api/test', (req, res) => {
    res.send('The API is working!');
    });

app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});