const weaviate = require("weaviate-client");

// load dotenv
require('dotenv').config();

// const host = process.env.WEAVIATE_HOST;
const host = 'localhost:8081'

const client = weaviate.client({
    scheme: 'http',
    host: host,  // Replace with your endpoint
});

//// add the schema
let classObj = {
    "class": "Question",
    "vectorizer": "text2vec-openai"  // Or "text2vec-cohere" or "text2vec-huggingface"
}

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

//// delete the schema
// const className = 'Question';  // Replace with your class name
// client.schema
//     .classDeleter()
//     .withClassName(className)
//     .do()
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.error(err)
//     });