const ITEMS = [
 {id:'w0',type:'weapon',name:'木の棒',price:0,atk:4,spd:0,crit:0,desc:'最初の相棒'},
 {id:'w1',type:'weapon',name:'鉄の剣',price:120,atk:14,spd:0,crit:2,desc:'扱いやすい定番武器'},
 {id:'w2',type:'weapon',name:'疾風の短剣',price:330,atk:11,spd:28,crit:8,desc:'手数と会心重視'},
 {id:'w3',type:'weapon',name:'巨人の大剣',price:760,atk:38,spd:-18,crit:4,desc:'遅いが一撃が重い'},
 {id:'w4',type:'weapon',name:'魔剣グランデル',price:2200,atk:72,spd:5,crit:12,desc:'魔王城で鍛えられた魔剣'},
 {id:'s0',type:'shield',name:'木の盾',price:0,def:3,eva:0,desc:'頼りないが軽い'},
 {id:'s1',type:'shield',name:'鉄の盾',price:140,def:10,eva:-1,desc:'堅実な防御'},
 {id:'s2',type:'shield',name:'軽羽の盾',price:420,def:6,eva:8,desc:'回避を重視'},
 {id:'s3',type:'shield',name:'竜鱗の盾',price:1200,def:24,eva:2,desc:'高い防御性能'},
 {id:'a0',type:'armor',name:'布の服',price:0,hp:35,def:0,desc:'いつもの作業着'},
 {id:'a1',type:'armor',name:'鎖帷子',price:180,hp:70,def:6,desc:'旅人向けの鎧'},
 {id:'a2',type:'armor',name:'軽騎士の鎧',price:520,hp:95,def:10,spd:8,desc:'動きやすい'},
 {id:'a3',type:'armor',name:'炎竜鎧',price:1500,hp:180,def:22,desc:'重厚な伝説級防具'},
 {id:'x0',type:'accessory',name:'古びたお守り',price:0,crit:1,eva:1,desc:'じいさんの宝物'},
 {id:'x1',type:'accessory',name:'幸運のお守り',price:260,crit:10,desc:'会心率アップ'},
 {id:'x2',type:'accessory',name:'疾風の指輪',price:500,spd:24,eva:4,desc:'攻撃速度アップ'},
 {id:'x3',type:'accessory',name:'吸血の指輪',price:1300,lifesteal:0.12,desc:'与ダメージの12%回復'},
 {id:'x4',type:'accessory',name:'復活の石',price:2800,revive:1,desc:'戦闘中1度だけHP40%で復活'}
];
const TYPE_LABEL={weapon:'武器',shield:'盾',armor:'鎧',accessory:'アクセサリー'};
const ENEMIES=[
 {name:'スライム',avatar:'🟢',hp:45,atk:8,def:1,spd:35,reward:25},
 {name:'ゴブリン',avatar:'👺',hp:70,atk:12,def:3,spd:42,reward:38},
 {name:'オーク',avatar:'🐗',hp:110,atk:18,def:6,spd:32,reward:55},
 {name:'骸骨騎士',avatar:'💀',hp:150,atk:24,def:10,spd:46,reward:75},
 {name:'魔導師',avatar:'🧙',hp:190,atk:32,def:8,spd:54,reward:100},
 {name:'ドラゴン',avatar:'🐉',hp:300,atk:44,def:15,spd:40,reward:150}
];
let state=load()||{gold:200,level:1,maxFloor:0,selectedFloor:1,owned:['w0','s0','a0','x0'],equipped:{weapon:'w0',shield:'s0',armor:'a0',accessory:'x0'}};
let battle=null;
let battleTimer=null;
let cooldowns={power:0,dodge:0,throw:0};

