/* ================================================================
     UNIT CONVERTER
     ================================================================ */

const UNIT_GROUPS = {
  length: {
    label: 'Length',
    base: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, ft: 0.3048, inch: 0.0254 },
    names: { m: 'Meters', km: 'Kilometers', cm: 'Centimeters', mm: 'Millimeters', mile: 'Miles', yard: 'Yards', ft: 'Feet', inch: 'Inches' }
  },
  weight: {
    label: 'Weight',
    base: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125, ton: 1000 },
    names: { kg: 'Kilograms', g: 'Grams', mg: 'Milligrams', lb: 'Pounds', oz: 'Ounces', ton: 'Metric tons' }
  },
  temperature: {
    label: 'Temperature',
    names: { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' }
  }
};

const unitCategorySel = document.getElementById('unitCategory');
const unitFromSel = document.getElementById('unitFrom');
const unitToSel = document.getElementById('unitTo');

function populateUnitSelects() {
  const group = UNIT_GROUPS[unitCategorySel.value];
  const keys = Object.keys(group.names);
  const optionsHtml = keys.map(k => `<option value="${k}">${group.names[k]}</option>`).join('');
  unitFromSel.innerHTML = optionsHtml;
  unitToSel.innerHTML = optionsHtml;
  if (keys.length > 1) unitToSel.selectedIndex = 1;
}

function convertTemperature(value, from, to) {
  let celsius;
  if (from === 'c') celsius = value;
  else if (from === 'f') celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === 'c') return celsius;
  if (to === 'f') return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

if (unitCategorySel) {
  unitCategorySel.addEventListener('change', populateUnitSelects);
  populateUnitSelects();

  document.getElementById('unitCalcBtn').addEventListener('click', () => {
    const value = parseFloat(document.getElementById('unitValue').value);
    const box = document.getElementById('unitResult');
    const category = unitCategorySel.value;
    const from = unitFromSel.value;
    const to = unitToSel.value;
    if (!Number.isFinite(value)) { showResult(box, 'Enter a value to convert.'); return; }

    let result;
    if (category === 'temperature') {
      result = convertTemperature(value, from, to);
    } else {
      const group = UNIT_GROUPS[category];
      result = (value * group.base[from]) / group.base[to];
    }
    const rounded = parseFloat(result.toFixed(6));
    showResult(box, `${rounded.toLocaleString()} ${to}`, `${value} ${from} = ${rounded.toLocaleString()} ${to}`);
  });
}