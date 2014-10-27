var db = (function(){
	var _this = window;

	return {
		DB: null,

		dbConnect : function(dbName,dbVersion,dbDesc,dbSize){
          	
	        try {
	            if (!window.openDatabase) {
	                console.log('Databases are not supported in this browser.');
	                return false;
	            } else {
	                dbName      = dbName ? dbName : 'SHICAI_APP';
	                dbVersion   = dbVersion ? dbVersion : '1.0';
	                dbDesc      = dbDesc ? dbDesc : 'SHICAI_DB for User Mobile';
	                dbSize      = dbSize ? dbSize : (2 * 1024 * 1024);
	                  
	                _this.DB = openDatabase(dbName, dbVersion, dbDesc, dbSize);
	                  
	                return true;
	            }
	        } catch(e) {
	            if (e == 2) {
	                console.log("Invalid database version.");
	            } else {
	                console.log("Unknown error "+e+".");
	            }
	            return false;
	        }
	          
	    },
	    /**
	     * 创建表
	     * @param {String} tableName
	     * @param {Object} tableField
	     */
	    dbDefineTable : function(tableName,tableField){
	        if(!tableName || !tableField){
	            console.log('ERROR: Function "dbCreateTable" tableName or tableField is NULL.');
	        }
	        var fieldArr = [];
	        var fieldItem;
	        var i = 0;
	          
	        for (var field in tableField){
	            field.toString();
	            tableField[field].toString();
	            //fieldArr[i] = field+' '+tableField[field];
	            fieldArr[i] = field;
	            i++;
	        }
	        fieldItem = fieldArr.join(",").toString();
	          
	        var SQL = 'CREATE TABLE IF NOT EXISTS '+tableName+' (';
	        SQL += fieldItem;
	        SQL +=')';
	        console.log(SQL);
	          
	        _this.DB.transaction(function(tx){
	            tx.executeSql(SQL,[],function(tx,result){
	                return true;
	            },function(tx,error){
	                console.log(error);
	                return false;
	            });
	        });
	    },
	      
	    /**
	     * 插入数据
	     * @param {String} tableName
	     * @param {Object} tableField
	     * @param {Function} funName
	     */
	    dbInsert : function(tableName,tableField,funName){
	      
	        if(!tableField){
	            console.log('ERROR: FUNCTION dbInsert tableField is NULL');
	            return false;
	        }
	          
	        var fieldKeyArr = [];
	        var fieldValueArr = [];
	        var fieldKey;
	        var fieldValue;
	        var i = 0;
	          
	        for (var field in tableField){
	          
	            field.toString();
	            tableField[field].toString();
	            fieldKeyArr[i] = field;
	            fieldValueArr[i] = tableField[field];
	            if(typeof(fieldValueArr[i]) !== 'number'){
	                fieldValueArr[i] = '"'+fieldValueArr[i]+'"';
	            }
	            i++;
	        }
	        fieldKey = fieldKeyArr.join(",");
	        fieldValue = fieldValueArr.join(",");
	  
	        var SQL = 'INSERT INTO '+tableName+' (';
	        SQL += fieldKey;
	        SQL += ') ';
	        SQL += 'VALUES (';
	        SQL += fieldValue;
	        SQL += ')';
	        console.log(SQL);
	          
	        _this.DB.transaction(function(tx){
	            tx.executeSql(SQL,[],function(tx,result){
	                return true;
	            },function(tx,error){
	                console.log(error);
	                return false;
	            });
	        });
	    },
	      
	    /**
	     * 查询所有结果
	     * @param {String}  tableName
	     * @param {Function} funName
	     * @param {Object}  tableField
	     * @param {Object}  dbParams
	     */
	    dbFindAll : function(tableName,funName,funErr,tableField,dbParams){
	  
	        tableField = tableField ? tableField : '*';
	        if(!tableName || !funName){
	            console.log('ERROR: Function "dbFindAll" tableName or funName is NULL.');
	        }
	          
	        var SQL = '';
	        SQL +='SELECT '+tableField+' FROM '+tableName;
	        
	        console.log(SQL);

	        _this.DB.transaction(function(tx){
	            tx.executeSql(SQL,[],_findSuccess,function(tx,error){
	                funErr && funErr(error);
	                return false;
	            });
	        });
	        
	        function _findSuccess(tx,result){
	            funName(result);
	        }
	  
	    },
	      
	    /**
	     * 删除数据
	     * @param {String}  tableName
	     * @param {Object}  dbParams
	     * @param {Function} funName
	     */
	    dbDelete : function(tableName,dbParams,funName){
	      
	        if(!tableName || !dbParams){
	            console.log('ERROR: FUNCTION "dbDelete" tableName or dbParams is NULL');
	            return false;
	        }
	        var SQL = '';
	        SQL +='DELETE FROM '+tableName+' WHERE ';
	          
	        var paramArr = new Array();
	        var paramStr = '';
	        var i=0;
	        for(var k in dbParams){
	            if(typeof(dbParams[k]) !== 'number'){
	                dbParams[k] = '"'+dbParams[k]+'"';
	            }
	            paramArr[i] = k.toString()+'='+dbParams[k];
	            i++;
	        }
	        paramStr = paramArr.join(" AND ");
	        SQL += paramStr;
	          
	        _this.DB.transaction(function(tx){
	                tx.executeSql(SQL);
	            },[],function(tx,result){
	                funName(result);
	            },function(tx,error){
	                console.log(error);
	                return false;
	            });
	        console.log(SQL);
	    },
	      
	    /**
	     * 更新数据表
	     * @param {String}  *tableName
	     * @param {Object}  *dbParams
	     * @param {Object}  *dbWhere
	     * @param {Function} funName
	     */
	    dbUpdate : function(tableName,dbParams,dbWhere,funName){
	  
	        var SQL = 'UPDATE '+tableName+' SET ';
	        var paramArr = new Array();
	        var paramStr = '';
	        var i=0;
	        for(var k in dbParams){
	            if(typeof(dbParams[k]) !== 'number'){
	                dbParams[k] = '"'+dbParams[k]+'"';
	            }
	            paramArr[i] = k.toString()+'='+dbParams[k];
	            i++;
	        }
	        paramStr = paramArr.join(" , ");
	          
	        SQL += paramStr;

	        if(dbWhere){
	        	SQL += ' WHERE ';
	          
		        var whereArr = new Array();
		        var whereStr = '';
		        var n=0;
		        for(var w in dbWhere){
		              
		            if(typeof(dbWhere[w]) !=='number'){
		                dbWhere[n] = '"'+dbWhere[w]+'"';
		            }
		            whereArr[n] = w.toString()+'='+dbWhere[w];
		            n++;
		        }
		          
		        whereStr = whereArr.join(" AND ");
		          
		        SQL += whereStr;
	        }
	        
	          
	        console.log(SQL);
	        _this.DB.transaction(function(tx){
	            tx.executeSql(SQL,[],function(tx,result){
	                return true;
	            },function(tx,error){
	                console.log(error);
	                return false;
	            });
	        });
	        console.log(SQL);
	          
	    },
	      
	    /**
	     * 清空数据表
	     * @param {String} tableName
	     * @return {Boolean}
	     */
	    dbTruncate : function(tableName){
	      
	        if(!tableName){
	            console.log('ERROR:Table Name is NULL');
	            return false;
	        }
	          
	        function _TRUNCATE(tableName){
	            _this.DB.transaction(function(tx){
	                tx.executeSql('DELETE TABLE '+tableName);
	            },[],function(tx,result){
	                console.log('DELETE TABLE '+tableName);
	                return true;
	            },function(tx,error){
	                console.log(error);
	                return false;
	            })
	        }
	          
	        _TRUNCATE(tableName);
	    },
	      
	    /**
	     * @desc 删除数据表
	     * @param {String} tableName
	     * @return {Boolean}
	     */
	    dbDrop : function(tableName){
	          
	        if(!tableName){
	            console.log('ERROR:Table Name is NULL');
	            return false;
	        }
	          
	        function _DROP(tableName){
	            _this.DB.transaction(function(tx){
	                tx.executeSql('DROP TABLE '+tableName);
	            },[],function(tx,result){
	                console.log('DROP TABLE '+tableName);
	                return true;
	            },function(tx,error){
	                console.log(error);
	                return false;
	            })
	        }
	          
	        _DROP(tableName);
	    }
	}
})();

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
		dbName: "js_db",
		tableName: "js_table",
		add: function(){
			var _this = this;
			db.dbFindAll(_this.tableName, function(result){
				var fieldItem = {};
				var curScore = result.rows.item(0).score;
				var nowScore = parseInt(curScore)+1;
				$("score").innerHTML = nowScore;

				fieldItem[_this.key] = nowScore;
				fieldItem[_this.bestKey] = result.rows.item(0).best;

				//更新最高分数
				var bestScore = parseInt($("best-val").innerHTML);
				if(nowScore > bestScore){
					fieldItem[_this.bestKey] = nowScore;
					$("best-val").innerHTML = nowScore;
				}

				db.dbUpdate(_this.tableName, fieldItem, null, function(result){
					console.log(result);
				});
			}, function(err){
			});

			
		},
		clear: function(){
			var _this = this;
			var fieldItem = {};
			fieldItem[_this.key] = 0;

			db.dbUpdate(_this.tableName, fieldItem, null, function(result){
				console.log(result);
			});
			$("score").innerHTML = 0;
		},
		init: function(){
			var _this = this;

			db.dbConnect(_this.dbName);

			var fieldItem = {};
			fieldItem[_this.key] = 0;
			fieldItem[this.bestKey] = 0;

			db.dbFindAll(_this.tableName, function(result){
				$("score").innerHTML = result.rows.item(0).score;
				$("best-val").innerHTML = result.rows.item(0).best;
			}, function(err){
				db.dbDefineTable(_this.tableName, fieldItem);
				db.dbInsert(_this.tableName, fieldItem, null, function(result){
				});
			});

			
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
		//preload(["audio/err.mp3","audio/right.mp3"]);
		Score.init();
	}
	return {
		init: init
	}
})();