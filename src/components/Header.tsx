import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/auth.context';
import styles from './styles/navigation.module.css';

const Header = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    return (
        <>
            <div className={styles.navWrap}>
                <nav >
                    <div className={styles.topnav}>
                        <NavLink to="/bookings" className={({ isActive }: { isActive: boolean }) => isActive ? styles.navButtonActive : styles.navButton}>bookings</NavLink>
                        <NavLink to="/history" className={({ isActive }: { isActive: boolean }) => isActive ? styles.navButtonActive : styles.navButton}>history</NavLink>
                        <NavLink to="/reports" className={({ isActive }: { isActive: boolean }) => isActive ? styles.navButtonActive : styles.navButton}>reports</NavLink>
                        <NavLink to="/accommodations" className={({ isActive }: { isActive: boolean }) => isActive ? styles.navButtonActive : styles.navButton}>map accommodations</NavLink>
                        <NavLink to="/hotel-map" className={({ isActive }: { isActive: boolean }) => isActive ? styles.navButtonActive : styles.navButton}>map hotels</NavLink>
                        <NavLink to="/users" className={({ isActive }: { isActive: boolean }) => isActive ? styles.navButtonActive : styles.navButton}>users</NavLink>
                        {/* <NavLink to="/bookings" style={({ isActive }) => isActive ? { textDecoration: "none", color: 'grey' } : { color: 'blue' }}>bookings</NavLink> */}
                    </div>
                </nav>
                <h2 className={styles.headerTitle}>Solvex Hotel Booking Manager </h2>
                <div>user: {user?.name}</div>
                <div className={styles.logOut} onClick={() => navigate('/logout')}></div>
                {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0" /> */}
            </div>
        </>

    )
}

export default Header;
