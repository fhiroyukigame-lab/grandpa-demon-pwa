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
const AUDIO_SETTINGS_KEY_V570='grandpaDemonAudioSettings';
let audioSettingsV570={bgm:0.70,se:0.80};
try{const a=JSON.parse(localStorage.getItem(AUDIO_SETTINGS_KEY_V570)||'null');if(a){if(typeof a.bgm==='number')audioSettingsV570.bgm=Math.max(0,Math.min(1,a.bgm));if(typeof a.se==='number')audioSettingsV570.se=Math.max(0,Math.min(1,a.se));}}catch(e){}
window.addEventListener('error',e=>console.error('APP ERROR:',e.error||e.message));
function uid(){return 'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function starter(slot,suffix,base,name){return {id:uid(),slot,suffix,base:{...base},bonus:{},level:0,name,locked:true}}
function migrate(old){if(old&&old.version===3&&Array.isArray(old.gears))return {...DEFAULT_STATE,...old,playerName:old.playerName||'ゲンゾウ',equipped:{...DEFAULT_STATE.equipped,...old.equipped},skills:old.skills||{},equippedSkills:old.equippedSkills||[]};const s=cloneDefaultState();if(old){s.gold=old.gold??300;s.playerName=old.playerName||'ゲンゾウ';s.maxFloor=old.maxFloor??0;s.selectedFloor=old.selectedFloor??1;}const starters=[starter('right','ソード',{atk:8},'オールドソード'),starter('left','シールド',{def:5},'オールドシールド'),starter('body','チュニック',{hp:35},'オールドチュニック'),starter('head','フード',{hp:20},'オールドフード')];s.gears=starters;for(const g of starters)s.equipped[g.slot]=g.id;return s}
function save(){localStorage.setItem('grandpaDemonSave',JSON.stringify(state))}function load(){try{return JSON.parse(localStorage.getItem('grandpaDemonSave'))}catch{return null}}
function playAudio(a,rate=1){if(!a)return;try{a.pause();a.currentTime=0;a.playbackRate=rate;a.volume=audioSettingsV570.se;a.play().catch(()=>{})}catch{}}function playSE(){playAudio(buttonSe,1.12)}function playEquipSE(){playAudio(equipButtonSe)}
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
function skillGacha(){if(state.gold<150)return alert('ゴールドが足りません');state.gold-=150;const sk=SKILLS[Math.floor(Math.random()*SKILLS.length)];state.skills[sk.name]=(state.skills[sk.name]||0)+1;renderSkillLearnResultClean(sk.name,state.skills[sk.name]);render()}function renderSkills(){const root=$('#skillList');root.innerHTML='';const names=Object.keys(state.skills);if(!names.length){root.innerHTML='<p class="item-meta">まだスキルを持っていません。</p>';return}names.forEach(name=>{const sk=SKILLS.find(x=>x.name===name),on=state.equippedSkills.includes(name);const d=document.createElement('div');d.className='skill-card';d.innerHTML=`<div><b>${name} Lv.${state.skills[name]}</b><div class="item-meta">${sk.desc}</div></div><button>${on?'装備中':'装備'}</button>`;d.querySelector('button').onclick=()=>{if(on)state.equippedSkills=state.equippedSkills.filter(x=>x!==name);else{if(state.equippedSkills.length>=3)return alert('スキルは3つまでです');state.equippedSkills.push(name)}render()};root.appendChild(d)})}
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
function playBgm(a){stopBgms();if(a){a.currentTime=0;a.volume=audioSettingsV570.bgm;a.play().catch(()=>{})}}
function setHeroForge(on){const hero=$('.hero');if(on){hero.classList.add('forge-hero');hero.innerHTML='<div class="smith-face">🧔‍♂️</div><div class="smith-speech">いらっしゃい</div>'}else if(hero.classList.contains('forge-hero')){hero.classList.remove('forge-hero');hero.innerHTML='<div id="shopGrandpa" class="portrait layered-grandpa"></div><div class="hero-info"><h2>武器屋のじいさん Lv.<span id="level">1</span></h2><div class="statline"><span>HP</span><b id="hpStat"></b></div><div class="statline"><span>攻撃</span><b id="atkStat"></b></div><div class="statline"><span>防御</span><b id="defStat"></b></div><div class="statline"><span>速度</span><b id="spdStat"></b></div><div class="statline"><span>会心</span><b id="critStat"></b></div><div class="statline"><span>回避</span><b id="evaStat"></b></div></div>';render()}}

const heroElV54=document.querySelector('.hero');const tabsElV54=document.querySelector('.tabs');
function placeHeroForTabV54(tab){const mount=$('#battleHeroMount');if(tab==='battle'&&mount&&heroElV54){mount.appendChild(heroElV54)}else if(heroElV54&&tabsElV54&&tabsElV54.parentNode){tabsElV54.parentNode.insertBefore(heroElV54,tabsElV54)}}

function enterGame(){playBgm(menuBgm);$('#titleScreen').classList.add('hidden');$('#gameApp').classList.remove('hidden');render()}function showTitle(){stopBgms();$('#gameApp').classList.add('hidden');$('#titleScreen').classList.remove('hidden');$('#continueBtn').disabled=!localStorage.getItem('grandpaDemonSave')}
let titleAudioUnlocked=true;
$('#newGameBtn').onclick=()=>{playSE();if(localStorage.getItem('grandpaDemonSave')&&!confirm('現在のセーブデータを消してニューゲームを始めますか？'))return;localStorage.removeItem('grandpaDemonSave');state=migrate(null);save();setTimeout(enterGame,180)};$('#continueBtn').onclick=()=>{playSE();state=migrate(load());setTimeout(enterGame,180)};
$('#gearGacha').onclick=gearGacha;$('#skillGacha').onclick=skillGacha;
document.addEventListener('pointerdown',e=>{const btn=e.target.closest&&e.target.closest('button');if(!btn||btn.disabled)return;if(btn.matches('.tab[data-tab=\"battle\"]')){playAudio(castleButtonSe,1);return;}if(btn.matches('[data-equip]')||btn.id==='gearGacha')return;playSE()},{passive:true});
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab,b));$('#minusFloor').onclick=()=>{state.selectedFloor=Math.max(1,state.selectedFloor-1);render()};$('#plusFloor').onclick=()=>{state.selectedFloor=Math.min(30,Math.max(state.maxFloor+1,1),state.selectedFloor+1);render()};$('#startBattle').onclick=startBattle;const skillPowerBtn=$('#skillPower'),skillDodgeBtn=$('#skillDodge'),skillThrowBtn=$('#skillThrow');if(skillPowerBtn)skillPowerBtn.onclick=()=>useSkill(0);if(skillDodgeBtn)skillDodgeBtn.onclick=()=>useSkill(1);if(skillThrowBtn)skillThrowBtn.onclick=()=>useSkill(2);$('#resetSave').onclick=()=>{if(confirm('本当にセーブデータを初期化しますか？')){localStorage.removeItem('grandpaDemonSave');location.reload()}};
if('serviceWorker'in navigator){let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload()});window.addEventListener('load',async()=>{try{const r=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});if(r.waiting)r.waiting.postMessage({type:'SKIP_WAITING'});r.addEventListener('updatefound',()=>{const w=r.installing;if(w)w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)w.postMessage({type:'SKIP_WAITING'})})})}catch(e){console.warn(e)}})}
showTitle();



