let currentStep = 1;
let currentScenario = null;

async function setScenarioTitle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;
  try {
    const scenarios = await loadScenarios();
    const scenario = scenarios.find(s => String(s.id) === id);
    if (scenario && scenario.name) {
      document.title = scenario.name;
    }
  } catch(e) {}
}
setScenarioTitle();

async function loadScenarios() {  
  const response = await fetch('scenarios.json');
  if (!response.ok) throw new Error('Failed to load scenarios');
  const scenarios = await response.json();
  return scenarios; 
}

async function loadScenario() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return null;

  try {
    const scenarios = await loadScenarios();
    const scenario = scenarios.find(s => String(s.id) === id);
    return scenario || null; 
  } catch (err) {
    console.error('Ошибка при загрузке сценария:', err);
    return null;
  }
}


async function scenarioHandler() {
  const scenario = await loadScenario();
  const scenarioContainer = document.getElementById("scenario-wrapper");
  if (!scenarioContainer) return;
  if (!scenario) {
    scenarioContainer.textContent = "Сценарий не найден";
    return; 
  }
  currentScenario = scenario;
  currentScenario.totalSteps = currentScenario.steps.length;

  const saved = localStorage.getItem('hotspot-step');
  if (saved) {
    try {
      const obj = JSON.parse(saved);
      if (obj && typeof obj.step === 'number' && typeof obj.hotspot === 'number') {
        currentStep = obj.step;
        currentHotspotIndex = obj.hotspot;
      }
    } catch(e) {}
  }
  displayCurrentStep();
}



let currentHotspotIndex = 0;

function displayCurrentStep() {
  localStorage.setItem('hotspot-step', JSON.stringify({step: currentStep, hotspot: currentHotspotIndex}));
  const stepData = currentScenario.steps.find(step => step.step === currentStep);
  if (!stepData) return;

  const hotspotContainer = document.querySelector(".hotspot-container");
  const stepImg = document.getElementById("step-img");
  if (!stepImg) return;
  stepImg.onclick = null;

  if (displayCurrentStep._lastStep === currentStep && displayCurrentStep._lastHotspotIndex !== undefined && displayCurrentStep._lastHotspotIndex !== currentHotspotIndex) {
    const prevHotspot = stepData.hotspots[displayCurrentStep._lastHotspotIndex];
    const newHotspot = stepData.hotspots[currentHotspotIndex];
    const container = document.querySelector('.hotspot-container');
    const prevDiv = container && container.firstElementChild;
    if (prevDiv && prevDiv.animateTo) {
      const tooltip = prevDiv.querySelector('.tooltip');
      if (tooltip) tooltip.style.opacity = 0;
      prevDiv.animateTo(newHotspot, () => {
        displayCurrentStep._lastHotspotIndex = currentHotspotIndex;
        hotspotContainer.innerHTML = "";
        addHotspot(newHotspot);
      });
      return;
    }
  }

  if (displayCurrentStep._lastStep !== currentStep) {
    displayCurrentStep._lastHotspotIndex = 0;
    if (!displayCurrentStep._fromPrevStep) {
      currentHotspotIndex = 0;
    }
    displayCurrentStep._lastStep = currentStep;
    displayCurrentStep._fromPrevStep = false;
  }

  // --- Анимация отображения шага ---
  let displayType = (stepData.display && stepData.display[0]) || "fadeIn";
  stepImg.className = displayType;
  stepImg.style.opacity = "";
  stepImg.style.transform = "";
  stepImg.src = stepData.image;
  stepImg.onload = () => {
    stepImg.ondragstart = () => false;
    if (window.enableHotspotEditor) window.enableHotspotEditor();
    hotspotContainer.innerHTML = "";
    if (stepData.hotspots && stepData.hotspots.length > 0) {
      addHotspot(stepData.hotspots[currentHotspotIndex]);
    }
    displayCurrentStep._lastHotspotIndex = currentHotspotIndex;
    setTimeout(() => {
      stepImg.classList.add("show");
    }, 10);
  };
}



function nextStep() {
  const stepData = currentScenario.steps.find(step => step.step === currentStep);
  if (stepData && stepData.hotspots && stepData.hotspots.length > 1 && currentHotspotIndex < stepData.hotspots.length - 1) {
    currentHotspotIndex++;
    displayCurrentStep();
    return;
  }
  if (currentStep < currentScenario.totalSteps) {
    currentStep++;
    currentHotspotIndex = 0;
    displayCurrentStep();
  }
  if(currentStep === currentScenario.totalSteps) {
    localStorage.removeItem('hotspot-step');
    window.location.href = "index.html";
  }
}


function prevStep() {
  const stepData = currentScenario.steps.find(step => step.step === currentStep);
  if (stepData && stepData.hotspots && stepData.hotspots.length > 1 && currentHotspotIndex > 0) {
    currentHotspotIndex--;
    displayCurrentStep();
    return;
  }
  if (currentStep > 1) {
    currentStep--;
    const prevStepData = currentScenario.steps.find(step => step.step === currentStep);
    if (prevStepData && prevStepData.hotspots && prevStepData.hotspots.length > 0) {
      currentHotspotIndex = prevStepData.hotspots.length - 1;
    } else {
      currentHotspotIndex = 0;
    }
    displayCurrentStep._fromPrevStep = true;
    displayCurrentStep();
  }
}



