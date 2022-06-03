import { XlsxImport } from '../../io/xlsx/XlsxImport';

addEventListener('message', async (event) => {
  const { file, dpr, unit, dpi } = event.data;
  const xlsx = new XlsxImport({ xlsx: file, dpr, unit, dpi });
  postMessage(await xlsx.import());
});