/* ===== CLEAN BUILD 5.6.9 ===== */

/* ---------- Common helpers ---------- */
function safeText(sel,val){
  const el=document.querySelector(sel);
  if(el)el.textContent=val;
}
function currentStatsClean(){
  return stats();
}

/* ---------- Grandpa status: Equipment screen only ---------- */
function renderGrandpaStatusClean(){
  const hero=document.querySelector('.hero');if(!hero)return;
  hero.style.display='';hero.className='hero card grandpa-status-card-clean';
  hero.innerHTML=`<div class="grandpa-status-main-clean"><div class="grandpa-face-clean">👴</div><div class="grandpa-status-body-clean"><div class="grandpa-name-clean" id="playerNameDisplay">${state.playerName||'じいさん'}</div><div class="grandpa-stats-clean"><div><span>HP</span><b id="hpStat"></b></div><div><span>攻撃</span><b id="atkStat"></b></div><div><span>防御</span><b id="defStat"></b></div><div><span>速度</span><b id="spdStat"></b></div><div><span>会心</span><b id="critStat"></b></div><div><span>回避</span><b id="evaStat"></b></div><div><span>HP吸収</span><b id="lifestealStat"></b></div></div></div></div><div class="grandpa-status-actions-clean"><button id="statusDetailBtn">ステータス詳細</button><button id="statusHelpBtn">ヘルプ</button></div>`;
  const s=currentStatsClean();safeText('#hpStat',s.hp);safeText('#atkStat',s.atk);safeText('#defStat',s.def);safeText('#spdStat',s.spd);safeText('#critStat',s.crit+'%');safeText('#evaStat',s.eva+'%');safeText('#lifestealStat',Math.round((s.lifesteal||0)*100)+'%');bindStatusButtonsV570();
}
function statObjectTextV570(o){const names={hp:'HP',atk:'攻撃',def:'防御',spd:'速度',crit:'会心',eva:'回避',lifesteal:'HP吸収'};return Object.keys(names).filter(k=>o&&o[k]).map(k=>`${names[k]} ${k==='lifesteal'?Math.round(o[k]*100)+'%':o[k]}`).join(' / ')||'補正なし';}
function showStatusDetailV570(){const box=$('#detailContent'),title=$('#detailTitle');if(!box)return;if(title)title.textContent='ステータス詳細';const base={hp:128,atk:12,def:5,spd:50,crit:5,eva:3,lifesteal:0};const rows=[`<div class="detail-section"><b>じいさん基礎値</b><p>${statObjectTextV570(base)}</p></div>`];Object.entries(state.equipped).forEach(([slot,id])=>{const g=gear(id);if(!g)return;rows.push(`<div class="detail-section"><b>${SLOT_LABEL[slot]}：${g.name}</b><p>基礎効果：${statObjectTextV570(g.base||{})}</p><p>強化・その他：${statObjectTextV570(g.bonus||{})}</p></div>`)});const total=stats();rows.push(`<div class="detail-section total"><b>合計ステータス</b><p>${statObjectTextV570(total)}</p></div>`);box.innerHTML=rows.join('');$('#detailModal').classList.remove('hidden');}
function bindStatusButtonsV570(){const d=$('#statusDetailBtn'),h=$('#statusHelpBtn');if(d)d.onclick=showStatusDetailV570;if(h)h.onclick=()=>$('#helpModal').classList.remove('hidden');}

