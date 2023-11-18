const { default: axios } = require('axios')
const FormData = require('form-data')

module.exports = (ctx) => {
  const UPLOADER = 'cheveretov4'
  const register = () => {
    ctx.helper.uploader.register(UPLOADER, {
      handle,
      name: 'Chevereto V4 Uploader',
      config
    })
  }

  const postOptions = (image, fileName, userConfig) => {
    const version = userConfig.cheveretoversion === 'V4'
    const key = userConfig.key
    const url = userConfig.url
    const headers = {
      'Content-Type': 'multipart/form-data',
      'User-Agent': 'PicGo',
      Connection: 'keep-alive',
      Accept: 'application/json'
    }
    const data = new FormData()
    data.append('source', image, fileName)
    data.append('format', 'json')
    if (version) {
      headers['X-API-Key'] = key
      if (userConfig.album_id) {
        data.append('album_id', userConfig.album_id)
      }
      if (userConfig.category_id) {
        data.append('category_id', userConfig.category_id)
      }
      if (userConfig.description) {
        data.append('description', userConfig.description)
      }
    }
    if (!version) {
      data.key = key
    }
    const opts = {
      method: 'POST',
      url,
      headers,
      data
    }
    return opts
  }

  const handle = async function (ctx) {
    const userConfig = ctx.getConfig('picBed.' + UPLOADER)
    if (!userConfig) {
      throw new Error('Can\'t find uploader config')
    }
    try {
      const imgList = ctx.output
      for (const i in imgList) {
        if (!imgList[i].buffer && !imgList[i].base64Image) {
          continue
        }
        const image = imgList[i].buffer || Buffer.from(imgList[i].base64Image, 'base64')
        const fileName = imgList[i].fileName
        const postConfig = postOptions(
          image,
          fileName,
          userConfig
        )
        const body = await axios(postConfig)
        delete imgList[i].base64Image
        delete imgList[i].buffer
        if (body.data.status_code === 200) {
          imgList[i].imgUrl = body.data.image.url
        } else {
          throw new Error('上传失败' + body || body.data)
        }
      }
    } catch (err) {
      ctx.emit('notification', {
        title: '上传失败',
        body: `错误信息：${err.message || err}`
      })
      throw new Error(err.message || err)
    }
  }

  const config = ctx => {
    let userConfig = ctx.getConfig('picBed.' + UPLOADER)
    if (!userConfig) {
      userConfig = {}
    }
    return [
      {
        name: 'cheveretoversion',
        type: 'list',
        default: userConfig.cheveretoversion || 'V3',
        message: '选择 Chevereto 的图床版本',
        choices: [
          {
            name: 'V3',
            value: 'V3'
          },
          {
            name: 'V4',
            value: 'V4'
          }
        ],
        required: true,
        alias: 'Chevereto Version'
      },
      {
        name: 'url',
        type: 'input',
        default: userConfig.url,
        message: '使用 Chevereto 的图床的API上传网址（如：https://example.com/api/1/upload）',
        required: true,
        alias: 'Url'
      },
      {
        name: 'key',
        type: 'input',
        default: userConfig.key,
        message: '对应版本的 Chevereto API KEY',
        required: true,
        alias: 'API Key'
      },
      {
        name: 'album_id',
        type: 'input',
        default: userConfig.album_id,
        message: '（V4 版本）用户所拥有的相册 ID（参数为相册详细信息中的 id_encoded，默认不添加）',
        required: false,
        alias: 'Album ID'
      },
      {
        name: 'category_id',
        type: 'input',
        default: userConfig.category_id,
        message: '（V4 版本）图床的图片分类 ID （参数为整数，默认不添加）',
        required: false,
        alias: 'Category ID'
      },
      {
        name: 'description',
        type: 'input',
        default: userConfig.description,
        message: '图片描述（默认不添加）',
        required: false,
        alias: 'Description'
      }
    ]
  }

  return {
    uploader: UPLOADER,
    register
  }
}
