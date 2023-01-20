module.exports = (ctx) => {
    const UPLOADER = 'cheveretov4';
    const register = () => {
        ctx.helper.uploader.register(UPLOADER, {
            handle,
            name: 'Chevereto V4 Uploader',
            config: config
        })
    }

    const postOptions = (image, fileName, userConfig) => {
        const version = userConfig.cheveretoversion === "V4";
        const key = userConfig.key;
        const url = userConfig.url;
        const source_param = userConfig.source_param || 'source';
        let V3headers = {
            'contentType': 'multipart/form-data',
            'User-Agent': 'PicGo',
        }
        let V3formData = {
            'format': 'json',
            'key': key,
        }
        let V4headers = {
            'contentType': 'multipart/form-data',
            'User-Agent': 'PicGo',
            'X-API-Key': key,
        }
        let V4formData = {
            'format': 'json',
            'album_id': userConfig.album_id,
            'category_id': userConfig.category_id,
            'description':userConfig.description,
        }
        if (!userConfig.album_id) {
            delete V4formData.album_id
        }
        if (!userConfig.category_id) {
            delete V4formData.category_id
        }
        if (!userConfig.description) {
            delete V4formData.description
        }
        const opts = {
            method: 'POST',
            url: url,
            strictSSL: false,
            headers: version ? V4headers : V3headers,
            formData: version ? V4formData : V3formData,
        }
        opts.formData[source_param] = {};
        opts.formData[source_param].value = image;
        opts.formData[source_param].options = {
            filename: fileName
        }
        return opts;
    }

    const handle = async function (ctx) {
        let userConfig = ctx.getConfig('picBed.' + UPLOADER);
        if (!userConfig) {
            throw new Error('Can\'t find uploader config');
        }
        try {
            const imgList = ctx.output;
            for (let i in imgList) {
                const image = imgList[i].buffer;
                const name = imgList[i].fileName;
                if (!image && imgList[i].base64Image) {
                    image = Buffer.from(imgList[i].base64Image, 'base64');
                }
                const postConfig = postOptions(
                    image,
                    name,
                    userConfig
                );
                let body = await ctx.request(postConfig);
                if (!body) {
                    throw new Error('上传图片失败' + body);
                }
                delete imgList[i].base64Image;
                delete imgList[i].buffer;
                body = JSON.parse(body);
                if (body['status_code'] == 200) {
                    url_param = userConfig.url_param ? userConfig.url_param : 'url';
                    imgList[i]['imgUrl'] = eval('body.image.' + url_param);
                } else {
                    ctx.emit('notification', {
                        title: '上传失败',
                        body: body.status_txt
                    })
                    throw new Error('上传失败' + body);
                }
            }
            console.log(imgList);
        } catch (err) {
            ctx.emit('notification', {
                title: '上传失败',
                body: '请检查服务端或配置'
            })
            throw err;
        }
    }

    const config = ctx => {
        let userConfig = ctx.getConfig('picBed.' + UPLOADER);
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
            },
            {
                name: 'source_param',
                type: 'input',
                default: userConfig.source_param,
                message: '上传API的文件参数（参数可不填，默认为source）',
                required: false,
                alias: 'Source Param'
            },
            {
                name: 'url_param',
                type: 'input',
                default: userConfig.url_param,
                message: '获取返回图片链接的键名（参数可不填，默认为url）',
                required: false,
                alias: 'Url Param'
            }
        ]
    }

    return {
        uploader: UPLOADER,
        register
    }
}
