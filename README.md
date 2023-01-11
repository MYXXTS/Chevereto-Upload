# Picgo-Plugin-Cheveteto-Upload

一个可以支持 Chevereto（官方版本） 上传的 PicGo 插件

## 特点

- 采用 Chevereto V4 的新版本 API 1.1
- 支持使用用户个人 API Key 或者是图床的 Public API Key 进行图片上传
- 支持设置图片上传的所属相册（该相册必须是用户所有）
- 支持设置图片上传的所属分类

## 使用说明

### 使用

GUI 版本 PicGo 在插件设置中搜索 chevetetov4，下载后按照说明配置相关参数即可使用

CLI 版本 PicGo 在命令行中输入：picgo install chevetetov4，下载后按照 [配置文件 | PicGo-Core](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#默认配置文件) 说明进行相关配置之后即可使用

### 参数

|      参数名      |      |                           参数内容                           |
| :--------------: | :--: | :----------------------------------------------------------: |
| cheveretoversion | 必选 |                  选择 Chevereto 的图床版本                   |
|       url        | 必选 | 上传网址（V3 与 V4 版本目前一致，如：https://example.com/api/1/upload） |
|       key        | 必选 | V3 版本为后台设置的总 API，V4 版本可通过个人设置页面获取个人 API Key 或者是在后台设置获取图床的 Public API Key |
|     album_id     | 可选 | （V4版本可用）用户所拥有的相册 ID（参数为相册详细信息中的 id_encoded，默认不添加） |
|   category_id    | 可选 |  （V4版本可用）图床的图片分类 ID （参数为整数，默认不添加）  |
|   source_param   | 可选 |          上传API的文件参数（可不填，默认为source）           |
|    url_param     | 可选 |         获取返回图片链接的键名（可不填，默认为url）          |




## 计划

- [x] 支持 V4 版本
- [x] 支持 V3 版本

## 鸣谢

[@Wibus](https://github.com/wibus-wee) 提供项目相关帮助

## 参考项目

本项目基于 [picgo-plugin-chevereto](https://github.com/wf-nb/PicGoPlugins/tree/main/picgo-plugin-chevereto) 修改而来

## 参考文档

[GUI插件开发 | PicGo-Core](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/gui.html#shownotification-option)

[API v1 | V3 Docs (chevereto.com)](https://v3-docs.chevereto.com/api/#api-key)

[🖼 API Version 1.1 | V4 Docs (chevereto.com)](https://v4-docs.chevereto.com/developer/api/api-v1.html#key)

## 作者

Picgo-Plugin-Cheveteto-Upload © 沐云湘夕，采用 MIT 开源协议开源，创建于 2023年1月4日。

> [个人网站](https://www.myxxts.com) · GitHub [@MYXXTS](https://github.com/MYXXTS)