/* ---------- Screen switching: one implementation only ---------- */
function switchTab(tab,btn){
  const apply=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));if(btn)btn.classList.add('active');const panel=document.querySelector('#'+tab);if(panel)panel.classList.add('active');const hero=document.querySelector('.hero');if(hero){if(tab==='equip')renderGrandpaStatusClean();else hero.style.display='none';}
  if(tab==='equip'){playBgm(menuBgm);renderEquip();renderGrandpaStatusClean();renderOwnedSkillsV570();}
  else if(tab==='gacha'){playBgm(titleBgm);renderSkillsClean();}
  else if(tab==='forge'){playBgm(forgeBgm);renderForge();}
  else if(tab==='battle'){playBgm(battleBgm);safeText('#maxFloor',state.maxFloor);safeText('#selectedFloor',state.selectedFloor);}
  else if(tab==='options'){playBgm(menuBgm);bindAudioOptionsV570();applyAudioVolumesV570();}save();};
  const label={gacha:'ショップ',forge:'鍛冶屋',battle:'魔王城'}[tab];if(label&&typeof transitionToV52==='function')transitionToV52(label,apply);else apply();
}

/* ---------- Tabs: dedicated Demon Castle SE ---------- */
function bindTabsClean(){document.querySelectorAll('.tab').forEach(b=>{b.onclick=()=>switchTab(b.dataset.tab,b);});}

