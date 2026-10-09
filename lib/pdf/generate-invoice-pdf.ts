"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Invoice } from "@/lib/types/invoice";

export async function generateInvoicePDF(
  elementId: string,
  invoice: Invoice
): Promise<{ success: boolean; error?: string }> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      return { success: false, error: "Invoice preview element not found." };
    }

    // Capture element with html2canvas at high resolution
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL("image/png");

    // Standard A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Calculate image height based on aspect ratio
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;

    // Multi-page support if invoice exceeds 1 A4 page
    while (heightLeft > 5) {
      position = position - pdfHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;
    }

    const filename = `${invoice.invoiceNumber || "invoice"}.pdf`;
    doc.save(filename);

    return { success: true };
  } catch (err: unknown) {
    console.error("PDF generation failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to generate PDF." };
  }
}
