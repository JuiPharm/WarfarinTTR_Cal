window.CDSS=window.CDSS||{};(function(){
'use strict';
const DAYS=['จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์'];
const round=(n,p=2)=>{const f=10**p;return Math.round((Number(n)+Number.EPSILON)*f)/f};
const sum=a=>round(a.reduce((x,y)=>x+y,0),2);
function fractions(step){return step===.25?[1,.75,.5,.25]:step===.5?[1,.5]:[1]}
function decomposeDose(dose,strengths,step){
  const scale=Math.round(1/step),scaled=round(dose,2)*scale;
  if(Math.abs(scaled-Math.round(scaled))>1e-7)return null;
  const target=Math.round(scaled);
  if(target===0)return [];
  const pieces=[];
  [...new Set(strengths.map(Number).filter(x=>x>0))].sort((a,b)=>b-a).forEach(s=>{
    fractions(step).forEach(f=>{const units=Math.round(s*f*scale);if(units>0)pieces.push({units,strength:s,tablets:f})});
  });
  const dp=Array(target+1).fill(null);dp[0]={rows:[],pieces:0,strengths:new Set(),splitPenalty:0};
  for(let a=1;a<=target;a++)for(const piece of pieces){
    if(piece.units>a||!dp[a-piece.units])continue;
    const prev=dp[a-piece.units],rows=prev.rows.concat(piece),used=new Set(rows.map(x=>x.strength));
    const splitPenalty=rows.reduce((v,x)=>v+(x.tablets<1?1:0),0);
    const cand={rows,pieces:rows.length,strengths:used,splitPenalty};
    const cur=dp[a];
    const score=x=>x.pieces*100+x.strengths.size*20+x.splitPenalty*4;
    if(!cur||score(cand)<score(cur))dp[a]=cand;
  }
  if(!dp[target])return null;
  const grouped=new Map();
  dp[target].rows.forEach(x=>grouped.set(x.strength,round((grouped.get(x.strength)||0)+x.tablets,2)));
  return [...grouped.entries()].map(([strength,tablets])=>({strength,tablets})).sort((a,b)=>a.strength-b.strength);
}
function dailyOptions(strengths,step,maxDose){
  const out=[];for(let d=0;d<=maxDose+1e-9;d+=step){const dose=round(d,2);if(decomposeDose(dose,strengths,step)!==null)out.push(dose)}return out;
}
function patterns(n){const out=[];function dfs(i,left,a){if(i===n-1){out.push(a.concat(left));return}for(let x=0;x<=left;x++)dfs(i+1,left-x,a.concat(x))}dfs(0,7,[]);return out.filter(x=>x.some(Boolean));}
function spread(values){const a=[...values].sort((x,y)=>x-y),out=[];let l=0,r=a.length-1;while(l<=r){if(r>=l)out.push(a[r--]);if(l<=r)out.push(a[l++]);}return out.slice(0,7)}
function combinations(values,maxSize){const out=[];function pick(start,a){if(a.length)out.push([...a]);if(a.length===maxSize)return;for(let i=start;i<values.length;i++){a.push(values[i]);pick(i+1,a);a.pop()}}pick(0,[]);return out;}
function analyze(regimen,strengths,step){
  const details=regimen.map(dose=>({dose,tabletSummary:decomposeDose(dose,strengths,step)}));
  let totalTabletUnits=0,splitDays=0,doseChanges=0;const used=new Set();
  details.forEach((d,i)=>{let split=false;(d.tabletSummary||[]).forEach(x=>{used.add(x.strength);totalTabletUnits+=x.tablets;if(Math.abs(x.tablets-Math.round(x.tablets))>.001)split=true});if(split)splitDays++;if(i&&Math.abs(d.dose-details[i-1].dose)>.001)doseChanges++});
  const uniqueDoses=new Set(regimen.map(x=>round(x,2))).size;
  const complexity=round(Math.max(0,uniqueDoses-1)*5+splitDays*2+Math.max(0,used.size-1)*3+doseChanges*1.5+Math.max(0,totalTabletUnits-7)*.5,2);
  const level=complexity>12?'high':complexity>5?'moderate':'low';
  const warnings=[];if(splitDays)warnings.push(`มีการแบ่งเม็ด ${splitDays} วัน/สัปดาห์`);if(uniqueDoses>=3)warnings.push(`มีขนาดยารายวัน ${uniqueDoses} รูปแบบ`);if(used.size>2)warnings.push(`ใช้ยา ${used.size} strengths`);
  return {details,totalTabletUnits:round(totalTabletUnits,2),splitDays,usedStrengthCount:used.size,uniqueDoses,doseChanges,complexity,level,warnings};
}
function scoreCandidate(regimen,target,strengths,step,objective='balanced'){
  const total=sum(regimen),diff=Math.abs(total-target),a=analyze(regimen,strengths,step);
  let score=diff*10000;
  if(objective==='simple')score+=a.uniqueDoses*140+a.splitDays*40+a.usedStrengthCount*35+a.doseChanges*12+a.totalTabletUnits;
  else if(objective==='fewest')score+=a.totalTabletUnits*100+a.usedStrengthCount*35+a.splitDays*20+a.uniqueDoses*10;
  else score+=a.uniqueDoses*55+a.splitDays*28+a.usedStrengthCount*22+a.doseChanges*7+a.totalTabletUnits*3;
  return {...a,total,diff:round(diff,2),score:round(score,2)};
}
function generateCandidates(target,strengths,step,maxUnique=3){
  const avg=target/7,maxDose=Math.min(15,Math.max(10,Math.ceil(avg+4)));
  const opts=dailyOptions(strengths,step,maxDose).sort((a,b)=>Math.abs(a-avg)-Math.abs(b-avg)).slice(0,10).sort((a,b)=>a-b);
  const raw=[];for(const set of combinations(opts,maxUnique))for(const counts of patterns(set.length)){
    const vals=[];set.forEach((d,i)=>{for(let j=0;j<counts[i];j++)vals.push(d)});if(vals.length!==7)continue;
    const regimen=spread(vals),key=regimen.join('|');raw.push({key,regimen});
  }
  const byKey=new Map(raw.map(x=>[x.key,x.regimen]));
  const all=[...byKey.values()].map(regimen=>({regimen,balanced:scoreCandidate(regimen,target,strengths,step,'balanced'),simple:scoreCandidate(regimen,target,strengths,step,'simple'),fewest:scoreCandidate(regimen,target,strengths,step,'fewest')}));
  const chosen=[];const add=(label,obj,scoreKey)=>{if(!obj)return;const key=obj.regimen.join('|');if(chosen.some(x=>x.key===key))return;const sc=obj[scoreKey];chosen.push({key,label,dailyDoses:obj.regimen,dailyDetails:sc.details,total:sc.total,score:sc})};
  add('แนะนำ',all.sort((a,b)=>a.balanced.score-b.balanced.score)[0],'balanced');
  add('จำง่าย',all.sort((a,b)=>a.simple.score-b.simple.score)[0],'simple');
  add('จำนวนเม็ดน้อย',all.sort((a,b)=>a.fewest.score-b.fewest.score)[0],'fewest');
  for(const x of all.sort((a,b)=>a.balanced.score-b.balanced.score))if(chosen.length<3)add(`ทางเลือก ${chosen.length+1}`,x,'balanced');
  return chosen;
}
function calculateDispense(candidate,daysSupply,bufferDays=0,onHand={}){
  if(!candidate||!candidate.dailyDetails?.length)return null;
  daysSupply=Math.max(1,Math.min(365,Math.trunc(daysSupply)||1));bufferDays=Math.max(0,Math.min(30,Math.trunc(bufferDays)||0));
  const totalDays=daysSupply+bufferDays,totals=new Map(),rows=[];
  for(let i=0;i<totalDays;i++){
    const detail=candidate.dailyDetails[i%7];rows.push(detail);
    (detail.tabletSummary||[]).forEach(x=>totals.set(x.strength,round((totals.get(x.strength)||0)+x.tablets,2)));
  }
  const summary=[...totals.entries()].map(([strength,requiredEquivalent])=>{const stock=Math.max(0,Number(onHand[strength])||0),net=Math.max(0,round(requiredEquivalent-stock,2));return {strength,requiredEquivalent,onHand:stock,netEquivalent:net,dispenseWholeTablets:Math.ceil(net-1e-9)}}).sort((a,b)=>a.strength-b.strength);
  return {daysSupply,bufferDays,totalDays,summary,rows};
}
function fractionText(n){const whole=Math.floor(n+1e-9),f=round(n-whole,2);const ft=Math.abs(f-.25)<.01?'¼':Math.abs(f-.5)<.01?'½':Math.abs(f-.75)<.01?'¾':f?String(f).replace('0.','.'):' ';return f?(whole?`${whole}${ft}`:ft):String(whole)}
function summaryText(summary){if(!summary?.length)return 'งดยา';return summary.filter(x=>x.tablets>0).map(x=>`${fractionText(x.tablets)} เม็ด ขนาด ${x.strength} mg`).join(' + ')}
CDSS.regimenPlanner={DAYS,decomposeDose,generateCandidates,calculateDispense,summaryText,fractionText};
})();