/* ---------- Skill shop: clean result-only UI ---------- */
function getSkillDefClean(name){
  if(typeof SKILLS==='undefined')return null;
  if(SKILLS && !Array.isArray(SKILLS) && SKILLS[name])return SKILLS[name];
  if(Array.isArray(SKILLS))return SKILLS.find(x=>x&&(x.name===name||x.id===name))||null;
  return null;
}
function renderSkillLearnResultClean(name,level){
  const box=document.querySelector('#skillLearnResultClean');
  if(!box)return;
  const sk=getSkillDefClean(name);
  const desc=sk&&(sk.desc||sk.effect)?(sk.desc||sk.effect):'パッシブスキル';
  box.classList.remove('hidden');
  box.innerHTML=`
    <div class="skill-learn-label-clean">習得したスキル</div>
    <div class="skill-learn-name-clean">${name}${level>1?` Lv.${level}`:''}</div>
    <div class="skill-learn-effect-clean">${desc}</div>`;
}
function clearLegacySkillUiClean(){
  const shop=document.querySelector('#gacha');
  if(!shop)return;

  /* never show skill equip/equipped controls in the shop */
  shop.querySelectorAll('[data-skill-equip],.skill-equip-btn,.equipped-btn').forEach(el=>el.remove());

  /* clear accidental skill text from the equipment purchase result */
  const gearResult=document.querySelector('#gachaResult');
  if(gearResult && /スキル|Lv\./.test(gearResult.textContent||'')){
    gearResult.innerHTML='';
  }

  /* remove old learned-skill list rows generated by legacy renderSkills */
  shop.querySelectorAll('.skill-row,.skill-card').forEach(el=>{
    if(!el.closest('#skillLearnResultClean'))el.remove();
  });
}
function renderSkillsClean(){
  /* keep the skill purchase card static and remove legacy inventory/equip rows */
  clearLegacySkillUiClean();
}

/* Wrap the skill purchase button once. */
function bindSkillPurchaseClean(){
  const btn=
    document.querySelector('#buySkill')||
    document.querySelector('#skillGacha')||
    document.querySelector('#skillBuy')||
    Array.from(document.querySelectorAll('#gacha button')).find(b=>(b.textContent||'').includes('スキル習得'));

  if(!btn || btn.dataset.cleanBound==='1')return;
  btn.dataset.cleanBound='1';

  const old=btn.onclick;
  btn.onclick=function(ev){
    const before=Object.assign({},state.skills||{});
    const r=old?old.call(this,ev):undefined;

    setTimeout(()=>{
      const after=state.skills||{};
      let gained=null,level=1;
      Object.keys(after).forEach(name=>{
        if((after[name]||0)>(before[name]||0)){
          gained=name;
          level=after[name];
        }
      });
      clearLegacySkillUiClean();
      if(gained)renderSkillLearnResultClean(gained,level);
    },30);

    return r;
  };
}

/* ---------- Battle intro: central crossed swords only ---------- */
function playBattleIntroV563(done){
  let ov=document.querySelector('#battleIntroV563');
  if(!ov){
    ov=document.createElement('div');
    ov.id='battleIntroV563';
    document.body.appendChild(ov);
  }
  ov.innerHTML='<div class="sword-center-clean">⚔️</div>';
  ov.classList.remove('active','hit');
  void ov.offsetWidth;
  ov.classList.add('active','hit');

  try{
    if(clashSe){
      clashSe.pause();
      clashSe.currentTime=0;
      const p=clashSe.play();
      if(p&&p.catch)p.catch(()=>{});
    }
  }catch(e){}

  setTimeout(()=>{
    ov.classList.remove('active','hit');
    if(done)done();
  },220);
}

