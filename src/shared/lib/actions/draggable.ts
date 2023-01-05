import { events, asyncIter } from '@rastrr-editor/core';
import type { Action } from 'svelte/types/runtime/action';
import { getCoords } from '../dom';

type DraggableOptions = {
  draggableSelector: string;
  callback: (prevIndex: number, nextIndex: number) => void;
};

type DraggableNode = {
  el: HTMLElement;
  coords: ReturnType<typeof getCoords>;
  index: number;
};

type DragDataTransfter = {
  /**
   * Node which will be moved in DOM
   */
  cloneNode: HTMLElement;
  /**
   * Node which will be dragged by user
   */
  dragNode: HTMLElement;
  /**
   * Drag node shift relative to pointer position
   */
  shift: Rastrr.Point;
  /**
   * Initial index of the node which is being dragged
   */
  index: number;
};

const draggable: Action = (
  draggableContainer,
  { draggableSelector, callback }: DraggableOptions
) => {
  const pointerdownEventsWithNodes = asyncIter.map(
    events.on(draggableContainer, 'pointerdown'),
    async (ev) => {
      const nodes = Array.from<HTMLElement, DraggableNode>(
        draggableContainer.querySelectorAll<HTMLElement>(draggableSelector),
        (el, index) => ({ el, coords: getCoords(el), index })
      );
      const draggableNode = nodes.find(({ el }) =>
        el.contains(ev.target as HTMLElement)
      );
      let dataTransfer = null;
      if (ev.button === 0 && draggableNode != null) {
        dataTransfer = await dragStart(draggableNode, ev);
      }
      return { ev, nodes, draggableNode, dataTransfer };
    }
  );

  void (async () => {
    for await (const {
      nodes,
      draggableNode,
      dataTransfer,
    } of pointerdownEventsWithNodes) {
      if (draggableNode != null && dataTransfer != null) {
        const onDragMove = createOnDragMove(nodes, dataTransfer);
        document.addEventListener('pointermove', onDragMove);
        document.addEventListener(
          'pointerup',
          createOnDragEnd({
            draggableContainer,
            originalNode: draggableNode.el,
            dataTransfer,
            onDragMove,
            callback,
          })
        );
      }
    }
  })();

  return {
    destroy() {
      void pointerdownEventsWithNodes.return(null);
    },
  };
};

export default draggable;

// Drag event handlers

/**
 * This functions starts the drag event on "pointerdown" event
 * after a timeout if user didn't perform the click
 * @param node
 * @param event
 * @returns
 */
async function dragStart(
  node: DraggableNode,
  event: MouseEvent
): Promise<DragDataTransfter | null> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      // Can't drag if there is no parent
      if (node.el.parentElement == null) {
        return resolve(null);
      }
      const { clientX, clientY } = event;
      const shift = {
        x: clientX - node.coords.left,
        y: clientY - node.coords.top,
      };

      const cloneNode = node.el.cloneNode(true) as HTMLElement;
      cloneNode.style.display = 'none';
      cloneNode.classList.add('mirror');
      node.el.after(cloneNode);

      const dragNode = createDragNode(node.el);
      setDragNodePosition(dragNode, event, shift);
      node.el.parentElement.append(dragNode);
      dragNode.focus();

      // Add "dragging" class to original node
      node.el.classList.add('dragging');
      resolve({ dragNode, cloneNode, shift, index: node.index });
    }, 150);

    // If user clicks it's not a drag event
    node.el.addEventListener(
      'pointerup',
      () => {
        clearTimeout(timeout);
        resolve(null);
      },
      { once: true }
    );
  });
}

/**
 * This function creates "pointermove" event handler
 * which repositions the drag node on pointer move
 * @param nodes Draggable nodes
 * @param dataTransfer Drag data transfer object
 * @returns "pointermove" event handler
 */
function createOnDragMove(
  nodes: DraggableNode[],
  dataTransfer: DragDataTransfter
): (event: MouseEvent) => void {
  const { dragNode, shift } = dataTransfer;
  return (event) => {
    setDragNodePosition(dragNode, event, shift);
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const topDiff = event.pageY - node.coords.top;
      const bottomDiff = node.coords.bottom - event.pageY;
      // Pointer is inside the "node"
      if (topDiff > 0 && bottomDiff > 0) {
        const appendAfter = topDiff > bottomDiff;
        setCloneNodePosition(node.el, i, appendAfter, dataTransfer);
        break;
      }
    }
  };
}

/**
 * This function creates "pointerup" event handler
 * @param param0 Drag end params
 * @returns "pointerup" event handler
 */
function createOnDragEnd({
  draggableContainer,
  originalNode,
  dataTransfer: { dragNode, cloneNode, index: prevIndex },
  onDragMove,
  callback,
}: {
  draggableContainer: HTMLElement;
  originalNode: HTMLElement;
  dataTransfer: DragDataTransfter;
  onDragMove: (event: MouseEvent) => void;
  callback: DraggableOptions['callback'];
}): (event: MouseEvent) => void {
  const pointerup = function (): void {
    // Remove drag node
    dragNode.remove();
    // Insert original node into the new position
    cloneNode.after(originalNode);
    // Remove clone node
    cloneNode.remove();
    const nextIndex = Array.from(draggableContainer.children).indexOf(
      originalNode
    );
    originalNode.classList.remove('dragging');
    // Cleanup
    document.removeEventListener('pointermove', onDragMove);
    document.removeEventListener('pointerup', pointerup);
    // Notify
    callback(prevIndex, nextIndex);
  };
  return pointerup;
}

// Helper functions for DOM nodes

/**
 * This function creates drag node which user will drag
 * @param el Draggable DOM node
 * @returns Drag DOM node
 */
function createDragNode(el: HTMLElement): HTMLElement {
  const dragNode = el.cloneNode(true) as HTMLElement;
  dragNode.style.width = `${el.clientWidth}px`;
  dragNode.style.position = 'fixed';
  dragNode.style.top = '0px';
  dragNode.style.left = '0px';
  dragNode.style.zIndex = '1';
  return dragNode;
}

/**
 * @param dragNode
 * @param event Mouse event
 * @param shift Cursor shift inside the node
 */
function setDragNodePosition(
  dragNode: HTMLElement,
  event: MouseEvent,
  shift: Rastrr.Point
): void {
  dragNode.style.transform = `translate3d(${event.pageX - shift.x}px, ${
    event.pageY - shift.y
  }px, 0px)`;
}

/**
 * This function updates the clone node position inside the DOM list
 * @param el Draggable DOM node
 * @param elIndex Draggable node index
 * @param appendAfter Should append clone node after the draggable node
 * @param param3 Drag data transfer
 */
function setCloneNodePosition(
  el: HTMLElement,
  elIndex: number,
  appendAfter: boolean,
  { cloneNode, dragNode, index }: DragDataTransfter
): void {
  if (elIndex === index) {
    cloneNode.style.display = 'none';
    el.after(cloneNode);
  } else {
    cloneNode.style.display = getComputedStyle(dragNode).display;
    if (appendAfter && elIndex + 1 !== index) {
      el.after(cloneNode);
    } else if (elIndex - 1 !== index) {
      el.before(cloneNode);
    }
  }
}
