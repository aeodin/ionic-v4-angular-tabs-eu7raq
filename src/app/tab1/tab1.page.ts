import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {

  pathD: string;
  pathDArray: Array<{x:number, y: number}>;
  pathDString: string;

  radius: number;
  angle: number;
  centerX: number;
  centerY: number;
  vertixCountFactor: number;
  pathStyle;

  constructor() {
    this.vertixCountFactor = 0.6;
    this.radius = 100;
    this.angle = 0;
    this.centerX = 240;
    this.centerY = 240;
    this.pathStyle = {
      border:'none',
      fill:'transparent',
      stroke: 'grey',
      strokeWidth: 2, 
      strokeDasharray: "none"
    }
    this.resetPathData();
  }

  generateCoords() {
    for (let i = 0; i < 2*Math.PI; i+=this.vertixCountFactor) {
      let x = (this.radius*Math.cos(i) + this.centerX) + this.getRandomRadiusModifier();
      let y = (this.radius*Math.sin(i) + this.centerY) + this.getRandomRadiusModifier();
      this.pathDArray.push({x,y});
      if (i+this.vertixCountFactor >= 2*Math.PI) {
        this.pathDArray.push(this.pathDArray[0])
      };
    };
  }

  getRandomRadiusModifier() {
    let num = Math.floor(Math.random()*10) + 1;
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    return num
  }

  catmullRom2bezier() {
    
    let d = "";
    this.pathDArray.forEach((coord,index, array) => {
      let p = [];
      if (index === 0) {
        d += `M${coord.x},${coord.y} `;
        p.push(array[array.length - 3]);
        p.push(array[index]);
        p.push(array[index+1]);
        p.push(array[index+2]);
      } else if (index === array.length - 2) {
        p.push(array[index-1]);
        p.push(array[index]);
        p.push(array[index+1]);
        p.push(array[0]);
      } else if (index === array.length - 1) {
        return
      } else {
        p.push(array[index-1]);
        p.push(array[index]);
        p.push(array[index+1]);
        p.push(array[index+2]);
      }
      let bp = [];
      bp.push( { x: p[1].x,  y: p[1].y } );
      bp.push( { x: ((-p[0].x + 6*p[1].x + p[2].x) / 6), y: ((-p[0].y + 6*p[1].y + p[2].y) / 6)} );
      bp.push( { x: ((p[1].x + 6*p[2].x - p[3].x) / 6),  y: ((p[1].y + 6*p[2].y - p[3].y) / 6) } );
      bp.push( { x: p[2].x,  y: p[2].y } );
      d += "C" + bp[1].x + "," + bp[1].y + " " + bp[2].x + "," + bp[2].y + " " + bp[3].x + "," + bp[3].y + " ";
      
    })

    return d;
  }

  drawLinearShape() {
    this.pathD = "M";
    this.pathDArray.forEach(coord => {
      this.pathD += `${coord.x},${coord.y} `;
    })
  }

  drawCurvyShape() {
    this.pathD = this.catmullRom2bezier();
  }

  generateLinearShape() {
    this.resetPathData();
    this.generateCoords();
    this.drawLinearShape();
  };

  generateCurvyShape() {
    this.resetPathData();
    this.generateCoords();
    this.drawCurvyShape();
  };

  randomizeStyle() {
    this.pathStyle = {
      border:'none',
      fill: this.randomColor(),
      stroke: this.randomColor(),
      strokeWidth: this.randomWidth(), 
      strokeDasharray: `${this.randomWidth()} ${this.randomWidth()}`
    }
  };

  randomColor() {
    const randomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var h = randomInt(0, 360);
    var s = randomInt(42, 98);
    var l = randomInt(40, 90);
    return `hsl(${h},${s}%,${l}%)`;
  };

  randomWidth() {
    return Math.floor(Math.random() * Math.floor(50))
  }

  resetPathData() {
    this.pathD = "";
    this.pathDArray = [];
    this.pathDString = "";
  };

}
