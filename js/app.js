let lastFocusedElement = null;

function openModal(modalId) {

    const modal = document.getElementById(modalId);

    if (!modal) return;

    lastFocusedElement = document.activeElement;

    modal.hidden = false;

    document.body.style.overflow = "hidden";

    const dialog = modal.querySelector(
        '[role="dialog"]'
    );

    const focusableElements = dialog.querySelectorAll(
        `
        button:not([disabled]),
        input:not([disabled]),
        select:not([disabled]),
        textarea:not([disabled]),
        [tabindex]:not([tabindex="-1"])
        `
    );

    if (focusableElements.length > 0) {

        focusableElements[0].focus();

    } else {

        dialog.focus();

    }

}


function closeModal(modalId) {

    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.hidden = true;

    document.body.style.overflow = "";

    if (lastFocusedElement) {

        lastFocusedElement.focus();

    }

}
