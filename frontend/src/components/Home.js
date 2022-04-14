import React, { useState } from 'react'
import './Home.css'
import { useHistory } from "react-router-dom";
import { getSynonyms } from '../fetcher';


const Home = () => {
    const [text, setText] = useState('Four score and seven years ago... Justin was and still is a king.')
    let history = useHistory();

    async function handleSubmit() {
        getSynonyms(text).then(res => {
            // console.log(res)
            history.push({ pathname: '/results', state: res })
        })
    }

    return (
        <div id='body'>
            <section>
                <h1>MOO-dify</h1>
                <textarea id="input-field" placeholder={text} onChange={event => setText(event.target.value)}></textarea>
                <input id="submit-button" type="button" value="COWculate" onClick={() => handleSubmit()} />
            </section>
        </div>

    )
};

export default Home;