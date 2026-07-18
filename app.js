const SLOT_LABEL={head:'頭装備',body:'体装備',right:'右手',left:'左手'};
const GEAR_TYPES=[
 {slot:'right',suffix:'ソード',base:{atk:18,spd:3}},{slot:'right',suffix:'ランス',base:{atk:22,crit:3}},{slot:'right',suffix:'カタナ',base:{atk:16,crit:8}},{slot:'right',suffix:'アックス',base:{atk:26,spd:-8}},{slot:'right',suffix:'ダガー',base:{atk:11,spd:18,crit:5}},{slot:'right',suffix:'ハンマー',base:{atk:30,spd:-12}},{slot:'right',suffix:'スピア',base:{atk:19,spd:5}},
 {slot:'left',suffix:'シールド',base:{def:12,eva:2}},{slot:'left',suffix:'タワーシールド',base:{def:22,spd:-8}},{slot:'left',suffix:'バックラー',base:{def:7,eva:7}},
 {slot:'body',suffix:'チュニック',base:{hp:70,spd:5}},{slot:'body',suffix:'アーマー',base:{hp:110,def:14}},{slot:'body',suffix:'ローブ',base:{hp:80,crit:3}},{slot:'body',suffix:'コート',base:{hp:90,eva:4}},{slot:'body',suffix:'メイル',base:{hp:100,def:10}},
 {slot:'head',suffix:'フード',base:{hp:35,eva:5}},{slot:'head',suffix:'ヘルム',base:{hp:55,def:8}},{slot:'head',suffix:'ハット',base:{hp:30,crit:5}},{slot:'head',suffix:'クラウン',base:{hp:45,crit:3,atk:3}},{slot:'head',suffix:'マスク',base:{hp:25,spd:8}}
];
const ADJECTIVES=[
 ['勇猛な',{atk:8},'勇猛：攻撃+8'],['鋭い',{crit:6},'鋭敏：会心+6%'],['タフな',{hp:45},'頑丈：HP+45'],['疾風の',{spd:12},'迅速：速度+12'],['聖なる',{def:8},'聖性：防御+8'],['ワイルドな',{atk:12,def:-3},'野性：攻撃+12・防御-3'],['呪われた',{atk:18,hp:-35},'呪縛：攻撃+18・HP-35'],['壊れかけの',{atk:-7,def:-5},'破損：攻撃-7・防御-5'],['ヘヴィな',{def:14,spd:-12},'重量：防御+14・速度-12'],['もろい',{crit:12,def:-10},'脆弱：会心+12%・防御-10'],['ラッキーな',{crit:7,eva:5},'幸運：会心+7%・回避+5%'],['強欲な',{atk:5,hp:-15},'強欲：攻撃+5・HP-15']
];
const ABSTRACT_NOUNS=[
 ['炎',{atk:10},'炎：攻撃+10'],['氷',{def:8},'氷：防御+8'],['サンダー',{spd:14},'雷：速度+14'],['血潮',{lifesteal:.08},'血：HP吸収8%'],['ソウル',{hp:55},'魂：HP+55'],['月影',{eva:6},'月：回避+6%'],['カオス',{atk:15,def:-6},'混沌：攻撃+15・防御-6'],['虚無',{crit:10,hp:-25},'虚無：会心+10%・HP-25'],['栄光',{atk:7,def:7},'栄光：攻撃+7・防御+7'],['運命',{crit:5,eva:4},'運命：会心+5%・回避+4%'],['デス',{atk:20,hp:-45},'死：攻撃+20・HP-45'],['霧',{eva:10,atk:-4},'霧：回避+10%・攻撃-4']
];
const SKILLS=[
 {name:'パワー解放',desc:'一定時間、攻撃力を上昇',kind:'power'},
 {name:'疾風ブースト',desc:'一定時間、攻撃速度を上昇',kind:'speed'},
 {name:'会心エッジ',desc:'次の攻撃の会心率を大幅上昇',kind:'crit'},
 {name:'鉄壁ガード',desc:'次の被ダメージを大幅軽減',kind:'guard'},
 {name:'最後の底力',desc:'HPが少ないほど攻撃力上昇',kind:'last'},
 {name:'癒しのリジェネ',desc:'HPを即時回復',kind:'regen'},
 {name:'ライフ吸収',desc:'一定時間HP吸収を強化',kind:'steal'},
 {name:'反撃カウンター',desc:'次の被弾時に反撃',kind:'counter'},
 {name:'受け流しパリィ',desc:'次の攻撃を完全無効化',kind:'parry'},
 {name:'狂戦士モード',desc:'攻撃大幅上昇、防御低下',kind:'berserk'}
];
const ENEMIES=[{name:'スライム',avatar:'🟢',hp:45,atk:8,def:1,spd:35,reward:30},{name:'ゴブリン',avatar:'👺',hp:75,atk:13,def:3,spd:42,reward:45},{name:'オーク',avatar:'🐗',hp:120,atk:19,def:6,spd:32,reward:65},{name:'骸骨騎士',avatar:'💀',hp:165,atk:26,def:10,spd:46,reward:90},{name:'魔導師',avatar:'🧙',hp:210,atk:34,def:8,spd:54,reward:120},{name:'ドラゴン',avatar:'🐉',hp:330,atk:47,def:15,spd:40,reward:180}];
const DEFAULT_STATE={version:3,gold:300,playerName:'ゲンゾウ',maxFloor:0,selectedFloor:1,gears:[],equipped:{head:null,body:null,right:null,left:null},skills:{},equippedSkills:[]};
const GRANDPA_NAMES=['ゲンゾウ','テツジ','シゲル','カンゾウ','リュウゾウ','ゴロウ','イチロウ','サブロウ','キンジ','トラキチ','ハチベエ','シンベエ','ゴンザ','タツノスケ','ジンベエ'];
function cloneDefaultState(){return JSON.parse(JSON.stringify(DEFAULT_STATE));}
let state=migrate(load());state.gears.forEach(g=>{if(!g.name){g.name='オールド'+g.suffix;g.locked=true;g.effects=g.effects||[]}if(/^名もなき/.test(g.name)){const a=ADJECTIVES[Math.floor(Math.random()*ADJECTIVES.length)],n=ABSTRACT_NOUNS[Math.floor(Math.random()*ABSTRACT_NOUNS.length)];g.name=a[0]+n[0]+'の'+g.suffix;g.locked=true;g.effects=[a[2],n[2]];g.bonus=g.bonus||{};addBonus(g.bonus,a[1]);addBonus(g.bonus,n[1])}});let pendingGearId=null;let battle=null,battleTimer=null,cooldowns=[0,0,0];
const $=s=>document.querySelector(s);const titleBgm=$('#titleBgm'),menuBgm=$('#menuBgm'),battleBgm=$('#battleBgm'),forgeBgm=$('#forgeBgm'),hitSe=$('#hitSe'),buttonSe=$('#buttonSe'),equipButtonSe=$('#equipButtonSe'),slotButtonSe=$('#slotButtonSe'),rouletteSe=$('#rouletteSe'),slotResultSe=$('#slotResultSe'),clashSe=$('#clashSe'),castleButtonSe=$('#castleButtonSe');
window.addEventListener('error',e=>console.error('APP ERROR:',e.error||e.message));
function uid(){return 'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function starter(slot,suffix,base,name){return {id:uid(),slot,suffix,base:{...base},bonus:{},level:0,name,locked:true}}
function migrate(old){if(old&&old.version===3&&Array.isArray(old.gears))return {...DEFAULT_STATE,...old,playerName:old.playerName||'ゲンゾウ',equipped:{...DEFAULT_STATE.equipped,...old.equipped},skills:old.skills||{},equippedSkills:old.equippedSkills||[]};const s=cloneDefaultState();if(old){s.gold=old.gold??300;s.playerName=old.playerName||'ゲンゾウ';s.maxFloor=old.maxFloor??0;s.selectedFloor=old.selectedFloor??1;}const starters=[starter('right','ソード',{atk:8},'オールドソード'),starter('left','シールド',{def:5},'オールドシールド'),starter('body','チュニック',{hp:35},'オールドチュニック'),starter('head','フード',{hp:20},'オールドフード')];s.gears=starters;for(const g of starters)s.equipped[g.slot]=g.id;return s}
function save(){localStorage.setItem('grandpaDemonSave',JSON.stringify(state))}function load(){try{return JSON.parse(localStorage.getItem('grandpaDemonSave'))}catch{return null}}
function playAudio(a,rate=1){if(!a)return;try{a.pause();a.currentTime=0;a.playbackRate=rate;a.play().catch(()=>{})}catch{}}function playSE(){playAudio(buttonSe,1.12)}function playEquipSE(){playAudio(equipButtonSe)}
function gear(id){return state.gears.find(g=>g.id===id)}
function addBonus(dst,src){Object.entries(src||{}).forEach(([k,v])=>dst[k]=(dst[k]||0)+v)}
function statSummary(g){const all={...g.base};Object.entries(g.bonus||{}).forEach(([k,v])=>all[k]=(all[k]||0)+v);return [['HP','hp'],['攻','atk'],['防','def'],['速','spd'],['会心','crit'],['回避','eva']].filter(x=>all[x[1]]).map(x=>x[0]+(all[x[1]]>0?'+':'')+all[x[1]]).join(' / ')||'能力なし'}
function stats(){const s={hp:128,atk:12,def:5,spd:50,crit:5,eva:3,lifesteal:0};Object.values(state.equipped).map(gear).forEach(g=>{if(!g)return;[g.base,g.bonus].forEach(src=>Object.entries(src||{}).forEach(([k,v])=>s[k]=(s[k]||0)+v))});return s}
function gearEmoji(slot,suffix){if(slot==='right')return suffix.includes('カタナ')?'🗡️':suffix.includes('ハンマー')?'🔨':'⚔️';if(slot==='left')return '🛡️';if(slot==='body')return '🥋';if(slot==='head')return '🎩';return ''}
function renderGrandpa(el){if(!el)return;if(el.id==='shopGrandpa'){el.innerHTML='👴';el.classList.add('hero-face-only');return}el.innerHTML='';['body','left','right','head'].forEach(slot=>{const g=gear(state.equipped[slot]);if(!g)return;const sp=document.createElement('span');sp.className='gear-layer gear-'+(slot==='right'?'weapon':slot==='left'?'shield':'armor');sp.textContent=gearEmoji(slot,g.suffix);el.appendChild(sp)})}
function render(){const s=stats();$('#gold').textContent=state.gold;const levelEl=$('#level');if(levelEl)levelEl.textContent=state.level||'';$('#hpStat').textContent=s.hp;$('#atkStat').textContent=s.atk;$('#defStat').textContent=s.def;$('#spdStat').textContent=s.spd;$('#critStat').textContent=s.crit+'%';$('#evaStat').textContent=s.eva+'%';$('#maxFloor').textContent=state.maxFloor;$('#selectedFloor').textContent=state.selectedFloor;renderGrandpa($('#shopGrandpa'));renderGrandpa($('#playerAvatar'));renderEquip();renderForge();renderSkills();save()}
function renderEquip(){const slots=$('#equipSlots');slots.innerHTML='';Object.keys(SLOT_LABEL).forEach(slot=>{const g=gear(state.equipped[slot]);slots.insertAdjacentHTML('beforeend',`<div class="equip-slot"><div class="slot-label">${SLOT_LABEL[slot]}</div><div class="slot-name">${g?g.name:'なし'}</div><div class="item-meta">${g?statSummary(g):''}</div></div>`)});const inv=$('#inventory');inv.innerHTML='';state.gears.forEach(g=>{const row=document.createElement('div');row.className='gear-card compact-gear';const effects=(g.effects||[]).map(x=>`<span class="effect-tag">${x}</span>`).join('');const equipped=state.equipped[g.slot]===g.id;row.innerHTML=`<div class="gear-row compact-row"><div class="gear-info"><b>${g.name}</b><div class="item-meta">${SLOT_LABEL[g.slot]}｜強化+${g.level}｜${statSummary(g)}</div><div class="effect-line">${effects}</div></div><div class="gear-actions compact-actions"><button data-equip class="${equipped?'equipped-btn':''}" ${equipped?'disabled':''}>${equipped?'装備中':'装備'}</button></div></div>`;const eb=row.querySelector('[data-equip]');eb.onclick=()=>{if(equipped)return;playEquipSE();state.equipped[g.slot]=g.id;render()};inv.appendChild(row)})}
function renderForge(){const root=$('#forgeList');root.innerHTML='';const named=state.gears.filter(g=>g.locked);if(named.length<2){root.innerHTML='<p class="item-meta">強化には装備が2個以上必要です。</p>';return}named.forEach(target=>{const mats=named.filter(g=>g.id!==target.id);const div=document.createElement('div');div.className='gear-card forge-gear-card';const cost=100+target.level*80;const group='mat_'+target.id;div.innerHTML=`<div class="gear-title-line"><span class="gear-category">${SLOT_LABEL[target.slot]}</span><b>${target.name}</b></div><div class="item-meta">現在 +${target.level}｜${statSummary(target)}｜強化費用 ${cost}G</div><div class="forge-material-title">素材にする装備</div><div class="forge-material-list">${mats.map((m,i)=>`<label class="forge-material-option"><input type="radio" name="${group}" value="${m.id}" ${i===0?'checked':''}><span class="gear-category">${SLOT_LABEL[m.slot]}</span><span>${m.name}</span></label>`).join('')}</div><div class="gear-actions"><button class="primary">選んだ装備を素材に強化</button></div>`;div.querySelector('button').onclick=()=>{const checked=div.querySelector(`input[name="${group}"]:checked`);if(checked)forge(target.id,checked.value,cost)};root.appendChild(div)})}
function forge(targetId,matId,cost){const t=gear(targetId),m=gear(matId);if(!t||!m)return;if(state.gold<cost)return alert('ゴールドが足りません');if(!confirm(`${m.name}を失い、${t.name}を強化します。よろしいですか？`))return;state.gold-=cost;t.level++;const pool=['atk','def','hp','spd','crit','eva'];const inherited=[];pool.forEach(k=>{const mv=(m.base[k]||0)+(m.bonus[k]||0);if(mv){const gain=Math.max(k==='hp'?8:1,Math.round(mv*.18));t.bonus[k]=(t.bonus[k]||0)+gain;inherited.push(k+'+'+gain)}});if(m.bonus.lifesteal){const gain=Math.min(.03,m.bonus.lifesteal*.25);t.bonus.lifesteal=(t.bonus.lifesteal||0)+gain;inherited.push('吸収+'+Math.round(gain*100)+'%')}state.gears=state.gears.filter(g=>g.id!==matId);Object.keys(state.equipped).forEach(slot=>{if(state.equipped[slot]===matId)state.equipped[slot]=targetId});alert(`${t.name} +${t.level} に強化！\n${inherited.join(' / ')||'基礎能力が上昇'}`);render()}
function openName(id){pendingGearId=id;const g=gear(id);$('#nameBaseInfo').textContent=`名もなき${g.suffix}｜${statSummary(g)}`;$('#gearNameInput').value='';$('#nameEffectPreview').textContent='名前に秘められた力を解析中…';$('#nameModal').classList.remove('hidden');$('#gearNameInput').focus()}
function spinText(el,items,duration,done){let start=performance.now();const timer=setInterval(()=>{el.textContent=items[Math.floor(Math.random()*items.length)][0]},65);setTimeout(()=>{clearInterval(timer);done()},duration)}
let gearSlotBusy=false;
function gearGacha(){if(gearSlotBusy)return;if(state.gold<100)return alert('ゴールドが足りません');gearSlotBusy=true;state.gold-=100;save();$('#gold').textContent=state.gold;$('#gearGacha').disabled=true;$('#gachaResult').innerHTML='';$('#rouletteStatus').classList.add('active');$('#rouletteStatus').textContent='貴方に合った装備を探しています...';playAudio(slotButtonSe);setTimeout(()=>playAudio(rouletteSe),20);const adj=ADJECTIVES[Math.floor(Math.random()*ADJECTIVES.length)],noun=ABSTRACT_NOUNS[Math.floor(Math.random()*ABSTRACT_NOUNS.length)],type=GEAR_TYPES[Math.floor(Math.random()*GEAR_TYPES.length)];const ra=$('#reelAdj'),rn=$('#reelNoun'),rt=$('#reelType');spinText(ra,ADJECTIVES,650,()=>{ra.textContent=adj[0];spinText(rn,ABSTRACT_NOUNS,650,()=>{rn.textContent=noun[0];spinText(rt,GEAR_TYPES.map(x=>[x.suffix]),650,()=>{rt.textContent=type.suffix;setTimeout(()=>{const variance={};Object.entries(type.base).forEach(([k,v])=>variance[k]=Math.round(v*(.85+Math.random()*.3)));const bonus={};addBonus(bonus,adj[1]);addBonus(bonus,noun[1]);const name=adj[0]+noun[0]+'の'+type.suffix;const g={id:uid(),slot:type.slot,suffix:type.suffix,base:variance,bonus,level:0,name,locked:true,effects:[adj[2],noun[2]]};state.gears.push(g);$('#rouletteStatus').classList.remove('active');$('#rouletteStatus').textContent='';$('#gachaResult').innerHTML=`<div class="slot-result-pop">✨ <b>${name}</b>を獲得！<br><span class="item-meta">${SLOT_LABEL[g.slot]}｜${statSummary(g)}</span><div class="effect-line"><span class="effect-tag">${adj[2]}</span><span class="effect-tag">${noun[2]}</span></div></div>`;playAudio(slotResultSe);gearSlotBusy=false;$('#gearGacha').disabled=false;render()},120)})})})}
function skillGacha(){if(state.gold<150)return alert('ゴールドが足りません');state.gold-=150;const sk=SKILLS[Math.floor(Math.random()*SKILLS.length)];state.skills[sk.name]=(state.skills[sk.name]||0)+1;if(!state.equippedSkills.includes(sk.name)&&state.equippedSkills.length<3)state.equippedSkills.push(sk.name);$('#gachaResult').innerHTML=`💫 スキル <b>${sk.name}</b> Lv.${state.skills[sk.name]} を獲得！`;render()}
function renderSkills(){const root=$('#skillList');root.innerHTML='';const names=Object.keys(state.skills);if(!names.length){root.innerHTML='<p class="item-meta">まだスキルを持っていません。</p>';return}names.forEach(name=>{const sk=SKILLS.find(x=>x.name===name),on=state.equippedSkills.includes(name);const d=document.createElement('div');d.className='skill-card';d.innerHTML=`<div><b>${name} Lv.${state.skills[name]}</b><div class="item-meta">${sk.desc}</div></div><button>${on?'装備中':'装備'}</button>`;d.querySelector('button').onclick=()=>{if(on)state.equippedSkills=state.equippedSkills.filter(x=>x!==name);else{if(state.equippedSkills.length>=3)return alert('スキルは3つまでです');state.equippedSkills.push(name)}render()};root.appendChild(d)})}
function enemyForFloor(f){if(f===30)return{name:'大魔王ヴァルガス',avatar:'😈',hp:1900,atk:82,def:30,spd:48,reward:2200,boss:true,demon:true};if(f===20)return{name:'冥界竜ネクロス',avatar:'🐲',hp:1100,atk:60,def:23,spd:44,reward:1000,boss:true};if(f===10)return{name:'獄炎将軍ガルド',avatar:'👹',hp:560,atk:40,def:16,spd:42,reward:500,boss:true};const b=ENEMIES[Math.min(ENEMIES.length-1,Math.floor((f-1)/5))],m=1+(f-1)*.13;return{...b,hp:Math.round(b.hp*m),atk:Math.round(b.atk*(1+(f-1)*.09)),def:Math.round(b.def*(1+(f-1)*.07)),reward:Math.round(b.reward*m)}}
function beginBattleNow(){playBgm(battleBgm);clearInterval(battleTimer);const ps=stats(),en=enemyForFloor(state.selectedFloor);battle={floor:state.selectedFloor,p:{...ps,maxHp:ps.hp,currentHp:ps.hp,next:0,boostUntil:0,guard:false,parry:false,counter:false,critBoost:false},e:{...en,maxHp:en.hp,currentHp:en.hp,next:0},tick:0};cooldowns=[0,0,0];$('#battleArea').classList.remove('hidden');$('#enemyName').textContent=en.name;const enemyEl=$('#enemyAvatar'),playerEl=$('#playerAvatar');enemyEl.textContent=en.avatar;enemyEl.className='avatar'+(en.boss?' boss-aura':'')+(en.demon?' demon-aura':'');renderGrandpa(playerEl);playerEl.classList.remove('battle-enter-left','enemy-defeated');enemyEl.classList.remove('battle-enter-right','enemy-defeated');void playerEl.offsetWidth;void enemyEl.offsetWidth;playerEl.classList.add('battle-enter-left');enemyEl.classList.add('battle-enter-right');setTimeout(()=>{playerEl.classList.remove('battle-enter-left');enemyEl.classList.remove('battle-enter-right')},820);$('#battleLog').innerHTML='';log(`第${battle.floor}階、${en.name}が現れた！`);updateBattleUI();battleTimer=setInterval(stepBattle,100)}

let battleIntroBusy=false;
function startBattle(){
  if(battleIntroBusy||battle)return;
  battleIntroBusy=true;
  const intro=$('#battleIntro');
  if(!intro){battleIntroBusy=false;beginBattleNow();return}
  intro.classList.remove('hidden','play');
  intro.setAttribute('aria-hidden','false');
  void intro.offsetWidth;
  intro.classList.add('play');
  setTimeout(()=>playAudio(clashSe,1.04),430);
  setTimeout(()=>{
    intro.classList.remove('play');
    intro.classList.add('hidden');
    intro.setAttribute('aria-hidden','true');
    battleIntroBusy=false;
    beginBattleNow();
  },900);
}
function stepBattle(){if(!battle)return;battle.tick+=100;cooldowns=cooldowns.map(x=>Math.max(0,x-100));battle.p.next-=100;battle.e.next-=100;if(battle.p.next<=0){playerAttack();battle.p.next=100000/(battle.p.spd*(battle.p.boostUntil>battle.tick?1.5:1))}if(battle&&battle.e.next<=0){enemyAttack();if(battle)battle.e.next=100000/battle.e.spd}updateBattleUI()}
function animateEl(el,cls){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),400)}function floatText(target,text,cls=''){const f=document.createElement('div');f.className='float-text '+cls;f.textContent=text;target.appendChild(f);setTimeout(()=>f.remove(),950)}
function playerAttack(mult=1){if(!battle)return;const p=battle.p,e=battle.e;let power=p.atk*mult;if(p.currentHp<p.maxHp*.3&&state.equippedSkills.includes('ラストスタンド'))power*=1.35;let dmg=Math.max(1,Math.round(power-e.def*.55));let crit=Math.random()*100<(p.crit+(p.critBoost?40:0));p.critBoost=false;if(crit)dmg=Math.round(dmg*1.8);playAudio(hitSe);animateEl($('#playerAvatar'),'attack-right');animateEl($('#enemyAvatar'),'hit-shake');floatText($('#enemyAvatar').parentElement,'-'+dmg,crit?'crit':'');e.currentHp-=dmg;const ls=p.lifesteal+(state.equippedSkills.includes('ライフスティール')?.04:0);if(ls)p.currentHp=Math.min(p.maxHp,p.currentHp+Math.round(dmg*ls));log(`じいさんの攻撃！ ${dmg}ダメージ${crit?' クリティカル！':''}`);if(e.currentHp<=0)win()}
function enemyAttack(){if(!battle)return;const p=battle.p,e=battle.e;if(p.parry){p.parry=false;log('パリィ！ 攻撃を完全無効化！');return}if(Math.random()*100<p.eva){log('じいさんは攻撃をかわした！');return}let dmg=Math.max(1,Math.round(e.atk-p.def*.5));if(p.guard){dmg=Math.ceil(dmg*.3);p.guard=false}playAudio(hitSe);animateEl($('#enemyAvatar'),'attack-left');animateEl($('#playerAvatar'),'hit-shake');floatText($('#playerAvatar').parentElement,'-'+dmg);p.currentHp-=dmg;if(p.counter){p.counter=false;log('カウンター発動！');playerAttack(1.4)}log(`${e.name}の攻撃！ ${dmg}ダメージ`);if(p.currentHp<=0)lose()}
function useSkill(i){if(!battle||cooldowns[i]>0)return;const name=state.equippedSkills[i];if(!name)return;const sk=SKILLS.find(x=>x.name===name),lv=state.skills[name]||1,p=battle.p;switch(sk.kind){case'power':p.boostUntil=battle.tick+6000+lv*700;break;case'speed':p.spd+=8+lv*2;setTimeout(()=>{if(battle)p.spd-=8+lv*2},6000);break;case'crit':p.critBoost=true;break;case'guard':p.guard=true;break;case'regen':p.currentHp=Math.min(p.maxHp,p.currentHp+Math.round(p.maxHp*(.2+lv*.03)));break;case'counter':p.counter=true;break;case'parry':p.parry=true;break;case'berserk':p.boostUntil=battle.tick+8000;p.atk+=5+lv*3;break;case'steal':p.lifesteal+=.05+lv*.01;break;default:p.boostUntil=battle.tick+5000}cooldowns[i]=12000;log(`${name} Lv.${lv} 発動！`);updateBattleUI()}
function updateBattleUI(){if(!battle)return;const p=battle.p,e=battle.e;$('#playerHpBar').style.width=Math.max(0,p.currentHp/p.maxHp*100)+'%';$('#enemyHpBar').style.width=Math.max(0,e.currentHp/e.maxHp*100)+'%';$('#playerHpText').textContent=`${Math.max(0,Math.round(p.currentHp))} / ${p.maxHp}`;$('#enemyHpText').textContent=`${Math.max(0,Math.round(e.currentHp))} / ${e.maxHp}`}
function win(){if(!battle)return;const f=battle.floor,r=battle.e.reward;clearInterval(battleTimer);battleTimer=null;battle.e.currentHp=0;updateBattleUI();$('#enemyAvatar').classList.add('enemy-defeated');state.gold+=r;state.maxFloor=Math.max(state.maxFloor,f);if(f<30)state.selectedFloor=Math.min(30,f+1);log(`勝利！ ${r}Gを獲得！`);floatText($('#battleArea'),`💰 +${r} G`,'gold-float');save();$('#gold').textContent=state.gold;$('#maxFloor').textContent=state.maxFloor;$('#selectedFloor').textContent=state.selectedFloor;setTimeout(()=>{battle=null;render()},750)}function lose(){clearInterval(battleTimer);battleTimer=null;log('じいさんは力尽きた……。');battle=null;updateBattleUI()}function log(t){$('#battleLog').insertAdjacentHTML('beforeend',`<p>${t}</p>`);$('#battleLog').scrollTop=$('#battleLog').scrollHeight}
function stopBgms(){[titleBgm,menuBgm,battleBgm,forgeBgm].forEach(a=>{try{a.pause()}catch{}})}
function playBgm(a){stopBgms();if(a){a.currentTime=0;a.play().catch(()=>{})}}
function setHeroForge(on){const hero=$('.hero');if(on){hero.classList.add('forge-hero');hero.innerHTML='<div class="smith-face">🧔‍♂️</div><div class="smith-speech">いらっしゃい</div>'}else if(hero.classList.contains('forge-hero')){hero.classList.remove('forge-hero');hero.innerHTML='<div id="shopGrandpa" class="portrait layered-grandpa"></div><div class="hero-info"><h2>武器屋のじいさん Lv.<span id="level">1</span></h2><div class="statline"><span>HP</span><b id="hpStat"></b></div><div class="statline"><span>攻撃</span><b id="atkStat"></b></div><div class="statline"><span>防御</span><b id="defStat"></b></div><div class="statline"><span>速度</span><b id="spdStat"></b></div><div class="statline"><span>会心</span><b id="critStat"></b></div><div class="statline"><span>回避</span><b id="evaStat"></b></div></div>';render()}}

