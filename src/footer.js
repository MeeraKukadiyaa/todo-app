import { useTranslation } from "./hooks/useTranslation.js";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-col">
            <div className='logo-section'>
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
            <div className="section">
              {t('footerDescription')}
            </div>
          </div>
          <div className="footer-col"><span className='title'>{t('services')}</span>
            <ul className="section">
              <li><a href="#services">{t('shopwareDevelopment')}</a></li>
              <li><a href="#services">{t('updatesMaintenance')}</a></li>
              <li><a href="#services">{t('customPluginDevelopment')}</a></li>
              <li><a href="#services">{t('themeDevelopment')}</a></li>
            </ul>
          </div>
          <div className="footer-col"><span className='title'>{t('company')}</span>
            <ul className="section">
              <li><a href="#about">{t('about')}</a></li>
              <li><a href="#testimonials">{t('testimonials')}</a></li>
              <li><a href="#contact">{t('contact')}</a></li>
            </ul>
          </div>
          <div className="footer-col"><span className='title'>{t('contact')}</span>
            <ul className="section">
              <li><a href="#services">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                info@jk-infotec.com
              </a></li>
              <li><a href="#services">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +91 9712682690
              </a></li>
              <li><a href="#services">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Surat</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {t('companyName')}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  )
}