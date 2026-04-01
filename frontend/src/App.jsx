// import React, { useEffect } from 'react'
// import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
// import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
// import { useState } from 'react'
// import Login from './components/Login'
// import Signup from './components/Signup'
// import axios from 'axios'


// const API_URL = "http://localhost:4000";

// //to get transcation from local storage
// const getTransactionFromStorage = () => {
//   const saved = localStorage.getItem("transactions");
//   return saved ? JSON.parse(saved) : [];

// }

// // //to protect the routes
// const ProtectedRoute = ({ user, children }) => {

//   const localToken = localStorage.getItem("token");
//   const sessionToken = sessionStorage.getItem("token");
//   const hasToken = localToken || sessionToken;

//   if (!user || !hasToken) {
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
//     } catch (err) {
//       console.error("persistAuth error:", err);
//     }
//   };






//   const clearAuth = () => {
//     try {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       sessionStorage.removeItem("user");
//       sessionStorage.removeItem("token");


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


//   //to update user data both in state and storage
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
//     (async () => {
//       try {

//         const localUserRaw = localStorage.getItem('user')
//         const sessionUserRaw = sessionStorage.getItem('user')
//         const localToken = localStorage.getItem('token')
//         const sessionToken = sessionStorage.getItem('token')


//         const storedUser = localUserRaw ? JSON.parse(localUserRaw) : sessionUserRaw ? JSON.parse(sessionUserRaw) : null;

//         const storedToken = localToken || sessionToken || null;
//         const tokenFromLocal = !!localToken;

//         if (storedUser) {
//           setUser(storedUser);
//           setToken(storedToken);
//           setIsLoading(false);
//           return;

//         }

//         if (storedToken) {
//           try {

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
//     })
//   }, [])


//   useEffect(() => {

//     try {

//       localStorage.setItem("transaction", JSON.stringify(transaction))

//     } catch (err) {
//       console.error("error saving transactions:", err)
//     }





//   }, [transaction])



//   const handleLogin = ({ userData, remember = false, tokenFromApi = null }) => {
//     persistAuth(userData, tokenFromApi, remember);
//     navigate("/");
//   }


//   const handleSignup = ({ userData, remember = false, tokenFromApi = null }) => {
//     persistAuth(userData, tokenFromApi, remember);
//     navigate("/");
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
//         <Route path="signup" element={<Signup onSignup={handleSignup} />} />


//         <Route element={<ProtectedRoute user={user} >

//           <Layout user={user} 
//           onLogout={handleLogout}
//             transaction={transaction}
//             addTransaction={addTransaction}
//             editTransaction={editTransaction}
//             deleteTransaction={deleteTransaction}
//             refreshTransactions={refreshTransactions}

//            />


//         </ProtectedRoute>
//         }>
//           <Route path="/" element={
            
//             <Dashboard
//               transaction={transaction}
//               addTransaction={addTransaction}
//               editTransaction={editTransaction}
//               deleteTransaction={deleteTransaction}
//               refreshTransactions={refreshTransactions}
//             />
            
//             }  />
          
//         </Route>




       


//       </Routes>
//     </div>
//   )
// }

// export default App
















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

// const API_URL = "http://localhost:4000";

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

// //to protect the routes - FIXED: Added better logging and condition
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

//   // If we have token but no user in state, we might still be loading
//   // Return children only if we have either user or token
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

//   //to save the token - FIXED: Better handling
//   const persistAuth = (userObj, tokenStr, remember = false) => {
//     console.log("persistAuth called:", { userObj, tokenStr, remember });
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


//     const updateUserData = (updatedUser) => {
//       setUser(updatedUser);

//       const localToken = localStorage.getItem('token')
//       const sessionToken = sessionStorage.getItem('token')

//       if (localToken) {
//         localStorage.setItem("user", JSON.stringify(updatedUser))
//       } else if (sessionToken) {
//         sessionStorage.setItem("user", JSON.stringify(updatedUser))
//       }

//     }


//   // try to load user with token when mounted - FIXED: Actually call the function
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

//     loadAuth(); // Call the function
//   }, [])

//   useEffect(() => {
//     try {
//       localStorage.setItem("transactions", JSON.stringify(transaction))
//     } catch (err) {
//       console.error("error saving transactions:", err)
//     }
//   }, [transaction])

//   const handleLogin = ({ userData, remember = false, tokenFromApi = null }) => {
//     console.log("handleLogin called:", { userData, remember, tokenFromApi });
//     if (userData && tokenFromApi) {
//       persistAuth(userData, tokenFromApi, remember);
//     } else {
//       console.error("Missing userData or token in handleLogin");
//     }
//   }

