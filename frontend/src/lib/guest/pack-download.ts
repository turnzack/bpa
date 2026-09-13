import { GeneratedPack } from '../../types/pack';

export async function downloadPackZip(pack: GeneratedPack): Promise<void> {
  let JSZip: any = null;

  try {
    // Dynamic variable import bypasses Vite's static AST import scanner
    const moduleName = 'jszip';
    const jszipModule = await import(/* @vite-ignore */ moduleName);
    JSZip = jszipModule.default || jszipModule;
  } catch {
    // Fallback script loading from CDN
    if (!(window as any).JSZip) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Impossible de charger JSZip depuis le CDN.'));
        document.head.appendChild(script);
      });
    }
    JSZip = (window as any).JSZip;
  }

  if (!JSZip) {
    throw new Error('JSZip indisponible pour la génération du fichier ZIP.');
  }

  const zip = new JSZip();
  const folder = zip.folder(pack.folderName) || zip;

  pack.files.forEach(file => {
    folder.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${pack.folderName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
