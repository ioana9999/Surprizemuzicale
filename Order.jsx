import React, {useState} from 'react'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
export default function Order(){
  const [form,setForm] = useState({customerName:'',customerEmail:'',recipientName:'',occasion:'',mood:'',genre:'Pop',duration:60,extraVocals:false,express:false,customLines:'',notes:''})
  const [cart,setCart]=useState([])
  const [submitting,setSubmitting]=useState(false)
  function handleChange(e){ const {name,value,type,checked}=e.target; setForm(s=>({...s,[name]: type==='checkbox'?checked:value})) }
  function priceEstimate(){ const base=0.8; const extras=(form.extraVocals?30:0)+(form.express?50:0); return Math.max(30, Math.round(form.duration*base+extras)); }
  function addToCart(){ const item={id:'ITEM-'+Date.now(),title:`Melodie pentru ${form.recipientName||'destinatar'}`, price:priceEstimate(), details:form}; setCart(c=>[...c,item]); alert('Adăugat în coș') }
  async function handleCheckout(){ if(cart.length===0){alert('Coș gol'); return} setSubmitting(true); const stripe=await stripePromise;
    const res=await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart, customerEmail:form.customerEmail, details:form})});
    const js=await res.json(); const result=await stripe.redirectToCheckout({sessionId:js.id}); if(result.error) alert(result.error.message); setSubmitting(false);
  }
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Comandă melodie personalizată</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Nume client" className="p-2 border rounded" />
        <input name="customerEmail" value={form.customerEmail} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
        <input name="recipientName" value={form.recipientName} onChange={handleChange} placeholder="Destinatar" className="p-2 border rounded" />
        <input name="occasion" value={form.occasion} onChange={handleChange} placeholder="Ocazie" className="p-2 border rounded" />
        <input name="mood" value={form.mood} onChange={handleChange} placeholder="Mood" className="p-2 border rounded" />
        <select name="genre" value={form.genre} onChange={handleChange} className="p-2 border rounded"><option>Pop</option><option>Rock</option><option>Folk</option></select>
        <input type="number" name="duration" value={form.duration} onChange={handleChange} className="p-2 border rounded" />
        <label className="flex items-center gap-2"><input type="checkbox" name="extraVocals" checked={form.extraVocals} onChange={handleChange}/> Vocal extra (+30)</label>
        <textarea name="customLines" value={form.customLines} onChange={handleChange} className="md:col-span-2 p-2 border rounded" placeholder="Linii importante"></textarea>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>Estimare: €{priceEstimate()}</div>
        <div className="flex gap-2">
          <button onClick={()=>{addToCart()}} className="px-4 py-2 bg-yellow-500 text-white rounded">Adaugă în coș</button>
          <button onClick={()=>handleCheckout()} className="px-4 py-2 bg-green-600 text-white rounded">{submitting?'Se redirecționează...':'Plătește cu cardul'}</button>
        </div>
      </div>
    </div>
  )
}
