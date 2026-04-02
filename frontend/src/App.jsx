// import React, { useEffect } from 'react'
// import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom'
// import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
// import { useState } from 'react'
// import Login from './components/Login'
// import Signup from './components/Signup'
// import axios from 'axios'
// import Income from './pages/Income'
// import Expense from './pages/Expense'
// import Profile from './pages/Profile'

// const API_URL = "https://expense-tracker-backend-4lhs.onrender.com";

// //to get transaction from local storage
// const getTransactionFromStorage = () => {
//   try {
//     const saved = localStorage.getItem("transactions");
//     return saved ? JSON.parse(saved) : [];
//   } catch (err) {
//     console.error("Error parsing transactions:", err);
//     return [];
//   }
// }

// //to protect the routes
// const ProtectedRoute = ({ user, children }) => {
//   const localToken = localStorage.getItem("token");
//   const sessionToken = sessionStorage.getItem("token");
//   const hasToken = localToken || sessionToken;

//   console.log("ProtectedRoute check:", { user: !!user, hasToken, path: window.location.pathname });

//   // If no user and no token, redirect to login
//   if (!user && !hasToken) {
//     console.log("No auth found, redirecting to login");
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// const ScrollToTop = () => {
//   const location = useLocation();

//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
//   }, [location.pathname])

//   return null;
// }

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null)
//   const [transaction, setTransaction] = useState([])
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   //to save the token
//   const persistAuth = (userObj, tokenStr, remember = false) => {
//     console.log("persistAuth called:", { userObj: !!userObj, tokenStr: !!tokenStr, remember });
//     try {
//       if (remember) {
//         if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
//         if (tokenStr) localStorage.setItem("token", tokenStr);
//         sessionStorage.removeItem("user");
//         sessionStorage.removeItem("token");
//       } else {
//         if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
//         if (tokenStr) sessionStorage.setItem("token", tokenStr);
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//       }
//       setUser(userObj || null);
//       setToken(tokenStr || null);

//       // Set axios default header for all requests
//       if (tokenStr) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${tokenStr}`;
//       }

//       // Force navigation after state is set
//       if (userObj && tokenStr) {
//         console.log("Auth persisted, navigating to dashboard");
//         setTimeout(() => {
//           navigate("/", { replace: true });
//         }, 100);
//       }
//     } catch (err) {
//       console.error("persistAuth error:", err)
//     }
//   };

//   const clearAuth = () => {
//     try {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       sessionStorage.removeItem("user");
//       sessionStorage.removeItem("token");
//       delete axios.defaults.headers.common['Authorization'];
//     } catch (err) {
//       console.error("clearAuth error:", err)
//     }
//     setUser(null);
//     setToken(null);
//   }

//   const handleLogout = () => {
//     clearAuth();
//     navigate("/login");
//   }

//   const updateUserData = (updatedUser) => {
//     setUser(updatedUser);

//     const localToken = localStorage.getItem('token')
//     const sessionToken = sessionStorage.getItem('token')

//     if (localToken) {
//       localStorage.setItem("user", JSON.stringify(updatedUser))
//     } else if (sessionToken) {
//       sessionStorage.setItem("user", JSON.stringify(updatedUser))
//     }
//   }

//   // try to load user with token when mounted
//   useEffect(() => {
//     const loadAuth = async () => {
//       try {
//         const localUserRaw = localStorage.getItem('user')
//         const sessionUserRaw = sessionStorage.getItem('user')
//         const localToken = localStorage.getItem('token')
//         const sessionToken = sessionStorage.getItem('token')

//         const storedUser = localUserRaw ? JSON.parse(localUserRaw) : sessionUserRaw ? JSON.parse(sessionUserRaw) : null;
//         const storedToken = localToken || sessionToken || null;
//         const tokenFromLocal = !!localToken;

//         if (storedUser && storedToken) {
//           console.log("Found stored user and token");
//           setUser(storedUser);
//           setToken(storedToken);

//           // Set axios default header
//           axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

//           setIsLoading(false);
//           return;
//         }

//         if (storedToken) {
//           try {
//             console.log("Validating token with server");
//             const res = await axios.get(`${API_URL}/api/user/me`, {
//               headers: { Authorization: `Bearer ${storedToken}` }
//             })
//             const profile = res.data;
//             persistAuth(profile, storedToken, tokenFromLocal);
//           } catch (fetchErr) {
//             console.warn("Could not fetch profile with stored token", fetchErr)
//             clearAuth();
//           }
//         }
//       } catch (err) {
//         console.error("error bootStrapping auth:", err)
//       } finally {
//         setIsLoading(false)
//         try {
//           setTransaction(getTransactionFromStorage())
//         } catch (txErr) {
//           console.error("Error loading Transactions:", txErr)
//         }
//       }
//     }

