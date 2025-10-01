
import type { JobPosting } from '../types';

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJson(data: JobPosting[], filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  triggerDownload(blob, filename);
}

export function downloadCsv(data: JobPosting[], filename:string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  data.forEach(row => {
    const values = headers.map(header => {
      const escaped = ('' + (row as any)[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  triggerDownload(blob, filename);
}
