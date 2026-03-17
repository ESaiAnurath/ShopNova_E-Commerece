import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";

const orders=[
  {id:"#ORD-1042",date:"Mar 14, 2026",status:"Delivered",total:24999,items:[{name:"Sony WH-1000XM5",qty:1,price:24999,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&q=80"}]},
  {id:"#ORD-1038",date:"Mar 10, 2026",status:"Shipped",total:26997,items:[{name:"Nike Air Max 270",qty:3,price:8999,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop&q=80"}]},
  {id:"#ORD-1031",date:"Mar 2, 2026",status:"Delivered",total:12999,items:[{name:"Nespresso Coffee Maker",qty:1,price:12999,image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop&q=80"}]},
  {id:"#ORD-1020",date:"Feb 22, 2026",status:"Cancelled",total:41900,items:[{name:"Apple Watch Series 9",qty:1,price:41900,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&q=80"}]},
];
const sc={Delivered:"#3ECFCF",Shipped:"#FFD166",Processing:"#6C63FF",Cancelled:"#FF6B9D"};
const si={Delivered:"✅",Shipped:"🚚",Processing:"⏳",Cancelled:"❌"};
const steps=["Order Placed","Processing","Shipped","Delivered"];

export default function MyOrders() {
  const navigate=useNavigate();
  const [filter,setFilter]=useState("All");
  const [selected,setSelected]=useState(null);
  const filtered=orders.filter(o=>filter==="All"||o.status===filter);

  return (
    <div className="op">
      <UserNavbar cartCount={0}/>
      <div className="wrap">
        <div className="hdr">
          <button className="bbtn" onClick={()=>navigate("/home")}>← Home</button>
          <h1>My Orders</h1>
        </div>
        <div className="tabs">
          {["All","Processing","Shipped","Delivered","Cancelled"].map(f=>(
            <button key={f} className={`tab ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f} {f!=="All"&&`(${orders.filter(o=>o.status===f).length})`}</button>
          ))}
        </div>
        <div className="olist">
          {filtered.map(o=>(
            <div key={o.id} className="ocard">
              <div className="ohead">
                <div>
                  <p className="oid">{o.id}</p>
                  <p className="odate">{o.date}</p>
                </div>
                <span className="obadge" style={{"--sc":sc[o.status]}}>{si[o.status]} {o.status}</span>
              </div>
              {o.items.map((item,i)=>(
                <div key={i} className="oitem">
                  <img src={item.image} alt={item.name} className="oimg"/>
                  <div className="oinfo">
                    <p className="onm">{item.name}</p>
                    <p className="oqty">Qty: {item.qty}</p>
                  </div>
                  <p className="oprice">₹{(item.price*item.qty).toLocaleString()}</p>
                </div>
              ))}
              {o.status!=="Cancelled"&&(
                <div className="tracker">
                  {steps.map((step,i)=>{
                    const idx=steps.indexOf(o.status);
                    const done=i<=idx;
                    return (
                      <div key={i} className="tstep">
                        <div className={`tcircle ${done?"done":""}`}>{done?"✓":i+1}</div>
                        <p className={`tlabel ${done?"done":""}`}>{step}</p>
                        {i<steps.length-1&&<div className={`tline ${i<idx?"done":""}`}/>}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="ofooter">
                <p className="ototal">Total: <b>₹{o.total.toLocaleString()}</b></p>
                <div className="oactions">
                  {o.status==="Delivered"&&<button className="abtn">⭐ Rate Order</button>}
                  {o.status==="Delivered"&&<button className="abtn">🔄 Reorder</button>}
                  <button className="abtn primary" onClick={()=>setSelected(o)}>View Details</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div className="empty">No orders found</div>}
        </div>
      </div>

      {selected&&(
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="mhead"><h2>Order Details</h2><button onClick={()=>setSelected(null)}>✕</button></div>
            <div className="mrows">
              <div className="mrow"><span>Order ID</span><b className="oid">{selected.id}</b></div>
              <div className="mrow"><span>Date</span><b>{selected.date}</b></div>
              <div className="mrow"><span>Status</span><span className="obadge" style={{"--sc":sc[selected.status]}}>{si[selected.status]} {selected.status}</span></div>
              <div className="mrow"><span>Total</span><b>₹{selected.total.toLocaleString()}</b></div>
            </div>
            <div className="mitems">
              {selected.items.map((item,i)=>(
                <div key={i} className="mitem">
                  <img src={item.image} alt={item.name} className="miimg"/>
                  <div><p className="minm">{item.name}</p><p className="mipr">₹{item.price.toLocaleString()} × {item.qty}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .op{min-height:100vh;background:#08081a;font-family:'Sora',sans-serif;color:#e0e0f0}
        .wrap{max-width:900px;margin:0 auto;padding:32px}
        .hdr{display:flex;align-items:center;gap:16px;margin-bottom:24px}
        .bbtn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);padding:8px 16px;border-radius:10px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s}
        .bbtn:hover{background:rgba(108,99,255,0.15);border-color:#6C63FF;color:#a099ff}
        .hdr h1{font-size:24px;font-weight:700;color:#fff}
        .tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
        .tab{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);padding:8px 16px;border-radius:8px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s}
        .tab.active{background:rgba(108,99,255,0.2);border-color:#6C63FF;color:#a099ff}
        .olist{display:flex;flex-direction:column;gap:16px}
        .ocard{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;transition:border-color 0.2s}
        .ocard:hover{border-color:rgba(108,99,255,0.3)}
        .ohead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
        .oid{font-family:'JetBrains Mono',monospace;font-size:13px;color:#6C63FF;font-weight:500}
        .odate{font-size:12px;color:rgba(255,255,255,0.35);margin-top:3px}
        .obadge{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;background:color-mix(in srgb,var(--sc) 15%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 30%,transparent)}
        .oitem{display:flex;align-items:center;gap:12px;margin-bottom:12px}
        .oimg{width:56px;height:56px;object-fit:cover;border-radius:10px;flex-shrink:0}
        .oinfo{flex:1}
        .onm{font-size:14px;font-weight:500;color:#fff}
        .oqty{font-size:12px;color:rgba(255,255,255,0.4);margin-top:3px}
        .oprice{font-size:15px;font-weight:700;color:#fff}
        .tracker{display:flex;align-items:flex-start;gap:0;margin:16px 0;padding:16px;background:rgba(255,255,255,0.03);border-radius:12px;overflow-x:auto}
        .tstep{display:flex;flex-direction:column;align-items:center;flex:1;position:relative;min-width:70px}
        .tcircle{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);transition:all 0.3s;flex-shrink:0}
        .tcircle.done{background:rgba(62,207,207,0.2);border-color:#3ECFCF;color:#3ECFCF}
        .tlabel{font-size:10px;color:rgba(255,255,255,0.3);margin-top:6px;text-align:center;white-space:nowrap}
        .tlabel.done{color:#3ECFCF}
        .tline{position:absolute;top:13px;left:50%;width:100%;height:2px;background:rgba(255,255,255,0.1)}
        .tline.done{background:#3ECFCF}
        .ofooter{display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;gap:10px}
        .ototal{font-size:14px;color:rgba(255,255,255,0.5)}
        .ototal b{color:#fff;font-size:16px}
        .oactions{display:flex;gap:8px;flex-wrap:wrap}
        .abtn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);padding:7px 14px;border-radius:8px;font-family:'Sora',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s}
        .abtn:hover{background:rgba(255,255,255,0.1);color:#fff}
        .abtn.primary{background:linear-gradient(135deg,#6C63FF,#3ECFCF);border:none;color:#fff;font-weight:500}
        .empty{padding:60px;text-align:center;color:rgba(255,255,255,0.3);font-size:16px}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);padding:20px}
        .modal{background:#13132a;border:1px solid rgba(255,255,255,0.12);border-radius:20px;width:100%;max-width:440px;padding:28px;animation:pop 0.3s ease}
        @keyframes pop{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .mhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
        .mhead h2{font-size:18px;font-weight:700;color:#fff}
        .mhead button{background:none;border:none;color:rgba(255,255,255,0.4);font-size:18px;cursor:pointer}
        .mrows{display:flex;flex-direction:column;gap:12px;margin-bottom:20px}
        .mrow{display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .mrow span:first-child{font-size:13px;color:rgba(255,255,255,0.4)}
        .mrow b{font-size:13px;color:#fff;font-weight:500}
        .mitems{display:flex;flex-direction:column;gap:10px}
        .mitem{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);padding:12px;border-radius:10px}
        .miimg{width:48px;height:48px;object-fit:cover;border-radius:8px;flex-shrink:0}
        .minm{font-size:13px;font-weight:500;color:#fff}
        .mipr{font-size:12px;color:rgba(255,255,255,0.4);margin-top:3px}
      `}</style>
    </div>
  );
}
