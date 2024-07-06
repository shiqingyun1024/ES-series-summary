function uploadFile(file) {
    const CHUNK_SIZE = 1 * 1024 * 1024;// 分片大小，这里以1MB为例
    const totalChunks = Math.ceil(file.szie / CHUNK_SIZE); // Math.ceil 天花板
    for (let i = 0; i < totalChunks; i++) {
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        uploadChunk(chunk, i);
    }
}

function uploadChunk(chunk, chunkIndex) {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('index', chunkIndex);

    fetch('/upload', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => console.log('Chunk uploaded', data))
        .catch(error => console.error('Error in uploading chunk', error));
}

// 调用示例
const file = document.querySelector('input[type="file"]').files[0];
uploadFile(file);

function concurrentRequestLimit(requests, maxConcurrent) {
    let activeRequests = 0;
    let requestQueue = [...requests];

    function processNext() {
        if (requestQueue.length === 0) {
            return Promise.resolve();
        }

        if (activeRequests < maxConcurrent) {
            activeRequests++;
            const request = requestQueue.shift();

            return request().then(() => {
                activeRequests--;
                return processNext();
            })

        } else {
            return new Promise(resolve => {
                setTimeout(() => resolve(processNext()), 1000); // 等待一段时间后重试
            })
        }
    }
    return processNext();
}

// 使用示例
const mockRequest = () => new Promise(resolve => setTimeout(resolve, 1000));
const requests = Array(10).fill(mockRequest); // 创建10个模拟请求


