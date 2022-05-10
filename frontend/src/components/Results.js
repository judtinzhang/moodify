import React, { useState, useEffect } from 'react';
import './Results.css';
import Select from 'react-select';
import { getOptions } from '../fetcher';
import { getSynonyms, removeEmotion, getStatistics, getLanguages, postLanguages, poetify, getDBStatistics, getTopEmotion, getBodyExists } from '../fetcher';
import Chart from './Chart';

const Results = (props) => {
    const ogText = props.history.location.state.ogText
    const [text, setText] = useState(props.history.location.state.res.body)
    const [sentimentsArr, setSentimentsArr] = useState([])
    const [emotionsArr, setEmotionsArr] = useState([])
    const [languagesArr, setLanuagesArr] = useState([])
    const [selectedOption, setSelectedOption] = useState([{ value: 'default', label: 'default' }]);
    const [selectedOptionL, setSelectedOptionL] = useState({ value: 'English', label: 'English' });
    const [statistics, setStatistics] = useState();
    const [statBool, setStatBool] = useState(false);
    const [englishText, setEnglishText] = useState(text);
    const [dbStatistics, setDbStatistics] = useState(null);
    const [topEmotion, setTopEmotion] = useState(null);
    const [existsPercentage, setExistsPercentage] = useState(null);

    // Gets all the original data from the fetcher for the first rendering of results page
    useEffect(() => {
        getOptions().then(res => {
            const tempArrSentiments = res.sentiments.map((sentiment) => {
                return { value: sentiment, label: sentiment };
            });
            const tempArrEmotions = res.emotions.map((sentiment) => {
                return { value: sentiment, label: sentiment };
            });
            setSentimentsArr(tempArrSentiments)
            setEmotionsArr(tempArrEmotions)
        })

        getStatistics(text).then(res => {
            const res_stats = res.statistics;
            if (res_stats.avg_Anger == null) {
                setStatBool(false)
            } else {

                const stats = [
                    { label: "Anger", y: res_stats.avg_Anger },
                    { label: "Anticipation", y: res_stats.avg_Anticipation },
                    { label: "Disgust", y: res_stats.avg_Disgust },
                    { label: "Fear", y: res_stats.avg_Fear },
                    { label: "Joy", y: res_stats.avg_Joy },
                    { label: "Sadness", y: res_stats.avg_Sadness },
                    { label: "Surprise", y: res_stats.avg_Surprise },
                    { label: "Trust", y: res_stats.avg_Trust },
                    { label: "Positive", y: res_stats.avg_Positive },
                    { label: "Negative", y: res_stats.avg_Negative },
                ]

                setStatistics(stats)
                setStatBool(true)
            }
        })

        getLanguages().then(res => {
            const tempLanguages = res.languages
            const tempArrLanguages = tempLanguages.map((language) => {
                return { value: language, label: language };
            });

            setLanuagesArr(tempArrLanguages)
        })

        getDBStatistics().then(res => {
            setDbStatistics(res)
        })

        getTopEmotion(englishText).then(res => {
            setTopEmotion(res.statistics)
        })

        getBodyExists(englishText).then(res => {
            setExistsPercentage(res.body)
        })
        
    }, []);

    // Handles changes the user makes with sentiment/emotion lists
    function handleSubmit(e, curr_arr) {
        const option = e;

        if (curr_arr.length > e.length) {
            setSelectedOptionL({ value: 'English', label: 'English' })
            setText(englishText)
        }

        let difference = curr_arr.filter(x => !option.includes(x));

        if (option.length == 0) {
            setText(ogText)
            setSelectedOptionL({ value: 'English', label: 'English' })
        }

        if (difference.length == 1) {
            // field was removed
            if (difference[0].value != "default") {
                removeEmotion(text, difference[0].value).then(res => {
                    setText(res.body)
                    setEnglishText(res.body)

                    getTopEmotion(res.body).then(res => {
                        setTopEmotion(res.statistics)
                    })
                    getBodyExists(res.body).then(res => {
                        setExistsPercentage(res.body)
                    })
                })
            }
        } else {
            // field was added
            const val = option[option.length - 1]

            getSynonyms(text, val.value).then(res => {
                setText(res.body)
                setEnglishText(res.body)

                getTopEmotion(res.body).then(res => {
                    setTopEmotion(res.statistics)
                })

                getBodyExists(res.body).then(res => {
                    setExistsPercentage(res.body)
                })

                getStatistics(res.body).then(res => {
                    const res_stats = res.statistics;
                    if (res_stats.avg_Anger == null) {
                        setStatBool(false)
                    } else {
                        const stats = [
                            { label: "Anger", y: res_stats.avg_Anger },
                            { label: "Anticipation", y: res_stats.avg_Anticipation },
                            { label: "Disgust", y: res_stats.avg_Disgust },
                            { label: "Fear", y: res_stats.avg_Fear },
                            { label: "Joy", y: res_stats.avg_Joy },
                            { label: "Sadness", y: res_stats.avg_Sadness },
                            { label: "Surprise", y: res_stats.avg_Surprise },
                            { label: "Trust", y: res_stats.avg_Trust },
                            { label: "Positive", y: res_stats.avg_Positive },
                            { label: "Negative", y: res_stats.avg_Negative },
                        ]

                        setStatistics(stats)
                        setStatBool(true)
                    }
                })

                if (selectedOptionL.value != 'English') {
                    postLanguages (englishText, selectedOptionL.value, option[option.length - 1].value).then(res => {
                        setEnglishText(res.english)
                        setText(res.body)
                    })
                }
            })
        }

        getTopEmotion(englishText).then(res => {
            setTopEmotion(res.statistics)
        })
        getBodyExists(englishText).then(res => {
            setExistsPercentage(res.body)
        })
    }

    // Handles when selecting a specific language
    function handleSubmitL(e) {
        const langauge = e.value

        if (langauge == "English") {
            setText(englishText)
        }

        postLanguages (englishText, langauge, selectedOption[selectedOption.length - 1].value).then(res => {
            setEnglishText(res.english)
            setText(res.body)
        })
    }

    // Handles the poetify button
    function handlePoetify() {
        poetify(englishText).then(res => {
            if (selectedOptionL.value != "English") {
                postLanguages (res.body, selectedOptionL.value, 'default').then(res => {
                    setEnglishText(res.english)
                    setText(res.body)
                })
            } else {
                setEnglishText(res.body)
                setText(res.body)
            }
        })
        getTopEmotion(englishText).then(res => {
            setTopEmotion(res.statistics)
        })
        getBodyExists(englishText).then(res => {
            setExistsPercentage(res.body)
        })

        getStatistics(englishText).then(res => {
            const res_stats = res.statistics;
            if (res_stats.avg_Anger == null) {
                setStatBool(false)
            } else {
                const stats = [
                    { label: "Anger", y: res_stats.avg_Anger },
                    { label: "Anticipation", y: res_stats.avg_Anticipation },
                    { label: "Disgust", y: res_stats.avg_Disgust },
                    { label: "Fear", y: res_stats.avg_Fear },
                    { label: "Joy", y: res_stats.avg_Joy },
                    { label: "Sadness", y: res_stats.avg_Sadness },
                    { label: "Surprise", y: res_stats.avg_Surprise },
                    { label: "Trust", y: res_stats.avg_Trust },
                    { label: "Positive", y: res_stats.avg_Positive },
                    { label: "Negative", y: res_stats.avg_Negative },
                ]

                setStatistics(stats)
                setStatBool(true)
            }
        })
    }

    return (
        <div id='results-body'>
            <div id='section'>
                <h1 id='results-header'>Here's the milk 🐮</h1>
            
                <div className="outer-div">
                    <div className="inner-div">
                        <Select
                            options={[
                                { value: 'default', label: 'default' },
                                { label: 'sentiments', options: sentimentsArr },
                                { label: 'emotions', options: emotionsArr },
                            ]}
                            value = {selectedOption}
                            onChange={(e) => {
                                const curr_arr = selectedOption
                                setSelectedOption(e)
                                handleSubmit(e, curr_arr)
                            }}
                            isMulti
                        />
                    </div>
                    <input id="poetify" type="button" value="poetify" onClick={() => {handlePoetify()}}/>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <Select
                        options={[
                            { label: 'languages', options: languagesArr },
                        ]}
                        value = {selectedOptionL}
                        onChange={(e) => {
                            setSelectedOptionL(e)
                            handleSubmitL(e)
                        }}
                    />
                </div>

                <div style={{textAlign: 'center', margin: '2rem 0', fontStyle: 'italic'}}>
                    {text}
                </div>

                <div style={{textAlign: 'center', margin: '2rem 0'}}>
                    <a href={"/"}>back</a>
                </div>

                {statBool && 
                    (<div>
                        <hr style={{ marginBottom: '2rem' }}/>
                        <Chart props={statistics} />
                    </div>)
                }

                {topEmotion != null && (
                    <div style={{ marginTop: '3rem', textAlign: 'center'}}>
                        The most impactful emotion was {topEmotion}.
                    </div>
                )}
                {existsPercentage != null && (
                    <div style={{ textAlign: 'center'}}>
                        {Math.round(existsPercentage)}% of the current words exist in our database.
                    </div>
                )}
                {dbStatistics != null && (
                    <div style={{ textAlign: 'center', paddingBottom: '3rem' }}>
                        The database is {dbStatistics.pos_percent}% positive and {dbStatistics.neg_percent}% negative.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Results;