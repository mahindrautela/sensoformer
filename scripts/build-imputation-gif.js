ObjC.import("Cocoa");
ObjC.import("PDFKit");
ObjC.import("ImageIO");

const fm = $.NSFileManager.defaultManager;
const repo = ObjC.unwrap(fm.currentDirectoryPath);
const pdfPath = `${repo}/paper/foundation-models-for-particle-accelerators.pdf`;
const gifPath = `${repo}/static/images/missing-data-imputation.gif`;
const posterPath = `${repo}/static/images/missing-data-imputation-poster.png`;

const pdf = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(pdfPath));
if (!pdf) throw new Error(`Could not open ${pdfPath}`);

const slides = [
  { page: 20, figure: 4, facility: "LANSCE · 2019–2024", detail: "Los Alamos National Laboratory", mask: "POINT-WISE MASK", file: "missing-data-imputation-poster.png", plotTop: 280, plotBottom: 1245 },
  { page: 21, figure: 5, facility: "LANSCE · 2019–2024", detail: "Los Alamos National Laboratory", mask: "BLOCK-WISE MASK", file: "imputation-02-lansce-2019-2024-block-wise.png" },
  { page: 22, figure: 6, facility: "LANSCE · 2025", detail: "Los Alamos National Laboratory", mask: "POINT-WISE MASK", file: "imputation-03-lansce-2025-point-wise.png" },
  { page: 23, figure: 7, facility: "LANSCE · 2025", detail: "Los Alamos National Laboratory", mask: "BLOCK-WISE MASK", file: "imputation-04-lansce-2025-block-wise.png" },
  { page: 24, figure: 8, facility: "LHC · CERN", detail: "Beam-loss monitoring", mask: "POINT-WISE MASK", file: "imputation-05-lhc-cern-point-wise.png" },
  { page: 25, figure: 9, facility: "SNS · OAK RIDGE", detail: "High-voltage converter modulators", mask: "POINT-WISE MASK", file: "imputation-06-sns-point-wise.png" },
  { page: 26, figure: 10, facility: "SNS · OAK RIDGE", detail: "High-voltage converter modulators", mask: "BLOCK-WISE MASK", file: "imputation-07-sns-block-wise.png" },
  { page: 27, figure: 11, facility: "LCLS · SLAC", detail: "Radio-frequency stations", mask: "POINT-WISE MASK", file: "imputation-08-lcls-point-wise.png" },
  { page: 28, figure: 12, facility: "LCLS · SLAC", detail: "Radio-frequency stations", mask: "BLOCK-WISE MASK", file: "imputation-09-lcls-block-wise.png" }
];

const W = 960;
const H = 1340;
const paperSize = $.NSMakeSize(1224, 1584);
// A shared crop for Appendix Figures 4–12: plots only, excluding paper headers and captions.
const plotAreaX = 54;
const plotAreaY = 104;
const plotAreaWidth = 852;
const plotAreaHeight = 1119;

function color(hex, alpha) {
  const value = parseInt(hex.replace("#", ""), 16);
  return $.NSColor.colorWithCalibratedRedGreenBlueAlpha(
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
    alpha === undefined ? 1 : alpha
  );
}

const palette = {
  canvas: color("#f7f5ee"),
  white: color("#ffffff"),
  ink: color("#17353d"),
  muted: color("#64777b"),
  line: color("#cbd9d7"),
  teal: color("#007f79"),
  tealWash: color("#dcefeb"),
  coral: color("#cf6547"),
  blue: color("#3c91d0"),
  green: color("#35a84a"),
  red: color("#ed4b43")
};

function font(name, size) {
  return $.NSFont.fontWithNameSize(name, size) || $.NSFont.systemFontOfSize(size);
}

function attributes(typeface, fill, kern) {
  const attrs = $.NSMutableDictionary.dictionary;
  attrs.setObjectForKey(typeface, $.NSFontAttributeName);
  attrs.setObjectForKey(fill, $.NSForegroundColorAttributeName);
  if (kern !== undefined) attrs.setObjectForKey($(kern), $.NSKernAttributeName);
  return attrs;
}

function text(value, x, y, typeface, fill, kern) {
  $(value).drawAtPointWithAttributes($.NSMakePoint(x, y), attributes(typeface, fill, kern));
}

function textWidth(value, typeface, kern) {
  return $(value).sizeWithAttributes(attributes(typeface, palette.ink, kern)).width;
}

function roundedRect(rect, radius, fill, stroke, width) {
  const path = $.NSBezierPath.bezierPathWithRoundedRectXRadiusYRadius(rect, radius, radius);
  fill.setFill;
  path.fill;
  if (stroke) {
    stroke.setStroke;
    path.lineWidth = width || 1;
    path.stroke;
  }
}

function badge(label, right, y, fill, foreground) {
  const badgeFont = font("HelveticaNeue-Bold", 12);
  const width = Math.ceil(textWidth(label, badgeFont, 1.1)) + 24;
  roundedRect($.NSMakeRect(right - width, y, width, 28), 14, fill, null, 0);
  text(label, right - width + 12, y + 7, badgeFont, foreground, 1.1);
  return right - width - 8;
}

function strokeLine(x1, y1, x2, y2, stroke, width) {
  const path = $.NSBezierPath.bezierPath;
  path.moveToPoint($.NSMakePoint(x1, y1));
  path.lineToPoint($.NSMakePoint(x2, y2));
  path.lineWidth = width;
  stroke.setStroke;
  path.stroke;
}

