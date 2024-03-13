/* exported data */
interface Data {
  reviews: ReviewEntity[];
  nextEntityId: number;
  editing: null | ReviewEntity;
}

let data: Data = {
  reviews: [],
  nextEntityId: 1,
  editing: null,
};

window.addEventListener('beforeunload', () => {
  const serializedData = JSON.stringify(data);
  localStorage.setItem('data', serializedData);
});

if (localStorage.length > 0) {
  const getData = localStorage.getItem('data');
  if (getData !== null) {
    const deserialized = JSON.parse(getData);
    data = deserialized;
  }
}