const heroElV54=document.querySelector('.hero');const tabsElV54=document.querySelector('.tabs');
function placeHeroForTabV54(tab){const mount=$('#battleHeroMount');if(tab==='battle'&&mount&&heroElV54){mount.appendChild(heroElV54)}else if(heroElV54&&tabsElV54&&tabsElV54.parentNode){tabsElV54.parentNode.insertBefore(heroElV54,tabsElV54)}}
function switchTab(tab,btn){const doSwitch=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$('#'+tab).classList.add('active');setHeroForge(tab==='forge');if(tab==='forge')playBgm(forgeBgm);else if(tab==='battle')playBgm(battleBgm);else if(tab==='gacha')playBgm(titleBgm);else playBgm(menuBgm)};if(tab==='forge'){const ov=$('#sceneTransition');ov.classList.remove('hidden');void ov.offsetWidth;ov.classList.add('show');setTimeout(()=>{doSwitch();ov.classList.add('fadeout');setTimeout(()=>{ov.classList.add('hidden');ov.classList.remove('show','fadeout')},500)},650)}else doSwitch()}
function enterGame(){playBgm(menuBgm);$('#titleScreen').classList.add('hidden');$('#gameApp').classList.remove('hidden');render()}function showTitle(){stopBgms();$('#gameApp').classList.add('hidden');$('#titleScreen').classList.remove('hidden');$('#continueBtn').disabled=!localStorage.getItem('grandpaDemonSave')}
let titleAudioUnlocked=true;
$('#newGameBtn').onclick=()=>{playSE();if(localStorage.getItem('grandpaDemonSave')&&!confirm('現在のセーブデータを消してニューゲームを始めますか？'))return;localStorage.removeItem('grandpaDemonSave');state=migrate(null);save();setTimeout(enterGame,180)};$('#continueBtn').onclick=()=>{playSE();state=migrate(load());setTimeout(enterGame,180)};
$('#gearGacha').onclick=gearGacha;$('#skillGacha').onclick=skillGacha;
document.addEventListener('pointerdown',e=>{const btn=e.target.closest&&e.target.closest('button');if(btn&&!btn.disabled)playSE()},{passive:true});
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab,b));$('#minusFloor').onclick=()=>{state.selectedFloor=Math.max(1,state.selectedFloor-1);render()};$('#plusFloor').onclick=()=>{state.selectedFloor=Math.min(30,Math.max(state.maxFloor+1,1),state.selectedFloor+1);render()};$('#startBattle').onclick=startBattle;const skillPowerBtn=$('#skillPower'),skillDodgeBtn=$('#skillDodge'),skillThrowBtn=$('#skillThrow');if(skillPowerBtn)skillPowerBtn.onclick=()=>useSkill(0);if(skillDodgeBtn)skillDodgeBtn.onclick=()=>useSkill(1);if(skillThrowBtn)skillThrowBtn.onclick=()=>useSkill(2);$('#resetSave').onclick=()=>{if(confirm('本当にセーブデータを初期化しますか？')){localStorage.removeItem('grandpaDemonSave');location.reload()}};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.matches('[data-equip]')||b.id==='gearGacha')return;playSE()});
if('serviceWorker'in navigator){let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload()});window.addEventListener('load',async()=>{try{const r=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});if(r.waiting)r.waiting.postMessage({type:'SKIP_WAITING'});r.addEventListener('updatefound',()=>{const w=r.installing;if(w)w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)w.postMessage({type:'SKIP_WAITING'})})})}catch(e){console.warn(e)}})}
showTitle();

