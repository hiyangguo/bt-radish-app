# API 设计
## 接口设计
### 列表接口
#### List 接口
- 路径： `/api/:engine/list`
- 查询参数
  - `word` 查询的关键字
  - `page` 分页参数（因不同网站参数不同）
- 返回值示例:
```json
{
    "data": {
        "searchStatus": {
            // 总数
            "total": "904",
            // 花费的时间
            "spending": "1 milliseconds"
        },
        "items": [
            {
                // 磁力链接的哈希
                "hash": "bc9bb2d4b0688da6a1eb0dfca09f938f233723b7",
                // 标题
                "title": "火影忍者H",
                // 文件类型/分类
                "fileType": "Movie",
                // 创建时间
                "createTime": "8 months ago",
                // 文件大小
                "fileSize": "59.7 MB",
                // 文件总数
                "fileCount": "7",
                // redux
                "hot": "190",
                // 最后下载日期
                "lastDownload": "3 months ago",
                // 文件列表
                "files": [
                    {
                        // 文件名 
                        "fileName": "Sakura_X_Goku.mov",
                        // 文件大小
                        "size": "15.1 MB"
                    }
                ]
            } 
        ]
    },
    "page": {
        // 当前页
        "current": "4",
        // 分页信息
        "pages": [
            {
                "num": " < ",
                "query": "b-54Gr5b2x5b%2bN6ICF/3-1"
            }
        ]
    }
}
```

#### Detail 接口
- 路径： `/api/:engine/detail`
- 查询参数：
  - `hash` 哈希值
- 返回值示例：
```json
{
    // 哈希值
    "hash": "b01ffb1b840d9e390c1a85bde70f859c2645aac4",
    // 标题
    "title": "名侦探柯南OVA 全集18部",
    // 文件类型/分类
    "fileType": "Movie",
    // 创建日期
    "createTime": "2015-2-9",
    // 热度
    "hot": "38",
    // 文件大小
    "fileSize": "5.3 GB",
    // 文件总数
    "fileCount": "34",
    // 文件列表
    "files": [
        {
            // 文件名
            "fileName": "OVA02 十六名嫌疑犯！？.mkv",
            // 文件大小
            "size": "310.4 MB"
        }
    ],
    "magnet": "magnet:?xt=urn:btih:b01ffb1b840d9e390c1a85bde70f859c2645aac4"
}
```