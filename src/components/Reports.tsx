import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import parserService from "../services/parser";
import parseCookie from "../utils/parseCookie";
import * as XLSX from "xlsx";
import Table from "../components/parserReports/Table";
// import UserContext from "../utils/userContext";
import type { Report } from "../interfaces/report.interface";
import { ParserBooking } from "../interfaces/booking.interface";

const Report = () => {
  const [reports, setReports] = useState<Report[] | undefined>(undefined);

  const token = parseCookie("parser-token");

  const touristModifieadArr = (reports: ParserBooking[]) => {
    return reports.map((booking) => {
      const newNames = booking.Names.map((el) => {
        return `${el.name} - ${el.birthDate}`;
      }).join(", ");
      return { ...booking, Names: newNames };
    });
  };

  // const { logOut } = useContext(UserContext);

  const handleExport = (ind: number) => {
    // const ws2 = XLSX.utils.json_to_sheet(mockData)
    const ws = XLSX.utils.aoa_to_sheet([
      [
        `sended: ${reports[ind].dateInputed.substring(0, 16)}`,
        `hotels: ${reports[ind].parserHotels.join(",")}`,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        `ip: ${reports[ind].ip}`,
      ],
    ]);

    const wscols = [
      { wch: 23 },
      { wch: 40 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 18 },
      { wch: 18 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 100 },
      { wch: 32 },
      { wch: 32 },
    ];

    ws["!cols"] = wscols;

    if (!reports) {
      return;
    }
    XLSX.utils.sheet_add_aoa(
      ws,
      [[], [`normal sended bookings: ${reports[ind].sendedBookings.length}`]],
      { origin: -1 }
    );
    if (reports[ind].sendedBookings.length) {
      XLSX.utils.sheet_add_json(
        ws,
        touristModifieadArr(reports[ind].sendedBookings),
        { origin: -1 }
      );
    }
    const ws2 = XLSX.utils.aoa_to_sheet(
      [[`bookings with error mappings: ${reports[ind].errorMappings?.length}`]]
    );
    ws2["!cols"] = wscols;
    if (reports[ind].errorMappings?.length) {
      XLSX.utils.sheet_add_json(
        ws2,
        touristModifieadArr(reports[ind].errorMappings),
        { origin: -1 }
      );
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Normal sended");
    XLSX.utils.book_append_sheet(wb, ws2, "Errors - not sended");
    XLSX.writeFile(
      wb,
      `${reports[ind].dateInputed.substring(0, 16)}-report.xlsx`
    );
  };

  useEffect(() => {
    // setTimeout (()=>{
    //   setReports([1, 2, 3]);

    // },5000)
    parserService
      .getReports(token)
      .then((res) => {
        if (res.msg) {
          logOut();
        }
        setReports(res);
      })
      .catch(console.log);
  }, []);

  return (
    <>
      <Helmet>
        <title>Parser reports</title>
      </Helmet>
      <h3>Parser Report</h3>
      {/* {(reports === null && <div>Loading.......</div>) ||
        reports.map((el, i) => {
          return (
            <div key={el._id}>
              {i + 1},{el.dateInputed},{el.ip},{el.parserHotels.join(", ")},{" "}
              {el.sendedBookings.length}, {el.errorMappings.length},{" "}
              <button onClick={() => handleExport(i)}>export</button>
            </div>
          );
        })} */}
      <Table reports={reports} handleExport={handleExport}>
        table reports
      </Table>
    </>
  );
};
export default Report