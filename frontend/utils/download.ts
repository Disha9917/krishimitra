export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(","),
    ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function triggerPrint() {
  if (typeof window !== "undefined") {
    window.print();
  }
}

export function downloadPDFSummary(title: string, content: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
          h1 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 8px; }
          .header { margin-bottom: 20px; font-size: 14px; color: #64748b; }
          .section { margin-bottom: 16px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .badge { display: inline-block; padding: 4px 8px; background: #d1fae5; color: #065f46; font-weight: bold; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>FasalDrishti AgriTech Advisory Report</h1>
        <div class="header">Generated on ${new Date().toLocaleDateString("en-IN")}</div>
        <div class="section">
          <h2>${title}</h2>
          <p>${content}</p>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}