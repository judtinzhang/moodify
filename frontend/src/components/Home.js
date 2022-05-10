import React, { useState } from 'react'
import './Home.css'
import { useHistory } from "react-router-dom";
import { getSynonyms } from '../fetcher';


const Home = () => {
    const [text, setText] = useState('Four score and seven years ago... Justin was and still is a king.')
    let history = useHistory();

    async function handleSubmit() {
        getSynonyms(text, "default").then(res => {
            history.push({ pathname: '/results', state: {res: res, ogText: text} })
        })
    }

    return (
        <div id='body'>
            <section>
                <h1>moodify</h1>
                <textarea id="input-field" placeholder={text} onChange={event => setText(event.target.value)}></textarea>
                <input className="submit-button" type="button" value="COWculate" onClick={() => handleSubmit()} />
            </section>
        </div>

    )
};

export default Home;