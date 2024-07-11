// 网络请求并发控制
async sendRequest(forms, max = 4) {
    return new Promise(resolve => {
        // 计算有多少个切片上传请求
        const len = forms.length;
        // 初始化
        let idx = 0; // 已经上传过多少切片了
        let counter = 0; // 
        const start = async () => {
            // 有请求，有通道
            while (idx < len && max > 0) {
                max--; // 占用通道
                console.log(idx, "start");
                const form = forms[idx].form; // 获取要上传的切片内容
                const index = forms[idx].index; // 获取到这是第几个切片
                idx++
                request({
                    url: '/upload',
                    data: form,
                    onProgress: this.createProgresshandler(this.chunks[index]),
                    requestList: this.requestList
                }).then(() => {
                    max++; // 释放通道
                    counter++;
                    if (counter === len) {
                        resolve()
                    } else {
                        start()
                    }
                })
            }
        }
        start();
    })
}

// 上传文件
async uploadChunks(uploadedList = []) {
    // 这里一起上传，碰见大文件就是灾难
    // 没被hash计算打到，被一次性的tcp链接把浏览器稿挂了
    // 异步并发控制策略，我记得这个也是头条一个面试题
    // 比如并发量控制成4
    const list = this.chunks.filter(chunk => uploadedList.indexOf(chunk.hash) == -1)
        .map(({ chunk, hash, index }, i) => {
            const form = new FormData();
            form.append("chunk", chunk);
            form.append("hash", hash);
            form.append("filename", this.container.file.name);
            form.append("fileHash", this.container.hash);
            return { form, index };
        })
    const ret = await this.sendRequest(list, 4)
    if (uploadedList.length + list.length === this.chunks.length) {
        // 上传和已经存在之和 等于全部的再合并
        await this.mergeRequest();
    }
}

// 慢启动策略实现
async handleUpload1(){
    // @todo数据缩放的比率 可以更平缓  
    // @todo 并发+慢启动

    // 慢启动上传逻辑 
    const file = this.container.file
    if (!file) return;
    this.status = Status.uploading;
    const fileSize = file.size
    let offset = 1024 * 1024
    let cur = 0
    let count = 0
    this.container.hash = await this.calculateHashSample();

    while (cur < fileSize) {
        // 切割offfset大小
        const chunk = file.slice(cur, cur + offset)
        cur += offset
        const chunkName = this.container.hash + "-" + count;
        const form = new FormData();
        form.append("chunk", chunk);
        form.append("hash", chunkName);
        form.append("filename", file.name);
        form.append("fileHash", this.container.hash);
        form.append("size", chunk.size);

        let start = new Date().getTime()
        await request({ url: '/upload', data: form })
        const now = new Date().getTime()

        const time = ((now - start) / 1000).toFixed(4)
        let rate = time / 30
        // 速率有最大2和最小0.5
        if (rate < 0.5) rate = 0.5
        if (rate > 2) rate = 2
        // 新的切片大小等比变化
        console.log(`切片${count}大小是${this.format(offset)},耗时${time}秒，是30秒的${rate}倍，修正大小为${this.format(offset / rate)}`)
        // 动态调整offset
        offset = parseInt(offset / rate)
        // if(time)
        count++
    }
}

