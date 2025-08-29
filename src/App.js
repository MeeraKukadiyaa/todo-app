import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLogin from './AdminLogin.js';
import { LanguageProvider } from './contexts/LanguageContext.js';
import Footer from './footer.js';
import Header from './header.js';
import Hero from './page.js';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/" element={
            <div className='main'>
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
