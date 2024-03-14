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
  const $addButton = document.createElement('button');
  $divButton.id = 'add-reviews';
  $addButton.textContent = 'Add Reviews';
  const $divButton1 = document.createElement('div');
  $divButton1.className = 'column-full my-reviews';
  const $viewReviewsButton = document.createElement('button');
  $viewReviewsButton.id = 'view-reviews';
  $viewReviewsButton.textContent = 'My Reviews';
  $addButton.dataset.index = index.toString();
  $addButton.dataset.tag = tag;
  $divButton.append($addButton);
  $divButton1.append($viewReviewsButton);
  $divImage.append($img);
  $divEntity.append($divImage, $divDetails, $divButton, $divButton1);
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
  if (data.reviews.length === 0) {
    $noEntryMessage.textContent = 'no entry exists';
  }
  $topRated.selected = true;
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
  $myReviewsPage.style.display = 'none';
});
const $sortByRatedOrViewed = document.getElementById('rate-or-view');
const $topRated = document.getElementById('top-rated');
if (!$sortByRatedOrViewed || !$topRated) {
  throw new Error('$sortByRatedOrViewed or $topRated query failed');
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
    $myReviewsPage.style.display = 'none';
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
const $addReviewForm = document.getElementById('add-review-form');
const $addOrUpdateButton = document.getElementById('addOrUpdateButton');
$businessProfile.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.matches('button')) {
    event.preventDefault();
    const $addReviewForm = document.querySelector(
      "div[data-add-reviews='add-reviews-page'] form",
    );
    $addReviewForm.reset();
    data.editing = null;
    $addReviewsTitle.textContent = 'Add Review';
    $businessProfile.style.display = 'none';
    $addOrUpdateButton.textContent = 'Submit';
    $landingPage.style.display = 'none';
    $entitiesView.style.display = 'none';
    $addReviewsPage.style.display = 'block';
    $myReviewsPage.style.display = 'none';
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
    $addReviewForm.dataset.index = index;
    $addReviewForm.dataset.tag = tag;
  }
});
const $myReviewsPage = document.querySelector(
  'div[data-reviews-page="my-reviews-page"]',
);
if (!$myReviewsPage) {
  throw new Error('$myReviewsPage query failed');
}
const $myReviews = document.querySelector(
  'div[data-reviews-page="my-reviews-page"] .row',
);
if (!$myReviews) {
  throw new Error('$myReviews query failed');
}
$addReviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $formElements = $addReviewForm.elements;
  const titleValue = $formElements.title.value;
  const ratingValue = $formElements.rating.value;
  const messageValue = $formElements.message.value;
  const index = $addReviewForm.dataset.index;
  const tag = $addReviewForm.dataset.tag;
  const review = {
    businessName:
      tag === '1'
        ? businessesRating[Number(index)].name
        : businessesCount[Number(index)].name,
    businessIndex: index,
    businessTag: tag,
    ratingValue,
    titleValue,
    messageValue,
    id: data.nextEntityId,
    imageUrl:
      tag === '1'
        ? businessesRating[Number(index)].image_url
        : businessesCount[Number(index)].image_url,
  };
  if (data.editing === null) {
    data.reviews.unshift(review);
    data.nextEntityId++;
    const $divReview = createReviewsDOMTree(review);
    $myReviews.prepend($divReview);
    if (data.reviews.length !== 0) {
      $noEntryMessage.textContent = '';
    }
  } else {
    const id = Number($addOrUpdateButton.dataset.id);
    review.id = id;
    for (let i = 0; i < data.reviews.length; i++) {
      const myReview = data.reviews[i];
      if (myReview.id === id) {
        data.reviews[i] = review;
        break;
      }
    }
    const $updatedReview = createReviewsDOMTree(review);
    const $myReviewsElement = document.querySelectorAll(
      "div[data-reviews-page='my-reviews-page'] .my-review",
    );
    if (!$myReviewsElement) {
      throw new Error('$myReviewsElement query failed');
    }
    for (const $myReview of $myReviewsElement) {
      if ($myReview.dataset.id === review.id.toString()) {
        $myReview.replaceWith($updatedReview);
        break;
      }
    }
  }
  $businessProfile.style.display = 'none';
  $landingPage.style.display = 'none';
  $entitiesView.style.display = 'none';
  $myReviewsPage.style.display = 'block';
  $addReviewsPage.style.display = 'none';
  $addReviewForm.reset();
});
document.addEventListener('DOMContentLoaded', () => {
  for (const review of data.reviews) {
    const $review = createReviewsDOMTree(review);
    $myReviews.append($review);
  }
});
function createReviewsDOMTree(entity) {
  const $mainDiv = document.createElement('div');
  $mainDiv.className = 'my-review column-full column-half';
  $mainDiv.dataset.id = entity.id.toString();
  const $divId = document.createElement('div');
  $divId.textContent = `Review ID: ${entity.id.toString()}`;
  const $divName = document.createElement('div');
  $divName.textContent = `Business Name: ${entity.businessName}`;
  const $divTitle = document.createElement('div');
  $divTitle.textContent = `Title: ${entity.titleValue}`;
  const $divRating = document.createElement('div');
  $divRating.textContent = `Rating: ${entity.ratingValue}`;
  const $divMessage = document.createElement('div');
  $divMessage.textContent = `Message: ${entity.messageValue}`;
  const $divbutton = document.createElement('div');
  $divbutton.className = 'update-button';
  const $updateButton = document.createElement('button');
  $updateButton.textContent = 'Update';
  $updateButton.dataset.feature = 'update';
  $updateButton.dataset.reviewId = entity.id.toString();
  $divbutton.append($updateButton);
  const $deleteButton = document.createElement('button');
  $deleteButton.textContent = 'Delete';
  $deleteButton.dataset.feature = 'delete';
  $deleteButton.dataset.reviewId = entity.id.toString();
  $divbutton.append($deleteButton);
  $mainDiv.append(
    $divId,
    $divName,
    $divTitle,
    $divRating,
    $divMessage,
    $divbutton,
  );
  return $mainDiv;
}
const $addReviewsTitle = document.querySelector(
  'div[data-add-reviews="add-reviews-page"] .add-reviews-title',
);
const $reviewTitle = document.getElementById('title');
const $reviewRating = document.getElementById('rating');
const $reviewMessage = document.getElementById('message');
const $addReviewsBusinessName = document.querySelector(
  'div[data-add-reviews="add-reviews-page"] .business-name',
);
$myReviewsPage.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if (
    $eventTarget.matches('button') &&
    $eventTarget.dataset.feature === 'update'
  ) {
    $businessProfile.style.display = 'none';
    $landingPage.style.display = 'none';
    $entitiesView.style.display = 'none';
    $myReviewsPage.style.display = 'none';
    $addReviewsPage.style.display = 'block';
    const index = Number($eventTarget.dataset.reviewId);
    let reviewEditing = null;
    for (const review of data.reviews) {
      if (review.id === index) {
        reviewEditing = review;
        break;
      }
    }
    $addReviewForm.dataset.index = reviewEditing?.businessIndex;
    $addReviewForm.dataset.tag = reviewEditing?.businessTag;
    if (reviewEditing !== null) {
      $addReviewsTitle.textContent = 'Update Review';
      $reviewTitle.value = reviewEditing.titleValue;
      $reviewRating.value = reviewEditing.ratingValue;
      $reviewMessage.value = reviewEditing.messageValue;
      $addReviewsBusinessName.textContent = reviewEditing.businessName;
      $addReviewImg.src = reviewEditing.imageUrl;
      $addOrUpdateButton.textContent = 'Update';
      $addOrUpdateButton.dataset.id = reviewEditing.id.toString();
      data.editing = reviewEditing;
    }
  }
});
$businessProfile.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.matches('button') && $eventTarget.id === 'view-reviews') {
    $businessProfile.style.display = 'none';
    $landingPage.style.display = 'none';
    $entitiesView.style.display = 'none';
    $myReviewsPage.style.display = 'block';
    $addReviewsPage.style.display = 'none';
  }
});
$addReviewsPage.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if (
    $eventTarget.matches('button') &&
    $eventTarget.dataset.myReviews === 'myReviews'
  ) {
    $businessProfile.style.display = 'none';
    $landingPage.style.display = 'none';
    $entitiesView.style.display = 'none';
    $myReviewsPage.style.display = 'block';
    $addReviewsPage.style.display = 'none';
  }
});
const $dialog = document.querySelector('dialog');
if (!$dialog) {
  throw new Error('$dialog query failed ');
}
$myReviewsPage.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if (
    $eventTarget.matches('button') &&
    $eventTarget.dataset.feature === 'delete'
  ) {
    $confirmDialog.dataset.id = $eventTarget.dataset.reviewId;
    $dialog.showModal();
  }
});
$dialog.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if (
    $eventTarget.matches('button') &&
    $eventTarget.dataset.feature === 'cancel'
  ) {
    $dialog.close();
  } else if (
    $eventTarget.matches('button') &&
    $eventTarget.dataset.feature === 'confirm'
  ) {
    const reviewId = $eventTarget.dataset.id;
    const length = data.reviews.length;
    for (let i = 0; i < length; i++) {
      if (data.reviews[i].id === Number(reviewId)) {
        data.reviews.splice(i, 1);
        break;
      }
    }
    const $myReviewsElement = document.querySelectorAll(
      "div[data-reviews-page='my-reviews-page'] .my-review",
    );
    if (!$myReviewsElement) {
      throw new Error('$myReviewsElement query failed');
    }
    for (const $myReview of $myReviewsElement) {
      if ($myReview.dataset.id === reviewId) {
        $myReview.remove();
      }
    }
    if (data.reviews.length === 0) {
      $noEntryMessage.textContent = 'no entry exists';
    }
    $dialog.close();
  }
});
const $noEntryMessage = document.getElementById('no-entry-message');
const $cancelDialog = document.querySelector('.dismiss-modal');
const $confirmDialog = document.querySelector('.confirm-modal');
if (!$cancelDialog || !$confirmDialog) {
  throw new Error('$cancelDialog or $confirmDialog query failed');
}
