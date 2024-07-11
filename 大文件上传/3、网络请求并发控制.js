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