/* Battle avatar: face only. */
const GRANDPA_FACE_POOL_V570=['👴','🧓','👨‍🦳','👨‍🦲'];function grandpaFaceV570(){if(typeof state.grandpaFaceIndex!=='number'){state.grandpaFaceIndex=Math.floor(Math.random()*GRANDPA_FACE_POOL_V570.length);save()}return GRANDPA_FACE_POOL_V570[state.grandpaFaceIndex%GRANDPA_FACE_POOL_V570.length]}function renderBattleGrandpaFaceOnlyClean(){const el=document.querySelector('#playerAvatar');if(el)el.innerHTML=`<span class="battle-grandpa-face-clean">${grandpaFaceV570()}</span>`;}
if(typeof renderBattle==='function'){
  const _renderBattleBaseClean=renderBattle;
  renderBattle=function(){
    const r=_renderBattleBaseClean.apply(this,arguments);
    renderBattleGrandpaFaceOnlyClean();
    return r;
  };
}

/* ---------- Owned skills collapsible ---------- */
function renderOwnedSkillsV570(){const c=$('#ownedSkillsContentV570');if(!c)return;const names=Object.keys(state.skills||{});c.innerHTML=names.length?names.map(n=>{const sk=getSkillDefClean(n);return `<div class="owned-skill-row-v570"><b>${n}${state.skills[n]>1?` Lv.${state.skills[n]}`:''}</b><div>${sk&&(sk.desc||sk.effect)?(sk.desc||sk.effect):'パッシブスキル'}</div></div>`}).join(''):'まだスキルを習得していません。';const t=$('#ownedSkillsToggleV570');if(t&&!t.dataset.bound){t.dataset.bound='1';t.onclick=()=>{const open=c.classList.contains('hidden');c.classList.toggle('hidden',!open);safeText('#ownedSkillsArrowV570',open?'▲':'▼')}}}
/* ---------- Audio options ---------- */
function applyAudioVolumesV570(){[titleBgm,menuBgm,battleBgm,forgeBgm].forEach(a=>{if(a)a.volume=audioSettingsV570.bgm});[hitSe,buttonSe,equipButtonSe,slotButtonSe,rouletteSe,slotResultSe,clashSe,castleButtonSe].forEach(a=>{if(a)a.volume=audioSettingsV570.se});const b=$('#bgmVolumeV570'),s=$('#seVolumeV570');if(b)b.value=Math.round(audioSettingsV570.bgm*100);if(s)s.value=Math.round(audioSettingsV570.se*100);safeText('#bgmVolumeValueV570',Math.round(audioSettingsV570.bgm*100));safeText('#seVolumeValueV570',Math.round(audioSettingsV570.se*100));}
function bindAudioOptionsV570(){const b=$('#bgmVolumeV570'),s=$('#seVolumeV570');if(b&&!b.dataset.bound){b.dataset.bound='1';b.oninput=()=>{audioSettingsV570.bgm=+b.value/100;localStorage.setItem(AUDIO_SETTINGS_KEY_V570,JSON.stringify(audioSettingsV570));applyAudioVolumesV570()}}if(s&&!s.dataset.bound){s.dataset.bound='1';s.oninput=()=>{audioSettingsV570.se=+s.value/100;localStorage.setItem(AUDIO_SETTINGS_KEY_V570,JSON.stringify(audioSettingsV570));applyAudioVolumesV570()}}}

