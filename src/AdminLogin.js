import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import GetQuote from "./getQuote.js";
import SubmitMessage from "./submitMessage.js";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.4 },
  transition: { duration: 0.5, ease: 'easeInOut' }
};

const serviceKeys = [
  "shopwareDevelopment",
  "updatesMaintenance",
  "customPluginDevelopment",
  "themeDevelopment",
  "other"
];

const API_URL = process.env.NODE_ENV === "production"
  ? "https://todo-infotech.vercel.app/api"
  : "http://localhost:4000/api";

export default function AdminLogin() {
  const dialogRef = useRef(null);
  const addDialogRef = useRef(null);
  const fileInputRef = useRef(null);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');
  const [files, setFiles] = useState(null);
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestHistory, setRequestHistory] = useState([]);
  const [data, setData] = useState({ email: '', password: '' });
  const [tab, setTab] = useState(() => sessionStorage.getItem('tab') || 'messages');
  const [filters, setFilters] = useState({
    search: "",
    services: [],
    dateFrom: "",
    dateTo: "",
    budgetFrom: "",
    budgetTo: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTabChange = (tab) => {
    setTab(tab);
    sessionStorage.setItem('tab', tab);
  };

  useEffect(() => {
    const isAdminLoggedIn = sessionStorage.getItem('isAdmin') === 'true';
    if (isAdminLoggedIn) {
      setIsLoggedIn(true);
    }
    const fetchQuotes = async () => {
      try {
        if (tab === "requests") {
          const req = await axios.get(`${API_URL}/requests`);
          setRequestHistory(req.data);
        }
        if (tab === "messages") {
          const msg = await axios.get(`${API_URL}/messages`);
          setHistory(msg.data);
        }
      } catch (err) {
        console.error("Error fetching data", err)
      }
    };

    fetchQuotes();
  }, [tab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (data.email === 'admin@gmail.com' && data.password === 'admin@123') {
        setIsLoggedIn(true);
        sessionStorage.setItem('isAdmin', 'true');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatServiceName = key =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());

 const handleEdit = (type, item) => {
    setEdit(item);
    setOpenDialog(true);
    const dialogElement = addDialogRef.current;
    if (!dialogElement) return;
    if (openDialog) {
      if (typeof dialogElement.showModal === 'function') {
        dialogElement.showModal();
      }
    } else {
      if (typeof dialogElement.close === 'function') {
        try { dialogElement.close(); } catch (e) { }
      }
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await axios.delete(`${API_URL}/${type}?id=${id}`);
      if (type === "messages") {
        setHistory(history.filter(h => h._id !== id));
      } else {
        setRequestHistory(requestHistory.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error("Error deleting item", err);
      alert("Failed to delete item");
    }
  };


  const renderSubmission = () => (
    <div className="table-container">
      <table>
        <thead>
          <tr style={{ color: "#64748b", background: "#f9fafb80", height: "3rem" }}>
            <td>ID</td>
            <td>Name</td>
            <td>Email</td>
            <td>Subject</td>
            <td style={{ width: '100%' }}>Message</td>
            <td>Time</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {history.map((submission, index) => (
            <tr key={submission._id || index}>
              <td>{index + 1}</td>
              <td>{submission.name}</td>
              <td>{submission.email}</td>
              <td>{submission.subject}</td>
              <td>{submission.message}</td>
              <td>{submission.time ? new Date(submission.time).toLocaleString() : ""}</td>
              <td style={{ textAlign: "center" }}>
                <button onClick={() => handleEdit("messages", submission)} style={{ marginRight: "0.5rem" }}>✏️</button>
                <button onClick={() => handleDelete("messages", submission._id)}> 🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderRequest = () => (
    <div className="table-container">
      <table>
        <thead>
          <tr style={{ color: "#64748b", background: "#f9fafb80", height: "3rem" }}>
            <td>ID</td>
            <td>Name</td>
            <td>Email</td>
            <td>Description</td>
            <td>Budget</td>
            <td>Services</td>
            <td>Time</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {requestHistory.map((request, index) => {
            const services = serviceKeys.filter(key => request[key]);
            return (
              <tr key={request._id || index}>
                <td>{index + 1}</td>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.projectDescription}</td>
                <td>${request.budget}</td>
                <td>{services.map(s => formatServiceName(s)).join(", ")}</td>
                <td>{request.time ? new Date(request.time).toLocaleString() : ""}</td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => handleEdit("requests", request)} style={{ marginRight: "0.5rem" }}>✏️ </button>
                  <button onClick={() => handleDelete("requests", request._id)}>🗑 </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    let data = [];
    if (tab === "messages") {
      data = history.filter(item =>
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.subject.toLowerCase().includes(value) ||
        item.message.toLowerCase().includes(value)
      );
      setHistory(data);
    } else {
      data = requestHistory.filter(item =>
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.projectDescription.toLowerCase().includes(value) ||
        serviceKeys.some(
          key => item[key] && formatServiceName(key).toLowerCase().includes(value)
        )
      );
      setRequestHistory(data);
    }
  };

  const handleImport = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
    }
  };

  const handleExport = () => {
    const dataToExport = tab === "messages" ? history : requestHistory;
    if (dataToExport.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = tab === "messages"
      ? ["ID", "Name", "Email", "Subject", "Message", "Time"]
      : ["ID", "Name", "Email", "Project Description", "Budget", ...serviceKeys.map(formatServiceName), "Time"];

    const rows = dataToExport.map((item, index) => {
      if (tab === "messages") {
        return [
          index + 1,
          item.name,
          item.email,
          item.subject,
          item.message,
          item.time ? new Date(item.time).toLocaleString() : ""
        ];
      } else {
        const services = serviceKeys.map(key => (item[key] ? "Yes" : "No"));
        return [
          index + 1,
          item.name,
          item.email,
          item.projectDescription,
          item.budget,
          ...services,
          item.time ? new Date(item.time).toLocaleString() : ""
        ];
      }
    });

    const csvContent = [headers, ...rows]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tab}_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;
    if (isModalOpen) {
      if (typeof dialogElement.showModal === 'function') {
        dialogElement.showModal();
      }
    } else {
      if (typeof dialogElement.close === 'function') {
        try { dialogElement.close(); } catch (e) { }
      }
    }
  }, [isModalOpen]);

  const options = { multi: true };
  const uploader = Uploader({
    apiKey: "free" // Get production API keys from Bytescale
  });
  const handleFile = (uploadedFiles) => {
    console.log("Upload complete:", uploadedFiles);
    // Do something with uploadedFiles
  };

  const handleFilters = () => {
    const { search, services, dateFrom, dateTo, budgetFrom, budgetTo } = filters;

    let filtered = [...requestHistory];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.email.toLowerCase().includes(lowerSearch) ||
        item.projectDescription.toLowerCase().includes(lowerSearch)
      );
    }

    if (services.length > 0) {
      filtered = filtered.filter(item =>
        services.some(serviceKey => item[serviceKey])
      );
    }

    if (dateFrom) {
      filtered = filtered.filter(item => new Date(item.time) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(item => new Date(item.time) <= new Date(dateTo));
    }

    if (budgetFrom) {
      filtered = filtered.filter(item => Number(item.budget) >= Number(budgetFrom));
    }

    if (budgetTo) {
      filtered = filtered.filter(item => Number(item.budget) <= Number(budgetTo));
    }

    setRequestHistory(filtered);
    setIsOpen(false);
  };

  const handleAdd = () => {
    setOpenDialog(true);
    const dialogElement = addDialogRef.current;
    if (!dialogElement) return;
    if (openDialog) {
      if (typeof dialogElement.showModal === 'function') {
        dialogElement.showModal();
      }
    } else {
      if (typeof dialogElement.close === 'function') {
        try { dialogElement.close(); } catch (e) { }
      }
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <div className="main admin">
          <motion.div
            {...fadeUp}
            style={{
              backgroundColor: 'white',
              padding: '4rem 2rem',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: '400px',
              position: 'relative'
            }}
          >
            <Link to="/" className="admin-back-link"> ← Back to Site </Link>
            <div className="login-header">
              <h1> Admin Login </h1>
              <p> Enter your credentials to access the admin panel </p>
            </div>

            <form onSubmit={handleLogin}>
              {error && <div className="error"> {error} </div>}
              <div className="flex-col">
                <div>
                  <label> Email </label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label> Password </label>
                  <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="login"
                  style={{
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : (
        <div className="admin-panel-layout">
          <header className="header">
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
                <h2 className="title">JK Infotech</h2>
              </div>
              <div className="search-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ic-search">
                  <circle cx="11" cy="8" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input type="text" placeholder="Search here..." onChange={handleChange} />
              </div>
              <div className="flex">
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                </button>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <span>
                  A
                </span>
                <button onClick={() => { setIsLoggedIn(false); sessionStorage.removeItem('isAdmin'); }} className="logout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" x2="9" y1="12" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </header>
          <nav className="navbar">
            <h2>Admin Panel</h2>
            <ul>
              <li
                onClick={() => handleTabChange("messages")}
                style={{
                  background: tab === "messages" ? "#4ade8040" : "transparent",
                  color: tab === "messages" ? "#15c657" : "#fff",
                  borderRight: tab === "messages" ? "2px solid #15c657" : "none"
                }}
              >
                Message History
              </li>
              <li
                onClick={() => handleTabChange("requests")}
                style={{
                  background: tab === "requests" ? "#4ade8040" : "transparent",
                  color: tab === "requests" ? "#15c657" : "#fff",
                  borderRight: tab === "requests" ? "2px solid #15c657" : "none"
                }}
              >
                Request History
              </li>
            </ul>
          </nav>

          <main>
            <div className="login-heading">
              <h1>
                {tab === "messages" ? "Message History" : "Request History"}
              </h1>
              <div className="flex">
                <button onClick={() => setIsOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Filters
                </button>
                <button onClick={() => {
                  setIsModalOpen(true);
                  setTimeout(() => {
                    if (dialogRef.current && typeof dialogRef.current.showModal === 'function') {
                      dialogRef.current.showModal();
                    }
                  }, 0);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" x2="12" y1="3" y2="15"></line>
                  </svg>
                  Import
                </button>
                <dialog ref={dialogRef} className="import-dialog" onClose={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
                  <div className="modal">
                    <div className="dialog-header">
                      <h2>Import Keys</h2>
                      <button onClick={() => setIsModalOpen(false)}>×</button>
                    </div>
                    <div className="dialog-body">
                      <UploadDropzone
                        uploader={uploader}
                        options={options}
                        onUpdate={({ uploadedFiles }) =>
                          console.log(`Files: ${uploadedFiles.map(x => x.fileUrl).join("\n")}`)
                        }
                        onComplete={(uploadedFiles) => {
                          console.log("Upload complete:", uploadedFiles);
                        }}
                        width="600px"
                        height="300px" />
                      <div style={{ padding: '1rem' }}>
                        <p>Supported formats: </p>
                        <pre>Excel files (.xlsx, .xls)</pre>
                        <p>Expected columns:</p>
                        <pre>Product ID, Serial Key, Order ID, Customer ID, E-mail, Shop, Status</pre>
                      </div>
                    </div>
                  </div>
                </dialog>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <button onClick={handleExport}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  Export
                </button>
              </div>
            </div>
            {tab === "messages" ? (
              history.length === 0 ? (
                <div className="error">No submissions found.</div>
              ) : (
                renderSubmission()
              )
            ) : (
              requestHistory.length === 0 ? (
                <div className="error">No requests found.</div>
              ) : (
                renderRequest()
              )
            )}

            {isOpen && (
              <AnimatePresence>
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-40 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                />
                <motion.div
                  className="filter shadow-2xl z-50 p-6 overflow-y-auto"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 500, damping: 50, duration: 0.02 }}
                >
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                    <button onClick={() => setIsOpen(false)}> × </button>
                  </div>

                  <form className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      style={{ width: '100%' }}
                    />

                    <p style={{ textAlign: 'left', width: '100%' }}>Services</p>
                    {serviceKeys.map(service => (
                      <div className="flex" style={{ width: '100%' }} key={service}>
                        <input
                          type="checkbox"
                          className="checkbox"
                          id={service}
                          checked={filters.services.includes(service)}
                          onChange={(e) => {
                            const { checked, id } = e.target;
                            setFilters(prev => ({
                              ...prev,
                              services: checked
                                ? [...prev.services, id]
                                : prev.services.filter(s => s !== id)
                            }));
                          }}
                        />
                        <label htmlFor={service}>{formatServiceName(service)}</label>
                      </div>
                    ))}


                    <div>
                      <label> Created From / To </label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          id="from-date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                        />
                        <input
                          type="date"
                          id="to-date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                        />

                      </div>
                    </div>

                    <div>
                      <label> Budget Range </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="From"
                          value={filters.budgetFrom}
                          onChange={(e) => setFilters(prev => ({ ...prev, budgetFrom: e.target.value }))}
                        />
                        <input
                          type="number"
                          placeholder="To"
                          value={filters.budgetTo}
                          onChange={(e) => setFilters(prev => ({ ...prev, budgetTo: e.target.value }))}
                        />

                      </div>
                    </div>

                    <button type="submit" className="apply" onClick={handleFilters}>
                      Apply
                    </button>
                  </form>
                </motion.div>
              </AnimatePresence>
            )}
          </main>
          <div className="add">
            <button className="add-data" onClick={handleAdd}> + </button>
          </div>
          {openDialog &&
            <dialog ref={addDialogRef} className="quote-dialog" onClose={() => setOpenDialog(false)} onCancel={() => setOpenDialog(false)}>
              {tab === "messages" ? (
                <SubmitMessage admin={true} setForm={setOpenDialog} record={edit}/>
              ) : (
                <GetQuote form={openDialog} setForm={setOpenDialog} record={edit}/>
              )}
            </dialog>
          }
        </div>
      )}
    </>
  );
}

