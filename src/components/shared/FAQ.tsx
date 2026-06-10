import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    id: 1,
    question: 'Làm thế nào để đặt lịch xem nhà/dự án?',
    answer: (
      <>
        Bạn có thể đặt lịch xem nhà/dự án dễ dàng qua website bằng cách chọn dự án và nhấn "Đặt lịch xem".
        Ngoài ra, bạn cũng có thể liên hệ trực tiếp với chúng tôi qua hotline <span className="text-gold font-medium">097 789 67 77</span> hoặc email <span className="text-gold font-medium">ankhanggroup.realestate@gmail.com</span> để được hỗ trợ nhanh chóng.
      </>
    )
  },
  {
    id: 2,
    question: 'Tôi có thể nhận thông tin dự án mới như thế nào?',
    answer: (
      <>
        Bạn có thể đăng ký nhận thông tin dự án mới nhất từ An Khang Group bằng cách điền thông tin vào form đăng ký nhận tin
        ở chân trang website hoặc gửi yêu cầu đến email <span className="text-gold font-medium">ankhanggroup.realestate@gmail.com</span>.
      </>
    )
  },
  {
    id: 3,
    question: 'An Khang Group có hỗ trợ vay ngân hàng không?',
    answer: (
      <>
        Có. An Khang Group hợp tác với nhiều ngân hàng uy tín để hỗ trợ khách hàng vay vốn với lãi suất ưu đãi,
        thủ tục nhanh chóng và linh hoạt theo từng dự án.
      </>
    )
  },
  {
    id: 4,
    question: 'Thủ tục mua bán tại An Khang Group như thế nào?',
    answer: (
      <>
        Quy trình mua bán tại An Khang Group gồm 5 bước: Tư vấn – Đặt cọc – Ký hợp đồng – Thanh toán – Nhận bàn giao.
        <br />
        Đội ngũ chuyên viên sẽ đồng hành và hỗ trợ bạn trong suốt quá trình để đảm bảo giao dịch an toàn và thuận lợi.
      </>
    )
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1); // Mặc định mở item đầu tiên

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">CÂU HỎI THƯỜNG GẶP</h2>
          <button className="faq-view-all">
            Xem tất cả <ArrowRight size={16} />
          </button>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <div 
                  className="faq-question-box" 
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="faq-q-left">
                    <HelpCircle size={20} className="text-gold faq-icon" />
                    <h4 className="faq-question">{faq.question}</h4>
                  </div>
                  <div className="faq-q-right text-muted">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {isOpen && (
                  <div className="faq-answer-box">
                    <p className="faq-answer-text">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