/* ---------- Startup ---------- */
function initCleanBuild(){
  bindTabsClean();
  bindSkillPurchaseClean();applyAudioVolumesV570();bindAudioOptionsV570();

  const active=document.querySelector('.panel.active');
  const id=active?active.id:'equip';
  const activeBtn=document.querySelector(`.tab[data-tab="${id}"]`);

  if(id==='equip'){
    renderGrandpaStatusClean();
    renderEquip();renderOwnedSkillsV570();bindStatusButtonsV570();
  }else if(id==='gacha'){
    const hero=document.querySelector('.hero');if(hero)hero.style.display='none';
    renderSkillsClean();
  }else if(id==='forge'){
    const hero=document.querySelector('.hero');if(hero)hero.style.display='none';
  }else if(id==='battle'){
    const hero=document.querySelector('.hero');if(hero)hero.style.display='none';
  }
}
setTimeout(initCleanBuild,0);

['detailClose','helpClose','skillsClose'].forEach(id=>{const b=$('#'+id);if(b)b.onclick=()=>b.closest('.modal').classList.add('hidden')});


/* ===== BUILD 5.7.1 FINAL FIXES ===== */

/* ---------- Single persistent grandpa face ---------- */
const GRANDPA_FACE_POOL_V571=['👴','🧓','👨‍🦳','👨‍🦲'];
function ensureGrandpaFaceIndexV571(){
  if(typeof state.grandpaFaceIndex!=='number'){
    state.grandpaFaceIndex=Math.floor(Math.random()*GRANDPA_FACE_POOL_V571.length);
    save();
  }
  return state.grandpaFaceIndex;
}
function grandpaFaceV571(){
  return GRANDPA_FACE_POOL_V571[ensureGrandpaFaceIndexV571()%GRANDPA_FACE_POOL_V571.length];
}

/* ---------- Status card layout ---------- */
function renderGrandpaStatusClean(){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  hero.style.display='';
  hero.className='hero card grandpa-status-card-v571';

  hero.innerHTML=`
    <div class="grandpa-left-v571">
      <div class="grandpa-name-v571" id="playerNameDisplay">${state.playerName||'じいさん'}</div>
      <div class="grandpa-face-v571">${grandpaFaceV571()}</div>
    </div>
    <div class="grandpa-right-v571">
      <div class="grandpa-stat-line-v571"><span>HP</span><b id="hpStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>攻撃</span><b id="atkStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>防御</span><b id="defStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>速度</span><b id="spdStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>会心</span><b id="critStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>回避</span><b id="evaStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>HP吸収</span><b id="lifestealStat"></b></div>
    </div>
    <div class="grandpa-actions-v571">
      <button id="statusDetailBtn">ステータス詳細</button>
      <button id="statusHelpBtn">ヘルプ</button>
      <button id="learnedSkillsBtn">スキル</button>
    </div>`;

  const s=stats();
  safeText('#hpStat',s.hp);
  safeText('#atkStat',s.atk);
  safeText('#defStat',s.def);
  safeText('#spdStat',s.spd);
  safeText('#critStat',s.crit+'%');
  safeText('#evaStat',s.eva+'%');
  safeText('#lifestealStat',Math.round((s.lifesteal||0)*100)+'%');

  if(typeof bindStatusButtonsV570==='function') bindStatusButtonsV570();
  else if(typeof bindHeroButtonsV52==='function') bindHeroButtonsV52();
}

/* ---------- Battle face uses exactly the same face as status card ---------- */
function renderBattleGrandpaFaceOnlyClean(){
  const el=document.querySelector('#playerAvatar');
  if(el){
    el.innerHTML=`<span class="battle-grandpa-face-v571">${grandpaFaceV571()}</span>`;
  }
}
if(typeof renderBattle==='function'){
  const _renderBattle571=renderBattle;
  renderBattle=function(){
    const r=_renderBattle571.apply(this,arguments);
    renderBattleGrandpaFaceOnlyClean();
    return r;
  };
}

/* ---------- Immediate, reliable button SE ---------- */
function playGeneralButtonSEV571(){
  try{
    if(!buttonSe)return;
    buttonSe.pause();
    buttonSe.currentTime=0;
    buttonSe.playbackRate=1.08;
    if(typeof audioSettingsV570!=='undefined')buttonSe.volume=audioSettingsV570.se;
    const p=buttonSe.play();
    if(p&&p.catch)p.catch(()=>{});
  }catch(e){}
}

