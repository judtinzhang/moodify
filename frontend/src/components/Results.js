import React, { useState, useEffect } from 'react';
import './Results.css';
import Select from 'react-select';
import { getOptions } from '../fetcher';
import { getSynonyms, removeEmotion, getStatistics } from '../fetcher';
import Chart from './Chart';

const Results = (props) => {
    const ogText = props.history.location.state.ogText
    const [text, setText] = useState(props.history.location.state.res.body)
    const [sentimentsArr, setSentimentsArr] = useState([])
    const [emotionsArr, setEmotionsArr] = useState([])
    const [selectedOption, setSelectedOption] = useState([{ value: 'default', label: 'default' }]);
    const [statistics, setStatistics] = useState();

    useEffect(() => {
        // document.getElementById("poetify").disabled = true;
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
            console.log(res)
            const res_stats = res.statistics;
            console.log(res_stats)
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
        })
    }, []);

    function handleSubmit(e) {
        const option = e;

        let difference = selectedOption.filter(x => !option.includes(x));
        console.log(difference);  

        if (option.length == 0) {
            setText("OG text: " + ogText)
        }

        if (difference.length == 1) {
            // field was removed
            console.log("HERE")
            if (difference[0].value != "default") {
                removeEmotion(text, difference[0].value).then(res => {
                    console.log(res)
                    setText(res.body)
                })
            }
        } else {
            // field was added
            console.log(option)
            const val = option[option.length - 1]
            if (option.length == 1) {
                getSynonyms(ogText, val.value).then(res => {
                    console.log("HERE1")
                    setText(res.body)
                    console.log(res)
                })
            } else {
                const val = option[option.length - 1]
                getSynonyms(text, val.value).then(res => {
                    console.log("HERE2")
                    setText(res.body)
                    console.log(res)
                })
            }
        }

        setSelectedOption(e)
    }

    function handlePoetify() {
        console.log("CLICKED POETIFY")
    }

    return (
        <div id='results-body'>
            <div id='section'>
                <h1 id='results-header' style={{textAlign: 'center'}}>Here's the milk 🐮</h1>
                <Select
                    options={[
                        { value: 'default', label: 'default' },
                        { label: 'sentiments', options: sentimentsArr },
                        { label: 'emotions', options: emotionsArr }
                    ]}
                    value = {selectedOption}
                    // onInputChange={() => {handleSubmit()}}
                    onChange={(e) => {
                        // console.log(e)
                        // setSelectedOption(e)
                        handleSubmit(e)
                    }}
                    isMulti
                    style={{ maxWidth: '100px' }}
                />

                <div>
                    <input id="poetify" type="button" value="poetify" onClick={() => {handlePoetify()}}/>
                </div>

                <div style={{textAlign: 'center', marginTop: '2rem', fontStyle: 'italic'}}>
                    {text}
                </div>

                <Chart props={statistics} />
            </div>
        </div>
    )
}

export default Results;