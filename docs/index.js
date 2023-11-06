// Code here

//Base URL 
const baseUrl='http://localhost:3000';

//List of parameters used in the code
const elements = {
  beerTitle : document.getElementById('beer-name'),
  beerImage : document.getElementById('beer-image'),
  beerDescription : document.getElementById('beer-description'),
  reviewList : document.getElementById('review-list'),
  beerList : document.getElementById("beer-list"),
  descriptionForm : document.getElementById('description-form'),
  descriptionTextarea : document.getElementById('description'),
  reviewForm : document.getElementById('review-form'),
  reviewTextarea : document.getElementById('review'),
  availableBeers : document.getElementById('beer-num'),
  beerPrice : document.getElementById('beer-price'),
};

const {
  beerTitle,
  beerImage,
  beerDescription,
  reviewList,
  beerList,
  descriptionForm,
  descriptionTextarea,
  reviewForm,
  reviewTextarea,
  availableBeers,
  beerPrice,
}=elements;
  
//The below function fetches full details of the firt beer (i.e. its name, image, description, and reviews) from the server when the page loads.
function fetchBeers(beerId){
    fetch(`${baseUrl}/beers/${beerId}`)
    .then(response =>response.json())
    .then(data => {

        //The folowing code displays beer one.
        beerTitle.textContent = data.name;
        beerImage.src = data.image_url;
        beerDescription.textContent = data.description;
        reviewList.textContent = data.reviews;
        
        beerPrice.textContent = `Price per bottle : ${data.price}`;

        availableBeers.innerText = `Available Beers :  (${data.stock - data.beers_sold})`;//Calculate the number of beers remaining

            const buyBeer = document.getElementById('buy-beer');
            let beers = Number(data.stock - data.beers_sold);

            //Listen and handle the events of the buy beer button
            //If beers are availbale, a customer can buy a beer by clicking the buy beer button. For every click of the buy beer button,
            //the number of beers available is decremented by one. In case there are no available beers, the buy beer button is hidden from the customer and
            //a message is displayed advising the customer that there are no beers available
            buyBeer.addEventListener('click',event => {
                
            event.preventDefault();            

                //const remainingBeers =beers-1
                beers--;

                if(beers<=0){
                    availableBeers.innerText =`THIS BEER IS OUT OF STOCK! There are no`;
                    event.target.remove();
                }else {
                    availableBeers.innerText = `Available beers : (${beers})`;
                }
            });
    })
    .catch(error=>console.error("Error in fetching beer details",error));
   }

//The below function diplays the list of beers on the 'nav' after fetching from the server
function addBeersList(){
    fetch(`${baseUrl}/beers`)
    .then(res=>res.json())
    .then(data=>{
        beerList.innerHTML = '';
        data.forEach(beer=>{
                
        const listItem = document.createElement("li");
        listItem.textContent=beer.name;
        listItem.addEventListener('click', () => fetchBeers(beer.id));
        beerList.appendChild(listItem);
    });
   })
   .catch(error => console.error('Error fetching beer list:', error));
}

//The below function updates form description
function updateDescription(updatedDescription){
const beerId=1;
        fetch(`${baseUrl}/beers/${beerId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: updatedDescription }),
          })
            .then(response => response.json())
            .then(data => {
              beerDescription.textContent = data.description;
            })
            .catch(error => console.error('Error updating description on the server:', error));      
}

//The following two functions are used to capture and update review comments 
function updateReviewList(reviews) {
    reviewList.innerHTML = '';
    reviews.forEach(review => {
      const listItem = document.createElement('li');
      listItem.textContent = review;
      reviewList.appendChild(listItem);
    });
  }
  
function updateReviews(review){
    const beerId = 1;
    const currentReviews = Array.from(reviewList.children).map(li => li.textContent);
    const updatedReviews = [review, ...currentReviews];
    fetch(`${baseUrl}/beers/${beerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews: updatedReviews }),
    })
      .then(response => response.json())
      .then(data => {
        updateReviewList(data.reviews);
      })
      .catch(error => console.error('Error updating review on the server:', error));
}

//The start of DOMContentLoaded event
document.addEventListener('DOMContentLoaded',() => {


   fetchBeers(1); //Function call to fetchBeers method 
   addBeersList(); //Function call to addBeersList method

   //Event handler for update beer button click event
  descriptionForm.addEventListener('submit', event => {
        event.preventDefault();
        const updatedDescription = descriptionTextarea.value;
        updateDescription(updatedDescription);
   });

   //Event handler for add review button click event
  reviewForm.addEventListener('submit', event => {
        event.preventDefault();
        const updatedReview = reviewTextarea.value;
        updateReviews(updatedReview);
    });
});
