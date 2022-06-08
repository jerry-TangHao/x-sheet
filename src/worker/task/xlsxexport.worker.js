import { XlsxExport } from '../../io/xlsx/XlsxExport';

self.addEventListener('message', async (event) => {
  const { workOptions, sheetList, dpr, unit, dpi } = event.data;
  const xlsx = new XlsxExport({
    workOptions, sheetList, dpr, unit, dpi,
  });
  self.postMessage(await xlsx.export());
});
