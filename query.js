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


client.graphql
    .get()
    .withClassName('Question')
    .withFields('question answer category')
    .withNearText({ concepts: ["biology"] })
    .withLimit(2)
    .do()
    .then(res => {
        console.log(JSON.stringify(res, null, 2))
    })
    .catch(err => {
        console.error(err)
    });