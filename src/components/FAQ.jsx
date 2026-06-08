import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`faq-item ${isActive ? 'active' : ''}`}>
      <button className="faq-question" onClick={() => setIsActive(!isActive)}>
        <span>{question}</span>
        <span className="faq-icon">{isActive ? '-' : '+'}</span>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FAQ = ({ items }) => {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-subtitle">Got questions? We've got answers.</p>
        <div className="faq-list">
          {items.map((item, index) => (
            <FAQItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
