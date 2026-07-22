// The cost of training — interactive visualization
//
// Renders a timeline scatter of historical deep-learning training runs and
// lets the reader move two knobs (peak FLOP/s per chip, MFU) to see how the
// derived numbers — wall time, energy, megawatts, dollars — fall out.
//
// All FLOP counts come from published papers where possible and from Epoch AI
// (epochai.org/data/notable-ai-models) otherwise. Cited inline in the model
// objects below; flagged in the UI when estimated.
//
// No external dependencies.

(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────────
  //  Data
  // ──────────────────────────────────────────────────────────────────────────

  const MODELS = [
    {
      id: 'lenet5',
      name: 'LeNet-5',
      year: 1998,
      citation: 'LeCun, Bottou, Bengio & Haffner (1998)',
      params: 60e3,
      tokens: null,
      flops: 2.3e9,
      flopsEstimated: true,
      chipName: 'workstation CPU',
      numChips: 1,
      peakFlopsPerChip: 1e8,
      mfu: 0.10,
      wattsPerChip: 30,
      pricePerChip: 5000,
      pricePerChipHour: 0,
      pricePerKwh: 0.08,
      pue: 1.5,
    },
    {
      id: 'alexnet',
      name: 'AlexNet',
      year: 2012,
      citation: 'Krizhevsky, Sutskever & Hinton (2012)',
      params: 60e6,
      tokens: null,
      flops: 4.7e17,
      flopsEstimated: false,
      chipName: 'GTX 580',
      numChips: 2,
      peakFlopsPerChip: 1.58e12,
      mfu: 0.30,
      wattsPerChip: 244,
      pricePerChip: 500,
      pricePerChipHour: 0,
      pricePerKwh: 0.10,
      pue: 1.4,
    },
    {
      id: 'vgg16',
      name: 'VGG-16',
      year: 2014,
      citation: 'Simonyan & Zisserman (2014)',
      params: 138e6,
      tokens: null,
      flops: 1.5e19,
      flopsEstimated: true,
      chipName: 'Titan Black',
      numChips: 4,
      peakFlopsPerChip: 5.12e12,
      mfu: 0.30,
      wattsPerChip: 250,
      pricePerChip: 1000,
      pricePerChipHour: 0,
      pricePerKwh: 0.08,
      pue: 1.3,
    },
    {
      id: 'resnet50',
      name: 'ResNet-50',
      year: 2015,
      citation: 'He, Zhang, Ren & Sun (2015)',
      params: 25e6,
      tokens: null,
      flops: 3.5e18,
      flopsEstimated: true,
      chipName: 'Tesla M40',
      numChips: 8,
      peakFlopsPerChip: 7e12,
      mfu: 0.30,
      wattsPerChip: 250,
      pricePerChip: 5000,
      pricePerChipHour: 0,
      pricePerKwh: 0.08,
      pue: 1.3,
    },
    {
      id: 'alphago',
      name: 'AlphaGo Lee',
      year: 2016,
      citation: 'Silver et al. (2016)',
      params: 12e6,
      tokens: null,
      flops: 4.0e22,
      flopsEstimated: true,
      chipName: 'TPU v1 (mixed)',
      numChips: 50,
      peakFlopsPerChip: 9.2e13,
      mfu: 0.20,
      wattsPerChip: 75,
      pricePerChip: 0,
      pricePerChipHour: 1.50,
      pricePerKwh: 0.07,
      pue: 1.2,
    },
    {
      id: 'transformer',
      name: 'Transformer (base)',
      year: 2017,
      citation: 'Vaswani et al. (2017)',
      params: 65e6,
      tokens: null,
      flops: 7.4e18,
      flopsEstimated: true,
      chipName: 'P100',
      numChips: 8,
      peakFlopsPerChip: 9.3e12,
      mfu: 0.30,
      wattsPerChip: 250,
      pricePerChip: 5000,
      pricePerChipHour: 1.50,
      pricePerKwh: 0.07,
      pue: 1.2,
    },
    {
      id: 'bert-large',
      name: 'BERT-Large',
      year: 2018,
      citation: 'Devlin et al. (2018)',
      params: 340e6,
      tokens: 137e9,
      flops: 2.9e20,
      flopsEstimated: true,
      chipName: 'TPU v3',
      numChips: 64,
      peakFlopsPerChip: 1.23e14,
      mfu: 0.25,
      wattsPerChip: 200,
      pricePerChip: 0,
      pricePerChipHour: 4.50,
      pricePerKwh: 0.07,
      pue: 1.15,
    },
    {
      id: 'gpt2',
      name: 'GPT-2',
      year: 2019,
      citation: 'Radford et al. (2019)',
      params: 1.5e9,
      tokens: 40e9,
      flops: 1.5e21,
      flopsEstimated: true,
      chipName: 'V100',
      numChips: 32,
      peakFlopsPerChip: 1.25e14,
      mfu: 0.25,
      wattsPerChip: 300,
      pricePerChip: 8000,
      pricePerChipHour: 1.50,
      pricePerKwh: 0.07,
      pue: 1.15,
    },
    {
      id: 't5-11b',
      name: 'T5-11B',
      year: 2019,
      citation: 'Raffel et al. (2019)',
      params: 11e9,
      tokens: 1e12,
      flops: 1.0e23,
      flopsEstimated: true,
      chipName: 'TPU v3',
      numChips: 1024,
      peakFlopsPerChip: 1.23e14,
      mfu: 0.30,
      wattsPerChip: 200,
      pricePerChip: 0,
      pricePerChipHour: 4.50,
      pricePerKwh: 0.07,
      pue: 1.12,
    },
    {
      id: 'gpt3',
      name: 'GPT-3',
      year: 2020,
      citation: 'Brown et al. (2020)',
      params: 175e9,
      tokens: 300e9,
      flops: 3.14e23,
      flopsEstimated: false,
      chipName: 'V100',
      numChips: 10000,
      peakFlopsPerChip: 1.25e14,
      mfu: 0.21,
      wattsPerChip: 300,
      pricePerChip: 8000,
      pricePerChipHour: 1.50,
      pricePerKwh: 0.07,
      pue: 1.12,
    },
    {
      id: 'alphafold2',
      name: 'AlphaFold 2',
      year: 2021,
      citation: 'Jumper et al. (2021)',
      params: 93e6,
      tokens: null,
      flops: 1.0e23,
      flopsEstimated: true,
      chipName: 'TPU v3',
      numChips: 128,
      peakFlopsPerChip: 1.23e14,
      mfu: 0.20,
      wattsPerChip: 200,
      pricePerChip: 0,
      pricePerChipHour: 4.50,
      pricePerKwh: 0.07,
      pue: 1.12,
    },
    {
      id: 'mt-nlg',
      name: 'Megatron-Turing NLG',
      year: 2021,
      citation: 'Smith et al. (2022)',
      params: 530e9,
      tokens: 270e9,
      flops: 1.4e24,
      flopsEstimated: true,
      chipName: 'A100',
      numChips: 4480,
      peakFlopsPerChip: 3.12e14,
      mfu: 0.30,
      wattsPerChip: 400,
      pricePerChip: 15000,
      pricePerChipHour: 1.50,
      pricePerKwh: 0.07,
      pue: 1.12,
    },
    {
      id: 'chinchilla',
      name: 'Chinchilla',
      year: 2022,
      citation: 'Hoffmann et al. (2022)',
      params: 70e9,
      tokens: 1.4e12,
      flops: 5.76e23,
      flopsEstimated: false,
      chipName: 'TPU v4',
      numChips: 1024,
      peakFlopsPerChip: 2.75e14,
      mfu: 0.40,
      wattsPerChip: 192,
      pricePerChip: 0,
      pricePerChipHour: 3.20,
      pricePerKwh: 0.07,
      pue: 1.10,
    },
    {
      id: 'palm',
      name: 'PaLM',
      year: 2022,
      citation: 'Chowdhery et al. (2022)',
      params: 540e9,
      tokens: 780e9,
      flops: 2.5e24,
      flopsEstimated: false,
      chipName: 'TPU v4',
      numChips: 6144,
      peakFlopsPerChip: 2.75e14,
      mfu: 0.46,
      wattsPerChip: 192,
      pricePerChip: 0,
      pricePerChipHour: 3.20,
      pricePerKwh: 0.07,
      pue: 1.10,
    },
    {
      id: 'llama2-70b',
      name: 'LLaMA 2 70B',
      year: 2023,
      citation: 'Touvron et al. (2023)',
      params: 70e9,
      tokens: 2e12,
      flops: 8.4e23,
      flopsEstimated: false,
      chipName: 'A100',
      numChips: 2000,
      peakFlopsPerChip: 3.12e14,
      mfu: 0.40,
      wattsPerChip: 400,
      pricePerChip: 15000,
      pricePerChipHour: 1.50,
      pricePerKwh: 0.07,
      pue: 1.10,
    },
    {
      id: 'gpt4',
      name: 'GPT-4',
      year: 2023,
      citation: 'OpenAI (2023); Epoch AI estimates',
      params: 1.8e12,
      tokens: 13e12,
      flops: 2.1e25,
      flopsEstimated: true,
      chipName: 'A100',
      numChips: 25000,
      peakFlopsPerChip: 3.12e14,
      mfu: 0.32,
      wattsPerChip: 400,
      pricePerChip: 15000,
      pricePerChipHour: 1.50,
      pricePerKwh: 0.07,
      pue: 1.10,
    },
    {
      id: 'gemini',
      name: 'Gemini 1.0 Ultra',
      year: 2023,
      citation: 'Gemini Team (2023); Epoch AI estimates',
      params: null,
      tokens: null,
      flops: 5.0e25,
      flopsEstimated: true,
      chipName: 'TPU v4',
      numChips: 57344,
      peakFlopsPerChip: 2.75e14,
      mfu: 0.40,
      wattsPerChip: 192,
      pricePerChip: 0,
      pricePerChipHour: 3.20,
      pricePerKwh: 0.07,
      pue: 1.10,
    },
    {
      id: 'claude3opus',
      name: 'Claude 3 Opus',
      year: 2024,
      citation: 'Anthropic (2024); Epoch AI estimates',
      params: null,
      tokens: null,
      flops: 1.6e25,
      flopsEstimated: true,
      chipName: 'H100',
      numChips: 16000,
      peakFlopsPerChip: 9.89e14,
      mfu: 0.30,
      wattsPerChip: 700,
      pricePerChip: 30000,
      pricePerChipHour: 4.00,
      pricePerKwh: 0.07,
      pue: 1.10,
    },
    {
      id: 'frontier-2025',
      name: 'frontier-class, 2025',
      year: 2025,
      citation: 'composite estimate',
      params: null,
      tokens: null,
      flops: 1.0e26,
      flopsEstimated: true,
      chipName: 'H100',
      numChips: 100000,
      peakFlopsPerChip: 9.89e14,
      mfu: 0.35,
      wattsPerChip: 700,
      pricePerChip: 30000,
      pricePerChipHour: 4.00,
      pricePerKwh: 0.07,
      pue: 1.10,
    },
  ];

  // ──────────────────────────────────────────────────────────────────────────
  //  Helpers
  // ──────────────────────────────────────────────────────────────────────────

  function fmtSci(x, digits) {
    if (x === 0 || x == null || !isFinite(x)) return '—';
    digits = digits == null ? 2 : digits;
    const exp = Math.floor(Math.log10(Math.abs(x)));
    const mantissa = x / Math.pow(10, exp);
    return mantissa.toFixed(digits) + ' × 10' + sup(exp);
  }

  function sup(n) {
    const map = { '-': '⁻', '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹' };
    return String(n).split('').map(c => map[c] || c).join('');
  }

  function fmtNum(x, digits) {
    if (x === 0 || x == null || !isFinite(x)) return '—';
    digits = digits == null ? 1 : digits;
    if (Math.abs(x) < 1) return x.toFixed(2);
    if (Math.abs(x) < 1000) return x.toFixed(digits);
    if (Math.abs(x) < 1e6) return (x / 1e3).toFixed(digits) + 'K';
    if (Math.abs(x) < 1e9) return (x / 1e6).toFixed(digits) + 'M';
    if (Math.abs(x) < 1e12) return (x / 1e9).toFixed(digits) + 'B';
    return (x / 1e12).toFixed(digits) + 'T';
  }

  function fmtMoney(x) {
    if (x == null || !isFinite(x)) return '—';
    if (x < 1) return '$' + x.toFixed(2);
    if (x < 1000) return '$' + Math.round(x);
    if (x < 1e6) return '$' + (x / 1e3).toFixed(1) + 'K';
    if (x < 1e9) return '$' + (x / 1e6).toFixed(2) + 'M';
    return '$' + (x / 1e9).toFixed(2) + 'B';
  }

  function fmtTime(hours) {
    if (hours == null || !isFinite(hours)) return '—';
    if (hours < 1) return (hours * 60).toFixed(0) + ' min';
    if (hours < 48) return hours.toFixed(1) + ' hr';
    const days = hours / 24;
    if (days < 60) return days.toFixed(1) + ' days';
    const months = days / 30.4;
    if (months < 18) return months.toFixed(1) + ' months';
    return (days / 365).toFixed(2) + ' years';
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    }
    if (children) for (const c of [].concat(children)) {
      if (c == null) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  function svgEl(tag, attrs) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (const k in attrs) {
      if (k === 'text') node.textContent = attrs[k];
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    }
    return node;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  State
  // ──────────────────────────────────────────────────────────────────────────

  const state = {
    selectedId: 'gpt3',
    peakFlops: null, // populated from selected model on init
    mfu: null,
  };

  function getModel(id) {
    return MODELS.find(m => m.id === id) || MODELS[0];
  }

  function currentModel() {
    return getModel(state.selectedId);
  }

  function selectModel(id, opts) {
    opts = opts || {};
    state.selectedId = id;
    const m = getModel(id);
    if (!opts.preserveSliders) {
      state.peakFlops = m.peakFlopsPerChip;
      state.mfu = m.mfu;
    }
    renderAll();
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Derived numbers
  // ──────────────────────────────────────────────────────────────────────────

  function derive(m) {
    const peak = state.peakFlops;
    const mfu = state.mfu;
    const chipHours = m.flops / (peak * mfu * 3600);
    const wallHours = chipHours / m.numChips;
    const energyKwh = chipHours * m.wattsPerChip * m.pue / 1000;
    const peakPowerMw = (m.numChips * m.wattsPerChip * m.pue) / 1e6;
    const cloudCost = chipHours * m.pricePerChipHour;
    const electricityCost = energyKwh * m.pricePerKwh;
    const hardwareCost = m.numChips * m.pricePerChip;
    return {
      chipHours,
      wallHours,
      energyKwh,
      peakPowerMw,
      cloudCost,
      electricityCost,
      hardwareCost,
      flops: m.flops,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Scatter plot
  // ──────────────────────────────────────────────────────────────────────────

  const PLOT = {
    width: 1000,
    height: 380,
    margin: { top: 24, right: 24, bottom: 44, left: 60 },
    xMin: 1996,
    xMax: 2027,
    yMin: 1e9,
    yMax: 1e26,
  };

  function xScale(year) {
    const w = PLOT.width - PLOT.margin.left - PLOT.margin.right;
    return PLOT.margin.left + ((year - PLOT.xMin) / (PLOT.xMax - PLOT.xMin)) * w;
  }
  function yScale(flops) {
    const h = PLOT.height - PLOT.margin.top - PLOT.margin.bottom;
    const lo = Math.log10(PLOT.yMin), hi = Math.log10(PLOT.yMax);
    const t = (Math.log10(flops) - lo) / (hi - lo);
    return PLOT.margin.top + h - t * h;
  }

  function renderScatter() {
    const svg = svgEl('svg', {
      viewBox: '0 0 ' + PLOT.width + ' ' + PLOT.height,
      preserveAspectRatio: 'xMidYMid meet',
      width: '100%',
    });

    // y gridlines (every order of magnitude from 1e9 to 1e26)
    for (let exp = 9; exp <= 26; exp += 1) {
      const y = yScale(Math.pow(10, exp));
      svg.appendChild(svgEl('line', {
        class: 'gridline',
        x1: PLOT.margin.left,
        x2: PLOT.width - PLOT.margin.right,
        y1: y,
        y2: y,
      }));
    }

    // y-axis labels (every 3 orders of magnitude for legibility)
    for (let exp = 9; exp <= 26; exp += 3) {
      const y = yScale(Math.pow(10, exp));
      const t = svgEl('text', {
        class: 'label',
        x: PLOT.margin.left - 8,
        y: y + 3,
        'text-anchor': 'end',
        text: '10' + sup(exp),
      });
      svg.appendChild(t);
    }

    // y-axis title
    svg.appendChild(svgEl('text', {
      class: 'axis-title',
      x: 12,
      y: PLOT.margin.top + 6,
      'text-anchor': 'start',
      text: 'training compute (FLOPs)',
    }));

    // x-axis labels (years)
    const xTicks = [1998, 2005, 2010, 2015, 2020, 2025];
    for (const yr of xTicks) {
      const x = xScale(yr);
      svg.appendChild(svgEl('line', {
        class: 'gridline',
        x1: x, x2: x,
        y1: PLOT.margin.top,
        y2: PLOT.height - PLOT.margin.bottom,
      }));
      svg.appendChild(svgEl('text', {
        class: 'label',
        x: x,
        y: PLOT.height - PLOT.margin.bottom + 18,
        'text-anchor': 'middle',
        text: String(yr),
      }));
    }

    // axis lines
    svg.appendChild(svgEl('line', {
      class: 'axis',
      x1: PLOT.margin.left,
      x2: PLOT.width - PLOT.margin.right,
      y1: PLOT.height - PLOT.margin.bottom,
      y2: PLOT.height - PLOT.margin.bottom,
    }));

    // dots + labels
    for (const m of MODELS) {
      const x = xScale(m.year);
      const y = yScale(m.flops);
      const isSelected = m.id === state.selectedId;
      const dot = svgEl('circle', {
        class: 'model-dot' + (isSelected ? ' selected' : ''),
        cx: x, cy: y,
        r: isSelected ? 5 : 3,
        onclick: () => selectModel(m.id),
      });
      svg.appendChild(dot);

      // hit-area for easier clicking
      svg.appendChild(svgEl('circle', {
        cx: x, cy: y, r: 12,
        fill: 'transparent',
        style: 'cursor:pointer;',
        onclick: () => selectModel(m.id),
      }));

      // label position: alternate above/below to reduce overlap
      const above = (m.year % 2 === 0);
      const dy = above ? -10 : 16;
      const label = svgEl('text', {
        class: 'model-label' + (isSelected ? ' selected' : ''),
        x: x,
        y: y + dy,
        'text-anchor': 'middle',
        text: m.name,
        onclick: () => selectModel(m.id),
        style: 'cursor:pointer;',
      });
      svg.appendChild(label);
    }

    return svg;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Sliders
  // ──────────────────────────────────────────────────────────────────────────

  const PEAK_MIN_LOG = 8;   // 1e8 FLOP/s
  const PEAK_MAX_LOG = 16;  // 1e16 FLOP/s

  function peakSliderValue(flops) {
    const t = (Math.log10(flops) - PEAK_MIN_LOG) / (PEAK_MAX_LOG - PEAK_MIN_LOG);
    return Math.max(0, Math.min(1, t));
  }

  function peakFromSlider(t) {
    return Math.pow(10, PEAK_MIN_LOG + t * (PEAK_MAX_LOG - PEAK_MIN_LOG));
  }

  function renderSliders() {
    const block = el('div', { class: 'viz-block' }, [
      el('div', { class: 'viz-block-title' }, 'Conversion knobs'),
    ]);

    // Peak FLOP/s slider (log scale)
    const peakRow = el('div', { class: 'slider-row' });
    const peakLabel = el('div', { class: 'slider-label' }, [
      el('span', { class: 'name' }, 'peak FLOP/s per chip'),
      el('span', { class: 'value', id: 'peak-value' }, fmtSci(state.peakFlops, 1) + '/s'),
    ]);
    peakRow.appendChild(peakLabel);

    const peakInput = el('input', {
      type: 'range',
      min: 0,
      max: 1000,
      step: 1,
      value: Math.round(peakSliderValue(state.peakFlops) * 1000),
    });
    peakInput.addEventListener('input', (e) => {
      const t = e.target.value / 1000;
      state.peakFlops = peakFromSlider(t);
      renderReadout();
      document.getElementById('peak-value').textContent = fmtSci(state.peakFlops, 1) + '/s';
    });
    peakRow.appendChild(peakInput);

    const peakTicks = el('div', { class: 'slider-ticks' });
    [['CPU', 1e9], ['GTX 580', 1.58e12], ['V100', 1.25e14], ['A100', 3.12e14], ['H100 FP8', 9.89e14]].forEach(([n]) => {
      peakTicks.appendChild(el('span', null, n));
    });
    peakRow.appendChild(peakTicks);

    peakRow.appendChild(el('div', { class: 'slider-note' },
      'Per-chip throughput at the precision used. A V100 does ' +
      '125 TFLOP/s in FP16 but only 15.7 TFLOP/s in FP32; an H100 in FP8 reaches ' +
      '989 TFLOP/s. The slider sweeps the era of training accelerators.'));
    block.appendChild(peakRow);

    // MFU slider (linear)
    const mfuRow = el('div', { class: 'slider-row' });
    const mfuLabel = el('div', { class: 'slider-label' }, [
      el('span', { class: 'name' }, 'MFU (utilization)'),
      el('span', { class: 'value', id: 'mfu-value' }, (state.mfu * 100).toFixed(0) + '%'),
    ]);
    mfuRow.appendChild(mfuLabel);

    const mfuInput = el('input', {
      type: 'range',
      min: 5,
      max: 65,
      step: 1,
      value: Math.round(state.mfu * 100),
    });
    mfuInput.addEventListener('input', (e) => {
      state.mfu = e.target.value / 100;
      renderReadout();
      document.getElementById('mfu-value').textContent = (state.mfu * 100).toFixed(0) + '%';
    });
    mfuRow.appendChild(mfuInput);

    const mfuTicks = el('div', { class: 'slider-ticks' });
    ['5%', '20%', '35%', '50%', '65%'].forEach(t => {
      mfuTicks.appendChild(el('span', null, t));
    });
    mfuRow.appendChild(mfuTicks);

    mfuRow.appendChild(el('div', { class: 'slider-note' },
      'Model-FLOPs utilization — the fraction of peak chip throughput ' +
      'the run actually achieves. Memory bandwidth, networking, and data ' +
      'pipeline stalls all eat into it. PaLM hit 46%; many runs sit near 25%.'));
    block.appendChild(mfuRow);

    return block;
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Selected-model header
  // ──────────────────────────────────────────────────────────────────────────

  function renderSelectedHeader() {
    const m = currentModel();
    return el('div', { class: 'selected-model' }, [
      el('span', { class: 'name' }, m.name),
      el('span', { class: 'year' }, String(m.year)),
      el('span', { class: 'citation' }, m.citation + (m.flopsEstimated ? ' · FLOPs estimated' : '')),
    ]);
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Read-only assumptions
  // ──────────────────────────────────────────────────────────────────────────

  function renderAssumptions() {
    const m = currentModel();
    const items = [
      ['hardware', m.numChips.toLocaleString() + ' × ' + m.chipName],
      ['watts/chip', m.wattsPerChip + ' W'],
      ['$/chip-hour (cloud)', m.pricePerChipHour > 0 ? '$' + m.pricePerChipHour.toFixed(2) : '—'],
      ['$/chip (capital)', m.pricePerChip > 0 ? fmtMoney(m.pricePerChip) : '—'],
      ['$/kWh', '$' + m.pricePerKwh.toFixed(2)],
      ['PUE', m.pue.toFixed(2)],
    ];
    if (m.params) items.unshift(['parameters', fmtNum(m.params, 1)]);
    if (m.tokens) items.splice(1, 0, ['training tokens', fmtNum(m.tokens, 1)]);

    const ul = el('ul', { class: 'assumptions-list' });
    for (const [name, val] of items) {
      ul.appendChild(el('li', null, [
        el('span', { class: 'name' }, name),
        el('span', { class: 'value' }, val),
      ]));
    }
    return el('div', { class: 'assumptions' }, [
      el('div', { class: 'assumptions-title' }, 'Era-appropriate assumptions (fixed; change with model)'),
      ul,
    ]);
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Derived readout
  // ──────────────────────────────────────────────────────────────────────────

  function renderReadout() {
    const m = currentModel();
    const d = derive(m);
    const node = document.getElementById('viz-readout');
    if (!node) return;
    node.innerHTML = '';

    node.appendChild(el('div', { class: 'viz-block-title' }, 'Derived numbers'));

    const rows = [
      {
        name: 'training compute',
        value: fmtSci(d.flops, 2) + ' FLOPs',
        formula: '6 × N × T   (per Brown et al., 2020)',
        published: true,
      },
      {
        name: 'chip-hours',
        value: fmtNum(d.chipHours, 1) + ' h',
        formula: 'FLOPs ÷ (peak × MFU × 3600)',
      },
      {
        name: 'wall time on this cluster',
        value: fmtTime(d.wallHours),
        formula: 'chip-hours ÷ ' + m.numChips.toLocaleString() + ' chips',
      },
      {
        name: 'energy',
        value: fmtNum(d.energyKwh / 1000, 2) + ' MWh',
        formula: 'chip-hours × ' + m.wattsPerChip + ' W × PUE ' + m.pue.toFixed(2),
      },
      {
        name: 'peak power draw',
        value: d.peakPowerMw < 1
          ? (d.peakPowerMw * 1000).toFixed(0) + ' kW'
          : d.peakPowerMw.toFixed(2) + ' MW',
        formula: m.numChips.toLocaleString() + ' × ' + m.wattsPerChip + ' W × PUE ' + m.pue.toFixed(2),
      },
      {
        name: 'cloud rental cost',
        value: m.pricePerChipHour > 0 ? fmtMoney(d.cloudCost) : '— (not on cloud)',
        formula: m.pricePerChipHour > 0
          ? 'chip-hours × $' + m.pricePerChipHour.toFixed(2) + '/chip-hr'
          : 'no cloud rate for ' + m.chipName,
      },
      {
        name: 'electricity cost',
        value: fmtMoney(d.electricityCost),
        formula: 'MWh × 1000 × $' + m.pricePerKwh.toFixed(2) + '/kWh',
      },
      {
        name: 'hardware capital',
        value: m.pricePerChip > 0 ? fmtMoney(d.hardwareCost) : '— (cloud only)',
        formula: m.pricePerChip > 0
          ? m.numChips.toLocaleString() + ' × $' + m.pricePerChip.toLocaleString() + ' per chip'
          : 'no retail price for ' + m.chipName,
      },
    ];

    for (const r of rows) {
      const row = el('div', { class: 'readout-row' + (r.published ? ' published' : '') }, [
        el('span', { class: 'readout-name' }, r.name),
        el('span', { class: 'readout-value' }, r.value),
        el('div', { class: 'readout-formula' }, r.formula),
      ]);
      node.appendChild(row);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Mount + render
  // ──────────────────────────────────────────────────────────────────────────

  function renderAll() {
    const root = document.getElementById('viz-root');
    if (!root) return;
    root.innerHTML = '';

    // Scatter
    const figure = el('div', { class: 'viz-figure' });
    figure.appendChild(renderScatter());
    figure.appendChild(el('div', { class: 'figure-caption' },
      'Reported training compute for landmark deep-learning models, 1998–2025. ' +
      'Click any model to load its era-appropriate defaults into the knobs below. ' +
      'Vertical scale is logarithmic and spans seventeen orders of magnitude.'));
    root.appendChild(figure);

    // Selected-model header
    root.appendChild(renderSelectedHeader());

    // Two-column grid: sliders | derived readout
    const grid = el('div', { class: 'viz-grid' });
    grid.appendChild(renderSliders());
    grid.appendChild(el('div', { class: 'viz-block', id: 'viz-readout' }));
    root.appendChild(grid);

    // Read-only assumptions
    root.appendChild(renderAssumptions());

    // Populate derived numbers
    renderReadout();
  }

  function init() {
    const root = document.getElementById('viz-root');
    if (!root) return;
    const m = getModel(state.selectedId);
    state.peakFlops = m.peakFlopsPerChip;
    state.mfu = m.mfu;
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
