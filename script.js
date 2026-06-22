// ============================================================
        // 1. NAVEGAÇÃO ENTRE SEÇÕES
        // ============================================================
        const navLinks = document.querySelectorAll('.nav-list a');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();

                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                link.classList.add('active');
                const target = document.getElementById(link.dataset.section);
                if (target) target.classList.add('active');
            });
        });

        // ============================================================
        // 2. API – CONSULTA CNPJ (Brasil API)
        // ============================================================
        const cnpjBtn = document.getElementById('cnpjBtn');
        const cnpjInput = document.getElementById('cnpjInput');
        const cnpjResult = document.getElementById('cnpjResult');

        cnpjBtn.addEventListener('click', async () => {
            const cnpj = cnpjInput.value.replace(/\D/g, '');
            if (cnpj.length !== 14) {
                cnpjResult.className = 'result-box error';
                cnpjResult.textContent = '❌ CNPJ inválido. Digite exatamente 14 números.';
                return;
            }

            cnpjResult.className = 'result-box loading';
            cnpjResult.textContent = '🔄 Consultando...';
            cnpjBtn.disabled = true;

            try {
                const resp = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
                
                if (resp.status === 404) {
                    cnpjResult.className = 'result-box error';
                    cnpjResult.textContent = '❌ CNPJ não encontrado na base.';
                    return;
                }

                if (!resp.ok) {
                    const errText = await resp.text();
                    throw new Error(`Erro ${resp.status}: ${errText}`);
                }

                const data = await resp.json();
                cnpjResult.className = 'result-box success';
                cnpjResult.textContent = JSON.stringify(data, null, 2);
            } catch (err) {
                cnpjResult.className = 'result-box error';
                cnpjResult.textContent = `❌ Erro na consulta: ${err.message}`;
            } finally {
                cnpjBtn.disabled = false;
            }
        });

        // ============================================================
        // 3. API – CONSULTA CEP (ViaCEP)
        // ============================================================
        const cepBtn = document.getElementById('cepBtn');
        const cepInput = document.getElementById('cepInput');
        const cepResult = document.getElementById('cepResult');

        cepBtn.addEventListener('click', async () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) {
                cepResult.className = 'result-box error';
                cepResult.textContent = '❌ CEP inválido. Digite exatamente 8 números.';
                return;
            }

            cepResult.className = 'result-box loading';
            cepResult.textContent = '🔄 Consultando...';
            cepBtn.disabled = true;

            try {
                const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await resp.json();

                if (data.erro) {
                    cepResult.className = 'result-box error';
                    cepResult.textContent = '❌ CEP não encontrado.';
                    return;
                }

                cepResult.className = 'result-box success';
                
                // Formatação amigável
                const formatted = [
                    `📍 ${data.logradouro || 'Sem logradouro'}`,
                    `🏘️ ${data.bairro || 'Sem bairro'}`,
                    `🏙️ ${data.localidade} - ${data.uf}`,
                    `📮 CEP: ${data.cep}`,
                    `🔢 IBGE: ${data.ibge}`,
                    `📋 DDD: ${data.ddd}`,
                    `🔗 Dados completos:`,
                    JSON.stringify(data, null, 2)
                ].join('\n');
                
                cepResult.textContent = formatted;
            } catch (err) {
                cepResult.className = 'result-box error';
                cepResult.textContent = `❌ Erro na consulta: ${err.message}`;
            } finally {
                cepBtn.disabled = false;
            }
        });

        // ============================================================
        // 4. API – CLIMA (Open-Meteo - sem chave!)
        // ============================================================
        const weatherBtn = document.getElementById('weatherBtn');
        const cityInput = document.getElementById('cityInput');
        const stateInput = document.getElementById('stateInput');
        const weatherDisplay = document.getElementById('weatherDisplay');
        const weatherResult = document.getElementById('weatherResult');

        // Função para obter coordenadas via Open-Meteo Geocoding (gratuito, sem chave)
        async function getCoordinates(city, state) {
            const query = `${city},${state},Brazil`;
            const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=pt&format=json`);
            if (!resp.ok) throw new Error('Falha ao buscar cidade');
            const data = await resp.json();
            
            if (!data.results || data.results.length === 0) {
                throw new Error('Cidade não encontrada');
            }

            // Tenta achar a que corresponde ao estado
            let best = data.results[0];
            if (state) {
                const match = data.results.find(r => 
                    r.country_code === 'BR' && 
                    r.admin1 && r.admin1.toLowerCase().includes(state.toLowerCase())
                );
                if (match) best = match;
            }
            
            return {
                lat: best.latitude,
                lon: best.longitude,
                name: best.name,
                country: best.country || 'Brasil',
                admin1: best.admin1 || state
            };
        }

        // Função para buscar clima atual
        async function getWeather(lat, lon) {
            const resp = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
                `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code` +
                `&timezone=auto`
            );
            if (!resp.ok) throw new Error('Falha ao buscar clima');
            return await resp.json();
        }

        // Traduz o código de clima da OMM
        function translateWeatherCode(code) {
            const codes = {
                0: 'Céu limpo', 1: 'Predominantemente limpo', 2: 'Parcialmente nublado',
                3: 'Nublado', 45: 'Nevoeiro', 48: 'Nevoeiro com geada',
                51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa intensa',
                56: 'Garoa congelante leve', 57: 'Garoa congelante intensa',
                61: 'Chuva fraca', 63: 'Chuva moderada', 65: 'Chuva forte',
                66: 'Chuva congelante leve', 67: 'Chuva congelante forte',
                71: 'Queda de neve fraca', 73: 'Queda de neve moderada', 75: 'Queda de neve forte',
                77: 'Grãos de neve', 80: 'Pancadas de chuva fracas', 81: 'Pancadas de chuva moderadas',
                82: 'Pancadas de chuva violentas', 85: 'Pancadas de neve fracas', 86: 'Pancadas de neve fortes',
                95: 'Tempestade', 96: 'Tempestade com granizo leve', 99: 'Tempestade com granizo forte'
            };
            return codes[code] || 'Desconhecido';
        }

        // Ícone baseado no código do clima
        function getWeatherIcon(code) {
            if (code === 0) return 'fas fa-sun';
            if (code <= 2) return 'fas fa-cloud-sun';
            if (code <= 3) return 'fas fa-cloud';
            if (code <= 48) return 'fas fa-smog';
            if (code <= 67) return 'fas fa-cloud-rain';
            if (code <= 86) return 'fas fa-snowflake';
            return 'fas fa-bolt';
        }

        weatherBtn.addEventListener('click', async () => {
            const city = cityInput.value.trim();
            const state = stateInput.value.trim().toUpperCase();

            if (!city) {
                weatherDisplay.innerHTML = `<div class="weather-error"><i class="fas fa-exclamation-circle"></i> Digite o nome de uma cidade.</div>`;
                return;
            }

            weatherDisplay.innerHTML = `<div style="text-align:center; color:#00d4ff;"><i class="fas fa-spinner fa-spin" style="font-size:2rem;"></i><p>Buscando clima...</p></div>`;
            weatherBtn.disabled = true;

            try {
                const coords = await getCoordinates(city, state);
                const weather = await getWeather(coords.lat, coords.lon);
                
                const current = weather.current;
                const temp = current.temperature_2m;
                const feels = current.apparent_temperature;
                const humidity = current.relative_humidity_2m;
                const wind = current.wind_speed_10m;
                const precip = current.precipitation;
                const code = current.weather_code;
                const weatherText = translateWeatherCode(code);
                const icon = getWeatherIcon(code);

                weatherDisplay.innerHTML = `
                    <div style="text-align:center; min-width:120px;">
                        <div style="font-size:3rem; color:#00d4ff; margin-bottom:0.5rem;">
                            <i class="${icon}"></i>
                        </div>
                        <div class="weather-city">${coords.name}${coords.admin1 ? `, ${coords.admin1}` : ''}</div>
                        <div style="color:#888; font-size:0.85rem;">${coords.country}</div>
                    </div>
                    <div style="text-align:center;">
                        <div class="weather-temp">${temp}°<span>C</span></div>
                        <div style="color:#aaa; font-size:0.9rem;">${weatherText}</div>
                        <div style="color:#888; font-size:0.8rem;">Sensação térmica: ${feels}°C</div>
                    </div>
                    <div class="weather-details">
                        <div class="item">
                            <span class="label"><i class="fas fa-tint"></i> Umidade</span>
                            <span class="value">${humidity}%</span>
                        </div>
                        <div class="item">
                            <span class="label"><i class="fas fa-wind"></i> Vento</span>
                            <span class="value">${wind} km/h</span>
                        </div>
                        <div class="item">
                            <span class="label"><i class="fas fa-umbrella"></i> Precipitação</span>
                            <span class="value">${precip} mm</span>
                        </div>
                        <div class="item">
                            <span class="label"><i class="fas fa-thermometer-half"></i> Atualizado</span>
                            <span class="value">${new Date().toLocaleTimeString('pt-BR')}</span>
                        </div>
                    </div>
                `;

                // Mostra JSON completo expandido
                weatherResult.style.display = 'block';
                weatherResult.className = 'result-box';
                weatherResult.textContent = JSON.stringify(weather, null, 2);

            } catch (err) {
                weatherDisplay.innerHTML = `
                    <div class="weather-error">
                        <i class="fas fa-exclamation-triangle"></i> ${err.message}
                    </div>
                `;
                weatherResult.style.display = 'none';
            } finally {
                weatherBtn.disabled = false;
            }
        });

        // Permitir ENTER nos campos
        weatherBtn.addEventListener('click', () => {});
        cityInput.addEventListener('keydown', e => { if (e.key === 'Enter') weatherBtn.click(); });
        stateInput.addEventListener('keydown', e => { if (e.key === 'Enter') weatherBtn.click(); });

        // ============================================================
        // 5. MÁSCARA – APENAS NÚMEROS
        // ============================================================
        [cnpjInput, cepInput].forEach(inp => {
            inp.addEventListener('input', () => {
                inp.value = inp.value.replace(/\D/g, '');
            });
        });

        // Carrega clima de Sinop/MT automaticamente ao abrir
        window.addEventListener('load', () => {
            setTimeout(() => weatherBtn.click(), 500);
        });
