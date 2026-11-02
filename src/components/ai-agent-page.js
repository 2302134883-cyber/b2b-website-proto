
(function () {
  const PURPLE = '#7c3aed', BLUE = '#3b6cf6';
  const RING1 = '#a78bfa', RING2 = '#93c5fd';
  const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`; };
  const rotX = (p, a) => { const c=Math.cos(a), s=Math.sin(a); return {x:p.x, y:p.y*c-p.z*s, z:p.y*s+p.z*c}; };
  const rotY = (p, a) => { const c=Math.cos(a), s=Math.sin(a); return {x:p.x*c+p.z*s, y:p.y, z:-p.x*s+p.z*c}; };
  const rotZ = (p, a) => { const c=Math.cos(a), s=Math.sin(a); return {x:p.x*c-p.y*s, y:p.x*s+p.y*c, z:p.z}; };
  function project(p, cx, cy, scale) { const k = 1 + p.z * .12; return [cx+p.x*scale*k, cy-p.y*scale*k, p.z]; }
  function ringPoint(R, angle, tilt, global) {
    let p = {x:R*Math.cos(angle), y:R*Math.sin(angle), z:0};
    p = rotX(p, tilt[0]); p = rotZ(p, tilt[1]); p = rotY(p, global); return p;
  }

  function halo(ctx, x, y, now, size, reduced) {
    const r = size * (reduced ? 1 : .9 + .1*Math.sin(now/1600));
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0, hexA('#c4b5f5', .24));
    g.addColorStop(.5, hexA('#c4b5f5', .1));
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }

  // 方案 1 弥散柔光 + 方案 2 玻璃高光 / 边缘亮线
  function drawFusedSphere(ctx, cx, cy, R, now, reduced) {
    const r = R; // 直径严格等于按钮组总宽，呼吸只作用于光晕，不改变球体尺寸
    // 弥散主体：主页 hero 同款蓝紫粉，边缘羽化
    const body = ctx.createRadialGradient(cx-r*.12, cy-r*.18, r*.05, cx,cy,r);
    body.addColorStop(0, '#a8c8fa');
    body.addColorStop(.42, '#d3c6f8');
    body.addColorStop(.72, '#f3d4ec');
    body.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle=body; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
    // 右下暗部：保留体积，不形成硬边
    const shade = ctx.createRadialGradient(cx+r*.3,cy+r*.34,0,cx+r*.3,cy+r*.34,r*.85);
    shade.addColorStop(0,'rgba(167,139,250,.16)');
    shade.addColorStop(1,'rgba(167,139,250,0)');
    ctx.fillStyle=shade; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
    // 玻璃高光
    const hi = ctx.createRadialGradient(cx-r*.34,cy-r*.4,0,cx-r*.34,cy-r*.4,r*.38);
    hi.addColorStop(0,'rgba(255,255,255,.72)');
    hi.addColorStop(.48,'rgba(255,255,255,.22)');
    hi.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hi; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
    // 克制的 rim light 与细边，透明度让轨道可柔和透出
    ctx.strokeStyle='rgba(255,255,255,.48)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.arc(cx,cy,r*.88,Math.PI*1.03,Math.PI*1.86); ctx.stroke();
    ctx.strokeStyle='rgba(196,181,245,.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(cx,cy,r*.92,0,Math.PI*2); ctx.stroke();
    // 右下玻璃反射
    const rf=ctx.createRadialGradient(cx+r*.4,cy+r*.46,0,cx+r*.4,cy+r*.46,r*.4);
    rf.addColorStop(0,'rgba(168,200,250,.16)'); rf.addColorStop(1,'rgba(168,200,250,0)');
    ctx.fillStyle=rf; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  }

  function drawRingDashed(ctx,cx,cy,scale,R,tilt,global,color,half) {
    const N=240, dashOn=3, dashPeriod=6;
    for(let i=0;i<N;i++) {
      if(i%dashPeriod>=dashOn) continue;
      const p1=ringPoint(R,(i/N)*Math.PI*2,tilt,global);
      const p2=ringPoint(R,((i+1)/N)*Math.PI*2,tilt,global);
      const front=(p1.z+p2.z)/2>=0;
      if(half==='front'&&!front) continue;
      if(half==='back'&&front) continue;
      const [x1,y1]=project(p1,cx,cy,scale), [x2,y2]=project(p2,cx,cy,scale);
      ctx.strokeStyle=hexA(color,front?.8:.22); ctx.lineWidth=front?1.3:1;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }
  }
  function ringDots(ctx,cx,cy,scale,R,tilt,global,now,color,count,speed,reduced,half) {
    for(let i=0;i<count;i++) {
      const base=(i/count)*Math.PI*2, t=reduced?base:base+now*speed;
      const p=ringPoint(R,t,tilt,global), front=p.z>=0;
      if(half==='front'&&!front) continue;
      if(half==='back'&&front) continue;
      const [x,y]=project(p,cx,cy,scale), alpha=front?.95:.3, size=front?2.6:2;
      const g=ctx.createRadialGradient(x,y,0,x,y,size*3);
      g.addColorStop(0,hexA(color,alpha*.8)); g.addColorStop(1,hexA(color,0));
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,size*3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=hexA(color,alpha); ctx.beginPath(); ctx.arc(x,y,size,0,Math.PI*2); ctx.fill();
    }
  }
  function ringLayer(ctx,cx,cy,scale,R,tilt,global,now,color,dotColor,speed,reduced,half) {
    drawRingDashed(ctx,cx,cy,scale,R,tilt,global,color,half);
    ringDots(ctx,cx,cy,scale,R,tilt,global,now,dotColor,9,speed,reduced,half);
  }
  function drawTetra(ctx,cx,cy,scale,R,tilt,global,selfAngle,size) {
    const THETA=.7, verts=[[0,0,1],[0,.9428,-.3333],[.8165,-.4714,-.3333],[-.8165,-.4714,-.3333]];
    const edges=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
    const pts=verts.map(v=>{
      let p={x:v[0]*size,y:v[1]*size,z:v[2]*size};
      p=rotY(p,selfAngle); p=rotX(p,.18);
      p.x+=R*Math.cos(THETA); p.y+=R*Math.sin(THETA);
      p=rotX(p,tilt[0]); p=rotZ(p,tilt[1]); p=rotY(p,global);
      return project(p,cx,cy,scale);
    });
    const depth=pts.reduce((s,p)=>s+p[2],0)/4;
    ctx.strokeStyle=hexA(PURPLE,depth>=0?1:.45); ctx.lineWidth=1.6;
    for(const [a,b] of edges){ctx.beginPath();ctx.moveTo(pts[a][0],pts[a][1]);ctx.lineTo(pts[b][0],pts[b][1]);ctx.stroke();}
    return [pts.reduce((s,p)=>s+p[0],0)/4,pts.reduce((s,p)=>s+p[1],0)/4];
  }
  function drawCube(ctx,cx,cy,scale,R,tilt,global,selfAngle,size) {
    const THETA=5.6, verts=[]; for(let x of [-1,1])for(let y of [-1,1])for(let z of [-1,1])verts.push([x,y,z]);
    const edges=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
    const pts=verts.map(v=>{
      let p={x:v[0]*size*.5,y:v[1]*size*.5,z:v[2]*size*.5};
      p=rotY(p,selfAngle); p=rotX(p,.3);
      p.x+=R*Math.cos(THETA); p.y+=R*Math.sin(THETA);
      p=rotX(p,tilt[0]); p=rotZ(p,tilt[1]); p=rotY(p,global);
      return project(p,cx,cy,scale);
    });
    const depth=pts.reduce((s,p)=>s+p[2],0)/8;
    ctx.strokeStyle=hexA(BLUE,depth>=0?1:.45); ctx.lineWidth=1.6;
    for(const [a,b] of edges){ctx.beginPath();ctx.moveTo(pts[a][0],pts[a][1]);ctx.lineTo(pts[b][0],pts[b][1]);ctx.stroke();}
    return [pts.reduce((s,p)=>s+p[0],0)/8,pts.reduce((s,p)=>s+p[1],0)/8];
  }
  function label(ctx,text,x,y,size,color) {
    ctx.font=`600 ${size||12}px Inter,"PingFang SC","Microsoft YaHei",sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='rgba(255,255,255,.9)';
    ctx.strokeText(text,x,y);ctx.fillStyle=color;ctx.fillText(text,x,y);
  }
  function drawScene(ctx,W,H,now,reduced) {
    ctx.clearRect(0,0,W,H);
    const CX=W/2,CY=H/2,R=1;
    const sphereScale=ctaWidth/2;
    const a1=now*.0004,a2=-now*.00034,selfT=now*.0008,selfC=-now*.0007;
    const r1={R:1.55,tilt:[.95,.12]},r2={R:1.42,tilt:[-.82,.45]};

    // 计算两条轨道当前帧的原始左右范围，再缩放到标题实际宽度
    let minX=Infinity,maxX=-Infinity;
    for(const [ring,angle] of [[r1,a1],[r2,a2]]) {
      for(let i=0;i<=240;i++) {
        const p=ringPoint(ring.R,(i/240)*Math.PI*2,ring.tilt,angle);
        const x=p.x*(1+p.z*.12);
        minX=Math.min(minX,x); maxX=Math.max(maxX,x);
      }
    }
    const ringScale=titleWidth/(maxX-minX);
    const ringCX=CX-(maxX+minX)/2*ringScale;

    halo(ctx,CX,CY,now,R*sphereScale*1.7,reduced);
    ringLayer(ctx,ringCX,CY,ringScale,r1.R,r1.tilt,a1,now,RING1,PURPLE,.0006,reduced,'back');
    ringLayer(ctx,ringCX,CY,ringScale,r2.R,r2.tilt,a2,now,RING2,BLUE,-.0005,reduced,'back');
    drawFusedSphere(ctx,CX,CY,R*sphereScale,now,reduced);
    ringLayer(ctx,ringCX,CY,ringScale,r1.R,r1.tilt,a1,now,RING1,PURPLE,.0006,reduced,'front');
    ringLayer(ctx,ringCX,CY,ringScale,r2.R,r2.tilt,a2,now,RING2,BLUE,-.0005,reduced,'front');
    const [tx,ty]=drawTetra(ctx,ringCX,CY,ringScale,r1.R,r1.tilt,a1,selfT,.24);
    const [bx,by]=drawCube(ctx,ringCX,CY,ringScale,r2.R,r2.tilt,a2,selfC,.22);
    label(ctx,'Custom',tx,ty+28,12,PURPLE);
    label(ctx,'MCP Server',bx,by-28,12,BLUE);
  }
  const canvas=document.getElementById('heroCanvas'),box=canvas.parentElement,ctx=canvas.getContext('2d');
  const titleEl=document.getElementById('titleMeasure'),ctaGroup=document.getElementById('ctaGroup');
  const customBtn=document.getElementById('ctaCustom'),workbuddyBtn=document.getElementById('ctaWorkbuddy');
  let W,H,titleWidth=0,ctaWidth=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function measure(){
    titleWidth=titleEl.getBoundingClientRect().width;
    const gap=parseFloat(getComputedStyle(ctaGroup).columnGap)||0;
    ctaWidth=customBtn.getBoundingClientRect().width+workbuddyBtn.getBoundingClientRect().width+gap;
  }
  function resize(){const dpr=devicePixelRatio||1;measure();W=box.clientWidth;H=box.clientHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  new ResizeObserver(resize).observe(box);resize();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(resize);
  window.addEventListener('resize',resize);
  function loop(t){drawScene(ctx,W,H,t,reduced);requestAnimationFrame(loop);} requestAnimationFrame(loop);

  /* ---------- Custom Agent：可交互立体四层金字塔 ---------- */
  (function initPyramid(){
    const canvas=document.getElementById('pyramidCanvas');
    if(!canvas)return;
    const panel=canvas.parentElement,pctx=canvas.getContext('2d');
    const items=[...document.querySelectorAll('.layer-item')];
    const layerList=document.getElementById('layerList');
    const tiers=[
      {key:'model',label:'MODEL',t0:0,t1:.14},
      {key:'runtime',label:'HARNESS',t0:.26,t1:.40},
      {key:'mcp',label:'MCP',t0:.52,t1:.66},
      {key:'product',label:'PRODUCT',t0:.78,t1:1}
    ];
    let PW,PH,activeLayer='mcp',hitRegions=[],hovering=false;
    let pyramidAngle=.45,lastFrame=0;
    const motionReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function setActive(key){
      activeLayer=key;
      items.forEach(el=>el.classList.toggle('active',el.dataset.layer===key));
    }
    items.forEach(el=>{
      el.addEventListener('mouseenter',()=>{hovering=true;setActive(el.dataset.layer);});
      el.addEventListener('focus',()=>{hovering=true;setActive(el.dataset.layer);});
      el.addEventListener('click',()=>setActive(el.dataset.layer));
    });
    layerList.addEventListener('mouseleave',()=>{hovering=false;});
    function resizePyramid(){
      const dpr=devicePixelRatio||1;PW=panel.clientWidth;PH=panel.clientHeight;
      canvas.width=PW*dpr;canvas.height=PH*dpr;pctx.setTransform(dpr,0,0,dpr,0,0);
    }
    new ResizeObserver(resizePyramid).observe(panel);resizePyramid();
    function pyramidPoint(t,corner,angle,scale,cx,cy){
      const y=1.25-t*2.3,s=t*1.05;
      const coords=[[-s,y,-s],[s,y,-s],[s,y,s],[-s,y,s]][corner];
      let p={x:coords[0],y:coords[1],z:coords[2]};
      p=rotY(p,angle);p=rotX(p,.1);
      return project(p,cx,cy,scale);
    }
    function pathPolygon(points){
      pctx.beginPath();points.forEach((p,i)=>i?pctx.lineTo(p[0],p[1]):pctx.moveTo(p[0],p[1]));pctx.closePath();
    }
    function drawPyramid(now,angle){
      pctx.clearRect(0,0,PW,PH);
      const cx=PW*.46,cy=PH*.45+(motionReduced?0:Math.sin(now/1800)*2),scale=Math.min(PW,PH)*.22;
      hitRegions=[];
      const rendered=tiers.map(tier=>{
        const top=[0,1,2,3].map(c=>pyramidPoint(tier.t0,c,angle,scale,cx,cy));
        const bottom=[0,1,2,3].map(c=>pyramidPoint(tier.t1,c,angle,scale,cx,cy));
        return {tier,top,bottom};
      });
      // 黑白线框：背面淡、前面清晰；当前层只用浅灰层片强调
      rendered.forEach(({tier,top,bottom})=>{
        const active=tier.key===activeLayer;
        const xs=[...top,...bottom].map(p=>p[0]),ys=[...top,...bottom].map(p=>p[1]);
        hitRegions.push({key:tier.key,minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)});
        for(let side=0;side<4;side++){
          const next=(side+1)%4;
          const poly=[top[side],top[next],bottom[next],bottom[side]];
          const depth=(top[side][2]+top[next][2]+bottom[next][2]+bottom[side][2])/4;
          pathPolygon(poly);
          pctx.fillStyle=hexA('#111318',active?(depth>=0?.07:.025):(depth>=0?.018:.005));pctx.fill();
          pctx.strokeStyle=hexA('#111318',active?(depth>=0?.9:.35):(depth>=0?.48:.13));
          pctx.lineWidth=active?1.55:1;pctx.stroke();
        }
        // 每层的上下横截面与侧棱
        [top,bottom].forEach(pts=>{
          for(let i=0;i<4;i++){
            const a=pts[i],b=pts[(i+1)%4],depth=(a[2]+b[2])/2;
            pctx.strokeStyle=hexA('#111318',active?(depth>=0?.95:.38):(depth>=0?.5:.14));
            pctx.lineWidth=active?1.55:1;
            pctx.beginPath();pctx.moveTo(a[0],a[1]);pctx.lineTo(b[0],b[1]);pctx.stroke();
          }
        });
        for(let c=0;c<4;c++){
          const a=top[c],b=bottom[c],depth=(a[2]+b[2])/2;
          pctx.strokeStyle=hexA('#111318',active?(depth>=0?.9:.35):(depth>=0?.5:.14));
          pctx.lineWidth=active?1.5:1;
          pctx.beginPath();pctx.moveTo(a[0],a[1]);pctx.lineTo(b[0],b[1]);pctx.stroke();
        }
      });
      // 爆炸层之间的虚线投影辅助线，强化“同一座金字塔被展开”的关系
      pctx.save();pctx.setLineDash([3,6]);
      for(let i=0;i<rendered.length-1;i++){
        for(let c=0;c<4;c++){
          const a=rendered[i].bottom[c],b=rendered[i+1].top[c];
          pctx.strokeStyle='rgba(17,19,24,.16)';pctx.lineWidth=1;
          pctx.beginPath();pctx.moveTo(a[0],a[1]);pctx.lineTo(b[0],b[1]);pctx.stroke();
        }
      }
      pctx.restore();
      // 原系统地基：独立、静止，不属于四层
      const ground=[0,1,2,3].map(c=>{
        const coords=[[-1.35,-1.5,-1.05],[1.35,-1.5,-1.05],[1.35,-1.5,1.05],[-1.35,-1.5,1.05]][c];
        let p={x:coords[0],y:coords[1],z:coords[2]};p=rotY(p,angle);p=rotX(p,.1);
        return project(p,cx,cy,scale);
      });
      pathPolygon(ground);pctx.fillStyle='rgba(255,255,255,.35)';pctx.fill();
      pctx.strokeStyle='rgba(148,163,184,.4)';pctx.lineWidth=1;pctx.setLineDash([5,5]);pctx.stroke();pctx.setLineDash([]);
      label(pctx,'企业原有系统 + 数据库 · 不动 / 不碰',cx,cy+scale*1.82,12,'#7b8494');
      // 浮动英文短标签 + 极细引导线
      rendered.forEach(({tier,top,bottom})=>{
        const active=tier.key===activeLayer;
        const points=[...top,...bottom],xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
        const maxX=Math.max(...xs),midY=(Math.min(...ys)+Math.max(...ys))/2;
        const lx=Math.min(PW-42,maxX+48),color=active?'#111318':'#8a94a6';
        pctx.strokeStyle=hexA('#111318',active?.55:.22);pctx.lineWidth=1;
        pctx.beginPath();pctx.moveTo(maxX+5,midY);pctx.lineTo(lx-25,midY);pctx.stroke();
        label(pctx,tier.label,lx,midY,11,color);
      });
    }
    function hitTest(event){
      const rect=canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
      return hitRegions.find(r=>x>=r.minX&&x<=r.maxX&&y>=r.minY&&y<=r.maxY);
    }
    canvas.addEventListener('pointermove',e=>{const hit=hitTest(e);hovering=Boolean(hit);canvas.style.cursor=hit?'pointer':'default';});
    canvas.addEventListener('pointerleave',()=>{hovering=false;});
    canvas.addEventListener('click',e=>{const hit=hitTest(e);if(hit)setActive(hit.key);});
    function pyramidLoop(t){
      const dt=lastFrame?Math.min(40,t-lastFrame):16;lastFrame=t;
      if(!motionReduced&&!hovering)pyramidAngle+=dt*.00012;
      drawPyramid(t,pyramidAngle);requestAnimationFrame(pyramidLoop);
    }
    requestAnimationFrame(pyramidLoop);
  })();

  /* ---------- Workbuddy：五层爆炸式受控链路金字塔 ---------- */
  (function initWorkbuddyPyramid(){
    const canvas=document.getElementById('workbuddyCanvas');
    if(!canvas)return;
    const panel=canvas.parentElement,wctx=canvas.getContext('2d');
    const items=[...document.querySelectorAll('.wb-layer-item')],list=document.getElementById('wbLayerList');
    const tiers=[
      {key:'data',label:'DATA',top:1.15,bottom:1.01},
      {key:'business',label:'BUSINESS',top:.57,bottom:.43},
      {key:'api',label:'MCP API',top:-.01,bottom:-.15},
      {key:'server',label:'MCP SERVER',top:-.59,bottom:-.73},
      {key:'workbuddy',label:'WORKBUDDY',top:-1.17,bottom:-1.31}
    ];
    let W,H,active='server',regions=[],hovering=false,angle=.45,last=0;
    const motionReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function setActive(key){active=key;items.forEach(el=>el.classList.toggle('active',el.dataset.wbLayer===key));}
    items.forEach(el=>{
      el.addEventListener('mouseenter',()=>{hovering=true;setActive(el.dataset.wbLayer);});
      el.addEventListener('focus',()=>{hovering=true;setActive(el.dataset.wbLayer);});
      el.addEventListener('click',()=>setActive(el.dataset.wbLayer));
    });
    list.addEventListener('mouseleave',()=>{hovering=false;});
    function resize(){const dpr=devicePixelRatio||1;W=panel.clientWidth;H=panel.clientHeight;canvas.width=W*dpr;canvas.height=H*dpr;wctx.setTransform(dpr,0,0,dpr,0,0);}
    new ResizeObserver(resize).observe(panel);resize();
    function point(y,c,scale,cx,cy,pull){
      const s=1.05,coords=[[-s,y,-s],[s,y,-s],[s,y,s],[-s,y,s]][c];
      let p={x:coords[0]+pull,y:coords[1],z:coords[2]};p=rotY(p,angle);p=rotX(p,.1);
      return project(p,cx,cy,scale);
    }
    function polygon(points){wctx.beginPath();points.forEach((p,i)=>i?wctx.lineTo(p[0],p[1]):wctx.moveTo(p[0],p[1]));wctx.closePath();}
    function draw(now){
      wctx.clearRect(0,0,W,H);
      const cx=W*.45,cy=H*.46+(motionReduced?0:Math.sin(now/1900)*2),scale=Math.min(W,H)*.22;
      regions=[];
      const rendered=tiers.map(tier=>{
        const pull=tier.key===active?.18:0;
        return {tier,top:[0,1,2,3].map(c=>point(tier.top,c,scale,cx,cy,pull)),bottom:[0,1,2,3].map(c=>point(tier.bottom,c,scale,cx,cy,pull))};
      });
      rendered.forEach(({tier,top,bottom})=>{
        const selected=tier.key===active,xs=[...top,...bottom].map(p=>p[0]),ys=[...top,...bottom].map(p=>p[1]);
        regions.push({key:tier.key,minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)});
        for(let side=0;side<4;side++){
          const next=(side+1)%4,poly=[top[side],top[next],bottom[next],bottom[side]];
          const depth=(top[side][2]+top[next][2]+bottom[next][2]+bottom[side][2])/4;
          polygon(poly);
          wctx.fillStyle=hexA('#111318',selected?(depth>=0?.07:.025):(depth>=0?.018:.005));wctx.fill();
          wctx.strokeStyle=hexA('#111318',selected?(depth>=0?.92:.35):(depth>=0?.48:.13));
          wctx.lineWidth=selected?1.55:1;wctx.stroke();
        }
        [top,bottom].forEach(pts=>{
          for(let i=0;i<4;i++){
            const a=pts[i],b=pts[(i+1)%4],depth=(a[2]+b[2])/2;
            wctx.strokeStyle=hexA('#111318',selected?(depth>=0?.95:.38):(depth>=0?.5:.14));
            wctx.lineWidth=selected?1.55:1;wctx.beginPath();wctx.moveTo(a[0],a[1]);wctx.lineTo(b[0],b[1]);wctx.stroke();
          }
        });
        for(let c=0;c<4;c++){
          const a=top[c],b=bottom[c],depth=(a[2]+b[2])/2;
          wctx.strokeStyle=hexA('#111318',selected?(depth>=0?.9:.35):(depth>=0?.5:.14));
          wctx.lineWidth=selected?1.5:1;wctx.beginPath();wctx.moveTo(a[0],a[1]);wctx.lineTo(b[0],b[1]);wctx.stroke();
        }
      });
      wctx.save();wctx.setLineDash([3,6]);
      for(let i=0;i<rendered.length-1;i++)for(let c=0;c<4;c++){
        const a=rendered[i].bottom[c],b=rendered[i+1].top[c];
        wctx.strokeStyle='rgba(17,19,24,.14)';wctx.lineWidth=1;wctx.beginPath();wctx.moveTo(a[0],a[1]);wctx.lineTo(b[0],b[1]);wctx.stroke();
      }
      wctx.restore();
      rendered.forEach(({tier,top,bottom})=>{
        const selected=tier.key===active,points=[...top,...bottom],xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
        const maxX=Math.max(...xs),midY=(Math.min(...ys)+Math.max(...ys))/2;
        const lx=Math.min(W-50,maxX+52),color=selected?'#111318':'#8a94a6';
        wctx.strokeStyle=hexA('#111318',selected?.5:.2);wctx.lineWidth=1;
        wctx.beginPath();wctx.moveTo(maxX+5,midY);wctx.lineTo(lx-34,midY);wctx.stroke();
        label(wctx,tier.label,lx,midY,10,color);
      });
    }
    function hitTest(e){const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;return regions.find(v=>x>=v.minX&&x<=v.maxX&&y>=v.minY&&y<=v.maxY);}
    canvas.addEventListener('pointermove',e=>{const hit=hitTest(e);hovering=Boolean(hit);canvas.style.cursor=hit?'pointer':'default';});
    canvas.addEventListener('pointerleave',()=>{hovering=false;});
    canvas.addEventListener('click',e=>{const hit=hitTest(e);if(hit)setActive(hit.key);});
    function loop(t){const dt=last?Math.min(40,t-last):16;last=t;if(!motionReduced&&!hovering)angle+=dt*.00011;draw(t);requestAnimationFrame(loop);}requestAnimationFrame(loop);
  })();

  /* ---------- 最终 CTA：三级等轴黑线台阶 ---------- */
  (function initSteps(){
    const canvas=document.getElementById('stepsCanvas');
    if(!canvas)return;
    const box=canvas.parentElement,sctx=canvas.getContext('2d');
    let W,H;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function resize(){const dpr=devicePixelRatio||1;W=box.clientWidth;H=box.clientHeight;canvas.width=W*dpr;canvas.height=H*dpr;sctx.setTransform(dpr,0,0,dpr,0,0);}
    new ResizeObserver(resize).observe(box);resize();
    function iso(p,cx,cy,scale){return [cx+(p.x-p.z)*scale*.9,cy+p.z*scale*.22-p.y*scale];}
    function poly(points,fill,stroke,width=1.2){
      sctx.beginPath();points.forEach((p,i)=>i?sctx.lineTo(p[0],p[1]):sctx.moveTo(p[0],p[1]));sctx.closePath();
      if(fill){sctx.fillStyle=fill;sctx.fill();}sctx.strokeStyle=stroke;sctx.lineWidth=width;sctx.stroke();
    }
    const steps=[
      {name:'个人',sub:'自然语言入口',x:-1.9,y:-.35},
      {name:'团队',sub:'共享系统能力',x:0,y:.12},
      {name:'企业',sub:'沉淀群体智能',x:1.9,y:.59}
    ];
    function drawStep(step,cx,cy,scale){
      const w=1.45,d=1.05,base=-1.05,x=step.x,y=step.y;
      const top=[{x:x-w/2,y,z:-d/2},{x:x+w/2,y,z:-d/2},{x:x+w/2,y,z:d/2},{x:x-w/2,y,z:d/2}].map(p=>iso(p,cx,cy,scale));
      const front=[top[2],top[3],iso({x:x-w/2,y:base,z:d/2},cx,cy,scale),iso({x:x+w/2,y:base,z:d/2},cx,cy,scale)];
      const side=[top[1],top[2],iso({x:x+w/2,y:base,z:d/2},cx,cy,scale),iso({x:x+w/2,y:base,z:-d/2},cx,cy,scale)];
      poly(front,'rgba(247,248,251,.75)','rgba(17,19,24,.62)');
      poly(side,'rgba(239,241,246,.6)','rgba(17,19,24,.5)');
      poly(top,'rgba(255,255,255,.88)','rgba(17,19,24,.9)',1.35);
      const center=iso({x,y:y+.02,z:0},cx,cy,scale);
      label(sctx,step.name,center[0],center[1]-3,14,'#111318');
      label(sctx,step.sub,center[0],center[1]+17,10,'#7b8494');
      return iso({x,y:y+.08,z:0},cx,cy,scale);
    }
    function quad(a,b,c,t){const u=1-t;return [u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1]];}
    function jumpArrow(a,b){
      const start=[a[0]+30,a[1]-12],end=[b[0]-30,b[1]-12],control=[(start[0]+end[0])/2,(start[1]+end[1])/2-50];
      sctx.strokeStyle='rgba(255,255,255,.42)';sctx.lineWidth=1.2;sctx.beginPath();sctx.moveTo(start[0],start[1]);sctx.quadraticCurveTo(control[0],control[1],end[0],end[1]);sctx.stroke();
      const angle=Math.atan2(end[1]-control[1],end[0]-control[0]),size=7;
      sctx.beginPath();sctx.moveTo(end[0],end[1]);sctx.lineTo(end[0]-Math.cos(angle-.55)*size,end[1]-Math.sin(angle-.55)*size);sctx.moveTo(end[0],end[1]);sctx.lineTo(end[0]-Math.cos(angle+.55)*size,end[1]-Math.sin(angle+.55)*size);sctx.stroke();
    }
    function glow(x,y,r,alpha){
      const g=sctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(168,200,250,${alpha})`);g.addColorStop(.45,`rgba(211,198,248,${alpha*.7})`);g.addColorStop(.75,`rgba(243,212,236,${alpha*.35})`);g.addColorStop(1,'rgba(255,255,255,0)');
      sctx.fillStyle=g;sctx.beginPath();sctx.arc(x,y,r,0,Math.PI*2);sctx.fill();
    }
    function draw(now){
      sctx.clearRect(0,0,W,H);
      const cx=W/2,cy=H*.48,scale=Math.min(W,H)*.25;
      const centers=steps.map(s=>drawStep(s,cx,cy,scale));
      jumpArrow(centers[0],centers[1]);
      jumpArrow(centers[1],centers[2]);
      // 企业顶部柔光
      const end=centers[2],cycle=reduced?1:(now%7000)/7000;
      const arrival=reduced?1:Math.max(0,(cycle-.78)/.22);
      glow(end[0],end[1]-35,scale*.75,.12+arrival*.22);
      // 光点分两段跃迁，中间用抛物线
      let pos;
      if(cycle<.42){const t=cycle/.42;pos=quad(centers[0],[(centers[0][0]+centers[1][0])/2,(centers[0][1]+centers[1][1])/2-50],centers[1],t);}
      else if(cycle<.84){const t=(cycle-.42)/.42;pos=quad(centers[1],[(centers[1][0]+centers[2][0])/2,(centers[1][1]+centers[2][1])/2-50],centers[2],t);}
      else pos=centers[2];
      const fade=reduced?1:Math.min(1,cycle*10,(1-cycle)*10);
      glow(pos[0],pos[1]-8,22,.32*fade);
      sctx.fillStyle=`rgba(124,58,237,${.9*fade})`;sctx.beginPath();sctx.arc(pos[0],pos[1]-8,3.4,0,Math.PI*2);sctx.fill();
      // 终点星线
      sctx.strokeStyle=`rgba(255,255,255,${.6*arrival})`;sctx.lineWidth=1.2;
      const sy=end[1]-37;sctx.beginPath();sctx.moveTo(end[0]-8,sy);sctx.lineTo(end[0]+8,sy);sctx.moveTo(end[0],sy-8);sctx.lineTo(end[0],sy+8);sctx.stroke();
    }
    function loop(t){draw(t);requestAnimationFrame(loop);}requestAnimationFrame(loop);
  })();
})();
