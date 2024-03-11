'use strict';
const apiKey =
  'PFI4az7sB4tUQKWVne-hKBAO_XQ22IouMx4zpOiFSrgEo0H6KZG6ktXa9goetNurD52ebqnYtYOffXVRYaXbITx_KAzZGPElZrHyOJnKbrfO9BKontBsKsrlOivmZXYx';
async function getRequest(targetUrl) {
  try {
    const response = await fetch(
      `https://lfz-cors.herokuapp.com/?url=${targetUrl}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    if (!response.ok) throw new Error('Yikes Error Code: ' + response.status);
    const responseJSON = await response.json();
    return responseJSON.businesses;
  } catch (error) {
    throw new Error('ThrowError: data fetch failed.');
  }
}
function createEntity(entity, index, tag) {
  const $divEntity = document.createElement('div');
  $divEntity.className = 'row';
  const $divImage = document.createElement('div');
  $divImage.className = 'column-full column-half';
  const $img = document.createElement('img');
  $img.src = entity.url;
  $img.alt = 'business image';
  const $divDetails = document.createElement('div');
  $divDetails.className = 'business-detail column-full column-half';
  const $divName = document.createElement('div');
  $divName.textContent = `${entity.name}`;
  $divName.className = 'business-name';
  const $divRating = document.createElement('div');
  $divRating.textContent = `Rating: ${entity.rating}`;
  const $divReview = document.createElement('div');
  $divReview.textContent = `Review counts: ${entity.review}`;
  const $divAddress = document.createElement('div');
  $divAddress.textContent = `Address: ${entity.address}`;
  const $divPhone = document.createElement('div');
  $divPhone.textContent = `Phone: ${entity.phone}`;
  const $divIsClosed = document.createElement('div');
  $divIsClosed.textContent =
    entity.isClosed === 'false' ? 'Status: closed' : 'Status: open';
  const $divDelivery = document.createElement('div');
  $divDelivery.textContent = `Delivery: ${entity.delivery}`;
  const $divButton = document.createElement('div');
  $divButton.className = 'column-full';
  const $button = document.createElement('button');
  $divButton.id = 'add-reviews';
  $button.textContent = 'Add Reviews';
  $button.dataset.index = index.toString();
  $button.dataset.tag = tag;
  $divButton.append($button);
  $divImage.append($img);
  $divEntity.append($divImage, $divDetails, $divButton);
  $divDetails.append(
    $divName,
    $divRating,
    $divReview,
    $divAddress,
    $divPhone,
    $divIsClosed,
    $divDelivery,
  );
  return $divEntity;
}
/* function createSelectElement(): HTMLSelectElement {
  const $select = document.createElement('select') as HTMLSelectElement;
  $select.id = 'ratedOrViewed';
  $select.name = 'ratedOrViewed';
  const $option1 = document.createElement('option') as HTMLOptionElement;
  $option1.value = 'topRated';
  $option1.selected = true;
  $option1.textContent = 'Top Rated';
  const $option2 = document.createElement('option') as HTMLOptionElement;
  $option2.value = 'topViewed';
  $option2.textContent = 'Top viewed';

  $select.append($option1, $option2);
  return $select;
} */
function createLiElement(tag, imageUrl, name, value, index) {
  const $li = document.createElement('li');
  const $div1 = document.createElement('div');
  $div1.className = 'businessEntity';
  const $div2 = document.createElement('div');
  $div2.className = 'column-full column-half';
  const $img = document.createElement('img');
  $img.src = imageUrl;
  $img.alt = 'business image';
  $img.dataset.index = index.toString();
  $img.dataset.tag = tag.toString();
  const $div3 = document.createElement('div');
  $div3.className = 'column-full column-half';
  const $h2 = document.createElement('h2');
  $h2.textContent = name;
  const $p = document.createElement('p');
  if (tag === 1) {
    $p.textContent = `rating: ${value}`;
  } else if (tag === 2) {
    $p.textContent = `viewed: ${value}`;
  }
  $li.append($div1);
  $div1.append($div2);
  $div1.append($div3);
  $div2.append($img);
  $div3.append($h2);
  $div3.append($p);
  return $li;
}
const $form = document.getElementById('searchForm');
if (!$form) {
  throw new Error('$form query failed');
}
const $myListView = document.getElementById('myListView');
if (!$myListView) {
  throw new Error('$myListView query failed');
}
const $landingPage = document.querySelector(
  'div[data-landing-page="landingPage"]',
);
const $entitiesView = document.querySelector(
  'div[data-top-rated="entitiesView"]',
);
const $businessIntro = document.querySelector('.businessIntro');
if (!$landingPage || !$entitiesView || !$businessIntro) {
  throw new Error('$landingPage, $entitiesView or $businessIntro query failed');
}
const $selectParent = document.getElementById('rated-or-viewed');
if (!$selectParent) {
  throw new Error('$selectParent query failed');
}
let businessesRating = [];
let businessesCount = [];
$form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const $formElements = $form.elements;
  const $input = $formElements.cityInput;
  let inputValue = $input.value;
  const ratingUrl = encodeURIComponent(
    `https://api.yelp.com/v3/businesses/search?location=${inputValue}&term=food&sort_by=rating`,
  );
  const countUrl = encodeURIComponent(
    `https://api.yelp.com/v3/businesses/search?location=${inputValue}&term=food&sort_by=review_count`,
  );
  businessesRating = await getRequest(ratingUrl);
  businessesCount = await getRequest(countUrl);
  const $ulRated = document.createElement('ul');
  for (let i = 0; i < businessesRating.length; i++) {
    const businessEntity = businessesRating[i];
    const imageUrl = businessEntity.image_url;
    const businessName = businessEntity.name;
    const rating = businessEntity.rating;
    const index = i;
    const $liElement = createLiElement(
      1,
      imageUrl,
      businessName,
      rating,
      index,
    );
    $ulRated.append($liElement);
  }
  $myListView.replaceChildren($ulRated);
  $form.reset();
  $landingPage.style.display = 'none';
  $entitiesView.style.display = 'block';
  inputValue =
    inputValue.charAt(0).toUpperCase() +
    inputValue.slice(1).toLocaleLowerCase();
  $businessIntro.textContent = `Restaurants in ${inputValue}`;
});
const $logo = document.querySelector('.logo');
if (!$logo) {
  throw new Error('$logo query failed');
}
$logo.addEventListener('click', () => {
  $landingPage.style.display = 'block';
  $entitiesView.style.display = 'none';
  $businessProfile.style.display = 'none';
  $addReviewsPage.style.display = 'none';
});
const $sortByRatedOrViewed = document.getElementById('ratedOrViewed');
if (!$sortByRatedOrViewed) {
  throw new Error('$sortByRatedOrViewed query failed');
}
function appendLi(tag, businesses) {
  $landingPage.style.display = 'none';
  $entitiesView.style.display = 'block';
  const $ulRated = document.createElement('ul');
  for (let i = 0; i < businesses.length; i++) {
    const businessEntity = businesses[i];
    const imageUrl = businessEntity.image_url;
    const businessName = businessEntity.name;
    const ratingOrCount =
      tag === 1 ? businessEntity.rating : businessEntity.review_count;
    /*     console.log('business Rating: ', businessEntity.rating); */
    const index = i;
    const $liElement = createLiElement(
      tag,
      imageUrl,
      businessName,
      ratingOrCount,
      index,
    );
    $ulRated.append($liElement);
  }
  $myListView.replaceChildren($ulRated);
}
$sortByRatedOrViewed.addEventListener('change', async () => {
  const sortBy = $sortByRatedOrViewed.selectedOptions[0].value;
  if (sortBy === 'topRated') {
    appendLi(1, businessesRating);
  } else if (sortBy === 'topViewed') {
    appendLi(2, businessesCount);
  }
});
const $ul = document.getElementById('myListView');
if (!$ul) {
  throw new Error('$ul query failed');
}
const $businessProfile = document.querySelector(
  'div[data-business-profile="businessProfile"]',
);
if (!$businessProfile) {
  throw new Error('$businessProfile query failed');
}
const $businessTitle = document.querySelector(
  "div[data-business-profile='businessProfile'] .title",
);
if (!$businessTitle) {
  throw new Error('$businessTitle query failed');
}
function entityFunction(businessEntity) {
  const businessAddress = businessEntity.location.display_address;
  let address = '';
  for (let i = 0; i < businessAddress.length; i++) {
    address += businessAddress[i];
  }
  return {
    url: businessEntity.image_url,
    name: businessEntity.name,
    rating: businessEntity.rating,
    review: businessEntity.review_count,
    phone: businessEntity.phone,
    isClosed: businessEntity.isClosed,
    address,
    delivery: businessEntity.transactions.includes('delivery') ? 'Yes' : 'No',
  };
}
function entitySwitchFunction(businesses, index, tag) {
  const businessEntity = businesses[index];
  const entity = entityFunction(businessEntity);
  const $divEntity = createEntity(entity, index, tag);
  $businessProfile.replaceChildren($divEntity);
  $businessProfile.prepend($businessTitle);
}
$ul.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.matches('img')) {
    $landingPage.style.display = 'none';
    $entitiesView.style.display = 'none';
    $businessProfile.style.display = 'block';
    const index = Number($eventTarget.dataset.index);
    const tag = $eventTarget.dataset.tag;
    if (tag === '1') {
      entitySwitchFunction(businessesRating, index, tag);
    } else if (tag === '2') {
      entitySwitchFunction(businessesCount, index, tag);
    }
  }
});
const $addReviewsPage = document.querySelector(
  'div[data-add-reviews="add-reviews-page"]',
);
if (!$addReviewsPage) {
  throw new Error('$addReviewsPage query failed');
}
const $addReviewImg = document.querySelector(
  'div[data-add-reviews="add-reviews-page"] img',
);
if (!$addReviewImg) {
  throw new Error('$addReviewImg query failed');
}
const $addReviewName = document.querySelector(
  'div[data-add-reviews="add-reviews-page"] .business-name',
);
if (!$addReviewName) {
  throw new Error('$addReviewName query failed');
}
$businessProfile.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.matches('button')) {
    $businessProfile.style.display = 'none';
    $landingPage.style.display = 'none';
    $entitiesView.style.display = 'none';
    $addReviewsPage.style.display = 'block';
    const index = $eventTarget.dataset.index;
    const tag = $eventTarget.dataset.tag;
    if (tag === '1') {
      const entity = businessesRating[Number(index)];
      $addReviewImg.src = entity.image_url;
      $addReviewName.textContent = entity.name;
    } else if (tag === '2') {
      const entity = businessesCount[Number(index)];
      $addReviewImg.src = entity.image_url;
      $addReviewName.textContent = entity.name;
    }
  }
});
