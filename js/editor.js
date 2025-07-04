let hotspotEditorEnabled = true; 

function enableHotspotEditor() {
  const stepImg = document.getElementById('step-img');
  if (!stepImg) return;

  // Удаляем старый overlay если есть
  let oldOverlay = document.getElementById('hotspot-editor-overlay');
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement('div');
  overlay.id = 'hotspot-editor-overlay';
  overlay.style.position = 'absolute';
  overlay.style.border = '2px dashed #000000';
  overlay.style.pointerEvents = 'none';
  overlay.style.display = 'none';
  overlay.style.zIndex = 1000;
  document.body.appendChild(overlay);

  let startX, startY;

  stepImg.onmousedown = function(e) {
    const rect = stepImg.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    overlay.style.left = `${rect.left + startX}px`;
    overlay.style.top = `${rect.top + startY}px`;
    overlay.style.width = '0px';
    overlay.style.height = '0px';
    overlay.style.display = 'block';

    function onMouseMove(ev) {
      const curX = ev.clientX - rect.left;
      const curY = ev.clientY - rect.top;
      const x = Math.min(startX, curX);
      const y = Math.min(startY, curY);
      const w = Math.abs(curX - startX);
      const h = Math.abs(curY - startY);
      overlay.style.left = `${rect.left + x}px`;
      overlay.style.top = `${rect.top + y}px`;
      overlay.style.width = `${w}px`;
      overlay.style.height = `${h}px`;
    }

    function onMouseUp(ev) {
      const endX = ev.clientX - rect.left;
      const endY = ev.clientY - rect.top;
      const x = Math.min(startX, endX);
      const y = Math.min(startY, endY);
      const w = Math.abs(endX - startX);
      const h = Math.abs(endY - startY);

      // проценты
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      const widthPercent = (w / rect.width) * 100;
      const heightPercent = (h / rect.height) * 100;

      // Форматированный JSON для вставки в сценарий
      const jsonStr = `{
        "xPercent": ${xPercent.toFixed(1)},
        "yPercent": ${yPercent.toFixed(1)},
        "width": ${widthPercent.toFixed(1)},
        "height": ${heightPercent.toFixed(1)},
        "tooltipPosition": "top",
        "tooltipAlign": "center",
        "tooltipTitle": "",
        "tooltipText": ""
        }`;
      console.log(jsonStr);

      overlay.style.display = 'none';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
}

// Вызовите эту функцию после загрузки изображения (например, в stepImg.onload)
if (hotspotEditorEnabled) {
  window.enableHotspotEditor = enableHotspotEditor;
}
