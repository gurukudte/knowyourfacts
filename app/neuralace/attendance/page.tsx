"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { parseOfficeTime, parseTime } from "./utils/calculateTimes";
import Papa from "papaparse";
import { getData } from "./utils/time";
interface AttendanceRecord {
  employeeId: string;
  name: string;
  date: string;
  totalPunchIns: number;
  totalDuration: string;
  totalBreaks: number;
  breakDuration: string;
  loginTime: string;
  logoutTime: string;
}

export default function AttendanceDashboard() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData: any[] = XLSX.utils.sheet_to_json(sheet);
      // const id = 32;
      // console.log(parsedData[id]["Date"], parsedData[id]["Employee Name"]);
      // const resData = getData(parsedData[id]["Punch Records "]);
      // console.log(resData.loginTime);
      const formattedData = parsedData
        .filter(
          (item) =>
            item[" Employee Code "] !== 100 && item[" Employee Code "] !== 9999
        )
        .map((data, index) => {
          let results: any = {
            loginTime: "NotAvailable",
            logoutTime: "NotAvailable",
            totalWorkTime: "NotAvailable",
            totalBreakTime: "NotAvailable",
            breakCount: 0,
          };
          const resData = getData(data["Punch Records "]);
          return {
            employeeId: data[" Employee Code "],
            name: data["Employee Name"],
            date: data["Date"],
            totalPunchIns: data["Employee Name"],
            totalDuration: results?.totalWorkTime,
            totalBreaks: results?.breakCount,
            breakDuration: results?.totalBreakTime,
            loginTime: resData?.loginTime,
            logoutTime: resData?.logoutTime,
          };
        });
      console.log(formattedData);
      // const formattedData = parsedData
      //   .filter(
      //     (item) =>
      //       item[" Employee Code "] !== 100 && item[" Employee Code "] !== 9999
      //   )
      //   .map((data, index) => {
      //     let results: any = {
      //       loginTime: "",
      //       logoutTime: "",
      //       totalWorkTime: "",
      //       totalBreakTime: "",
      //       breakCount: 0,
      //     };

      //     if (data["Punch Records "]) {
      //       const res = parseOfficeTime(data["Punch Records "]);
      //       results = {
      //         loginTime: res.login || "",
      //         logoutTime: res.logout || "",
      //         totalWorkTime: res.totalInOffice || "",
      //         totalBreakTime: res.totalBreak || "",
      //         breakCount: res.breaksCount || "",
      //       };
      //       results = {
      //         loginTime: "",
      //         logoutTime: "",
      //         totalWorkTime: "",
      //         totalBreakTime: "",
      //         breakCount: 0,
      //       };
      //     }
      //     return {
      //       employeeId: data[" Employee Code "],
      //       name: data["Employee Name"],
      //       date: data["Date"],
      //       totalPunchIns: data["Employee Name"],
      //       totalDuration: results?.totalWorkTime,
      //       totalBreaks: results?.breakCount,
      //       breakDuration: results?.totalBreakTime,
      //       loginTime: results?.loginTime,
      //       logoutTime: results?.logoutTime,
      //     };
      //   });

      setAttendanceData(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredData = attendanceData?.filter(
    (record) =>
      (record?.name?.toString().toLowerCase().includes(search.toLowerCase()) ||
        record?.employeeId
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (date ? record?.date === date : true)
  );

  // useEffect(() => {
  //   const fetchCsvData = async () => {
  //     const response = await fetch("/data/myfile.csv"); // Path to the CSV file in the public folder
  //     const reader = response.body?.getReader();
  //     const result = await reader?.read();
  //     const decoder = new TextDecoder("utf-8");
  //     const csvString = decoder.decode(result?.value);

  //     Papa.parse(csvString, {
  //       header: true,
  //       dynamicTyping: true,
  //       complete: (results: any) => {
  //         const parsedData: any[] = results.data;
  //         const id = 32;
  //         // console.log(parsedData[id]["Date"], parsedData[id]["Employee Name"]);
  //         // const resData = getData(parsedData[id]["Punch Records "]);
  //         // console.log(resData.loginTime);
  //         const formattedData = parsedData
  //           .filter(
  //             (item) =>
  //               item[" Employee Code "] !== 100 &&
  //               item[" Employee Code "] !== 9999
  //           )
  //           .map((data, index) => {
  //             let results: any = {
  //               loginTime: "",
  //               logoutTime: "",
  //               totalWorkTime: "",
  //               totalBreakTime: "",
  //               breakCount: 0,
  //             };

  //             const res = getData(data["Punch Records "]);
  //             results = {
  //               loginTime: res.loginTime,
  //               logoutTime: res.logoutTime,
  //               totalWorkTime: "",
  //               totalBreakTime: "",
  //               breakCount: 0,
  //             };
  //             return {
  //               employeeId: data[" Employee Code "],
  //               name: data["Employee Name"],
  //               date: data["Date"],
  //               totalPunchIns: data["Employee Name"],
  //               totalDuration: results?.totalWorkTime,
  //               totalBreaks: results?.breakCount,
  //               breakDuration: results?.totalBreakTime,
  //               loginTime: results?.loginTime,
  //               logoutTime: results?.logoutTime,
  //             };
  //           });
  //         console.log(formattedData);
  //         setAttendanceData(formattedData);
  //       },
  //     });
  //   };

  //   fetchCsvData();
  // }, []);
  return (
    <div className="relative p-6 max-w-full mx-auto bg-gray-900 text-gray-200 min-h-screen">
      <Card className="shadow-lg rounded-2xl bg-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
            <Input
              placeholder="Search by name or Employee ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-1/3 w-full bg-gray-700 text-white border-gray-600"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="md:w-1/4 w-full bg-gray-700 text-white border-gray-600"
            />
            <Button
              onClick={() => {
                setSearch("");
                setDate("");
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              Reset
            </Button>
            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileUpload}
              className="text-white"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-md">
            <div className="relative max-h-64 overflow-y-auto">
              <Table className="relative min-w-full bg-gray-800">
                <TableHeader className="w-full top-0 bg-gray-700">
                  <TableRow>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Employee ID
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Name
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Date
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Total Punch In's
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Total Duration
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Total Breaks
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Break Duration
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Login Time
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 text-gray-300">
                      Logout Time
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredData.map((record, index) => (
                    <TableRow
                      key={record.name + index}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <TableCell className="px-4 py-2 text-gray-300">
                        {record.employeeId}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-gray-300">
                        {record.name}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-gray-300">
                        {record.date}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-gray-300">
                        0
                      </TableCell>
                      <TableCell className="px-4 py-2 text-gray-300">
                        {record.totalDuration}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-gray-300">
                        {record.totalBreaks}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-gray-300">
                        {record.breakDuration}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-gray-300">
                        {record.loginTime}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-gray-300">
                        {record.logoutTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