/* ===== Ver.5.2: detailed breakdowns, status help, skills window, scene transitions ===== */
const STAT_LABELS_V52={hp:'HP',atk:'攻撃',def:'防御',spd:'速度',crit:'会心',eva:'回避',lifesteal:'HP吸収'};
function fmtStatV52(k,v){
  if(k==='lifesteal') return `${v>=0?'+':''}${Math.round(v*100)}%`;
  if(k==='crit'||k==='eva') return `${v>=0?'+':''}${v}%`;
  return `${v>=0?'+':''}${v}`;
}
function objectStatLinesV52(obj){
  return Object.keys(STAT_LABELS_V52).filter(k=>obj&&obj[k]).map(k=>`${STAT_LABELS_V52[k]} ${fmtStatV52(k,obj[k])}`);
}
function nameBonusForGearV52(g){
  const out={};
  const labels=new Set(g.effects||[]);
  [...ADJECTIVES,...ABSTRACT_NOUNS].forEach(x=>{if(labels.has(x[2]))addBonus(out,x[1])});
  return out;
}
function residualBonusV52(g,nameBonus){
  const out={};
  Object.keys(g.bonus||{}).forEach(k=>{const v=(g.bonus[k]||0)-(nameBonus[k]||0);if(Math.abs(v)>1e-9)out[k]=v});
  return out;
}
function totalGearStatsV52(g){const out={};addBonus(out,g.base||{});addBonus(out,g.bonus||{});return out}
function showGearBreakdownV52(id){
  const g=gear(id);if(!g)return;
  const named=nameBonusForGearV52(g),other=residualBonusV52(g,named),total=totalGearStatsV52(g);
  const effectNames=(g.effects||[]).length?(g.effects||[]).map(x=>`<div>${x}</div>`).join(''):'<div>名称による追加効果なし</div>';
  const baseLines=objectStatLinesV52(g.base).join(' / ')||'なし';
  const otherLines=objectStatLinesV52(other).join(' / ')||'なし';
  const totalLines=objectStatLinesV52(total).join(' / ')||'能力なし';
  $('#detailTitle').textContent=g.name+' の内訳';
  $('#detailContent').innerHTML=`
    <div class="detail-section"><b>装備の名称による詳細効果</b>${effectNames}</div>
    <div class="detail-section"><b>装備品の基礎効果</b><div>${baseLines}</div></div>
    <div class="detail-section"><b>その他の効果（鍛冶屋強化・継承など）</b><div>${otherLines}</div></div>
    <div class="detail-section detail-total"><b>ステータス合計</b><div>${totalLines}</div></div>`;
  $('#detailModal').classList.remove('hidden');
}
function playerBreakdownV52(){
  const base={hp:128,atk:12,def:5,spd:50,crit:5,eva:3,lifesteal:0};
  const gearParts=[];const total=stats();
  Object.keys(SLOT_LABEL).forEach(slot=>{const g=gear(state.equipped[slot]);if(g)gearParts.push({slot,name:g.name,stats:totalGearStatsV52(g)})});
  return {base,gearParts,total};
}
function showStatusDetailV52(){
  const b=playerBreakdownV52();
  let html=`<div class="detail-section"><b>${state.playerName||'じいさん'}自身の基礎ステータス</b><div>${objectStatLinesV52(b.base).join(' / ')}</div></div>`;
  b.gearParts.forEach(x=>{html+=`<div class="detail-section"><b>${SLOT_LABEL[x.slot]}：${x.name}</b><div>${objectStatLinesV52(x.stats).join(' / ')||'補正なし'}</div></div>`});
  html+=`<div class="detail-section detail-total"><b>現在の最終ステータス合計</b><div>${objectStatLinesV52(b.total).join(' / ')}</div></div>`;
  $('#detailTitle').textContent='じいさんのステータス詳細';$('#detailContent').innerHTML=html;$('#detailModal').classList.remove('hidden');
}
function showLearnedSkillsV52(){
  const entries=Object.entries(state.skills||{});
  $('#learnedSkillsContent').innerHTML=entries.length?entries.map(([name,lv])=>{const sk=SKILLS.find(s=>s.name===name);const equipped=state.equippedSkills.includes(name)?'（装備中）':'';return `<div class="skill-modal-row"><b>${name} Lv.${lv} ${equipped}</b><div class="item-meta">${sk?sk.desc:'パッシブスキル'}</div></div>`}).join(''):'まだスキルを習得していません。';
  $('#skillsModal').classList.remove('hidden');
}
function bindHeroButtonsV52(){
  const d=$('#statusDetailBtn'),h=$('#statusHelpBtn'),s=$('#learnedSkillsBtn');
  if(d)d.onclick=showStatusDetailV52;if(h)h.onclick=()=>$('#helpModal').classList.remove('hidden');if(s)s.onclick=showLearnedSkillsV52;
}
function render(){
  const s=stats();const set=(id,val)=>{const e=$(id);if(e)e.textContent=val};
  set('#gold',state.gold);set('#playerNameDisplay',state.playerName||'じいさん');set('#battlePlayerName',state.playerName||'じいさん');
  set('#hpStat',s.hp);set('#atkStat',s.atk);set('#defStat',s.def);set('#spdStat',s.spd);set('#critStat',s.crit+'%');set('#evaStat',s.eva+'%');set('#lifestealStat',Math.round((s.lifesteal||0)*100)+'%');set('#maxFloor',state.maxFloor);set('#selectedFloor',state.selectedFloor);
  renderGrandpa($('#shopGrandpa'));renderGrandpa($('#playerAvatar'));
  const active=document.querySelector('.panel.active');const activeId=active?active.id:'equip';
  if(activeId==='equip')renderEquip();
  else if(activeId==='forge')renderForge();
  else if(activeId==='gacha')renderSkills();
  bindHeroButtonsV52();save();
}
function renderEquip(){
  const slots=$('#equipSlots');slots.innerHTML='';Object.keys(SLOT_LABEL).forEach(slot=>{const g=gear(state.equipped[slot]);const emoji=g?gearEmoji(slot,g.suffix):(slot==='head'?'🎩':slot==='body'?'🥋':slot==='right'?'⚔️':'🛡️');slots.insertAdjacentHTML('beforeend',`<div class="equip-slot"><div class="slot-label">${SLOT_LABEL[slot]}</div><div class="slot-name">${g?g.name:'なし'}</div><div class="item-meta">${g?statSummary(g):''}</div><div class="equip-slot-actions">${g?`<button class="breakdown-btn" data-breakdown="${g.id}">内訳</button>`:''}<span class="slot-emoji">${emoji}</span></div></div>`) });
  const inv=$('#inventory');inv.innerHTML='';state.gears.forEach(g=>{const row=document.createElement('div');row.className='gear-card compact-gear';const equipped=state.equipped[g.slot]===g.id;row.innerHTML=`<div class="gear-row compact-row"><div class="gear-info"><div class="gear-title-line"><span class="gear-category">${SLOT_LABEL[g.slot]}</span><b>${g.name}</b></div><div class="item-meta">強化+${g.level}｜${statSummary(g)}</div><div class="gear-actions"><button class="breakdown-btn" data-breakdown="${g.id}">内訳</button></div></div><div class="gear-actions compact-actions"><button data-equip class="${equipped?'equipped-btn':''}" ${equipped?'disabled':''}>${equipped?'装備中':'装備'}</button></div></div>`;const eb=row.querySelector('[data-equip]');eb.onclick=()=>{if(equipped)return;playEquipSE();state.equipped[g.slot]=g.id;render()};inv.appendChild(row)});
  bindBreakdownButtonsV52();
}
function setHeroModeV53(mode){
  const hero=$('.hero');if(!hero)return;
  if(mode==='forge'){hero.className='hero card forge-hero';hero.innerHTML='<div class="smith-face">🧔‍♂️</div><div class="smith-speech">いらっしゃい</div>';return;}
  if(mode==='shop'){hero.className='hero card shop-hero';hero.innerHTML='<div class="shop-face">👱‍♀️</div><div class="smith-speech">いらっしゃいませ</div>';return;}
  hero.className='hero card';hero.innerHTML=normalHeroHtmlV52();render();
}
function transitionToV52(label,callback){const ov=$('#sceneTransition');const txt=$('#sceneTransitionText');if(txt)txt.textContent=label;ov.classList.remove('hidden','fadeout');void ov.offsetWidth;ov.classList.add('show');setTimeout(()=>{callback();ov.classList.add('fadeout');setTimeout(()=>{ov.classList.add('hidden');ov.classList.remove('show','fadeout')},500)},650)}
function switchTab(tab,btn){
  const doSwitch=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$('#'+tab).classList.add('active');placeHeroForTabV54(tab);setHeroModeV53(tab==='forge'?'forge':tab==='gacha'?'shop':'normal');if(tab==='forge')playBgm(forgeBgm);else if(tab==='battle')playBgm(battleBgm);else if(tab==='gacha')playBgm(titleBgm);else playBgm(menuBgm)};
  const labels={gacha:'ショップ',forge:'鍛冶屋',battle:'魔王城'};
  if(labels[tab])transitionToV52(labels[tab],doSwitch);else doSwitch();
}

