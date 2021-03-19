const { buildSchema } = require(`graphql`)

const schema = buildSchema(`

    type Query {
        allRooms: [Rooms]
        allUsers : [Users]
        loginUser(email: String! password: String!): authData
    }

    type Rooms {
        _id: ID!
        name: String!
        rating: Int!
    }

    type Users {
        _id: ID!
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        password: String!
        token: String!
    }

    type authData {
        userID: String!
        firstName: String!
        lastName: String!
        token: String!
    }

    type Mutation {
        createRoom(
            name: String!
            rating: Int!
        ): Rooms

        createUser(
            firstName: String!
            lastName: String!
            username: String!
            email: String!
            password: String!
        ): authData

        loginUser(
            email: String!
            password: String!
        ): Users
    }

`)

module.exports = schema