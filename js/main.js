let currentStep = 1;
let scenario = null;

async function loadScenarios() {
  const response = await fetch('../scenarios.json');
  if (!response.ok) throw new Error('Failed to load scenarios');
  const scenarios = await response.json();
  return scenarios; // возвращаем массив сценариев
}

async function loadScenario() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return null;

  try {
    const scenarios = await loadScenarios();
    const scenario = scenarios.find(s => String(s.id) === id);
    return scenario || null; // возвращаем найденный сценарий или null
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

  while(currentStep <= scenario.steps.length)
  {
    displayStep(currentStep);
  }
}

function displayStep(step){
    
}
