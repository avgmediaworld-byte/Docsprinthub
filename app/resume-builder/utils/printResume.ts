export async function printResume() {

  const pages = Array.from(
    document.querySelectorAll(".document-page")
  );

  if (!pages.length) return;

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=1200"
  );

  if (!printWindow) return;

  const styles = Array.from(
    document.querySelectorAll(
      'link[rel="stylesheet"], style'
    )
  )
    .map((node) => node.outerHTML)
    .join("");

  printWindow.document.open();

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8" />

<title>Resume</title>

${styles}

<style>

@page{
    size:A4;
    margin:0;
}

html,
body{

    margin:0;
    padding:0;

    background:#ffffff;

    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;

}

body{

    width:210mm;

    margin:0 auto;

}

#print-root{

    width:210mm;

    margin:0 auto;

}

.document-page{

    width:210mm !important;

    min-height:296.5mm !important;

    height:auto !important;

    margin:0 auto !important;

    padding:0 !important;

    background:#ffffff !important;

    box-sizing:border-box !important;

    box-shadow:none !important;

    overflow:hidden !important;

    page-break-after:always;

    break-after:page;

}

.document-page:last-child{

    page-break-after:auto;

    break-after:auto;

}

.no-print,
.preview-toolbar,
.export-toolbar,
button{

    display:none !important;

}

</style>

</head>

<body>

<div id="print-root">

${pages
  .map((page) => page.outerHTML)
  .join("")}

</div>

<script>

window.onload = function(){

    setTimeout(function(){

        window.focus();

        window.print();

        window.close();

    },500);

};

</script>

</body>

</html>
`);

  printWindow.document.close();

}