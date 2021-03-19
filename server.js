require('dotenv').config()
const express = require(`express`)
const { graphqlHTTP } = require(`express-graphql`)
const mongoose = require(`mongoose`)
const createError = require(`http-errors`)

const schema = require(`./graphql/schema/schema`)
const root = require(`./graphql/resolvers/index`)

const PORT = process.env.PORT || 8000

const app = express()

mongoose.connect(`mongodb+srv://TmAdmin:${process.env.MONGO_PASSWORD}@cluster0.c7khy.mongodb.net/hotel-lorem-DB?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

app.use(`/graphql`, graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})