//     loadAuth();
//   }, [])

//   useEffect(() => {
//     try {
//       localStorage.setItem("transactions", JSON.stringify(transaction))
//     } catch (err) {
//       console.error("error saving transactions:", err)
//     }
//   }, [transaction])

//   const handleLogin = ({ userData, remember = false, tokenFromApi = null }) => {
//     console.log("handleLogin called:", { userData: !!userData, remember, tokenFromApi: !!tokenFromApi });
//     if (userData && tokenFromApi) {
//       persistAuth(userData, tokenFromApi, remember);
//     } else {
//       console.error("Missing userData or token in handleLogin");
//     }
//   }

//   const handleSignup = ({ userData, remember = false, tokenFromApi = null }) => {
//     console.log("handleSignup called:", { userData: !!userData, remember, tokenFromApi: !!tokenFromApi });
//     if (userData && tokenFromApi) {
//       persistAuth(userData, tokenFromApi, remember);
//     } else {
//       console.error("Missing userData or token in handleSignup");
//     }
//   }

//   // transaction helpers
//   const addTransaction = (newTransaction) =>
//     setTransaction((p) => [newTransaction, ...p]);
//   const editTransaction = (id, updatedTransaction) =>
//     setTransaction((p) =>
//       p.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)),
//     );
//   const deleteTransaction = (id) =>
//     setTransaction((p) => p.filter((t) => t.id !== id));
//   const refreshTransactions = () =>
//     setTransaction(getTransactionFromStorage());

//   console.log("App render state:", { isLoading, user: !!user, token: !!token });

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <ScrollToTop />
//       <Routes>
//         <Route path="/login" element={<Login onLogin={handleLogin} />} />
//         <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

//         {/* Protected routes */}
//         <Route path="/" element={
//           <ProtectedRoute user={user}>
//             <Layout
//               user={user}
//               onLogout={handleLogout}
//               transaction={transaction}
//               addTransaction={addTransaction}
//               editTransaction={editTransaction}
//               deleteTransaction={deleteTransaction}
//               refreshTransactions={refreshTransactions}
//             />
//           </ProtectedRoute>
//         }>
//           <Route index element={
//             <Dashboard
//               transaction={transaction}
//               addTransaction={addTransaction}
//               editTransaction={editTransaction}
//               deleteTransaction={deleteTransaction}
//               refreshTransactions={refreshTransactions}
//             />
//           } />

//           <Route path="/income" element={
//             <Income
//               transaction={transaction}
//               addTransaction={addTransaction}
//               editTransaction={editTransaction}
//               deleteTransaction={deleteTransaction}
//               refreshTransactions={refreshTransactions}
//             />
//           } />

//           <Route path="/expense" element={
//             <Expense
//               transaction={transaction}
//               addTransaction={addTransaction}
//               editTransaction={editTransaction}
//               deleteTransaction={deleteTransaction}
//               refreshTransactions={refreshTransactions}
//             />
//           } />

//           <Route path="/profile"
//             element={
//               <Profile
//                 user={user}
//                 onUpdateProfile={updateUserData}
//                 onLogout={handleLogout}
//               />
//             }
//           />
//         </Route>

//         <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
//       </Routes>
//     </div>
//   )
// }

// export default App
































import React, { useEffect, lazy, Suspense } from 'react'
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
// Lazy load page components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Income = lazy(() => import('./pages/Income'))
const Expense = lazy(() => import('./pages/Expense'))
const Profile = lazy(() => import('./pages/Profile'))
import { useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import axios from 'axios'

const API_URL = "https://expense-tracker-backend-4lhs.onrender.com";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Loading page...</p>
    </div>
  </div>
);

//to get transaction from local storage
const getTransactionFromStorage = () => {
  try {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("Error parsing transactions:", err);
    return [];
  }
}

