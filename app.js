const calcList = document.getElementById('procL');
let processor_html = ''
for (const i in calculations) {
  calcList.innerHTML += `
  <div class="col">
    <div class="card shadow-sm">
      <div class='card-img-top'>
        <a class='bd-placeholder-img ' >
          <img class='blur'  src='${calculations[i].imagePath}' onerror="this.src='img/not_found.png';" >
        </a>
        <p class='card-info noselect' fill="#eceeef" >${calculations[i].fullname}</p>
        <div class='text-overlay-'>
          <a class='text-overlay' style='height:100%' id='${i}'></a>
        </div>
      </div>
    
      <div class="card-body">
        <p class="card-text ">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
          </div>
          <small class="text-muted">9 mins</small>
        </div>
      </div>
    </div>
  </div>`;
}

for (const i of document.getElementsByClassName("text-overlay")) {
  i.addEventListener("click", ()=>{
    currentCalculator=i
    window.location.href = "calculator.html?c="+i.id
  })
}

//calcList.innerHTML = processor_html;

const cards = document.getElementsByClassName('card-img-top')

for (const i of cards) {
  i.getElementsByClassName('text-overlay')[0].addEventListener("mouseenter",()=>{
    i.getElementsByTagName('p')[0].style.fontWeight = 'Bolder';
    i.getElementsByTagName('p')[0].style.top = '5%';
    i.getElementsByTagName('p')[0].style.backdropFilter = 'blur(3px)';
    i.getElementsByTagName('img')[0].classList.toggle('blur');

  })
  i.getElementsByClassName('text-overlay')[0].addEventListener("mouseleave",()=>{
    i.getElementsByTagName('p')[0].style.fontWeight = '';
    i.getElementsByTagName('p')[0].style.top = '25%';
    i.getElementsByTagName('p')[0].style.backdropFilter = '';
    i.getElementsByTagName('img')[0].classList.toggle('blur');


  })

  // i.addEventListener("mouseleave",()=>{
  //   i.parentElement.nextElementSibling.style.fontWeight = '';
  //   i.parentElement.nextElementSibling.style.top = '25%';
  //   i.parentElement.nextElementSibling.style.backdropFilter = '';

  // })

}

