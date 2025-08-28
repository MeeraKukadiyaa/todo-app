import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "./hooks/useTranslation";

export default function GetQuote({ form, setForm, record }) {
  const { t } = useTranslation();
  const defaultQuoteData = {
    name: '',
    email: '',
    shopwareDevelopment: false,
    updatesMaintenance: false,
    customPluginDevelopment: false,
    themeDevelopment: false,
    other: false,
    projectDescription: '',
    budget: 5000,
  };
  const [quoteData, setQuoteData] = useState(defaultQuoteData);

  useEffect(() => {
    if (record) {
      setQuoteData({
        name: record.name || '',
        email: record.email || '',
        shopwareDevelopment: record.shopwareDevelopment || false,
        updatesMaintenance: record.updatesMaintenance || false,
        customPluginDevelopment: record.customPluginDevelopment || false,
        themeDevelopment: record.themeDevelopment || false,
        other: record.other || false,
        projectDescription: record.projectDescription || '',
        budget: record.budget || 5000,
      });
    }
  }, [record]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuoteData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(quoteData).some(value => value === '')) return;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/requests`, quoteData);
      setForm(false);
      setQuoteData(defaultQuoteData);
      alert('Request sent !');
    } catch (err) {
      console.error("Failed to submit quote:", err);
      alert("Failed to submit request")
    }
  }

  const handleBudgetChange = (e) => {
    const value = parseInt(e.target.value || '0', 10);
    setQuoteData(prev => ({ ...prev, budget: value }));
  };


  const handleBudgetWheel = (e) => {
    e.preventDefault();
    const step = 500;
    const direction = e.deltaY > 0 ? 1 : -1;
    setQuoteData(prev => {
      const next = Math.min(50000, Math.max(1000, prev.budget + direction * step));
      return { ...prev, budget: next };
    });
  };

  return (
    <>
      <div className="justify-between">
        <div>
          <h3>{t('getHeading')}</h3>
          <p>{t('getDesc')}</p>
        </div>
        <div onClick={() => setForm(false)} style={{ cursor: 'pointer' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
      </div>
      <form>
        <div className="form-main">
          <div className="row">
            <div className="form-inner"><label>{t('name')}</label><input name="name" required placeholder={t('namePlaceholder')} id="name" value={quoteData.name} onChange={handleInputChange} /></div>
            <div className="form-inner"><label>{t('email')}</label><input name="email" required placeholder={t('emailPlaceholder')} id="email" value={quoteData.email} onChange={handleInputChange} /></div>
          </div>
          <div><label>{t('getService')}</label>
            <div className="services-check">
              <label><input type="checkbox" name="shopwareDevelopment" checked={quoteData.shopwareDevelopment} onChange={handleInputChange} /> {t('shopwareDevelopment')}</label>
              <label><input type="checkbox" name="updatesMaintenance" checked={quoteData.updatesMaintenance} onChange={handleInputChange} /> {t('updatesMaintenance')}</label>
              <label><input type="checkbox" name="customPluginDevelopment" checked={quoteData.customPluginDevelopment} onChange={handleInputChange} /> {t('customPluginDevelopment')}</label>
              <label><input type="checkbox" name="themeDevelopment" checked={quoteData.themeDevelopment} onChange={handleInputChange} /> {t('themeDevelopment')}</label>
              <label><input type="checkbox" name="other" checked={quoteData.other} onChange={handleInputChange} />Other</label>
            </div>
          </div>
          <div className="form-inner"><label>{t('getProject')}</label><textarea name="projectDescription" required placeholder={t('getProjDes')} id="message" rows={4} cols={50} value={quoteData.projectDescription} onChange={handleInputChange} /></div>
          <div className="form-inner budget-group">
            <label>{t('getBudget')}: <span className="amount">${quoteData.budget.toLocaleString()}</span></label>
            <div className="budget-slider">
              <input type="range" min="1000" max="50000" step="500" value={quoteData.budget} onChange={handleBudgetChange} onWheel={handleBudgetWheel} />
            </div>
          </div>
          <button className="btn-gradient" onClick={handleSubmit}>{t('submitReq')}</button>
        </div>
      </form>
    </>
  )
}