//   const handleSignup = ({ userData, remember = false, tokenFromApi = null }) => {
//     console.log("handleSignup called:", { userData, remember, tokenFromApi });
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

//         {/* Protected routes - FIXED: Simplified structure */}
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
//             <Income transaction={transaction}
//               addTransaction={addTransaction}
//               editTransaction={editTransaction}
//               deleteTransaction={deleteTransaction}
//               refreshTransactions={refreshTransactions} /> 


//           }
//            />

//           <Route path="/expense" element={
//             <Expense transaction={transaction}
//               addTransaction={addTransaction}
//               editTransaction={editTransaction}
//               deleteTransaction={deleteTransaction}
//               refreshTransactions={refreshTransactions} />


//           } 
//             />


//             <Route  path="/profile" 
//              element={<Profile user={user}
//              onUpdateProfile={updateUserData}
             
//               onLogout={handleLogout}    />}     />


//         </Route>


//         <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace   />}     />
//       </Routes>
//     </div>
//   )
// }

// export default App


















// import React, { useEffectEvent } from 'react'
// import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
// import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
// import { useState, useEffect } from 'react'
// import Login from './components/Login'
// import Signup from './components/Signup'
// import axios from 'axios'
// import Income from './pages/Income'

// const API_URL = 'http://localhost:4000'


// // to get transcation from local storage 
// const getTranscationsFromStorage  = () => {
//   const saved = localStorage.getItem("transactions");
//   return saved ? JSON.parse(saved) : [];
// }
// //to protect the routes
// const protectedRoute = ({ user, children}) => {

//   const localToken = localStorage.getItem("token");
//   const sessionToken = sessionStorage.getItem("token");
//   const hasToken = localToken || sessionToken;

//   if (!user || !hasToken) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// const scrollToTop = () => {
//   const location = useLocation();

//   useEffect(() => {
//        window.scrollTo({top: 0,  left: 0, behavior: 'auto'})
//   }, [location.pathname ])

//   return null;
// }


// const App = () => {

//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // Load user data from storage on app mount
//   useEffect(() => {
//     const loadStoredData = async () => {
//       try {
//         // Check localStorage first, then sessionStorage
//         let storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
//         let storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

//         if (storedToken && storedUser) {
//           try {
//             const userData = JSON.parse(storedUser);
//             setUser(userData);
//             setToken(storedToken);

//             // Set axios default header for all requests
//             axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

//             // Optional: Verify token with backend and get fresh user data
//             const response = await axios.get(`${API_URL}/api/user/me`);
//             const freshUserData = response.data.user || response.data;
//             setUser(freshUserData);

//             // Update stored user data
//             const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
//             storage.setItem("user", JSON.stringify(freshUserData));

//           } catch (err) {
//             console.error("Failed to load stored user data:", err);
//             // If token is invalid, clear it
//             if (err.response?.status === 401) {
//               clearAuth();
//             }
//           }
//         }
//       } catch (err) {
//         console.error("loadStoredData error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadStoredData();
//   }, []);

//   // Save auth data
//   const persistAuth = (userObj, tokenStr, remember = false) => {
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

//       // Set axios default header
//       if (tokenStr) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${tokenStr}`;
//       }
//     } catch (err) {
//       console.error("persistAuth error:", err);
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
//       console.error("clearAuth error:", err);
//     }
//     setUser(null);
//     setToken(null);
//   }

//   const handleLogout = () => {
//     clearAuth();
//     navigate("/login");
//   }

//   // Fixed: handleLogin expects the parameters correctly
//   const handleLogin = (userData, remember = false, tokenFromApi = null) => {
//     persistAuth(userData, tokenFromApi, remember);
//     navigate("/");
//   }

//   const handleSignup = (userData, remember = false, tokenFromApi = null) => {
//     persistAuth(userData, tokenFromApi, remember);
//     navigate("/");
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Routes>
//         <Route
//           path="/login"
//           element={<Login onLogin={handleLogin} API_URL={API_URL} />}
//         />
//         <Route
//           path="/signup"
//           element={<Signup onSignup={handleSignup} API_URL={API_URL} />}
//         />
//         <Route
//           element={<Layout user={user} onLogout={handleLogout} />}
//         >
//           <Route path="/" element={<Dashboard user={user} />} />
//           <Route  path="/income" element={<Income  user={user}  />}  />
//         </Route>
//       </Routes>
//     </div>
//   )
// }

// export default App
















































































































































































































import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import { useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import axios from 'axios'
import Income from './pages/Income'
import Expense from './pages/Expense'
import Profile from './pages/Profile'

const API_URL = "http://localhost:4000";

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
    </div>
  )
}

export default App