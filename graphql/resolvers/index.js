const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

const User = require(`../../models/users/user`)
const Room = require(`../../models/rooms/room`)

const root = {
    allRooms: async () => {
        const allRooms = await Room.find()
        return allRooms
    },
    allUsers: async () => {
        const allUsers = await User.find()
        return allUsers
    },
    createRoom: async args => {
        const creatingRoom = await new Room ({
            name: args.name,
            rating: args.rating
        })

        const createdRoom = await creatingRoom.save()

        return createdRoom
    },
    createUser: async (args) => {
        try {

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
                throw Error (`Email already taken`)
            }

            return err
        }

    },
    loginUser: async (args, req) => {
        try {
            const logginInUser = await User.findOne({email: args.email})

            const result = await bcrypt.compare(args.password, logginInUser.password)

            if (result) {
                const {firstName, lastName, _id} = logginInUser
                const token = jwt.sign({id: logginInUser._id}, process.env.JWT_KEY)
                req.session.token = token
                return {userID: _id, firstName, lastName, token}
            } else {
                throw Error (`Email or Password Invalid`)
            }

        } catch (err) {
            return err
        }

    }
}

module.exports = root