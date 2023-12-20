// load 6 cards by default
const loadAiUniverse = ()=>{
    // show spinner
    document.getElementById('spinner').classList.remove('d-none');

    const url = `https://openapi.programming-hero.com/api/ai/tools`;
    fetch(url)
        .then(res=> res.json())
        .then(data=> displayAiUniverse(data.data.tools.slice(0,6)))
}

// load all cards when see more button is clicked.
const loadAll = ()=>{
    // show spinner
    document.getElementById('spinner').classList.remove('d-none');
    
    const url = `https://openapi.programming-hero.com/api/ai/tools`;
    fetch(url)
        .then(res=> res.json())
        .then(data=> displayAiUniverse(data.data.tools));
    
    document.getElementById("see-more").classList.add('d-none');

}

// sort by date button, onclick event, most recent first.
const sortByDate = ()=>{
   // show spinner
   document.getElementById('spinner').classList.remove('d-none');
    
   const url = `https://openapi.programming-hero.com/api/ai/tools`;
   fetch(url)
       .then(res=> res.json())
       .then(data=> {
          const seeMore = document.getElementById("see-more").classList.contains('d-none');
          // check to see how many data available.
          if(seeMore === true){
            sorting(data.data.tools);
          } else{
            sorting(data.data.tools.slice(0,6));
          }
          });
}


// sorting the data by date.
const sorting = (data)=>{
  // console.log(data);
  data.sort(function(a,b){
      return new Date(b.published_in) - new Date(a.published_in);
    });
  // console.log(data);
  displayAiUniverse(data);
}



const displayAiUniverse = (data)=>{
    // console.log(data);
    const cardsContainer = document.getElementById('cards-container');
    // empty for each function call
    cardsContainer.innerHTML = "";
    data.forEach(item=>{
        // console.log(item);
        const {image,features,name,published_in,id} = item;
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
        <div class="card h-100">
            <div class="p-3">
                <img src="${image}" class="card-img-top  rounded" alt="...">
            </div>
            <div class="card-body">
                <h5 class="card-title my-font">Features</h5>
                <p class="card-text">
                    <ol class="my-second-font">
                         ${createLiFromArray(features)}
                    </ol>             
                </p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center my-footer-color">
            <div>
                <div>
                    <h4 class="my-font">${name}</h4>
                    <div class="d-flex gap-2">
                    <p class="my-second-font"><i class="fa-solid fa-calendar-days"></i></p>
                    <p class="my-second-font">${dateFormat(published_in)}</p>
                    </div>   
                </div>
            </div>
            <div>
                <button onclick="loadDetails('${id}')" type="button" class="border-0 rounded-circle arrow-color" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <i class="fa-solid fa-arrow-right arrow-color"></i>
                </button>                    
            </div>
          </div>
        </div>
        
        
        `
      cardsContainer.appendChild(div);
    })

    // remove spinner
    document.getElementById('spinner').classList.add('d-none');

}


// show features
function createLiFromArray(features){
    let ulHTML = "";
    if(features){
        for(let i=0; i<features.length; i++){
            ulHTML += `<li>${features[i]}</li>`;   
        }
    } else {
        ulHTML = "No Data Found";
    }
    return ulHTML;
}


// load details
const loadDetails = (id)=>{
    console.log(id);
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    fetch(url)
        .then(res=> res.json())
        .then(data=> displayDetails(data.data))

}

// display details modal
const displayDetails = (data) => {
    console.log(data);
    const {description,pricing,features,integrations,image_link,accuracy,input_output_examples} = data;
    const modalCarrier = document.getElementById('modal-carrier');
    modalCarrier.innerHTML = "";
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="d-flex flex-column flex-lg-row gap-3 justify-content-center">
    <!-- left side -->
    <div class="card left-card" style="max-width: 30.5rem;">
      <div class="card-body">
        <div>
          <h5 class="card-title my-font">${description}</h5>
        </div>
        <div class="d-flex justify-content-center align-items-center gap-2 mt-4 mb-4">
          <div class="pricing-container rounded text-center d-flex flex-column justify-content-center align-items-center bg-white">
            <p class="my-pricing-font my-pricing-free mb-0">${pricing && pricing[0].price !== '0' ? pricing[0].price : 'Free of Cost'}</p>
            <p class="my-pricing-font my-pricing-free mt-0">${pricing ? pricing[0].plan :''}</p>
          </div>
          <div class="pricing-container rounded text-center d-flex flex-column justify-content-center align-items-center bg-white">
            <p class="my-pricing-font my-pricing-pro mb-0">${pricing ? pricing[1].price : 'Free of Cost'}</p>
            <p class="my-pricing-font my-pricing-pro mt-0">${pricing ? pricing[1].plan :''}</p>
          </div>
          <div class="pricing-container rounded text-center d-flex flex-column justify-content-center align-items-center bg-white">
            <p class="my-pricing-font-enterprise my-pricing-enterprise mb-0">${pricing ? pricing[2].price : 'Free of Cost'}</p>
            <p class="my-pricing-font-enterprise my-pricing-enterprise mt-0">${pricing ? pricing[2].plan :''}</p>
          </div>          
        </div>
        <div class="d-flex justify-content-between">
          <div>
            <h5 class="my-font">Features</h5>
            <ul class="my-second-font">
                ${modalFeatures(features)}
            </ul>
          </div>
          <div>
            <h5 class="my-font">Integrations</h5>
            <ul class="my-second-font">
              ${integrations ? createLiFromArray(integrations): "No Integrations"}
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- right side -->
    <div class="card" style="max-width: 30.5rem;">
      <div class="accuracy-container">
        <img src="${image_link[0]}" class="card-img-top" alt="...">
        <div id="accuracy-div" class="accuracy rounded ${accuracy.score? 'd-block':'d-none'}">
          <div class="text-center text-white">${accuracy.score ? accuracy.score*100:''}% accuracy</div>
        </div>       
      </div>
      
      <div class="card-body">
        <div>
          <h4>${input_output_examples ? input_output_examples[0].input: ""}</h4>
          <p class="my-second-font">${input_output_examples ? input_output_examples[0].output: ""}</p>
        </div>
        <div>
          <h4>${input_output_examples ? input_output_examples[1].input : "Can you give any example?"}</h4>
          <p class="my-second-font">${input_output_examples ? input_output_examples[1].output: "No! Not Yet! Take a break!!!"}</p>
        </div>
      </div>
    </div>
  </div>
    
    `
  modalCarrier.appendChild(div);
    
}



// modal features created (li from object)
const modalFeatures = (data)=>{
    let ulHTML = "";
    for(const key in data){
        // console.log(key, data[key].feature_name);
        ulHTML += `<li>${data[key].feature_name}</li>`;
    }
    return ulHTML;
}


// date format
const dateFormat = (myDate) =>{
  const dateArray= myDate.split('').reverse();
  if(dateArray.length === 8){
    dateArray.push('0');
  }
  dateArray.splice(6,0,'0');
  const finalDate = dateArray.reverse().join('');
  console.log(finalDate);
  return finalDate;
  
}


loadAiUniverse();