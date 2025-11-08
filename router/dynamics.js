const express = require('express')
const { dynamics, Use } = require('../db')
const router = express.Router()

router.post('/share', async (req, res) => {
    const { id, item, type, desc, time, title } = req.body
    await dynamics.create({ id: id, item: item, type: type, desc: desc, title: title, time: time })
    res.send({
        message: '成功'
    })
})

router.post('/data', async (req, res) => {
    const id = req.body.id
    const data = await dynamics.find({ id: id })
    res.send({
        message: '成功',
        data: data
    })
})

router.post('/queryInfo', async (req, res) => {
    const id = req.body.id
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

module.exports = router