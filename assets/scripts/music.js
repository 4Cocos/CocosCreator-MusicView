
cc.Class({
    extends: cc.Component,

    properties: {
        music: {
            type: cc.AudioClip,
            default: null
        },
        mgr: cc.Node,
        item: cc.Prefab
    },

    onLoad () {
        console.log(this.music);
        // 实例化 item
        for (let i = 0; i < 40; i++) {
            let item = cc.instantiate(this.item);
            this.mgr.addChild(item);
            item.y = 0;
            item.x = -480 + i * 24 + 12;
        }
        // 处理不同平台
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    },

    onClick () {
        let AudioContext = window.AudioContext;
        // audioContext 只相当于一个容器。
        let audioContext = new AudioContext();
        // 要让 audioContext 真正丰富起来需要将实际的音乐信息传递给它的。
        // 也就是将 AudioBuffer 数据传递进去。
        // 以下就是创建音频资源节点管理者。
        this.audioBufferSourceNode = audioContext.createBufferSource();
        // 将 AudioBuffer 传递进去。
        this.audioBufferSourceNode.buffer = this.music._audio;
        // 创建分析器。
        this.analyser = audioContext.createAnalyser();
        // 精度设置
        this.analyser.fftSize = 256;
        // 在传到扬声器之前，连接到分析器。
        this.audioBufferSourceNode.connect(this.analyser);
        // 连接到扬声器。
        this.analyser.connect(audioContext.destination);
        // 开始播放
        this.audioBufferSourceNode.start(0);
    },

    onStop () {
        // 停止方法
        this.audioBufferSourceNode.stop();
    },

    update (dt) {
        // 等待准备好
        if (!this.analyser) return;
        // 建立数据准备接受数据
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        // 分析结果存入数组。
        this.analyser.getByteFrequencyData(this.dataArray);
        this.draw(this.dataArray);
    },

    draw (dataArray) {
        // 数值自定
        // 960 / 40 有 24 ; 128 / 40 取 3
        for (let i = 0; i < 40; i++) {
            let h = dataArray[i * 3] * 1.5;
            if (h < 5) h = 5;
            // this.mgr.children[i].height = h;
            let node = this.mgr.children[i];
            // 插值，不那么生硬
            node.height = cc.misc.lerp(node.height, h, 0.4);
        }
    }

});
