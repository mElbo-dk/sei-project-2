const express = require( 'express' )
const app = express()
const port = process.env.port || 4000

app.use(express.static(`${__dirname}/dist`))

app.use('/*', (req,res) => res.sendFile(`${__dirname}/dist/index.js)`))
app.listen(port,() => console.log(`Ex[res is running ${port})`))

