import { useState, useRef, useEffect, useCallback } from "react";

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
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          z-index: 1002;
          pointer-events: none;
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
        border: 2px dashed hsl(var(--primary));
        pointer-events: none;
        z-index: 1000;
        background: hsl(var(--primary) / 0.05);
        box-shadow: 0 0 0 1px hsl(var(--primary) / 0.2);
        margin: 0;
        padding: 0;
      `;

      const pageNumber = document.createElement("div");
      pageNumber.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        z-index: 1001;
        pointer-events: none;
      `;
      pageNumber.textContent = `Page ${i + 1}`;
      pageOverlay.appendChild(pageNumber);

      const pageBreakLine = document.createElement("div");
      pageBreakLine.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: hsl(var(--primary));
        z-index: 1001;
      `;
      pageOverlay.appendChild(pageBreakLine);

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
            background: hsl(var(--destructive));
            color: hsl(var(--destructive-foreground));
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            z-index: 1002;
            pointer-events: none;
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
        border: 3px solid hsl(var(--destructive));
        background: hsl(var(--destructive) / 0.1);
        pointer-events: none;
        z-index: 999;
        box-sizing: border-box;
      `;

      const pageNumber = document.createElement("div");
      pageNumber.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: hsl(var(--destructive));
        color: hsl(var(--destructive-foreground));
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        z-index: 1000;
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

  const handlePrint = useCallback(() => {
    applyAutoLayout();

    setTimeout(() => {
      const { widthMm, heightMm } = getPageDimensions();
      const marginInches = config.marginInches ?? 0.5;

      const printStyle = document.createElement("style");
      printStyle.id = "print-layout-styles";
      printStyle.textContent = `
        @page {
          size: ${widthMm}mm ${heightMm}mm !important;
          margin: ${marginInches}in !important;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          button, .print-hide, nav, aside {
            display: none !important;
          }
          
          .auto-layout-break {
            page-break-before: always !important;
            break-before: page !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            display: block !important;
          }
          
          .printable-container > * {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            orphans: 3 !important;
            widows: 3 !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }
          
          .h-full, .h-screen, .max-h-screen {
            height: auto !important;
            max-height: none !important;
          }
          
          .overflow-y-auto, .overflow-hidden {
            overflow: visible !important;
          }
          
          .printable-container {
            max-width: ${widthMm}mm !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            position: static !important;
          }
        }
      `;

      const existingStyle = document.getElementById("print-layout-styles");
      existingStyle?.remove();
      document.head.appendChild(printStyle);

      window.print();

      setTimeout(() => {
        document.getElementById("print-layout-styles")?.remove();
        removeElements(".auto-layout-break");
      }, 1000);
    }, 100);
  }, [applyAutoLayout, getPageDimensions, config.marginInches, removeElements]);

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
  };
};