/* Use pointerdown so SE starts immediately on tap.
   Demon Castle keeps its dedicated SE and is excluded from normal SE. */
document.addEventListener('pointerdown',ev=>{
  const btn=ev.target.closest&&ev.target.closest('button');
  if(!btn || btn.disabled)return;
  if(btn.classList.contains('tab') && btn.dataset.tab==='battle')return;
  playGeneralButtonSEV571();
},{passive:true});

/* ---------- Options from title screen ---------- */
function openTitleOptionsV571(){
  const title=document.querySelector('#titleScreen');
  const options=document.querySelector('#options');
  if(title)title.classList.add('hidden');
  if(options){
    options.classList.add('active');
    options.style.display='block';
  }
  if(typeof bindAudioOptionsV570==='function')bindAudioOptionsV570();
  if(typeof applyAudioVolumesV570==='function')applyAudioVolumesV570();

  let close=document.querySelector('#closeTitleOptionsV571');
  if(!close && options){
    close=document.createElement('button');
    close.id='closeTitleOptionsV571';
    close.className='close-title-options-v571';
    close.textContent='閉じる';
    options.appendChild(close);
  }
  if(close){
    close.onclick=()=>{
      if(options){
        options.classList.remove('active');
        options.style.display='none';
      }
      if(title)title.classList.remove('hidden');
    };
  }
}
const titleOptionsBtnV571=document.querySelector('#titleOptionsBtnV571');
if(titleOptionsBtnV571)titleOptionsBtnV571.onclick=openTitleOptionsV571;

/* Prevent options from being treated as a normal in-game tab. */
const optionsPanelV571=document.querySelector('#options');
if(optionsPanelV571 && !optionsPanelV571.classList.contains('active')){
  optionsPanelV571.style.display='none';
}

/* Refresh status face and battle face consistency on startup. */
setTimeout(()=>{
  if(typeof state!=='undefined'){
    ensureGrandpaFaceIndexV571();
    const active=document.querySelector('.panel.active');
    if(active && active.id==='equip')renderGrandpaStatusClean();
  }
},0);


/* ===== BUILD 5.7.2 FINAL FIXES ===== */

/* ---------- Remove status skill button permanently ---------- */
function removeStatusSkillButtonV572(){
  const btn=document.querySelector('#learnedSkillsBtn');
  if(btn)btn.remove();
}

/* ---------- Rebuild status card without skill button ---------- */
function renderGrandpaStatusClean(){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  hero.style.display='';
  hero.className='hero card grandpa-status-card-v571';

  hero.innerHTML=`
    <div class="grandpa-left-v571">
      <div class="grandpa-name-v571" id="playerNameDisplay">${state.playerName||'じいさん'}</div>
      <div class="grandpa-face-v571">${grandpaFaceV571()}</div>
    </div>
    <div class="grandpa-right-v571">
      <div class="grandpa-stat-line-v571"><span>HP</span><b id="hpStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>攻撃</span><b id="atkStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>防御</span><b id="defStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>速度</span><b id="spdStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>会心</span><b id="critStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>回避</span><b id="evaStat"></b></div>
      <div class="grandpa-stat-line-v571"><span>HP吸収</span><b id="lifestealStat"></b></div>
    </div>
    <div class="grandpa-actions-v572">
      <button id="statusDetailBtn">ステータス詳細</button>
      <button id="statusHelpBtn">ヘルプ</button>
    </div>`;

  const s=stats();
  safeText('#hpStat',s.hp);
  safeText('#atkStat',s.atk);
  safeText('#defStat',s.def);
  safeText('#spdStat',s.spd);
  safeText('#critStat',s.crit+'%');
  safeText('#evaStat',s.eva+'%');
  safeText('#lifestealStat',Math.round((s.lifesteal||0)*100)+'%');

  if(typeof bindStatusButtonsV570==='function')bindStatusButtonsV570();
}

