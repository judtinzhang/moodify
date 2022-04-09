import React from 'react'
import './Home.css'

const Home = () => {
    return (
        <div id='body'>
            <section>
                <h1>MOO-dify</h1>
                <textarea id="input-field" placeholder="Four score and seven years ago... Justin was and still is a king."></textarea>
                <input id="submit-button" type="button" value="COWculate" />
            </section>  
        </div>
       
    )
};

export default Home;