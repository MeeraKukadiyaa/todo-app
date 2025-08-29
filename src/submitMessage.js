import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "./hooks/useTranslation.js";

const API_URL = process.env.NODE_ENV === "production"
  ? "https://todo-infotech.vercel.app/api"
  : "http://localhost:4000/api";


export default function SubmitMessage({ admin, setForm, record }) {
  const { t } = useTranslation();
  const [formHistory, setFormHistory] = useState([]);
  const defaultData = { name: '', email: '', subject: '', message: '' }
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (record) {
      setFormData({
        name: record.name || '',
        email: record.email || '',
        subject: record.subject || '',
        message: record.message || ''
      });
    }
  }, [record]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some(value => value === '')) return;
    try {
      await axios.post(`${API_URL}/messages`, formData);
      setFormHistory(false);
      setFormData(defaultData);
      alert("Message Sent!");
      if (admin) setForm(false);
    } catch (err) {
      console.error("Failed to submit quote:", err);
      alert("Failed to submit request")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form>
      <div className="form-main">
        {admin &&
          <div className="justify-between">
            <h2>Add ContactUs Data</h2>
            <div onClick={() => setForm(false)} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </div>
          </div>}
        <div className="row">
          <div className="form-inner"><label>{t('name')}</label><input name="name" required placeholder={t('namePlaceholder')} id="name" value={formData.name} onChange={handleInputChange} /></div>
          <div className="form-inner"><label>{t('email')}</label><input name="email" required placeholder={t('emailPlaceholder')} id="email" value={formData.email} onChange={handleInputChange} /></div>
        </div>
        <div className="form-inner"><label>{t('subject')}</label><input name="subject" required placeholder={t('subjectPlaceholder')} id="subject" value={formData.subject} onChange={handleInputChange} /></div>
        <div className="form-inner"><label>{t('message')}</label><textarea name="message" required placeholder={t('messagePlaceholder')} id="message" rows={4} cols={50} value={formData.message} onChange={handleInputChange} /></div>
      </div>
      {admin ?
        <div className="form-submit" style={{ display: "flex", justifyContent: "center", marginTop: '20px' }}>
          <button type="submit" onClick={handleSubmit} className="btn-gradient">Add Message</button>
        </div>
        :
        <div className="form-submit">
          <button type="submit" onClick={handleSubmit} className="btn-gradient">{t('sendMessage')}</button>
        </div>
      }
    </form>
  )
}