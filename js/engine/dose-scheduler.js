window.CDSS=window.CDSS||{};(function(){
const DAYS=['จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์'];
function schedule(total,start,step){
  total=Math.round(total/step)*step;
  const base=Math.floor(total/7/step)*step,d=Array(7).fill(base);
  let rem=Math.round((total-base*7)/step);
  const order=[0,3,6,2,5,1,4];
  for(let i=0;i<rem;i++)d[order[i%7]]+=step;
  return d.map((dose,i)=>({day:DAYS[(i+start)%7],dose:Number(dose.toFixed(2))}));
}
function fractionLabel(f){
  if(Math.abs(f-1)<1e-9)return '1';
  if(Math.abs(f-.5)<1e-9)return '½';
  if(Math.abs(f-.25)<1e-9)return '¼';
  if(Math.abs(f-.75)<1e-9)return '¾';
  return String(Number(f.toFixed(2)));
}
function expression(dose,strengths,step){
  const scale=Math.round(1/step),target=Math.round(dose*scale);
  const options=[];
  strengths.slice().sort((a,b)=>b-a).forEach(s=>{
    const fractions=step===.25?[1,.75,.5,.25]:step===.5?[1,.5]:[1];
    fractions.forEach(f=>{
      const units=Math.round(s*f*scale);
      if(units>0)options.push({units,strength:s,fraction:f,label:`${s} mg × ${fractionLabel(f)} เม็ด`});
    });
  });
  const unique=[...new Map(options.sort((a,b)=>b.units-a.units||b.strength-a.strength).map(o=>[`${o.units}:${o.strength}:${o.fraction}`,o])).values()];
  const dp=Array(target+1).fill(null);dp[0]=[];
  for(let amount=1;amount<=target;amount++){
    for(const o of unique){
      if(o.units<=amount&&dp[amount-o.units]){
        const cand=dp[amount-o.units].concat(o);
        if(!dp[amount]||cand.length<dp[amount].length||
          (cand.length===dp[amount].length&&new Set(cand.map(x=>x.strength)).size<new Set(dp[amount].map(x=>x.strength)).size))dp[amount]=cand;
      }
    }
  }
  if(!dp[target])return 'จัดเม็ดไม่ได้ด้วยขนาดที่เลือก';
  const groups=new Map();
  dp[target].forEach(o=>{const k=`${o.strength}:${o.fraction}`;groups.set(k,{...o,count:(groups.get(k)?.count||0)+1})});
  return [...groups.values()].map(g=>g.count===1?g.label:`${g.label} × ${g.count} ชุด`).join(' + ');
}
CDSS.scheduler={schedule,expression,DAYS};
})();
