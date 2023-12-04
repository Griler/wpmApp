// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const readTime = require('word-per-minute');
cc.Class({
    extends: cc.Component,

    properties: {
        txtName: cc.Label,
        avatarImg: cc.Sprite,
        atlasImg: cc.SpriteAtlas,
        clockImg: cc.Sprite,
        txtLabel: cc.Label,
        gridLabel: cc.Layout,
        editText: cc.EditBox,
        endLayout: cc.Layout,
        labelPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //#region take json Data
        this.jsonString = cc.sys.localStorage.getItem('playerData');
        this.jsonData = null;
        if (this.jsonString) {
            this.jsonData = JSON.parse(this.jsonString);
            // Bạn có thể sử dụng dữ liệu đã đọc từ file JSON ở đây
            cc.log(this.jsonData);
        } else {
            cc.error("Không tìm thấy dữ liệu JSON trong local storage");
        }
        this.txtName.string = `xin chào ${this.jsonData.name}`;
        cc.log(this.atlasImg.getSpriteFrames());
        for (let x in this.atlasImg.getSpriteFrames()) {
            if (this.atlasImg.getSpriteFrames()[x].name === this.jsonData.imgIndex) {
                this.avatarImg.spriteFrame = this.atlasImg.getSpriteFrames()[x];
            }
        }
        //#endregion
        this.timer = 0;
        this.coldDownTime = 60;
        this.startGame = false;
        this.targetWords = this.txtLabel.string.split(' ');
        this.inputWords = [];
        this.falseWords = [];
        this.i = 0;
        this.hasRunOnce = false;
        this.arrLabel = []
        this.index = 0
        // this.createLabel();
        for (let targetWord = 0; targetWord < this.targetWords.length - 1; targetWord++) {
            const labelNode = cc.instantiate(this.labelPrefab);
            const labelComponent = labelNode.getComponent(cc.Label);
            labelComponent.string = `${this.targetWords[targetWord]} `;
            labelComponent.name = `label + ${this.targetWords[targetWord]}`;
            labelComponent.fontSize = 20;
            labelNode.position = cc.v2(0, 0);
            labelNode.angle = cc.v2(0, 0);
            this.arrLabel.push(labelComponent)
            this.gridLabel.node.addChild(labelNode);
        }
        cc.log(this.endLayout);
    },

    start() {
        this.txtLabel.node.active = false;
    },
    update(dt) {
        if (this.startGame === true) {
            cc.log("startGame");
            this.initGame(dt);
        }
    },
    checkText() {
        for (this.i; this.i < this.inputWords.length; this.i++) {
            if (this.targetWords[this.i] !== this.inputWords[this.i]) {
                this.falseWords.push(this.inputWords[this.i]);
            }
        }
        this.jsonData.textWordInput = this.inputWords;
        this.jsonData.textWordWrong = this.falseWords;
        this.jsonString = JSON.stringify(this.jsonData);
        cc.sys.localStorage.setItem('playerData', this.jsonString);
        cc.log(this.falseWords);
    },
    changedTextInEditText() {
        this.startGame = true;
        this.arrLabel[this.index].node.color = cc.Color.GREEN;
        if (this.editText.string[this.editText.string.length - 1] === ' ' && this.editText.string !== "") {
            let string = this.editText.string.substring(0, this.editText.string.length - 1);
            if (string !== '') {
                if (string !== this.targetWords[this.index]) {
                    this.arrLabel[this.index].node.color = cc.Color.RED;
                    this.inputWords.push(string)
                }
            }
            cc.log(this.inputWords);
            this.editText.string = '';
            this.editText.blur();
            this.editText.focus();
            this.index++;
        }
    },
    initGame(dt) {
        this.coldDownTime -= dt;
        this.timer += dt;
        if (this.timer >= 6) {
            this.clockImg.fillRange -= 0.1;
            this.timer = 0;
        }
        if (0.1 < this.clockImg.fillRange && this.clockImg.fillRange <= 0.6) {
            this.clockImg.node.color = cc.Color.YELLOW;
        } else if (0 <= this.clockImg.fillRange &&  this.clockImg.fillRange <= 0.1) {
            this.clockImg.node.color = cc.Color.RED;
        } else if (this.coldDownTime < 0) {
            this.clockImg.node.active = false;
            this.node.active = false;
            this.endLayout.node.active = true;
        }
    },

    createLabel() {
        for (let targetWord of this.targetWords) {
            const labelNode = cc.instantiate(this.labelPrefab);
            const labelComponent = labelNode.addComponent(cc.Label);

            // Đặt văn bản cho label
            labelComponent.string = `Label ${i + 1}`;
            // Thêm label vào mảng
            this.arrLabel.push(labelComponent);
            // Thêm label vào scene
            this.gridLabel.node.addChild(labelNode);
        }
    }
})
