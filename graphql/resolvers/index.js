const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

const authJWT = require(`../../auth/auth`)
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
            const allRooms = await Room.find()
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

    // MUTATIONS
    createRoom:  async (args, req) => {
        
        let token

        if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
           token = req.headers.auth.split(` `)[1]

           jwt.verify(token, process.env.JWT_KEY)

           const creatingRoom = await new Room ({
            name: args.name,
            rating: args.rating,
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
    bookARoom: async (args, req) => {
        try {

            let token

            if (req.headers.auth && req.headers.auth.startsWith(`Bearer`)) {
            token = req.headers.auth.split(` `)[1]

            const decoded = jwt.verify(token, process.env.JWT_KEY)

            const newlyBookedRoom = new BookedRoom({
                bookedBy: args.bookedBy,
                theBookedRoom: args.theBookedRoom,
                bookAt: args.bookAt
            })

            const savedBookedRoom = await newlyBookedRoom.save()
            
            const currentUser = await User.findOneAndUpdate({_id: decoded.id}, {
                $addToSet: {
                    roomsBooked: savedBookedRoom._id
                }
            })

            const {_id , bookedBy, theBookedRoom, bookAt } = savedBookedRoom

            return {_id, bookedBy, theBookedRoom, bookAt}
            
            }

            if (!token) {
                throw Error (`Unauthorized.`)
            }
            
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = root