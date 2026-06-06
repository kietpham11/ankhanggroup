import React, { useState, useEffect } from 'react';
import { Calculator, ChevronRight, Wallet, Percent, FileText, Phone } from 'lucide-react';
import './LoanCalculator.css';
import LoanChartDetail from './LoanChartDetail';

export default function LoanCalculator() {
  const [propertyValue, setPropertyValue] = useState<number | ''>('');
  const [loanRatio, setLoanRatio] = useState(70);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const [loanAmount, setLoanAmount] = useState(0);
  const [firstMonthPayment, setFirstMonthPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const val = typeof propertyValue === 'number' ? propertyValue : 0;
    const loanAmt = val * (loanRatio / 100);
    const months = years * 12;
    const monthlyInterestRate = interestRate / 100 / 12;
    
    // Dư nợ giảm dần (Reducing balance)
    const principalMonthly = loanAmt / months;
    const firstMonthInt = loanAmt * monthlyInterestRate;
    
    // Total interest = Principal * Rate * (N+1)/2 (approx formula for reducing balance)
    const totalInt = loanAmt * monthlyInterestRate * ((months + 1) / 2);
    
    setLoanAmount(loanAmt);
    setFirstMonthPayment(principalMonthly + firstMonthInt);
    setTotalInterest(totalInt);
    setTotalPayment(loanAmt + totalInt);
  }, [propertyValue, loanRatio, years, interestRate]);

  const formatCurrency = (val: number) => {
    return Math.round(val).toLocaleString('vi-VN') + ' đ';
  };

  if (showChart) {
    return (
      <LoanChartDetail
        propertyValue={typeof propertyValue === 'number' ? propertyValue : 0}
        loanRatio={loanRatio}
        loanAmount={loanAmount}
        years={years}
        interestRate={interestRate}
        onBack={() => setShowChart(false)}
      />
    );
  }

  return (
    <div className="loan-calculator-wrapper">
      <div className="lc-header">
        <div className="lc-title">
          <div className="lc-icon"><Calculator size={20} className="text-primary" /></div>
          <h3>Ước tính vay ngân hàng</h3>
        </div>
        <button className="lc-btn-detail">Tính chi tiết <ChevronRight size={14} /></button>
      </div>

      <div className="lc-body">
        {/* Column 1: Inputs */}
        <div className="lc-col lc-inputs">
          <div className="lc-input-group">
            <label>Giá trị bất động sản</label>
            <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
              <input 
                type="text" 
                value={propertyValue === '' ? '' : propertyValue.toLocaleString('vi-VN')} 
                onChange={(e) => {
                  const valStr = e.target.value.replace(/\D/g, '');
                  setPropertyValue(valStr ? parseInt(valStr) : '');
                }}
              />
              <span style={{position: 'absolute', right: '1rem', color: 'var(--text-main)'}}>đ</span>
            </div>
          </div>
          
          <div className="lc-input-group">
            <label>Vay ngân hàng</label>
            <select value={loanRatio} onChange={(e) => setLoanRatio(Number(e.target.value))}>
              <option value={30}>30%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
              <option value={60}>60%</option>
              <option value={70}>70%</option>
              <option value={80}>80%</option>
              <option value={90}>90%</option>
            </select>
          </div>

          <div className="lc-input-group">
            <label>Thời hạn vay</label>
            <select value={years} onChange={(e) => setYears(Number(e.target.value))}>
              <option value={1}>1 năm</option>
              <option value={2}>2 năm</option>
              <option value={3}>3 năm</option>
              <option value={5}>5 năm</option>
              <option value={10}>10 năm</option>
              <option value={15}>15 năm</option>
              <option value={20}>20 năm</option>
              <option value={25}>25 năm</option>
              <option value={30}>30 năm</option>
              <option value={35}>35 năm</option>
            </select>
          </div>

          <div className="lc-input-group">
            <label>Lãi suất</label>
            <select value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}>
              <option value={7.5}>7.5%/năm</option>
              <option value={8.5}>8.5%/năm</option>
              <option value={9.5}>9.5%/năm</option>
              <option value={10.5}>10.5%/năm</option>
            </select>
          </div>
        </div>

        {/* Column 2: Highlighted Payment */}
        <div className="lc-col lc-highlight">
          <p className="hl-label">Thanh toán mỗi tháng (ước tính)</p>
          <h2 className="hl-value text-blue">{formatCurrency(firstMonthPayment)}</h2>
          <div className="badge-reducing-balance">
            <Wallet size={14} /> Dư nợ giảm dần
          </div>
          <button className="btn-outline-blue lc-chart-btn" onClick={() => setShowChart(true)}>
            <Calculator size={16} /> Xem biểu đồ trả nợ
          </button>
        </div>

        {/* Column 3: Stats */}
        <div className="lc-col lc-stats">
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Wallet size={20} /></div>
            <div className="stat-info">
              <p>Số tiền vay</p>
              <h4>{formatCurrency(loanAmount)}</h4>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Percent size={20} /></div>
            <div className="stat-info">
              <p>Tổng lãi phải trả</p>
              <h4>~ {formatCurrency(totalInterest)}</h4>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><FileText size={20} /></div>
            <div className="stat-info">
              <p>Tổng thanh toán</p>
              <h4>~ {formatCurrency(totalPayment)}</h4>
            </div>
          </div>
        </div>

        {/* Column 4: Contact CTA */}
        <div className="lc-col lc-cta">
          <div className="cta-box">
            <h4 className="text-blue">Bạn cần tư vấn chi tiết?</h4>
            <p>Để lại thông tin, chuyên viên sẽ hỗ trợ bạn nhanh chóng!</p>
            <button 
              className="btn-solid-blue w-100 mb-2" 
              onClick={() => window.open('https://www.facebook.com/profile.php?id=61586613410937', '_blank')}
            >
              Nhận tư vấn miễn phí <ChevronRight size={16} />
            </button>
            <div className="hotline-text">
              <Phone size={14} /> Hotline: 0985 943 567
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
