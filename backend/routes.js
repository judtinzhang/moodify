const config = require('./config.json')
const express = require('express');

const router = express.Router()

const processWords = (body, queryFunc) => {
    // initial values 
    let curr_word = ''
    let started = false
    let start_idx = -1

    for (let i = 0; i < body.length; i++) {
        if ((/[a-zA-Z]/).test(body[i])) {
            if (!started) {
                // mark starting index of current word
                start_idx = i
                started = true
            }
            // if letter, append to current word
            curr_word += body[i]
        } else {
            // if current word is not empty and current index
            // is not a letter, then update current word
            if (curr_word !== '') {
                body = body.substring(0, start_idx) + queryFunc(curr_word) + body.substring(i)
                // index and word
                started = false
            }
            // reset word
            curr_word = ''
        }
    }
    return body
}

const reverse = (word) => word.split('').reverse().join('')

const upper = (word) => word.toUpperCase()

router.post('/synonyms', async (req, res, next) => {
    let { body, synonym, sentiment } = req.body
    // process words
    body = processWords(body, upper)
    res.send({ body })
})

router.post('/emotions', async (req, res, next) => {
    const { body, positive } = req.body
    res.send({ body })
})

router.post('/language', async (req, res, next) => {
    const { body, language } = req.body
    res.send({ body })
})

router.post('/sentiment', async (req, res, next) => {
    const { body, sentiment } = req.body
    res.send({ sentiment: 0.58 })
})

router.post('/emotion', async (req, res, next) => {
    const { body, emotion } = req.body
    res.send({ emotion: 0.58 })
})

router.get('/sentiments', async (req, res, next) => {
    const sentiments = [
        'positive',
        'negative',
        'anger',
        'anticipation',
        'disgust',
        'fear',
        'joy',
        'sadness',
        'surprise',
        'trust',
        'word'
    ]
    res.send({ sentiments })
})

module.exports = router