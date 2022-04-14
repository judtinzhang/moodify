import config from './config.json'

const getMessage = async () => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/hello`, {
        method: 'GET',
    })
    return res.json()
}

const getSynonyms = async (data) => {
    console.log(data)
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/synonyms`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: data })
    })
    // console.log(await res.json())
    const resp = await res.json()
    // console.log(resp)
    return resp
}

export {
    getMessage,
    getSynonyms
}

/*
synonyms
{
    "body": "hetvi suks",
    "synonym": false,
    "sentiment": "hello"
}

emotions
{
    "body": "hetvi suks",
    "positive": false
}

language
{
    "body": "hetvi suks",
    "language": "english"
}

sentiment
{
    "body": "hetvi suks",
    "sentiment": false
}

emotion
{
    "body": "hetvi suks",
    "emotion": false
}
*/