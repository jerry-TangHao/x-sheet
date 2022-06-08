import { XlsxImport } from '../../io/xlsx/XlsxImport';

self.addEventListener('message', async (event) => {
  const { file, dpr, unit, dpi } = event.data;
  const xlsx = new XlsxImport({ xlsx: file, dpr, unit, dpi });
  self.postMessage(await xlsx.import());
});
