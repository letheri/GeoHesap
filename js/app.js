const indexCalculationList = document.getElementById("calculationIndexList");
for (const i in calculations) {
  const PARAMETER = calculations[i];

  // Adds buttons on the front page
  indexCalculationList.innerHTML += `
  <li class='list-group-item d-flex mx-2 mb-2 functionBtn' style='background-color:gray'>
    <a class='col fs-3 calculatorLink' href="calculator.html?c=${i}" > ${PARAMETER.fullname} </a>
    <div class='col-1 fs-3 align-items-end'>
      <a class="bi bi-arrow-down-circle p-1 px-2"  id="goCalculation" data-bs-toggle="collapse" data-bs-target="#detail${i}"></a>
    </div>
    </li>
  <div class="collapse align-self-center " id="detail${i}">
    <div class="card card-body descriptor" style="">
    ${PARAMETER.description}
    </div>
  </div>
  
  `;
}

for (const i of document.getElementsByClassName("collapse")) {
  const siblingList = i.previousElementSibling;
  siblingList.getElementsByClassName("bi")[0].addEventListener("click", () => {
    siblingList.classList.toggle("mb-2");
    siblingList.classList.toggle("functionBtn");
    i.classList.toggle("mb-2");
  });
}

//calcList.innerHTML = processor_html;