$('#detailClose').onclick=()=>$('#detailModal').classList.add('hidden');
$('#helpClose').onclick=()=>$('#helpModal').classList.add('hidden');
$('#skillsClose').onclick=()=>$('#skillsModal').classList.add('hidden');
['detailModal','helpModal','skillsModal'].forEach(id=>{$('#'+id).addEventListener('click',e=>{if(e.target.id===id)e.currentTarget.classList.add('hidden')})});
bindHeroButtonsV52();


/* ===== Ver.5.5: generated-only grandpa name + startup fixes ===== */
function randomGrandpaNameV55(){return GRANDPA_NAMES[Math.floor(Math.random()*GRANDPA_NAMES.length)]}
let pendingGrandpaNameV55=randomGrandpaNameV55();
function updateGeneratedNameV55(){const el=$('#grandpaNameDisplay');if(el)el.textContent=pendingGrandpaNameV55}
updateGeneratedNameV55();
if($('#randomNameBtn'))$('#randomNameBtn').onclick=()=>{playSE();pendingGrandpaNameV55=randomGrandpaNameV55();updateGeneratedNameV55()};
$('#newGameBtn').onclick=()=>{playSE();if(localStorage.getItem('grandpaDemonSave')&&!confirm('現在のセーブデータを消してニューゲームを始めますか？'))return;localStorage.removeItem('grandpaDemonSave');state=migrate(null);state.playerName=pendingGrandpaNameV55;save();setTimeout(()=>{enterGame();const equipBtn=document.querySelector('.tab[data-tab="equip"]');if(equipBtn)switchTab('equip',equipBtn)},120)};
$('#continueBtn').onclick=()=>{playSE();state=migrate(load());setTimeout(()=>{enterGame();const equipBtn=document.querySelector('.tab[data-tab="equip"]');if(equipBtn)switchTab('equip',equipBtn)},120)};


