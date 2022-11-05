export function showElement(el: Element) {
  el.classList.remove('hide');
  el.classList.add('show');
}

export function hideElement(el: Element) {
  el.classList.remove('show');
  el.classList.add('hide');
}
