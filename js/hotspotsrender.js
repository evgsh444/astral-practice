function addHotspot(hs) {
    const container = document.querySelector('.hotspot-container');
    const hotspotDiv = document.createElement('div');
    hotspotDiv.className = 'hotspot';
    hotspotDiv.style.pointerEvents = 'auto';
    hotspotDiv.style.left = hs.xPercent + "%";
    hotspotDiv.style.top = hs.yPercent + "%";
    hotspotDiv.style.width = hs.width + "%";
    hotspotDiv.style.height = hs.height + "%";

    // Для анимации перемещения хотспота
    hotspotDiv.animateTo = function(newHs, cb) {
        hotspotDiv.classList.add('hotspot-animating');
        hotspotDiv.style.left = newHs.xPercent + "%";
        hotspotDiv.style.top = newHs.yPercent + "%";
        hotspotDiv.style.width = newHs.width + "%";
        hotspotDiv.style.height = newHs.height + "%";
        setTimeout(() => {
            hotspotDiv.classList.remove('hotspot-animating');
            if (cb) cb();
        }, 350);
    };

    
    const position = hs.tooltipPosition || 'top'; // top, bottom, left, right
    const align = hs.tooltipAlign || 'center'; // start, center, end
    const text = hs.tooltipText || 'Tooltip'; // Текст тултипа

    // Классы для тултипа и стрелки
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position} tooltip-${position}-${align}`;
    tooltip.textContent = text;
    tooltip.dataset.position = position;
    tooltip.dataset.align = align;
    tooltip.style.position = 'absolute';

    // Для анимации тултипа
    tooltip.animateTo = function(newHs, newPosition, newAlign, cb, newText, newTitle) {
        tooltip.classList.add('tooltip-animating', 'tooltip-hide-arrow');
        setTimeout(() => {
            positionTooltip(newHs, newPosition, newAlign);
            // Меняем текст и заголовок
            if (typeof newText === 'string') {
                const p = tooltip.querySelector('p');
                if (p) p.textContent = newText;
            }
            if (typeof newTitle === 'string') {
                const t = tooltip.querySelector('.tooltip-title');
                if (t) t.textContent = newTitle;
            }
            // Меняем классы для стрелки
            tooltip.className = `tooltip tooltip-${newPosition} tooltip-${newPosition}-${newAlign} tooltip-animating tooltip-hide-arrow`;
            setTimeout(() => {
                tooltip.classList.remove('tooltip-animating', 'tooltip-hide-arrow');
                if (cb) cb();
            }, 350);
        }, 200);
    };
    let arrowClass = '';
    if (position === 'top') {
        if (align === 'start') arrowClass = 'tooltip-arrow-bottom-left';
        else if (align === 'end') arrowClass = 'tooltip-arrow-bottom-right';
        else arrowClass = 'tooltip-arrow-bottom-center';
    } else if (position === 'bottom') {
        if (align === 'start') arrowClass = 'tooltip-arrow-top-left';
        else if (align === 'end') arrowClass = 'tooltip-arrow-top-right';
        else arrowClass = 'tooltip-arrow-top-center';
    } else if (position === 'left') {
        if (align === 'start') arrowClass = 'tooltip-arrow-right-top';
        else if (align === 'end') arrowClass = 'tooltip-arrow-right-bottom';
        else arrowClass = 'tooltip-arrow-right-center';
    } else if (position === 'right') {
        if (align === 'start') arrowClass = 'tooltip-arrow-left-top';
        else if (align === 'end') arrowClass = 'tooltip-arrow-left-bottom';
        else arrowClass = 'tooltip-arrow-left-center';
    }


    let tooltipContent = '';
    const titleHtml = hs.tooltipTitle ? `<div class="tooltip-title">${hs.tooltipTitle}</div>` : '';
    if (position === 'top') {
        tooltipContent = `
            <div class="tooltip-arrow ${arrowClass}"></div>
            <div class="tooltip-inner">
                ${titleHtml}
                <p>${hs.tooltipText || 'Tooltip'}</p>
                <div class="tooltip-actions">
                    <button class="prev" onclick="prevStep()">Назад</button>
                    <button class="next" onclick="nextStep()">Далее</button>
                </div>
            </div>
        `;
    } else if (position === 'bottom') {
        tooltipContent = `
            <div class="tooltip-inner">
                ${titleHtml}
                <p>${hs.tooltipText || 'Tooltip'}</p>
                <div class="tooltip-actions">
                    <button class="prev" onclick="prevStep()">Назад</button>
                    <button class="next" onclick="nextStep()">Далее</button>
                </div>
            </div>
            <div class="tooltip-arrow ${arrowClass}"></div>
        `;
    } else if (position === 'left') {
        tooltipContent = `
            <div class="tooltip-arrow ${arrowClass}"></div>
            <div class="tooltip-inner">
                ${titleHtml}
                <p>${hs.tooltipText || 'Tooltip'}</p>
                <div class="tooltip-actions">
                    <button class="prev" onclick="prevStep()">Назад</button>
                    <button class="next" onclick="nextStep()">Далее</button>
                </div>
            </div>
        `;
    } else if (position === 'right') {
        tooltipContent = `
            <div class="tooltip-inner">
                ${titleHtml}
                <p>${hs.tooltipText || 'Tooltip'}</p>
                <div class="tooltip-actions">
                    <button class="prev" onclick="prevStep()">Назад</button>
                    <button class="next" onclick="nextStep()">Далее</button>
                </div>
            </div>
            <div class="tooltip-arrow ${arrowClass}"></div>
        `;
    } else {
        tooltipContent = `
            <div class="tooltip-inner">
                ${titleHtml}
                <p>${hs.tooltipText || 'Tooltip'}</p>
                <div class="tooltip-actions">
                    <button class="prev" onclick="prevStep()">Назад</button>
                    <button class="next" onclick="nextStep()">Далее</button>
                </div>
            </div>
        `;
    }

    tooltip.innerHTML = tooltipContent;
    hotspotDiv.appendChild(tooltip);
    tooltip.style.display = 'block';
    // Плавное появление тултипа
    setTimeout(() => {
        tooltip.classList.add('tooltip-show');
    }, 10);

    const prevBtn = tooltip.querySelector('.prev');
    const nextBtn = tooltip.querySelector('.next');
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    }
    if (currentStep === currentScenario.totalSteps && currentHotspotIndex === currentScenario.steps[currentStep - 1].hotspots.length - 1) {
        nextBtn.textContent = 'Завершить';
    }


    // Функция для позиционирования tooltip (может принимать новые параметры)
    function positionTooltip(hsArg = hs, positionArg = position, alignArg = align) {
        tooltip.style.left = '';
        tooltip.style.top = '';
        tooltip.style.width = '';
        tooltip.style.maxWidth = '';
        requestAnimationFrame(() => {
            const ttRect = tooltip.getBoundingClientRect();
            const hsRect = hotspotDiv.getBoundingClientRect();
            let left = 0, top = 0;
            // TOP
            if (positionArg === 'top') {
                if (alignArg === 'start') {
                    left = 0;
                } else if (alignArg === 'end') {
                    left = hsRect.width - ttRect.width;
                } else {
                    left = (hsRect.width - ttRect.width) / 2;
                }
                top = -ttRect.height - 8;
            }
            // BOTTOM
            else if (positionArg === 'bottom') {
                if (alignArg === 'start') {
                    left = 0;
                } else if (alignArg === 'end') {
                    left = hsRect.width - ttRect.width;
                } else {
                    left = (hsRect.width - ttRect.width) / 2;
                }
                top = hsRect.height + 8;
            }
            // LEFT
            else if (positionArg === 'left') {
                left = -ttRect.width - 8;
                if (alignArg === 'start') {
                    top = 0;
                } else if (alignArg === 'end') {
                    top = hsRect.height - ttRect.height;
                } else {
                    top = (hsRect.height - ttRect.height) / 2;
                }
            }
            // RIGHT
            else if (positionArg === 'right') {
                left = hsRect.width + 8;
                if (alignArg === 'start') {
                    top = 0;
                } else if (alignArg === 'end') {
                    top = hsRect.height - ttRect.height;
                } else {
                    top = (hsRect.height - ttRect.height) / 2;
                }
            }
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });
    }

    window.addEventListener('resize', positionTooltip);
    setTimeout(positionTooltip, 0);
    hotspotDiv._removeTooltipResize = () => {
        window.removeEventListener('resize', positionTooltip);
    };
    container.appendChild(hotspotDiv);
}