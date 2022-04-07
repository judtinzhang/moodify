import config from './config.json'

const getMessage = async () => {
    const res = await fetch(`http://${config.server_host}:${config.server_port}/hello`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getMessage
}