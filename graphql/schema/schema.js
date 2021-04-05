const { buildSchema } = require(`graphql`)

const schema = buildSchema(`

    type Query {
        allRooms: [Rooms]
        allUsers : [Users]
        loginUser(email: String! password: String!): Users
        userInfo(userID: ID!): Users
    }

    type Rooms {
        _id: ID!
        name: String
        type: String!
        price: Int!
        maxPersons: Int!
        description: String!
        rating: [Review]
        userWhoBooked: [BookedRooms]
    }

    type Review {
        _id: ID!
        rating: Int
        ratingBy: Users
        theRoomRated: Rooms
    }

    type BookedRooms {
        _id: ID!
        bookedBy: Users
        theBookedRoom: [Rooms]
        rating: Review
        bookAt: String!
        isCancelled: Boolean
        isDone: Boolean
        isRated: Boolean
    }

    type Users {
        userID: ID
        firstName: String
        lastName: String
        username: String
        email: String
        password: String
        token: String
        isAdmin: Boolean
        roomsBooked: [BookedRooms]
        roomsRated: [Review]
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
        ): Users

        bookARoom(
            bookedBy: ID!
            theBookedRoom: ID!
            bookAt: String!
        ): BookedRooms

        cancelRoom(
            roomID: ID!
        ): Rooms

        markAsDone(
            roomID: ID!
        ): Rooms

        removeRoom(
            roomID: ID!
        ): Rooms

        deleteRoom(
            roomID: ID!
        ): Rooms

        unCancelRoom(
            roomID: ID!
        ): Rooms

        rateRoom(
            userID: ID!
            roomID: ID!
            rating: Int!
            theRoomToUpdate: ID!
        ): Review

        editRate(
            reviewID: ID!
            newRating: Int!
        ): Review

        editMe(
            userID: ID!
            firstName: String!
            lastName: String!
        ): Users

    }

`)

module.exports = schema