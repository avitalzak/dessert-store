import express from "express"; 
import UserController from "../Controllers/users.controller.js"
import { requireAdmin, requireAuth } from "../middlewares/Middleware.js";


const UserRouter = express.Router()

UserRouter.get('/me', requireAuth, UserController.getMe)
UserRouter.get('/', requireAuth, requireAdmin, UserController.getUsers)
UserRouter.get('/:id', requireAuth, UserController.getUserById)
UserRouter.delete('/deleteUser/:id', requireAuth, requireAdmin, UserController.deleteUser)
UserRouter.post('/addUser', requireAuth, requireAdmin, UserController.addUser)
UserRouter.put('/updateUser/:id', requireAuth, requireAdmin, UserController.updateUser)
UserRouter.post('/login', UserController.login)
UserRouter.post('/register', UserController.register)


export default UserRouter 