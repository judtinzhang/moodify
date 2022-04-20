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

const queryFunc = async (query, word) => {
    let p = new Promise(function (res, rej) {
        connection.query(query(word), function (err, results) {
            if (err) rej(err)
            else {
                const randomNumber = Math.floor(Math.random() * results.length)
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

const languageQuery = async (language, query, word) => {
    let p = new Promise(function (res, rej) {
        connection.query(query(word), function (err, results) {
            if (err) rej(err)
            else {
                if (results.length === 0 || results[0][language] === undefined) {
                    res(word)
                } else {
                    if (results[0][language] === 'NO TRANSLATION') {
                        res(word)
                    } else {
                        res(results[0][language])
                    }
                }
            }
        });
    });
    return p
}

const processLanguage = async (language, body, languageQuery, query) => {
    // initial values 
    let curr_word = ''
    let started = false

    let newBody = ''
    for (let i = 0; i < body.length; i++) {
        if ((/[a-zA-Z]/).test(body[i])) {
            if (!started) {
                started = true
            }
            // if letter, append to current word
            curr_word += body[i]
        } else {
            // if current word is not empty and current index
            // is not a letter, then update current word
            if (curr_word !== '') {
                // append modified word to new body
                const newWord = await languageQuery(language, query, curr_word.toLowerCase())
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
        return newBody + await languageQuery(language, query, curr_word.toLowerCase())
    } else {
        return newBody
    }
}

const processWords = async (body, queryFunc, query) => {
    // initial values 
    let curr_word = ''
    let started = false

    let newBody = ''
    for (let i = 0; i < body.length; i++) {
        if ((/[a-zA-Z]/).test(body[i])) {
            if (!started) {
                started = true
            }
            // if letter, append to current word
            curr_word += body[i]
        } else {
            // if current word is not empty and current index
            // is not a letter, then update current word
            if (curr_word !== '') {
                // append modified word to new body
                const newWord = await queryFunc(query, curr_word.toLowerCase())
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
        return newBody + await queryFunc(query, curr_word.toLowerCase())
    } else {
        return newBody
    }
}

const averageQuery = async (query, word) => {
    let p = new Promise((res, rej) => {
        connection.query(query(word), (err, results) => {
            if (err) rej(err)
            else {
                res(results[0])
            }
        })
    })
    return p
}

const topQuery = async (query, word) => {
    let p = new Promise((res, rej) => {
        connection.query(query(word), (err, results) => {
            if (err) rej(err)
            else {
                res(results)
            }
        })
    })
    return p
}

const processTop = async(body, topQuery, query) => {
    let quantities = {
        avg_Anger: 0,
        avg_Anticipation: 0,
        avg_Disgust: 0,
        avg_Fear: 0,
        avg_Joy: 0,
        avg_Sadness: 0,
        avg_Surprise: 0,
        avg_Trust: 0
    }

    let curr_word = ''
    let started = false

    for (let i = 0; i < body.length; i++) {
        if ((/[a-zA-Z]/).test(body[i])) {
            if (!started) {
                started = true
            }
            // if letter, append to current word
            curr_word += body[i]
        } else {
            // if current word is not empty and current index
            // is not a letter, then update current word
            if (curr_word !== '') {
                // append modified word to new body
                const obj = await topQuery(query, curr_word.toLowerCase())
                obj.forEach(e => quantities[e['col']] += e['value'])
            }
            // reset word
            curr_word = ''
        }
    }

    // account for case where no punctuation at the end
    if ((/[a-zA-Z]/).test(body[body.length - 1])) {
        const obj = await topQuery(query, curr_word.toLowerCase())
        obj.forEach(e => quantities[e['col']] += e['value'])
    }

    const avgList = [
        "avg_Anger",
        "avg_Anticipation",
        "avg_Disgust",
        "avg_Fear",
        "avg_Joy",
        "avg_Sadness",
        "avg_Surprise",
        "avg_Trust"
    ]

    let highestAvg = 'avg_Anger'
    let maxVal = -1
    avgList.forEach(e => {
        if (quantities[e] > maxVal) {
            highestAvg = e
            maxVal = quantities[e]
        }
    })

    const stringMap = {
        avg_Anger: "Anger",
        avg_Anticipation: "Anticipation",
        avg_Disgust: "Disgust",
        avg_Fear: "Fear",
        avg_Joy: "Joy",
        avg_Sadness: "Sadness",
        avg_Surprise: "Surprise",
        avg_Trust: "Trust"
    }
    
    return stringMap[highestAvg]
}

const processAverage = async (body, averageQuery, query) => {
    let averages = {
        avg_Positive: 0,
        avg_Negative: 0,
        avg_Anger: 0,
        avg_Anticipation: 0,
        avg_Disgust: 0,
        avg_Fear: 0,
        avg_Joy: 0,
        avg_Sadness: 0,
        avg_Surprise: 0,
        avg_Trust: 0
    }

    let total = 0

    // initial values 
    let curr_word = ''
    let started = false

    for (let i = 0; i < body.length; i++) {
        if ((/[a-zA-Z]/).test(body[i])) {
            if (!started) {
                started = true
            }
            // if letter, append to current word
            curr_word += body[i]
        } else {
            // if current word is not empty and current index
            // is not a letter, then update current word
            if (curr_word !== '') {
                // append modified word to new body
                const result = await averageQuery(query, curr_word.toLowerCase())
                if (result['avg_Positive'] !== null) {
                    averages['avg_Positive'] += result['avg_Positive'] 
                    averages['avg_Negative'] += result['avg_Negative']
                    averages['avg_Anger'] += result['avg_Anger']
                    averages['avg_Anticipation'] += result['avg_Anticipation']
                    averages['avg_Disgust'] += result['avg_Disgust']
                    averages['avg_Fear'] += result['avg_Fear'] 
                    averages['avg_Joy'] += result['avg_Joy']
                    averages['avg_Sadness'] += result['avg_Sadness']
                    averages['avg_Surprise'] += result['avg_Surprise']
                    averages['avg_Trust'] += result['avg_Trust']
                    total += 1
                    
                }
                started = false
            }
            // reset word
            curr_word = ''
        }
    }

    // account for case where no punctuation at the end
    if ((/[a-zA-Z]/).test(body[body.length - 1])) {
        const result = await averageQuery(query, curr_word.toLowerCase())
        if (result['avg_Positive'] !== null) {
            averages['avg_Positive'] += result['avg_Positive'] 
            averages['avg_Negative'] += result['avg_Negative']
            averages['avg_Anger'] += result['avg_Anger']
            averages['avg_Anticipation'] += result['avg_Anticipation']
            averages['avg_Disgust'] += result['avg_Disgust']
            averages['avg_Fear'] += result['avg_Fear'] 
            averages['avg_Joy'] += result['avg_Joy']
            averages['avg_Sadness'] += result['avg_Sadness']
            averages['avg_Surprise'] += result['avg_Surprise']
            averages['avg_Trust'] += result['avg_Trust']
            total += 1
            
        }
    } 

    averages['avg_Positive'] /= total
    averages['avg_Negative'] /= total
    averages['avg_Anger'] /= total
    averages['avg_Anticipation'] /= total
    averages['avg_Disgust'] /= total
    averages['avg_Fear'] /= total
    averages['avg_Joy'] /= total
    averages['avg_Sadness'] /= total
    averages['avg_Surprise'] /= total
    averages['avg_Trust'] /= total

    return averages
}

router.post('/synonyms', async (req, res, next) => {
    let { body, sentiment } = req.body

    // returns synonym word correlated to sentiment
    // defaults to basicQuery is 'default' sentiment is given
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

    const query = sentiment === 'default' ? basicQuery : emotionQuery

    res.send({ body: await processWords(body, queryFunc, query) })
})

router.post('/language/synonyms', async (req, res, next) => {
    let { body, language, sentiment } = req.body

    // returns synonym word in different language
    // correlated to sentiment
    // defaults to basicQuery is 'default' sentiment is given 
    const basicQuery = (word) => `
    WITH query_word AS (
        SELECT Word
        FROM Words W
        WHERE W.Word = '${word}'
    )
    SELECT ${language}
    FROM Language
    JOIN query_word qw on qw.Word = Language.English    
    `

    const emotionQuery = (word) => `
    WITH synonyms AS  (
        (SELECT s.Word2
        FROM Words w
        JOIN Synonyms s
        ON w.Word = s.Word1
        WHERE w.Word = '${word}'
        AND w.${sentiment} = 1)
        UNION
        (SELECT s.Word1
        FROM Words w
        JOIN Synonyms s
        ON w.Word = s.Word2
        WHERE w.Word = '${word}'
        AND w.${sentiment} = 1)
    )
    SELECT ${language}
    FROM Language
    JOIN synonyms ON Language.English = synonyms.Word2
    `

    const query = sentiment === 'default' ? basicQuery : emotionQuery

    const emotionEnglishQuery = (word) => `
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

    const newBody = sentiment === 'default' ? body : await processWords(body, queryFunc, emotionEnglishQuery)

    res.send({ body: await processLanguage(language, body, languageQuery, query), english: newBody })
})

router.post('/remove/emotion', async(req, res, next) => {
    let { body, emotion } = req.body

    // returns body that disembodies emotion2
    const query = (word) => `
    (SELECT s.Word2
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word1
    WHERE w.Word = '${word}'
    AND w.${emotion} = 0)
    UNION
    SELECT s.Word1
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word2
    WHERE w.Word = '${word}'
    AND w.${emotion} = 0
    `

    res.send({ body: await processWords(body, queryFunc, query) })
})

router.post('/emotions/statistics', async (req, res, next) => {
    let { body } = req.body

    const query = (word) => `
    WITH syns AS (
    (SELECT s.Word2
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word1
    WHERE w.Word = '${word}')
    UNION
    (SELECT s.Word1
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word2
    WHERE w.Word = '${word}'))
    SELECT 
    AVG(Positive) as avg_Positive,
    AVG(Negative) as avg_Negative,
    AVG(Anger) as avg_Anger,
    AVG(Anticipation) as avg_Anticipation,
    AVG(Disgust) as avg_Disgust,
    AVG(Fear) as avg_Fear,
    AVG(Joy) as avg_Joy,
    AVG(Sadness) as avg_Sadness,
    AVG(Surprise) as avg_Surprise,
    AVG(Trust) as avg_Trust
    FROM syns s JOIN Words w ON s.Word2 = w.Word
    `
    
    res.send({ statistics: await processAverage(body, averageQuery, query) })
})

router.post('/top/emotion', async(req, res, next) => {
    let { body } = req.body

    const query = (word) => `
    WITH emotionVals AS (WITH avg_emotions AS (WITH syns AS (SELECT s.Word2
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word1
    WHERE w.Word = '${word}'
    UNION
    SELECT s.Word1
    FROM Words w
    JOIN Synonyms s
    ON w.Word = s.Word2
    WHERE w.Word = '${word}')
    SELECT w.Word as Word, AVG(Positive) as avg_Positive, AVG(Negative) as avg_Negative,
            AVG(Anger) as avg_Anger, AVG(Anticipation) as avg_Anticipation, AVG(Disgust) as avg_Disgust,
            AVG(Fear) as avg_Fear, AVG(Joy) as avg_Joy, AVG(Sadness) as avg_Sadness,
            AVG(Surprise) as avg_Surprise, AVG(Trust) as avg_Trust
    FROM syns s
    JOIN Words w
    ON s.Word2 = w.Word)
    SELECT word, 'avg_Positive' col, avg_Positive value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Negative' col, avg_Negative value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Anger' col, avg_Anger value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Anticipation' col, avg_Anticipation value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Disgust' col, avg_Disgust value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Fear' col, avg_Fear value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Joy' col, avg_Joy value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Sadness' col, avg_Sadness value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Surprise' col, avg_Surprise value
    FROM avg_emotions
    UNION ALL
    SELECT word, 'avg_Trust' col, avg_Trust value
    FROM avg_emotions)
    SELECT col, value
    FROM emotionVals
    ORDER BY value DESC, col ASC;
    `

    res.send({ statistics: await processTop(body, topQuery, query)})
})

router.post('/poetify', async(req, res, next) => {
    let { body } = req.body

    const query = (word) => `
    WITH poetically_similar AS (
        WITH sentiment AS (
            SELECT Positive, Negative, Anger, Anticipation, Disgust, Fear, Joy, Sadness, Surprise, Trust
            FROM Words W
            Where W.Word = '${word}'
        )
        SELECT Word
        FROM Words W, sentiment
        WHERE
        W.Positive = sentiment.Positive AND
        W.Negative = sentiment.Negative AND
        W.Anger = sentiment.Anger AND
        W.Anticipation = sentiment.Anticipation AND
        W.Disgust = sentiment.Disgust AND
        W.Fear = sentiment.Fear AND
        W.Joy = sentiment.Joy AND
        W.Sadness = sentiment.Sadness AND
        W.Surprise = sentiment.Surprise AND
        W.Trust = sentiment.Trust
    )
    SELECT CASE
        WHEN EXISTS(SELECT * FROM poetically_similar)
        THEN (
            SELECT Word
            FROM poetically_similar
            ORDER BY RAND()
            LIMIT 1)
        ELSE (SELECT Word
            FROM Words
            WHERE Words.Word = '${word}')
    END as word
    FROM poetically_similar
    LIMIT 1;
    `

    res.send({ body: await processLanguage('word', body, languageQuery, query) })
})

router.get('/data/statistics', async (req, res, next) => {
    const query = `
    SELECT sum(W.positive = 1) * 100 / count(*) as pos_percent, sum(W.negative = 1) * 100 / count(*) as neg_percent
    FROM Words W
    `
    let p = new Promise(function (res, rej) {
        connection.query(query, function (err, results) {
            if (err) rej(err)
            else {
                res(results)
            }
        });
    });
    const result = await p
    res.send({ pos_percent: result[0]['pos_percent'], neg_percent: result[0]['neg_percent'] })
})

router.get('/options', async (req, res, next) => {
    const sentiments = [
        'positive',
        'negative'
    ]
    const emotions = [
        'anger',
        'anticipation',
        'disgust',
        'fear',
        'joy',
        'sadness',
        'surprise',
        'trust'
    ]
    res.send({ emotions, sentiments })
})

router.get('/languages', async (req, res, next) => {
    const languages = [
        "English", "Afrikaans","Albanian","Amharic","Arabic","Armenian","Azeerbaijani","Basque","Belarusian",
        "Bengali","Bosnian", "Bulgarian","Catalan","Cebuano","Chinese","Corsican","Croatian","Czech",
        "Danish","Dutch","Esperanto","Estonian","Finnish","French","Frisian","Galician","Georgian","German","Greek",
        "Gujarati","Haitian","Hausa","Hawaiian","Hebrew","Hindi","Hmong","Hungarian","Icelandic","Igbo","Indonesian",
        "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Korean", "Kurdish", "Kyrgyz",
        "Lao","Latin","Latvian","Lithuanian","Luxembourgish","Macedonian","Malagasy","Malay","Malayalam","Maltese",
        "Maori", "Marathi", "Mongolian", "Myanmar", "Nepali", "Norwegian", "Nyanja", "Pashto", "Persian", "Polish",
        "Portuguese","Punjabi","Romanian", "Russian", "Samoan", "Scots", "Serbian", "Sesotho", "Shona", "Sindhi",
        "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese","Swahili","Swedish","Tagalog","Tajik",
        "Tamil","Telugu","Thai","Turkish","Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Xhosa","Yiddish","Yoruba","Zulu"
    ]
    res.send({ languages })
})

module.exports = router