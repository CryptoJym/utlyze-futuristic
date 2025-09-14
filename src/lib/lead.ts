import { supabase } from "@/integrations/supabase/client";

type AnyRecord = Record<string, any>;
function pick(raw: AnyRecord, keys: string[], fallback: string = ""): string { for (const k of keys) { const v = raw?.[k]; if (typeof v === 'string' && v.trim()) return v.trim(); } return fallback; }
function pain(raw: AnyRecord): string { const a = raw?.challenges; if (Array.isArray(a) && a.length) return a.join(', '); return pick(raw, ['pain_points','challenge','biggestChallenge','challenges','problem']); }
function utm(): Record<string,string> { try { const u=new URL(window.location.href); const ks=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','ref']; const o:Record<string,string>={}; ks.forEach(k=>{const v=u.searchParams.get(k); if(v) o[k]=v;}); return o;} catch {return {};}}
export async function submitLead(raw: AnyRecord) { try {
  const row:any={
    full_name: pick(raw,['full_name','fullName','name']),
    company_name: pick(raw,['company_name','company','companyName','corporationName','businessName']),
    industry: pick(raw,['industry']),
    title: pick(raw,['title','currentRole','role']),
    value_message: pick(raw,['value_message','successVision','valueMessage']),
    ideal_lead: pick(raw,['ideal_lead']),
    lead_capacity: pick(raw,['lead_capacity']),
    spend_range: pick(raw,['spend_range']),
    success_rate: pick(raw,['success_rate']),
    pain_points: pain(raw),
    phone: pick(raw,['phone','telephone'])||null,
    company_url: pick(raw,['company_url','companyUrl','website','site'])||null,
    additional_info: JSON.stringify({ contact_email: pick(raw,['email','contactEmail','workEmail']), meta:{ source_site: typeof window!=='undefined'?window.location.host:'', path: typeof window!=='undefined'?window.location.pathname:'', utm: utm() }})
  };
  // pick honeypots from DOM if present
  try { if (typeof window!=='undefined') { const hp=(window.document.querySelector("input[name=\"hpt\"]") as HTMLInputElement|null)?.value; if (hp) (raw as any).hpt=hp; const hp2=(window.document.querySelector("input[name=\"hp2\"]") as HTMLInputElement|null)?.value; if (hp2) (raw as any).hp2=hp2; } } catch {}
  try { const { error: fnError } = await supabase.functions.invoke('lead-intake',{ body:{ row } }); if (!fnError) return { ok:true }; } catch {}
  const { error } = await supabase.from('lead_forms').insert([row]);
  if (error) return { ok:false, error:error.message };
  return { ok:true };
} catch(e:any){ return { ok:false, error:e?.message||String(e)} }
}
