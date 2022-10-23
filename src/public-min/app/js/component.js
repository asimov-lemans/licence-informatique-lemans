class PlanningFetchEvent extends Event{constructor(t){super("planningfetch"),this.request=t}}class PlanningViewer extends HTMLElement{data;__days_element={};start_date;end_date;__left_bar=document.createElement("div");__container=document.createElement("div");__right_bar=document.createElement("div");__first_load=!0;__scroll_left;__scroll_width;__client_width;__intersection_observer=new IntersectionObserver((t=>{for(const e of t)e.isIntersecting&&Math.sign(e.boundingClientRect.x)&&this.dispatchEvent(new PlanningFetchEvent(Math.sign(e.boundingClientRect.x)))}),{threshold:.1});constructor(){super(),this.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent="*{position:relative;z-index:0;margin:0;padding:0}:host{display:flex;height:100%;white-space:nowrap}.container{height:100%;width:100%}.left-bar,.right-bar{position:absolute;top:50%;z-index:1;height:20%;width:.2em;opacity:.5;border-radius:.2em;translate:0.2em -50%;background-color:var(--color-dark-0);transition:.3s ease-in-out opacity}.right-bar{right:0;translate:-0.2em -50%}",this.__left_bar.classList.add("left-bar"),this.__right_bar.classList.add("right-bar");const e=document.createElement("slot");this.__container.classList.add("container"),this.__container.append(e),this.shadowRoot.append(t,this.__left_bar,this.__container,this.__right_bar),this.__scroll_left=this.__container.scrollLeft,this.__scroll_width=this.__container.scrollWidth,this.__client_width=this.__container.clientWidth,this.update_indicator_bars(),this.__container.addEventListener("scroll",(()=>{this.__scroll_left=this.__container.scrollLeft,this.update_indicator_bars()}),{passive:!0}),new Scroll(this.__container,1),new ScrollSnap(this.__container,1,this,"planning-viewer > day-viewer"),window.addEventListener("resize",(()=>{this.__resize_scroll(),this.update_indicator_bars()}),{passive:!0})}reset(){this.data=void 0,this.__days_element={},this.start_date=void 0,this.end_date=void 0,this.__first_load=!0,this.__intersection_observer.disconnect(),this.innerHTML="",this.__scroll_left=this.__container.scrollLeft,this.__scroll_width=this.__container.scrollWidth,this.__client_width=this.__container.clientWidth,this.update_indicator_bars()}__resize_scroll(){const t=this.__scroll_width-this.__client_width,e=this.__container.scrollWidth-this.__container.clientWidth;this.__container.scrollLeft=(this.__scroll_left+this.__client_width/2)/t*e-this.__container.clientWidth/2,this.__scroll_left=this.__container.scrollLeft,this.__scroll_width=this.__container.scrollWidth,this.__client_width=this.__container.clientWidth}__update_indicator_bars=debounce((()=>{this.__left_bar.style.opacity=0,this.__right_bar.style.opacity=0}),1e3);update_indicator_bars=()=>{const t=this.__container.scrollWidth-this.__container.clientWidth;this.__update_indicator_bars(),requestAnimationFrame((()=>{if(t){const e=this.__container.scrollLeft/t;this.__left_bar.style.opacity=.5,this.__right_bar.style.opacity=.5,e>=1?(this.__left_bar.style.display="block",this.__right_bar.style.display="none"):e<=0?(this.__left_bar.style.display="none",this.__right_bar.style.display="block"):(this.__left_bar.style.display="block",this.__right_bar.style.display="block")}else this.__left_bar.style.display="none",this.__right_bar.style.display="none"}))};focus(t,e=!1){t instanceof Date&&(t=t.toISOString()),this.__days_element[t]&&(e&&(this.__container.style.scrollBehavior="auto"),this.__container.scrollLeft=this.__days_element[t].getBoundingClientRect().x-this.__container.clientWidth/2+this.__days_element[t].clientWidth/2,this.__scroll_left=this.__container.scrollLeft,this.__scroll_width=this.__container.scrollWidth,this.__client_width=this.__container.clientWidth,e&&(this.__container.style.scrollBehavior=""))}load(t){this.data=t;let e=new Date(t?.start_date),i=new Date(t?.end_date);if(this.__intersection_observer.disconnect(),this.__scroll_left=this.__container.scrollLeft,this.__scroll_width=this.__container.scrollWidth,this.__client_width=this.__container.clientWidth,planning_resources_name[t?.level]?.name_list[t?.group]&&e.toJSON()&&i.toJSON()&&compare_date(e,i)>0&&t?.days?.length&&t.days.every((t=>new Date(t.date).toJSON()))){e=keep_only_date(e),i=keep_only_date(i),this.start_date||(this.start_date=e),this.end_date||(this.end_date=i);const s=[];let n=new Date(e);for(;compare_date(n,i);)s.push(n.toISOString()),n=add_days(n,1);for(const t of s)this.__days_element[t]||(this.__days_element[t]=document.createElement("day-viewer"),this.__days_element[t].dataset.date=t,compare_date(this.start_date,t)<0?(this.__days_element[this.start_date.toISOString()].before(this.__days_element[t]),this.__scroll_left+=this.__container.scrollWidth-this.__scroll_width):this.append(this.__days_element[t]),this.__scroll_width=this.__container.scrollWidth);for(const i in this.__days_element)if(s.includes(i))this.__days_element[i].load(t.days.find((t=>t.date==i)),i);else{const t=this.__days_element[i].dataset.date;this.__days_element[i].delete(),delete this.__days_element[i],compare_date(t,e)>0&&(this.__scroll_left+=this.__container.scrollWidth-this.__scroll_width),this.__scroll_width=this.__container.scrollWidth}this.start_date=e,this.end_date=i,this.__first_load?(this.__first_load=!1,this.focus(keep_only_date(new Date),!0)):(this.__container.scrollLeft=this.__scroll_left,this.__scroll_left=this.__container.scrollLeft,this.__scroll_width=this.__container.scrollWidth,this.__client_width=this.__container.clientWidth),this.__intersection_observer.observe(this.children[0]),this.__intersection_observer.observe(this.children[this.children.length-1])}this.update_indicator_bars()}}class DayViewer extends HTMLElement{__lessons_element={};__date_element=document.createElement("h2");__day_element=document.createElement("h3");__top_bar=document.createElement("div");__container=document.createElement("div");__bottom_bar=document.createElement("div");constructor(){super(),this.attachShadow({mode:"open"});const t=document.createElement("style"),e=document.createElement("time");e.append(this.__date_element),e.append(this.__day_element),t.textContent="*{position:relative;z-index:0;margin:0;padding:0}:host{display:inline-block;flex-shrink:0;height:100%;width:95vmin;padding:0 2.5vmin!important}time{position:absolute;top:0;width:95vmin}h2{padding:1em;padding-bottom:0;text-align:center}h3{padding-bottom:.2em;text-align:center;font-size:1em}.container{position:absolute;top:5.1em;height:calc(100% - 5em - 2.5vmin);width:95vmin;border-radius:.5em}.bottom-bar,.top-bar{position:absolute;top:5.1em;left:50%;z-index:1;height:.2em;width:80%;opacity:.5;border-radius:.2em;translate:-50% 0.2em;background-color:var(--color-dark-0);transition:.3s ease-in-out opacity}.bottom-bar{top:auto;bottom:0;translate:-50% -0.8em}",this.__top_bar.classList.add("top-bar"),this.__bottom_bar.classList.add("bottom-bar");const i=document.createElement("slot");this.__container.classList.add("container"),this.__container.append(i),this.shadowRoot.append(t,e,this.__top_bar,this.__container,this.__bottom_bar),this.update_indicator_bars(),this.__container.addEventListener("scroll",this.update_indicator_bars,{passive:!0}),new Scroll(this.__container,2),new ScrollSnap(this.__container,2,this,"day-viewer > lesson-viewer"),window.addEventListener("resize",this.update_indicator_bars,{passive:!0})}delete(){window.removeEventListener("resize",this.update_indicator_bars,{passive:!0}),this.remove()}__update_indicator_bars=debounce((()=>{this.__top_bar.style.opacity=0,this.__bottom_bar.style.opacity=0}),1e3);update_indicator_bars=()=>{const t=this.__container.scrollHeight-this.__container.clientHeight;this.__update_indicator_bars(),requestAnimationFrame((()=>{if(t){const e=this.__container.scrollTop/t;this.__top_bar.style.opacity=.5,this.__bottom_bar.style.opacity=.5,e>=1?(this.__top_bar.style.display="block",this.__bottom_bar.style.display="none"):e<=0?(this.__top_bar.style.display="none",this.__bottom_bar.style.display="block"):(this.__top_bar.style.display="block",this.__bottom_bar.style.display="block")}else this.__top_bar.style.display="none",this.__bottom_bar.style.display="none"}))};load(t,e){if(this.__date_element.textContent=new Intl.DateTimeFormat("default",{dateStyle:"long"}).format(new Date(e)),this.__day_element.textContent=new Intl.DateTimeFormat("default",{weekday:"long"}).format(new Date(e)),t?.lessons?.length&&t.lessons.every((t=>new Date(t.start_date).toJSON()&&new Date(t.end_date).toJSON()))){const e=Object.keys(this.__lessons_element),i=t.lessons.reduce(((t,e)=>(t[e.start_date+e.end_date]=e,t)),{});for(const t of e)i[t]?(this.__lessons_element[t].load(i[t]),delete i[t]):(this.__lessons_element[t]?.remove(),delete this.__lessons_element[t]);for(const t in i){const e=document.createElement("lesson-viewer");e.dataset.start_date=i[t].start_date,e.dataset.end_date=i[t].end_date,e.load(i[t]);const s=[...this.children];let n=s.findLast((e=>compare_date(i[t].end_date,e.dataset.start_date)<=0));if(n)n.after(e);else{let n=s.find((e=>compare_date(i[t].start_date,e.dataset.end_date)>=0));n?n.before(e):this.appendChild(e)}this.__lessons_element[t]=e}}else this.__lessons_element={},this.innerHTML="";this.update_indicator_bars()}}class LessonViewer extends HTMLElement{__container=document.createElement("div");__title_element=document.createElement("h3");__description_element=document.createElement("p");__start_date_element=document.createElement("time");__end_date_element=document.createElement("time");__rooms_element=document.createElement("span");data=null;__show_state=!1;constructor(){super(),this.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent="*{position:relative;z-index:0;margin:0;padding:0}:host{display:block;margin:1.5em 0!important;width:100%;box-sizing:border-box;padding:.5em!important;border-radius:.5em;color:var(--color-dark-1);background:linear-gradient(180deg,var(--color-light-1) 0,var(--color-light-1) 50%,var(--color-accent-1) 50%,var(--color-accent-1) 100%);background-size:100% 201%;background-position-y:100%;cursor:pointer}h3{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}div.show h3{white-space:normal}p{display:none;margin-top:1em}div.show p{display:block}.bottom-bar{display:inline-block;margin-top:1em;width:100%}.rooms{display:inline-block;float:right;width:45%;overflow:hidden;text-align:right;text-overflow:ellipsis;white-space:nowrap}div.show .rooms{white-space:normal}",this.__rooms_element.classList.add("rooms");const e=document.createElement("span");e.classList.add("bottom-bar"),e.append(this.__start_date_element," - ",this.__end_date_element,this.__rooms_element),this.__container.append(this.__title_element,this.__description_element,e),this.shadowRoot.append(t,this.__container),this.addEventListener("pointerdown",(()=>{this.show(),setTimeout((()=>this.scrollIntoView({inline:"center",behavior:"smooth"})),50)})),this.addEventListener("focusout",(()=>{this.hide()})),window.requestAnimationFrame((()=>{let t;this.tabIndex=0;const e=()=>{window.requestAnimationFrame((()=>{if(compare_date(this.dataset.end_date,new Date)>=0)this.style.backgroundPositionY="0%",clearInterval(t);else if(compare_date(this.dataset.start_date,new Date)>=0){const t=new Date(this.dataset.end_date).getTime()-new Date(this.dataset.start_date).getTime(),e=new Date(this.dataset.end_date).getTime()-new Date;this.style.backgroundPositionY=e/t*100+"%"}}))};t=setInterval(e,12e4),e()}))}show(){this.data&&!this.__show_state&&(this.__container.classList.add("show"),this.__rooms_element.innerHTML=this.__rooms_element.innerHTML.replaceAll(", ","<br>"),this.__show_state=!0)}hide(){this.data&&this.__show_state&&(this.__container.classList.remove("show"),this.__rooms_element.innerHTML=this.__rooms_element.innerHTML.replaceAll("<br>",", "),this.__show_state=!1)}load(t){if("string"==typeof t?.title&&t?.description?.length&&t.description.every((t=>"string"==typeof t))&&t?.rooms?.length&&t.rooms.every((t=>"string"==typeof t))&&new Date(t.start_date).toJSON()&&new Date(t.end_date).toJSON()){const e=new Intl.DateTimeFormat("default",{timeStyle:"short"});t.title.match(/exam|qcm|contrôle|partiel|soutenance/i)?this.style.backgroundImage="linear-gradient(180deg, #f9d2d9 0%, #f9d2d9 50%, #f9335f 50%, #f9335f 100%)":t.title.match(/cour|cm|conférence/i)?this.style.backgroundImage="linear-gradient(180deg, #faefce 0%, #faefce 50%, #fcd570 50%, #fcd570 100%)":t.title.match(/td|gr[ ]*[a-c]/i)?this.style.backgroundImage="linear-gradient(180deg, #ddf8e8 0%, #ddf8e8 50%, #74eca8 50%, #74eca8 100%)":t.title.match(/tp|gr[ ]*[1-6]/i)&&(this.style.backgroundImage="linear-gradient(180deg, #dcf9f6 0%, #dcf9f6 50%, #70f0ee 50%, #70f0ee 100%)"),this.__title_element.textContent=t.title,this.__description_element.textContent=t.description.join("\n"),this.__description_element.innerHTML=this.__description_element.innerHTML.replaceAll("\n","<br>"),this.__start_date_element.textContent=e.format(new Date(t.start_date)),this.__start_date_element.dateTime=t.start_date,this.__end_date_element.textContent=e.format(new Date(t.end_date)),this.__end_date_element.dateTime=t.end_date,this.__rooms_element.textContent=t.rooms.join(", "),this.data=t}else this.__title_element.textContent="",this.__start_date_element.textContent="",this.__start_date_element.dateTime="",this.__end_date_element.textContent="",this.__end_date_element.dateTime="",this.__rooms_element.textContent="",this.data=null}}class PlanningButton extends HTMLElement{__level;__group;__svg_element;__switch_planning_callback;__fetch_favorite_planning_callback;constructor(){super(),this.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=":host{display:block;height:1.5em;cursor:pointer}svg{margin-right:.5em;height:1em;fill:transparent;stroke:var(--color-accent-0);stroke-width:3.5em;transition:.2s ease-in-out fill,.2s ease-in-out stroke}x svg.selected{fill:var(--color-accent-0)}svg:focus,svg:hover{stroke:var(--color-accent-1)}svg.selected:focus,svg.selected:hover{fill:var(--color-accent-1)}\n    ";const e=document.createElement("slot");this.style.display="",this.shadowRoot.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -10 584 567">\x3c!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --\x3e<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>',this.shadowRoot.append(t,e),this.__svg_element=this.shadowRoot.firstChild,this.__svg_element.addEventListener("click",(()=>{let t=JSON.parse(localStorage.getItem("favorites"));this.__svg_element.classList.toggle("selected")?(t.push({level:this.__level,group:this.__group}),this.__fetch_favorite_planning_callback(this.__level,this.__group)):(t=t.filter((t=>t.level!=this.__level||t.group!=this.__group)),localStorage.removeItem(`${this.__level}:${this.__group}`)),localStorage.setItem("favorites",JSON.stringify(t))})),this.addEventListener("click",(t=>{t.composedPath().some((t=>t==this.__svg_element))||this.__switch_planning_callback(this.__level,this.__group)}))}init(t,e,i,s){JSON.parse(localStorage.getItem("favorites")).some((i=>i.level==t&&i.group==e))&&this.__svg_element.classList.add("selected"),this.__level=t,this.__group=e,this.__switch_planning_callback=i,this.__fetch_favorite_planning_callback=s,this.style.display="",this.textContent=planning_resources_name[t].name_list[e]}}customElements.define("planning-viewer",PlanningViewer),customElements.define("day-viewer",DayViewer),customElements.define("lesson-viewer",LessonViewer),customElements.define("planning-button",PlanningButton);
