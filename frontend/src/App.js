import React, { useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { getMessage } from './fetcher'
import Home from './components/Home'
import Results from './components/Results'

const App = () => {

    const [hello, setHello] = useState('')

    const req = () => {
        getMessage().then(res => {
            setHello(res["message"])
        })
    }

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" render={(props) => <Home {...props} />} />
                <Route exact path="/results" render={(props) => <Results {...props} />} />
            </Switch>
        </BrowserRouter>
    )
}

export default App