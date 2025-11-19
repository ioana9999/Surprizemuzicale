import React,{useState} from 'react'
export default function Contact(){ const [s,setS]=useState({name:'',email:'',message:''}); const [ok,setOk]=useState(null);
  async function submit(e){ e.preventDefault(); const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'}, body:JSON.stringify(s)}); setOk(r.ok)}
  return (<div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow"><h2 className="text-2xl font-bold'>Contact</h2>
    <form onSubmit={submit} className="mt-4 space-y-4"><input required placeholder="Nume" value={s.name} onChange={e=>setS({...s,name:e.target.value})} className="w-full p-3 border rounded" />
      <input required placeholder="Email" type="email" value={s.email} onChange={e=>setS({...s,email:e.target.value})} className="w-full p-3 border rounded" />
      <textarea required placeholder="Mesaj" value={s.message} onChange={e=>setS({...s,message:e.target.value})} className="w-full p-3 border rounded" rows={6} />
      <div className="flex gap-3"><button className="px-4 py-2 bg-indigo-600 text-white rounded">Trimite</button>{ok===true && <div className="text-green-600'>Trimis!</div>}{ok===false && <div className="text-red-600'>Eroare</div>}</div></form></div>)}
