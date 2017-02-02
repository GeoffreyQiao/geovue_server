import fs from 'fs'
import path from 'path'
import favicon from 'serve-favicon'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'



const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))