function save(){localStorage.setItem('grandpaDemonSave',JSON.stringify(state));}
function load(){try{return JSON.parse(localStorage.getItem('grandpaDemonSave'));}catch{return null;}}
function item(id){return ITEMS.find(x=>x.id===id);}
function stats(){
 const s={hp:120+state.level*8,atk:10+state.level*2,def:4+state.level,spd:50,crit:5,eva:3,lifesteal:0,revive:0};
 Object.values(state.equipped).map(item).forEach(it=>{if(!it)return;['hp','atk','def','spd','crit','eva','lifesteal','revive'].forEach(k=>s[k]+=it[k]||0)});
 s.atk=Math.round(s.atk*1.1); s.def=Math.round(s.def*1.1); // 武器屋の眼力
 return s;
}
function render(){
 document.querySelector('#gold').textContent=state.gold;
 document.querySelector('#level').textContent=state.level;
 const s=stats();
 hpStat.textContent=s.hp; atkStat.textContent=s.atk; defStat.textContent=s.def; spdStat.textContent=s.spd; critStat.textContent=s.crit+'%'; evaStat.textContent=s.eva+'%';
 maxFloor.textContent=state.maxFloor; selectedFloor.textContent=state.selectedFloor;
 renderShop(); renderEquip(); save();
}
function renderShop(){
 const root=document.querySelector('#shop'); root.innerHTML='';
 for(const t of Object.keys(TYPE_LABEL)){
  const sec=document.createElement('div'); sec.className='card shop-section'; sec.innerHTML=`<h3>${TYPE_LABEL[t]}</h3>`;
  ITEMS.filter(x=>x.type===t).forEach(it=>{
   const owned=state.owned.includes(it.id); const row=document.createElement('div'); row.className='item'+(owned?' owned':'');
   row.innerHTML=`<div><div class="item-title">${it.name}</div><div class="item-meta">${it.desc}｜${summary(it)}</div></div><button>${owned?'所持済み':it.price+' G'}</button>`;
   row.querySelector('button').disabled=owned; row.querySelector('button').onclick=()=>buy(it.id); sec.appendChild(row);
  }); root.appendChild(sec);
 }
}
function summary(it){return [['HP',it.hp],['攻',it.atk],['防',it.def],['速',it.spd],['会心',it.crit],['回避',it.eva]].filter(x=>x[1]).map(x=>x[0]+(x[1]>0?'+':'')+x[1]).join(' / ')||'特殊装備';}
function buy(id){const it=item(id);if(state.gold<it.price)return alert('ゴールドが足りません');state.gold-=it.price;state.owned.push(id);state.equipped[it.type]=id;render();}
function renderEquip(){
 equipSlots.innerHTML=''; Object.keys(TYPE_LABEL).forEach(t=>{const it=item(state.equipped[t]);equipSlots.insertAdjacentHTML('beforeend',`<div class="equip-slot"><div class="slot-label">${TYPE_LABEL[t]}</div><div class="slot-name">${it.name}</div></div>`)});
 inventory.innerHTML=''; Object.keys(TYPE_LABEL).forEach(t=>{const g=document.createElement('div');g.className='inventory-group';g.innerHTML=`<h4>${TYPE_LABEL[t]}</h4>`;state.owned.map(item).filter(x=>x.type===t).forEach(it=>{const r=document.createElement('div');r.className='inventory-item';r.innerHTML=`<div><b>${it.name}</b><div class="item-meta">${summary(it)}</div></div><button>${state.equipped[t]===it.id?'装備中':'装備'}</button>`;r.querySelector('button').disabled=state.equipped[t]===it.id;r.querySelector('button').onclick=()=>{state.equipped[t]=it.id;render()};g.appendChild(r)});inventory.appendChild(g)});
}
function enemyForFloor(f){
 if(f>=30)return {name:'魔王',avatar:'😈',hp:1800+(f-30)*100,atk:80+(f-30)*3,def:28,spd:48,reward:2000};
 const base=ENEMIES[Math.min(ENEMIES.length-1,Math.floor((f-1)/5))]; const mult=1+(f-1)*0.13;
 return {...base,hp:Math.round(base.hp*mult),atk:Math.round(base.atk*(1+(f-1)*0.09)),def:Math.round(base.def*(1+(f-1)*0.07)),reward:Math.round(base.reward*mult)};
}
function startBattle(){
 clearInterval(battleTimer); const ps=stats(), en=enemyForFloor(state.selectedFloor);
 battle={floor:state.selectedFloor,p:{...ps,maxHp:ps.hp,currentHp:ps.hp,next:0,powerUntil:0,dodgeReady:false,revived:false},e:{...en,maxHp:en.hp,currentHp:en.hp,next:0},tick:0};cooldowns={power:0,dodge:0,throw:0};battleArea.classList.remove('hidden');enemyName.textContent=en.name;enemyAvatar.textContent=en.avatar;battleLog.innerHTML='';log(`第${battle.floor}階、${en.name}が現れた！`);updateBattleUI();battleTimer=setInterval(stepBattle,100);
}
function stepBattle(){if(!battle)return;battle.tick+=100;for(const k in cooldowns)cooldowns[k]=Math.max(0,cooldowns[k]-100);battle.p.next-=100;battle.e.next-=100;if(battle.p.next<=0){playerAttack();battle.p.next=100000/(battle.p.spd*(battle.p.powerUntil>battle.tick?1.6:1));}if(battle&&battle.e.next<=0){enemyAttack();if(battle)battle.e.next=100000/battle.e.spd;}updateBattleUI();}
function playerAttack(extra=1){if(!battle)return;const p=battle.p,e=battle.e;let dmg=Math.max(1,Math.round(p.atk*extra-e.def*.55));if(Math.random()*100<p.crit){dmg=Math.round(dmg*1.8);log('💥 会心の一撃！');}if(Math.random()<.08){dmg*=2;log('🔨 職人魂が炸裂！');}e.currentHp-=dmg;if(p.lifesteal)p.currentHp=Math.min(p.maxHp,p.currentHp+Math.round(dmg*p.lifesteal));log(`じいさんの攻撃！ ${dmg}ダメージ`);if(e.currentHp<=0)win();}
function enemyAttack(){if(!battle)return;const p=battle.p,e=battle.e;if(p.dodgeReady){p.dodgeReady=false;log('👁 長年の勘で完全回避！');return;}if(Math.random()*100<p.eva+5){log('💨 じいさんは攻撃をかわした！');return;}let dmg=Math.max(1,Math.round(e.atk-p.def*.5));p.currentHp-=dmg;log(`${e.name}の攻撃！ ${dmg}ダメージ`);if(p.currentHp<=0){if(p.revive>0&&!p.revived){p.revived=true;p.currentHp=Math.round(p.maxHp*.4);log('✨ 復活の石が光った！');}else lose();}}
function win(){const f=battle.floor,reward=battle.e.reward;clearInterval(battleTimer);battleTimer=null;state.gold+=reward;state.maxFloor=Math.max(state.maxFloor,f);state.level=1+Math.floor(state.maxFloor/3);if(f<30)state.selectedFloor=Math.min(30,f+1);log(`🏆 勝利！ ${reward}Gを獲得！`);if(f>=30)log('👑 魔王討伐成功！ じいさんは伝説になった。');battle=null;render();updateBattleUI();}
function lose(){clearInterval(battleTimer);battleTimer=null;log('💀 じいさんは力尽きた……。装備を整えて再挑戦しよう。');battle=null;updateBattleUI();}
function useSkill(type){if(!battle||cooldowns[type]>0)return;if(type==='power'){battle.p.powerUntil=battle.tick+8000;cooldowns.power=15000;log('🔥 じいさんが本気を出した！');}if(type==='dodge'){battle.p.dodgeReady=true;cooldowns.dodge=12000;log('👁 長年の勘を研ぎ澄ませた！');}if(type==='throw'){cooldowns.throw=18000;log('⚔ 店の商品じゃ！');playerAttack(2.8);}updateBattleUI();}
function updateBattleUI(){const active=!!battle;[skillPower,skillDodge,skillThrow].forEach(b=>b.disabled=!active);if(!active)return;const p=battle.p,e=battle.e;playerHpBar.style.width=Math.max(0,p.currentHp/p.maxHp*100)+'%';enemyHpBar.style.width=Math.max(0,e.currentHp/e.maxHp*100)+'%';playerHpText.textContent=`${Math.max(0,Math.round(p.currentHp))} / ${p.maxHp}`;enemyHpText.textContent=`${Math.max(0,Math.round(e.currentHp))} / ${e.maxHp}`;skillPower.textContent=`🔥 本気を出す${cooldowns.power?` (${Math.ceil(cooldowns.power/1000)})`:''}`;skillDodge.textContent=`👁 長年の勘${cooldowns.dodge?` (${Math.ceil(cooldowns.dodge/1000)})`:''}`;skillThrow.textContent=`⚔ 店の商品じゃ！${cooldowns.throw?` (${Math.ceil(cooldowns.throw/1000)})`:''}`;skillPower.disabled=cooldowns.power>0;skillDodge.disabled=cooldowns.dodge>0;skillThrow.disabled=cooldowns.throw>0;}
function log(t){battleLog.insertAdjacentHTML('beforeend',`<p>${t}</p>`);battleLog.scrollTop=battleLog.scrollHeight;}

document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector('#'+b.dataset.tab).classList.add('active')});
minusFloor.onclick=()=>{state.selectedFloor=Math.max(1,state.selectedFloor-1);render()};plusFloor.onclick=()=>{state.selectedFloor=Math.min(30,Math.max(state.maxFloor+1,1),state.selectedFloor+1);render()};startBattle.onclick=startBattle;skillPower.onclick=()=>useSkill('power');skillDodge.onclick=()=>useSkill('dodge');skillThrow.onclick=()=>useSkill('throw');resetSave.onclick=()=>{if(confirm('本当にセーブデータを初期化しますか？')){localStorage.removeItem('grandpaDemonSave');location.reload();}};
if ('serviceWorker' in navigator) {
  let refreshing = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            worker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update();
      });
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  });
}
render();
