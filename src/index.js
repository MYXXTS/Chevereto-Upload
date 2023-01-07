module.exports = (ctx) => {
    const UPLOADER = 'cheveretov4';
    const register = () => {
        ctx.helper.uploader.register(UPLOADER, {
            handle,
            name: UPLOADER,
            config: config
        })
    }
    const handle = async function (ctx) {
        let userConfig = ctx.getConfig('picBed.' + UPLOADER);
        if (!userConfig) {
            throw new Error('Can\'t find uploader config');
        }
        try {
            let imgList = ctx.output;
            for (let i in imgList) {
                let image = imgList[i].buffer;
                if (!image && imgList[i].base64Image) {
                    image = Buffer.from(imgList[i].base64Image, 'base64');
                }
                const postConfig = postOptions(
                    image,
                    imgList[i].fileName,
                    userConfig.url,
                    userConfig.key,
                    userConfig.source_param || 'source',
                    userConfig.album_id,
                    userConfig.category_id
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
        } catch (err) {
            ctx.emit('notification', {
                title: '上传失败',
                body: '请检查服务端或配置'
            })
            throw err;
        }
    }

    const postOptions = (image, fileName, url, key, source_param, album_id, category_id) => {
        let headers = {
            'contentType': 'multipart/form-data',
            'User-Agent': 'PicGo',
            'X-API-Key': key,
        }
        let formData = {
            'format': 'json',
            'album_id': album_id,
            'category_id': category_id,
        }
        const opts = {
            method: 'POST',
            url: url,
            strictSSL: false,
            headers: headers,
            formData: formData
        }
        opts.formData[source_param] = {};
        opts.formData[source_param].value = image;
        opts.formData[source_param].options = {
            filename: fileName
        }
        return opts;
    }

    const config = ctx => {
        let userConfig = ctx.getConfig('picBed.' + UPLOADER);
        if (!userConfig) {
            userConfig = {}
        }
        return [
            {
                name: 'url',
                type: 'input',
                default: userConfig.url,
                required: true,
                message: '使用 Chevereto V4 的图床的API上传网址（如：https://example.com/api/1/upload）',
                alias: 'Url'
            },
            {
                name: 'key',
                type: 'input',
                default: userConfig.key,
                required: true,
                message: '在个人设置页面获取的 API Key 或者是图床的 Public API key',
                alias: 'API Key'
            },
            {
                name: 'album_id',
                type: 'input',
                default: userConfig.album_id,
                required: false,
                message: '用户所拥有的相册 ID（参数为相册详细信息中的 id_encoded，默认不添加）',
                alias: 'Album ID'
            },
            {
                name: 'category_id',
                type: 'input',
                default: userConfig.category_id,
                required: false,
                message: '图床的图片分类 ID （参数为整数，默认不添加）',
                alias: 'Category ID'
            },
            {
                name: 'source_param',
                type: 'input',
                default: userConfig.source_param,
                required: false,
                message: '上传API的文件参数（可不填，默认为source）',
                alias: 'Source Param'
            },
            {
                name: 'url_param',
                type: 'input',
                default: userConfig.url_param,
                required: false,
                message: '获取返回图片链接的键名（可不填，默认为url）',
                alias: 'Url Param'
            }
        ]
    }

    return {
        uploader: UPLOADER,
        register
    }
}
