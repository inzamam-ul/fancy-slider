const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const stopBtn = document.getElementById('stop-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
    
  })
  toggleSpinner();
}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('search-obj').innerHTML = `
      <span class="searchQuery">Showing result for: ${query}</span>
      <span class="result-num">(About ${data.hits.length} results)</span>`;
      
      //If search result Zero then show this message
      if(data.hits.length === 0){
        gallery.innerHTML = `
        <h3 class="text-center mt-5 errText">Sorry, "${query}" did't found </h3>
      `;
      toggleSpinner();
      }else{
        showImages(data.hits);
      }
     
    })
    .catch(err => {
      console.log(err);
      gallery.innerHTML = `
        <h3 class="text-center mt-5 errText">Sorry, something went wrong "${query}" did't found </h3>
      `;

    });
}


let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;

  //If someone click again on a slected image it will be remove from the sliders array
  element.classList.toggle('added');
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }else{
    sliders.splice(item, 1);//removing unselected images from list
  }
  document.getElementById('counter').innerText = sliders.length;//updating counter

}

let timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.');
    stopBtn.classList.toggle('d-none');
    return;
  }
  
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const durationValue = document.getElementById('duration').value || 1000;

  const duration = durationValue < 0 ? (durationValue*-1) : durationValue; //if user set duration negative it will convert it into positive

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);

}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  imagesArea.style.display = 'none';

  toggleSpinner();

  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;

  stopBtn.classList.add('d-none');
  document.getElementById('counter').innerText = sliders.length;//update counter if search again
})

sliderBtn.addEventListener('click', function () {
  createSlider()
  stopBtn.classList.toggle('d-none');//toggling stop button visibility
})

//////////////////My code starts from here////////////////////

// Enter key event handler
const searchBox = document.getElementById('search');
searchBox.addEventListener('keypress', (e) => {
  if(e.key === 'Enter'){
    searchBtn.click();
  }
});

//Stop slider button
stopBtn.addEventListener('click',() => {
  
  stopBtn.classList.toggle('d-none');//toggling stop button visibility
  
  refreshResult();

  document.getElementById('counter').innerText = sliders.length;
  toggleSpinner();

}); 

const toggleSpinner = () => {
  const spinner = document.getElementById('spinner');
  spinner.classList.toggle('d-none');
}

const refreshResult = () => {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)//taking user to previous phase
  sliders.length = 0;
}