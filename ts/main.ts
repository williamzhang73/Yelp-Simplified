interface FormElements extends HTMLFormControlsCollection {
  cityInput: HTMLInputElement;
}
const apiKey =
  'PFI4az7sB4tUQKWVne-hKBAO_XQ22IouMx4zpOiFSrgEo0H6KZG6ktXa9goetNurD52ebqnYtYOffXVRYaXbITx_KAzZGPElZrHyOJnKbrfO9BKontBsKsrlOivmZXYx';

async function getRequest(targetUrl: string): Promise<any> {
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
interface Entity {
  url: string;
  name: string;
  rating: string;
  review: string;
  address: string;
  phone: string;
  isClosed: string;
  delivery: string;
}
function createEntity(entity: Entity, index: number, tag: string): HTMLElement {
  const $divEntity = document.createElement('div') as HTMLDivElement;
  $divEntity.className = 'row';
  const $divImage = document.createElement('div') as HTMLDivElement;
  $divImage.className = 'column-full column-half';
  const $img = document.createElement('img') as HTMLImageElement;
  $img.src = entity.url;
  $img.alt = 'business image';
  const $divDetails = document.createElement('div') as HTMLDivElement;
  $divDetails.className = 'business-detail column-full column-half';

  const $divName = document.createElement('div') as HTMLDivElement;
  $divName.textContent = `${entity.name}`;
  $divName.className = 'business-name';
  const $divRating = document.createElement('div') as HTMLDivElement;
  $divRating.textContent = `Rating: ${entity.rating}`;
  const $divReview = document.createElement('div') as HTMLDivElement;
  $divReview.textContent = `Review counts: ${entity.review}`;
  const $divAddress = document.createElement('div') as HTMLDivElement;
  $divAddress.textContent = `Address: ${entity.address}`;
  const $divPhone = document.createElement('div') as HTMLDivElement;
  $divPhone.textContent = `Phone: ${entity.phone}`;
  const $divIsClosed = document.createElement('div') as HTMLDivElement;
  $divIsClosed.textContent =
    entity.isClosed === 'false' ? 'Status: closed' : 'Status: open';
  const $divDelivery = document.createElement('div') as HTMLDivElement;
  $divDelivery.textContent = `Delivery: ${entity.delivery}`;

  const $divButton = document.createElement('div') as HTMLDivElement;
  $divButton.className = 'column-full';
  const $button = document.createElement('button') as HTMLButtonElement;
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

function createLiElement(
  tag: number,
  imageUrl: string,
  name: string,
  value: string,
  index: number,
): HTMLLIElement {
  const $li = document.createElement('li') as HTMLLIElement;
  const $div1 = document.createElement('div') as HTMLDivElement;
  $div1.className = 'businessEntity';
  const $div2 = document.createElement('div') as HTMLDivElement;
  $div2.className = 'column-full column-half';
  const $img = document.createElement('img') as HTMLImageElement;
  $img.src = imageUrl;
  $img.alt = 'business image';
  $img.dataset.index = index.toString();
  $img.dataset.tag = tag.toString();
  const $div3 = document.createElement('div') as HTMLDivElement;
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

const $form = document.getElementById('searchForm') as HTMLFormElement;
if (!$form) {
  throw new Error('$form query failed');
}
const $myListView = document.getElementById('myListView') as HTMLDivElement;
if (!$myListView) {
  throw new Error('$myListView query failed');
}
const $landingPage = document.querySelector(
  'div[data-landing-page="landingPage"]',
) as HTMLDivElement;

const $entitiesView = document.querySelector(
  'div[data-top-rated="entitiesView"]',
) as HTMLDivElement;

const $businessIntro = document.querySelector(
  '.businessIntro',
) as HTMLDivElement;
if (!$landingPage || !$entitiesView || !$businessIntro) {
  throw new Error('$landingPage, $entitiesView or $businessIntro query failed');
}

const $selectParent = document.getElementById(
  'rated-or-viewed',
) as HTMLDivElement;
if (!$selectParent) {
  throw new Error('$selectParent query failed');
}

let businessesRating: any[] = [];
let businessesCount: any[] = [];
$form.addEventListener('submit', async (event: Event) => {
  event.preventDefault();
  const $formElements = $form.elements as FormElements;
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
  const $ulRated = document.createElement('ul') as HTMLUListElement;

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

const $logo = document.querySelector('.logo') as HTMLDivElement;
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

const $sortByRatedOrViewed = document.getElementById(
  'ratedOrViewed',
) as HTMLSelectElement;
if (!$sortByRatedOrViewed) {
  throw new Error('$sortByRatedOrViewed query failed');
}
function appendLi(tag: number, businesses: any): void {
  $landingPage.style.display = 'none';
  $entitiesView.style.display = 'block';
  const $ulRated = document.createElement('ul') as HTMLUListElement;

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

const $ul = document.getElementById('myListView') as HTMLUListElement;
if (!$ul) {
  throw new Error('$ul query failed');
}

const $businessProfile = document.querySelector(
  'div[data-business-profile="businessProfile"]',
) as HTMLDivElement;
if (!$businessProfile) {
  throw new Error('$businessProfile query failed');
}

const $businessTitle = document.querySelector(
  "div[data-business-profile='businessProfile'] .title",
) as HTMLDivElement;
if (!$businessTitle) {
  throw new Error('$businessTitle query failed');
}

function entityFunction(businessEntity: any): Entity {
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
function entitySwitchFunction(
  businesses: any,
  index: number,
  tag: string,
): void {
  const businessEntity = businesses[index];
  const entity = entityFunction(businessEntity);
  const $divEntity = createEntity(entity, index, tag);
  $businessProfile.replaceChildren($divEntity);
  $businessProfile.prepend($businessTitle);
}
$ul.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
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
) as HTMLDivElement;
if (!$addReviewsPage) {
  throw new Error('$addReviewsPage query failed');
}

const $addReviewImg = document.querySelector(
  'div[data-add-reviews="add-reviews-page"] img',
) as HTMLImageElement;
if (!$addReviewImg) {
  throw new Error('$addReviewImg query failed');
}

const $addReviewName = document.querySelector(
  'div[data-add-reviews="add-reviews-page"] .business-name',
) as HTMLImageElement;
if (!$addReviewName) {
  throw new Error('$addReviewName query failed');
}

interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  rating: HTMLInputElement;
  message: HTMLTextAreaElement;
}
const $addReviewForm = document.getElementById(
  'add-review-form',
) as HTMLFormElement;
$businessProfile.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget.matches('button')) {
    event.preventDefault();
    $businessProfile.style.display = 'none';
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
interface ReviewEntity {
  id: number;
  businessName: string;
  businessTag: string;
  businessIndex: string;
  ratingValue: string;
  titleValue: string;
  messageValue: string;
}

const $myReviewsPage = document.querySelector(
  'div[data-reviews-page="my-reviews-page"]',
) as HTMLDivElement;
if (!$myReviewsPage) {
  throw new Error('$myReviewsPage query failed');
}
const $myReviews = document.querySelector(
  'div[data-reviews-page="my-reviews-page"] .row',
) as HTMLDivElement;
if (!$myReviews) {
  throw new Error('$myReviews query failed');
}
$addReviewForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $formElements = $addReviewForm.elements as FormElements;
  const titleValue = $formElements.title.value;
  const ratingValue = $formElements.rating.value;
  const messageValue = $formElements.message.value;
  const index = $addReviewForm.dataset.index as string;
  const tag = $addReviewForm.dataset.tag as string;
  const review: ReviewEntity = {
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
  };
  data.reviews.unshift(review);
  data.nextEntityId++;
  const Reviews = data.reviews;
  for (const review of Reviews) {
    const $divReview = createReviewsDOMTree(review);
    $myReviews.append($divReview);
  }
  $businessProfile.style.display = 'none';
  $landingPage.style.display = 'none';
  $entitiesView.style.display = 'none';
  $myReviewsPage.style.display = 'block';
  $addReviewsPage.style.display = 'none';
  $addReviewForm.reset();
});

function createReviewsDOMTree(entity: ReviewEntity): HTMLDivElement {
  const $mainDiv = document.createElement('div') as HTMLDivElement;
  $mainDiv.className = 'my-review column-full column-half';
  const $divId = document.createElement('div') as HTMLDivElement;
  $divId.textContent = `Review ID: ${entity.id.toString()}`;
  const $divName = document.createElement('div') as HTMLDivElement;
  $divName.textContent = `Business Name: ${entity.businessName}`;
  const $divTitle = document.createElement('div') as HTMLDivElement;
  $divTitle.textContent = `Title: ${entity.titleValue}`;
  const $divRating = document.createElement('div') as HTMLDivElement;
  $divRating.textContent = `Rating: ${entity.ratingValue}`;
  const $divMessage = document.createElement('div') as HTMLDivElement;
  $divMessage.textContent = `Message: ${entity.messageValue}`;
  const $divbutton = document.createElement('div') as HTMLDivElement;
  $divbutton.className = 'update-button';
  const $button = document.createElement('button') as HTMLButtonElement;
  $button.textContent = 'Update';
  $divbutton.append($button);
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
