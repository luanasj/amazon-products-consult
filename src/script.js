//Connects to DOM elements to manipulate them
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadingGrid = document.getElementById('loadingGrid');
const productGrid = document.getElementById('productGrid');
const noResults = document.getElementById('noResults');
const toast = document.getElementById('toast');
const toastTitle = toast.querySelector('.toast-title');
const toastDescription = toast.querySelector('.toast-description');
const toastClose = toast.querySelector('.toast-close');


//Create fake cards to loading animation
function createSkeletons() {
  loadingGrid.innerHTML = Array(8)
    .fill(0)
    .map(() => `
      <div class="skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-rating"></div>
        </div>
      </div>
    `)
    .join('');
}

//create real products cards based on product literal objects
function createProductCard(product) {
  return `
    <div class="product-card">
      <img src="${product.imgURL}" alt="${product.title}" class="product-image">
      <div class="product-content">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rating">
          <span class="stars">★</span>
          <span>${product.rating} (${product.number_of_reviews} reviews)</span>
        </div>
      </div>
    </div>
  `;
}


//Shows loading animation with the skeletons
function showLoading() {
  createSkeletons();
  loadingGrid.classList.remove('hidden');
  productGrid.classList.add('hidden');
  noResults.classList.add('hidden');
}

//Hides loading animation
function hideLoading() {
  loadingGrid.classList.add('hidden');
}

//Shows flash message to request errors
function showToast(title, description, variant = 'default') {
  toastTitle.textContent = title;
  toastDescription.textContent = description;
  toast.classList.remove('hidden');
  toast.style.backgroundColor = variant === 'destructive' ? '#fef2f2' : '#ffffff';
  toastTitle.style.color = variant === 'destructive' ? '#dc2626' : '#111827';

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 5000);
}


//Hides flash messages
toastClose.addEventListener('click', () => {
  toast.classList.add('hidden');
});


//Handle unsuccessful requests to backend
const badRequestHandler = (title,description)=>{
  hideLoading();
        productGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
        showToast(title, description , 'destructive');
}

//Add an 'submit' event listener do search form / button
//Add a callback function to request research to backend and create product cards on demand
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const keyword = searchInput.value.trim();

    if (!keyword) return;

    searchButton.disabled = true;
    showLoading();

    const response = await fetch(`http://127.0.0.1:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`)
    .catch(() => 
        badRequestHandler("Bad Request.","Server Error.")
    );

    if (!response) return searchButton.disabled = false;

    if(response.status == 200) {
        const products = await response.json();
        
        const productsCards = products.map(createProductCard).join('');
        productGrid.innerHTML = productsCards;
        hideLoading();
        productGrid.classList.remove('hidden');
        noResults.classList.add('hidden');
    } else {
        const errorInformation = await response.json()
        badRequestHandler('No products found', (errorInformation?.message ?? "Request failed." ))
    }

    searchButton.disabled = false;

});
