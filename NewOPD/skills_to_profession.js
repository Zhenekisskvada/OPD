const tf = require('@tensorflow/tfjs');

// Create a sequential neural network model
const createModel = () => {
    const model = tf.sequential();

    // Add an input layer with 168 input nodes (numbers)
    model.add(tf.layers.dense({ units: 32, inputShape: [168], activation: 'relu' }));

    // Add some hidden layers
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));

    // Add an output layer with 1 output node (number)
    model.add(tf.layers.dense({ units: 1 }));

    return model;
}

// Create and compile the model
const model = createModel();
model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: 'accuracy' });

// Train the model with some example data (replace with your actual data)
const trainModel = async (inputTensor, outputTensor) => {
    const batchSize = 32;
    const epochs =100;

    return await model.fit(inputTensor, outputTensor, {
        batchSize,
        epochs,
        shuffle: true
    });
}

// Convert your input data and output data into tensors
const inputArray = [
    // Gleb
    [
        0, 0, 0, 0, 0, 0, 80, 0, 60, 60, 0, 80, 0, 0, 0, 0, 0, 0, 70, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 50, 0, 0, 40, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 70, 0, 0, 80, 30, 50, 0, 0, 60, 0,
        70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    // Jacob
    [
        0, 0, 0, 65, 60, 0, 50, 70, 40, 75, 35, 30, 25, 45, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 0, 10, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    ],
    //Maksim
    [
        0, 0, 0, 85, 70, 0, 0, 80, 82, 80, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 0, 0, 0, 0, 0, 0, 0, 0, 95, 0, 0, 0, 0, 0, 89, 0, 0, 85, 0, 90, 88, 0, 0, 0, 95,
        0, 0, 0, 0, 0, 0, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 80, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

    ],
    // Andrey
    [
        0, 0, 0, 0, 0, 0, 0, 0, 70, 0, 0, 40, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 50, 50, 40, 0, 0, 0, 0, 0, 30, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0, 0, 0, 0, 60, 0, 0, 0, 50, 50, 70, 0, 60, 50, 0, 0, 60, 30, 0, 70, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
];
const outputArray = [
    // Gleb
    [3],
    // Jacob
    [1],
    // Maksim
    [1],
    // Andrey
    [1]
];

const inputTensor = tf.tensor2d(inputArray);
const outputTensor = tf.tensor2d(outputArray);

// Train the model and make predictions
// trainModel(inputTensor, outputTensor);

const startSP = async () => {
    await trainModel(inputTensor, outputTensor);
}

const runModelSP = async (res) => {
    // Use the trained model to make a prediction for a specific person
    const input = tf.tensor2d([res]);
    const prediction = model.predict(input);

    console.log('Predicted profession index:', prediction.arraySync());
    return Math.round(prediction.arraySync()[0][0]);
};

// runModelSP([
//     0, 0, 0, 0, 0, 0, 0, 0, 70, 0, 0, 40, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 50, 50, 40, 0, 0, 0, 0, 0, 30, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0, 0, 0, 0, 60, 0, 0, 0, 50, 50, 70, 0, 60, 50, 0, 0, 60, 30, 0, 70, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
// ])

module.exports = {
    runModelSP,
    startSP
};