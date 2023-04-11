export function getContrastColor(primaryColor) {
    // Convert primaryColor to RGB format
    let hexColor = primaryColor.replace("#", "");
    let red = parseInt(hexColor.substring(0,2), 16);
    let green = parseInt(hexColor.substring(2,4), 16);
    let blue = parseInt(hexColor.substring(4,6), 16);
  
    // Calculate relative luminance using formula from WCAG 2.0
    let luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  
    // Return white if luminance is below threshold, black otherwise
    if (luminance <= 0.5) {
      return "#ffffff"; // white
    } else {
      return "#000000"; // black
    }
  }