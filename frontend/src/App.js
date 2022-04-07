import React, { useState } from 'react'

import { getMessage } from './fetcher'

const App = () => {

    const [hello, setHello] = useState('')

    const req = () => {
        getMessage().then(res => {
            setHello(res["message"])
        })
    }

    return (
        <div>
            { req() }
            { hello }
        </div>
    )
}

export default App