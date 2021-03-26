const { buildSchema } = require(`graphql`)

const schema = buildSchema(`

    type Query {
        allRooms: [Rooms]
        allUsers : [Users]
        loginUser(email: String! password: String!): Users
    }

    type Rooms {
        _id: ID!
        name: String!
        type: String!
        price: Int!
        maxPersons: Int!
        description: String!
        rating: Int!
        userWhoBooked: [BookedRooms]
    }

    type BookedRooms {
        _id: ID!
        bookedBy: Users
        theBookedRoom: [Rooms]
        bookAt: String!
        isCancelled: Boolean
        isDone: Boolean
    }

    type Users {
        userID: ID!
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        password: String!
        token: String!
        isAdmin: Boolean
        roomsBooked: [BookedRooms]!
    }

    type authData {
        userID: String!
        firstName: String!
        lastName: String!
        roomsBooked: [BookedRooms]!
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