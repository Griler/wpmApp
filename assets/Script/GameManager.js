// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var randomWords = require('better-random-words');

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
        timeLabel:cc.Label,
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
        //this.txtLabel.string= randomWords();
       // this.targetWords = this.txtLabel.string.split(' ');
        this.targetWords = randomWords(70);
        this.inputWords = [];
        this.falseWords = [];
        this.i = 0;
        this.hasRunOnce = false;
        this.arrLabel = [];
        this.index = 0
        this.createLabel();
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
/*        for (this.i; this.i < this.inputWords.length; this.i++) {
            if (this.targetWords[this.i] !== this.inputWords[this.i]) {
                this.falseWords.push(this.inputWords[this.i]);
            }
        }*/
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
                this.inputWords.push(string)
                if (string !== this.targetWords[this.index]) {
                    this.arrLabel[this.index].node.color = cc.Color.RED;
                    this.falseWords.push(string);
                }
                this.index++;
            }
            this.editText.string = '';
            this.editText.blur();
            this.editText.focus();
        }
    },
    initGame(dt) {
        this.timeLabel.string = parseInt(this.coldDownTime)+'';
        this.coldDownTime -= dt;
        this.timer += dt;
        if (this.timer >= 1) {
            this.clockImg.fillRange -= 0.1/6;
            this.timer = 0;
        }
        if (0.1 < this.clockImg.fillRange && this.clockImg.fillRange <= 0.4) {
            this.clockImg.node.color = cc.Color.YELLOW;
        } else if (0 <= this.clockImg.fillRange &&  this.clockImg.fillRange <= 0.1) {
            this.clockImg.node.color = cc.Color.RED;
        }
         if (this.coldDownTime < 0 ||this.index ===  this.targetWords.length-1) {
            this.checkText();
            this.clockImg.node.active = false;
            this.node.active = false;
            this.endLayout.node.active = true;
        }
    },

    createLabel() {
        for (let targetWord = 0; targetWord < this.targetWords.length - 1; targetWord++) {
            const labelNode = cc.instantiate(this.labelPrefab);
            const labelComponent = labelNode.getComponent(cc.Label);
            labelComponent.string = `${this.targetWords[targetWord]} `;
            labelComponent.name = `label + ${this.targetWords[targetWord]}`;
            labelComponent.fontSize = 18;
            labelNode.position = cc.v2(0, 0);
            labelNode.angle = cc.v2(0, 0);
            this.arrLabel.push(labelComponent)
            this.gridLabel.node.addChild(labelNode);
        }
    }
})