//to protect the routes
const ProtectedRoute = ({ user, children }) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const hasToken = localToken || sessionToken;

  console.log("ProtectedRoute check:", { user: !!user, hasToken, path: window.location.pathname });

  // If no user and no token, redirect to login
  if (!user && !hasToken) {
    console.log("No auth found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return children;
}

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return null;
}

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null)
  const [transaction, setTransaction] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  //to save the token
  const persistAuth = (userObj, tokenStr, remember = false) => {
    console.log("persistAuth called:", { userObj: !!userObj, tokenStr: !!tokenStr, remember });
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) localStorage.setItem("token", tokenStr);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) sessionStorage.setItem("token", tokenStr);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setUser(userObj || null);
      setToken(tokenStr || null);

      // Set axios default header for all requests
      if (tokenStr) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenStr}`;
      }

      // Force navigation after state is set
      if (userObj && tokenStr) {
        console.log("Auth persisted, navigating to dashboard");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 100);
      }
    } catch (err) {
      console.error("persistAuth error:", err)
    }
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      delete axios.defaults.headers.common['Authorization'];
    } catch (err) {
      console.error("clearAuth error:", err)
    }
    setUser(null);
    setToken(null);
  }

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  }

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);

    const localToken = localStorage.getItem('token')
    const sessionToken = sessionStorage.getItem('token')

    if (localToken) {
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } else if (sessionToken) {
      sessionStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  // try to load user with token when mounted
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const localUserRaw = localStorage.getItem('user')
        const sessionUserRaw = sessionStorage.getItem('user')
        const localToken = localStorage.getItem('token')
        const sessionToken = sessionStorage.getItem('token')

        const storedUser = localUserRaw ? JSON.parse(localUserRaw) : sessionUserRaw ? JSON.parse(sessionUserRaw) : null;
        const storedToken = localToken || sessionToken || null;
        const tokenFromLocal = !!localToken;

        if (storedUser && storedToken) {
          console.log("Found stored user and token");
          setUser(storedUser);
          setToken(storedToken);

          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

          setIsLoading(false);
          return;
        }

        if (storedToken) {
          try {
            console.log("Validating token with server");
            const res = await axios.get(`${API_URL}/api/user/me`, {
              headers: { Authorization: `Bearer ${storedToken}` }
            })
            const profile = res.data;
            persistAuth(profile, storedToken, tokenFromLocal);
          } catch (fetchErr) {
            console.warn("Could not fetch profile with stored token", fetchErr)
            clearAuth();
          }
        }
      } catch (err) {
        console.error("error bootStrapping auth:", err)
      } finally {
        setIsLoading(false)
        try {
          setTransaction(getTransactionFromStorage())
        } catch (txErr) {
          console.error("Error loading Transactions:", txErr)
        }
      }
    }

    loadAuth();
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transaction))
    } catch (err) {
      console.error("error saving transactions:", err)
    }
  }, [transaction])

  const handleLogin = ({ userData, remember = false, tokenFromApi = null }) => {
    console.log("handleLogin called:", { userData: !!userData, remember, tokenFromApi: !!tokenFromApi });
    if (userData && tokenFromApi) {
      persistAuth(userData, tokenFromApi, remember);
    } else {
      console.error("Missing userData or token in handleLogin");
    }
  }

  const handleSignup = ({ userData, remember = false, tokenFromApi = null }) => {
    console.log("handleSignup called:", { userData: !!userData, remember, tokenFromApi: !!tokenFromApi });
    if (userData && tokenFromApi) {
      persistAuth(userData, tokenFromApi, remember);
    } else {
      console.error("Missing userData or token in handleSignup");
    }
  }

  // transaction helpers
  const addTransaction = (newTransaction) =>
    setTransaction((p) => [newTransaction, ...p]);
  const editTransaction = (id, updatedTransaction) =>
    setTransaction((p) =>
      p.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)),
    );
  const deleteTransaction = (id) =>
    setTransaction((p) => p.filter((t) => t.id !== id));
  const refreshTransactions = () =>
    setTransaction(getTransactionFromStorage());

  console.log("App render state:", { isLoading, user: !!user, token: !!token });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute user={user}>
              <Layout
                user={user}
                onLogout={handleLogout}
                transaction={transaction}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            </ProtectedRoute>
          }>
            <Route index element={
              <Dashboard
                transaction={transaction}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            } />

            <Route path="/income" element={
              <Income
                transaction={transaction}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            } />

            <Route path="/expense" element={
              <Expense
                transaction={transaction}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            } />

            <Route path="/profile"
              element={
                <Profile
                  user={user}
                  onUpdateProfile={updateUserData}
                  onLogout={handleLogout}
                />
              }
            />
          </Route>

          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App