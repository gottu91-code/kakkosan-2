import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
}

console.log('content script')

function encloseText() {
  const activeElement = document.activeElement;
  const activeTagName = activeElement.tagName;
  const selection = window.getSelection();

  if(activeTagName === 'TEXTAREA' || activeTagName === 'INPUT') {
    const inputElement = activeElement as HTMLInputElement
    const selectedText = selection.toString();
    inputElement.setRangeText(`【${selectedText}】`)
  }

  if(activeElement.hasAttribute('contenteditable')) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    const newText = document.createTextNode(`【${selectedText}】`);
    range.deleteContents();
    range.insertNode(newText);
  }
}

function addkakko() {
  const activeElement = document.activeElement;
  const activeTagName = activeElement.tagName;

  if(activeTagName === 'TEXTAREA' || activeTagName === 'INPUT') {
    const inputElement = activeElement as HTMLInputElement
    inputElement.setRangeText(`【】`)
  }

  if(activeElement.hasAttribute('contenteditable')) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const offset = range.startOffset;
    const containerNode = range.startContainer;

    range.insertNode(document.createTextNode('【】'));
    const newRange = document.createRange();
    newRange.setStart(containerNode, offset);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    const editableElement = activeElement as HTMLElement
    editableElement.focus();
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.menuItemId === 'enclose') {
    encloseText();
  }
  if(request.menuItemId === 'addkakko') {
    addkakko();
  }
});