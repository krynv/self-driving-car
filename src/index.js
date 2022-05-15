const { appendChild, generateCars, save, discard } = require('./utils');
const { Road, NeuralNetwork, Car, Visualiser } = require('./components');

const carCanvas = document.createElement('canvas');
carCanvas.id = 'carCanvas';
carCanvas.width = 200;

const networkCanvas = document.createElement('canvas');
networkCanvas.id = 'networkCanvas';
networkCanvas.width = 300;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const cars = generateCars(100, road);

let bestCar = cars[0];

const buttonContainer = document.createElement('div');
buttonContainer.id = 'verticalButtons';

const saveButton = document.createElement('button');
saveButton.innerText = '💾';
// saveButton.onclick = save(bestCar.brain);
saveButton.onclick = function () { save(bestCar.brain) };

const discardButton = document.createElement('button');
discardButton.innerText = '🗑';
discardButton.onclick = function () { discard() };

buttonContainer.appendChild(saveButton);
buttonContainer.appendChild(discardButton);

appendChild(carCanvas);
appendChild(buttonContainer);
appendChild(networkCanvas);

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));

        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -400, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
];

const animate = time => {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "green", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;

    Visualiser.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

animate();