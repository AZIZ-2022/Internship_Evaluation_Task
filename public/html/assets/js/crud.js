// AJAX CRUD front-end for Country/State/City
const api = {
  countries: '/api/countries',
  states: '/api/states',
  cities: '/api/cities'
};

const msgEl = () => document.getElementById('msg');

function showMessage(text, isSuccess = true) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${isSuccess ? 'success' : 'error'}`;
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

async function fetchJSON(url, opts = {}) {
  opts.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...opts.headers
  };
  
  if (opts.body) {
    opts.body = JSON.stringify(opts.body);
  }
  
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({ error: 'Invalid JSON response' }));
  
  if (!res.ok) {
    throw data;
  }
  
  return data;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateStats() {
  document.getElementById('countries-count').textContent = 
    document.querySelectorAll('#countries-table tbody tr').length;
  document.getElementById('states-count').textContent = 
    document.querySelectorAll('#states-table tbody tr').length;
  document.getElementById('cities-count').textContent = 
    document.querySelectorAll('#cities-table tbody tr').length;
}

/* Countries */
async function loadCountries() {
  try {
    const data = await fetchJSON(api.countries);
    const tbody = document.querySelector('#countries-table tbody');
    tbody.innerHTML = '';
    
    const countrySelects = [
      document.getElementById('state_country_id'),
      document.getElementById('city_country_id')
    ];
    
    countrySelects.forEach(select => {
      select.innerHTML = '<option value="">Select country</option>';
    });
    
    data.forEach(country => {
      // Add to table
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${country.id}</td>
        <td>${escapeHtml(country.name)}</td>
        <td class="action-buttons">
          <button class="btn btn-warning btn-sm" onclick="editCountry(${country.id}, '${escapeHtml(country.name)}')">
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteCountry(${country.id})">
            Delete
          </button>
        </td>
      `;
      tbody.appendChild(tr);
      
      // Add to dropdowns
      countrySelects.forEach(select => {
        const option = document.createElement('option');
        option.value = country.id;
        option.textContent = country.name;
        select.appendChild(option);
      });
    });
    
    updateStats();
  } catch (error) {
    showMessage('Failed to load countries: ' + (error.message || JSON.stringify(error)), false);
  }
}

// Country Form Submit
document.getElementById('country-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('country_id').value;
  const name = document.getElementById('country_name').value.trim();
  
  if (!name) {
    showMessage('Country name is required', false);
    return;
  }
  
  try {
    if (id) {
      await fetchJSON(`${api.countries}/${id}`, { method: 'PUT', body: { name } });
      showMessage('Country updated successfully');
    } else {
      await fetchJSON(api.countries, { method: 'POST', body: { name } });
      showMessage('Country created successfully');
    }
    
    document.getElementById('country-reset').click();
    await loadCountries();
  } catch (error) {
    showMessage('Save failed: ' + (error.message || JSON.stringify(error)), false);
  }
});

document.getElementById('country-reset').addEventListener('click', () => {
  document.getElementById('country_id').value = '';
  document.getElementById('country_name').value = '';
});

function editCountry(id, name) {
  document.getElementById('country_id').value = id;
  document.getElementById('country_name').value = name;
  document.getElementById('country_name').focus();
}

async function deleteCountry(id) {
  if (!confirm('Delete this country and all associated states and cities?')) {
    return;
  }
  
  try {
    await fetchJSON(`${api.countries}/${id}`, { method: 'DELETE' });
    showMessage('Country deleted successfully');
    await loadCountries();
  } catch (error) {
    showMessage('Delete failed: ' + (error.message || JSON.stringify(error)), false);
  }
}

/* States */
async function loadStates() {
  try {
    const data = await fetchJSON(api.states);
    const tbody = document.querySelector('#states-table tbody');
    tbody.innerHTML = '';
    
    data.forEach(state => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${state.id}</td>
        <td>${escapeHtml(state.country_name || 'N/A')}</td>
        <td>${escapeHtml(state.name)}</td>
        <td class="action-buttons">
          <button class="btn btn-warning btn-sm" onclick="editState(${state.id}, ${state.country_id}, '${escapeHtml(state.name)}')">
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteState(${state.id})">
            Delete
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    
    updateStats();
  } catch (error) {
    showMessage('Failed to load states: ' + (error.message || JSON.stringify(error)), false);
  }
}

// State Form Submit
document.getElementById('state-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('state_id').value;
  const name = document.getElementById('state_name').value.trim();
  const country_id = document.getElementById('state_country_id').value;
  
  if (!country_id) {
    showMessage('Please select a country', false);
    return;
  }
  
  if (!name) {
    showMessage('State name is required', false);
    return;
  }
  
  try {
    if (id) {
      await fetchJSON(`${api.states}/${id}`, { method: 'PUT', body: { name, country_id } });
      showMessage('State updated successfully');
    } else {
      await fetchJSON(api.states, { method: 'POST', body: { name, country_id } });
      showMessage('State created successfully');
    }
    
    document.getElementById('state-reset').click();
    await loadStates();
  } catch (error) {
    showMessage('Save failed: ' + (error.message || JSON.stringify(error)), false);
  }
});