/* ---------- Title options works reliably ---------- */
function closeTitleOptionsV572(){
  const title=document.querySelector('#titleScreen');
  const options=document.querySelector('#options');
  if(options){
    options.classList.remove('active');
    options.style.display='none';
  }
  if(title){
    title.classList.remove('hidden');
    title.style.display='';
  }
}

function openTitleOptionsV571(){
  const title=document.querySelector('#titleScreen');
  const options=document.querySelector('#options');
  if(!options)return;

  if(title){
    title.classList.add('hidden');
    title.style.display='none';
  }

  options.classList.add('active');
  options.style.display='block';

  if(typeof bindAudioOptionsV570==='function')bindAudioOptionsV570();
  if(typeof applyAudioVolumesV570==='function')applyAudioVolumesV570();

  let close=document.querySelector('#closeTitleOptionsV571');
  if(!close){
    close=document.createElement('button');
    close.id='closeTitleOptionsV571';
    close.className='primary title-main-btn-v572 close-title-options-v572';
    close.textContent='閉じる';
    options.appendChild(close);
  }
  close.onclick=closeTitleOptionsV572;
}

/* Bind after DOM is ready and overwrite any broken handler. */
setTimeout(()=>{
  const btn=document.querySelector('#titleOptionsBtnV571');
  if(btn){
    btn.className='primary title-main-btn-v572';
    btn.onclick=(e)=>{
      try{e.preventDefault()}catch(_){}
      openTitleOptionsV571();
    };
  }
},0);

/* ---------- Battle grandpa: exact same face as status, no equipment ---------- */
function forceBattleFaceV572(){
  const el=document.querySelector('#playerAvatar');
  if(!el)return;
  el.className='battle-avatar-v572';
  el.innerHTML=`<span class="battle-grandpa-face-v572">${grandpaFaceV571()}</span>`;
}

/* Hook all known battle render/update paths. */
if(typeof renderBattle==='function'){
  const baseRenderBattleV572=renderBattle;
  renderBattle=function(){
    const r=baseRenderBattleV572.apply(this,arguments);
    forceBattleFaceV572();
    return r;
  };
}
if(typeof startBattle==='function'){
  const baseStartBattleV572=startBattle;
  startBattle=function(){
    const r=baseStartBattleV572.apply(this,arguments);
    setTimeout(forceBattleFaceV572,0);
    return r;
  };
}

/* Mutation observer ensures legacy code cannot reinsert equipment emojis. */
const battleAvatarObserverV572=new MutationObserver(()=>{
  const el=document.querySelector('#playerAvatar');
  if(!el)return;
  const desired=grandpaFaceV571();
  if(el.textContent.trim()!==desired || el.querySelectorAll('*').length!==1){
    el.innerHTML=`<span class="battle-grandpa-face-v572">${desired}</span>`;
  }
});
setTimeout(()=>{
  const el=document.querySelector('#playerAvatar');
  if(el){
    battleAvatarObserverV572.observe(el,{childList:true,subtree:true,characterData:true});
    forceBattleFaceV572();
  }
},0);

/* ---------- Remove current equipment window if legacy renderer recreates it ---------- */
function removeCurrentEquipmentWindowV572(){
  document.querySelectorAll('h2').forEach(h=>{
    if((h.textContent||'').trim()==='現在の装備'){
      const card=h.closest('section,.card,div');
      if(card && card!==document.body)card.remove();
    }
  });
}
if(typeof renderEquip==='function'){
  const baseRenderEquipV572=renderEquip;
  renderEquip=function(){
    const r=baseRenderEquipV572.apply(this,arguments);
    removeCurrentEquipmentWindowV572();
    removeStatusSkillButtonV572();
    return r;
  };
}

setTimeout(()=>{
  removeCurrentEquipmentWindowV572();
  removeStatusSkillButtonV572();
},0);
