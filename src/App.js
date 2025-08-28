import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import { LanguageProvider } from './contexts/LanguageContext';
import Footer from './footer';
import Header from './header';
import Hero from './page';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/" element={
            <div className='main'>
              <ToastContainer />
              <Header />
              <main>
                <Hero />
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
