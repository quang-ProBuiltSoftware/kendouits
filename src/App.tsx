import React, { useEffect, useState } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { fetchCustomerList } from "./api";
import { Record, PageState } from "./types";
import {
  Grid,
  GridColumn as Column,
  GridPageChangeEvent,
} from "@progress/kendo-react-grid";
import { PagerTargetEvent } from "@progress/kendo-react-data-tools";
import { PDFViewer } from "@progress/kendo-react-pdf-viewer";
import jsPDF from "jspdf";

const initialDataState: PageState = { skip: 0, take: 5 };

function App() {
  const [customerData, setCustomerData] = useState<Record[] | null | undefined>(
    null
  );
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  // PDF Export
  const pdfExportComponent = React.useRef<PDFExport>(null);

  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      const pdfDoc = new jsPDF();
      
      // Generate base64 representation
      const base64 = pdfDoc.output("dataurlstring");
      
      // Convert binary data to Base64
      const uint8Array = new Uint8Array(base64.split(',').map(Number));
      const byteArray = Array.from(uint8Array);
      const base64Data = btoa(String.fromCharCode.apply(null, byteArray));
      
      // Do something with the base64 data, e.g., set it in the state
      setPdfBase64(base64Data);
    }
  };

  

  //Paging
  const [page, setPage] = React.useState<PageState>(initialDataState);
  const [pageSizeValue, setPageSizeValue] = React.useState<
    number | string | undefined
  >();
  const pageChange = (event: GridPageChangeEvent) => {
    const targetEvent = event.targetEvent as PagerTargetEvent;
    const take =
      targetEvent.value === "All" ? customerData?.length : event.page.take;

    if (targetEvent.value) {
      setPageSizeValue(targetEvent.value);
    }
    setPage({
      ...event.page,
      take: take || 0, // Provide a default value of 0 if take is undefined
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCustomerList();

      if (result) {
        setCustomerData(result.data.records);
      } else {
        setCustomerData([]);
      }
    };

    fetchData();
  }, []);

  const grid = (
    <Grid
      data={customerData?.slice(page.skip, page.take + page.skip)}
      skip={page.skip}
      take={page.take}
      total={customerData?.length}
      pageable={{
        buttonCount: 4,
        pageSizes: [5, 10, 15, "All"],
        pageSizeValue: pageSizeValue,
      }}
      onPageChange={pageChange}
    >
      <Column field="Address1" title="Address" width="150px" />
      <Column field="City" title="City" width="100px" />
      <Column field="Department" title="Department" />
      <Column field="EmailMain" title="EmailMain" />
      <Column field="EntityName" title="EntityName" />
      <Column field="IDNo" title="IDNo" />
      <Column field="JobTitle" title="JobTitle" />
      <Column field="LocCode" title="LocCode" />
      <Column field="MainPhone" title="MainPhone" />
      <Column field="MobilePhone" title="MobilePhone" />
      <Column field="Notes" title="Notes" width="350px" />
      <Column field="PrimaryContact" title="PrimaryContact" />
      <Column field="State" title="State" />
      <Column field="TermsCodeID" title="TermsCodeID" />
      <Column field="Zip" title="Zip" />
    </Grid>
  );

  return (
    <div className="App">
      <div className="example-config">
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={exportPDFWithComponent}
        >
          Export with component
        </button>
      </div>
      {pdfBase64 ? (
        <PDFViewer data={pdfBase64} style={{height:"500px"}}/>
      ) : (
        <PDFExport
          ref={pdfExportComponent}
          paperSize="A4"
          margin={20}
          fileName={`Report for ${new Date().getFullYear()}`}
          author="KendoReact Team"
        >
          {grid}
        </PDFExport>
      )}
    </div>
  );
}

export default App;
