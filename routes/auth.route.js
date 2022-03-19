const { Router } = require('express')
const router = Router()
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
router.post('/registration',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный пароль').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }
            const { email, password } = req.body
            const isUser = await User.findOne({ email })

            if (isUser) { 
                return res.status(300).json({ message: "Данный Email уже занят." })
            } 
            const hashPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email,
                password: hashPassword
            })
            await user.save()
            res.status(201).json({ message: "Пользователь создан." })
            
        } catch (error) {
            console.log(error)
        }
})
router.post('/login',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при авторизации'
                })
            }
            const { email, password } = req.body
            const user = await User.findOne({ email })
            console.log('===>', user, password)
            if(!user) {
                return res.status(400).json({
                    message: 'Данного email нет в базе данных!'
                })
            } 

            bcrypt.compare(password, user.password, (err, data) => {
                if(err) {
                    throw err
                }
                if(data) {
                    const jwtSecret = 'wfeqwwqqerjhbqlFaiSFii13913934h3c3038FKm'
                    const token = jwt.sign(
                        {userId: user.id},
                        jwtSecret,
                        {expiresIn: '1h'}
                        )
                        res.json({
                            token,
                            userId: user.id
                        })
                } else {
                    return res.status(400).json({
                        message: 'Пароли не совпадают!'
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
})
module.exports = router