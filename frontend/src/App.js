import React, { useState } from 'react'

import { getMessage } from './fetcher'
import Home from './components/Home'

const App = () => {

    const [hello, setHello] = useState('')

    const req = () => {
        getMessage().then(res => {
            setHello(res["message"])
        })
    }

    return (
        <div>
            {/* { req() }
            { hello } */}
            <Home />
        </div>
    )
}

export default App