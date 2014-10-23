var Main = (function(){

	var $ = function(name){
		return document.getElementsByClassName(name)[0];
	}

	var _word = [
		["あ", "ア", "a"],
		["い", "イ", "i"],
		["う", "ウ", "u"],
		["え", "エ", "e"],
		["お", "オ", "o"],
		["か", "カ", "ka"],
		["き", "キ", "ki"],
		["く", "ク", "ku"],
		["け", "ケ", "ke"],
		["こ", "コ", "ko"],
		["さ", "サ", "sa"],
		["し", "シ", "shi"],
		["す", "ス", "su"],
		["せ", "セ", "se"],
		["そ", "ソ", "so"],
		["た", "タ", "ta"],
		["ち", "チ", "chi"],
		["つ", "ツ", "tsu"],
		["て", "テ", "te"],
		["と", "ト", "to"],
		["な", "ナ", "na"],
		["に", "ニ", "ni"],
		["ぬ", "ヌ", "nu"],
		["ね", "ネ", "ne"],
		["の", "ノ", "no"],
		["は", "ハ", "ha"],
		["ひ", "ヒ", "hi"],
		["ふ", "フ", "fu"],
		["へ", "ヘ", "he"],
		["ほ", "ホ", "ho"],
		["ま", "マ", "ma"],
		["み", "ミ", "mi"],
		["む", "ム", "mu"],
		["め", "メ", "me"],
		["も", "モ", "mo"],
		["や", "ヤ", "ya"],
		["い", "イ", "i"],
		["ゆ", "ユ", "yu"],
		["え", "エ", "e"],
		["よ", "ヨ", "yo"],
		["ら", "ラ", "ra"],
		["り", "リ", "ri"],
		["る", "ル", "ru"],
		["れ", "レ", "re"],
		["ろ", "ロ", "ro"],
		["わ", "ワ", "wa"],
		["い", "イ", "i"],
		["う", "ウ", "u"],
		["え", "エ", "e"],
		["を", "ヲ", "wo"],
		["ん", "ン", "n"]
	]
		
	var _len = _word.length;

	var $round = document.getElementsByClassName("round")[0];


	var Score = {
		key: "score",
		bestKey: "best",
		add: function(){
			var curScore = window.localStorage.getItem(this.key);
			var nowScore = parseInt(curScore)+1;
			$("score").innerHTML = nowScore;
			window.localStorage.setItem(this.key, nowScore);
			//更新最高分数
			var bestScore = parseInt($("best-val").innerHTML);
			if(nowScore > bestScore){
				$("best-val").innerHTML = nowScore;
				window.localStorage.setItem(this.bestKey, nowScore);
			}
		},
		clear: function(){
			window.localStorage.setItem(this.key, 0);
			$("score").innerHTML = 0;
		},
		init: function(){
			var curScore = window.localStorage.getItem(this.key) || 0;
			var curBest = window.localStorage.getItem(this.bestKey) || 0;
			if(typeof(curScore) != "number") curScore = 0;
			if(typeof(curBest) != "number") curBest = 0;
			$("score").innerHTML = curScore;
			$("best-val").innerHTML = curBest;
		}
	}

	//播放声音
	//audio是否已初始化
    var _isAudioInit = false;

    var playAudio = function(src) {
       if (typeof device != "undefined") {
       		alert(3);
            // Android
            if (device.platform == 'Android') {
                console.log(src);
            }
            var mediaRes = new Media(src, function onSuccess() {
                mediaRes.release();
            }, function onError(e) {
                alert("error playing sound: " + JSON.stringify(e));
            });
            mediaRes.play();
        }else if (typeof Audio != "undefined") {
            if (!_isAudioInit) {
                _audio = new Audio(src);
                _audio.play();
                _isAudioInit = true;
            } else {
            	_audio.src = src;
                _audio.play();
            }
        } else {
            alert("no sound API to play: " + src);
        }
    }
	//随机打乱数组
	function randomsort(a, b) {
	    return Math.random()>.5 ? -1 : 1;
	}

	function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        if (!hasClass(obj, cls)) obj.className += " " + cls;
    }

    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, '');
        }
    }

    function preload(arr){
    	for(var i=0;i<arr.length;i++){
    		var img = document.createElement("img");
    		img.src = arr[i];
    	}
    }

	function show(){
		function step(i){
			if(i > 4){
				return;
			}
			removeClass($("btn"+i), "btn-hide");
			setTimeout(function(){
				step(i+1);
			},100);
		}
		step(1);
	}

	function hide(){
		function step(i){
			if(i > 4){
				setVal();
				return;
			}
			addClass($("btn"+i), "btn-hide");
			setTimeout(function(){
				step(i+1);
			},100);
		}
		step(1);
		right();
	}

	function right(){
		playAudio("audio/right.mp3");
		Score.add();
		/*addClass($round, "right");
		setTimeout(function(){
			removeClass($round, "right");
		}, 100);*/
	}

	function err(){
		addClass($round, "err");
		playAudio("audio/err.mp3");
		setTimeout(function(){
			removeClass($round, "err");
		}, 100);
		Score.clear();
	}

	function setVal(){
		//数组顺序
		var idxArr = parseInt(Math.random()*_len);
		//假名类型顺序
		var idxType = parseInt(Math.random()*3);
		//该假名正确选项顺序
		var idxRight = 0;
		while(idxRight == idxType){
			idxRight = parseInt(Math.random()*3);
		}
		//最后一个
		var idxRight2 = 0;
		while(idxRight2 == idxType || idxRight2 == idxRight){
			idxRight2 = parseInt(Math.random()*3);
		}
		//其他按钮假名
		var checkObj = {};
		checkObj[idxArr] = true;

		var idxBtn1 = parseInt(Math.random()*_len);
		while(checkObj[idxBtn1]){
			idxBtn1 = parseInt(Math.random()*_len);
		}
		checkObj[idxBtn1] = true;
		
		var idxBtn2 = parseInt(Math.random()*_len);
		while(checkObj[idxBtn2]){
			idxBtn2 = parseInt(Math.random()*_len);
		}
		checkObj[idxBtn2] = true;

		var idxBtn3 = parseInt(Math.random()*_len);
		while(checkObj[idxBtn3]){
			idxBtn3 = parseInt(Math.random()*_len);
		}
		checkObj[idxBtn3] = true;

		//赋值
		var arr = [_word[idxArr][idxRight], _word[idxBtn1][idxRight], _word[idxBtn2][idxRight], _word[idxBtn3][idxRight]];
		arr = arr.sort(randomsort);
		for(var i=0,len=arr.length;i<len;i++){
			$("btn"+(i+1)).innerHTML = arr[i]; 
		}
		$round.innerHTML = _word[idxArr][idxType]; 
		$round.setAttribute("data-answer", _word[idxArr][idxRight]);
		$round.setAttribute("data-val1", _word[idxArr][idxType]);
		$round.setAttribute("data-val2", _word[idxArr][idxRight2]);
		show();
	}

	function bind(){
		var $btnArr = document.getElementsByClassName("btn");

		for(var i=0,len=$btnArr.length;i<len;i++){
			$btnArr[i].onclick = function(e){
				console.log(this);
				var val = this.innerHTML;
				if(val == $round.getAttribute("data-answer")){
					hide();
				}else{
					err();
				}
			}
		}

		$round.onclick = function(e){
			var val1 = $round.getAttribute("data-val1");
			var val2 = $round.getAttribute("data-val2");
			var val = $round.innerHTML;
			if(val == val1){
				$round.innerHTML = val2;
			}else{
				$round.innerHTML = val1;
			}
		}
	}

	

	function init(){
		//使active伪类生效
		document.addEventListener('touchstart',function(){},false);
		setVal();
		bind();
		preload(["audio/err.mp3","audio/right.mp3"]);
		Score.init();
	}
	return {
		init: init
	}
})();