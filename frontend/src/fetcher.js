import config from './config.json'

const getMessage = async () => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/hello`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getMessage
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