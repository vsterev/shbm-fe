import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./OutletTemplate.module.css";
import IntegrationSelector from "./IntegrationSelector";
const OutletTemplate = () => {
  const location = useLocation();
  return (
    <>
      <div className={styles.pageContainer}>
        <Header />
        {!["users", "history"].includes(
          location.pathname.substring(1, location.pathname.length),
        ) && <IntegrationSelector />}
        <Outlet />
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </>
  );
};
export default OutletTemplate;
