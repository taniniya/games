(() => {
  const GAME_META = {
    game01: ["Neon Reflex", "緑に変わった瞬間をクリック。"],
    game02: ["Code Break 100", "1〜100の数字を最短で当てる。"],
    game03: ["Tic Tac Master", "CPUと三目並べ。"],
    game04: ["Emoji Memory", "同じ絵文字を2枚そろえる。"],
    game05: ["RPS Arena", "じゃんけん5本勝負。"],
    game06: ["Word Hang", "英単語を推理して完成させる。"],
    game07: ["Math Rush", "30秒で式を解き続ける。"],
    game08: ["Pulse Simon", "光った順番を記憶する。"],
    game09: ["Mole Strike", "30秒モグラたたき。"],
    game10: ["Type Sprint", "文章を正確に高速入力。"],
    game11: ["Color Trap", "文字の意味ではなく色を選ぶ。"],
    game12: ["Lane Dodge", "左右移動で障害物を回避。"],
    game13: ["Mini Maze", "矢印キーで迷路を突破。"],
    game14: ["Slide 8", "3x3スライドパズルを完成。"],
    game15: ["High or Low", "次カードが高いか低いか。"],
    game16: ["Lights Out", "全部の灯りを消す。"],
    game17: ["Mine Scout", "地雷を避けて全安全マスを開く。"],
    game18: ["Quick Quiz", "10問連続の4択クイズ。"],
    game19: ["Pattern Lock", "パターンを再現し続ける。"],
    game20: ["Comet Click", "動く彗星をクリックして得点。"],
  };

  const app = document.getElementById("app");
  const id = document.body.dataset.game;
  if (!app || !id || !GAME_META[id]) return;

  const [title, desc] = GAME_META[id];

  function ui(inner) {
    app.innerHTML = `<h2>${title}</h2><p>${desc}</p>${inner}`;
  }

  const rnd = (n) => Math.floor(Math.random() * n);
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const G = {
    game01() {
      ui(`<div class="row"><button id="s">スタート</button><button id="r" class="alt">リセット</button></div><div id="box" class="big-box">待機中</div><div class="status" id="st"></div>`);
      const s = document.getElementById("s"), r = document.getElementById("r"), box = document.getElementById("box"), st = document.getElementById("st");
      let t = null, ready = false, start = 0, best = null;
      s.onclick = () => {
        clearTimeout(t); ready = false; box.classList.remove("ready"); box.textContent = "待って..."; st.textContent = "";
        t = setTimeout(() => { ready = true; start = performance.now(); box.classList.add("ready"); box.textContent = "NOW!"; }, 900 + rnd(2200));
      };
      r.onclick = () => { clearTimeout(t); ready = false; best = null; box.classList.remove("ready"); box.textContent = "待機中"; st.textContent = ""; };
      box.onclick = () => {
        if (ready) {
          const ms = Math.floor(performance.now() - start); best = best == null ? ms : Math.min(best, ms); ready = false;
          box.classList.remove("ready"); box.textContent = "もう一回"; st.textContent = `今回 ${ms}ms / ベスト ${best}ms`;
        } else if (box.textContent === "待って...") {
          clearTimeout(t); box.textContent = "フライング"; st.textContent = "早すぎ";
        }
      };
    },

    game02() {
      ui(`<div class="row"><input id="inp" type="number" min="1" max="100" placeholder="1〜100"><button id="go">予想</button><button id="new" class="alt">新ゲーム</button></div><div class="status" id="st"></div>`);
      const inp = document.getElementById("inp"), go = document.getElementById("go"), nw = document.getElementById("new"), st = document.getElementById("st");
      let ans = rnd(100) + 1, c = 0;
      const reset = () => { ans = rnd(100) + 1; c = 0; inp.value = ""; st.textContent = "開始"; };
      go.onclick = () => {
        const n = +inp.value;
        if (!Number.isInteger(n) || n < 1 || n > 100) return void (st.textContent = "1〜100の整数");
        c++;
        st.textContent = n === ans ? `正解 ${c}回` : n < ans ? `${c}回目: もっと大きい` : `${c}回目: もっと小さい`;
      };
      nw.onclick = reset;
      reset();
    },

    game03() {
      ui(`<div id="b" class="grid-3"></div><div class="status" id="st"></div><button id="re" class="alt">リセット</button>`);
      const b = document.getElementById("b"), st = document.getElementById("st"), re = document.getElementById("re");
      let cells, end;
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      const win = (ch) => lines.some(([a,c,d]) => cells[a]===ch && cells[c]===ch && cells[d]===ch);
      const render = () => {
        b.innerHTML = "";
        cells.forEach((v,i)=>{
          const bt=document.createElement("button"); bt.textContent=v; bt.style.aspectRatio="1"; bt.style.fontSize="1.4rem"; bt.disabled=!!v||end;
          bt.onclick=()=>move(i); b.appendChild(bt);
        });
      };
      const move = (i) => {
        if (cells[i]||end) return;
        cells[i]="X";
        if (win("X")) { st.textContent="勝ち"; end=true; return render(); }
        if (!cells.includes("")) { st.textContent="引き分け"; end=true; return render(); }
        const em = cells.map((v,k)=>v===""?k:-1).filter(v=>v>=0); cells[em[rnd(em.length)]]="O";
        if (win("O")) { st.textContent="CPU勝ち"; end=true; }
        else if (!cells.includes("")) { st.textContent="引き分け"; end=true; }
        else st.textContent="あなたの番";
        render();
      };
      const init = () => { cells=Array(9).fill(""); end=false; st.textContent="あなたの番"; render(); };
      re.onclick=init; init();
    },

    game04() {
      ui(`<div id="b" class="grid-4"></div><div class="status" id="st"></div><button id="re" class="alt">シャッフル</button>`);
      const b=document.getElementById("b"), st=document.getElementById("st"), re=document.getElementById("re");
      const icons=["🍩","🚀","🎈","🎲","🍕","🧩","🐧","⚡"];
      let deck=[], open=[], lock=false, turn=0;
      const render=()=>{
        b.innerHTML="";
        deck.forEach((c,i)=>{
          const bt=document.createElement("button"); bt.textContent=(c.o||c.d)?c.i:"■"; bt.disabled=c.o||c.d||lock; bt.style.aspectRatio="1";
          bt.className=(c.o||c.d)?"alt":""; bt.onclick=()=>flip(i); b.appendChild(bt);
        });
      };
      const flip=(i)=>{
        if(lock||deck[i].o||deck[i].d) return;
        deck[i].o=true; open.push(i); render();
        if(open.length<2) return;
        turn++; const [a,c]=open;
        if(deck[a].i===deck[c].i){ deck[a].d=deck[c].d=true; deck[a].o=deck[c].o=false; open=[]; st.textContent=`${turn}ターン`; if(deck.every(v=>v.d)) st.textContent=`クリア ${turn}ターン`; render(); }
        else{ lock=true; setTimeout(()=>{ deck[a].o=deck[c].o=false; open=[]; lock=false; st.textContent=`${turn}ターン`; render(); },550); }
      };
      const init=()=>{ turn=0; open=[]; lock=false; deck=shuffle([...icons,...icons]).map(i=>({i,o:false,d:false})); st.textContent="0ターン"; render(); };
      re.onclick=init; init();
    },

    game05() {
      ui(`<div class="row"><button data-m="✊">✊</button><button data-m="✌">✌</button><button data-m="✋">✋</button><button id="re" class="alt">リセット</button></div><div class="status" id="st"></div>`);
      const st=document.getElementById("st"), re=document.getElementById("re");
      let you=0, cpu=0, round=0;
      const beat={"✊":"✌","✌":"✋","✋":"✊"};
      document.querySelectorAll("button[data-m]").forEach(b=>b.onclick=()=>{
        if(round>=5) return;
        const y=b.dataset.m, c=["✊","✌","✋"][rnd(3)]; round++;
        if(y!==c){ if(beat[y]===c) you++; else cpu++; }
        st.textContent=`${round}/5 あなた:${you} CPU:${cpu} (${y} vs ${c})`;
        if(round===5) st.textContent += you===cpu?" 引き分け":you>cpu?" 勝利":" 敗北";
      });
      re.onclick=()=>{ you=0; cpu=0; round=0; st.textContent="5本勝負"; }; re.onclick();
    },

    game06() {
      ui(`<div class="status" id="word"></div><div class="row"><input id="ch" maxlength="1" placeholder="a-z"><button id="go">入力</button><button id="re" class="alt">新単語</button></div><div class="status" id="st"></div>`);
      const words=["planet","galaxy","rocket","banana","castle","wizard","shadow","signal","puzzle","vector"];
      const wv=document.getElementById("word"), ch=document.getElementById("ch"), go=document.getElementById("go"), re=document.getElementById("re"), st=document.getElementById("st");
      let ans="", open=[], miss=0;
      const render=()=>{ wv.textContent=ans.split("").map(c=>open.includes(c)?c:"_").join(" "); st.textContent=`ミス ${miss}/6`; if(ans.split("").every(c=>open.includes(c))) st.textContent="クリア"; if(miss>=6) st.textContent=`ゲームオーバー 正解:${ans}`; };
      go.onclick=()=>{
        const c=ch.value.toLowerCase(); ch.value="";
        if(!/^[a-z]$/.test(c)||miss>=6||ans.split("").every(v=>open.includes(v))) return;
        if(ans.includes(c)) { if(!open.includes(c)) open.push(c); }
        else miss++;
        render();
      };
      const init=()=>{ ans=words[rnd(words.length)]; open=[]; miss=0; render(); };
      re.onclick=init; init();
    },

    game07() {
      ui(`<div class="status" id="q"></div><div class="row"><input id="a" type="number" placeholder="答え"><button id="go">回答</button><button id="stb" class="alt">開始</button></div><div class="status" id="st"></div>`);
      const q=document.getElementById("q"), a=document.getElementById("a"), go=document.getElementById("go"), stb=document.getElementById("stb"), st=document.getElementById("st");
      let x=0,y=0,op="+",ans=0,score=0,left=30,t=null,run=false;
      const next=()=>{ x=rnd(20)+1; y=rnd(20)+1; op=["+","-","*"][rnd(3)]; ans=op==="+"?x+y:op==="-"?x-y:x*y; q.textContent=`${x} ${op} ${y} = ?`; };
      const stop=()=>{ run=false; clearInterval(t); st.textContent=`終了 スコア:${score}`; };
      stb.onclick=()=>{ score=0; left=30; run=true; st.textContent="30秒スタート"; next(); clearInterval(t); t=setInterval(()=>{ left--; st.textContent=`残り${left}s スコア:${score}`; if(left<=0) stop(); },1000); };
      go.onclick=()=>{ if(!run) return; if(+a.value===ans) score++; a.value=""; next(); };
    },

    game08() {
      ui(`<div class="row"><button id="start">スタート</button><button id="re" class="alt">リセット</button></div><div class="row" id="pads"></div><div class="status" id="st"></div>`);
      const colors=["#ef4444","#22c55e","#3b82f6","#f59e0b"];
      const pads=document.getElementById("pads"), st=document.getElementById("st"), start=document.getElementById("start"), re=document.getElementById("re");
      let seq=[], inx=0, can=false, level=0;
      colors.forEach((c,i)=>{ const b=document.createElement("button"); b.className="pad alt"; b.style.background=c; b.style.opacity=".55"; b.dataset.i=i; pads.appendChild(b); });
      const all=[...pads.children];
      const flash=(i)=>new Promise(res=>{ all[i].style.opacity="1"; setTimeout(()=>{ all[i].style.opacity=".55"; res(); },320); });
      const show=async()=>{ can=false; for(const i of seq){ await flash(i); await new Promise(r=>setTimeout(r,120)); } can=true; inx=0; st.textContent=`Level ${level}`; };
      const next=()=>{ seq.push(rnd(4)); level=seq.length; show(); };
      all.forEach((b)=>b.onclick=async()=>{
        if(!can) return;
        const i=+b.dataset.i; await flash(i);
        if(i!==seq[inx]){ st.textContent=`失敗 Level ${level}`; can=false; return; }
        inx++; if(inx===seq.length) setTimeout(next,300);
      });
      start.onclick=()=>{ seq=[]; next(); };
      re.onclick=()=>{ seq=[]; level=0; can=false; st.textContent="スタートを押す"; };
      re.onclick();
    },

    game09() {
      ui(`<div class="row"><button id="start">開始</button><button id="re" class="alt">リセット</button></div><div id="g" class="grid-4"></div><div class="status" id="st"></div>`);
      const g=document.getElementById("g"), st=document.getElementById("st"), start=document.getElementById("start"), re=document.getElementById("re");
      let score=0,time=30,live=-1,t1=null,t2=null,run=false;
      const cells=[...Array(16)].map(()=>{ const b=document.createElement("button"); b.style.aspectRatio="1"; b.className="alt"; b.textContent="-"; g.appendChild(b); return b; });
      cells.forEach((b,i)=>b.onclick=()=>{ if(run&&i===live){ score++; live=-1; paint(); } });
      const paint=()=>cells.forEach((b,i)=>{ b.textContent=i===live?"🐹":"-"; b.style.background=i===live?"#fbbf24":"#2a3d73"; });
      const stop=()=>{ run=false; clearInterval(t1); clearInterval(t2); live=-1; paint(); st.textContent=`終了 スコア:${score}`; };
      start.onclick=()=>{ score=0; time=30; run=true; st.textContent="30秒"; paint(); clearInterval(t1); clearInterval(t2); t1=setInterval(()=>{ time--; st.textContent=`残り${time}s スコア:${score}`; if(time<=0) stop(); },1000); t2=setInterval(()=>{ live=rnd(16); paint(); },550); };
      re.onclick=()=>{ stop(); st.textContent="開始を押す"; };
      re.onclick();
    },

    game10() {
      ui(`<div class="status" id="target"></div><div class="row"><input id="in" placeholder="ここに入力" style="min-width:220px;"><button id="start">開始</button><button id="re" class="alt">リセット</button></div><div class="status" id="st"></div>`);
      const lines=["speed makes skills sharp","small steps build huge results","practice beats talent daily","focus on clean and correct typing","challenge accepted now type fast"];
      const target=document.getElementById("target"), input=document.getElementById("in"), start=document.getElementById("start"), re=document.getElementById("re"), st=document.getElementById("st");
      let goal="", t0=0, run=false;
      const init=()=>{ goal=lines[rnd(lines.length)]; target.textContent=goal; input.value=""; st.textContent="開始を押す"; run=false; };
      start.onclick=()=>{ if(!run){ run=true; t0=performance.now(); st.textContent="入力中"; input.focus(); } };
      input.oninput=()=>{
        if(!run) return;
        const v=input.value;
        if(goal.startsWith(v)) st.textContent=`${v.length}/${goal.length}`;
        else st.textContent="ミスあり";
        if(v===goal){ const sec=(performance.now()-t0)/1000; const wpm=Math.round(goal.split(" ").length/sec*60); st.textContent=`完了 ${sec.toFixed(2)}s / ${wpm} wpm`; run=false; }
      };
      re.onclick=init; init();
    },

    game11() {
      ui(`<div class="status" id="q" style="font-size:2rem;font-weight:800;"></div><div class="row" id="opts"></div><div class="status" id="st"></div><button id="re" class="alt">再開</button>`);
      const names=["赤","青","緑","黄"], colors=["#ef4444","#3b82f6","#22c55e","#eab308"];
      const q=document.getElementById("q"), opts=document.getElementById("opts"), st=document.getElementById("st"), re=document.getElementById("re");
      let score=0,left=20,ans=0,t=null,run=false;
      const mk=()=>{
        const word=rnd(4), ink=rnd(4); ans=ink;
        q.textContent=names[word]; q.style.color=colors[ink];
      };
      colors.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=names[i]; b.style.background=c; b.onclick=()=>{ if(!run) return; if(i===ans) score++; mk(); st.textContent=`残り${left}s スコア:${score}`; }; opts.appendChild(b); });
      const start=()=>{ score=0; left=20; run=true; mk(); clearInterval(t); t=setInterval(()=>{ left--; st.textContent=`残り${left}s スコア:${score}`; if(left<=0){ run=false; clearInterval(t); st.textContent=`終了 スコア:${score}`; } },1000); };
      re.onclick=start; start();
    },

    game12() {
      ui(`<canvas id="cv" width="420" height="520"></canvas><div class="row"><button id="start">開始</button><button id="re" class="alt">リセット</button></div><div class="status" id="st"></div><p>← → キーで移動</p>`);
      const cv=document.getElementById("cv"), ctx=cv.getContext("2d"), st=document.getElementById("st"), start=document.getElementById("start"), re=document.getElementById("re");
      const lanes=[90,210,330];
      let player=1, obs=[], frame=0, score=0, run=false, raf=0;
      const spawn=()=>obs.push({lane:rnd(3), y:-40, v:4+rnd(4)});
      const draw=()=>{
        ctx.clearRect(0,0,cv.width,cv.height);
        ctx.fillStyle="#0f1d3d"; ctx.fillRect(0,0,cv.width,cv.height);
        ctx.strokeStyle="#38508d"; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(140,0); ctx.lineTo(140,520); ctx.moveTo(280,0); ctx.lineTo(280,520); ctx.stroke();
        ctx.fillStyle="#22d3ee"; ctx.fillRect(lanes[player]-24,470,48,36);
        ctx.fillStyle="#fb7185";
        for(const o of obs) ctx.fillRect(lanes[o.lane]-24,o.y,48,32);
      };
      const loop=()=>{
        if(!run) return;
        frame++; score++; if(frame%34===0) spawn();
        obs.forEach(o=>o.y+=o.v); obs=obs.filter(o=>o.y<560);
        if(obs.some(o=>o.lane===player && o.y>438 && o.y<504)){ run=false; st.textContent=`衝突 スコア:${score}`; draw(); return; }
        st.textContent=`スコア:${score}`; draw(); raf=requestAnimationFrame(loop);
      };
      const init=()=>{ cancelAnimationFrame(raf); player=1; obs=[]; frame=0; score=0; run=false; st.textContent="開始を押す"; draw(); };
      window.addEventListener("keydown", (e)=>{ if(!run) return; if(e.key==="ArrowLeft") player=Math.max(0,player-1); if(e.key==="ArrowRight") player=Math.min(2,player+1); });
      start.onclick=()=>{ if(run) return; run=true; loop(); };
      re.onclick=init; init();
    },

    game13() {
      ui(`<canvas id="cv" width="420" height="420"></canvas><div class="status" id="st"></div><button id="re" class="alt">リセット</button><p>矢印キーで緑から金へ移動</p>`);
      const map=[
        "1111111111",
        "1000000001",
        "1011111101",
        "1010000101",
        "1010110101",
        "1010100101",
        "1010101101",
        "1010100001",
        "1000111111",
        "1111111111"
      ];
      const cell=42, cv=document.getElementById("cv"), ctx=cv.getContext("2d"), st=document.getElementById("st"), re=document.getElementById("re");
      let p={x:1,y:1}, goal={x:8,y:7}, move=0;
      const draw=()=>{
        for(let y=0;y<10;y++) for(let x=0;x<10;x++){
          ctx.fillStyle=map[y][x]==="1"?"#1f2f57":"#0c1834"; ctx.fillRect(x*cell,y*cell,cell-1,cell-1);
        }
        ctx.fillStyle="#22c55e"; ctx.fillRect(p.x*cell+10,p.y*cell+10,22,22);
        ctx.fillStyle="#fbbf24"; ctx.fillRect(goal.x*cell+10,goal.y*cell+10,22,22);
      };
      const init=()=>{ p={x:1,y:1}; move=0; st.textContent="0手"; draw(); };
      window.addEventListener("keydown", (e)=>{
        const d={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];
        if(!d) return; const nx=p.x+d[0], ny=p.y+d[1];
        if(map[ny]?.[nx]!=="0") return;
        p={x:nx,y:ny}; move++; st.textContent=`${move}手`; draw();
        if(nx===goal.x&&ny===goal.y) st.textContent=`クリア ${move}手`;
      });
      re.onclick=init; init();
    },

    game14() {
      ui(`<div id="b" class="grid-3"></div><div class="status" id="st"></div><button id="re" class="alt">シャッフル</button>`);
      const b=document.getElementById("b"), st=document.getElementById("st"), re=document.getElementById("re");
      let arr=[];
      const solvable=(a)=>{ let inv=0; for(let i=0;i<8;i++) for(let j=i+1;j<9;j++) if(a[i]&&a[j]&&a[i]>a[j]) inv++; return inv%2===0; };
      const done=()=>arr.slice(0,8).every((v,i)=>v===i+1);
      const render=()=>{ b.innerHTML=""; arr.forEach((v,i)=>{ const bt=document.createElement("button"); bt.style.aspectRatio="1"; bt.textContent=v||""; bt.className=v?"":"alt"; bt.onclick=()=>mv(i); b.appendChild(bt); }); if(done()) st.textContent="完成"; };
      const mv=(i)=>{ const z=arr.indexOf(0); const ok=[[1,3],[0,2,4],[1,5],[0,4,6],[1,3,5,7],[2,4,8],[3,7],[4,6,8],[5,7]]; if(!ok[z].includes(i)) return; [arr[z],arr[i]]=[arr[i],arr[z]]; render(); };
      const init=()=>{ do{ arr=shuffle([1,2,3,4,5,6,7,8,0]); }while(!solvable(arr)||done()); st.textContent="並べ替えて完成させる"; render(); };
      re.onclick=init; init();
    },

    game15() {
      ui(`<div class="status" id="cur"></div><div class="row"><button id="hi">High</button><button id="lo">Low</button><button id="re" class="alt">リセット</button></div><div class="status" id="st"></div>`);
      const cur=document.getElementById("cur"), hi=document.getElementById("hi"), lo=document.getElementById("lo"), re=document.getElementById("re"), st=document.getElementById("st");
      let c=0,score=0;
      const draw=()=>rnd(13)+1;
      const name=(n)=>["A","2","3","4","5","6","7","8","9","10","J","Q","K"][n-1];
      const judge=(high)=>{ const n=draw(); if((high&&n>=c)||(!high&&n<=c)) score++; c=n; cur.textContent=`現在カード: ${name(c)}`; st.textContent=`スコア:${score}`; };
      const init=()=>{ c=draw(); score=0; cur.textContent=`現在カード: ${name(c)}`; st.textContent="HighかLowを選択"; };
      hi.onclick=()=>judge(true); lo.onclick=()=>judge(false); re.onclick=init; init();
    },

    game16() {
      ui(`<div id="b" class="grid-5"></div><div class="status" id="st"></div><button id="re" class="alt">ランダム化</button>`);
      const b=document.getElementById("b"), st=document.getElementById("st"), re=document.getElementById("re");
      let g=[];
      const idx=(x,y)=>y*5+x;
      const tog=(x,y)=>{ [[x,y],[x+1,y],[x-1,y],[x,y+1],[x,y-1]].forEach(([a,c])=>{ if(a>=0&&a<5&&c>=0&&c<5) g[idx(a,c)]^=1; }); };
      const render=()=>{ b.innerHTML=""; g.forEach((v,i)=>{ const bt=document.createElement("button"); bt.style.aspectRatio="1"; bt.style.background=v?"#fbbf24":"#22345f"; bt.onclick=()=>{ tog(i%5,Math.floor(i/5)); render(); }; b.appendChild(bt); }); if(g.every(v=>v===0)) st.textContent="全消灯クリア"; };
      const init=()=>{ g=Array(25).fill(0).map(()=>rnd(2)); st.textContent="すべて消す"; render(); };
      re.onclick=init; init();
    },

    game17() {
      ui(`<div id="b" class="grid-6"></div><div class="status" id="st"></div><button id="re" class="alt">新マップ</button><p>左クリックで開く。地雷は8個。</p>`);
      const b=document.getElementById("b"), st=document.getElementById("st"), re=document.getElementById("re");
      let mine=new Set(), open=new Set(), over=false;
      const key=(x,y)=>`${x},${y}`;
      const around=(x,y)=>{ let n=0; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy) continue; if(mine.has(key(x+dx,y+dy))) n++; } return n; };
      const flood=(x,y)=>{ const q=[[x,y]]; while(q.length){ const [cx,cy]=q.pop(); const k=key(cx,cy); if(cx<0||cx>=6||cy<0||cy>=6||open.has(k)||mine.has(k)) continue; open.add(k); if(around(cx,cy)===0){ q.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]); } } };
      const render=()=>{
        b.innerHTML="";
        for(let y=0;y<6;y++) for(let x=0;x<6;x++){
          const bt=document.createElement("button"), k=key(x,y), isOpen=open.has(k);
          bt.style.aspectRatio="1"; bt.className="alt";
          if(isOpen){ const n=around(x,y); bt.textContent=n||""; bt.style.background="#e2e8f0"; bt.style.color="#0f172a"; }
          else bt.textContent="";
          bt.onclick=()=>click(x,y);
          if(over&&mine.has(k)){ bt.textContent="*"; bt.style.background="#ef4444"; }
          b.appendChild(bt);
        }
        const safe=36-mine.size;
        if(open.size===safe && !over) { over=true; st.textContent="クリア"; }
      };
      const click=(x,y)=>{
        if(over) return; const k=key(x,y); if(open.has(k)) return;
        if(mine.has(k)){ over=true; st.textContent="爆発"; render(); return; }
        flood(x,y); st.textContent=`${open.size}マス開放`; render();
      };
      const init=()=>{ mine.clear(); open.clear(); over=false; while(mine.size<8) mine.add(key(rnd(6),rnd(6))); st.textContent="安全地帯を開け"; render(); };
      re.onclick=init; init();
    },

    game18() {
      ui(`<div class="status" id="q"></div><div id="ops" class="row"></div><div class="status" id="st"></div><button id="re" class="alt">最初から</button>`);
      const data=[
        ["富士山の標高は?", ["3776m","3000m","4200m","2500m"],0],
        ["JSで配列の長さは?", [".size",".length",".count",".len"],1],
        ["地球は太陽から何番目?", ["2","3","4","5"],1],
        ["HTTPの既定ポート", ["21","80","443","25"],1],
        ["日本の首都", ["大阪","京都","東京","福岡"],2],
        ["CSSで文字色", ["font-color","text-style","color","ink"],2],
        ["1バイトは", ["4bit","8bit","16bit","32bit"],1],
        ["水の化学式", ["H2O","CO2","NaCl","O2"],0],
        ["最小の素数", ["0","1","2","3"],2],
        ["ブラウザで動く言語", ["Java","C","JavaScript","Rust"],2],
      ];
      const q=document.getElementById("q"), ops=document.getElementById("ops"), st=document.getElementById("st"), re=document.getElementById("re");
      let i=0,score=0,order=[];
      const show=()=>{
        if(i>=10){ q.textContent="終了"; ops.innerHTML=""; st.textContent=`${score}/10`; return; }
        const [t,o,a]=data[order[i]]; q.textContent=`Q${i+1}. ${t}`; ops.innerHTML="";
        o.forEach((txt,ix)=>{ const b=document.createElement("button"); b.textContent=txt; b.onclick=()=>{ if(ix===a) score++; i++; st.textContent=`スコア:${score}`; show(); }; ops.appendChild(b); });
      };
      const init=()=>{ i=0; score=0; order=shuffle([0,1,2,3,4,5,6,7,8,9]); st.textContent="スコア:0"; show(); };
      re.onclick=init; init();
    },

    game19() {
      ui(`<div class="row"><button id="start">開始</button><button id="re" class="alt">リセット</button></div><div id="pads" class="grid-3"></div><div class="status" id="st"></div>`);
      const pads=document.getElementById("pads"), st=document.getElementById("st"), start=document.getElementById("start"), re=document.getElementById("re");
      let seq=[], cur=0, can=false;
      const items=[...Array(9)].map((_,i)=>{ const b=document.createElement("button"); b.textContent=i+1; b.className="alt"; b.style.aspectRatio="1"; b.dataset.i=i; pads.appendChild(b); return b; });
      const blink=(i)=>new Promise((res)=>{ items[i].style.background="#fbbf24"; setTimeout(()=>{ items[i].style.background="#2a3d73"; res(); },260); });
      const show=async()=>{ can=false; for(const i of seq){ await blink(i); await new Promise(r=>setTimeout(r,90)); } can=true; cur=0; st.textContent=`Level ${seq.length}`; };
      const next=()=>{ seq.push(rnd(9)); show(); };
      items.forEach((b)=>b.onclick=async()=>{
        if(!can) return;
        const i=+b.dataset.i; await blink(i);
        if(i!==seq[cur]){ st.textContent=`失敗 Level ${seq.length}`; can=false; return; }
        cur++; if(cur===seq.length) setTimeout(next,280);
      });
      start.onclick=()=>{ seq=[]; next(); };
      re.onclick=()=>{ seq=[]; can=false; st.textContent="開始を押す"; items.forEach(v=>v.style.background="#2a3d73"); };
      re.onclick();
    },

    game20() {
      ui(`<canvas id="cv" width="520" height="380"></canvas><div class="row"><button id="start">開始</button><button id="re" class="alt">リセット</button></div><div class="status" id="st"></div>`);
      const cv=document.getElementById("cv"), ctx=cv.getContext("2d"), start=document.getElementById("start"), re=document.getElementById("re"), st=document.getElementById("st");
      let x=80,y=100,vx=3,vy=2.6,score=0,left=25,run=false,t=0,raf=0;
      const draw=()=>{
        ctx.clearRect(0,0,cv.width,cv.height);
        ctx.fillStyle="#0c1732"; ctx.fillRect(0,0,cv.width,cv.height);
        ctx.beginPath(); ctx.arc(x,y,18,0,Math.PI*2); ctx.fillStyle="#fb7185"; ctx.fill();
      };
      const loop=()=>{
        if(!run) return;
        x+=vx; y+=vy; if(x<18||x>cv.width-18) vx*=-1; if(y<18||y>cv.height-18) vy*=-1; draw(); raf=requestAnimationFrame(loop);
      };
      cv.onclick=(e)=>{
        if(!run) return;
        const r=cv.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top;
        if((mx-x)**2+(my-y)**2<18**2){ score++; vx*=1.05; vy*=1.05; st.textContent=`残り${left}s スコア:${score}`; }
      };
      const init=()=>{ cancelAnimationFrame(raf); x=80; y=100; vx=3; vy=2.6; score=0; left=25; run=false; draw(); st.textContent="開始を押す"; clearInterval(t); };
      start.onclick=()=>{ if(run) return; run=true; clearInterval(t); t=setInterval(()=>{ left--; st.textContent=`残り${left}s スコア:${score}`; if(left<=0){ run=false; clearInterval(t); st.textContent=`終了 スコア:${score}`; } },1000); loop(); };
      re.onclick=init; init();
    },
  };

  G[id]();
})();
