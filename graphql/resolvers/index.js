const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

const User = require(`../../models/users/user`)
const Room = require(`../../models/rooms/room`)
const BookedRoom = require(`../../models/bookedRoom/bookedRoom`)

const root = {
    // QUERIES
    allRooms: async (args, req) => {

        let token

        if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            jwt.verify(token, process.env.JWT_KEY)
            const allRooms = await Room.find().populate('userWhoBooked').populate({
                path: 'userWhoBooked',
                populate: 'bookedBy'
            })
            return allRooms
        }

        if (!token) {
            throw Error (`Unauthorized.`)
        }

    },
    allUsers: async () => {
        const allUsers = await User.find()
        return allUsers
    },
    loginUser: async (args, req) => {
        try {
            const logginInUser = await User.findOne({email: args.email}).populate('roomsBooked').populate({
                path: 'roomsBooked',
                populate: 'theBookedRoom'
            })

            const result = await bcrypt.compare(args.password, logginInUser.password)

            if (result) {
                const {firstName, lastName, _id, isAdmin, roomsBooked} = logginInUser
                const token = jwt.sign({id: logginInUser._id}, process.env.JWT_KEY)
                req.session.token = token

                return {userID: _id, firstName, lastName, token, isAdmin, roomsBooked}
            } else {
                throw Error (`Email or Password Invalid.`)
            }

        } catch (err) {
            throw Error (`Email or Password Invalid.`)
        }

    },
    userInfo: async (args, req) => {

        let token

        if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            jwt.verify(token, process.env.JWT_KEY)
            const currentUser = await User.findOne({_id: args.userID}).populate('roomsBooked').populate({
                path: 'roomsBooked',
                populate: 'theBookedRoom'
            })
            const {firstName, lastName, _id, isAdmin, roomsBooked, username, email} = currentUser

            return {userID: _id, firstName, email, lastName, isAdmin, roomsBooked, username}

        }

        if (!token) {
            throw Error (`Unauthorized.`)
        }

    },

    // MUTATIONS

    createRoom:  async (args, req) => {
        
        let token

        if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            jwt.verify(token, process.env.JWT_KEY)

            const creatingRoom = await new Room ({
                name: args.name,
                price: args.price,
                description: args.description,
                type: args.type,
                maxPersons: args.maxPersons
            })

            const createdRoom = await creatingRoom.save()

            return createdRoom
           
        }

        if (!token) {
            throw Error (`Unauthorized.`)
        }

    },
    createUser: async (args) => {
        try {

            if (args.firstName === "" || args.lastName === "" || args.email === "" || args.password === "" || args.username === "" ) {
                throw new Error (`Please input all fields.`)
            }

            const hashedPassword = await bcrypt.hash(args.password, 10)

            const upcomingUser = await new User ({
                firstName: args.firstName,
                lastName: args.lastName,
                username: args.username,
                email: args.email,
                password: hashedPassword
            })
    
            const newUser = await upcomingUser.save()
            const {firstName, lastName, _id} = newUser

            const token = jwt.sign({id: newUser._id}, process.env.JWT_KEY)

            return {userID: _id, firstName, lastName, token}
        } catch (err) {

            if (err.code === 11000) {
                throw Error (`Email already taken.`)
            }

            return err
        }

    },
    bookARoom: async (args, req) => {
        try {

            let token

            if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            const decoded = jwt.verify(token, process.env.JWT_KEY)

            const roomID = args.theBookedRoom

            const newlyBookedRoom = new BookedRoom({
                bookedBy: args.bookedBy,
                theBookedRoom: args.theBookedRoom,
                bookAt: args.bookAt,
                isCancelled: false,
                isDone: false
            })

            const savedBookedRoom = await newlyBookedRoom.save()

            const theChosenRoom = await Room.findOneAndUpdate({_id: roomID}, {
                $addToSet: {
                    userWhoBooked: savedBookedRoom._id
                }
            })
            
            const currentUser = await User.findOneAndUpdate({_id: decoded.id}, {
                $addToSet: {
                    roomsBooked: savedBookedRoom._id
                }
            })

            const {_id , bookedBy, theBookedRoom, bookAt, isCancelled, isDone } = savedBookedRoom

            return {_id, bookedBy, theBookedRoom, bookAt, isCancelled, isDone}
            
            }

            if (!token) {
                throw Error (`Unauthorized.`)
            }
            
        } catch (err) {
            console.log(err)
        }
    },
    cancelRoom: async (args, req) => {
        
        let token

        try {

            if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            jwt.verify(token, process.env.JWT_KEY)

            const cancellingBookedRoom = await BookedRoom.findOneAndUpdate({_id: args.roomID}, {isCancelled: true})
            
            return cancellingBookedRoom.name

        }

            if (!token) {
                throw Error (`Unauthorized.`)
            }
            
        } catch (error) {
            console.log(err)
        }

    },
    markAsDone: async (args, req) => {

        let token

        try {

            if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            jwt.verify(token, process.env.JWT_KEY)

            const markAsDoneRoom = await BookedRoom.findOneAndUpdate({_id: args.roomID}, {isDone: true})
            
            return markAsDoneRoom.name

        }

            if (!token) {
                throw Error (`Unauthorized.`)
            }
            
        } catch (error) {
            console.log(err)
        }

    },
    removeRoom: async (args, req) => {

        let token

        try {

            if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            jwt.verify(token, process.env.JWT_KEY)

            const removeRoom = await BookedRoom.findOneAndDelete({_id: args.roomID})
            
            return removeRoom.name

        }

            if (!token) {
                throw Error (`Unauthorized.`)
            }
            
        } catch (error) {
            console.log(err)
        }

    },
    deleteRoom: async (args, req) => {

        let token

        try {

            if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            jwt.verify(token, process.env.JWT_KEY)

            const deleteRoom = await Room.findOne({_id: args.roomID})

            deleteRoom.userWhoBooked.map(async (eachBookedRoom) => {
                await BookedRoom.findOneAndDelete({_id: eachBookedRoom})
            })

            const deleteTheActualRoom = await Room.findOneAndDelete({_id: args.roomID})

            return deleteTheActualRoom.name


        }

            if (!token) {
                throw Error (`Unauthorized.`)
            }
            
        } catch (error) {
            console.log(err)
        }

    }
}

module.exports = root