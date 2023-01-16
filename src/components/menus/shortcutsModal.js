const shortcutsModalOverlay = document.querySelector(".shortcuts-modal-overlay")
const shortcutsModal = document.querySelector(".shortcuts__modal")
const shortcutsModalContent = document.querySelector(".shortcuts-modal-content")
const shortcutsModalClose = document.querySelector(".close-shortcuts-modal")
const notifyShortcutsStatus = document.querySelector(".keyboard-disabled-sm-two")
export default function handleShortCutsModal(store) {

  function createShortcut(key, description) {
    const shortcut = document.createElement("div");
    shortcut.classList.add("sm-item");

    const shortcutKey = document.createElement("div");
    shortcutKey.classList.add("sm-key");
    
    const keyone = document.createElement("span")
    if (Array.isArray(key)) {
      const or = document.createElement("span")
      or.textContent = " or "
      const keytwo = document.createElement("span")
      keyone.textContent = key[0]
      keytwo.textContent = key[1]
      shortcutKey.append(keyone, or, keytwo)
    } else {
      keyone.textContent = key;
      shortcutKey.appendChild(keyone);
    }


    const shortcutDescription = document.createElement("div");
    shortcutDescription.classList.add("sm-description");
    shortcutDescription.textContent = description;
    shortcut.append(shortcutKey, shortcutDescription);
    return shortcut;
  }

  // close the modal and remove the event listener
  function handleShortcutsModalClose() {
    shortcutsModalOverlay.classList.add("hide-shortcuts")
    shortcutsModal.classList.add("hide-shortcuts")
    store.removeActiveOverlay("hide-shortcuts")
    document.removeEventListener("keydown", closeShortcutsOnKeydown)
  }

  // provide the ability to close the shortcuts modal with "escape" or with the keys that open it
  function closeShortcutsOnKeydown(e) {
    let inp = e.key.toLowerCase();
    if (inp === "escape" || inp === "/" || inp === "?") {
      handleShortcutsModalClose();
    }
  }

  function setStatusIcon(status) {
    if (status) {
      notifyShortcutsStatus.setAttribute("data-tooltip", "Keyboard shortcuts enabled")
      notifyShortcutsStatus.firstElementChild.setAttribute("fill", "var(--primary1)")
  
    } else {
      notifyShortcutsStatus.setAttribute("data-tooltip", "Keyboard shortcuts disabled")
      notifyShortcutsStatus.firstElementChild.setAttribute("fill", "var(--red1)")
    }
  }

  
  function handleShortcutsModalOpen() {
    shortcutsModalContent.innerText = "";
    shortcutsModalOverlay.classList.remove("hide-shortcuts")
    shortcutsModal.classList.remove("hide-shortcuts")
    store.addActiveOverlay("hide-shortcuts")
    
    const status = store.getShortcutsStatus()
    setStatusIcon(status)

    const shortcuts = store.getShortcuts();
    for (let i = 0; i < Object.values(shortcuts).length; i++) {
      const value = Object.values(shortcuts)[i]
      shortcutsModalContent.appendChild(createShortcut(
        value.shortcut,
        value.action,
      ));
    }


    function toggleShortcutsStatus() {
      const status = store.getShortcutsStatus() === false ? true : false;
      setStatusIcon(status);
      store.setShortcutsStatus(status);
    }

    shortcutsModalOverlay.onclick = handleShortcutsModalClose;
    shortcutsModalClose.onclick = handleShortcutsModalClose;
    notifyShortcutsStatus.onclick = toggleShortcutsStatus;
    document.addEventListener("keydown", closeShortcutsOnKeydown);
  }

  handleShortcutsModalOpen()
}