/* ===== Ver.5.6.1 hotfix: scene transition recovery + hero status refresh ===== */
function restoreNormalHeroV561(){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  hero.className='hero card';
  hero.innerHTML=normalHeroHtmlV52();
  bindHeroButtonsV52();
  const st=stats();
  const setTxt=(sel,val)=>{const el=document.querySelector(sel);if(el)el.textContent=val};
  setTxt('#playerNameDisplay',state.playerName||'じいさん');
  setTxt('#hpStat',st.hp);
  setTxt('#atkStat',st.atk);
  setTxt('#defStat',st.def);
  setTxt('#spdStat',st.spd);
  setTxt('#critStat',st.crit+'%');
  setTxt('#evaStat',st.eva+'%');
  setTxt('#lifestealStat',Math.round((st.lifesteal||0)*100)+'%');
}
function transitionToV52(label,callback){
  const ov=document.querySelector('#sceneTransition');
  const txt=document.querySelector('#sceneTransitionText');
  if(!ov){try{callback()}catch(e){console.error(e)}return}
  if(txt)txt.textContent=label;
  ov.classList.remove('hidden','fadeout');
  void ov.offsetWidth;
  ov.classList.add('show');
  setTimeout(()=>{
    try{callback()}catch(e){console.error('scene transition callback error',e)}
    finally{
      ov.classList.add('fadeout');
      setTimeout(()=>{ov.classList.add('hidden');ov.classList.remove('show','fadeout')},420);
    }
  },520);
}
function switchTab(tab,btn){
  const doSwitch=()=>{
    document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));
    if(btn)btn.classList.add('active');
    const panel=document.querySelector('#'+tab);
    if(panel)panel.classList.add('active');
    try{placeHeroForTabV54(tab)}catch(e){console.warn('hero placement',e)}
    if(tab==='forge'){
      setHeroModeV53('forge'); playBgm(forgeBgm);
    }else if(tab==='gacha'){
      setHeroModeV53('shop'); playBgm(titleBgm);
    }else{
      restoreNormalHeroV561();
      if(tab==='battle')playBgm(battleBgm);else playBgm(menuBgm);
    }
    if(tab==='equip')renderEquip();
    else if(tab==='forge')renderForge();
    else if(tab==='gacha')renderSkills();
    else if(tab==='battle'){
      const mf=document.querySelector('#maxFloor');if(mf)mf.textContent=state.maxFloor;
      const sf=document.querySelector('#selectedFloor');if(sf)sf.textContent=state.selectedFloor;
    }
    save();
  };
  const labels={gacha:'ショップ',forge:'鍛冶屋',battle:'魔王城'};
  if(labels[tab])transitionToV52(labels[tab],doSwitch);else doSwitch();
}
/* Rebind tabs after override so all tabs use the repaired navigation. */
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab,b));


