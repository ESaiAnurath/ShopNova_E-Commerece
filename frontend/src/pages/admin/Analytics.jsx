import { useState } from "react";
import BackButton from "../../components/BackButton";
const monthlyData = [
  { month: "Oct", revenue: 28000, orders: 84 },
  { month: "Nov", revenue: 35000, orders: 102 },
  { month: "Dec", revenue: 62000, orders: 180 },
  { month: "Jan", revenue: 48000, orders: 140 },
  { month: "Feb", revenue: 54000, orders: 158 },
  { month: "Mar", revenue: 71000, orders: 210 },
];

const topProducts = [
  { name: "Smart Watch", sales: 142, revenue: 117785, pct: 100 },
  { name: "Wireless Headphones", sales: 98, revenue: 24475, pct: 69 },
  { name: "Coffee Maker", sales: 76, revenue: 34952, pct: 54 },
  { name: "Running Shoes", sales: 65, revenue: 25344, pct: 46 },
  { name: "Laptop Stand", sales: 54, revenue: 7020, pct: 38 },
];
 
const categoryData = [
  { name: "Electronics", pct: 42, color: "#6C63FF", revenue: 178000 },
  { name: "Fashion", pct: 28, color: "#3ECFCF", revenue: 118000 },
  { name: "Home & Living", pct: 18, color: "#FFD166", revenue: 76000 },
  { name: "Sports", pct: 12, color: "#FF6B9D", revenue: 50600 },
];

