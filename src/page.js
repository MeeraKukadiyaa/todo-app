import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import GetQuote from "./getQuote.js";
import { useTranslation } from "./hooks/useTranslation.js";
import SubmitMessage from "./submitMessage.js";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.4 },
  transition: { duration: 0.5, ease: 'easeInOut' }
};
const fadeRight = {
  initial: { opacity: 0, x: 80 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeInOut' }
};
const fadeLeft = {
  initial: { opacity: 0, x: -80 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: { duration: 0.7, ease: 'easeInOut' }
};

export default function Hero() {
  const { t } = useTranslation();
  const defaultData = { name: '', email: '', subject: '', message: '' }
  const [formHistory, setFormHistory] = useState([]);
  const [formData, setFormData] = useState(defaultData);

  const testimonial = [
    {
      desc: t('testimonial1'),
      name: t('sarahJohnson')
    },
    {
      desc: t('testimonial2'),
      name: t('michaelChen')
    },
    {
      desc: t('testimonial3'),
      name: t('emmaRodrigue')
    },
  ];

  const count = [
    {
      count: "250+",
      desc: t('projectsCompleted'),
    },
    {
      count: "11+",
      desc: t('yearsExperience'),
    },
    {
      count: "99.9%",
      desc: t('satisfaction'),
    },
    {
      count: "24/7",
      desc: t('supportAvailable'),
    },
  ];

  const services = [
    {
      icon: <svg width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16.5" cy="18.5" r="1.5" fill="#fff" />
        <circle cx="9.5" cy="18.5" r="1.5" fill="#fff" />
        <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z" fill="#fff" />
      </svg>,
      title: t('shopwareDevelopment'),
      desc: t('shopwareDevelopmentDesc'),
      detail: [t('customShopSetup'), t('performanceOptimization'), t('thirdPartyIntegrations'), t('mobileResponsiveness')]
    },
    {
      icon:
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>,
      title: t('updatesMaintenance'),
      desc: t('updatesMaintenanceDesc'),
      detail: [t('securityUpdates'), t('performanceMonitoring'), t('bugFixes'), t('regularBackups')]
    },
    {
      icon:
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>,
      title: t('customPluginDevelopment'),
      desc: t('customPluginDevelopmentDesc'),
      detail: [t('customFunctionality'), t('apiIntegrations'), t('paymentGateways'), t('workflowAutomation')]
    },
    {
      icon:
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5"></circle>
          <circle cx="17.5" cy="10.5" r=".5"></circle>
          <circle cx="8.5" cy="7.5" r=".5"></circle>
          <circle cx="6.5" cy="12.5" r=".5"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
        </svg>,
      title: t('themeDevelopment'),
      desc: t('themeDevelopmentDesc'),
      detail: [t('responsiveDesign'), t('brandCustomization'), t('uxOptimization'), t('crossBrowserCompatibility')]
    },
  ];

  const why = [
    {
      icon:
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"></circle>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
        </svg>,
      title: t('certifiedExperts'),
      desc: t('certifiedExpertsDesc'),
    },
    {
      icon:
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>,
      title: t('fastDelivery'),
      desc: t('fastDeliveryDesc'),
    },
    {
      icon:
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>,
      title: t('ongoingSupport'),
      desc: t('ongoingSupportDesc'),
    },
  ];

  return (
    <>
      <Section
        title={t('heroTitle')}
        description={t('heroDescription')}
        gradient={t('startProject')}
        button={t('learnMore')}
        link='services'
      />
      <section className="count bg">
        <motion.div {...fadeUp}>
          <div className="container">
            <div className="count-main">
              {count.map((data, index) => (
                <div className="inner-count" key={index}>
                  <div className="count-head">{data.count}</div>
                  <div className="count-desc">{data.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      <section className="services" id="services">
        <div className="container">
          <Heading title={t('ourServices')} desc={t('servicesDescription')} />
          <div className="services-main">
            {services.map((data, index) => (
              <div className="service" key={index}>
                <motion.div {...fadeUp}>
                  <div className="services-demo">
                    <div className="services-heading">
                      <div className="services-image icon">{data.icon}</div>
                      <h3 className="services-title">{data.title}</h3>
                    </div>
                    <div className="services-desc">{data.desc}</div>
                    {data.detail.map((detail, idx) => (
                      <div className="services-details" key={idx}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <div className="services-details-text">{detail}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="about bg" id="about">
        <div className="container">
          <div className="about-main">
            <div className="about-left">
              <motion.div {...fadeLeft}>
                <Heading title={t('whyChooseUs')} desc={t('whyChooseUsDesc')} />
                {why.map((data, index) => (
                  <div className="about-demo" key={index}>
                    <div className="about-image icon">{data.icon}</div>
                    <div className="about-heading">
                      <h3 className="about-title">{data.title}</h3>
                      <div className="about-desc">{data.desc}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="about-right">
              <motion.div {...fadeRight}>
                <div className="about-img">
                  <img src="https://images.unsplash.com/photo-1565841327798-694bc2074762" alt="Shopware development team working on e-commerce solutions" />
                </div>
                <div className="about-absolute" />
              </motion.div>
            </div>
          </div>
        </div>
      </section >
      <section className="testimonial" id="testimonials">
        <motion.div {...fadeUp}>
          <div className="container">
            <Heading title={t('whatOurClientsSay')} desc={t('testimonialsDescription')} />
            <div className="testimonial-main">
              {testimonial.map((data, index) => (
                <div className="testimonial-inner-main" key={index}>
                  <div className="star">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#facc14" stroke="#facc14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#facc14" stroke="#facc14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#facc14" stroke="#facc14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#facc14" stroke="#facc14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#facc14" stroke="#facc14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <div className="testimonial-desc">{data?.desc}</div>
                  <div className="testimonial-name">{data?.name}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      <section className="get-in-touch bg" id="contact">
        <motion.div {...fadeUp}>
          <div className="container">
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
              <Heading title={t('getInTouch')} desc={t('contactDescription')} />
              <SubmitMessage />
            </div>
          </div>
        </motion.div>
      </section>
      <Section gradient={t('getFreeQuote')} button={t('scheduleConsultation')} link="contact" />
    </>
  )
}

function Heading({ title, desc }) {
  return (
    <>
      <motion.div {...fadeUp}>
        <h2 className="head-title">{title}</h2>
        <p className="head-desc">{desc}</p>
      </motion.div>
    </>
  )
}

function Section({ title, description, button, gradient, link }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const [form, setForm] = useState(false);

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
    <section className={`hero-main ${!title ? 'hero-main-section' : ''}`}>
      <motion.div {...fadeUp}>
        <div className="hero-animation" />
        <div className="container">
          <div className="hero-title">
            {title ?
              <>
                <h1 className="heading">
                  {title.split('Shopware').map((part, index, array) =>
                    index === array.length - 1 ? part : <>{part}<span>Shopware</span></>
                  )}
                </h1>
                <p className="description"> {description} </p>
              </> :
              <Heading title={t('readyToTransform')} desc={t('heroSubtitle')} />
            }
            <div className="content">
              <button className="start btn-gradient" onClick={() => setForm(true)}>{gradient}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FFF" />
                </svg>
              </button>
              <button
                className="learn btn"
                onClick={() => {
                  const contactSection = document.getElementById(link);
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {button}
              </button>
            </div>
          </div>
        </div>
        <dialog ref={dialogRef} className="quote-dialog" onClose={() => setForm(false)} onCancel={() => setForm(false)}>
          <GetQuote form={form} setForm={setForm} />
        </dialog>
        {title &&
          <>
            <div className="hero-animation2" />
            <div className="hero-animation3" />
          </>
        }
      </motion.div>
    </section>
  )
}