async function getData() {

    const carsDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');

    const carsData = await carsDataResponse.json();

    const cleaned = carsData.map( car => ({
        mpg: car.Miles_per_Gallon,
        horsepower: car.Horsepower
    }))
    .filter(car =>(car.mpg != null && car.horsepower != null));

    return cleaned;
    
}

function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
    
    model.add(tf.layers.dense({ units: 1, useBias: true}));
}

function convertToTensor(data) {
    return tf.tidy(() =>{
        tf.util.shufile(data);

        const inputs = data.map((d) => d.horsepower);
        const labels = data.map((d) => d.mpg);
        
        const inputTensor = tf.tensor2d(inputs, [inputs.length,1]);
        const labelTensor = tf.tensor2d(labels, [labels.length,1]);
    })
}


async function run() {
    const data = await getData();

    const values = data.map( d => ({
        x: d.horsepower,
        y: d.mpg
    }));

    tfvis.render.scatterplot(
        {name: "Horsepower vs MPG"},
        {values},
        {
            xLabel: "Horsepower",
            yLabel: "MPG",
            height: 300
        }
    );

    //Código aqui
}


const model = createModel();

tfvis.show.modelSummary({ name: "Modelo"}, model);

document.addEventListener('DOMContentLoaded', run);

