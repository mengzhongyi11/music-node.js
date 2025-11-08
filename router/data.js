const express = require('express')
const {
    videoData,
    songData,
    pubilsh,
    histroy,
    Focusvideo
} = require('../db')
const Fuse = require('fuse.js')
const router = express.Router()

//添加
router.post('/addData', async (req, res) => {
    try {
        const { name, Data } = req.body
        const models = {
            video: videoData,
            song: songData
        }
        let result = null

        if (!models[name]) {
            return res.status(400).json({
                code: 400,
                message: '无效的 name 值',
                data: null
            })
        }

        result = await addData(Data, models[name])

        if (result !== '删除成功') {
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

async function addData(data, model) {
    const results = []

    for (const item of data) {
        let id = item.id
        const existing = await model.findOne({ id })

        if (!existing) {
            const newRecord = await model.create({ id: item.id, data: item })
            results.push(newRecord)
        }
    }

    return results
}

//查询
router.post('/querytlist', async (req, res) => {
    try {
        const { name } = req.body
        let result = null
        switch (name) {
            case 'video':
                result = await videoData.find()
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

//更新数据
router.post('/updateData', async (req, res) => {

    try {
        const { id, data } = req.body

        const Data = { data: data }

        await videoData.updateOne(
            { id: String(id) },
            { $set: Data }
        )

        const result = await Focusvideo.findOne({ 'data.id': String(id) })


        if (result) {
            console.log(1)
            await Focusvideo.updateOne(
                { 'data.id': String(id) },
                {
                    $set:
                    {
                        'data.data': data,
                        'data.id': String(id),
                        'data.count': 1
                    },
                }
            )
        }

        return res.send({
            message: '更新成功',
        })

    } catch (error) {
        return res.status(404).json({
            code: 404,
            message: '更新失败' + error,
            data: null
        })
    }
})

router.post('/addPubilsh', async (req, res) => {
    try {
        const data = req.body.data.data
        const cover = data.cover
        const existing = await pubilsh.findOne({ 'data.cover': cover })

        if (!existing) {
            await pubilsh.create({ data: data })
        }
        else {
            return res.send({
                message: '已存在该视频',
            })
        }

        const result = await pubilsh.findOne({ 'data.cover': cover })
        const Data = req.body.data
        data.count = 0
        await videoData.create({ id: result.id, data })

        return res.send({
            message: '发布成功',
        })
    } catch (error) {
        return res.status(404).json({
            code: 404,
            message: '发布失败' + error,
            data: null
        })
    }

})

//查询发布
router.post('/querytPubilsh', async (req, res) => {
    try {
        const id = req.body.id
        const result = await pubilsh.find({ 'data.artistId': id })

        return res.send({
            message: '查询成功',
            data: result
        })
    } catch (error) {
        res.send('查询失败')
    }
})

router.post('/search', async (req, res) => {
    const text = req.body.text
    const result = await songData.find()
    const fuse = new Fuse(result, {
        keys: ['data.name'],
        threshold: 0.3
    })
    const data = fuse.search(text)
    return res.send({
        message: '查询成功',
        data: data
    })
})

//历史搜索
router.post('/histroy', async (req, res) => {
    const { id } = req.body
    const result = await histroy.find({ id: id })
    if (result) {
        return res.send({
            message: '查询成功',
            data: result
        })
    }
})

router.post('/Addhistroy', async (req, res) => {
    const { id, name } = req.body
    const result = await histroy.find({ id: id })
    const nameList = result.map(item => item.name)
    if (nameList.includes(name) === false) {
        await histroy.create({
            id: id,
            name: name,
        })
    }
})

//随机搜索
router.post('/Rankdomsearch', async (req, res) => {
    const randomIndex = Math.floor(Math.random() * await songData.countDocuments())
    const doc = await songData.findOne().skip(randomIndex).lean()
    res.send({
        data: doc
    })
})

module.exports = router