'use strict';
/* async function fetchBusiness(location) {

} */
function createOptions(text) {
  const $option = document.createElement('option');
  $option.value = text;
  $option.textContent = text;
  /*   $option.selected = true; */
  return $option;
}
const locationArray = ['Chino', 'Chino Hills', 'Irvine'];
const $locationSelector = document.getElementById('location');
/* console.log('$locationSelector: ', $locationSelector); */
const $sortByRatedOrViewed = document.getElementById('ratedOrViewed');
if (!$locationSelector || !$sortByRatedOrViewed) {
  throw new Error('$locationSelector or $sortByRatedOrViewed query failed');
}
for (let i = 0; i < locationArray.length; i++) {
  const $option = createOptions(locationArray[i]);
  $locationSelector.append($option);
}
/* const $options = document.querySelectorAll(
  '#location option',
) as NodeListOf<HTMLOptionElement>; */
/* $options[0].selected = true; */
/* const textContent=$locationSelector.textContent;
console.log("textContent; ", textContent); */
let location1 = 'Chino';
async function resolvedOption() {
  return $locationSelector.selectedOptions[0].text;
}
$locationSelector.addEventListener('click', async () => {
  location1 = await resolvedOption();
});
$sortByRatedOrViewed.addEventListener('change', async () => {
  /*   const $eventTarget = event.target; */
  const sortBy = $sortByRatedOrViewed.selectedOptions[0].value;
  /*  console.log("eventTarget: ", sortBy);   */
  if (sortBy === 'topRated') {
    const businesses = await getRequest(location1, 'rating');
    console.log('business: ', businesses);
  } else if (sortBy === 'topViewed') {
    const businesses = await getRequest(location1, 'review_count');
    console.log('business: ', businesses);
  }
});
const apiKey =
  'PFI4az7sB4tUQKWVne-hKBAO_XQ22IouMx4zpOiFSrgEo0H6KZG6ktXa9goetNurD52ebqnYtYOffXVRYaXbITx_KAzZGPElZrHyOJnKbrfO9BKontBsKsrlOivmZXYx';
async function getRequest(location, value) {
  try {
    const targetUrl = encodeURIComponent(
      `https://api.yelp.com/v3/businesses/search?location=${location}&term=food&sort_by=${value}`,
    );
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
    /*   console.log('businesses: ', responseJSON.businesses); */
  } catch (error) {
    throw new Error('ThrowError: data fetch failed.');
  }
}
