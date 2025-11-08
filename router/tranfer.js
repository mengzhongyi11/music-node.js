const express = require('express')
const {
    Use
} = require('../db')
const router = express.Router()

router.post('/comment', async (req, res) => {
    const { _id1, _id2, id, currentTab } = req.body
    console.log(_id2)
    let comments = []
    if (_id1 !== _id2) {
        const comment = {
            currentTab: currentTab,
            _id: _id2,
            video_id: id,
            status: 1
        }
        comments.push(comment)
        let updateField = {
            comment: comments
        }

        await Use.updateOne(
            { _id: _id1 },
            {
                $set: updateField
            }
        )
        return res.send({
            message: '更新完成',
        })
    }
    else {
        return res.send({
            message: '同一个人',
        })
    }
})


router.post('/upcomment', async (req, res) => {
    const {video_id, _id }= req.body
    console.log(video_id)
    await Use.updateOne(
        { _id: _id }, 
        {
            $pull: {
                comment: { video_id } 
            }
        }
    );

    return res.send({
        message: '完成',
    })
})

module.exports = router