/* ===== Ver.5.6.2: strict hero/header display by screen ===== */
function setHeroAreaForTabV562(tab){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  if(tab==='gacha'){
    hero.style.display='';
    hero.className='hero card shop-hero';
    hero.innerHTML='<div class="shop-face">👱‍♀️</div><div class="smith-speech">いらっしゃいませ</div>';
    return;
  }
  if(tab==='forge'){
    hero.style.display='';
    hero.className='hero card forge-hero';
    hero.innerHTML='<div class="smith-face">🧔‍♂️</div><div class="smith-speech">いらっしゃい</div>';
    return;
  }
  if(tab==='battle'){
    hero.style.display='none';
    return;
  }
  hero.style.display='';
  hero.className='hero card';
  hero.innerHTML=normalHeroHtmlV52();
  bindHeroButtonsV52();
  const st=stats();
  const setTxt=(sel,val)=>{const el=document.querySelector(sel);if(el)el.textContent=val};
  setTxt('#playerNameDisplay',state.playerName||'じいさん');
  setTxt('#hpStat',st.hp);setTxt('#atkStat',st.atk);setTxt('#defStat',st.def);setTxt('#spdStat',st.spd);
  setTxt('#critStat',st.crit+'%');setTxt('#evaStat',st.eva+'%');setTxt('#lifestealStat',Math.round((st.lifesteal||0)*100)+'%');
}
function switchTab(tab,btn){
  const doSwitch=()=>{
    document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));
    if(btn)btn.classList.add('active');
    const panel=document.querySelector('#'+tab);if(panel)panel.classList.add('active');
    setHeroAreaForTabV562(tab);
    if(tab==='forge'){playBgm(forgeBgm);renderForge();}
    else if(tab==='gacha'){playBgm(titleBgm);renderSkills();}
    else if(tab==='battle'){
      playBgm(battleBgm);
      const mf=document.querySelector('#maxFloor'),sf=document.querySelector('#selectedFloor');
      if(mf)mf.textContent=state.maxFloor;if(sf)sf.textContent=state.selectedFloor;
    }else{playBgm(menuBgm);renderEquip();}
    save();
  };
  const labels={gacha:'ショップ',forge:'鍛冶屋',battle:'魔王城'};
  if(labels[tab])transitionToV52(labels[tab],doSwitch);else doSwitch();
}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab,b));

