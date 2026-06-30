const navLinks = document.querySelectorAll('.nav-list a');
const sections = document.querySelectorAll('.section');

const cnpjBtn = document.getElementById('cnpjBtn');
const cnpjInput = document.getElementById('cnpjInput');
const cnpjResult = document.getElementById('cnpjResult');

const cepBtn = document.getElementById('cepBtn');
const cepInput = document.getElementById('cepInput');
const cepResult = document.getElementById('cepResult');

const weatherBtn = document.getElementById('weatherBtn');
const cityInput = document.getElementById('cityInput');
const stateInput = document.getElementById('stateInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const weatherResult = document.getElementById('weatherResult');

function showResult(element, type, message) {
    element.className = `result-box ${type}`;
    element.textContent = message;
}

function onlyNumbers(value) {
    return value.replace(/\D/g, '');
}

function changeSection(selectedLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));

    selectedLink.classList.add('active');

    const section = document.getElementById(selectedLink.dataset.section);
    if (section) {
        section.classList.add('active');
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        changeSection(link);
    });
});

cnpjBtn.addEventListener('click', async () => {
    const cnpj = onlyNumbers(cnpjInput.value);

    if (cnpj.length !== 14) {
        showResult(cnpjResult, 'error', 'CNPJ inválido. Digite exatamente 14 números.');
        return;
    }

    showResult(cnpjResult, 'loading', 'Consultando...');
    cnpjBtn.disabled = true;

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

        if (response.status === 404) {
            showResult(cnpjResult, 'error', 'CNPJ não encontrado na base.');
            return;
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const company = await response.json();
        showResult(cnpjResult, 'success', JSON.stringify(company, null, 2));
    } catch (error) {
        showResult(cnpjResult, 'error', `Erro na consulta: ${error.message}`);
    } finally {
        cnpjBtn.disabled = false;
    }
});

cepBtn.addEventListener('click', async () => {
    const cep = onlyNumbers(cepInput.value);

    if (cep.length !== 8) {
        showResult(cepResult, 'error', 'CEP inválido. Digite exatamente 8 números.');
        return;
    }

    showResult(cepResult, 'loading', 'Consultando...');
    cepBtn.disabled = true;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const address = await response.json();

        if (address.erro) {
            showResult(cepResult, 'error', 'CEP não encontrado.');
            return;
        }

        const formattedAddress = [
            `Endereço: ${address.logradouro || 'Sem logradouro'}`,
            `Bairro: ${address.bairro || 'Sem bairro'}`,
            `Cidade: ${address.localidade} - ${address.uf}`,
            `CEP: ${address.cep}`,
            `IBGE: ${address.ibge}`,
            `DDD: ${address.ddd}`,
            '',
            'Dados completos:',
            JSON.stringify(address, null, 2)
        ].join('\n');

        showResult(cepResult, 'success', formattedAddress);
    } catch (error) {
        showResult(cepResult, 'error', `Erro na consulta: ${error.message}`);
    } finally {
        cepBtn.disabled = false;
    }
});

async function getCoordinates(city, state) {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', city);
    url.searchParams.set('count', '5');
    url.searchParams.set('language', 'pt');
    url.searchParams.set('format', 'json');

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Falha ao buscar cidade.');
    }

    const data = await response.json();

    if (!data.results?.length) {
        throw new Error('Cidade não encontrada.');
    }

    const cityFromBrazil = data.results.find(result => result.country_code === 'BR');
    const cityFromState = data.results.find(result => {
        const sameCountry = result.country_code === 'BR';
        const sameState = result.admin1?.toLowerCase().includes(state.toLowerCase());
        return sameCountry && sameState;
    });

    const bestMatch = cityFromState || cityFromBrazil || data.results[0];

    return {
        lat: bestMatch.latitude,
        lon: bestMatch.longitude,
        name: bestMatch.name,
        country: bestMatch.country || 'Brasil',
        admin1: bestMatch.admin1 || state
    };
}

async function getWeather(lat, lon) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat);
    url.searchParams.set('longitude', lon);
    url.searchParams.set('current', [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'wind_speed_10m',
        'weather_code'
    ].join(','));
    url.searchParams.set('timezone', 'auto');

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Falha ao buscar clima.');
    }

    return response.json();
}

