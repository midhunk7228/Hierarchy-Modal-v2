import { useState, useRef, useEffect, useCallback } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export interface PrintLayoutConfig {
  pageFormat:
    | "A3-landscape"
    | "A3-portrait"
    | "A4-landscape"
    | "A4-portrait"
    | "letter-landscape"
    | "letter-portrait";
  marginInches?: number;
  showPageBreaks?: boolean;
  autoPageBreaks?: boolean;
  matchPrintWidth?: boolean;
}

interface PageDimensions {
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
}

const PAGE_FORMATS: Record<string, { width: number; height: number }> = {
  "A3-landscape": { width: 420, height: 297 },
  "A3-portrait": { width: 297, height: 420 },
  "A4-landscape": { width: 297, height: 210 },
  "A4-portrait": { width: 210, height: 297 },
  "letter-landscape": { width: 279, height: 216 },
  "letter-portrait": { width: 216, height: 279 },
};

const MM_TO_PX = 3.78; // 1mm ≈ 3.78px at 96 DPI

export const usePrintLayout = (config: PrintLayoutConfig) => {
  const [showPageBreaks, setShowPageBreaks] = useState(
    config.showPageBreaks ?? false
  );
  const [autoPageBreaks, setAutoPageBreaks] = useState(
    config.autoPageBreaks ?? false
  );
  const [matchPrintWidth, setMatchPrintWidth] = useState(
    config.matchPrintWidth ?? false
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPageDimensions = useCallback((): PageDimensions => {
    const format = PAGE_FORMATS[config.pageFormat];
    return {
      widthMm: format.width,
      heightMm: format.height,
      widthPx: format.width * MM_TO_PX,
      heightPx: format.height * MM_TO_PX,
    };
  }, [config.pageFormat]);

  const getFirstLevelChildren = useCallback((container: HTMLElement) => {
    return Array.from(container.children).filter(
      (child) =>
        child instanceof HTMLElement &&
        child.offsetHeight > 0 &&
        !child.classList.contains("dynamic-page") &&
        !child.classList.contains("auto-layout-break") &&
        !child.classList.contains("print-simulation")
    );
  }, []);

  const calculateTotalHeight = useCallback((container: HTMLElement): number => {
    const scrollHeight = container.scrollHeight;

    let totalContentHeight = 0;
    const allElements = container.querySelectorAll("*");
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
        totalContentHeight = Math.max(
          totalContentHeight,
          rect.bottom - container.getBoundingClientRect().top + marginBottom
        );
      }
    });

    const lastElement = container.lastElementChild;
    let bottomPosition = 0;
    if (lastElement instanceof HTMLElement) {
      const lastRect = lastElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      bottomPosition =
        lastRect.bottom -
        containerRect.top +
        (parseFloat(window.getComputedStyle(lastElement).marginBottom) || 0);
    }

    return Math.max(scrollHeight, totalContentHeight, bottomPosition);
  }, []);

  const removeElements = useCallback((selector: string) => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll(selector);
    elements.forEach((el) => el.remove());
  }, []);

  const applyAutoLayout = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { heightPx: pageHeightPx } = getPageDimensions();

    console.log("Starting auto-layout analysis...");
    console.log(`Page height: ${pageHeightPx}px`);

    removeElements(".auto-layout-break");

    const firstLevelChildren = getFirstLevelChildren(container);
    console.log(
      `Found ${firstLevelChildren.length} first-level children to analyze`
    );

    let currentPageHeight = 0;
    let pageCount = 1;
    let breaksInserted = 0;

    firstLevelChildren.forEach((component, index) => {
      if (!(component instanceof HTMLElement)) return;

      const rect = component.getBoundingClientRect();
      const componentHeight = rect.height;

      console.log(
        `Component ${
          index + 1
        }: height=${componentHeight}px, currentPageHeight=${currentPageHeight}px`
      );

      if (
        currentPageHeight + componentHeight > pageHeightPx &&
        currentPageHeight > 0
      ) {
        console.log(`Component ${index + 1} would overflow, inserting break`);

        const autoBreak = document.createElement("div");
        autoBreak.className = "auto-layout-break";
        autoBreak.style.cssText = `
          page-break-before: always;
          break-before: page;
          height: 0;
          margin: 0;
          padding: 0;
          border: none;
          background: transparent;
          display: block;
        `;

        autoBreak.innerHTML = `<div style="
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          background: rgb(16, 185, 129);
          color: rgb(255, 255, 255);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          z-index: 10000;
          pointer-events: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        ">AUTO BREAK ${pageCount}</div>`;

        component.parentNode?.insertBefore(autoBreak, component);

        currentPageHeight = componentHeight;
        pageCount++;
        breaksInserted++;
      } else {
        console.log(`Component ${index + 1} fits on page ${pageCount}`);
        currentPageHeight += componentHeight;
      }
    });

    console.log(`Applied auto-layout with ${breaksInserted} breaks`);
  }, [getPageDimensions, getFirstLevelChildren, removeElements]);

  const createDynamicPagination = useCallback(() => {
    if (!containerRef.current || !showPageBreaks) return;
    // debugger;
    const container = containerRef.current;
    const { heightPx: pageHeightPx } = getPageDimensions();

    removeElements(".dynamic-page");

    const totalHeight = calculateTotalHeight(container);
    const totalPages = Math.ceil(totalHeight / pageHeightPx);

    console.log(`Total height: ${totalHeight}px, Pages needed: ${totalPages}`);

    for (let i = 0; i < totalPages; i++) {
      const pageTopPx = i * pageHeightPx;
      const pageOverlay = document.createElement("div");
      pageOverlay.className = "dynamic-page";
      pageOverlay.style.cssText = `
        position: absolute;
        top: ${pageTopPx}px;
        left: 0;
        right: 0;
        width: 100%;
        height: ${pageHeightPx}px;
        pointer-events: none;
        margin: 0;
        padding: 0;
      `;

      const pageNumber = document.createElement("div");
      pageNumber.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgb(59, 130, 246);
        color: rgb(255, 255, 255);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: bold;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      `;
      pageNumber.textContent = `Page ${i + 1}`;
      pageOverlay.appendChild(pageNumber);

      const pageBreakLine = document.createElement("div");
      pageBreakLine.style.cssText = `
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 4px;
        background: rgb(59, 130, 246);
        pointer-events: none;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      `;
      pageOverlay.appendChild(pageBreakLine);

      // Add dimension label at bottom left
      const dimensionLabel = document.createElement("div");
      dimensionLabel.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: rgb(59, 130, 246);
        color: rgb(255, 255, 255);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      `;
      dimensionLabel.textContent = `${Math.round(pageHeightPx)}px`;
      pageOverlay.appendChild(dimensionLabel);

      container.appendChild(pageOverlay);
    }

    if (autoPageBreaks) {
      insertSmartPageBreaks(totalPages, pageHeightPx);
    }
  }, [
    showPageBreaks,
    autoPageBreaks,
    getPageDimensions,
    calculateTotalHeight,
    removeElements,
  ]);

  const insertSmartPageBreaks = useCallback(
    (totalPages: number, pageHeightPx: number) => {
      if (!containerRef.current) return;

      removeElements(".auto-page-break");

      const sections = getFirstLevelChildren(containerRef.current);
      let currentPageHeight = 0;
      let pageCount = 1;

      sections.forEach((section) => {
        if (!(section instanceof HTMLElement)) return;

        const sectionHeight = section.getBoundingClientRect().height;

        if (
          currentPageHeight + sectionHeight > pageHeightPx &&
          currentPageHeight > 0
        ) {
          const pageBreak = document.createElement("div");
          pageBreak.className = "auto-page-break";
          pageBreak.style.cssText = `
            page-break-before: always;
            break-before: page;
            height: 0;
            margin: 0;
            padding: 0;
            border: none;
            background: transparent;
            display: block;
          `;

          pageBreak.innerHTML = `<div style="
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background: rgb(239, 68, 68);
            color: rgb(255, 255, 255);
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            z-index: 10000;
            pointer-events: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          ">PAGE BREAK ${pageCount}</div>`;

          section.parentNode?.insertBefore(pageBreak, section);

          currentPageHeight = sectionHeight;
          pageCount++;
        } else {
          currentPageHeight += sectionHeight;
        }
      });

      console.log(
        `Inserted ${pageCount - 1} smart page breaks across ${totalPages} pages`
      );
    },
    [getFirstLevelChildren, removeElements]
  );

  const simulatePrintLayout = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { widthPx: pageWidthPx, heightPx: pageHeightPx } =
      getPageDimensions();

    removeElements(".print-simulation");

    const totalHeight = calculateTotalHeight(container);
    const totalPages = Math.ceil(totalHeight / pageHeightPx);

    for (let i = 0; i < totalPages; i++) {
      const pageOverlay = document.createElement("div");
      pageOverlay.className = "print-simulation";
      pageOverlay.style.cssText = `
        position: absolute;
        top: ${i * pageHeightPx}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${pageWidthPx}px;
        height: ${pageHeightPx}px;
        border: 3px solid rgb(239, 68, 68);
        background: rgba(239, 68, 68, 0.1);
        pointer-events: none;
        z-index: 9998;
        box-sizing: border-box;
      `;

      const pageNumber = document.createElement("div");
      pageNumber.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgb(239, 68, 68);
        color: rgb(255, 255, 255);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: bold;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      `;
      pageNumber.textContent = `PRINT PAGE ${i + 1}`;
      pageOverlay.appendChild(pageNumber);

      container.appendChild(pageOverlay);
    }

    console.log("Print simulation overlays added");
  }, [getPageDimensions, calculateTotalHeight, removeElements]);

  const debugMeasurements = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const firstLevelChildren = getFirstLevelChildren(container);

    console.log("=== COMPONENT MEASUREMENTS DEBUG ===");
    console.log(`Container total height: ${container.scrollHeight}px`);
    console.log(`Container visible height: ${container.clientHeight}px`);

    firstLevelChildren.forEach((child, index) => {
      if (!(child instanceof HTMLElement)) return;
      const rect = child.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeTop = rect.top - containerRect.top;
      console.log(`Child ${index + 1}: ${child.className || child.tagName}`);
      console.log(`  - Height: ${rect.height}px`);
      console.log(`  - Top: ${relativeTop}px`);
      console.log(`  - Bottom: ${relativeTop + rect.height}px`);
    });

    const totalHeight = calculateTotalHeight(container);
    console.log(`Total content height: ${totalHeight}px`);
    console.log("=== END DEBUG ===");
  }, [getFirstLevelChildren, calculateTotalHeight]);

  const handlePrint = useCallback(async () => {
    if (!containerRef.current) return;

    // Store original showPageBreaks state
    const originalShowPageBreaks = showPageBreaks;

    // Declare outside try block for cleanup access
    let elementsToHide: Element[] = [];

    try {
      // Show loading indicator
      setIsGeneratingPdf(true);
      console.log("Generating PDF...");

      const container = containerRef.current;
      const { widthMm, heightMm } = getPageDimensions();
      const marginInches = config.marginInches ?? 0.5;
      const marginMm = marginInches * 25.4; // Convert inches to mm

      // Get orientation from config
      const orientation = config.pageFormat.includes("landscape")
        ? "landscape"
        : "portrait";

      // CRITICAL: Completely remove all dynamic overlays that use oklch colors
      // Remove them from DOM entirely, not just hide them
      removeElements(".dynamic-page");
      removeElements(".print-simulation");
      removeElements(".auto-page-break");
      removeElements(".auto-layout-break");

      // Hide control buttons and all overlay elements
      elementsToHide = [
        ...container.querySelectorAll("button"),
        ...container.querySelectorAll(".print-hide"),
        ...container.querySelectorAll(".dynamic-page"),
        ...container.querySelectorAll(".print-simulation"),
        ...container.querySelectorAll(".auto-page-break"),
        ...container.querySelectorAll(".auto-layout-break"),
        ...container.querySelectorAll(".react-grid-placeholder"),
        ...container.querySelectorAll(".react-resizable-handle"),
        ...container.querySelectorAll("nav"),
        ...container.querySelectorAll("aside"),
      ];

      // Enhanced duplicate detection for react-grid-layout
      // ONLY remove DOM duplicates (same data-grid key), NOT intentionally added widgets
      const allGridItems = container.querySelectorAll(".react-grid-item");
      const seenGridKeys = new Set<string>();

      allGridItems.forEach((gridItem) => {
        if (!(gridItem instanceof HTMLElement)) return;

        // Get the UNIQUE widget ID from react-grid-layout's key attribute
        // This is the actual widget ID like "widget-1", "widget-2", etc.
        const gridKey = gridItem.getAttribute("data-grid");

        if (!gridKey) return; // Skip if no key

        // If we've already seen this EXACT grid key, it's a DOM duplicate
        // (React Grid Layout sometimes creates duplicate DOM nodes)
        if (seenGridKeys.has(gridKey)) {
          console.log("Hiding DOM duplicate with key:", gridKey);
          elementsToHide.push(gridItem);
        } else {
          seenGridKeys.add(gridKey);
        }
      });

      // Remove empty or near-empty grid items (might be causing black lines)
      allGridItems.forEach((gridItem) => {
        if (!(gridItem instanceof HTMLElement)) return;

        const textContent = gridItem.textContent?.trim() || "";
        const hasImages =
          gridItem.querySelectorAll("img, svg, canvas").length > 0;

        // If grid item has very little content and no images, it might be a placeholder
        if (textContent.length < 5 && !hasImages) {
          console.log("Hiding empty/placeholder grid item");
          elementsToHide.push(gridItem);
        }
      });

      elementsToHide.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = "none";
          el.style.visibility = "hidden";
        }
      });

      // Wait for DOM cleanup and let browser repaint
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Use html-to-image which handles modern CSS better than html2canvas
      const dataUrl = await toPng(container, {
        quality: 1.0,
        pixelRatio: 2, // Higher quality
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipAutoScale: true,
        includeQueryParams: false,
        filter: (node) => {
          // Filter out all non-content elements
          if (node instanceof HTMLElement) {
            // Get computed styles
            const computed = window.getComputedStyle(node);

            // Skip if it's a control or overlay element
            if (
              node.classList.contains("print-hide") ||
              node.classList.contains("dynamic-page") ||
              node.classList.contains("print-simulation") ||
              node.classList.contains("auto-page-break") ||
              node.classList.contains("auto-layout-break") ||
              node.classList.contains("react-grid-placeholder") ||
              node.classList.contains("react-resizable-handle") ||
              node.classList.contains("react-draggable-dragging") ||
              node.tagName === "BUTTON" ||
              node.tagName === "NAV" ||
              node.tagName === "ASIDE" ||
              node.style.display === "none" ||
              node.style.visibility === "hidden" ||
              computed.display === "none" ||
              computed.visibility === "hidden" ||
              // Skip elements with very high z-index (likely overlays)
              ((computed.position === "fixed" ||
                computed.position === "absolute") &&
                parseInt(computed.zIndex) > 1000)
            ) {
              return false;
            }
          }
          return true;
        },
      });

      // Convert data URL to image for dimensions
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Calculate dimensions based on image
      const imgWidth = widthMm - marginMm * 2;
      const imgHeight = (img.height * imgWidth) / img.width;

      // Create PDF with proper orientation
      const pdf = new jsPDF({
        orientation: orientation as "landscape" | "portrait",
        unit: "mm",
        format: config.pageFormat.split("-")[0].toLowerCase() as "a3" | "a4",
      });

      const pageHeight = heightMm - marginMm * 2;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(dataUrl, "PNG", marginMm, marginMm, imgWidth, imgHeight);

      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          dataUrl,
          "PNG",
          marginMm,
          position + marginMm,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `dashboard-${config.pageFormat}-${timestamp}.pdf`;

      // Download the PDF
      pdf.save(filename);

      console.log("PDF generated successfully!");

      // Restore all hidden elements
      elementsToHide.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = "";
          el.style.visibility = "";
        }
      });

      // Recreate page breaks if they were visible before
      if (originalShowPageBreaks) {
        setTimeout(() => {
          createDynamicPagination();
        }, 100);
      }

      // Hide loading indicator
      setIsGeneratingPdf(false);
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Restore all hidden elements even if there was an error
      if (containerRef.current && elementsToHide.length > 0) {
        elementsToHide.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.display = "";
            el.style.visibility = "";
          }
        });
      }

      // Recreate page breaks if they were visible before
      if (originalShowPageBreaks) {
        setTimeout(() => {
          createDynamicPagination();
        }, 100);
      }

      // Hide loading indicator
      setIsGeneratingPdf(false);

      alert(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please try again.`
      );
    }
  }, [
    getPageDimensions,
    config.marginInches,
    config.pageFormat,
    removeElements,
    showPageBreaks,
    createDynamicPagination,
  ]);

  useEffect(() => {
    if (showPageBreaks) {
      setTimeout(createDynamicPagination, 100);
    }
  }, [showPageBreaks, autoPageBreaks, createDynamicPagination]);

  return {
    containerRef,
    showPageBreaks,
    setShowPageBreaks,
    autoPageBreaks,
    setAutoPageBreaks,
    matchPrintWidth,
    setMatchPrintWidth,
    applyAutoLayout,
    createDynamicPagination,
    simulatePrintLayout,
    debugMeasurements,
    handlePrint,
    getPageDimensions,
    isGeneratingPdf,
  };
};
