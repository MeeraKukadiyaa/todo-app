import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./contexts/LanguageContext.js";
import GetQuote from "./getQuote.js";
import { useTranslation } from "./hooks/useTranslation.js";

export default function Header() {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { name: t('english'), flag: '🇬🇧', code: 'en' },
    { name: t('deutsch'), flag: '🇩🇪', code: 'de' },
    { name: t('francais'), flag: '🇫🇷', code: 'fr' },
    { name: t('espanol'), flag: '🇪🇸', code: 'es' },
    { name: t('italiano'), flag: '🇮🇹', code: 'it' },
    { name: t('nederlands'), flag: '🇳🇱', code: 'nl' },
    { name: t('polski'), flag: '🇵🇱', code: 'pl' },
    { name: t('portugues'), flag: '🇵🇹', code: 'pt' }
  ];

  const handleLanguageSelect = (language) => {
    changeLanguage(language.code);
    setShow(false);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage);
  };

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;
    if (form) {
      if (typeof dialogElement.showModal === 'function') {
        dialogElement.showModal();
      }
    } else {
      if (typeof dialogElement.close === 'function') {
        try { dialogElement.close(); } catch (e) { }
      }
    }
  }, [form]);

  return (
    <header className='header'>
      <div className='header-section'>
        <div className='header-sec1'>
          <div className="logo">
            <div className="icon">
              <svg width="33px" height="33px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16.5" cy="18.5" r="1.5" fill="#fff" />
                <circle cx="9.5" cy="18.5" r="1.5" fill="#fff" />
                <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z" fill="#fff" />
              </svg>
            </div>
          </div>
          <h2 className="title">{t('companyName')}</h2>
        </div>
        <div className='header-sec2'>
          <ul className={`mobile-nav ${open ? 'mobile-nav-open' : ''}`}>
            <li><a href='#services'>{t('services')}</a></li>
            <li><a href='#about'>{t('about')}</a></li>
            <li><a href='#testimonials'>{t('testimonials')}</a></li>
            <li><a href='#contact'>{t('contact')}</a></li>
            <li>
              <button className='language btn' onClick={() => setShow(!show)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" x2="22" y1="12" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                {getCurrentLanguage()?.flag}
              </button>
              {show &&
                <div className="language-opt">
                  <div className="inner-opt">
                    {languages.map((language) => (
                      <div
                        key={language.code}
                        className={`option-list ${currentLanguage === language.code ? 'selected' : ''}`}
                        onClick={() => handleLanguageSelect(language)}
                      >
                        <span>{language.flag}</span> {language.name}
                      </div>
                    ))}
                  </div>
                </div>
              }
            </li>
            <li>
              <button className='btn-gradient' onClick={() => setForm(true)}>
                {t('getQuote')}
              </button>
            </li>
          </ul>
        </div>
        <dialog ref={dialogRef} className="quote-dialog" onClose={() => setForm(false)} onCancel={() => setForm(false)}>
          <GetQuote form={form} setForm={setForm} />
        </dialog>
        <div className="header-menu" onClick={() => setOpen(!open)}>
          {!open ?
            <svg viewBox="0 0 100 80" width="25" height="25">
              <rect width="90" height="10" rx="10" fill="#FFFc"></rect>
              <rect y="30" width="90" height="10" rx="10" fill="#FFFc"></rect>
              <rect y="60" width="90" height="10" rx="10" fill="#FFFc"></rect>
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
              <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" fill='#FFFC'></path>
            </svg>
          }
        </div>
      </div>
    </header>
  )
}