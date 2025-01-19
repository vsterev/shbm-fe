import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import styles from './OutletTemplate.module.css'
const OutletTemplate = () => {
    return (
        <>
            <div className={styles.pageContainer}>
                <Header />
                <Outlet />
            </div>
            <div className={styles.footer}>
                <Footer />
            </div>
        </>
    )
}
export default OutletTemplate;
