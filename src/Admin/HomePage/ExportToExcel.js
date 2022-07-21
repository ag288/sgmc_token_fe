import React, { useState } from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { MenuItem } from '@chakra-ui/react'
import { FullPageSpinner } from '../../utils/spinner';
import api from '../../api';

export const ExportToExcel = () => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = new Date().toDateString()
    const [isLoading, setIsLoading] = useState(false)

    const exportToCSV = () => {
        setIsLoading(true)
        api.token.fetchDataForExcel().then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            const ws = XLSX.utils.json_to_sheet(response);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
        })
    };

    return (
        isLoading ? <FullPageSpinner /> : <MenuItem onClick={() => exportToCSV()}>Download report</MenuItem>
    );
};