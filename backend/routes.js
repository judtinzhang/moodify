const config = require('./config.json')
const express = require('express');
const mysql = require('mysql');

const router = express.Router()

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();

const processWords = async (body, queryFunc, query) => {
    // initial values 
    let curr_word = ''
    let started = false
    let start_idx = -1

    let newBody = ''
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
                // append modified word to new body
                const newWord = await queryFunc({ query, word: curr_word.toLowerCase() })
                newBody += newWord
                started = false
            }
            newBody += body[i]
            // reset word
            curr_word = ''
        }
    }

    // account for case where no punctuation at the end
    if ((/[a-zA-Z]/).test(body[body.length - 1])) {
        return newBody + await queryFunc({ query, word: curr_word.toLowerCase() })
    } else {
        return newBody
    }
}
const queryFunc = async ({ query, word }) => {
    let p = new Promise(function (res, rej) {
        connection.query(query(word), function (err, results) {
            if (err) rej(err)
            else {
                const randomNumber = Math.floor(Math.random() * results.length)
                // console.log(results[randomNumber])
                if (results[randomNumber] === undefined) {
                    res(word)
                } else {
                    res(results[randomNumber]['Word2'])
                }
            }
        });
    });
    return p
}

router.post('/synonyms', async (req, res, next) => {
    let { body, synonym, sentiment } = req.body

    const basicQuery = (word) => `
    (SELECT s.Word2 FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word1
    WHERE w.Word = '${word}')
    UNION
    SELECT s.Word1
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word2
    WHERE w.Word = '${word}';`

    const emotionQuery = (word) => `
    (SELECT s.Word2
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word1
    WHERE w.Word = '${word}'
    AND w.${sentiment} = 1)
    UNION
    SELECT s.Word1
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word2
    WHERE w.Word = '${word}'
    AND w.${sentiment} = 1;`

    const query = sentiment === 'none' ? basicQuery : emotionQuery

    res.send({ body: await processWords(body, queryFunc, query) })
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
    connection.query(`SELECT COUNT(*) FROM Synonyms`, function (err, results) {
        console.log(results)
    });



    res.send({ emotion: 0.58 })
})

router.get('/sentiments', async (req, res, next) => {
    const sentiments = [
        'none',
        'positive',
        'negative',
        'anger',
        'anticipation',
        'disgust',
        'fear',
        'joy',
        'sadness',
        'surprise',
        'trust'
    ]
    res.send({ sentiments })
})

module.exports = router