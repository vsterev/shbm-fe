import React, { useState } from 'react';
import userService from '../services/user'
import styles from './styles/Login.module.css'
import { Helmet } from 'react-helmet-async';
import { useAuthContext } from '../contexts/auth.context';
const UserLogin = () => {
    const [loginParams, setLoginParams] = useState<{ email: string, password: string } | undefined>(undefined);
    const [err, setErr] = useState(null)
    // const { logIn } = useContext(UserContext);
    const { setUser } = useAuthContext();
    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!loginParams) {
            return;
        }
        const { email, password } = loginParams;
        userService.login({ email, password })
            .then(r => {
                if (r.err) {
                    setErr(r.err)
                    return;
                }
                const { token, userData } = r;
                if (token && userData) {
                    document.cookie = `parser-token=${token}; path=/`;
                    setUser(userData)
                }
            })
            .catch(console.log)
    }
    return (
        <>
            <Helmet>
                <title>HBS - Login</title>
            </Helmet>
            {/* <h3>Login page</h3> */}
            <div className={styles.loginWrap}>
                <div className={styles.bg}></div>
                <h1 className={styles.test}>Solvex Hotel Booking Manager</h1>
                <form onSubmit={submitHandler}>
                    <div className={styles.formField}>
                        {/* <label htmlFor="email">e-mail: </label> */}
                        <input type="text" id="email" placeholder="e-mail" name="email" value={loginParams?.email || ''} onChange={(e) => setLoginParams({ ...loginParams, email: e.target.value, password: loginParams?.password || '' })} />
                    </div>
                    {/* <label htmlFor="password">password: </label> */}
                    <div className={styles.formField}>
                        <input type="password" placeholder="password" id="password" name="password" value={loginParams?.password || ''} onChange={(e) => setLoginParams({ ...loginParams, password: e.target.value, email: loginParams?.email || '' })} />
                    </div>
                    <div className={styles.formField}>
                        <button className={styles.btn}>Log in</button>
                    </div>
                </form>
                {!!err && <h2 className={styles.errormsg}>{err}</h2>}
            </div>
        </>
    )
}
export default UserLogin;