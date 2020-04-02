var myCardGame = {
    el:null,
    btn:null,
    winShow:document.getElementsByClassName('win')[0],
    gameWidth:null,
    gameHeight:null,
    level:2,
    maxLevel:3,
    blockList:[],
    blocksLength:0,
    picArr:[],
    judgePicArr:[],
    samePicArr:[],
    clickTime:0,
    innerT:null,
    init:function(options){
        this.initData(options);
        this.setWidHeight();
        this.renderBlock();
        this.handle();
    },
    initData:function(options){
        this.el = options.el;
        this.btn = options.btn;

        
    },
    winTime:function(){
        var self = this;
        var winDiv = document.getElementsByClassName('win')[0];
        var imgArr = winDiv.getElementsByTagName('img');
        winDiv.style.display = 'block';
        setTimeout(()=>{
            imgArr[0].style.transform = 'translate(200px,-400px)'
            imgArr[1].style.transform = 'translate(300px,-400px)'
            imgArr[2].style.transform = 'translate(356px,-356px)'
            imgArr[3].style.transform = 'translate(319px,-270px)'
            imgArr[4].style.transform = 'translate(270px,-160px)'
            for(var i = 0;i<imgArr.length;i++){
                (function(i){
                    setTimeout(()=>{
                        imgArr[i].style.opacity = 0;
                        imgArr[0].style.transform = 'translate(200px,0px)'
                        imgArr[1].style.transform = 'translate(300px,0px)'
                        imgArr[2].style.transform = 'translate(356px,0px)'
                        imgArr[3].style.transform = 'translate(319px,0px)'
                        imgArr[4].style.transform = 'translate(270px,0px)'
                        imgArr[i].style.transition=' all 0.5s cubic-bezier(0.47,-0.01, 1, 1.01)';
                        
                    },500)
                })(i)
                
                
            }
        },300)
        setTimeout(() => {
            winDiv.style.display = 'none'
            for(var i = 0;i<imgArr.length;i++){
                imgArr[i].style.opacity = 1;
                imgArr[i].style.transform = 'translate(-100px,100px)'
                imgArr[i].style.transition=' all 0.5s cubic-bezier(0, 0.65, 0.1, 1.02)';
            }
        }, 1500);

        
    },
    setWidHeight:function(){
        var devWidth = window.innerWidth;
        var devHeight = window.innerHeight;
        var outDiv = document.getElementsByClassName('outer')[0];
        var btnLi = this.btn.getElementsByClassName('btnLi');
        if(devWidth<500){
            this.gameWidth = devWidth;
            this.gameHeight = devWidth;
            outDiv.style.width = devWidth +'px';
            this.el.style.width = devWidth +'px';
            this.el.style.height = devWidth +'px';
            this.btn.style.display = 'flex';
            this.btn.style.margin = '20px 2px';
            btnLi[0].style.borderBottom = 'none';
            btnLi[1].style.borderBottom = 'none';
        }else{
            this.gameWidth = 600;
            this.gameHeight = 600;
            this.el.style.width = '600px';
            this.el.style.height = '600px';
            outDiv.style.width = '800px';
            outDiv.style.marginTop = '30px';
            this.winShow.style.top = '110px';
            this.winShow.style.left = '110px';
        }
    },
    getBlockLength:function(){
        /**
         * 根据level判断block的数量
         * blockLength = level*2 * level*2
         */
        this.blocksLength = Math.pow(this.level*2,2);
    },
    getPicArr:function(){
        var arr = [];
        for(var i = 0;i<20;i++){
            var info={};
            info.url = './images/'+(i+1)+'.png';
            info.id = (i+1);
            arr.push(info)
        }
        this.picArr = arr;
    },
    renderBlock:function(){
        /**
         * 渲染卡牌
         */
        this.getBlockLength();
        this.getPicArr();
        var blockList = this.blockList = this.getRandomArr();
        for(var i =0;i<this.blocksLength;i++){
            var block = document.createElement('div');
            block.setAttribute('class','block');
            block.picid = blockList[i].id;
            block.style.width = this.gameWidth / (this.level *2) + 'px';
            block.style.height = this.gameHeight / (this.level *2) + 'px';
            var pic = document.createElement('div');
            pic.setAttribute('class','pic');
            pic.style.background = 'url('+ blockList[i].url +') center no-repeat';
            block.appendChild(pic);
            this.el.appendChild(block)
        }
        
    },
    getRandomArr:function(){
        /**
         * 获得用来渲染卡牌的随机数组
         */
        var halfBlock = this.blocksLength/2;
        var arr = this.suffle(this.picArr);
        var randomArr = arr.splice(0,halfBlock);
        var blockArr = [];
        for(var i = 0;i<halfBlock;i++){
            blockArr.push(randomArr[i],randomArr[i]);
        }
        blockArr = this.suffle(blockArr);
        return blockArr;
    },
    suffle:function(arr){
        /**
         * 数组乱序
         */
        //方法一 sort()
        return arr.sort(function(){
            return 0.5 - Math.random();
        })
    },
    handle:function(){
        this.clickBlock();
        this.clickBtn();
    },
    clickBlock:function(){
        /**
         * 点击翻牌
         */
        var self = this;
        this.el.onclick = function(e){
            isBlock = e.target;
            if(isBlock.classList.contains('block')){
                isBlock.classList.add('on')
                self.judgePicArr.push(isBlock);
                self.judgePic(isBlock);
            }
        }
    },
    judgePic:function(dom){
        var arr = this.judgePicArr;
        var len = arr.length;
        var dom1 = arr[0] ,
            dom2 = arr[1];
        var self = this;
        if(len==2){
            if(dom1.picid !== dom2.picid ){
                self.judgePicArr = []
                setTimeout(function(){
                    dom1.classList.remove('on');
                    dom2.classList.remove('on');
                },800)

            }else{
                this.judgePicArr = [];
                this.samePicArr.push(dom1,dom2)
                this.judgeWin();
            } 
        }else if(len > 2){
            self.judgePicArr = [];
            for(var i = 0;i<len;i++){
                arr[i].classList.remove('on')
            }
        }
    
    },
    judgeWin:function(){
        var self = this;
        if(this.samePicArr.length === this.blocksLength){
            setTimeout(function(){
                // alert('you win')
                self.winTime();
            },300)
        }
    },
    clickBtn(){
        var self = this;
        self.btn.onclick = function(e){
            var btnLi = e.target
            var activeLi = self.btn.getElementsByClassName('active')[0];
            activeLi.classList.remove('active');
            btnLi.classList.add('active');
            switch(btnLi.id){
                case 'easy':
                    self.level = 1;
                    self.clearBlock();
                    self.clearSomeArr();
                    self.renderBlock();
                    break;
                case 'justSo':
                    self.level = 2;
                    self.clearBlock();
                    self.clearSomeArr();
                    self.renderBlock();
                    break;
                case 'difficult':
                    self.level = 3;
                    self.clearBlock();
                    self.clearSomeArr();
                    self.renderBlock();
                    break;
            }
        }
    },
    clearBlock:function(){
        var oBlocks = this.el.getElementsByClassName('block');
        var len = oBlocks.length;
        for(var i = len-1;i>=0;i--){
            oBlocks[i].remove();
        }
    },
    clearSomeArr:function(){
        this.samePicArr=[];
    },
    
}