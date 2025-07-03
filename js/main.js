let currentStep = 1;
let currentScenario = null;

async function loadScenarios() {
  const response = await fetch('../scenarios.json');
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
  displayCurrentStep();
}



let currentHotspotIndex = 0;

function displayCurrentStep() {
  const stepData = currentScenario.steps.find(step => step.step === currentStep);
  if (!stepData) return;

  if (displayCurrentStep._lastStep !== currentStep) {
    if (!displayCurrentStep._fromPrevStep) {
      currentHotspotIndex = 0;
    }
    displayCurrentStep._lastStep = currentStep;
    displayCurrentStep._fromPrevStep = false;
  }

  const hotspotContainer = document.querySelector(".hotspot-container");
  const stepImg = document.getElementById("step-img");
  if (!stepImg) return;
  stepImg.onclick = null;
  stepImg.onclick = function(e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`xPercent: ${x.toFixed(1)}, yPercent: ${y.toFixed(1)}`);
  };
  stepImg.src = stepData.image;
  stepImg.onload = () => {
    stepImg.ondragstart = () => false;
    if (window.enableHotspotEditor) window.enableHotspotEditor();
    hotspotContainer.innerHTML = "";
    // Если есть хотспоты, показываем только один по индексу
    if (stepData.hotspots && stepData.hotspots.length > 0) {
      addHotspot(stepData.hotspots[currentHotspotIndex]);
    }
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



