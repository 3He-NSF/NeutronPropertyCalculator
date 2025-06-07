"use strict";
const h = 6.62607015e-34; // Planck constant (J⋅s)
const m_n = 1.67492749804e-27; // Neutron mass (kg)
const k_B = 1.380649e-23; // Boltzmann constant (J/K)
function calculateNeutronProperties(value, inputType) {
    let wavelength = NaN, energy = NaN, temperature = NaN, velocity = NaN, wavenumber = NaN;
    if (inputType === 'wavelength') {
        wavelength = value * 1e-10;
        velocity = h / (m_n * wavelength);
        energy = 0.5 * m_n * Math.pow(velocity, 2);
        temperature = energy / k_B;
    }
    else if (inputType === 'wavenumber') {
        wavelength = (2 * Math.PI / value) * 1e-10;
        velocity = h / (m_n * wavelength);
        energy = 0.5 * m_n * Math.pow(velocity, 2);
        temperature = energy / k_B;
    }
    else if (inputType === 'energy') {
        energy = value * 1.602176634e-19;
        velocity = Math.sqrt(2 * energy / m_n);
        wavelength = h / (m_n * velocity);
        temperature = energy / k_B;
    }
    else if (inputType === 'temperature') {
        temperature = value;
        energy = k_B * temperature;
        velocity = Math.sqrt(2 * energy / m_n);
        wavelength = h / (m_n * velocity);
    }
    else if (inputType === 'velocity') {
        velocity = value;
        energy = 0.5 * m_n * Math.pow(velocity, 2);
        wavelength = h / (m_n * velocity);
        temperature = energy / k_B;
    }
    wavenumber = 2 * Math.PI / (wavelength * 1e10);
    return {
        wavelength: wavelength * 1e10,
        energy: energy / 1.602176634e-19,
        temperature,
        velocity,
        wavenumber
    };
}
function calculateProperty(value, fromType, toType) {
    if (fromType === toType)
        return value;
    let wavelength = NaN;
    if (fromType === 'wavelength') {
        wavelength = value * 1e-10;
    }
    else if (fromType === 'energy') {
        const energy = value * 1.602176634e-19;
        const velocity = Math.sqrt(2 * energy / m_n);
        wavelength = h / (m_n * velocity);
    }
    else if (fromType === 'temperature') {
        const energy = k_B * value;
        const velocity = Math.sqrt(2 * energy / m_n);
        wavelength = h / (m_n * velocity);
    }
    else if (fromType === 'velocity') {
        wavelength = h / (m_n * value);
    }
    else if (fromType === 'wavenumber') {
        wavelength = (2 * Math.PI / value) * 1e-10;
    }
    if (isNaN(wavelength))
        return NaN;
    if (toType === 'wavelength') {
        return wavelength * 1e10;
    }
    else if (toType === 'energy') {
        const velocity = h / (m_n * wavelength);
        const energy = 0.5 * m_n * velocity * velocity;
        return energy / 1.602176634e-19;
    }
    else if (toType === 'temperature') {
        const velocity = h / (m_n * wavelength);
        const energy = 0.5 * m_n * velocity * velocity;
        return energy / k_B;
    }
    else if (toType === 'velocity') {
        return h / (m_n * wavelength);
    }
    else if (toType === 'wavenumber') {
        return 2 * Math.PI / (wavelength * 1e10);
    }
    return NaN;
}
const neutronLabels = {
    wavelength: 'Wavelength (Å)',
    energy: 'Energy (eV)',
    temperature: 'Temperature (K)',
    velocity: 'Velocity (m/s)',
    wavenumber: 'Wavenumber (1/Å)'
};
function createUI() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <h1>Neutron Property Calculator (TypeScript)</h1>
    <div class="input-section">
      <div class="input-group">
        <label for="inputType">Input type:</label>
        <select id="inputType">
          <option value="wavelength">Wavelength (Å)</option>
          <option value="energy">Energy (eV)</option>
          <option value="temperature">Temperature (K)</option>
          <option value="velocity">Velocity (m/s)</option>
          <option value="wavenumber">Wavenumber (1/Å)</option>
        </select>
      </div>
      <div class="input-group">
        <label for="inputValue">Value:</label>
        <input type="number" id="inputValue" step="any">
      </div>
      <button id="calcBtn">Calculate</button>
    </div>
    <div class="results" id="results">
      <h3>Calculation Result:</h3>
      <p>Wavelength: <span id="wavelength">-</span> Å</p>
      <p>Energy: <span id="energy">-</span> eV</p>
      <p>Temperature: <span id="temperature">-</span> K</p>
      <p>Velocity: <span id="velocity">-</span> m/s</p>
      <p>Wavenumber: <span id="wavenumber">-</span> 1/Å</p>
    </div>
    <div class="axis-controls">
      <div class="axis-group">
        <h3>X Axis Settings</h3>
        <div class="input-group">
          <label for="xAxisType">X Axis Property:</label>
          <select id="xAxisType">
            <option value="wavelength">Wavelength (Å)</option>
            <option value="energy">Energy (eV)</option>
            <option value="temperature">Temperature (K)</option>
            <option value="velocity">Velocity (m/s)</option>
            <option value="wavenumber">Wavenumber (1/Å)</option>
          </select>
        </div>
        <div class="range-inputs">
          <label>Range:</label>
          <input type="number" id="xMin" placeholder="Min" step="any">
          <span>to</span>
          <input type="number" id="xMax" placeholder="Max" step="any">
        </div>
        <div class="input-group">
          <label>X Axis Scale:</label>
          <label><input type="radio" name="xScale" value="log" checked> log</label>
          <label><input type="radio" name="xScale" value="linear"> linear</label>
        </div>
      </div>
      <div class="axis-group">
        <h3>Y Axis Settings</h3>
        <div class="input-group">
          <label for="yAxisType">Y Axis Property:</label>
          <select id="yAxisType">
            <option value="energy">Energy (eV)</option>
            <option value="wavelength">Wavelength (Å)</option>
            <option value="temperature">Temperature (K)</option>
            <option value="velocity">Velocity (m/s)</option>
            <option value="wavenumber">Wavenumber (1/Å)</option>
          </select>
        </div>
        <div class="range-inputs">
          <label>Range:</label>
          <input type="number" id="yMin" placeholder="Min" step="any">
          <span>to</span>
          <input type="number" id="yMax" placeholder="Max" step="any">
        </div>
        <div class="input-group">
          <label>Y Axis Scale:</label>
          <label><input type="radio" name="yScale" value="log" checked> log</label>
          <label><input type="radio" name="yScale" value="linear"> linear</label>
        </div>
      </div>
    </div>
    <div style="text-align:left; margin-bottom:20px;">
      <button id="setBtn">Set</button>
    </div>
    <div id="plot"></div>
  `;
}
function updateResults(result) {
    document.getElementById('wavelength').textContent = result.wavelength.toFixed(4);
    document.getElementById('energy').textContent = result.energy.toFixed(4);
    document.getElementById('temperature').textContent = result.temperature.toFixed(4);
    document.getElementById('velocity').textContent = result.velocity.toFixed(4);
    document.getElementById('wavenumber').textContent = result.wavenumber.toFixed(4);
}
function updatePlot() {
    const xAxisType = document.getElementById('xAxisType').value;
    const yAxisType = document.getElementById('yAxisType').value;
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    const xScale = document.querySelector('input[name="xScale"]:checked').value;
    const yScale = document.querySelector('input[name="yScale"]:checked').value;
    let xValues = [];
    if (xScale === 'log') {
        if (xMin > 0 && xMax > 0 && xMin < xMax) {
            xValues = Array.from({ length: 100 }, (_, i) => xMin * Math.pow(xMax / xMin, i / 99));
        }
    }
    else {
        if (xMin < xMax) {
            xValues = Array.from({ length: 100 }, (_, i) => xMin + (xMax - xMin) * (i / 99));
        }
    }
    const yValues = xValues.map(x => calculateProperty(x, xAxisType, yAxisType));
    const xRange = (xScale === 'log')
        ? (xMin > 0 && xMax > 0 && xMin < xMax ? [Math.log10(xMin), Math.log10(xMax)] : undefined)
        : (xMin < xMax ? [xMin, xMax] : undefined);
    const yRange = (yScale === 'log')
        ? (yMin > 0 && yMax > 0 && yMin < yMax ? [Math.log10(yMin), Math.log10(yMax)] : undefined)
        : (yMin < yMax ? [yMin, yMax] : undefined);
    const trace = {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: `${neutronLabels[yAxisType]} vs ${neutronLabels[xAxisType]}`,
        line: { color: '#1f77b4' }
    };
    const layout = {
        title: `${neutronLabels[yAxisType]} vs ${neutronLabels[xAxisType]}`,
        xaxis: {
            title: neutronLabels[xAxisType],
            type: xScale,
            range: xRange
        },
        yaxis: {
            title: neutronLabels[yAxisType],
            type: yScale,
            range: yRange
        },
        showlegend: true
    };
    Plotly.newPlot('plot', [trace], layout);
}
function main() {
    createUI();
    document.getElementById('calcBtn').addEventListener('click', () => {
        const inputType = document.getElementById('inputType').value;
        const inputValue = parseFloat(document.getElementById('inputValue').value);
        if (isNaN(inputValue)) {
            alert('Please enter a valid number.');
            return;
        }
        const result = calculateNeutronProperties(inputValue, inputType);
        updateResults(result);
    });
    document.getElementById('setBtn').addEventListener('click', updatePlot);
}
main();
