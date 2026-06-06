import React, { useMemo } from 'react';
import { 
  Calculator, ChevronLeft, Wallet, Percent, 
  FileText, TrendingUp, Info
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import './LoanChartDetail.css';

interface LoanChartDetailProps {
  propertyValue: number;
  loanRatio: number;
  loanAmount: number;
  years: number;
  interestRate: number;
  onBack: () => void;
}

export default function LoanChartDetail({
  propertyValue,
  loanRatio,
  loanAmount,
  years,
  interestRate,
  onBack
}: LoanChartDetailProps) {
  
  // Calculations
  const formatCurrency = (val: number) => {
    if (val >= 1e9) {
      return (val / 1e9).toFixed(2).replace(/\.00$/, '') + ' tỷ';
    } else if (val >= 1e6) {
      return (val / 1e6).toFixed(0) + ' tr';
    }
    return Math.round(val).toLocaleString('vi-VN') + ' đ';
  };

  const formatFullCurrency = (val: number) => {
    return Math.round(val).toLocaleString('vi-VN') + ' đ';
  };

  const {
    schedule,
    chartData,
    totalInterest,
    totalPayment,
    firstMonthPayment
  } = useMemo(() => {
    const months = years * 12;
    const monthlyRate = interestRate / 100 / 12;
    const principalMonthly = loanAmount / months;
    
    let remainingPrincipal = loanAmount;
    let accumulatedPrincipal = 0;
    let accumulatedInterest = 0;
    
    const sched = [];
    const cData = [];
    
    // Push initial state (Month 0)
    cData.push({
      name: 'Năm 0',
      remaining: loanAmount,
      paidPrincipal: 0,
      paidInterest: 0,
    });

    let firstMonthTotal = 0;
    let totalInt = 0;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingPrincipal * monthlyRate;
      const totalMonthly = principalMonthly + interestPayment;
      
      if (i === 1) firstMonthTotal = totalMonthly;
      totalInt += interestPayment;

      sched.push({
        period: i,
        date: `Tháng ${startDate.getMonth() + 1}/${startDate.getFullYear()}`,
        startBalance: remainingPrincipal,
        principal: principalMonthly,
        interest: interestPayment,
        total: totalMonthly,
        endBalance: remainingPrincipal - principalMonthly > 0 ? remainingPrincipal - principalMonthly : 0
      });

      remainingPrincipal -= principalMonthly;
      accumulatedPrincipal += principalMonthly;
      accumulatedInterest += interestPayment;
      
      startDate.setMonth(startDate.getMonth() + 1);

      // Add to chart data every 12 months (yearly)
      if (i % 12 === 0 || i === months) {
        cData.push({
          name: `Năm ${i / 12}`,
          remaining: remainingPrincipal > 0 ? remainingPrincipal : 0,
          paidPrincipal: accumulatedPrincipal,
          paidInterest: accumulatedInterest,
        });
      }
    }

    return {
      schedule: sched,
      chartData: cData,
      totalInterest: totalInt,
      totalPayment: loanAmount + totalInt,
      firstMonthPayment: firstMonthTotal
    };
  }, [loanAmount, years, interestRate]);

  // First 5 periods
  const first5Periods = schedule.slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="lcd-custom-tooltip">
          <p className="lcd-tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div className="lcd-tooltip-item" key={index}>
              <span style={{ color: entry.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color}}></span>
                {entry.name}
              </span>
              <strong>{formatFullCurrency(entry.value)}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="loan-chart-detail">
      {/* Header */}
      <div className="lcd-header">
        <div className="lcd-title-group">
          <div className="lcd-icon"><Calculator size={18} /></div>
          <span className="lcd-title-text">Ước tính vay ngân hàng</span>
          <span className="lcd-title-separator">/</span>
          <span className="lcd-title-text" style={{color: 'var(--text-main)'}}>Biểu đồ trả nợ</span>
        </div>
        <button className="btn-back-calc" onClick={onBack}>
          <ChevronLeft size={16} /> Quay lại ước tính
        </button>
      </div>

      <div className="lcd-body">
        {/* LEFT SIDEBAR */}
        <div className="lcd-sidebar">
          
          <div className="lcd-sidebar-section">
            <h4>Thông tin khoản vay</h4>
            <div className="lcd-info-list">
              <div className="lcd-info-item">
                <span className="lcd-info-label">Giá trị bất động sản</span>
                <span className="lcd-info-value">{formatFullCurrency(propertyValue)}</span>
              </div>
              <div className="lcd-info-item">
                <span className="lcd-info-label">Vay ngân hàng</span>
                <span className="lcd-info-value">{loanRatio}%</span>
              </div>
              <div className="lcd-info-item">
                <span className="lcd-info-label">Số tiền vay</span>
                <span className="lcd-info-value">{formatFullCurrency(loanAmount)}</span>
              </div>
              <div className="lcd-info-item">
                <span className="lcd-info-label">Thời hạn vay</span>
                <span className="lcd-info-value">{years} năm</span>
              </div>
              <div className="lcd-info-item">
                <span className="lcd-info-label">Lãi suất</span>
                <span className="lcd-info-value">{interestRate}%/năm</span>
              </div>
              <div className="lcd-info-item">
                <span className="lcd-info-label">Phương thức trả nợ</span>
                <span className="lcd-info-value">Trả gốc đều hàng tháng</span>
              </div>
            </div>
          </div>

          <div className="lcd-sidebar-section">
            <h4>Tùy chỉnh hiển thị</h4>
            <div className="lcd-filter-group">
              <label>Hiển thị</label>
              <select>
                <option>Toàn bộ thời gian</option>
              </select>
            </div>
            <div className="lcd-filter-group">
              <label>Loại biểu đồ</label>
              <select>
                <option>Dư nợ giảm dần</option>
              </select>
            </div>
          </div>

          <div className="lcd-sidebar-section" style={{marginTop: 'auto'}}>
            <div className="lcd-legend">
              <div className="legend-item">
                <div className="legend-color" style={{background: '#3b82f6'}}></div>
                <span>Dư nợ gốc còn lại</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{background: '#22c55e'}}></div>
                <span>Tiền gốc đã trả</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{background: '#93c5fd'}}></div>
                <span>Tiền lãi đã trả</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="lcd-main">
          
          {/* Top Summary Cards */}
          <div className="lcd-cards">
            <div className="lcd-card">
              <div className="lcd-card-icon"><Wallet size={20} /></div>
              <div className="lcd-card-info">
                <p>Tổng số tiền phải trả</p>
                <h3>~ {formatFullCurrency(totalPayment)}</h3>
                <span>Gồm gốc + lãi</span>
              </div>
            </div>
            <div className="lcd-card">
              <div className="lcd-card-icon green"><Percent size={20} /></div>
              <div className="lcd-card-info">
                <p>Tổng tiền lãi phải trả</p>
                <h3>~ {formatFullCurrency(totalInterest)}</h3>
                <span>~ {((totalInterest / loanAmount) * 100).toFixed(0)}% tổng số tiền vay</span>
              </div>
            </div>
            <div className="lcd-card">
              <div className="lcd-card-icon"><FileText size={20} /></div>
              <div className="lcd-card-info">
                <p>Tổng thanh toán tháng đầu</p>
                <h3>~ {formatFullCurrency(firstMonthPayment)}</h3>
                <span>Trong {years} năm</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="lcd-chart-container">
            <div className="lcd-chart-header">
              <TrendingUp size={18} className="text-blue" />
              Biểu đồ trả nợ
            </div>
            <div className="lcd-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 12, fill: '#64748b'}} 
                    axisLine={{stroke: '#e2e8f0'}}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{fontSize: 12, fill: '#64748b'}} 
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="remaining" 
                    name="Dư nợ gốc còn lại" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRemaining)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="paidPrincipal" 
                    name="Tiền gốc đã trả" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrincipal)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="paidInterest" 
                    name="Tiền lãi đã trả" 
                    stroke="#93c5fd" 
                    strokeWidth={2}
                    fillOpacity={0.3} 
                    fill="#93c5fd" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="lcd-table-container">
            <div className="lcd-table-header">
              Bảng chi tiết trả nợ (5 kỳ đầu)
            </div>
            <table className="lcd-table">
              <thead>
                <tr>
                  <th>Kỳ</th>
                  <th>Ngày thanh toán</th>
                  <th>Dư nợ đầu kỳ</th>
                  <th>Tiền gốc</th>
                  <th>Tiền lãi</th>
                  <th>Tổng thanh toán</th>
                  <th>Dư nợ cuối kỳ</th>
                </tr>
              </thead>
              <tbody>
                {first5Periods.map((row) => (
                  <tr key={row.period}>
                    <td>{row.period}</td>
                    <td>{row.date}</td>
                    <td>~ {formatFullCurrency(row.startBalance)}</td>
                    <td>~ {formatFullCurrency(row.principal)}</td>
                    <td>~ {formatFullCurrency(row.interest)}</td>
                    <td>~ {formatFullCurrency(row.total)}</td>
                    <td>~ {formatFullCurrency(row.endBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div className="lcd-footer-note">
        <Info size={16} className="text-gold" />
        <span><strong>Lưu ý:</strong> Kết quả ước tính chỉ mang tính chất tham khảo. Vui lòng liên hệ ngân hàng để được tư vấn chi tiết và chính xác nhất.</span>
      </div>

    </div>
  );
}
