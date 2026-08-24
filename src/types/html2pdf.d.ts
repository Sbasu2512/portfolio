declare module "html2pdf.js" {
  type Html2PdfOptions = {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      backgroundColor?: string;
    };
    jsPDF?: {
      unit?: string;
      format?: string | [number, number];
      orientation?: string;
    };
    pagebreak?: {
      mode?: string[];
    };
  };

  interface Html2PdfWorker {
    set(options: Html2PdfOptions): Html2PdfWorker;
    from(element: HTMLElement): Html2PdfWorker;
    save(): Promise<void>;
  }

  interface Html2Pdf {
    (): Html2PdfWorker;
  }

  const html2pdf: Html2Pdf;

  export default html2pdf;
}