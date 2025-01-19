import { ReactNode } from "react";
import { Report } from "../../interfaces/report.interface";
import styles from "../styles/tableView.module.css"

interface ReportTableProps {
  children: ReactNode;
  reports: Report[] | undefined;
  handleExport: (index: number) => void;
};

const ReportTable = ({ children, reports, handleExport }: ReportTableProps) => {
  return (
    <>
      <h3>{children}</h3>
      <table className={styles.bookings}>
        <thead>
          <tr>
            <th>date sended</th>
            <th>hotels</th>
            <th>sended bookings</th>
            <th>error mappings</th>
            <th>xls report</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(reports) && reports?.map((el, i) => {
            return (
              <tr key={i}>
                <td>{el.dateInputed}</td>
                <td>{el.parserHotels.join(", ")}</td>
                <td>{el.sendedBookings.length}</td>
                <td>{el.errorMappings?.length}</td>
                <td onClick={() => handleExport(i)}>
                  <span>export</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default ReportTable;