function translateWeatherCode(code) {
    const weatherCodes = {
        0: 'Céu limpo',
        1: 'Predominantemente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Nevoeiro',
        48: 'Nevoeiro com geada',
        51: 'Garoa leve',
        53: 'Garoa moderada',
        55: 'Garoa intensa',
        56: 'Garoa congelante leve',
        57: 'Garoa congelante intensa',
        61: 'Chuva fraca',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        66: 'Chuva congelante leve',
        67: 'Chuva congelante forte',
        71: 'Queda de neve fraca',
        73: 'Queda de neve moderada',
        75: 'Queda de neve forte',
        77: 'Grãos de neve',
        80: 'Pancadas de chuva fracas',
        81: 'Pancadas de chuva moderadas',
        82: 'Pancadas de chuva violentas',
        85: 'Pancadas de neve fracas',
        86: 'Pancadas de neve fortes',
        95: 'Tempestade',
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
    };

    return weatherCodes[code] || 'Desconhecido';
}

function getWeatherIcon(code) {
    if (code === 0) return 'fas fa-sun';
    if (code <= 2) return 'fas fa-cloud-sun';
    if (code <= 3) return 'fas fa-cloud';
    if (code <= 48) return 'fas fa-smog';
    if (code <= 67) return 'fas fa-cloud-rain';
    if (code <= 86) return 'fas fa-snowflake';

    return 'fas fa-bolt';
}

function showWeatherLoading() {
    weatherDisplay.innerHTML = `
        <div class="weather-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Buscando clima...</p>
        </div>
    `;
}

function renderWeather(coords, weather) {
    const current = weather.current;
    const weatherText = translateWeatherCode(current.weather_code);
    const icon = getWeatherIcon(current.weather_code);

    weatherDisplay.innerHTML = `
        <div class="weather-summary">
            <div class="weather-icon">
                <i class="${icon}"></i>
            </div>
            <div class="weather-city">${coords.name}${coords.admin1 ? `, ${coords.admin1}` : ''}</div>
            <div class="weather-country">${coords.country}</div>
        </div>

        <div class="weather-temperature">
            <div class="weather-temp">${current.temperature_2m}°<span>C</span></div>
            <div class="weather-description">${weatherText}</div>
            <div class="weather-feels-like">Sensação térmica: ${current.apparent_temperature}°C</div>
        </div>

        <div class="weather-details">
            <div class="item">
                <span class="label"><i class="fas fa-tint"></i> Umidade</span>
                <span class="value">${current.relative_humidity_2m}%</span>
            </div>
            <div class="item">
                <span class="label"><i class="fas fa-wind"></i> Vento</span>
                <span class="value">${current.wind_speed_10m} km/h</span>
            </div>
            <div class="item">
                <span class="label"><i class="fas fa-umbrella"></i> Precipitação</span>
                <span class="value">${current.precipitation} mm</span>
            </div>
            <div class="item">
                <span class="label"><i class="fas fa-thermometer-half"></i> Atualizado</span>
                <span class="value">${new Date().toLocaleTimeString('pt-BR')}</span>
            </div>
        </div>
    `;

    weatherResult.className = 'result-box';
    weatherResult.textContent = JSON.stringify(weather, null, 2);
}

weatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    const state = stateInput.value.trim().toUpperCase();

    if (!city) {
        weatherDisplay.innerHTML = `
            <div class="weather-error">
                <i class="fas fa-exclamation-circle"></i>
                Digite o nome de uma cidade.
            </div>
        `;
        return;
    }

    showWeatherLoading();
    weatherBtn.disabled = true;

    try {
        const coords = await getCoordinates(city, state);
        const weather = await getWeather(coords.lat, coords.lon);
        renderWeather(coords, weather);
    } catch (error) {
        weatherDisplay.innerHTML = `
            <div class="weather-error">
                <i class="fas fa-exclamation-triangle"></i>
                ${error.message}
            </div>
        `;
        weatherResult.className = 'result-box hidden';
    } finally {
        weatherBtn.disabled = false;
    }
});

[cityInput, stateInput].forEach(input => {
    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            weatherBtn.click();
        }
    });
});

[cnpjInput, cepInput].forEach(input => {
    input.addEventListener('input', () => {
        input.value = onlyNumbers(input.value);
    });
});

window.addEventListener('load', () => {
    setTimeout(() => weatherBtn.click(), 500);
});