/* ===== Ver.5.6.3 overrides ===== */
function playCastleButtonSEV563(){
  try{
    if(!castleButtonSe)return;
    castleButtonSe.pause();castleButtonSe.currentTime=0;
    const p=castleButtonSe.play();if(p&&p.catch)p.catch(()=>{});
  }catch(e){}
}
function playBattleIntroV563(done){
  let ov=document.querySelector('#battleIntroV563');
  if(!ov){
    ov=document.createElement('div');
    ov.id='battleIntroV563';
    ov.innerHTML='<div class="sword-v563 sword-left-v563">⚔️</div><div class="sword-v563 sword-right-v563">⚔️</div><div class="sword-center-v563">⚔️</div>';
    document.body.appendChild(ov);
  }
  ov.classList.remove('active','hit');void ov.offsetWidth;ov.classList.add('active');
  setTimeout(()=>{ov.classList.add('hit');try{clashSe.currentTime=0;const p=clashSe.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}},150);
  setTimeout(()=>{ov.classList.remove('active','hit');if(done)done()},390);
}
document.querySelectorAll('.tab').forEach(b=>{
  b.onclick=(ev)=>{
    if(b.dataset.tab==='battle'){
      try{ev.stopPropagation()}catch(e){}
      playCastleButtonSEV563();
    }
    switchTab(b.dataset.tab,b);
  };
});
const startBattleBtnV563=document.querySelector('#startBattle');
if(startBattleBtnV563){
  startBattleBtnV563.onclick=()=>{
    if(startBattleBtnV563.disabled)return;
    startBattleBtnV563.disabled=true;
    playBattleIntroV563(()=>{
      startBattleBtnV563.disabled=false;
      try{if(typeof startBattle==='function')startBattle()}catch(e){console.error(e)}
    });
  };
}
function renderBattleGrandpaFaceOnlyV563(){
  const el=document.querySelector('#playerAvatar');
  if(el)el.innerHTML='<span class="battle-grandpa-face-v563">👴</span>';
}
if(typeof renderBattle==='function'){
  const oldRenderBattleV563=renderBattle;
  renderBattle=function(){
    const r=oldRenderBattleV563.apply(this,arguments);
    renderBattleGrandpaFaceOnlyV563();
    return r;
  };
}

/* ===== Ver.5.6.4 final overrides ===== */
function showGrandpaStatusCardV564(){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  hero.style.display='';
  hero.className='hero card';
  hero.innerHTML=`
    <div class="grandpa-status-face">👴</div>
    <div class="hero-content">
      <div class="hero-name" id="playerNameDisplay">${state.playerName||'じいさん'}</div>
      <div class="stats-grid">
        <div><span>HP</span><b id="hpStat"></b></div>
        <div><span>攻撃</span><b id="atkStat"></b></div>
        <div><span>防御</span><b id="defStat"></b></div>
        <div><span>速度</span><b id="spdStat"></b></div>
        <div><span>会心</span><b id="critStat"></b></div>
        <div><span>回避</span><b id="evaStat"></b></div>
        <div><span>HP吸収</span><b id="lifestealStat"></b></div>
      </div>
      <div class="hero-bottom-actions">
        <button id="statusDetailBtn">ステータス詳細</button>
        <button id="statusHelpBtn">ヘルプ</button>
        <button id="learnedSkillsBtn">スキル</button>
      </div>
    </div>`;
  const st=stats();
  const put=(sel,val)=>{const el=document.querySelector(sel);if(el)el.textContent=val};
  put('#hpStat',st.hp);put('#atkStat',st.atk);put('#defStat',st.def);put('#spdStat',st.spd);
  put('#critStat',st.crit+'%');put('#evaStat',st.eva+'%');
  put('#lifestealStat',Math.round((st.lifesteal||0)*100)+'%');
  bindHeroButtonsV52();
}

function playBattleIntroV563(done){
  let ov=document.querySelector('#battleIntroV563');
  if(!ov){
    ov=document.createElement('div');
    ov.id='battleIntroV563';
    document.body.appendChild(ov);
  }
  ov.innerHTML='<div class="sword-center-v564">⚔️</div>';
  ov.classList.remove('active','hit');void ov.offsetWidth;ov.classList.add('active','hit');
  try{
    if(clashSe){
      clashSe.pause();clashSe.currentTime=0;
      const p=clashSe.play();if(p&&p.catch)p.catch(()=>{});
    }
  }catch(e){}
  setTimeout(()=>{ov.classList.remove('active','hit');if(done)done()},220);
}

function setHeroAreaForTabV562(tab){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  if(tab==='gacha'){
    hero.style.display='';
    hero.className='hero card shop-hero';
    hero.innerHTML='<div class="shop-face">👱‍♀️</div><div class="smith-speech">いらっしゃいませ</div>';
    return;
  }
  if(tab==='forge'){
    hero.style.display='';
    hero.className='hero card forge-hero';
    hero.innerHTML='<div class="smith-face">🧔‍♂️</div><div class="smith-speech">いらっしゃい</div>';
    return;
  }
  if(tab==='battle'){
    hero.style.display='none';
    return;
  }
  showGrandpaStatusCardV564();
}

function switchTab(tab,btn){
  const doSwitch=()=>{
    document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));
    if(btn)btn.classList.add('active');
    const panel=document.querySelector('#'+tab);
    if(panel)panel.classList.add('active');
    setHeroAreaForTabV562(tab);
    if(tab==='forge'){playBgm(forgeBgm);renderForge();}
    else if(tab==='gacha'){playBgm(titleBgm);renderSkills();}
    else if(tab==='battle'){
      playBgm(battleBgm);
      const mf=document.querySelector('#maxFloor'),sf=document.querySelector('#selectedFloor');
      if(mf)mf.textContent=state.maxFloor;if(sf)sf.textContent=state.selectedFloor;
    }else{playBgm(menuBgm);renderEquip();}
    save();
  };
  const labels={gacha:'ショップ',forge:'鍛冶屋',battle:'魔王城'};
  if(labels[tab])transitionToV52(labels[tab],doSwitch);else doSwitch();
}

document.querySelectorAll('.tab').forEach(b=>{
  b.onclick=(ev)=>{
    if(b.dataset.tab==='battle'){
      try{ev.stopPropagation()}catch(e){}
      playCastleButtonSEV563();
    }
    switchTab(b.dataset.tab,b);
  };
});


