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
        atlasImg: cc.SpriteAtlas,
        avatar: cc.Sprite,
        editBox: cc.EditBox,
        gameLayout:cc.Layout,
        avatarGrid:cc.Layout,

    },
// Lưu dữ liệu vào file JSON



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.idx = 0;
        this.name='';
        this.img = this.atlasImg.getSpriteFrames();
        this.avatar.spriteFrame = this.img[this.idx];
        this.playerData = {
            name: "",
            imgIndex: ""
        };
        this.jsonString='';

    },
    start() {
        cc.log(this.img);
    },
    // update (dt) {},
    onClickShowGridAva() {
        if(!this.avatarGrid.node.active)
            this.avatarGrid.node.active =true;
        else
            this.avatarGrid.node.active =false;

    },

    onClickPlay(){
        cc.log(this.avatar.spriteFrame.name);
        this.playerData.imgIndex =  this.avatar.spriteFrame.name;
        this.playerData.name = this.editBox.string;
        this.node.active = false;
        this.jsonString = JSON.stringify(this.playerData);
        cc.log(this.jsonString);
        cc.sys.localStorage.setItem('playerData', this.jsonString);
        this.gameLayout.node.active =true;
    }
});
