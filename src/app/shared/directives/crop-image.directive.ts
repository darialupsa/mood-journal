import {
  Directive,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
export type Rectangle = { x: number; y: number; w?: number; h?: number };
export type ActionType = 'none' | 'draw' | 'resize' | 'move';
export type ActionDirectionType =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'corner-top-left'
  | 'corner-top-right'
  | 'corner-bottom-left'
  | 'corner-bottom-right'
  | 'none';

export const ActionDirectionCursor = {
  left: 'w-resize', //"url('assets/icons/resize-LR.svg') 14 14, auto", //'w-resize',
  right: 'w-resize', // "url('assets/icons/resize-LR.svg') 14 14, auto", //'w-resize',
  top: 's-resize', //"url('assets/icons/resize-TB.svg') 14 13, auto", //'s-resize',
  bottom: 's-resize', //"url('assets/icons/resize-TB.svg') 14 13, auto", //'s-resize',
  'corner-top-left': 'move',
  'corner-top-right': 'move',
  'corner-bottom-left': 'sw-resize', // "url('assets/icons/resize-BL.svg') 14 14, auto", // 'sw-resize',
  'corner-bottom-right': 'se-resize', //"url('assets/icons/resize-BR.svg') 14 14, auto", // "url('assets/icons/r1.png') 12 12, auto", 'se-resize',
  none: 'default',
};

@Directive({
  selector: '[appCropImage]',
})
export class CropImageDirective implements OnInit {
  @Output() imageCropped = new EventEmitter<{
    base64: string;
    width: number;
    height: number;
  }>();

  @Output() imageDragged = new EventEmitter<boolean>();

  action: ActionType = 'none';

  rect: Rectangle;
  parent;
  canvas;
  context: CanvasRenderingContext2D;
  sourceCanvas;
  sourceContext;
  img;
  croppedImg;
  croppedCanvasBase64;

  dragOffset;
  actionDirection;
  lastMousePos;

  resizeObserver = new ResizeObserver(() => {
    setTimeout(() => {
      this.fitContainer();
    }, 0);
  });

  constructor(public el: ElementRef) {}

  ngOnInit(): void {
    this.img = this.el.nativeElement;
    this.parent = this.img.parentNode;

    //creez un canvas peste imagine in care desenez rect
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('canvas');
    this.context = this.canvas.getContext('2d');
    this.parent.appendChild(this.canvas);

    this.sourceCanvas = document.createElement('canvas');
    this.sourceContext = this.sourceCanvas.getContext('2d');

    this.fitContainer();
    this.resizeObserver.observe(this.parent);

    this.canvas.addEventListener(
      'mousedown',
      this.onCanvasMouseDown.bind(this)
    );
    this.canvas.addEventListener('mouseup', this.onCanvasMouseUp.bind(this));
    this.canvas.addEventListener(
      'mousemove',
      this.onCanvasMouseMove.bind(this)
    );
  }

  fitContainer() {
    this.clearAll();
    this.canvas.width = this.img.width;
    this.canvas.height = this.img.height;
    this.canvas.style.cssText = `position:absolute;top:${this.img.offsetTop}px;left:${this.img.offsetLeft}px;`;
    this.sourceCanvas.width = this.img.width;
    this.sourceCanvas.height = this.img.height;
    this.sourceContext.drawImage(
      this.img,
      0,
      0,
      this.img.width,
      this.img.height
    );
  }

  onCanvasMouseDown(e) {
    const currentMousePos = this.getMousePos(e);

    if (e.button == 2) {
      if (!e.target == this.croppedImg) {
        // hide default canvas context menu
        e.preventDefault();
        e.stopPropagation();
        this.clearAll();
      }
    } else {
      this.actionDirection = this.getActionDirection(e);
      if (this.actionDirection != 'none') {
        // start resizing or moving
        this.clearCroppedImage();
        this.action = this.actionDirection.startsWith('corner-top')
          ? 'move'
          : 'resize';
        this.canvas.style.cursor = ActionDirectionCursor[this.actionDirection];
        this.lastMousePos = { ...currentMousePos };
      } else {
        if (e.target == this.croppedImg) {
          // allow start dragging image
        } else {
          //  start drawing
          this.clearAll();
          this.action = 'draw';
          this.canvas.style.cursor = 'pointer';
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.imageCropped.emit(null);
          this.rect = { ...currentMousePos };
        }
      }
    }
  }

  onCanvasMouseMove(e) {
    const currentMousePos = this.getMousePos(e);
    if (this.action == 'draw') {
      this.rect.w = currentMousePos.x - this.rect.x;
      this.rect.h = currentMousePos.y - this.rect.y;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawRect();
      this.canvas.style.backgroundColor = this.isValidRectangle()
        ? '#5a5a5a45'
        : 'transparent';
    } else if (this.action == 'resize') {
      if (this.actionDirection == 'corner-bottom-right') {
        this.rect.h = this.rect.h + currentMousePos.y - this.lastMousePos.y;
        this.rect.w = this.rect.w + currentMousePos.x - this.lastMousePos.x;
      } else if (this.actionDirection == 'corner-bottom-left') {
        this.rect.h = this.rect.h + currentMousePos.y - this.lastMousePos.y;
        this.rect.x = this.rect.x + (currentMousePos.x - this.lastMousePos.x);
        this.rect.w = this.rect.w - (currentMousePos.x - this.lastMousePos.x);
      } else if (this.actionDirection == 'right') {
        this.rect.w = this.rect.w + currentMousePos.x - this.lastMousePos.x;
      } else if (this.actionDirection == 'bottom') {
        this.rect.h = this.rect.h + currentMousePos.y - this.lastMousePos.y;
      } else if (this.actionDirection == 'left') {
        this.rect.x = this.rect.x + (currentMousePos.x - this.lastMousePos.x);
        this.rect.w = this.rect.w - (currentMousePos.x - this.lastMousePos.x);
      } else if (this.actionDirection == 'top') {
        this.rect.y = this.rect.y + (currentMousePos.y - this.lastMousePos.y);
        this.rect.h = this.rect.h - (currentMousePos.y - this.lastMousePos.y);
      }
      this.lastMousePos = currentMousePos;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawRect();
    } else if (this.action == 'move') {
      this.rect.x = this.rect.x + (currentMousePos.x - this.lastMousePos.x);
      this.rect.y = this.rect.y + (currentMousePos.y - this.lastMousePos.y);
      this.lastMousePos = { ...currentMousePos };
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawRect();
    } else {
      //none => set cursor
      const actionDirection = this.getActionDirection(e);

      if (e.target == this.croppedImg) {
        if (actionDirection != 'none') {
          this.croppedImg.draggable = false;
          this.croppedImg.style.cursor =
            ActionDirectionCursor[this.getActionDirection(e)];
        } else {
          this.croppedImg.draggable = true;
          this.croppedImg.style.cursor =
            "url('assets/icons/cursor-drag.svg') 12 -2, auto";
        }
      } else {
        this.canvas.style.cursor =
          ActionDirectionCursor[this.getActionDirection(e)];
      }
    }
  }

  onCanvasMouseUp(e) {
    if (this.action != 'none') {
      this.action = 'none';
      this.canvas.style.cursor = 'default';

      if (this.isValidRectangle()) {
        this.croppImage();
        this.imageCropped.emit({
          base64: this.croppedCanvasBase64,
          width: this.rect.w,
          height: this.rect.h,
        });
      } else {
        this.clearAll();
      }
    }
  }

  drawRect() {
    //draw rectangle
    this.context.strokeStyle = 'white';

    this.context.lineWidth = this.isSmallRectangle() ? 2 : 2;
    this.context.setLineDash([this.isSmallRectangle() ? 3 : 6]);
    this.context.strokeRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);

    //draw resize markers
    const deltaIn = this.isSmallRectangle() ? 5 : 15;
    const deltaOut = this.isSmallRectangle() ? 1 : 1;
    this.context.fillStyle = 'red';

    this.context.fillRect(
      this.rect.x + this.rect.w - deltaIn,
      this.rect.y - deltaOut,
      deltaIn + deltaOut,
      deltaIn + deltaOut
    );

    this.context.fillRect(
      this.rect.x - deltaOut,
      this.rect.y - deltaOut,
      deltaIn + deltaOut,
      deltaIn + deltaOut
    );

    this.context.fillStyle = 'red';
    this.context.fillRect(
      this.rect.x - deltaOut,
      this.rect.y + this.rect.h - deltaIn,
      deltaIn + deltaOut,
      deltaIn + deltaOut
    );

    this.context.fillRect(
      this.rect.x + this.rect.w - deltaIn,
      this.rect.y + this.rect.h - deltaIn,
      deltaIn + deltaOut,
      deltaIn + deltaOut
    );

    //draw cropped image inside rectangle
    var borderWidth = this.context.lineWidth;
    if (this.isValidRectangle()) {
      const cropImageData = this.sourceContext.getImageData(
        this.rect.x + borderWidth,
        this.rect.y + borderWidth,
        this.rect.w - borderWidth * 2,
        this.rect.h - borderWidth * 2
      );
      this.context.putImageData(
        cropImageData,
        this.rect.x + borderWidth,
        this.rect.y + borderWidth
      );
    }
  }

  isSmallRectangle() {
    return this.rect.w < 100 || this.rect.h < 100;
  }
  isValidRectangle() {
    return this.rect.w && this.rect.h && this.rect.w > 15 && this.rect.h > 15;
  }

  getMousePos(evt) {
    var rect = this.canvas.getBoundingClientRect(),
      scaleX = this.canvas.width / rect.width,
      scaleY = this.canvas.height / rect.height;

    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  }

  croppImage() {
    this.clearCroppedImage();

    this.canvas.style.backgroundColor = '#5a5a5a45';

    //crop image data
    var borderWidth = this.context.lineWidth;
    const cropImageData = this.sourceContext.getImageData(
      this.rect.x + borderWidth,
      this.rect.y + borderWidth,
      this.rect.w - borderWidth * 2,
      this.rect.h - borderWidth * 2
    );

    // canvas cu imaginea crop din care se genereaza base64
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = this.rect.w - borderWidth * 2;
    croppedCanvas.height = this.rect.h - borderWidth * 2;
    const ctx = croppedCanvas.getContext('2d');
    ctx.putImageData(cropImageData, 0, 0);
    this.croppedCanvasBase64 = croppedCanvas.toDataURL('image/png', 1);

    // cropped img (pentru drag) - care se adauga in dom peste canvas-ul de desenat
    this.croppedImg = document.createElement('img');
    this.croppedImg.width = this.rect.w - borderWidth * 2;
    this.croppedImg.height = this.rect.h - borderWidth * 2;
    this.croppedImg.src = this.croppedCanvasBase64;
    this.croppedImg.draggable = true;
    this.croppedImg.style.cssText = `position:absolute;top:${
      this.rect.y + this.img.offsetTop + borderWidth
    }px;left:${this.rect.x + this.img.offsetLeft + borderWidth}px;`;
    this.croppedImg.addEventListener(
      'dragstart',
      this.onCroppedImagDragStart.bind(this)
    );
    this.croppedImg.addEventListener(
      'mousemove',
      this.onCanvasMouseMove.bind(this)
    );
    this.croppedImg.addEventListener(
      'mousedown',
      this.onCanvasMouseDown.bind(this)
    );
    this.parent.appendChild(this.croppedImg);
  }

  onCroppedImagDragStart(e) {
    this.imageDragged.emit(true);
  }

  getActionDirection(e, size = 2): ActionDirectionType {
    if (!(this.rect && this.rect.w && this.rect.h)) return 'none';

    const currentMousePos = this.getMousePos(e);
    const delta = this.isSmallRectangle() ? 5 : 10;

    if (
      currentMousePos.x >= this.rect.x + this.rect.w - delta &&
      currentMousePos.x <= this.rect.x + this.rect.w + 1 &&
      currentMousePos.y >= this.rect.y - 1 &&
      currentMousePos.y <= this.rect.y + delta
    )
      return 'corner-top-right';

    if (
      currentMousePos.x >= this.rect.x - 1 &&
      currentMousePos.x <= this.rect.x + delta &&
      currentMousePos.y >= this.rect.y - 1 &&
      currentMousePos.y <= this.rect.y + delta
    )
      return 'corner-top-left';

    if (
      currentMousePos.x >= this.rect.x - 1 &&
      currentMousePos.x <= this.rect.x + delta &&
      currentMousePos.y >= this.rect.y + this.rect.h - delta &&
      currentMousePos.y <= this.rect.y + this.rect.h + 1
    )
      return 'corner-bottom-left';

    if (
      currentMousePos.x >= this.rect.x + this.rect.w - delta &&
      currentMousePos.x <= this.rect.x + this.rect.w + 1 &&
      currentMousePos.y >= this.rect.y + this.rect.h - delta &&
      currentMousePos.y <= this.rect.y + this.rect.h + 1
    )
      return 'corner-bottom-right';

    if (
      Math.abs(currentMousePos.x - this.rect.x - this.rect.w) < size &&
      currentMousePos.y > this.rect.y &&
      currentMousePos.y < this.rect.y + this.rect.h
    )
      return 'right';

    if (
      Math.abs(currentMousePos.x - this.rect.x) < size &&
      currentMousePos.y > this.rect.y &&
      currentMousePos.y < this.rect.y + this.rect.h
    )
      return 'left';

    if (
      Math.abs(currentMousePos.y - this.rect.y - this.rect.h) < size &&
      currentMousePos.x > this.rect.x &&
      currentMousePos.x < this.rect.x + this.rect.w
    )
      return 'bottom';

    if (
      Math.abs(currentMousePos.y - this.rect.y) < size &&
      currentMousePos.x > this.rect.x &&
      currentMousePos.x < this.rect.x + this.rect.w
    )
      return 'top';

    return 'none';
  }

  clearAll() {
    this.clearRect();
    this.clearCroppedImage();
  }
  clearRect() {
    this.rect = null;
    this.canvas.style.backgroundColor = 'transparent';
    this.canvas.style.cursor = 'default';
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.imageCropped.emit(null);
  }
  clearCroppedImage() {
    if (this.croppedImg) {
      this.parent.removeChild(this.croppedImg);
      this.croppedImg = null;
    }
  }
}
