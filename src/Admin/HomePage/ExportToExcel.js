import React, { useContext, useState } from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { MenuItem, useColorMode } from '@chakra-ui/react'
import { FullPageSpinner } from '../../utils/spinner';
import api from '../../api';
import { AppContext } from '../../App';

export const ExportToExcel = () => {
    
    const {doctor,doctors} = useContext(AppContext)
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = `${doctors.find((item)=>item.doctorID==doctor)?.name} ${new Date().toDateString()}`
    const [isLoading, setIsLoading] = useState(false)

    const exportToCSV = () => {
        setIsLoading(true)
        api.token.fetchDataForExcel({doctor}).then((res) => {
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