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

function displayCurrentStep() {
  const stepData = currentScenario.steps.find(step => step.step === currentStep);
  if (!stepData) {
    console.warn(`Шаг ${currentStep} не найден`);
    return;
  }

  const stepImgContainer = document.getElementById("step-img");
  const stepCounter = document.getElementById("step-counter");

  if (stepImgContainer && stepData.image) {
    stepImgContainer.src = stepData.image;
  }

  if (stepCounter) {
    stepCounter.textContent = `${currentStep} из ${currentScenario.totalSteps}`;
  }

  console.log("Отображён шаг:", currentStep);
}


function nextStep() {
  if (currentStep < currentScenario.totalSteps) {
    currentStep++;
    displayCurrentStep();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    displayCurrentStep();
  }
}
