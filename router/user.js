const express = require('express')
const { Use } = require('../db')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { validateAccount, validatePassword, validatePhone } = require('../router/validator');
const axios = require('axios')

router.post('/register', async (req, res) => {
    const { account1, password1, phone, pic, nickname } = req.body
    try {
        // 检查用户是否已存在
        const existingUser_ac = await Use.findOne({ account: account1 })
        const existingUser_ph = await Use.findOne({ phone: phone })
        if (existingUser_ac && existingUser_ph) {
            return res.send('用户已存在');
        }


        if (!validateAccount(account1)) {
            return res.send({ message: '账号格式错误：3-20 位字母、数字或下划线，字母开头' });
        }
        if (!validatePassword(password1)) {
            return res.send({ message: '密码格式错误：3-32 位，至少含字母+数字/特殊字符' });
        }
        if (!validatePhone(phone)) {
            return res.send({ message: '手机号格式错误：11 位数字，以 1 开头，第 2 位 3-9' });
        }
        // 加密密码
        const hashedPassword = await bcrypt.hash(password1, 10)

        // 创建新用户
        const newUser = new Use({
            account: account1,
            password: hashedPassword,
            phone,
            nickname: '',
            pic: '',
            comment: [],
            listtap: [],
            sign: '',
            day: ' - -'
        })

        // 保存用户到数据库
        await newUser.save()

        // 返回成功响应
        res.send('注册成功')
    } catch (error) {
        // 错误处理
        console.error('注册失败:', error)
        res.send('服务器错误')
    }
})

router.post('/login', async (req, res) => {
    const { account, password } = req.body
    try {
        const user_Ac = await Use.findOne({ account })
        if (user_Ac) {
            bcrypt.compare(password, user_Ac.password, (err, isMatch) => {
                if (err) {
                    console.error('验证密码时出错:', err)
                    return;
                }

                if (isMatch) {
                    const data = { ...user_Ac, password: '' }
                    //token
                    const tokenData = {
                        _id: data._doc._id,
                        id: data._doc.id
                    }
                    const tokenStr = jwt.sign(tokenData, config.jwtsSecreKey, { expiresIn: config.expiresIn })
                    res.send({
                        message: "登录成功",
                        token: 'Bearer ' + tokenStr
                    })
                } else {
                    console.log('密码不匹配')
                    res.send({
                        message: '密码不匹配'
                    })
                }
            })
        }
        else {
            res.send({
                message: '暂无此账号'
            })
        }
    } catch (error) {
        console.error('登录失败:', error)
        res.send('服务器错误')
    }
})

router.post('/Login_wei', async (req, res) => {
    try {
        const { code } = req.body;
        // 1. 去掉 url 里多余的空格
        const { data } = await axios.get(
            `https://api.weixin.qq.com/sns/jscode2session`,
            {
                params: {
                    appid: 'wxfe0cbc112f44df3f',
                    secret: 'a12e18eba669d3ff404b529c33180db5',
                    js_code: code,
                    grant_type: 'authorization_code'
                }
            }
        );

        const openid = data.openid
        console.log(data)

        const user_Ac = await Use.findOne({ password: openid })

        if (!user_Ac) {
            console.log(user_Ac)
            const newUser = new Use({
                account: 'weixin',
                password: data.openid,
                phone: '',
                nickname: '',
                pic: '',
                comment: [],
                listtap: [],
                sign: '',
                day: ' - -'
            })
            await newUser.save()

        }

        // 2. 只把可序列化的 data 返回给前端
        res.send({
            result: data,
            msg: '微信接口成功',
        });

    } catch (err) {
        // 3. 同样不要直接把 err 返回，只拿关键字段
        res.status(500).send({ code: 500, msg: '微信接口失败', detail: err.message });
    }
})

router.post('/weixin', async (req, res) => {
    const { openid } = req.body
    const user_Ac = await Use.findOne({ password: openid })
    
    const tokenData = {
        _id: user_Ac._doc._id,
        id: user_Ac._doc.id
    }
    const tokenStr = jwt.sign(tokenData, config.jwtsSecreKey, { expiresIn: config.expiresIn })
    res.send({
        message: "登录成功",
        token: 'Bearer ' + tokenStr
    })
})

module.exports = router