const express = require('express')
const { Use, pubilsh } = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../config')
const bcrypt = require('bcrypt')
const { validateAccount, validatePassword, validatePhone } = require('../router/validator');

function verifyToken(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '未提供有效的 Token' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtsSecreKey);
        return decoded; // 返回解析后的用户信息
    } catch (error) {
        console.error('Token 验证失败:', error);
        return res.status(401).json({ error: '无效的 Token' });
    }
}
//查询数据
router.post('/queryInfo', async (req, res) => {
    const decoded = verifyToken(req, res)
    const id = decoded.id
    const result = await Use.findOne({ id })

    if (result.modifiedCount === 0) {
        return res.status(404).json({
            code: 404,
            message: '用户未找到',
            data: null
        })
    }

    return res.send({
        message: '查询成功',
        data: result
    })
})

//更新数据
router.post('/updateInfo', async (req, res) => {

    try {
        const decoded = verifyToken(req, res)
        const { res_data, idx } = req.body
        let updateField = null
        console.log(res_data)
        switch (idx) {
            case '0':
                updateField = { nickname: res_data };
                break;
            case '1':
                if (!validateAccount(res_data)) {
                    return res.send({ message: '账号格式错误：3-20 位字母、数字或下划线，字母开头' });
                }
                updateField = { account: res_data };
                break;
            case '2':
                if (!validatePassword(res_data)) {
                    return res.send({ message: '密码格式错误：3-32 位，至少含字母+数字/特殊字符' });
                }
                const hashedPassword = await bcrypt.hash(res_data, 10)
                updateField = { password: hashedPassword };
                break;
            case '3':
                if (!validatePhone(phone)) {
                    return res.send({ message: '手机号格式错误：11 位数字，以 1 开头，第 2 位 3-9' });
                }
                updateField = { phone: res_data };
                break;
            case '4':
                updateField = { pic: res_data };
                break;
            case '5':
                updateField = { sign: res_data };
                break;
            case '6':
                updateField = { day: res_data };
                break;
            default:
                return res.status(400).json({
                    code: 400,
                    message: '无效的 idx 值',
                    data: null
                })
        }
        console.log(updateField) 
        const result = await Use.updateOne(
            { id: decoded.id },
            {
                $set: updateField
            }
        )
        return res.send('更新成功')

    } catch (error) {
        return res.status(404).json({
            code: 404,
            message: '更新失败' + error,
            data: null
        })
    }
})

//查询发布
router.post('/querytPubilsh', async (req, res) => {
    try {
        const decoded = verifyToken(req, res)
        const id = decoded.id
        const result = await pubilsh.find({ 'data.artistId': id })

        return res.send({
            message: '查询成功',
            data: result
        })
    } catch (error) {
        res.send('查询失败')
    }
})

router.post('/upPass', async (req, res) => {
    const { data, phone } = req.body
    if (!validatePassword(data)) {
        return res.send({ message: '密码格式错误：3-32 位，至少含字母+数字/特殊字符' });
    }
    const hashedPassword = await bcrypt.hash(data, 10)
    updateField = { password: hashedPassword };
    const result = await Use.updateOne(
        { phone: phone },
        {
            $set: updateField
        }
    )
    return res.send('更新成功')

})

let data_code = ''

router.post('/querytPhone', async (req, res) => {
    const phone = req.body.phone
    if (!validatePhone(phone)) {
        return res.send({ message: '手机号格式错误：11 位数字，以 1 开头，第 2 位 3-9' });
    }
    const result = await Use.findOne({ phone })
    if (result) {
        const code = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
        data_code = code
        return res.send({
            data: code
        })
    }
    else {
        return res.send({
            message: '没有该电话号码',
        })
    }
})


router.post('/contrast', async (req, res) => {
    const { code, time } = req.body
    if (code === data_code && time <= 300) {
        const modify = true
        return res.send({
            data: modify
        })
    }
    else if (code !== data_code && time <= 300) {
        return res.send({
            message: '验证码不对',
        })
    }
    else if (time > 300) {
        return res.send({
            message: '验证码已过时',
        })
    }
})

module.exports = router