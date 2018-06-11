var LSystem=function(){"use strict";function t(t){let s,i=t[0].match(/(.+)<(.)/),o=t[0].match(/(.)>(.+)/);if(null===i&&null===o)return t;let e=t[1].successor||t[1].successors?t[1]:{successor:t[1]};return null!==i&&(s=i[2],e.leftCtx=i[1]),null!==o&&(s=o[1],e.rightCtx=o[2]),[s,e]}function s(t){if("string"!=typeof t&&t instanceof String==!1)return t;let s=[];for(let i of t)s.push({symbol:i});return s}function i(t,i){return t[1]=function t(i,o){if(i.hasOwnProperty("successors"))for(var e=0;e<i.successors.length;e++)i.successors[e]=t(i.successors[e],o);else!1===i.hasOwnProperty("successor")&&(i={successor:i});return o&&i.hasOwnProperty("successor")&&(i.successor=s(i.successor)),i}(t[1],i),t}function LSystem({axiom:o="",productions:e,finals:r,branchSymbols:n="",ignoredSymbols:c="",allowClassicSyntax:a=!0,classicParametricSyntax:h=!1,forceObjects:l=!1,debug:u=!1}){return this.setAxiom=function(t){this.axiom=this.forceObjects?s(t):t},this.getRaw=function(){return this.axiom},this.getString=function(t=!0){return"string"==typeof this.axiom?this.axiom:!0===t?this.axiom.reduce((t,s)=>{if(void 0===s.symbol)throw console.log("found:",s),new Error("L-Systems that use only objects as symbols (eg: {symbol: 'F', params: []}), cant use string symbols (eg. 'F')! Check if you always return objects in your productions and no strings.");return t+s.symbol},""):JSON.stringify(this.axiom)},this.getStringResult=this.getString,this.setProduction=function(s,o,e=!1){let r=[s,o];if(void 0===r)throw new Error("no production specified.");if(o.successor&&o.successors)throw new Error('You can not have both a "successor" and a "successors" field in your production!');if(!0===this.allowClassicSyntax&&(r=t(r,this.ignoredSymbols)),(r=i(r,this.forceObjects))[1].isStochastic=void 0!==r[1].successors&&r[1].successors.every(t=>void 0!==t.weight),r[1].isStochastic){r[1].weightSum=0;for(let t of r[1].successors)r[1].weightSum+=t.weight}let n=r[0];if(!0===e&&this.productions.has(n)){let t=this.productions.get(n),s=t.successor,i=t.successors;s&&!i&&(t={successors:[t]}),t.successors.push(r[1]),this.productions.set(n,t)}else this.productions.set(n,r[1])},this.setProductions=function(t){if(void 0===t)throw new Error("no production specified.");this.clearProductions();for(let s of Object.entries(t)){let t=s[0],i=s[1];this.setProduction(t,i,!0)}},this.clearProductions=function(){this.productions=new Map},this.setFinal=function(t,s){let i=[t,s];if(void 0===i)throw new Error("no final specified.");this.finals.set(i[0],i[1])},this.setFinals=function(t){if(void 0===t)throw new Error("no finals specified.");this.finals=new Map;for(let s in t)t.hasOwnProperty(s)&&this.setFinal(s,t[s])},this.getProductionResult=function(t,s,i,o,e=!1){let r=void 0!==t.leftCtx||void 0!==t.rightCtx,n=!1,a=!0;if(void 0!==t.condition&&!1===t.condition({index:s,currentAxiom:this.axiom,part:i,params:o})?a=!1:r&&(void 0!==t.leftCtx&&void 0!==t.rightCtx?a=this.match({direction:"left",match:t.leftCtx,index:s,branchSymbols:"[]"}).result&&this.match({direction:"right",match:t.rightCtx,index:s,branchSymbols:"[]",ignoredSymbols:c}).result:void 0!==t.leftCtx?a=this.match({direction:"left",match:t.leftCtx,index:s,branchSymbols:"[]"}).result:void 0!==t.rightCtx&&(a=this.match({direction:"right",match:t.rightCtx,index:s,branchSymbols:"[]"}).result)),!1===a)n=!1;else if(t.successors){var h,l;t.isStochastic&&(l=Math.random()*t.weightSum,h=0);for(let e of t.successors){if(t.isStochastic&&(h+=e.weight)<l)continue;let r=this.getProductionResult(e,s,i,o,!0);if(void 0!==r&&!1!==r){n=r;break}}}else n="function"==typeof t.successor?t.successor({index:s,currentAxiom:this.axiom,part:i,params:o}):t.successor;return n||(e?n:i)},this.applyProductions=function(){let t="string"==typeof this.axiom?"":[],s=0;for(let i of this.axiom){let o=i.symbol||i,e=i.params||[],r=i;if(this.productions.has(o)){let t=this.productions.get(o);r=this.getProductionResult(t,s,i,e)}"string"==typeof t?t+=r:r instanceof Array?Array.prototype.push.apply(t,r):t.push(r),s++}return this.axiom=t,t},this.iterate=function(t=1){let s;this.iterations=t;for(let i=0;i<t;i++)s=this.applyProductions();return s},this.final=function(t){let s=0;for(let i of this.axiom){let o=i;if("object"==typeof i&&i.symbol&&(o=i.symbol),this.finals.has(o)){let e=this.finals.get(o),r=typeof e;if("function"!==r)throw Error("'"+o+"' has an object for a final function. But it is __not a function__ but a "+r+"!");e({index:s,part:i},t)}s++}},this.match=function({axiom_:t,match:s,ignoredSymbols:i,branchSymbols:o,index:e,direction:r}){let n=0,c=0;t=t||this.axiom,void 0===o&&(o=void 0!==this.branchSymbols?this.branchSymbols:[]),void 0===i&&(i=void 0!==this.ignoredSymbols?this.ignoredSymbols:[]);let a,h,l,u,f,m,d,g=[];if("right"===r){if(u=m=1,l=e+1,f=0,d=s.length,o.length>0){var y=o;a=y[0],h=y[1]}}else{if("left"!==r)throw Error(r,"is not a valid direction for matching.");if(u=m=-1,l=e-1,f=s.length-1,d=-1,o.length>0){var p=o;h=p[0],a=p[1]}}for(;l<t.length&&l>=0;l+=u){let o=t[l].symbol||t[l],e=s[f];if(o===e){if((0===n||c>0)&&(o===a?(c++,n++,f+=m):o===h?(c=Math.max(0,c-1),n=Math.max(0,n-1),0===c&&(f+=m)):(g.push(l),f+=m)),f===d)return{result:!0,matchIndices:g}}else if(o===a)n++,c>0&&c++;else if(o===h)n=Math.max(0,n-1),c>0&&(c=Math.max(0,c-1));else if((0===n||c>0&&e!==h)&&!1===i.includes(o))return{result:!1,matchIndices:g}}return{result:!1,matchIndices:g}},this.ignoredSymbols=c,this.debug=u,this.branchSymbols=n,this.allowClassicSyntax=a,this.classicParametricSyntax=h,this.forceObjects=l,this.setAxiom(o),this.clearProductions(),e&&this.setProductions(e),r&&this.setFinals(r),this}return LSystem.transformClassicStochasticProductions=function(t){return function(){let s=t,i=s.length,o=Math.random();for(let t=0;t<i;t++)if(o<=(t+1)/i)return s[t];console.error("Should have returned a result of the list, something is wrong here with the random numbers?.")}},LSystem.transformClassicCSProduction=t,LSystem.transformClassicParametricAxiom=function(t){let s=t.replace(/\s+/g,"").split(/[\(\)]/),i=[];for(let t=0;t<s.length-1;t+=2){let o=s[t+1].split(",").map(Number);i.push({symbol:s[t],params:o})}},LSystem.testClassicParametricSyntax=function(t){return/\(.+\)/.test(t)},LSystem}();
