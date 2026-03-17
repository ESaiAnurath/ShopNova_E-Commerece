import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";

const sample=[
  {id:1,name:"Sony WH-1000XM5 Headphones",price:24999,qty:1,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&q=80"},
  {id:2,name:"Nike Air Max 270",price:8999,qty:2,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&q=80"},
  {id:7,name:"Nespresso Coffee Maker",price:12999,qty:1,image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&q=80"},
];

export default function Cart() {
  const navigate=useNavigate();
  const [items,setItems]=useState(sample);
  const [coupon,setCoupon]=useState("");
  const [disc,setDisc]=useState(0);
  const [cmsg,setCmsg]=useState("");

  const update=(id,qty)=>{if(qty<1)return remove(id);setItems(items.map(i=>i.id===id?{...i,qty}:i));};
  const remove=(id)=>setItems(items.filter(i=>i.id!==id));
  const subtotal=items.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping=subtotal>=999?0:99;
  const total=subtotal+shipping-disc;

  const applyCoupon=()=>{
    if(coupon.toUpperCase()==="SHOPNOVA10"){setDisc(Math.round(subtotal*0.1));setCmsg("✅ 10% discount applied!");}
    else{setDisc(0);setCmsg("❌ Invalid coupon code");}
  };

  return (
    <div className="cart-page">
      <UserNavbar cartCount={items.reduce((s,i)=>s+i.qty,0)}/>
      <div className="cart-wrap">
        <div className="cart-header">
          <button className="back-btn" onClick={()=>navigate("/shop")}>← Continue Shopping</button>
          <h1>Shopping Cart <span>({items.length} items)</span></h1>
        </div>
        {items.length===0?(
          <div className="empty-cart">
            <div className="ec-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet</p>
            <button onClick={()=>navigate("/shop")}>Start Shopping →</button>
          </div>
        ):(
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item=>(
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="ci-img"/>
                  <div className="ci-info">
                    <h3>{item.name}</h3>
                    <p className="ci-price">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="ci-qty">
                    <button onClick={()=>update(item.id,item.qty-1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={()=>update(item.id,item.qty+1)}>+</button>
                  </div>
                  <div className="ci-total">₹{(item.price*item.qty).toLocaleString()}</div>
                  <button className="ci-remove" onClick={()=>remove(item.id)}>🗑️</button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="sum-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="sum-row"><span>Shipping</span><span className={shipping===0?"free":""}>{shipping===0?"FREE":"₹"+shipping}</span></div>
              {disc>0&&<div className="sum-row disc"><span>Discount</span><span>-₹{disc.toLocaleString()}</span></div>}
              <div className="sum-divider"/>
              <div className="sum-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              <div className="coupon-wrap">
                <input placeholder="Enter coupon code" value={coupon} onChange={e=>setCoupon(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyCoupon()}/>
                <button onClick={applyCoupon}>Apply</button>
              </div>
              {cmsg&&<p className={`cmsg ${disc>0?"ok":"err"}`}>{cmsg}</p>}
              <div className="promo-hint">Try: <b>SHOPNOVA10</b></div>
              <button className="checkout-btn" onClick={()=>navigate("/checkout")}>Proceed to Checkout →</button>
              {shipping>0&&<p className="ship-hint">Add ₹{(999-subtotal).toLocaleString()} more for free shipping!</p>}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .cart-page{min-height:100vh;background:#08081a;font-family:'Sora',sans-serif;color:#e0e0f0}
        .cart-wrap{max-width:1200px;margin:0 auto;padding:32px}
        .cart-header{display:flex;align-items:center;gap:20px;margin-bottom:28px;flex-wrap:wrap}
        .back-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);padding:8px 16px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s}
        .back-btn:hover{background:rgba(108,99,255,0.15);border-color:#6C63FF;color:#a099ff}
        .cart-header h1{font-size:24px;font-weight:700;color:#fff}
        .cart-header span{color:rgba(255,255,255,0.4);font-weight:400}
        .empty-cart{text-align:center;padding:80px 20px}
        .ec-icon{font-size:64px;margin-bottom:16px}
        .empty-cart h2{font-size:22px;font-weight:700;color:#fff;margin-bottom:8px}
        .empty-cart p{color:rgba(255,255,255,0.4);margin-bottom:24px}
        .empty-cart button{background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:12px 28px;border-radius:12px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;cursor:pointer}
        .cart-layout{display:grid;grid-template-columns:1fr 360px;gap:24px}
        .cart-items{display:flex;flex-direction:column;gap:14px}
        .cart-item{display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px;transition:border-color 0.2s}
        .cart-item:hover{border-color:rgba(108,99,255,0.3)}
        .ci-img{width:70px;height:70px;object-fit:cover;border-radius:10px;flex-shrink:0}
        .ci-info{flex:1}
        .ci-info h3{font-size:14px;font-weight:600;color:#fff;margin-bottom:4px}
        .ci-price{font-size:13px;color:rgba(255,255,255,0.5)}
        .ci-qty{display:flex;align-items:center;gap:0;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;overflow:hidden}
        .ci-qty button{background:none;border:none;color:#fff;width:32px;height:32px;cursor:pointer;font-size:16px;transition:background 0.2s}
        .ci-qty button:hover{background:rgba(108,99,255,0.2)}
        .ci-qty span{font-size:14px;font-weight:600;color:#fff;padding:0 12px}
        .ci-total{font-size:16px;font-weight:700;color:#fff;min-width:80px;text-align:right}
        .ci-remove{background:none;border:none;cursor:pointer;font-size:16px;opacity:0.5;transition:opacity 0.2s;padding:4px}
        .ci-remove:hover{opacity:1}
        .cart-summary{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;height:fit-content;position:sticky;top:80px}
        .cart-summary h2{font-size:16px;font-weight:700;color:#fff;margin-bottom:20px}
        .sum-row{display:flex;justify-content:space-between;font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:12px}
        .sum-row.disc span:last-child{color:#3ECFCF}
        .free{color:#3ECFCF!important;font-weight:600}
        .sum-divider{height:1px;background:rgba(255,255,255,0.08);margin:16px 0}
        .sum-total{display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#fff;margin-bottom:20px}
        .coupon-wrap{display:flex;gap:8px;margin-bottom:8px}
        .coupon-wrap input{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Sora',sans-serif;font-size:13px;padding:10px 12px;border-radius:10px;outline:none}
        .coupon-wrap input:focus{border-color:#6C63FF}
        .coupon-wrap button{background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.4);color:#a099ff;padding:10px 14px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;font-weight:500;cursor:pointer}
        .cmsg{font-size:12px;margin-bottom:8px}
        .cmsg.ok{color:#3ECFCF}
        .cmsg.err{color:#FF6B9D}
        .promo-hint{font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:16px}
        .promo-hint b{color:rgba(255,255,255,0.5)}
        .checkout-btn{width:100%;background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;padding:14px;border-radius:12px;font-family:'Sora',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s;margin-bottom:12px}
        .checkout-btn:hover{opacity:0.9;transform:translateY(-1px)}
        .ship-hint{font-size:12px;color:#FFD166;text-align:center}
        @media(max-width:900px){.cart-layout{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
