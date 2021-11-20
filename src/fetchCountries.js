const searchParams = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

async function fetchCountries(name) {
  const response = await fetch(`https://restcountries.com/v3.1/name/${name}?${searchParams}`);
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
}

export {fetchCountries};