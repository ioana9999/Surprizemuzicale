import React, {useEffect,useState} from 'react'
export default function Admin(){ const [orders,setOrders]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{ async function load(){ try{ const r=await fetch('/api/orders'); const js=await r.json(); setOrders(js);}catch(e){console.error(e);} setLoading(false);} load()},[])
  return (<div className="min-h-screen p-6"><h1 className="text-2xl font-bold mb-4'>Admin — Comenzi</h1>{loading? <div>Se încarcă...</div>: <div className="grid gap-4">{orders.map(o=>(<div key={o._id} className="p-4 bg-white rounded shadow"><div className="font-semibold">Comanda #{o._id}</div><div className="text-sm">{o.customerEmail} — €{o.amount}</div><div className="text-sm">Status: {o.status}</div></div>))}</div>}</div>)}
