import { convertDocxToPdf } from "./converter";
import { LibreOfficeConversionError, toPrintableDiagnostics } from "./diagnostics";

async function main() {
  const [inputPath, outputDirectory] = process.argv.slice(2);
  if (!inputPath || !outputDirectory) {
    console.error("Usage: npm run convert -- <input.docx> <output-directory>");
    process.exitCode = 1;
    return;
  }
  try {
    const result = await convertDocxToPdf({ inputPath, outputDirectory });
    console.log(JSON.stringify(toPrintableDiagnostics(result), null, 2));
  } catch (error) {
    if (error instanceof LibreOfficeConversionError) {
      console.error(JSON.stringify({ message: error.message, ...toPrintableDiagnostics(error.diagnostics) }, null, 2));
    } else {
      console.error(error instanceof Error ? error.message : String(error));
    }
    process.exitCode = 1;
  }
}

void main();
