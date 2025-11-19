require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>console.log('Mongo ok')).catch(e=>console.error(e));
const OrderSchema = new mongoose.Schema({ items:Array, customerEmail:String, customerName:String, amount:Number, status:{type:String,default:'pending'}, details:Object, createdAt:{type:Date,default:Date.now} });
const Order = mongoose.model('Order', OrderSchema);
app.post('/api/create-checkout-session', async (req,res)=>{
  try{
    const { items, customerEmail, details } = req.body;
    const amount = items.reduce((s,i)=> s + (i.price || 0), 0);
    const order = await Order.create({ items, customerEmail, amount, status:'pending', details });
    const line_items = items.map(i=>({ price_data: { currency:'eur', product_data:{name:i.title}, unit_amount: Math.round((i.price||0)*100) }, quantity:1 }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      mode:'payment',
      line_items,
      success_url: process.env.SUCCESS_URL + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.CANCEL_URL,
      metadata: { orderId: order._id.toString() },
      customer_email: customerEmail
    });
    res.json({ id: session.id });
  }catch(e){ console.error(e); res.status(500).json({error: e.message}) }
});
app.get('/api/orders', async (req,res)=>{ const orders = await Order.find().sort({createdAt:-1}).limit(200); res.json(orders) });
app.post('/api/contact', async (req,res)=>{ console.log('Contact', req.body); res.json({ok:true}) });
app.post('/webhook', bodyParser.raw({type:'application/json'}), (req,res)=>{
  const sig = req.headers['stripe-signature'];
  let event;
  try{ event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }catch(e){ console.error('sig err', e.message); return res.status(400).send(`Webhook Error: ${e.message}`); }
  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    Order.findByIdAndUpdate(orderId, { status:'paid' }).then(()=> console.log('Order paid', orderId)).catch(e=>console.error(e));
  }
  res.json({received:true});
});
const PORT = process.env.PORT || 4242; app.listen(PORT, ()=> console.log('Server up', PORT));
