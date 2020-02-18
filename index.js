const twit = require('twit')
const fs = require('fs')
require('dotenv').config()

const T = new twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const max_id = 1031582835545710592

T.get('statuses/user_timeline', { user_id: process.env.USER_ID, max_id: max_id, exclude_replies: false, count: 200 }, (err, data, res) => {
    if (err) throw err

    data.forEach(tweet => {
        T.post('statuses/destroy/:id', { id: tweet.id_str }, (err, data, res) => {
            if (err) throw err

            const stringData = JSON.stringify(data, null, '\t')

            fs.appendFile('files/data.json', stringData, (err) => {
                if (err) throw err
                console.log(`Deleted tweet id ${tweet.id_str} written to data.json`)
            })
        })
    })
})