/* ===== Ver.5.6.5 separate merchant windows ===== */
function updateGrandpaStatusV565(){
 const hero=document.querySelector('.hero');if(!hero)return;
 hero.style.display='';hero.className='hero card';
 hero.innerHTML=`<div class="grandpa-status-face">👴</div><div class="hero-content"><div class="hero-name" id="playerNameDisplay">${state.playerName||'じいさん'}</div><div class="stats-grid"><div><span>HP</span><b id="hpStat"></b></div><div><span>攻撃</span><b id="atkStat"></b></div><div><span>防御</span><b id="defStat"></b></div><div><span>速度</span><b id="spdStat"></b></div><div><span>会心</span><b id="critStat"></b></div><div><span>回避</span><b id="evaStat"></b></div><div><span>HP吸収</span><b id="lifestealStat"></b></div></div><div class="hero-bottom-actions"><button id="statusDetailBtn">ステータス詳細</button><button id="statusHelpBtn">ヘルプ</button><button id="learnedSkillsBtn">スキル</button></div></div>`;
 const st=stats(),put=(s,v)=>{const e=document.querySelector(s);if(e)e.textContent=v};
 put('#hpStat',st.hp);put('#atkStat',st.atk);put('#defStat',st.def);put('#spdStat',st.spd);put('#critStat',st.crit+'%');put('#evaStat',st.eva+'%');put('#lifestealStat',Math.round((st.lifesteal||0)*100)+'%');bindHeroButtonsV52();
}
function setTopCardsForTabV565(tab){
 const hero=document.querySelector('.hero'),shop=document.querySelector('#shopMerchantCard'),forge=document.querySelector('#forgeMerchantCard');
 if(hero)hero.style.display='none';if(shop)shop.classList.add('hidden');if(forge)forge.classList.add('hidden');
 if(tab==='equip'){if(hero){hero.style.display='';updateGrandpaStatusV565();}}
 else if(tab==='gacha'){if(shop)shop.classList.remove('hidden');}
 else if(tab==='forge'){if(forge)forge.classList.remove('hidden');}
}
function switchTab(tab,btn){
 const doSwitch=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));if(btn)btn.classList.add('active');const panel=document.querySelector('#'+tab);if(panel)panel.classList.add('active');setTopCardsForTabV565(tab);if(tab==='forge'){playBgm(forgeBgm);renderForge();}else if(tab==='gacha'){playBgm(titleBgm);renderSkills();}else if(tab==='battle'){playBgm(battleBgm);const mf=document.querySelector('#maxFloor'),sf=document.querySelector('#selectedFloor');if(mf)mf.textContent=state.maxFloor;if(sf)sf.textContent=state.selectedFloor;}else{playBgm(menuBgm);renderEquip();updateGrandpaStatusV565();}save();};
 const labels={gacha:'ショップ',forge:'鍛冶屋',battle:'魔王城'};if(labels[tab])transitionToV52(labels[tab],doSwitch);else doSwitch();
}
document.querySelectorAll('.tab').forEach(b=>{b.onclick=(ev)=>{if(b.dataset.tab==='battle'){try{ev.stopPropagation()}catch(e){}playCastleButtonSEV563();}switchTab(b.dataset.tab,b);};});
setTimeout(()=>setTopCardsForTabV565('equip'),0);

/* ===== Ver.5.6.6: status window only on Equipment screen ===== */
function renderGrandpaStatusCardV566(){
  const hero=document.querySelector('.hero');
  if(!hero)return;

  hero.style.display='';
  hero.className='hero card grandpa-status-card-v566';
  hero.innerHTML=`
    <div class="grandpa-status-main-v566">
      <div class="grandpa-status-face-v566">👴</div>
      <div class="grandpa-status-body-v566">
        <div class="grandpa-name-v566" id="playerNameDisplay">${state.playerName||'じいさん'}</div>
        <div class="grandpa-stats-v566">
          <div><span>HP</span><b id="hpStat"></b></div>
          <div><span>攻撃</span><b id="atkStat"></b></div>
          <div><span>防御</span><b id="defStat"></b></div>
          <div><span>速度</span><b id="spdStat"></b></div>
          <div><span>会心</span><b id="critStat"></b></div>
          <div><span>回避</span><b id="evaStat"></b></div>
          <div><span>HP吸収</span><b id="lifestealStat"></b></div>
        </div>
      </div>
    </div>
    <div class="grandpa-status-actions-v566">
      <button id="statusDetailBtn">ステータス詳細</button>
      <button id="statusHelpBtn">ヘルプ</button>
      <button id="learnedSkillsBtn">スキル</button>
    </div>`;

  const st=stats();
  const put=(sel,val)=>{const el=document.querySelector(sel);if(el)el.textContent=val};
  put('#hpStat',st.hp);
  put('#atkStat',st.atk);
  put('#defStat',st.def);
  put('#spdStat',st.spd);
  put('#critStat',st.crit+'%');
  put('#evaStat',st.eva+'%');
  put('#lifestealStat',Math.round((st.lifesteal||0)*100)+'%');
  bindHeroButtonsV52();
}

function setTopAreaForTabV566(tab){
  const hero=document.querySelector('.hero');
  const shop=document.querySelector('#shopMerchantCard');
  const forge=document.querySelector('#forgeMerchantCard');

  if(shop)shop.remove();
  if(forge)forge.remove();

  if(!hero)return;

  if(tab==='equip'){
    renderGrandpaStatusCardV566();
  }else{
    hero.style.display='none';
  }
}

function switchTab(tab,btn){
  const doSwitch=()=>{
    document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));
    if(btn)btn.classList.add('active');

    const panel=document.querySelector('#'+tab);
    if(panel)panel.classList.add('active');

    setTopAreaForTabV566(tab);

    if(tab==='forge'){
      playBgm(forgeBgm);
      renderForge();
    }else if(tab==='gacha'){
      playBgm(titleBgm);
      renderSkills();
    }else if(tab==='battle'){
      playBgm(battleBgm);
      const mf=document.querySelector('#maxFloor');
      const sf=document.querySelector('#selectedFloor');
      if(mf)mf.textContent=state.maxFloor;
      if(sf)sf.textContent=state.selectedFloor;
    }else{
      playBgm(menuBgm);
      renderEquip();
      renderGrandpaStatusCardV566();
    }
    save();
  };

  const labels={gacha:'ショップ',forge:'鍛冶屋',battle:'魔王城'};
  if(labels[tab])transitionToV52(labels[tab],doSwitch);
  else doSwitch();
}

document.querySelectorAll('.tab').forEach(b=>{
  b.onclick=(ev)=>{
    if(b.dataset.tab==='battle'){
      try{ev.stopPropagation()}catch(e){}
      if(typeof playCastleButtonSEV563==='function')playCastleButtonSEV563();
    }
    switchTab(b.dataset.tab,b);
  };
});

setTimeout(()=>{
  const active=document.querySelector('.panel.active');
  setTopAreaForTabV566(active?active.id:'equip');
},0);

/* ===== Ver.5.6.7: shop skill result cleanup ===== */
function cleanShopSkillButtonsV567(){
  const shop=document.querySelector('#gacha');
  if(!shop)return;
  shop.querySelectorAll('[data-skill-equip], .skill-equip-btn, .equipped-btn').forEach(el=>el.remove());
}
function showSkillPurchaseResultV567(name,desc,level){
  const box=document.querySelector('#skillResult') || document.querySelector('#skillGachaResult') || document.querySelector('#skillResultBox');
  if(!box)return;
  box.innerHTML=`<div class="skill-purchase-result-v567">
    <div class="skill-purchase-label-v567">習得したスキル</div>
    <div class="skill-purchase-name-v567">${name}${level>1?` Lv.${level}`:''}</div>
    <div class="skill-purchase-effect-v567">${desc||'パッシブスキル'}</div>
  </div>`;
}
if(typeof renderSkills==='function'){
  const oldRenderSkillsV567=renderSkills;
  renderSkills=function(){
    const r=oldRenderSkillsV567.apply(this,arguments);
    cleanShopSkillButtonsV567();
    return r;
  };
}
