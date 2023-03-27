const weaviate = require("weaviate-client");

// load dotenv
require('dotenv').config();

const host = process.env.WEAVIATE_HOST;
// const host = 'localhost:8081'


const client = weaviate.client({
    scheme: 'http',
    host: host,  // Replace with your endpoint
    headers: { 'X-OpenAI-Api-Key': `${process.env.OPENAI_APIKEY}` },  // Replace with your API key
});


let classObj = {
    "class": "Question",
    "vectorizer": "text2vec-openai"
}

// add the schema
client
    .schema
    .classCreator()
    .withClass(classObj)
    .do()
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.error(err)
    });

async function getJsonData() {
    const file = await fetch('https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json');
    return file.json();
}

async function importQuestions() {
    // Get the data from the data.json file
    const data = await getJsonData();

    // Prepare a batcher
    let batcher = client.batch.objectsBatcher();
    let counter = 0;
    let batchSize = 100;

    data.forEach(question => {
        // Construct an object with a class and properties 'answer' and 'question'
        const obj = {
            class: 'Question',
            properties: {
                answer: question.Answer,
                question: question.Question,
                category: question.Category,
            },
        }

        // add the object to the batch queue
        batcher = batcher.withObject(obj);

        // When the batch counter reaches batchSize, push the objects to Weaviate
        if (counter++ == batchSize) {
            // flush the batch queue
            batcher
                .do()
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.error(err)
                });

            // restart the batch queue
            counter = 0;
            batcher = client.batch.objectsBatcher();
        }
    });

    // Flush the remaining objects
    batcher
        .do()
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.error(err)
        });
}

importQuestions();