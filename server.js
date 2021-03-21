require('dotenv').config()
const express = require(`express`)
const { graphqlHTTP } = require(`express-graphql`)
const mongoose = require(`mongoose`)
const cors = require(`cors`)
const session = require(`express-session`)
// const helmet = require(`helmet`)
const schema = require(`./graphql/schema/schema`)
const root = require(`./graphql/resolvers/index`)

const PORT = process.env.PORT || 8000

const app = express()

app.use(cors())
// app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

mongoose.connect(`mongodb+srv://TmAdmin:${process.env.MONGO_PASSWORD}@cluster0.c7khy.mongodb.net/hotel-lorem-DB?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

app.use(`/graphql`, graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})