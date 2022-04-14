import React from 'react'
import './Results.css'

const Results = (props) => {
    const text = props.history.location.state.body
    return (
        <div id='results-body'>
            <section>
                <h1 id='results-header'>Here's the milk 🐮</h1>
                {text}
            </section>
        </div>
    )
}

export default Results;