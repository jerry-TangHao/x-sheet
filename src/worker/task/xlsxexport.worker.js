import { XlsxExport } from '../../io/xlsx/XlsxExport';

addEventListener('message', async (event) => {
  const { workOptions, sheetList, dpr, unit, dpi } = event.data;
  const xlsx = new XlsxExport({
    workOptions, sheetList, dpr, unit, dpi,
  });
  postMessage(await xlsx.export());
});
