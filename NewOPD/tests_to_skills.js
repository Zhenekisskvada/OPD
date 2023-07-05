const tf = require('@tensorflow/tfjs');
const {mod} = require("@tensorflow/tfjs");

// Normalize input data to the range of [0, 1]
const normalize = (data) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return data.map((val) => (val - min) / (max - min));
};

// Normalize output data to the range of [0, 1]
const normalizeOutput = (data) => {
    return data.map((val) => val / 100);
};

// Create a sequential neural network model with dropout layers
const createModel = () => {
    const model = tf.sequential();

    // Add an input layer with 37 input nodes
    model.add(tf.layers.dense({ units: 128, inputShape: [37], activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));

    // Add some hidden layers with dropout
    model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));

    // Add an output layer with 168 output nodes
    model.add(tf.layers.dense({ units: 168, activation: 'sigmoid' }));

    return model;
};

// Create and compile the modified model
const model = createModel();
model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: 'accuracy' });

// Train the model with some example data (replace with your actual data)
const trainModel = async (inputTensor, outputTensor) => {
    const batchSize = 32;
    const epochs = 200;

    return await model.fit(inputTensor, outputTensor, {
        batchSize,
        epochs,
        shuffle: true,
        validationSplit: 0.1,
    });
};

// Convert your input data and output data into tensors
const inputArray = [
    // ... Your array of 37 numbers (test results) for each person ...
    // Gleb
    [
        0.334, 100, 0.264, 100, 0.35, 100, 0.889, 100, 0.913, 100, 0.732, 100, 0.058, 0.058, 0, 0.011, 0.094, 0.053, 0,
        0.05, 0, 0.011, 0.09, 0.044, 0.079, 3796, 44024, 8, 14, 0, 8, 0, 59, 22, 103.45, 48, 31.65
    ],
    // Jacob
    [
        0.297, 100, 0.265, 100, 0.683, 100, 1.473, 100, 1.321, 100, 1.721, 100, 0.071, 0, 0.101,0.035, 0.079, 0.051, 0,
        0, 0.016, 0.035, 0.068, 0.045, 0.055,4365, 57591, 6, 2, 7, 8, 0, 47, 1, 104.62, 30, 42.5
    ],
    // Maksim
    [
        1.575, 80 ,0.32 ,100 ,0.942, 100 ,1.383, 100, 2.037, 80, 2.696, 100, 0.07, 0, 0.07, 0.126, 0.092, 0.037, 0, 0.091,
        0.018, 0.126, 0.075, 0.028, 0.085, 1608, 21267, 7, 7, 2, 8, 0, 54, 28, 140.989, 5, 22
    ],
    // Andrey
    [
        0.474, 100, 0.432, 100, 0.891, 100, 2.556, 100, 1.859, 100, 2.496, 100, 0.068, 0.094, 0.017, 0.097, 0.038, 0.048,
        0, 0, 0.046, 0.097, 0.031, 0.038, 0.061, 1584, 9690, 5, 15, 1, 8, 0, 60, 29, 126.255, 48, 20
    ]
];
const outputArray = [
    // ... Your array of 168 numbers (skill development) for each person ...
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
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

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


const normalizedInputArray = inputArray.map((arr) => normalize(arr));
const normalizedOutputArray = outputArray.map((arr) => normalizeOutput(arr));

const inputTensor = tf.tensor2d(normalizedInputArray);
const outputTensor = tf.tensor2d(normalizedOutputArray);

// Train the model and make predictions
// trainModel(inputTensor, outputTensor);

const startTS = async () => {
    trainModel(inputTensor, outputTensor);
}

const runModelTS = async (res) => {
    // Use the trained model to make a prediction for a specific person
    const normalizedPersonTestResults = normalize(res);

    const input = tf.tensor2d([normalizedPersonTestResults]);
    const prediction = model.predict(input);

    // Convert the predicted values back to percentages in the range [0, 100]
    const predictedPercent = prediction.arraySync()[0].map((value) => value * 100);

    console.log('Predicted skill development percentages:', predictedPercent);
    return predictedPercent
};

// runModel([
//     0.474, 100, 0.432, 100, 0.891, 100, 2.556, 100, 1.859, 100, 2.496, 100, 0.068, 0.094, 0.017, 0.097, 0.038, 0.048,
//     0, 0, 0.046, 0.097, 0.031, 0.038, 0.061, 1584, 9690, 5, 15, 1, 8, 0, 60, 29, 126.255, 48, 20
// ]);

module.exports = {
    runModelTS,
    startTS
}