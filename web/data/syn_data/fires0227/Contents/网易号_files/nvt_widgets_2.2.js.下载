(function (window, undefined) {
	
if (window.nvt) {
	return; 
}

var nvt = {},
	
	$ = window.NTES,
	
	jsc = (new Date).getTime(),
	
	rselectTextarea = /select|textarea/i,
	
	rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
	
	r20 = /%20/g;

$.util.isPlainObject = function(obj) {
	var toString = Object.prototype.toString,
		hasOwnProperty = Object.prototype.hasOwnProperty;
		
	if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
		return false;
	}

	if (obj.constructor
		&& !hasOwnProperty.call(obj, "constructor")
		&& !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
		return false;
	}
	
	var key;
	for (key in obj) {}
	
	return key === undefined || hasOwnProperty.call(obj, key);
};

nvt.extend = function() {
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}

	if (typeof target !== 'object' && !$.util.isFunction(target)) {
		target = {};
	}

	if (length === i) {
		target = this;
		--i;
	}

	for (; i < length; i++) {
		if ((options = arguments[i]) != null) {
			for (name in options) {
				src = target[name];
				copy = options[name];

				if (target === copy) {
					continue;
				}

				if (deep && copy && ($.util.isPlainObject(copy) || $.util.isArray(copy))) {
					var clone = src && ($.util.isPlainObject(src) || $.util.isArray(src)) ? src
						: $.util.isArray(copy) ? [] : {};

					target[name] = nvt.extend(deep, clone, copy);

				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	return target;
};

nvt.extend({
	prompts: [
		[ 'error', '参数异常' ],
		[ 'error', '投票还未开始' ],
		[ 'error', '投票已经结束' ],
		[ 'error', '还没选择选项' ],
		[ 'error', '最多只能选择%1项' ],
		[ 'error', '已经投过票了' ],
		[ 'error', '每天只能投%1次票' ],
		[ 'error', '请先登录网易通行证' ],
		[ 'error', '只允许通行证注册%1天后的用户投票' ],
		[ 'success', '投票成功' ],
		[ 'success', '投票成功' ],
		[ 'success', '投票成功' ],
		[ 'success', '投票成功' ]
	],
	
	getVoteData: function (vid, callback) {
		getJson('http://vote.news.163.com/vote2/jsonpItem.do', { vid: vid }, callback, 'data' + vid);
	},
	
	getVotePrompt: function (data, customPrompts) {
		var prompt = nvt.prompts[data.type];
		
		return {
			status: prompt[0],
			message: String.format(customPrompts ? customPrompts[data.type] : prompt[1], data.value),
			url: data.url
		}
	},
	
	submitDig: function (voteid, itemid, callback) {
		getJson('http://vote.news.163.com/vote2/djsonpVote.do', { voteid: voteid, itemid: itemid }, callback);
	},
	
	submitVote: function (voteid, itemid, callback) {
		var data = { voteId: voteid };
		
		data['vote' + voteid] = itemid;
		getJson('http://vote.news.163.com/vote2/jsonpVote.do', data, callback);
	}
});

nvt.Dig = function (id, options) {
	var t = this;
	
	t.options = nvt.extend(true, {}, t.options, options);
	t.id = id;
	t._create();
};

nvt.Dig.prototype = {
	constructor: nvt.Dig,
	options: {
		disabled: false,
		countSelector: '#nvt-dig-count',
		buttonSelector: '#nvt-dig-button',
		customPrompts: null,
		showPrompt: function (status, message) { alert(message); }
	},
	
	_create: function () {
		var t = this, o = t.options;
		
		t._submitDelegate = function (ev, option) {
			return t._submit(option);
		};
		
		nvt.getVoteData('v' + t.id, function (data) {		
			t._data = data[0];
			
			$.each(t._data.options, function (i, option) {
				option.disabled = false;
				option.$count = $(o.countSelector + option.oid) || null;
				option.$button = $(o.buttonSelector + option.oid) || null;
				
				t._build(option);
				option.$button && option.$button.addEvent('click', t._submitDelegate, option);
			});
		});
	},
	
	_build: function (option) {
		option.$count && option.$count.attr('innerHTML', option.count);
	},
	
	_submit: function (option) {
		var t = this, o = t.options;
		
		!o.disabled && !option.disabled && nvt.submitDig(t.id, option.oid, function(data){
			var vp = nvt.getVotePrompt(data, o.customPrompts);
			
			o.showPrompt.call(t, vp.status, vp.message);
			
			if (vp.status == 'success') {
				option.count++;
				option.disabled = true;
				
				t._build(option);
				
				o.success && o.success.call(t, option);
			}
		});
	},
	
	destroy: function () {
		var t = this, o = t.options;
		$.each(t._data.options, function (i, option) {
			option.$button && option.$button.removeEvent('click', t._submitDelegate);
		});
	},
	
	option: function(key, value) {
		var t = this, o = t.options,
			options = key;

		if (arguments.length === 0) {
			// don't return a reference to the internal hash
			return nvt.extend({}, t.options);
		}

		if  (typeof key === 'string') {
			if (value === undefined) {
				return t.options[key];
			}
			options = {};
			options[key] = value;
		}

		t._setOptions(options);

		return t;
	},
	
	_setOptions: function(options) {
		var t = this;
		
		$.each( options, function( key, value ) {
			t._setOption( key, value );
		});

		return t;
	},
	
	_setOption: function(key, value) {
		var t = this;
		
		t.options[ key ] = value;

		return t;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	
	disable: function() {
		return this._setOption( "disabled", true );
	}
};

nvt.Grade = function (id, options) {
	var t = this;
	
	t.options = nvt.extend(true, {}, t.options, options);
	t.id = id;
	t._create();
};

nvt.Grade.prototype = {
	constructor: nvt.Grade,
	options: {
		disabled: false,
		totalSelector: '#nvt-grade-total',
		scoreSelector: '#nvt-grade-score',
		graphSelector: '#nvt-grade-graph',
		gradeSelector: '#nvt-grade-grade',
		textSelector: '#nvt-grade-text',
		one: 'nvt-grade-one',
		half: 'nvt-grade-half',
		none: 'nvt-grade-none',
		unit: 0.1,
		customPrompts: [
			'参数异常',
			'评分还未开始',
			'评分已经结束',
			'还没选择选项',
			'最多只能选择%1项',
			'已经评过分了',
			'每天只能评%1次分',
			'请先登录网易通行证',
			'只允许通行证注册%1天后的用户评分',
			'评分成功',
			'评分成功',
			'评分成功',
			'评分成功'
		],
		getScore: function (index) { return index + 1; },
		showPrompt: function (status, message) { alert(message); }
	},
	
	_create: function () {
		var t = this, o = t.options;
		
		t._submitDelegate = function (ev, option) {
			return t._submit(option);
		};
		
		nvt.getVoteData('v' + t.id, function (data) {
			t._data = data[0];
			
			var total = 0, whole = 0;	
			
			t._data.disabled = false;
			t._data.$total = $(o.totalSelector + t.id) || null;
			t._data.$score = $(o.scoreSelector + t.id) || null;
			t._data.$graph = $(o.graphSelector + t.id) || null;
			t._data.$grade = $(o.gradeSelector + t.id) || null;
			
			$.each(t._data.options, function (i, option) {
				option.score = o.getScore(i);
				
				if (t._data.$grade) {
					var buttons = [], j = -1;
					
					option.$text = $(o.textSelector + option.oid) || null;
					option.$button = $(document.createElement('span')).addCss(o.none);
					
					while (++j <= i) {
						buttons.push(t._data.options[j].$button);
					}
					
					option.$button.addEvent('mouseover', function () {
						option.$text && option.$text.addCss('nvt-state-active');
						$(buttons).removeCss(o.none).addCss(o.one);	
					})
					.addEvent('mouseout', function () {
						option.$text && option.$text.removeCss('nvt-state-active');
						$(buttons).removeCss(o.one).addCss(o.none);
					})
					.addEvent('click', t._submitDelegate, option);
					
					t._data.$grade.appendChild(option.$button);
				}
				
				total += option.count;
				whole += option.count * option.score;
			});
			
			t._data.total = total;
			t._data.score = whole / total;
			
			t._build();
		});
	},
	
	_build: function () {
		var t = this, o = t.options;
		
		t._data.$total && t._data.$total.attr('innerHTML', t._data.total);
		t._data.$score && t._data.$score.attr('innerHTML', toFixed(t._data.score, o.unit));
		t._data.$graph && t._data.$graph.attr('innerHTML', t._graphHTML());
	},
	
	_submit: function (option) {
		var t = this, o = t.options;
		
		!o.disabled && !t._data.disabled && nvt.submitVote(t.id, option.oid, function (data) {
			var vp = nvt.getVotePrompt(data, o.customPrompts);
			
			o.showPrompt.call(t, vp.status, vp.message);
				
			if (vp.status == 'success') {
				var whole = t._data.score * t._data.total;
				
				option.count++;
				t._data.total++;
				t._data.score = (whole + option.score) / t._data.total;
				
				t._build();
				t._data.disabled = true;
				
				o.success && o.success.call(t, option);
			}
		});
	},
	
	_graphHTML: function () {
		var t = this, o = t.options, html = '';
		
		$.each(t._data.options, function (i, option) {
			if (i == 0) {
				html += '<span class="' + o.one + '"></span>';
			} else {
				var start = t._data.options[i - 1].score,
					end = option.score;
				
				start + (end - start) / 3 > t._data.score ?
					(html += '<span class="' + o.none + '"></span>') :
					start + (end - start) * 2 / 3 < t._data.score ?
						(html += '<span class="' + o.one + '"></span>') :
						(html += '<span class="' + o.half + '"></span>');
			}
		});
		
		return html;
	}
};

nvt.VoteBar = function (id, options) {
	var t = this;
	t.id = id;
	t.options = nvt.extend(true, {}, t.options, options);

	t._create();
}

nvt.VoteBar.prototype = {
	constructor: nvt.VoteBar,
	options: {
		disabled: false,
		isShowResult: false,
		isShowNewpage: false,
		newURL: "",
		endDate: "",
		countSelector: '#nvt-bar-count',
		rateSelector: '#nvt-bar-rate',
		troughSelector: '#nvt-bar-trough',
		formSelector:'#nvt-bar-form-',
		buttonSelector: '#nvt-bar-btn-',
		promptSelector: '#nvt-bar-prompt-',
		endTxt: '投票已结束',
		successTxt: '您已投票',
		customPrompts: null,
		showPrompt: function (status, message) { this.$promptArea && this.$promptArea.attr('innerHTML', '<span class="nvt-icon-' + status + '">' + message + '</span>'); }
	},
	_create: function () {
		var t = this, o = t.options;
		
		t.$form = $(o.formSelector+t.id) || {};
		t.$inputRadio = t.$form.$('input[type=radio]');
		t.$inputCheckbox = t.$form.$('input[type=checkbox]');
		t.$select = t.$form.$('select');
		t.$promptArea = $(o.promptSelector + t.id);
		t.$submitBtn = $(o.buttonSelector + t.id);
		
		t._checkEnd();
		
		
		if (o.isShowNewpage && !o.disabled) {
		    	t.$form.addEvent('submit', function(ev){
					ev.preventDefault();
					var self = this, voteData = serializeArray(self);
					
					if (voteData.length <= 1) {
						var vp = nvt.getVotePrompt({ type: 3 }, o.customPrompts);
						o.showPrompt.call(t, vp.status, vp.message);
						return false;
					}
		
					var oData = oParam(voteData);
					!o.disabled && getJson(self.action, oData, function(data){
						var vp = nvt.getVotePrompt(data, o.customPrompts);
						if (vp.status == 'success') {
							t._showDisabled();
						}
						o.showPrompt.call(t, vp.status, vp.message);
					});
					var tmp = t.$form.$("input")[0],
						 type = tmp.name.replace("vgId","Group").replace("voteId","Vote");
					o.newURL = "result" + type + ".do?" + tmp.name + "=" + tmp.value + "#result";
					o.newURL = self.action.replace("jsonp" + type + ".do",o.newURL);
					window.open(o.newURL);
				});
		}
		
		else if(!o.isShowResult && !o.disabled) {
			t.$form.addEvent('submit', function(ev){
				ev.preventDefault();
				
				if (t._locked) {
					return false;
				}
				
				t._locked = true;
				setTimeout(function () { t._locked = false }, 1000);
				
				var self = this, voteData = serializeArray(self);
				
				if (voteData.length <= 1) {
					var vp = nvt.getVotePrompt({ type: 3 }, o.customPrompts);
					o.showPrompt.call(t, vp.status, vp.message);
					return false;
				}
	
				var oData = oParam(voteData);	
	    
				!o.disabled && getJson(self.action, oData, function(data){
					var vp = nvt.getVotePrompt(data, o.customPrompts);
					
					if (vp.status != 'success') {
						o.showPrompt.call(t, vp.status, vp.message);
					}
					else {
						nvt.getVoteData(t.id, function (data) {		
							t._data = data;
							t.index = {};	
							t.$promptArea && (t.$promptArea.style.display = "none");		
							t._showDisabled();
							t._build();
							t._showBar();
							o.disabled = true;
						});		
					}
				});
			});		
		}
		
		else if (o.isShowResult && !o.disabled) {
			nvt.getVoteData(t.id, function (data) {		
				t._data = data;
				t.index = {};
				t._build();
				t._showBar();
						
				t.$form.addEvent('submit', function(ev){
					ev.preventDefault();
					
					if (t._locked) {
						return false;
					}
					
					t._locked = true;
					setTimeout(function () { t._locked = false }, 1000);
					
					var self = this, voteData = serializeArray(self);
					
					if (voteData.length <= 1) {
						var vp = nvt.getVotePrompt({ type: 3 }, o.customPrompts);
						o.showPrompt.call(t, vp.status, vp.message);
						return false;
					}
					
					var oData = oParam(voteData);
					
					!o.disabled && getJson(self.action, oData, function(data){
						var vp = nvt.getVotePrompt(data, o.customPrompts);
						
						if (vp.status != 'success') {
							o.showPrompt.call(t, vp.status, vp.message);
						}
						else {
							t.$promptArea && (t.$promptArea.style.display = "none");
							t._showDisabled();
							$.each(voteData.slice(1), function () {
								var arr = t.index[this.value];
								arr && t._data[arr[0]].total++;
								arr && t._data[arr[0]].options[arr[1]].count++;
							});
							t._build();
							t._showBar();
							o.disabled = true;
						}
					});
				});
			});
		}
	},
	_checkEnd: function () {
		var t = this, o = t.options;
		if (o.endDate != ""){
		  var endDate = o.endDate.replace(/-/g, "/"),
			   nowTime = new Date(),
			   endTime = new Date(Date.parse(endDate))
		  if ( nowTime > endTime) {
			  o.disabled = true;
			  t.$inputRadio && t.$inputRadio.addCss("hidden");
			  t.$inputCheckbox && t.$inputCheckbox.addCss("hidden");
			  
			  $(o.formSelector+t.id+' div.nvt-bar').addCss("nvt-bar-isend");
			  t.$submitBtn && (t.$submitBtn.attr('disabled','disabled').attr('value',o.endTxt).style.width="auto");
			  nvt.getVoteData(t.id, function (data) {
				  t._data = data;			
				  t.index = {};
				  t._build();
				  t._showBar();
			  });
		  }
		}
	},
	_build: function () {
		var t = this, o = t.options, total = 0;
		$.each(t._data, function (i, group) {
			var total = 0;
			$.each(group.options, function (j, option) {
				option.index = j + 1;
				total += option.count;
				t.index[option.oid] = [i, j];
			});
			group.total = total;
		});
		$.each(t._data, function (i, group) {	
			$.each(group.options, function (j, option) {
				option.rate = Math.round(option.count / group.total * 1000) / 10;
				var count = $(o.countSelector + option.oid),
				     trough = $(o.troughSelector + option.oid),
					 rate = $(o.rateSelector + option.oid);
				count && count.attr('innerHTML', option.count);
				trough && (trough.style.width = option.rate + "%");
				rate && rate.attr('innerHTML', "(" + option.rate + "%)");
			});
			total += group.total;
		});
	},
	_showBar: function () {
		var t = this, o = t.options;
		t.$form.$(' div.nvt-bar').each( function() {this.style.display = "block"});
		t.$form.$(' div.nvt-bar-trough > span').each(function () {
			var self = this,
				width = parseFloat(self.style.width),
				start = 0,
				timer;
			self.style.width = start;
			if (timer === undefined) {
				timer = setInterval(function () {
					if (start >= width) {
						clearInterval(timer);
						timer = undefined;
						return;
					}
					start = Math.min(start + Math.ceil(width - start) / 10, width);
					self.style.width = start + '%';
				}, 13);
			}
		});
	},
	_showDisabled: function () {
		var t = this, o = t.options;
		t.$inputRadio && t.$inputRadio.attr('disabled','disabled');
		t.$inputCheckbox && t.$inputCheckbox.attr('disabled','disabled');
		t.$select && t.$select.attr('disabled','disabled');
		t.$submitBtn && (t.$submitBtn.attr('disabled','disabled').attr('value',o.successTxt));	
	}
};

nvt.VoteSingle = function (id, options) {
	var t = this;
	t.id = id;
	t.options = nvt.extend(true, {}, t.options, options);

	t._create();	
}

nvt.VoteSingle.prototype = {
	constructor: nvt.VoteSingle,
	options: {
		disabled: false,
		endDate: "",
		newURL: "",
		countSelector: '#nvt-single-count',
		buttonSelector: '#nvt-single-btn',
		disabledCss: 'nvt-single-disabled',
		hoverCss: 'nvt-single-hover',
		customPrompts: null,
		showPrompt: function (status, message) { if(status == 'error') { alert(message); } },
		success: function (option) { this._showDisabled(); }
	},
	_create: function () {
		var t = this, o = t.options;
		
		t._checkEnd();
		
		t._submitDelegate = function (ev, option) {
			ev.preventDefault();
			if ( o.newURL != "") {
				t._showNewPage();
			}
			return t._submit(option);
		};
		
		t._addBtnHover = function () {
			$.style.addCss(this, o.hoverCss);
		};
		t._removeBtnHover = function () {
			$.style.removeCss(this, o.hoverCss);
		};
		
		if (!o.disabled) {
			nvt.getVoteData("v" + t.id, function (data) {	
				t._data = data[0];
				
				$.each(t._data.options, function (i, option) {
					option.$count = $(o.countSelector + option.oid) || null;
					option.$button = $(o.buttonSelector + option.oid) || null;
					
					t._build(option);
					option.$button && option.$button
					    .addEvent('click', t._submitDelegate, option)
						.addEvent('mouseover', t._addBtnHover)
						.addEvent('mouseout', t._removeBtnHover);
				});	
			});
		}
	},
	_checkEnd: function () {
		var t = this, o = t.options;
		if (o.endDate != ""){
		  var endDate = o.endDate.replace(/-/g, "/"),
			   nowTime = new Date(),
			   endTime = new Date(Date.parse(endDate))
		  if ( nowTime > endTime) {
			  o.disabled = true;
			  nvt.getVoteData("v" + t.id, function (data) {	
				  t._data = data[0];
				  $.each(t._data.options, function (i, option) {
					  option.$count = $(o.countSelector + option.oid) || null;
					  option.$button = $(o.buttonSelector + option.oid) || null;
					  t._build(option);
				  });
				  t._showDisabled();
			  });
		  }
		}
	},
	_build: function (option) {
		option.$count && option.$count.attr('innerHTML', option.count);
	},
	_showDisabled: function () {
		var t = this, o = t.options;
		t._data && $.each(t._data.options, function (i, option) {
			option.$button && option.$button
			    .removeEvent('mouseover', t._addBtnHover)
			    .removeEvent('mouseout', t._removeBtnHover)
			    .removeCss(o.hoverCss)
			    .addCss(o.disabledCss);
		});
	},
	_submit: function (option) {
		var t = this, o = t.options;
		
		!o.disabled && nvt.submitVote( t.id , option.oid , function(data){
			var vp = nvt.getVotePrompt(data, o.customPrompts);
			
			o.showPrompt.call(t, vp.status, vp.message);
			
			if (vp.status == 'success') {
				option.count++;
				o.disabled = true;
				
				t._build(option);
				o.success && o.success.call(t, option);
			}
		});
	},
	_showNewPage: function () {
		var t = this, o = t.options;
		if ( o.newURL != "") {
			window.open(o.newURL)
		}
	}
};

function getJson (url, data, callback, jsonpCallback) {
	var jsonp = jsonpCallback || ('jsonp' + jsc++);
		
	if (data) {
		var d, getData = [];
		for (d in data) {
			data[d] != null && getData.push(d + '=' + encodeURIComponent(data[d]));
		}
		getData = getData.join('&').replace(r20, '+');
		url += ('?' + getData + '&callback=' + jsonp);
		getData = undefined;
	} else {
		url += ('?callback=' + jsonp)	
	}
	
	window[jsonp] = window[jsonp] || function(tmp) {
		callback(tmp);

		window[jsonp] = undefined;
		try {
			delete window[jsonp];
		} catch(e) {}
	};
	
	$.ajax.importJs(url);
}

function serializeArray (form) {
	var data = [], value;
	
	$.each(form.elements, function (i, el) {
		if (el.name && !el.disabled && (el.checked || rselectTextarea.test(el.nodeName) || rinput.test(el.type))) {
			el.nodeName.toUpperCase() === 'SELECT' && el.multiple == true && el.selectedIndex >= 0 ?
			$.each(el.options, function (i, option) {
				option.selected && data.push({ name: el.name, value: option.value });
			}) :
			el.value !== undefined && data.push({ name: el.name, value: el.value });
		}
	});
	
	return data;
}

function oParam (args) {
	var o = {};
	
	$.each(args, function () {
		var key = o[this.name], val = this.value;
		o[this.name] = (key === undefined ? val : $.util.isArray(key) ? key.concat(val) : [key, val]);
	});
	
	return o;
}

function toFixed (num, unit) {
	if (isNaN(unit) || unit <= 0) {
		throw 'unit error';
	}
	
	num = Math.round(num / unit) * unit;
	if (unit < 1) {
		num = new Number(num).toFixed(Math.ceil(-1 * Math.log(unit) / Math.LN10));
	}
	
	return '' + num;
}

window.nvt = nvt;

})(window);