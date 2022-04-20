import config from './config.json'

const getMessage = async () => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/hello`, {
        method: 'GET',
    })
    return res.json()
}

const getSynonyms = async (data, option) => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/synonyms`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: data, sentiment: option })
    })
    const resp = await res.json()
    return resp
}

const getOptions = async () => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/options`, {
        method: 'GET',
    })
    return res.json()
}

const getLanguages = async () => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/languages`, {
        method: 'GET',
    })
    return res.json()
}

const postLanguages = async (body, language, sentiment) => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/language/synonyms`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: body, language: language, sentiment: sentiment })
    })
    const resp = await res.json()
    return resp
}

const removeEmotion = async (data, emotion) => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/remove/emotion`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: data, emotion: emotion })
    })
    const resp = await res.json()
    return resp
}

const getStatistics = async (data) => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/emotions/statistics`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: data })
    })
    const resp = await res.json()
    return resp
}

const poetify = async (data) => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/poetify`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: data })
    })
    const resp = await res.json()
    return resp
}

const getDBStatistics = async () => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/data/statistics`, {
        method: 'GET',
    })
    return res.json()
}

const getTopEmotion = async (data) => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/api/top/emotion`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: data })
    })
    const resp = await res.json()
    return resp
}


export {
    getMessage,
    getSynonyms,
    getOptions,
    removeEmotion,
    getStatistics,
    getLanguages,
    postLanguages,
    poetify,
    getDBStatistics,
    getTopEmotion
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