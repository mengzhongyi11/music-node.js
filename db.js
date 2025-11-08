const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.connect("mongodb://localhost:27017/songList")
    .then(() => {
        console.log('成功')
    })
    .catch((err) => {
        console.log('失败', err)
    })

const userInfoSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    pic: {
        type: String,
    },
    nickname: {
        type: String,
    },
    comment: {
        type: Array
    },
    listtap: {
        type: Array
    },
    sign: {
        type: String
    },
    day: {
        type: String
    }
})

const songListSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    },
})

const playListSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    },
})

const StorageSyncSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    },
})

const loadListSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    }
})

const focusVideoSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    },
    vide: {
        type: String,
    },
})

const friendListSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    }
})

const FocusSyncSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    }
})

const videoDataSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    }
})

const songDataSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: Object,
    }
})

const pubilshDataSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    data: {
        type: Object,
    },
    count: {
        type: Number
    }
})

const dynamicsDataSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    item: {
        type: Array,
    },
    type: {
        type: String,
    },
    desc: {
        type: String,
    },
    title: {
        type: String,
    },
    time: {
        type: String,
    }
})

const histroyDataSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String
   }
})


// 启用自增插件：指定自增字段（如 id），可选配置集合名等
userInfoSchema.plugin(AutoIncrement, {
    inc_field: 'id', // 要自增的字段名
    id: 'lose_seq',  // 计数器在数据库里的标识（存在 counters 集合）
    start_seq: 1     // 起始值，默认从 1 开始
})

// 启用自增插件：指定自增字段（如 id），可选配置集合名等
pubilshDataSchema.plugin(AutoIncrement, {
    inc_field: 'id', // 要自增的字段名
    id: 'publish_id_seq',  // 计数器在数据库里的标识（存在 counters 集合）
    start_seq: 1     // 起始值，默认从 1 开始
})


const Heartplay = mongoose.model("play", playListSchema)

const Heartsong = mongoose.model("hesrt", songListSchema)

const Loadsong = mongoose.model("load", loadListSchema)

const Focusvideo = mongoose.model("video", focusVideoSchema)

const Friendlist = mongoose.model("friend", friendListSchema)

const StorageSync = mongoose.model("storage", StorageSyncSchema)

const FocusSync = mongoose.model("focus", FocusSyncSchema)

const videoData = mongoose.model("videoData", videoDataSchema)

const songData = mongoose.model("songData", songDataSchema)

const pubilsh = mongoose.model("pubilshData", pubilshDataSchema)

const dynamics = mongoose.model("dynamicsData", dynamicsDataSchema)

const histroy = mongoose.model("histroyData", histroyDataSchema)

const Use = mongoose.model("user", userInfoSchema)

module.exports = {
    Use,
    Heartplay,
    Heartsong,
    Loadsong,
    Focusvideo,
    Friendlist,
    StorageSync,
    FocusSync,
    videoData,
    songData,
    pubilsh,
    dynamics,
    histroy
}

