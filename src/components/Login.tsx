import { useRef, useState, useEffect, useContext } from 'react'
import AuthContext from './context/AuthProvider'

import axios from './api/axios'
const LOGIN_URL = '/auth'

const Login = () => {
    const { setAuth } = useContext(AuthContext)
    const userRef = useRef<HTMLInputElement>(null)
    const errRef = useRef<HTMLDivElement>(null) 

    const [user, setUser] = useState<string>('')
    const [pwd, setPwd] = useState<string>('')
    const [errMsg, setErrMsg] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({user, pwd}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
                );
            console.log(JSON.stringify(response?.data));

            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken })
            setUser('');
            setPwd('');
            setSuccess(true);
        
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if(!err?.response) {
                setErrMsg('No Server Rersponse')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            } 

            if (errRef.current) {
                errRef.current.focus();
            }
        }
        
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                        <a href="#">Sign out</a>
                    </p>
                </section>
                ) : ( 
                <section>
                    <p
                        ref = {errRef}
                        className = {errMsg ? "errMsg" : "offscreen"}
                        aria-live='assertive'
                    >
                        {errMsg}
                    </p>
                    <h1>
                        Sign In
                    </h1>
                    <form onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        await handleSubmit(e);
                    }}>
                        <label htmlFor="username">Username: </label>
                        <input
                            type="text"
                            id='username'
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />

                        <label htmlFor="password">Password: </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>
                            Sign In
                        </button>
                        <p>
                            Need an Account? <br />
                            <span className="line">
                                {/* {router link} */}
                                <a href="#">Sign Up</a>
                            </span>
                        </p>
                    </form>
                </section>
            )}
        </>
    )
}

export default Login;