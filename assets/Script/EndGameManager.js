// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        textName: cc.Label,
        textWordInput: cc.Label,
        textWordWrong: cc.Label,
        textCorrect: cc.Label,
        textWpm: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.jsonString = cc.sys.localStorage.getItem('playerData');
        this.jsonData = null;
        if (this.jsonString) {
            this.jsonData = JSON.parse(this.jsonString);
            // Bạn có thể sử dụng dữ liệu đã đọc từ file JSON ở đây
            cc.log(this.jsonData);
        } else {
            cc.error("Không tìm thấy dữ liệu JSON trong local storage");
        }
        this.textName.string = `name : ${this.jsonData.name}`
        this.textWordInput.string = `Word Input  : ${this.jsonData.textWordInput.length} words`
        this.textWordWrong.string = `Word Wrong  : ${this.jsonData.textWordWrong.length} words`
        this.textCorrect.string = `Correct : ${parseInt((1 - (this.jsonData.textWordWrong.length / this.jsonData.textWordInput.length)) * 100)}%`
        this.textWpm.string = `Wpm : ${this.jsonData.textWordInput.length}`
    },

    start() {

    },

    // update (dt) {},
});