function legendLine(x, y, label, kind, swatchColor) {
  if (kind === "line") {
    strokeLine(x, y + 6, x + 22, y + 6, swatchColor, 2.3);
  } else if (kind === "cross") {
    strokeLine(x + 5, y + 1, x + 15, y + 11, swatchColor, 2.1);
    strokeLine(x + 15, y + 1, x + 5, y + 11, swatchColor, 2.1);
  } else {
    const circle = $.NSBezierPath.bezierPathWithOvalInRect($.NSMakeRect(x + 5, y + 1, 11, 11));
    palette.white.setFill;
    circle.fill;
    swatchColor.setStroke;
    circle.lineWidth = 2;
    circle.stroke;
  }
  text(label, x + 30, y - 1, font("HelveticaNeue-Medium", 13), palette.muted);
}

function renderFrame(slide, index) {
  const image = $.NSImage.alloc.initWithSize($.NSMakeSize(W, H));
  image.lockFocus;
  $.NSGraphicsContext.currentContext.imageInterpolation = $.NSImageInterpolationHigh;

  palette.canvas.setFill;
  $.NSBezierPath.fillRect($.NSMakeRect(0, 0, W, H));

  text("ZERO-SHOT MISSING-DATA IMPUTATION", 54, 1301, font("HelveticaNeue-Bold", 12), palette.teal, 1.8);
  text(slide.facility, 54, 1256, font("HelveticaNeue-Medium", 29), palette.ink, 0.1);
  text(slide.detail, 54, 1233, font("HelveticaNeue", 13), palette.muted, 0.1);

  let right = 906;
  right = badge(`FIG. ${slide.figure}`, right, 1291, palette.tealWash, palette.teal);
  right = badge("15% MASKED", right, 1291, palette.tealWash, palette.teal);
  badge(slide.mask, right, 1291, palette.coral, palette.white);

  // The plot is rendered from the paper at 2× page resolution before being placed here.
  roundedRect($.NSMakeRect(48, 98, 864, 1131), 6, palette.white, palette.line, 1);
  const pageImage = pdf.pageAtIndex(slide.page).thumbnailOfSizeForBox(paperSize, $.kPDFDisplayBoxMediaBox);
  const top = slide.plotTop || 190;
  const bottom = slide.plotBottom || 1160;
  const sourceX = slide.plotX || 210;
  const sourceWidth = slide.plotWidth || 800;
  const sourceHeight = bottom - top;
  const sourceCrop = $.NSMakeRect(sourceX, 1584 - bottom, sourceWidth, sourceHeight);
  const scale = Math.min(plotAreaWidth / sourceWidth, plotAreaHeight / sourceHeight);
  const plotRect = $.NSMakeRect(
    plotAreaX + (plotAreaWidth - sourceWidth * scale) / 2,
    plotAreaY + (plotAreaHeight - sourceHeight * scale) / 2,
    sourceWidth * scale,
    sourceHeight * scale
  );
  pageImage.drawInRectFromRectOperationFraction(plotRect, sourceCrop, $.NSCompositingOperationCopy, 1);

  legendLine(56, 54, "Ground truth", "line", palette.blue);
  legendLine(232, 54, "Masked values", "cross", palette.red);
  legendLine(412, 54, "Model prediction", "circle", palette.green);

  const count = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  text(count, 839, 52, font("HelveticaNeue-Bold", 12), palette.teal, 1.2);
  strokeLine(56, 29, 904, 29, palette.line, 1);
  strokeLine(56, 29, 56 + (848 * (index + 1)) / slides.length, 29, palette.teal, 3);

  image.unlockFocus;
  return image;
}

function bitmap(image) {
  return $.NSBitmapImageRep.imageRepWithData(image.TIFFRepresentation);
}

const frames = slides.map(renderFrame);

const poster = bitmap(frames[0]);
const posterData = poster.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $({}));
if (!posterData.writeToFileAtomically(posterPath, true)) throw new Error(`Could not write ${posterPath}`);

slides.slice(1).forEach((slide, index) => {
  const frameData = bitmap(frames[index + 1]).representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $({}));
  const framePath = `${repo}/static/images/${slide.file}`;
  if (!frameData.writeToFileAtomically(framePath, true)) throw new Error(`Could not write ${framePath}`);
});

const destination = $.CGImageDestinationCreateWithURL(
  $.NSURL.fileURLWithPath(gifPath),
  $("com.compuserve.gif"),
  frames.length,
  null
);
if (!destination) throw new Error(`Could not create ${gifPath}`);

const loop = $.NSMutableDictionary.dictionary;
loop.setObjectForKey($(0), $.kCGImagePropertyGIFLoopCount);
const destinationProperties = $.NSMutableDictionary.dictionary;
destinationProperties.setObjectForKey(loop, $.kCGImagePropertyGIFDictionary);
$.CGImageDestinationSetProperties(destination, destinationProperties);

frames.forEach((frame) => {
  const timing = $.NSMutableDictionary.dictionary;
  timing.setObjectForKey($(2.65), $.kCGImagePropertyGIFDelayTime);
  timing.setObjectForKey($(2.65), $.kCGImagePropertyGIFUnclampedDelayTime);
  const properties = $.NSMutableDictionary.dictionary;
  properties.setObjectForKey(timing, $.kCGImagePropertyGIFDictionary);
  $.CGImageDestinationAddImage(destination, bitmap(frame).CGImage, properties);
});

if (!$.CGImageDestinationFinalize(destination)) throw new Error(`Could not finalize ${gifPath}`);
console.log(`Wrote ${slides.length} frames to ${gifPath}`);
