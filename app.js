window.addEventListener("load", function() {
  var submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", submit);
  function submit() {
    var triangle = new Array(6);
    /* assign array to form values as ints */
    triangle[0] = +document.triangle.angleA.value;
    triangle[2] = +document.triangle.angleB.value;
    triangle[4] = +document.triangle.angleC.value;
    triangle[3] = +document.triangle.sideA.value;
    triangle[5] = +document.triangle.sideB.value;
    triangle[1] = +document.triangle.sideC.value;

    triangle = Solve(triangle);
    triangle = Round(triangle);
    Output(triangle);
  }
  
  function Output(triangle) {
    alert("The triangle is " + TriangleType(triangle) + " and " + AngleType(triangle) + ".");
    alert(triangle);
  }
  function Solve(triangle) {
    var tries; // Prevents infinite loops, find a better way
    for (var i = 0; i < 6; i += 2) {
      /* if 2 angles are solved but angle i is not */
      if (triangle[i] == 0 && triangle[(i + 2) % 6] > 0 && triangle[(i - 2) % 6] > 0) {
        triangle = LastAngle(triangle);
        i = 0;
        /* if all sides are known, but angle i isn't */
      } else if (triangle[1] > 0 && triangle[3] > 0 && triangle[5] > 0 && triangle[i] == 0) {
        triangle = MissingAngleLOC(triangle, i);
        i = 0;
      } else if (triangle[(i - 1) % 6] > 0 && triangle[(i - 2) % 6] > 0 &&
                 triangle[(i - 3) % 6] > 0 && triangle[(i+1) % 6] == 0) {
        triangle = MissingSideLOC(triangle, (i + 1));
        i = 0;
      } else if (((triangle[i + 1] > 0 && triangle[(i + 4) % 6] > 0) ||
                  (triangle[(i - 1) % 6] > 0 && triangle[(i - 4) % 6] > 0)) &&
                 triangle[i] == 0) {
        triangle = MissingAngleLOS(triangle, i);
        // bug seems to be here
        i = 0;
      } else if (((triangle[(i + 2) % 6] > 0 && triangle[(i + 5) % 6] > 0) ||
                  (triangle[i] > 0 && triangle[(i - 3) % 6] > 0)) &&
                 triangle[i + 1] == 0) {
        triangle = MissingSideLOS(triangle, (i + 1));
        i = 0;
      }
      tries++;
      if(tries > 3) {
        alert("The triangle is unsolvable.");
        return triangle;
      }
    }
    return triangle;
  }
  function TriangleType(triangle) {
    if ((triangle[0] == triangle [2]) || (triangle[0] == triangle[4]) || (triangle[2] == triangle[4])) {
      if ((triangle[0] == triangle [2]) && (triangle[0] == triangle[4]) && (triangle[2] == triangle[4]))
        return "equilateral";
      return "isosceles";
    }
    return "scalene";
  }
    
  function AngleType(triangle) {
    for (var i = 0; i < 3; i++) {
      if (triangle[2 * i] == 90) {
        return "right";
      }
      if (triangle[2 * i] > 90) {
        return "obtuse";
      }
    }
    /* If no right or obtuse angles were found, it must be an acute triangle */
    return "acute";
  }
  function LastAngle(triangle) {
    for (var i = 0; i < 6; i+=2) {
      if (triangle[i] == 0) {
        triangle[i] = 180 - (triangle[(i+2) % 6] + triangle[(i-2) % 6]);
        return triangle;
      }
    }
  }
  function SideToAngleRatio(triangle) {
    for (var i = 0; i < 6; i += 2) {
      if (triangle[i] > 0 && triangle[(i + 3) % 6] > 0) {
        return triangle[(i + 3) % 6] / sin(triangle[i]);
      }
    }
  }
  function AngleToSideRatio(triangle) {
    for (var i = 0; i < 6; i += 2) {
      if (triangle[i] > 0 && triangle[(i + 3) % 6] > 0) {
        return sin(triangle[i]) / triangle[(i + 3) % 6];
      }
    }
  }
  function MissingSideLOS(triangle, missing_side) {
    triangle[missing_side] =
    SideToAngleRatio(triangle) * sin(triangle[(missing_side + 3) % 6]);
    return triangle;
  }
  
  function MissingAngleLOS(triangle, missing_angle) {
    triangle[missing_angle] =
    asin(AngleToSideRatio(triangle) * triangle[(missing_angle + 3) % 6]);
    return triangle;
  }
  
  function MissingSideLOC(triangle, missing_side) {
    triangle[missing_side] = sqrt(
      pow(triangle[(missing_side + 2) % 6], 2) + /* a^2 */
      pow(triangle[(missing_side - 2) % 6], 2) - /* b^2 */
      (2 * triangle[(missing_side + 2) % 6] * triangle[(missing_side - 2) % 6] *
      cos(triangle[(missing_side + 3) % 6]))); /* 2ab*cosC */
    return triangle;
  }
  
  function MissingAngleLOC(triangle, missing_angle) {
    triangle[missing_angle] =
    acos(
         /* a^2 + b^2 - c^2 */
         (pow(triangle[(missing_angle + 1) % 6], 2) +
          pow(triangle[(missing_angle + 5) % 6], 2) -
          pow(triangle[(missing_angle + 3) % 6], 2)) /
         /* 2ab */
         (2 * triangle[(missing_angle + 1) % 6] * triangle[(missing_angle + 5) % 6]));
    return triangle;
  }
  function Round(triangle) {
    var digits = 3;
    for(var i = 0; i < triangle.length; i++) {
      triangle[i] = Math.round(triangle[i]*pow(10, digits))/pow(10, digits);
    }
    return triangle;
  }
  function sin(degrees) {
    return Math.sin(degrees * Math.PI / 180);
  }
  function cos(degrees) {
    return Math.cos(degrees * Math.PI / 180);
  }
  function asin(degrees) {
    return Math.asin(degrees * Math.PI / 180);
  }
  function acos(degrees) {
    return Math.acos(degrees * Math.PI / 180);
  }
  function pow(base, exponent) {
    return Math.pow(base, exponent);
  }
  function sqrt(number) {
    return Math.sqrt(number);
  }
});
