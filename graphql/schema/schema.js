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
        type: String!
        price: Int!
        maxPersons: Int!
        description: String!
        rating: Int!
    }

    type BookedRooms {
        _id: ID!
        bookedBy: ID!
        theBookedRoom: [Rooms]
        bookAt: String!
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
        isAdmin: Boolean
    }

    type Mutation {
        createRoom(
            name: String!
            type: String!
            price: Int!
            maxPersons: Int!
            description: String!
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

        bookARoom(
            bookedBy: ID!
            theBookedRoom: ID!
            bookAt: String!
        ): BookedRooms

    }

`)

module.exports = schema