const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-col">
          <div className="bar-wrap">
            <div className="bar-fill" style={{ height: `${(d.revenue / max) * 100}%` }}>
              <div className="bar-tooltip">₹{(d.revenue / 1000).toFixed(0)}k</div>
            </div>
          </div>
          <span className="bar-label">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [period, setPeriod] = useState("6M");
  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = monthlyData.reduce((s, d) => s + d.orders, 0);
  const avgOrder = Math.round(totalRevenue / totalOrders);

  return (
    <div className="page">
      <div className="page-header">
         <BackButton />
        <div><h1>Analytics</h1><p>Business performance overview</p></div>
        <div className="period-tabs">
          {["1M", "3M", "6M", "1Y"].map(p => (
            <button key={p} className={`ptab ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{"--c":"#6C63FF"}}>
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value">₹{(totalRevenue/1000).toFixed(0)}K</div>
          <div className="kpi-trend up">↑ 12.5% vs last period</div>
          <div className="kpi-glow"/>
        </div>
        <div className="kpi-card" style={{"--c":"#3ECFCF"}}>
          <div className="kpi-label">Total Orders</div>
          <div className="kpi-value">{totalOrders}</div>
          <div className="kpi-trend up">↑ 8.2% vs last period</div>
          <div className="kpi-glow"/>
        </div>
        <div className="kpi-card" style={{"--c":"#FFD166"}}>
          <div className="kpi-label">Avg Order Value</div>
          <div className="kpi-value">₹{avgOrder.toLocaleString()}</div>
          <div className="kpi-trend up">↑ 3.8% vs last period</div>
          <div className="kpi-glow"/>
        </div>
        <div className="kpi-card" style={{"--c":"#FF6B9D"}}>
          <div className="kpi-label">Conversion Rate</div>
          <div className="kpi-value">3.24%</div>
          <div className="kpi-trend down">↓ 0.5% vs last period</div>
          <div className="kpi-glow"/>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Revenue Chart */}
        <div className="panel chart-panel">
          <div className="panel-header">
            <h2>Monthly Revenue</h2>
            <span className="chart-legend">₹{(totalRevenue/1000).toFixed(0)}K total</span>
          </div>
          <BarChart data={monthlyData} />
          <div className="month-orders">
            {monthlyData.map((d,i) => (
              <div key={i} className="mo-item">
                <span>{d.month}</span>
                <span className="mo-orders">{d.orders} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="panel cat-panel">
          <div className="panel-header"><h2>Sales by Category</h2></div>
          <div className="donut-wrap">
            <svg viewBox="0 0 120 120" className="donut">
              {categoryData.reduce((acc, c, i) => {
                const offset = acc.offset;
                const dash = (c.pct / 100) * 283;
                const gap = 283 - dash;
                acc.elements.push(
                  <circle key={i} cx="60" cy="60" r="45"
                    fill="none" stroke={c.color} strokeWidth="18"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={-offset}
                    style={{transform:"rotate(-90deg)",transformOrigin:"50% 50%"}}
                  />
                );
                acc.offset += dash;
                return acc;
              }, { offset: 0, elements: [] }).elements}
              <text x="60" y="56" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">₹422K</text>
              <text x="60" y="68" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">Revenue</text>
            </svg>
          </div>
          <div className="cat-legend">
            {categoryData.map((c,i) => (
              <div key={i} className="cat-item">
                <div className="cat-dot" style={{background: c.color}}/>
                <span>{c.name}</span>
                <span className="cat-pct">{c.pct}%</span>
                <span className="cat-rev">₹{(c.revenue/1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="panel top-panel">
        <div className="panel-header"><h2>Top Selling Products</h2></div>
        <div className="top-list">
          {topProducts.map((p, i) => (
            <div key={i} className="top-item">
              <div className="top-rank">#{i + 1}</div>
              <div className="top-info">
                <div className="top-name-row">
                  <span className="top-name">{p.name}</span>
                  <span className="top-rev">₹{p.revenue.toLocaleString()}</span>
                </div>
                <div className="top-bar-wrap">
                  <div className="top-bar" style={{ width: `${p.pct}%` }} />
                </div>
                <div className="top-meta">{p.sales} units sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .page{padding:28px 32px;font-family:'Sora',sans-serif;color:#e0e0f0;min-height:100vh;background:#08081a}
        .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .page-header h1{font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px}
        .page-header p{font-size:13px;color:rgba(255,255,255,0.4);margin-top:4px}
        .period-tabs{display:flex;gap:4px;background:rgba(255,255,255,0.05);border-radius:10px;padding:4px}
        .ptab{background:none;border:none;color:rgba(255,255,255,0.4);padding:6px 14px;border-radius:7px;font-family:'Sora',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s}
        .ptab.active{background:rgba(108,99,255,0.3);color:#a099ff}
        .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .kpi-card{position:relative;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-top:2px solid var(--c);border-radius:16px;padding:22px;overflow:hidden;transition:transform 0.2s}
        .kpi-card:hover{transform:translateY(-2px)}
        .kpi-label{font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:10px;letter-spacing:0.3px}
        .kpi-value{font-size:28px;font-weight:700;color:#fff;letter-spacing:-1px}
        .kpi-trend{font-size:12px;margin-top:8px}
        .kpi-trend.up{color:#3ECFCF}
        .kpi-trend.down{color:#FF6B9D}
        .kpi-glow{position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:var(--c);border-radius:50%;filter:blur(40px);opacity:0.15}
        .charts-row{display:grid;grid-template-columns:1fr 320px;gap:20px;margin-bottom:20px}
        .panel{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:24px}
        .panel-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
        .panel-header h2{font-size:15px;font-weight:600;color:#fff}
        .chart-legend{font-size:13px;color:rgba(255,255,255,0.4)}
        .bar-chart{display:flex;gap:12px;height:160px;align-items:flex-end;padding:0 4px}
        .bar-col{display:flex;flex-direction:column;align-items:center;gap:8px;flex:1}
        .bar-wrap{flex:1;width:100%;display:flex;align-items:flex-end;max-height:140px}
        .bar-fill{width:100%;background:linear-gradient(180deg,#6C63FF,rgba(108,99,255,0.3));border-radius:6px 6px 0 0;position:relative;transition:height 0.5s ease;min-height:4px}
        .bar-fill:hover .bar-tooltip{opacity:1}
        .bar-tooltip{position:absolute;top:-28px;left:50%;transform:translateX(-50%);background:#13132a;border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:11px;padding:3px 7px;border-radius:6px;white-space:nowrap;opacity:0;transition:opacity 0.2s;pointer-events:none}
        .bar-label{font-size:11px;color:rgba(255,255,255,0.35)}
        .month-orders{display:flex;gap:12px;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06)}
        .mo-item{flex:1;text-align:center}
        .mo-item span{font-size:10px;color:rgba(255,255,255,0.3);display:block}
        .mo-orders{color:rgba(255,255,255,0.5)!important;font-size:11px!important;margin-top:2px}
        .donut-wrap{display:flex;justify-content:center;margin-bottom:20px}
        .donut{width:140px;height:140px}
        .cat-legend{display:flex;flex-direction:column;gap:10px}
        .cat-item{display:flex;align-items:center;gap:10px;font-size:13px}
        .cat-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .cat-item span:nth-child(2){flex:1;color:rgba(255,255,255,0.7)}
        .cat-pct{color:rgba(255,255,255,0.4);font-size:12px;min-width:30px;text-align:right}
        .cat-rev{color:#fff;font-weight:600;font-size:12px;min-width:50px;text-align:right}
        .top-panel{margin-top:0}
        .top-list{display:flex;flex-direction:column;gap:16px}
        .top-item{display:flex;align-items:center;gap:16px}
        .top-rank{width:28px;height:28px;background:rgba(108,99,255,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#6C63FF;flex-shrink:0}
        .top-info{flex:1}
        .top-name-row{display:flex;justify-content:space-between;margin-bottom:6px}
        .top-name{font-size:13px;color:rgba(255,255,255,0.85);font-weight:500}
        .top-rev{font-size:13px;font-weight:700;color:#fff}
        .top-bar-wrap{background:rgba(255,255,255,0.06);border-radius:4px;height:5px;overflow:hidden;margin-bottom:5px}
        .top-bar{height:100%;background:linear-gradient(90deg,#6C63FF,#3ECFCF);border-radius:4px}
        .top-meta{font-size:11px;color:rgba(255,255,255,0.35)}
        @media(max-width:1100px){.charts-row{grid-template-columns:1fr}.kpi-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </div>
  );
}
