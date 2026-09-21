const CONTACT_ENDPOINT='https://fsjtlwrmuprqgcjvhykt.supabase.co/functions/v1/site-contact';
const CONTACT_EMAIL='negativomov@gmail.com';
const REDUCED_MOTION=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const CARDS = [{"id": "circular", "eye": "PESSOAS", "title": "Faça circular o que merece ir mais longe.", "line": "Uma peça, um concerto, um filme, uma ideia.", "focus": "Leve um trabalho para onde ele ainda não chegou.", "focusText": "Interesse, lugar, data, viagem e alojamento passam a aparecer no mesmo campo.", "body": "Uma companhia pode ter obra e vontade, mas não saber onde há público, espaço, datas, produção ou receção. A Exu aproxima essas condições e deixa visível o que falta para a circulação acontecer.", "proof": [["INTERESSE", "onde alguma coisa começa a chamar"], ["CONDIÇÕES", "espaço, datas e produção"], ["TRAVESSIA", "transporte, alojamento e companhia"], ["EFEITO", "ocorrência, receita e memória"]], "cta": "Quero pôr um trabalho em circulação", "x": 960, "z": 0.18, "w": 380, "h": 290, "pattern": "pattern-a"}, {"id": "viagem", "eye": "LUGARES", "title": "Encontre o que vale a viagem.", "line": "Ver melhor. Ir melhor. Voltar com mais.", "focus": "Descubra algo que justifique o caminho.", "focusText": "Crítica, rota, companhia e estadia deixam de ser quatro pesquisas separadas.", "body": "A Exu aproxima descoberta, crítica, deslocamento, alojamento e participação numa mesma situação. O que vale a viagem aparece junto do modo de chegar até ele.", "proof": [["DESCOBRIR", "o que chama e por quê"], ["DECIDIR", "com quem ir e quando"], ["IR", "rota, boleia, transporte"], ["FICAR", "alojamento e condições"]], "cta": "Quero acompanhar a abertura", "x": 520, "z": 0.42, "w": 300, "h": 238, "pattern": "pattern-b"}, {"id": "negocio", "eye": "NEGÓCIO", "title": "Ponha capacidade em movimento.", "line": "Onde há encontro entre procura e capacidade, há valor.", "focus": "Transformamos possibilidades dispersas em situações executáveis.", "focusText": "A Exu aproxima procura, capacidade, coordenação e transação sem reduzir o negócio a uma única categoria.", "body": "Operacionalmente, a Exu torna legíveis as condições de uma possibilidade: quem quer, onde cabe, quando pode acontecer, o que falta e quem pode oferecer. Monetiza capacidades profissionais, coordenação e inteligência, integrações e, quando apropriado, transações. Cada operação pode deixar relações, disponibilidade, procura, memória e conhecimento operacional reutilizáveis. O primeiro campo comercial é a hospitalidade: um ambiente em que espaço, hóspedes, calendário, alimentação, território e orçamento já coexistem e permitem provar a máquina sem definir o limite da empresa.", "proof": [["OPERAÇÃO", "transforma possibilidades dispersas em situações executáveis"], ["RECEITA", "capacidades, coordenação, intelligence, integrações e transações"], ["ACUMULAÇÃO", "relações, disponibilidade, procura, memória e conhecimento operacional"], ["ENTRADA", "hospitalidade como primeiro campo comercial de prova"]], "cta": "Pedir apresentação da Exu", "x": 1375, "z": 0.49, "w": 288, "h": 228, "pattern": "pattern-c"}, {"id": "receber", "eye": "ACONTECIMENTOS", "title": "Abra espaço para o inesperado.", "line": "Quartos, salas e mesas também fazem acontecer.", "focus": "Faça um lugar participar daquilo que leva gente até ele.", "focusText": "Capacidade parada pode virar estadia, programação, encontro e receita.", "body": "Hotéis, restaurantes, auditórios e outros lugares entram como hospedagem, receção, alimentação, programação e infraestrutura. O espaço deixa de ser apenas cenário e passa a ser operador.", "proof": [["PROCURA", "o que as pessoas querem viver"], ["CAPACIDADE", "quartos, datas, espaços"], ["COMPOSIÇÃO", "programação e parceiros"], ["RETORNO", "estadia, consumo e relação"]], "cta": "Quero explorar isto para um espaço", "x": 1730, "z": 0.63, "w": 268, "h": 216, "pattern": "pattern-d"}, {"id": "critica", "eye": "CRÍTICA", "title": "Faça uma obra voltar à conversa.", "line": "Texto, ranking, comentário, comparação.", "focus": "Uma frase pode mudar o caminho de uma obra.", "focusText": "Crítica não termina no texto: ela pode produzir descoberta, circulação e outro acontecimento.", "body": "Na Exu, crítica pode começar pequena e ganhar profundidade: comentário, ranking, lista, ensaio, resposta ou entrevista. Apoio pode sustentar trabalho crítico sem comprar autoridade.", "proof": [["POSIÇÃO", "uma leitura situada"], ["FORMA", "lista, ranking, ensaio"], ["CONFIANÇA", "recorrência e assinatura"], ["EFEITO", "descoberta e circulação"]], "cta": "Quero falar sobre crítica", "x": 2120, "z": 0.56, "w": 296, "h": 230, "pattern": "pattern-e"}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mod=(n,m)=>((n%m)+m)%m;
const field=document.getElementById('field'),plane=document.getElementById('plane'),bg=document.getElementById('bg'),hero=document.getElementById('hero'),hint=document.getElementById('hint'),focusDeck=document.getElementById('focusDeck'),focusDeckMore=document.getElementById('focusDeckMore'),focusDeckBack=document.getElementById('focusDeckBack'),soundToggle=document.getElementById('soundToggle');
const veil=document.getElementById('veil'),detail=document.getElementById('detail'),dMark=document.getElementById('dMark'),dTitle=document.getElementById('dTitle'),dLead=document.getElementById('dLead'),dBody=document.getElementById('dBody'),dProof=document.getElementById('dProof'),dCTA=document.getElementById('dCTA'),dVisualTitle=document.getElementById('dVisualTitle');
const utility=document.getElementById('utility'),utilityBody=document.getElementById('utilityBody'),utilityBack=document.getElementById('utilityBack');
const WORLD=2880;
let camX=960,targetCamX=960,camV=0,pan=null,drag=null,pick=1200,focused=null,snapshot=null,detailCard=null,utilitySource='field';
let touchPoints=new Map(), pinch=null;

// tiny WebAudio feedback: synthetic, quiet, tactile, no external asset.
let audioCtx=null,soundOn=true,lastFriction=0;
function ensureAudio(){
  if(!soundOn)return null;
  if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();}
  if(audioCtx.state==='suspended')audioCtx.resume();
  return audioCtx;
}
function tone(type='focus',strength=1){
  const a=ensureAudio();if(!a)return;
  const now=a.currentTime,g=a.createGain(),o=a.createOscillator();
  o.type=type==='back'?'sine':'triangle';
  const base=type==='open'?180:type==='back'?145:220;
  o.frequency.setValueAtTime(base,now);o.frequency.exponentialRampToValueAtTime(type==='back'?110:base*1.32,now+.12);
  g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.018*strength,now+.012);g.gain.exponentialRampToValueAtTime(.0001,now+.16);
  o.connect(g).connect(a.destination);o.start(now);o.stop(now+.18);
}
function friction(speed){
  const a=ensureAudio();if(!a)return;const nowMs=performance.now();if(nowMs-lastFriction<72)return;lastFriction=nowMs;
  const gain=Math.min(.008,Math.max(.0015,Math.abs(speed)*.0012));
  const buffer=a.createBuffer(1,Math.floor(a.sampleRate*.035),a.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
  const src=a.createBufferSource(),filter=a.createBiquadFilter(),g=a.createGain();src.buffer=buffer;filter.type='bandpass';filter.frequency.value=700;filter.Q.value=.8;g.gain.value=gain;src.connect(filter).connect(g).connect(a.destination);src.start();
}
soundToggle.onclick=e=>{e.stopPropagation();soundOn=!soundOn;soundToggle.classList.toggle('off',!soundOn);soundToggle.textContent=soundOn?'◌':'×';soundToggle.setAttribute('aria-label',soundOn?'Som ligado':'Som desligado');if(soundOn)tone('focus',.7)};

CARDS.forEach(o=>{
  o.x0=o.x;o.z0=o.z;o.tx=o.x;o.tz=o.z;o.vz=0;o.z=o.z;o.pick=0;o.focused=false;
  const el=document.createElement('div');
  el.className='portal'; el.dataset.id=o.id; el.style.width=o.w+'px'; el.style.height=o.h+'px';
  el.innerHTML=`<div class="card ${o.pattern}">
      <div class="liquid ${o.pattern}"><div class="wash"></div><div class="relief"></div></div>
      <div class="cardContent center"><div class="eyebrow">${o.eye}</div><h3 class="title">${o.title}</h3><div class="line">${o.line}</div></div>
      <div class="openMark">＋</div>
      <div class="focusReveal"><div class="focusText">${o.focusText}</div><div class="focusActions"><button class="moreBtn">Ver melhor →</button><button class="backBtn">Voltar</button></div></div>
    </div>`;
  plane.appendChild(el); o.el=el;
  el.querySelector('.moreBtn').onclick=e=>{e.stopPropagation(); openDetail(o)};
  el.querySelector('.backBtn').onclick=e=>{e.stopPropagation(); restoreField()};

  el.addEventListener('pointerdown',e=>{
    if(detail.classList.contains('on')||utility.classList.contains('on')) return;
    if(e.target.closest('button')) return;
    e.preventDefault(); e.stopPropagation();
    ensureAudio();
    el.setPointerCapture?.(e.pointerId);
    touchPoints.set(e.pointerId,{o,x:e.clientX,y:e.clientY});
    const same=[...touchPoints.entries()].filter(([id,p])=>p.o===o);
    if(same.length===2){
      const p1=same[0][1],p2=same[1][1];
      pinch={o,ids:[same[0][0],same[1][0]],dist:Math.hypot(p1.x-p2.x,p1.y-p2.y),tz:o.tz};
      drag=null; hint.classList.add('hide'); return;
    }
    if(pinch) return;
    o.pick=++pick; o.vz=0;
    drag={o,sx:e.clientX,sy:e.clientY,startCam:targetCamX,tz:o.tz,lastY:e.clientY,lastX:e.clientX,lastT:performance.now(),moved:false,mode:null,vz:0,vx:0};
  });

  el.addEventListener('pointermove',e=>{
    const pt=touchPoints.get(e.pointerId); if(pt){pt.x=e.clientX; pt.y=e.clientY}
    if(pinch&&pinch.o===o){
      const p1=touchPoints.get(pinch.ids[0]),p2=touchPoints.get(pinch.ids[1]); if(!p1||!p2) return;
      const dist=Math.max(24,Math.hypot(p1.x-p2.x,p1.y-p2.y));
      o.tz=clamp(pinch.tz-Math.log(dist/pinch.dist)*.34,.04,.92);
      hero.classList.add('quiet'); hint.classList.add('hide'); return;
    }
    if(!drag||drag.o!==o) return;
    const dx=e.clientX-drag.sx, dy=e.clientY-drag.sy;
    if(Math.hypot(dx,dy)>8) drag.moved=true;
    if(!drag.mode && drag.moved) drag.mode=Math.abs(dx)>Math.abs(dy)*1.1?'pan':'depth';
    const now=performance.now(), dt=Math.max(8,now-drag.lastT);
    if(drag.mode==='pan'){ targetCamX=drag.startCam-dx*1.12; drag.vx=-(e.clientX-drag.lastX)/dt*14; }
    else if(drag.mode==='depth'){ o.tz=clamp(drag.tz-dy*.00245,.04,.92); drag.vz=-(e.clientY-drag.lastY)/dt*.00105; }
    drag.lastX=e.clientX; drag.lastY=e.clientY; drag.lastT=now;
    friction(drag.mode==='pan'?drag.vx:drag.vz*900);
    hero.classList.add('quiet'); hint.classList.add('hide');
  });

  const finish=e=>{
    touchPoints.delete(e.pointerId);
    if(pinch&&pinch.o===o){
      if(pinch.ids.filter(id=>touchPoints.has(id)).length<2) pinch=null;
      return;
    }
    if(!drag||drag.o!==o) return;
    const wasMoved=drag.moved, mode=drag.mode;
    if(mode==='pan') camV=drag.vx;
    if(mode==='depth') o.vz=drag.vz;
    drag=null; setTimeout(()=>o.pick=0,90);
    if(!wasMoved){ focusObject(o); }
  };
  el.addEventListener('pointerup',finish);
  el.addEventListener('pointercancel',finish);
  el.addEventListener('wheel',e=>{
    if(detail.classList.contains('on')) return;
    e.preventDefault(); e.stopPropagation();
    if(focused&&focused!==o) restoreField();
    o.tz=clamp(o.tz+(e.deltaY>0?.065:-.065),.04,.92);
    hero.classList.add('quiet'); hint.classList.add('hide');
  },{passive:false});
});

function shortestDx(x,cam){ return mod(x-cam+WORLD/2,WORLD)-WORLD/2; }
function project(o){
  const r=field.getBoundingClientRect(); const mobile=innerWidth<=820;
  const dx=shortestDx(o.x,camX);
  const edgeStart=r.width*.38, edgeSpan=r.width*.26;
  const edge=Math.pow(clamp((Math.abs(dx)-edgeStart)/edgeSpan,0,1.2),1.55)*.28;
  const z=clamp(o.z+edge,.04,.92); const near=1-z;
  const scaleBase=.48+near*.84; const scale=scaleBase*(mobile?.78:1);
  const spread=.58+near*.52; const x=r.width*.52+dx*spread; const h=o.h*scale,w=o.w*scale;
  const safeTop=Math.max(r.height*(mobile?.28:.31),h/2+16); const safeBottom=Math.max(safeTop+16,r.height-h/2-28);
  const t=clamp((z-.04)/.88,0,1); const y=safeBottom-(safeBottom-safeTop)*t;
  return {x,y,s:scale,z,near,w,h};
}
function saveSnapshot(){ return {cam:targetCamX, states:CARDS.map(o=>({id:o.id,tz:o.tz}))}; }
function deckPattern(o){
  const source=o.el.querySelector('.relief');
  return source?getComputedStyle(source).backgroundImage:'none';
}
function showFocusDeck(o){
  focusDeck.querySelector('.focusEye').textContent=o.eye;
  focusDeck.querySelector('.focusTitle').textContent=o.focus;
  focusDeck.querySelector('.focusText').textContent=o.focusText;
  focusDeck.querySelector('.focusRelief').style.backgroundImage=deckPattern(o);
  focusDeckMore.onclick=()=>openDetail(o);
  focusDeckBack.onclick=restoreField;
  focusDeck.classList.add('on');focusDeck.setAttribute('aria-hidden','false');
}
function hideFocusDeck(){focusDeck.classList.remove('on');focusDeck.setAttribute('aria-hidden','true');}
function restoreField(){
  hideFocusDeck();
  if(!focused)return;
  if(snapshot){targetCamX=snapshot.cam;snapshot.states.forEach(s=>{const o=CARDS.find(x=>x.id===s.id);if(o)o.tz=s.tz;});}
  focused=null;snapshot=null;hero.classList.remove('quiet');tone('back',.7);
}
function focusObject(o){
  if(focused&&focused!==o)restoreField();
  if(!focused)snapshot=saveSnapshot();
  focused=o;targetCamX=o.x;
  CARDS.forEach(other=>{if(other===o)other.tz=.08;else other.tz=clamp(other.z+.18,.20,.90);});
  hero.classList.add('quiet');hint.classList.add('hide');showFocusDeck(o);tone('focus',1);
}
field.addEventListener('pointerdown' ,e=>{
  if(e.target.closest('.portal')||e.target.closest('button')||detail.classList.contains('on')) return;
  if(focused){ restoreField(); return; }
  ensureAudio(); pan={id:e.pointerId,x:e.clientX,cam:targetCamX,lastX:e.clientX,lastT:performance.now()}; field.setPointerCapture?.(e.pointerId);
});
field.addEventListener('pointermove',e=>{
  const r=field.getBoundingClientRect(), nx=(e.clientX-r.left)/r.width-.5, ny=(e.clientY-r.top)/r.height-.5;
  bg.style.transform=`scale(1.03) translate(${nx*-4}px, ${ny*-2}px)`;
  if(!pan||pan.id!==e.pointerId) return;
  const now=performance.now(), dt=Math.max(8,now-pan.lastT);
  targetCamX=pan.cam-(e.clientX-pan.x)*1.10; camV=-(e.clientX-pan.lastX)/dt*14;
  pan.lastX=e.clientX; pan.lastT=now; friction(camV); hero.classList.add('quiet'); hint.classList.add('hide');
});
field.addEventListener('pointerup',e=>{ if(!pan||pan.id!==e.pointerId) return; targetCamX+=camV*12; pan=null; });
field.addEventListener('pointercancel',()=>pan=null);
field.addEventListener('wheel',e=>{ if(e.target.closest('.portal')||detail.classList.contains('on')||utility.classList.contains('on')) return; e.preventDefault(); targetCamX+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*.92; hero.classList.add('quiet'); hint.classList.add('hide'); },{passive:false});

function render(){
  camX+=(targetCamX-camX)*(REDUCED_MOTION?1:.078);
  if(Math.abs(camX)>WORLD*6){ camX=mod(camX,WORLD); targetCamX=mod(targetCamX,WORLD); }
  CARDS.forEach(o=>{
    if(!(drag&&drag.o===o)||drag?.mode!=='depth'){ o.tz+=o.vz; o.vz*=.84; if(Math.abs(o.vz)<.00018) o.vz=0; }
    o.tz=clamp(o.tz,.04,.92); o.z+=(o.tz-o.z)*.13; const p=project(o);
    const lift=drag&&drag.o===o?-6:0; const tilt=drag&&drag.o===o&&drag.mode==='pan'?clamp(drag.vx*-.09,-3,3):0;
    o.el.style.transform=`translate3d(${p.x-o.w/2}px,${p.y-o.h/2+lift}px,${p.near*250}px) scale(${p.s}) rotateZ(${tilt}deg)`;
    o.el.style.opacity=clamp((.36+p.near*.64)*(focused&&focused!==o?.42:1),.12,1);
    o.el.style.filter=`blur(${Math.max(0,(p.z-.74)*3.1)}px)`;
    o.el.style.zIndex=String(Math.max(Math.round(p.near*1200),o.pick||0));
    o.el.classList.toggle('near',p.z<.31);
    const targetH=o.focused?Math.min(o.h+96, o.h*1.38):o.h;
    const current=parseFloat(o.el.style.height||o.h); if(Math.abs(current-targetH)>.5) o.el.style.height=targetH+'px';
  });
  requestAnimationFrame(render);
}
render();

function openDetail(o){
  detailCard=o;hideFocusDeck();tone('open',1);
  const grid=document.querySelector('#detailVisual .grid'); grid.className='grid '+o.pattern;
  dMark.textContent=o.eye; dVisualTitle.textContent=o.title; dTitle.textContent=o.focus; dLead.textContent=o.focusText; dBody.textContent=o.body;
  dProof.innerHTML=o.proof.map(([a,b])=>`<div class="proof"><b>${a}</b><span>${b}</span></div>`).join('');
  dCTA.textContent=o.cta; dCTA.onclick=()=>openUtility('contact',o.cta,'detail');
  veil.classList.add('on'); detail.classList.add('on'); detail.setAttribute('aria-hidden','false');
}
function closeDetail(toField=false){
  const o=detailCard;detail.classList.remove('on');veil.classList.remove('on');detail.setAttribute('aria-hidden','true');detailCard=null;tone('back',.65);
  if(toField){restoreField();} else if(o&&focused===o){showFocusDeck(o);}
}
document.getElementById('detailClose').onclick=()=>closeDetail(true);
document.getElementById('dBack').textContent='Voltar ao card';
document.getElementById('dBack').onclick=()=>closeDetail(false);
veil.onclick=()=>{if(utility.classList.contains('on'))closeUtility();else if(detail.classList.contains('on'))closeDetail(true);};
const HOW=`<h3>Uma coisa puxa outra.</h3><p>A Exu não começa por explicar um conceito abstrato. Ela começa por situações reais: alguém quer fazer circular uma obra, alguém quer descobrir o que vale a viagem, um hotel quer participar do movimento, um crítico quer escrever com consequência, uma capacidade quer encontrar uso.</p><p>À medida que existe interesse, aparecem condições: quem iria, onde cabe, como chegar, o que falta, quanto custa e quem ganha com isso. A mesma experiência serve a quem quer viver, operar ou investir.</p>`;
const BUSINESS=`<h3>O negócio por trás dos caminhos.</h3>
<p><b>O que fazemos.</b> Transformamos possibilidades dispersas em situações executáveis: procura, capacidade, condições, coordenação e compromisso passam a compartilhar contexto.</p>
<p><b>Como entra dinheiro.</b> Capacidades profissionais, coordenação e intelligence, integrações e, quando apropriado, transações.</p>
<p><b>O que fica.</b> Relações, disponibilidade, procura, memória e conhecimento operacional reutilizáveis — ativos que reduzem o custo de começar de novo.</p>
<p><b>Onde começamos.</b> Hospitalidade é o primeiro campo comercial de prova: reúne espaço, hóspedes, calendário, alimentação, território e orçamento sem limitar a empresa a esse mercado.</p>
<button class="send businessContact" type="button">Pedir apresentação da Exu</button>`;
function escapeHTML(value=''){
  return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}
function contactHTML(pref=''){
  const safe=escapeHTML(pref||'');
  return `<h3>Que caminho quer abrir?</h3>
  <p>Diga o que quer pôr em movimento. Nós conduzimos a conversa a partir disso.</p>
  <form id="contactForm" novalidate>
    <label><span>Nome</span><input name="name" autocomplete="name" minlength="2" maxlength="160" required></label>
    <label><span>Email</span><input name="email" type="email" autocomplete="email" maxlength="320" required></label>
    <label><span>O que quer pôr em movimento?</span><textarea name="message" minlength="8" maxlength="4000" required placeholder="Em uma frase, conte-nos o ponto de partida.">${safe}</textarea></label>
    <label class="honeypot" aria-hidden="true"><span>Empresa</span><input name="company" tabindex="-1" autocomplete="off"></label>
    <input type="hidden" name="context" value="${safe}">
    <p class="privacyNote">Usamos estes dados apenas para responder ao contacto e proteger o formulário contra abuso.</p>
    <div class="formActions"><button class="send" type="submit">Abrir conversa</button><span class="formStatus" role="status" aria-live="polite"></span></div>
  </form>`;
}
function bindContactForm(){
  const form=document.getElementById('contactForm'); if(!form)return;
  const button=form.querySelector('button[type="submit"]');
  const status=form.querySelector('.formStatus');
  const fields=[...form.querySelectorAll('input[name="name"],input[name="email"],textarea[name="message"]')];

  fields.forEach(field=>field.addEventListener('input',()=>field.removeAttribute('aria-invalid')));

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.checkValidity()){
      fields.forEach(field=>{if(!field.checkValidity())field.setAttribute('aria-invalid','true');});
      form.reportValidity();
      status.textContent='Confira os campos indicados.';
      status.className='formStatus error';
      return;
    }

    const fd=new FormData(form);
    const payload={
      name:String(fd.get('name')||'').trim(),
      email:String(fd.get('email')||'').trim(),
      message:String(fd.get('message')||'').trim(),
      company:String(fd.get('company')||'').trim(),
      context:String(fd.get('context')||'').trim(),
      source_url:location.href
    };

    button.disabled=true;
    button.textContent='A enviar…';
    status.textContent='A enviar com segurança…';
    status.className='formStatus';

    try{
      const response=await fetch(CONTACT_ENDPOINT,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      });
      let result={};
      try{result=await response.json();}catch{}

      if(!response.ok){
        if(response.status===429) throw new Error('rate_limited');
        if(response.status===422) throw new Error('validation_error');
        throw new Error('send_failed');
      }

      utilityBody.innerHTML=`<div class="contactSuccess">
        <h3>Recebemos.</h3>
        <p>Vamos responder para <b>${escapeHTML(payload.email)}</b>.</p>
        <p>Obrigado por abrir esta conversa com a Exu.</p>
        <button class="send closeContactSuccess" type="button">Voltar ao site</button>
      </div>`;
      utilityBody.querySelector('.closeContactSuccess')?.addEventListener('click',closeUtility);
      tone('open',.65);
    }catch(err){
      const code=err instanceof Error?err.message:'send_failed';
      status.className='formStatus error';
      status.innerHTML=code==='rate_limited'
        ? 'Houve muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.'
        : `Não conseguimos enviar agora. Pode escrever diretamente para <a class="contactFallback" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`;
      button.disabled=false;
      button.textContent='Tentar novamente';
    }
  });
}
function openUtility(mode,pref='',source='field'){
  utilitySource=source;
  if(source==='detail'&&detailCard){detail.classList.remove('on');detail.setAttribute('aria-hidden','true');}
  else if(source!=='detail'){hideFocusDeck();}
  utilityBody.innerHTML=mode==='how'?HOW:mode==='business'?BUSINESS:contactHTML(pref);utility.classList.toggle('from-detail',source==='detail');utility.classList.add('on');veil.classList.add('on');tone('open',.8);
  if(mode==='contact')bindContactForm();
  if(mode==='business'){
    utilityBody.querySelector('.businessContact')?.addEventListener('click',()=>openUtility('contact','Quero receber a apresentação da Exu e conversar sobre o negócio.',source));
  }
}
function closeUtility(){
  utility.classList.remove('on');utility.classList.remove('from-detail');veil.classList.remove('on');
  if(utilitySource==='detail'&&detailCard){detail.classList.add('on');detail.setAttribute('aria-hidden','false');veil.classList.add('on');}
  else if(focused){showFocusDeck(focused);}
  utilitySource='field';tone('back',.55);
}
utility.querySelector('.x').onclick=()=>{utilitySource='field';closeUtility();if(focused)restoreField();};
utilityBack.onclick=closeUtility;
document.querySelectorAll('[data-util]').forEach(b=>b.onclick=(e)=>{e.preventDefault(); openUtility(b.dataset.util);});
document.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>{ const o=CARDS.find(x=>x.id===b.dataset.focus); if(o) focusObject(o); });
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(utility.classList.contains('on'))closeUtility();else if(detail.classList.contains('on'))closeDetail(false);else if(focused)restoreField();}
  if(!focused&&!detail.classList.contains('on')&&!utility.classList.contains('on')){ if(e.key==='ArrowRight') targetCamX+=260; if(e.key==='ArrowLeft') targetCamX-=260; }
});
setTimeout(()=>hint.classList.add('hide'),5600);
