import * as React from "react";

import invoicesApi from "apis/invoices";
import Pagination from "common/Pagination";

import Container from "./container";
import FilterSideBar from "./FilterSideBar";
import Header from "./Header";

import { ApiStatus as InvoicesStatus } from "../../../constants";

const Invoices = () => {
  const [status, setStatus] = React.useState<InvoicesStatus>(
    InvoicesStatus.IDLE
  );
  const [invoices, setInvoices] = React.useState<any>(null);
  const [summary, setSummary] = React.useState<any>(null);
  const [pagy, setPagy] = React.useState<any>(null);

  const [selectedInvoices, setSelectedInvoices] = React.useState<any[]>([]);

  const [isFilterVisible, setFilterVisibilty] = React.useState<boolean>(false);

  const selectedInvoiceCount = selectedInvoices.length;
  const isInvoiceSelected = selectedInvoiceCount > 0;

  React.useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setStatus(InvoicesStatus.LOADING);
      const {
        data: { invoices, pagy, summary }
      } = await invoicesApi.get();

      setInvoices(invoices);
      setSummary(summary);
      setPagy(pagy);

      setStatus(InvoicesStatus.SUCCESS);
    } catch (error) {
      setStatus(InvoicesStatus.ERROR);
    }
  };

  const selectInvoices = (invoiceIds: number[]) => {
    setSelectedInvoices(
      Array.from(new Set(selectedInvoices.concat(invoiceIds)))
    );
  };

  const deselectInvoices = (invoiceIds: number[]) =>
    setSelectedInvoices(
      selectedInvoices.filter((id) => !invoiceIds.includes(id))
    );

  return (
    status === InvoicesStatus.SUCCESS && (
      <React.Fragment>
        <Header
          setFilterVisibilty={setFilterVisibilty}
          clearCheckboxes={() =>
            deselectInvoices(invoices.map((invoice) => invoice.id))
          }
          selectedInvoiceCount={selectedInvoiceCount}
          isInvoiceSelected={isInvoiceSelected}
        />

        <Container
          summary={summary}
          invoices={invoices}
          selectedInvoices={selectedInvoices}
          selectInvoices={selectInvoices}
          deselectInvoices={deselectInvoices}
        />

        {isFilterVisible && (
          <FilterSideBar setFilterVisibilty={setFilterVisibilty} />
        )}

        {invoices.length && <Pagination pagy={pagy} />}
      </React.Fragment>
    )
  );
};

export default Invoices;
