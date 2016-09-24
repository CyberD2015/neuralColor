const synaptic = require('synaptic');
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('client'));
app.get('/', function (req, res) {
    res.send('<h1>...You went too far my friend...Too far...</h1>');
});
var fs = require('fs');
var Neuron = synaptic.Neuron
    , Layer = synaptic.Layer
    , Network = synaptic.Network
    , Trainer = synaptic.Trainer
    , Architect = synaptic.Architect;
var myNetwork = new Architect.Perceptron(3, 9, 3);
var trainingSet = [];
fs.readFile('./trainingData.js', function (err, data) {
    if (err) {}
    else {
        trainingSet = JSON.parse(data);
        trainNeuralNet();
    }
});
var trainer = new Trainer(myNetwork);

function trainNeuralNet() {
    trainer.train(trainingSet, {
        rate: .1
        , iterations: 20000
        , error: .005
        , shuffle: true
        , log: 1000
        , cost: Trainer.cost.CROSS_ENTROPY
    });
}

function pushToTrainingSet(obj) {
    trainingSet.push(obj);
}

function makeScheme(arr) {
    return myNetwork.activate(arr);
}
http.listen(8080, function () {
    console.log('Listening on *:8080');
});
io.on('connection', function (socket) {
    io.emit('conMade', true);
    socket.on('addData', function (obj) {
        pushToTrainingSet(obj);
        fs.writeFile("./trainingData.js", JSON.stringify(trainingSet), function (err) {});
    });
    socket.on("requestData", function (arr) {
        io.emit("responseData", makeScheme(arr));
    });
    socket.on("trainNetwork", function (idk) {
        trainNeuralNet();
    });
});