document.getElementById('state-reset').addEventListener('click', () => {
  document.getElementById('state_id').value = '';
  document.getElementById('state_name').value = '';
  document.getElementById('state_country_id').value = '';
});

function editState(id, country_id, name) {
  document.getElementById('state_id').value = id;
  document.getElementById('state_name').value = name;
  document.getElementById('state_country_id').value = country_id;
}

async function deleteState(id) {
  if (!confirm('Delete this state and all associated cities?')) {
    return;
  }
  
  try {
    await fetchJSON(`${api.states}/${id}`, { method: 'DELETE' });
    showMessage('State deleted successfully');
    await loadStates();
  } catch (error) {
    showMessage('Delete failed: ' + (error.message || JSON.stringify(error)), false);
  }
}

/* Cities */
async function loadCities() {
  try {
    const data = await fetchJSON(api.cities);
    const tbody = document.querySelector('#cities-table tbody');
    tbody.innerHTML = '';
    
    data.forEach(city => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${city.id}</td>
        <td>${escapeHtml(city.country_name || 'N/A')}</td>
        <td>${escapeHtml(city.state_name || 'N/A')}</td>
        <td>${escapeHtml(city.name)}</td>
        <td class="action-buttons">
          <button class="btn btn-warning btn-sm" onclick="editCity(${city.id}, ${city.country_id}, ${city.state_id}, '${escapeHtml(city.name)}')">
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteCity(${city.id})">
            Delete
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    
    updateStats();
  } catch (error) {
    showMessage('Failed to load cities: ' + (error.message || JSON.stringify(error)), false);
  }
}

document.getElementById('city_country_id').addEventListener('change', async (e) => {
  const country_id = e.target.value;
  if (!country_id) {
    document.getElementById('city_state_id').innerHTML = '<option value="">Select state</option>';
    return;
  }
  
  try {
    const data = await fetchJSON(`${api.states}?country_id=${country_id}`);
    const select = document.getElementById('city_state_id');
    select.innerHTML = '<option value="">Select state</option>';
    
    data.forEach(state => {
      const option = document.createElement('option');
      option.value = state.id;
      option.textContent = state.name;
      select.appendChild(option);
    });
  } catch (error) {
    showMessage('Failed to load states', false);
  }
});

// City Form Submit
document.getElementById('city-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('city_id').value;
  const name = document.getElementById('city_name').value.trim();
  const country_id = document.getElementById('city_country_id').value;
  const state_id = document.getElementById('city_state_id').value;
  
  if (!country_id || !state_id) {
    showMessage('Please select both country and state', false);
    return;
  }
  
  if (!name) {
    showMessage('City name is required', false);
    return;
  }
  
  try {
    if (id) {
      await fetchJSON(`${api.cities}/${id}`, { method: 'PUT', body: { name, country_id, state_id } });
      showMessage('City updated successfully');
    } else {
      await fetchJSON(api.cities, { method: 'POST', body: { name, country_id, state_id } });
      showMessage('City created successfully');
    }
    
    document.getElementById('city-reset').click();
    await loadCities();
  } catch (error) {
    showMessage('Save failed: ' + (error.message || JSON.stringify(error)), false);
  }
});

document.getElementById('city-reset').addEventListener('click', () => {
  document.getElementById('city_id').value = '';
  document.getElementById('city_name').value = '';
  document.getElementById('city_country_id').value = '';
  document.getElementById('city_state_id').innerHTML = '<option value="">Select state</option>';
});

function editCity(id, country_id, state_id, name) {
  document.getElementById('city_id').value = id;
  document.getElementById('city_name').value = name;
  document.getElementById('city_country_id').value = country_id;
  
  // Trigger change to load states for the selected country
  const event = new Event('change');
  document.getElementById('city_country_id').dispatchEvent(event);
  
  // Set state after a short delay
  setTimeout(() => {
    document.getElementById('city_state_id').value = state_id;
  }, 300);
}

async function deleteCity(id) {
  if (!confirm('Delete this city?')) {
    return;
  }
  
  try {
    await fetchJSON(`${api.cities}/${id}`, { method: 'DELETE' });
    showMessage('City deleted successfully');
    await loadCities();
  } catch (error) {
    showMessage('Delete failed: ' + (error.message || JSON.stringify(error)), false);
  }
}

/* Initialize */
async function init() {
  try {
    await Promise.all([loadCountries(), loadStates(), loadCities()]);
  } catch (error) {
    showMessage('Failed to load data: ' + error.message, false);
  }
}

// Start the application
document.addEventListener('DOMContentLoaded', init);