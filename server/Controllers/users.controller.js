import User from '../Models/users.model.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const secret = process.env.JWT_SECRET


const UserController = {

    getUsers: async (req, res)=> {
        try {
            if (!req.user?.roles?.includes("admin")) {
                return res.status(403).json({ message: "Access denied" })
            }
            const users = await User.find({}, '-password')
            res.set('Cache-Control', 'no-store')
            res.status(200).json(users)
        } 
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const id = req.params.id;
            const isAdmin = req.user?.roles?.includes("admin")
            const isSelf = req.user?.userId === id
    
            if (!isAdmin && !isSelf) {
                return res.status(403).json({ message: "Access denied" })
            }
    
            const user = await User.findById(id, '-password')
    
            if (!user) {
                return res.status(404).json({ message: "user not found" })
            }
            res.status(200).json(user)
        } 
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    deleteUser: async (req, res)=>{
        const id = req.params.id
        const isAdmin = req.user?.roles?.includes("admin")
        const isSelf = req.user?.userId === id

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: "Access denied" })
        }
    
        try{
            await User.findByIdAndDelete(id)
            const user = await User.find({}, '-password')
            res.json(user)
        }
        catch(err){
            res.status(500).json({error: err.message})
        }  
    },

    addUser: async (req, res)=>{
        if (!req.user?.roles?.includes("admin")) {
            return res.status(403).json({ message: "Access denied" })
        }

        const {firstName, lastName, email, password, role, birthDate} = req.body
    
        try{
            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                birthDate
            })
    
            await newUser.save()
    
            const user = await User.find({}, '-password')
            res.status(200).json(user)
    
        }catch(err){
            res.status(500).json({error: err.message})
        }
    },

    updateUser: async (req, res) => {
        const id = req.params.id
        const {firstName, lastName, email, password, birthDate, role} = req.body

        const isAdmin = req.user?.roles?.includes("admin")
        const isSelf = req.user?.userId === id

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: "Access denied" })
        }
    
        try{
            const findUser = await User.findById(id)
    
            if(!findUser){
                return res.status(404).json({message: "User not found"})
            }
    
            findUser.firstName = firstName
            findUser.lastName = lastName
            findUser.email = email

            if (password) {
                findUser.password = await bcrypt.hash(password, 10)
            }

        
            if (isAdmin && role !== undefined) {
                findUser.role = role
            }

            findUser.birthDate = birthDate
            
            await findUser.save()
    
            const update = await User.find({}, '-password')
            
            res.status(200).json(update)
        }
        catch(err){
            res.status(500).json({error: err.message})
        }
    },

    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.userId, '-password')
    
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
    
            res.status(200).json(user)
        }
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: "משתשמ לא נמצא "})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: "סיסמא שגויה" })
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                    roles: [user.role]
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d"}
            )

            const userSafe = user.toObject()
            delete userSafe.password

            res.status(200).json({
                token,
                user: userSafe
            })
        }
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },


    register: async (req, res) => {
        
        const { firstName, lastName, email, password, birthDate } = req.body

        try {
            const existingUser = await User.findOne({ email })

            if (existingUser) {
                return res.status(400).json({ message: "משתמש עם אימייל זה כבר קיים" })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                birthDate
            })

            await newUser.save()

            const userSafe = newUser.toObject()
            delete userSafe.password

            res.status(201).json({
                message: "User created successfully",
                user: userSafe
            })
        }
        catch(err) {
            res.status(500).json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" })
        }
    }


}


export default UserController