'use strict';
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const config = window.DOUBLEU_CONFIG || {};
  const nav = $('.nav-links'), toggle = $('.mobile-toggle'), serviceNav = $('.services-nav');
  const serviceButton = $('button', serviceNav), menu = $('#services-menu');
  let closeTimer;
  const scrim = document.createElement('button');
  scrim.className = 'menu-scrim'; scrim.setAttribute('aria-label', 'Close services menu');scrim.hidden = true;
  document.body.append(scrim);
  function setMenu(open) {
    menu.hidden = !open;serviceButton.setAttribute('aria-expanded', String(open));
    $('svg',serviceButton)?.classList.toggle('rotate',open);
    scrim.hidden = !open || nav.classList.contains('mobile-open');
  }
  function setMobile(open) {
    nav.classList.toggle('mobile-open',open);toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    document.body.style.overflow = open ? 'hidden' : '';setMenu(false);
    if(open) $('a',nav)?.focus();else toggle.focus();
  }
  serviceButton.addEventListener('click',()=>setMenu(menu.hidden));
  serviceNav.addEventListener('mouseenter',()=>{clearTimeout(closeTimer);if(matchMedia('(hover:hover)').matches)setMenu(true);});
  serviceNav.addEventListener('mouseleave',()=>{if(!nav.classList.contains('mobile-open'))closeTimer=setTimeout(()=>setMenu(false),150);});
  toggle.addEventListener('click',()=>setMobile(!nav.classList.contains('mobile-open')));
  scrim.addEventListener('click',()=>setMenu(false));
  document.addEventListener('click',e=>{if(!serviceNav.contains(e.target)&&!toggle.contains(e.target))setMenu(false);});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){setMenu(false);if(nav.classList.contains('mobile-open'))setMobile(false);serviceButton.focus();}
    if(e.key==='Tab'&&nav.classList.contains('mobile-open')){
      const items=$$('a,button',nav).filter(el=>el.getClientRects().length);items.push(toggle);
      if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();toggle.focus();}
      else if(!e.shiftKey&&document.activeElement===toggle){e.preventDefault();items[0].focus();}
    }
  });
  $$('.faq-item').forEach(item=>{
    const button=$('button',item);button.addEventListener('click',()=>{
      const open=button.getAttribute('aria-expanded')!=='true';
      $$('.faq-item').forEach(other=>{
        const active=other===item&&open;other.classList.toggle('selected',active);
        $('button',other).setAttribute('aria-expanded',String(active));$('.answer',other).style.gridTemplateRows=active?'1fr':'0fr';
        $('.answer',other).inert=!active;$('svg',other)?.classList.toggle('rotate',active);
      });
    });
  });
  const phaseCards=$$('.process-card');
  const setPhase = card => phaseCards.forEach(c=>{c.classList.toggle('active',c===card);c.setAttribute('aria-pressed',String(c===card));});
  phaseCards.forEach(card=>['mouseenter','focus','click'].forEach(event=>card.addEventListener(event,()=>setPhase(card))));
  if(matchMedia('(pointer:coarse)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setPhase(e.target);}),{rootMargin:'-35% 0px -35% 0px'});phaseCards.forEach(c=>observer.observe(c));}
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.08});
  $$('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${(i%4)*70}ms`;revealObserver.observe(el);});
  const progress=$('.progress');const topButton=document.createElement('button');topButton.textContent='↑';topButton.setAttribute('aria-label','Back to top');topButton.hidden=true;$('.floating-actions').append(topButton);
  topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'instant':'smooth'}));
  function scroll(){const p=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.transform=`scaleX(${p})`;$('.navbar').classList.toggle('scrolled',p>.01);topButton.hidden=p<.1;}
  addEventListener('scroll',scroll,{passive:true});scroll();
  $$('.filters button').forEach(button=>button.addEventListener('click',()=>{
    $$('.filters button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
    $$('.project-card').forEach(card=>card.hidden=button.textContent!=='All'&&button.textContent!==card.dataset.category);
  }));
  const code=['// Production Delivery Pipeline','const solution = await build({','  architecture: "microservices",','  stack: ["Next.js", "Python", "AI"],','  quality: "production-ready",','  deployment: {','    cloud: "global",','    strategy: "continuous-delivery"','  }','});','','await solution.scale();'];
  const views={Stack:['// Engineering stack','TypeScript · React · Python','TensorFlow · PyTorch','PostgreSQL · MongoDB','Cloud-native infrastructure'],Deployment:['// Release pipeline','✓ Automated checks','✓ Preview deployment','✓ Performance review','✓ Production release'],'Next.js/Flow':code};
  const pre=$('.code-window pre');let typing;
  function showCode(lines){if(!pre)return;pre.replaceChildren();lines.forEach((line,i)=>{const row=document.createElement('div'),number=document.createElement('span'),content=document.createElement('span');number.className='line-number';number.textContent=String(i+1).padStart(2,'0');content.className=line.startsWith('//')?'code-comment':'code-line';content.textContent=line;row.append(number,content);pre.append(row);});}
  if(pre){let n=1;showCode(reduced?code:code.slice(0,n));if(!reduced)typing=setInterval(()=>{showCode(code.slice(0,++n));if(n>=code.length)clearInterval(typing);},100);}
  $$('.code-tabs button').forEach(button=>button.addEventListener('click',()=>{clearInterval(typing);$$('.code-tabs button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});showCode(views[button.textContent]);}));
  const countObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;countObserver.unobserve(e.target);const target=Number(e.target.dataset.target),start=performance.now();function frame(now){const t=reduced?1:Math.min((now-start)/1200,1);e.target.firstChild.textContent=String(Math.round(target*(1-(1-t)**3)));if(t<1)requestAnimationFrame(frame);}requestAnimationFrame(frame);}),{threshold:.5});$$('[data-target]').forEach(el=>countObserver.observe(el));
  if(!reduced&&matchMedia('(pointer:fine)').matches){$$('.glow-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`);}));}
  const loader=$('.preloader');
  if(loader){
    const brand=$('.loader-brand',loader), fill=$('.loader-fill',loader), track=$('.loader-track',loader);
    const label=$('.loader-message',loader), percent=$('.loader-percent',loader);
    const reference=[{at:0,value:0,state:'architecture',message:'INITIALIZING ARCHITECTURE...'},{at:190,value:5,state:'architecture',message:'INITIALIZING ARCHITECTURE...'},{at:820,value:36,state:'cloud',message:'LOADING CLOUD STACK...'},{at:1680,value:97,state:'compile',message:'COMPILING AI ENGINES...'},{at:2350,value:100,state:'ready',message:'ENVIRONMENT READY'}];
    const duration=reduced?280:2350, phases=reference.map(p=>({...p,at:reduced?p.at/2350*duration:p.at}));
    let phaseIndex=-1;const started=performance.now();
    if(reduced)brand?.classList.add('is-visible');else setTimeout(()=>brand?.classList.add('is-visible'),140);
    function animateLoader(now){
      const elapsed=Math.min(now-started,duration);
      let index=0;while(index<phases.length-1&&elapsed>=phases[index+1].at)index++;
      const phase=phases[index], next=phases[index+1], span=next?Math.max(1,next.at-phase.at):1;
      const t=next?Math.min(1,Math.max(0,(elapsed-phase.at)/span)):1;
      const value=next?phase.value+(next.value-phase.value)*t:phase.value;
      if(index!==phaseIndex){phaseIndex=index;loader.dataset.state=phase.state;label.textContent=phase.message;}
      fill.style.width=value+'%';percent.textContent=Math.round(value)+'%';track.setAttribute('aria-valuenow',String(Math.round(value)));
      if(elapsed<duration)requestAnimationFrame(animateLoader);
      else{loader.dataset.state='ready';label.textContent='ENVIRONMENT READY';percent.textContent='100%';track.setAttribute('aria-valuenow','100');setTimeout(()=>loader.classList.add('is-exiting'),160);setTimeout(()=>loader.remove(),reduced?180:660);}
    }
    requestAnimationFrame(animateLoader);
  }
  ['facebook','instagram','linkedin'].forEach(key=>{if(config[key])$$(`a[aria-label="${key[0].toUpperCase()+key.slice(1)}"]`).forEach(a=>a.href=config[key]);});
  if(config.linkedin){const community=$('.community');if(community)community.href=config.linkedin;$$('a[aria-label="LinkedIn"]').forEach(a=>a.href=config.linkedin);}
  if(config.phone)$('a[aria-label="Call us"]').href='tel:'+config.phone;
  if(config.whatsapp)$('a[aria-label="WhatsApp contact"]').href='https://wa.me/'+config.whatsapp.replace(/\D/g,'');
  const form=$('.contact-form');if(form){const note=$('.placeholder-note',form);if(config.formEndpoint&&note)note.hidden=true;form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const status=$('[role="status"]',form),button=$('button[type="submit"]',form);if(!config.formEndpoint){status.textContent='This preview does not send messages yet. Connect a form service in config.js to enable delivery.';return;}if(form.elements.website.value)return;button.disabled=true;button.textContent='Sending…';try{const response=await fetch(config.formEndpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!response.ok)throw Error('Unable to send. Please try again.');status.textContent='Thank you. Your enquiry has been sent.';form.reset();}catch(error){status.textContent=error.message;}finally{button.disabled=false;button.textContent='Send Message';}});}
})();
