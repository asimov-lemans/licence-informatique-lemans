class Scroll{#e;#t;#i={x:0,y:0};#s=.975;#n=!1;#l=!1;#o=!1;constructor(e,t=0){this.#e=t,this.#t=e,this.#h=this.#h.bind(this),this.#r=this.#r.bind(this),this.#p=this.#p.bind(this),this.#a=this.#a.bind(this),this.#t.style.overflow="hidden",e.addEventListener("wheel",this.#h,{passive:!0}),e.addEventListener("pointerdown",this.#r)}#h=e=>{this.#t.style.scrollBehavior="auto",this.#t.style.scrollSnapType="none",this.apply_scroll(e.deltaX,e.deltaY,e.shiftKey)};#r=e=>{this.#n=!0,this.#i.x=e.clientX,this.#i.y=e.clientY,this.#t.style.scrollBehavior="auto",this.#t.style.scrollSnapType="none",this.#t.addEventListener("pointermove",this.#p,{passive:!0}),this.#t.addEventListener("pointerup",this.#a),this.#t.addEventListener("pointerleave",this.#a),this.#t.addEventListener("lostpointercapture",this.#a)};#p=e=>{this.apply_scroll(this.#i.x-e.clientX,this.#i.y-e.clientY,!1,!1),this.#i.x=e.clientX,this.#i.y=e.clientY};#a=()=>{this.#t.removeEventListener("pointermove",this.#p,{passive:!0}),this.#t.removeEventListener("pointerup",this.#p),this.#t.removeEventListener("pointerleave",this.#a),this.#t.removeEventListener("lostpointercapture",this.#a),this.#n=!1,this.#d()};apply_scroll(e,t,i=!1,s=!0){if(s&&(this.#n=!1,this.#o=!1),this.#l&&!this.#n){const i=Math.max(window.innerHeight/window.innerWidth,1);e*=i,t*=i}if(!this.#n){const i=Math.abs(e)<1,s=Math.abs(t)<1;e*=this.#s,t*=this.#s,i&&(e=0),s&&(t=0),i&&s&&(this.#o=!1)}!this.#o&&this.#n&&(this.#o=!0),window.requestAnimationFrame((()=>{1==this.#e&&(s&&(this.#t.scrollLeft+=t),this.#t.scrollLeft+=e),2==this.#e&&(this.#t.scrollTop+=t,s&&(this.#t.scrollTop+=e)),3==this.#e&&(s&&i?(this.#t.scrollTop+=e,this.#t.scrollLeft+=t):(this.#t.scrollTop+=t,this.#t.scrollLeft+=e)),this.#o&&!this.#n&&this.apply_scroll(e,t,i,s),s||this.#d(),this.#l=this.#n}))}#d=debounce((()=>{this.#n||(this.#t.style.scrollBehavior="",this.#t.style.scrollSnapType="")}),50)}
