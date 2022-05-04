// table generation for excel export
const tableElement = document
  .getElementById("excel_table")
  .getElementsByTagName("tbody")[0];
tableElement.innerHTML = `<tr data-height="25">
<td class="" colspan='${PARAMETER.inputFields}' data-f-sz="20" data-f-color="ED6363" data-a-h="center" data-a-v="middle">Input Coordinates</td>
<td class="" colspan='${PARAMETER.outputFields}' data-f-sz="20" data-f-color="003545" data-a-h="center" data-a-v="middle">Output Results</td>
</tr>`;
const columnsTableElement = document.createElement("tr");
columnsTableElement.id = "table_headers";
for (const i of PARAMETER.fieldNames) {
  //const row = tableElement.getElementById('table_headers');
  columnsTableElement.innerHTML += `<td class="" colspan='' data-f-sz="16" data-f-color="ED6363" data-a-h="center" data-a-v="middle">${i}</td>`;
}
for (const i of PARAMETER.outputNames) {
  //const row = tableElement.getElementById('table_headers');
  columnsTableElement.innerHTML += `<td class="" colspan='' data-f-sz="16" data-f-color="00454A" data-a-h="center" data-a-v="middle">${i}</td>`;
}
tableElement.appendChild(columnsTableElement);

function convertExcel() {
  for (const j of resultSet) {
    const newColumnsTableElement = document.createElement("tr");
    for (const i of j.input) {
      //const row = tableElement.getElementById('table_headers');
      newColumnsTableElement.innerHTML += `<td class="" colspan='' data-f-sz="12" data-f-color="ED6363" data-a-h="center" data-a-v="middle">${i}</td>`;
    }
    for (const i of j.output) {
      //const row = tableElement.getElementById('table_headers');
      newColumnsTableElement.innerHTML += `<td class="" colspan='' data-f-sz="12" data-f-color="3C6562" data-a-h="center" data-a-v="middle">${i}</td>`;
    }
    tableElement.appendChild(newColumnsTableElement);
    TableToExcel.convert(tableElement.parentElement);
  }
}

const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", () => {
  convertExcel();
});