const express = require('express')
const {
    Heartplay,
    Heartsong,
    Loadsong,
    Focusvideo,
    Friendlist,
    StorageSync,
    FocusSync,
    videoData
} = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../config')
const e = require('cors')

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


//标记查询
router.post('/tagquery', async (req, res) => {
    const decoded = verifyToken(req, res)
    const id = decoded.id
    const { list, name } = req.body
    const models = {
        play: Heartplay,
        song: Heartsong,
        load: Loadsong,
        video: Focusvideo,
        friend: Friendlist,
        storage: StorageSync,
        focus: FocusSync
    }
    if (!models[name]) {
        return res.status(400).json({
            code: 400,
            message: '无效的 name 值',
            data: null
        })
    }

    // 查询所有匹配的文档
    const res_data = await models[name].find({ id })

    let data = []
    res_data.forEach((item, index) => {
        data[index] = item.data.id
    })

    // 遍历 list，设置 count 属性
    if (Array.isArray(list)) {
        list.forEach(item => {
            item.count = data.includes(item.id || item.item.id) ? 1 : 0;
        })
    }
    else {
        console.log(list)
        if (list.list) {
            list.list.count = data.includes(list.list.id) ? 1 : 0;
        }
        else {
            list.count = data.includes(list.id) ? 1 : 0;
        }
    }

    return res.send({
        message: '查询成功',
        result: list
    })
})

//查询
router.post('/querytlist', async (req, res) => {
    try {
        const decoded = verifyToken(req, res)
        const id = decoded.id
        const { name } = req.body
        let result = null
        switch (name) {
            case 'heart':
                result = await Heartsong.find({ id })
                break;
            case 'load':
                result = await Loadsong.find({ id })
                break;
            case 'video':
                result = await Focusvideo.find({ id })
                break;
            case 'friend':
                result = await Friendlist.find({ id })
                break;
            case 'storage':
                result = await StorageSync.find({ id })
                break;
            case 'focus':
                result = await FocusSync.find({ id })
                break;
            case 'play':
                result = await Heartplay.find({ id })
                break;
            default:
                return res.status(400).json({
                    code: 400,
                    message: '无效的 name 值',
                    data: null
                })
        }

        return res.send({
            message: '查询成功',
            data: result
        })
    } catch (error) {
        res.send('查询失败')
    }
})

async function addData(id, data, model) {
    const res_data = await model.find({ id })
    const idList = res_data.map(item => item.data.id)
    if (idList.includes(data.id) === false) {
        const newRecord = await model.create({
            id: id,
            data: data,
        })
        return newRecord
    }
    else {
        let delData = {}
        let res = {}
        delData.id = data.id
        res.data = delData
        const result = await deleteData(id, res, model)
        return result
    }

}

//添加
router.post('/addData', async (req, res) => {
    try {
        const decoded = verifyToken(req, res)
        const id = decoded.id
        const { name, data } = req.body
        const models = {
            play: Heartplay,
            song: Heartsong,
            load: Loadsong,
            video: Focusvideo,
            friend: Friendlist,
            storage: StorageSync,
            focus: FocusSync,
        }
        let result = null

        if (!models[name]) {
            return res.status(400).json({
                code: 400,
                message: '无效的 name 值',
                data: null
            })
        }

        result = await addData(id, data, models[name])

        if (result !== '取消成功') {
            return res.send({
                message: '添加成功',
                data: result
            })
        }
        else {
            return res.send({
                message: result,
            })
        }
    } catch (error) {
        console.log(error)
    }
})

async function deleteData(id, data, model) {
    const res_data = await model.find({ id })
    const idList = res_data.map(item => {
        item = item.data.id
        return item
    })
    console.log(idList)
    console.log(data)
    const Data = data
    if (data.id == undefined) {
        data = Data.data
    }
    console.log(idList.includes(data.id))
    if (idList.includes(data.id) === true) {
        console.log(1)
        await model.deleteOne({ 'data.id': data.id })
        return '取消成功'
    }
    else {
        return
    }

}

router.post('/deleteData', async (req, res) => {
    try {
        const decoded = verifyToken(req, res)
        const id = decoded.id
        const { name, data } = req.body
        const models = {
            play: Heartplay,
            song: Heartsong,
            load: Loadsong,
            video: Focusvideo,
            friend: Friendlist,
            storage: StorageSync,
            focus: FocusSync
        }

        if (!models[name]) {
            return res.status(400).json({
                code: 400,
                message: '无效的 name 值',
                data: null
            })
        }

        const result = await deleteData(id, data, models[name])

        return res.send({
            message: result,
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router