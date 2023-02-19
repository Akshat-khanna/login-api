import express from 'express'
import {signup, resetpassword, login, updatedetails} from '../controller/users.js';
const router = express.Router()

router.post('/signup', signup)
router.post('/resetpassword',resetpassword)
router.post('/login',login)
router.put('/updatedetails', updatedetails)

export default router