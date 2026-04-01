// import React, { useState } from 'react'
// import { loginStyles } from '../assets/dummyStyles'
// import { Eye, EyeOff, Lock, Mail, ShieldAlertIcon, User } from 'lucide-react'
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Login = ({ onLogin , API_URL= "http://localhost:4000"}) => {

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [rememberMe, setRememberMe] = useState(false);
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();


     
//     //to fetch profile
//     const fetchProfile = async (token) => {
//         if (!token) return null;
//         const res = await axios.get(`${API_URL}/api/user/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//         return res.data
//     }

//     const persistAuth = (profile, token) => {
//        const storage = rememberMe ? localStorage : sessionStorage;
//        try{
//         if(token) storage.setItem("token", token);
//         if(profile) storage.setItem("user", JSON.stringify(profile));

//        }catch(err){
//         console.error("persistAuth error:", err)
//        }
//     };

//     //login
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError("");

//         try{
//             const res = await axios.post(`${API_URL}/api/user/login`, { email, password },

//                 { headers: { "Content-Type": "application/json" } }
//             );
//             const data = res.data || {};
//             const token = data.token || null;

//             //to derive user profile
//             let profile = data.user ?? null;
//             if (!profile){
//                const copy = { ...data };
//                delete copy.token;
//                delete copy.user;

//                if(Object.keys(copy).length > 0){
//                 profile = copy;

//                }
//             }
//             if(!profile && token){
//                 try{
//                      profile = await fetchProfile(token);
//                 }catch(fetchErr){
//                    console.warn("could not fetch profile after login token", fetchErr);
//                    profile = {email};
//                 }
//             }

//             if(!profile) profile = {email};
//             persistAuth(profile, token);

//             if(typeof onLogin === "function"){
//                 try{
//                     onLogin(profile, rememberMe, token)

//                 }catch(callErr){
//                     console.warn("onLogin threw:", callErr);
//                     navigate("/");
//                 }
//             }else{
//                 navigate("/");
//             }
//             setPassword("");

            

//         } catch (err) {
//             console.error("Login error:", err?.response || err);
//             const serverMsg =
//                 err.response?.data?.message ||
//                 (err.response?.data ? JSON.stringify(err.response.data) : null) ||
//                 err.message ||
//                 "Login failed";
//             setError(serverMsg);
//         } finally{
//             setIsLoading(false);
//         }

//     }


//   return (
//     <div className={loginStyles.pageContainer} > 
    

//      <div className={loginStyles.cardContainer}>

//         <div className={loginStyles.header} >
//            <div className={loginStyles.avatar} >
//               <User className='w-10 h-10  text-white' />
//            </div>

//            <h1 className={loginStyles.headerTitle}>
//                 Welcome Back!
//            </h1>
//            <p className={loginStyles.headerSubtitle}>
//                Sign in to your ExpenseTracker account
//            </p>
//         </div>

//         <div className={loginStyles.formContainer}>

//                   {error && (
//                       <div className={loginStyles.errorContainer}>
//                           <div className={loginStyles.errorIcon}>
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                                   <path
//                                       fillRule="evenodd"
//                                       d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                                       clipRule="evenodd"
//                                   />
//                               </svg>
//                           </div>
//                           <span className={loginStyles.errorText}>{error}</span>
//                       </div>
//                   )}

//                   <form onSubmit={handleSubmit}>
                        
//                         <div className='mb-6'>
                           
//                            <label htmlFor="email" className={loginStyles.label}>
//                                Email Address
//                            </label>
//                           <div className={loginStyles.inputContainer}>

//                             <div className={loginStyles.inputIcon} >
//                                <Mail  className='w-5 h-5 '  />
//                             </div>

//                             <input type="email" id="email" value={email} 
//                             onChange={(e) => setEmail(e.target.value)}
//                             className={loginStyles.input} placeholder='farhan@example.com' required />

//                           </div>
//                         </div>

//                       <div className='mb-6'>

//                           <label htmlFor="password" className={loginStyles.label}>
//                               Password
//                           </label>
//                           <div className={loginStyles.inputContainer}>

//                               <div className={loginStyles.inputIcon} >
//                                   <Lock className='w-5 h-5 ' />
//                               </div>

//                               <input type={showPassword ? "text" : "password"} id="password" value={password}
//                                   onChange={(e) => setPassword(e.target.value)}
//                                   className={loginStyles.passwordInput} placeholder='farhan@example.com' required />

//                               <button type='button' onClick={() => setShowPassword(!showPassword)}
//                                 className={loginStyles.passwordToggle}>
                                    
//                                     {showPassword ? (
//                                         <EyeOff className='w-5 h-5' />
//                                     ) : (
//                                         <Eye className='w-5 h-5' />
//                                     )}
                                    
                                    
//                                     </button>    

//                           </div>
//                       </div>



//                       <div className={loginStyles.checkboxContainer} >

//                           <input type="checkbox" id="remember" checked={rememberMe}
//                               onChange={(e) => setRememberMe(e.target.checked)}
//                               className={loginStyles.checkbox}  required />


//                               <label htmlFor="remember" className={loginStyles.checkboxLabel}>
//                                 Remember Me
//                               </label>


//                       </div>

//                       <button type='submit' disabled={isLoading} className={`${loginStyles.button} ${isLoading ? loginStyles.buttonDisabled : ''}`} >
                           
//                            {isLoading ? (
//                               <>
//                                   <svg className={loginStyles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                   </svg>
//                                   Signing in...
//                               </>
//                            ) : (
//                             "Sign In"
//                            )}
//                       </button>
//                   </form>

//         </div>

//      </div>



//     </div>
//   )
// }

// export default Login




import React, { useState } from 'react'
import { loginStyles } from '../assets/dummyStyles'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin, API_URL = "http://localhost:4000" }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch profile after login
    const fetchProfile = async (token) => {
        if (!token) return null;
        try {
            const res = await axios.get(`${API_URL}/api/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.user || res.data;
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            return null;
        }
    }

    // Persist auth data
    const persistAuth = (profile, token) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        try {
            if (token) storage.setItem("token", token);
            if (profile) storage.setItem("user", JSON.stringify(profile));

            // Also set in localStorage for axios defaults if remember me is checked
            if (rememberMe && token) {
                localStorage.setItem("token", token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        } catch (err) {
            console.error("persistAuth error:", err);
        }
    };

    // Login handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Fix: Remove extra /api/ since API_URL already includes it
            const response = await axios.post(`${API_URL}/api/user/login`, {
                email,
                password
            }, {
                headers: { "Content-Type": "application/json" }
            });

            const data = response.data;
            const token = data.token;

            if (!token) {
                throw new Error("No token received from server");
            }

            // Get user profile from response or fetch it
            let profile = data.user || data;

            // If profile doesn't have name/email, fetch it
            if ((!profile.name || !profile.email) && token) {
                const fetchedProfile = await fetchProfile(token);
                if (fetchedProfile) {
                    profile = fetchedProfile;
                }
            }

            // Ensure profile has at least email
            if (!profile.email && email) {
                profile.email = email;
            }

            // Save auth data
            persistAuth(profile, token);

            // Call onLogin callback if provided
            if (typeof onLogin === "function") {
                // onLogin(profile, rememberMe, token); ///////////////////////////////////////////////////changed it
                onLogin({
                    userData: profile,
                    remember: rememberMe,
                    tokenFromApi: token
                });
                navigate("/");
            }

            // Clear password and navigate
            setPassword("");
            navigate("/");

        } catch (err) {
            console.error("Login error:", err);

            let errorMessage = "Login failed. Please try again.";

            if (err.response) {
                // Server responded with error
                if (err.response.status === 401) {
                    errorMessage = "Invalid email or password";
                } else if (err.response.status === 404) {
                    errorMessage = "Login endpoint not found. Please check your backend.";
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.request) {
                // Request was made but no response
                errorMessage = "Cannot connect to server. Please check if backend is running.";
            } else {
                // Something else happened
                errorMessage = err.message || "An error occurred during login";
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={loginStyles.pageContainer}>
            <div className={loginStyles.cardContainer}>
                <div className={loginStyles.header}>
                    <div className={loginStyles.avatar}>
                        <User className='w-10 h-10 text-white' />
                    </div>
                    <h1 className={loginStyles.headerTitle}>
                        Welcome Back!
                    </h1>
                    <p className={loginStyles.headerSubtitle}>
                        Sign in to your ExpenseTracker account
                    </p>
                </div>

                <div className={loginStyles.formContainer}>
                    {error && (
                        <div className={loginStyles.errorContainer}>
                            <div className={loginStyles.errorIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className={loginStyles.errorText}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className='mb-6'>
                            <label htmlFor="email" className={loginStyles.label}>
                                Email Address
                            </label>
                            <div className={loginStyles.inputContainer}>
                                <div className={loginStyles.inputIcon}>
                                    <Mail className='w-5 h-5' />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={loginStyles.input}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className='mb-6'>
                            <label htmlFor="password" className={loginStyles.label}>
                                Password
                            </label>
                            <div className={loginStyles.inputContainer}>
                                <div className={loginStyles.inputIcon}>
                                    <Lock className='w-5 h-5' />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={loginStyles.passwordInput}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={loginStyles.passwordToggle}
                                >
                                    {showPassword ? (
                                        <EyeOff className='w-5 h-5' />
                                    ) : (
                                        <Eye className='w-5 h-5' />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={loginStyles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={loginStyles.checkbox}
                            />
                            <label htmlFor="remember" className={loginStyles.checkboxLabel}>
                                Remember Me
                            </label>
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className={`${loginStyles.button} ${isLoading ? loginStyles.buttonDisabled : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className={loginStyles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>


                    <div className={loginStyles.signUpContainer} >

                        <p className={loginStyles.signUpText}>
                            Don't have an account?{" "}
                            <Link to="/signup" className={loginStyles.signUpLink}>
                               Create one
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login