import * as d3 from 'd3';
import type { ChartDataPoint, ChartState, MetricType, ProcessedPoint, TooltipData } from './types';
import { getColor, getOperationStyle, safeClassName, formatYAxis, Tooltip } from './utils';

// ---- WeakMap for dot data lookup (replaces __data__ any cast) ----

const tooltip = new Tooltip();

let CLIP_SEQ = 0;

// ---- Process raw ChartDataPoint[] into ProcessedPoint[] ----

function processData(data: ChartDataPoint[]): ProcessedPoint[] {
  const processed: ProcessedPoint[] = [];
  for (const d of data) {
    if (d.timestamp === 'Unknown date') continue;
    const ts = new Date(d.timestamp);
    if (isNaN(ts.getTime())) continue;

    const base = { group: d.group, timestamp: ts, value: d.value, commit_sha: d.commit_sha, branch: d.branch, config: d.config, test_url: d.test_url };
    const op = d.operation;
    processed.push(
      { ...base, operation: op, fullGroup: `${d.group} - ${op}` },
    );
  }
  return processed;
}

// ---- Create scales ----

interface Scales {
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  xScaleOrig: d3.ScaleTime<number, number>;
  yScaleOrig: d3.ScaleLinear<number, number>;
}

function createScales(filtered: ProcessedPoint[], width: number, height: number): Scales {
  const xScale = d3.scaleTime()
    .domain(d3.extent(filtered, d => d.timestamp) as [Date, Date])
    .range([0, width]);

  const yMax = d3.max(filtered, d => d.value) ?? 100;
  const yScale = d3.scaleLinear()
    .domain([0, yMax * 1.1])
    .range([height, 0])
    .nice();

  return { xScale, yScale, xScaleOrig: xScale.copy(), yScaleOrig: yScale.copy() };
}

// ---- Grid ----

function drawGrid(gridGroup: d3.Selection<SVGGElement, unknown, SVGGElement, unknown>, xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>, width: number, height: number): void {
  // X grid lines
  const xTicks = xScale.ticks(8);
  const xSel = gridGroup.selectAll<SVGLineElement, Date>('.grid-x-line').data(xTicks, d => +d);
  xSel.exit().remove();
  xSel.enter().append('line')
    .attr('class', 'grid-x-line')
    .attr('stroke', '#eeedf4')
    .attr('stroke-dasharray', '2,2')
    .merge(xSel)
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', height);

  // X axis line (bottom)
  let xLine = gridGroup.select<SVGLineElement>('.grid-x-axis');
  if (xLine.empty()) {
    xLine = gridGroup.append('line')
      .attr('class', 'grid-x-axis')
      .attr('stroke', '#eeedf4');
  }
  xLine.attr('x1', 0).attr('x2', width).attr('y1', height).attr('y2', height);

  // Y grid lines
  const yTicks = yScale.ticks(6);
  const ySel = gridGroup.selectAll<SVGLineElement, number>('.grid-y-line').data(yTicks, d => d);
  ySel.exit().remove();
  ySel.enter().append('line')
    .attr('class', 'grid-y-line')
    .attr('stroke', '#eeedf4')
    .attr('stroke-dasharray', '2,2')
    .merge(ySel)
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d));

  // Y axis line (left)
  let yLine = gridGroup.select<SVGLineElement>('.grid-y-axis');
  if (yLine.empty()) {
    yLine = gridGroup.append('line')
      .attr('class', 'grid-y-axis')
      .attr('stroke', '#eeedf4');
  }
  yLine.attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', height);
}

// ---- Axes ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawAxes(
  xAxisGroup: d3.Selection<SVGGElement, unknown, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yAxisGroup: d3.Selection<SVGGElement, unknown, any, any>,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  timeRangeDays: number,
  metricType: MetricType,
): void {
  // timeRangeDays === 0 means "All time" — multi-year span, skip HH:MM.
  const shortRange = timeRangeDays > 0 && timeRangeDays < 15;
  const tickFormat = shortRange
    ? d3.timeFormat('%H:%M %d.%m')
    : d3.timeFormat('%d.%m.%y');

  const xAxis = d3.axisBottom(xScale).ticks(shortRange ? 10 : 8).tickFormat(tickFormat as any);
  xAxisGroup
    .call(xAxis as any)
    .call(g => g.select('.domain').attr('stroke', '#ddd'))
    .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'))
    .call(g => g.selectAll('.tick text').attr('fill', '#59566d').attr('font-size', '11px'));

  const yAxis = d3.axisLeft(yScale).ticks(6).tickFormat((d: number | { valueOf(): number }) => formatYAxis(typeof d === 'number' ? d : d.valueOf(), metricType));
  yAxisGroup
    .call(yAxis as any)
    .call(g => g.select('.domain').attr('stroke', '#ddd'))
    .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'))
    .call(g => g.selectAll('.tick text').attr('fill', '#59566d').attr('font-size', '11px'));
}

// ---- Main chart factory ----

export interface CreateChartOptions {
  container: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>;
  title: string;
  operation?: ChartDataPoint['operation'];
  data: ChartDataPoint[];
  metricType: MetricType;
  timeRangeDays: number;
  visibleGroups: Set<string>;
  visibleOperations: Set<string>;
  colorMap: Map<string, number>;
  onGroupColors?: (groups: string[], colors: Map<string, string>) => void;
}

export function createChart(opts: CreateChartOptions): ChartState | null {
  const { container, title, data, metricType, timeRangeDays, visibleGroups, visibleOperations, colorMap } = opts;

  // Per-chart dot lookup map (scoped to this chart instance; released when
  // the chart DOM is replaced).
  const dotDataMap = new WeakMap<SVGPathElement, ProcessedPoint>();

  // Cleanup old zoom behavior before clearing DOM
  container.select('.chart-wrapper').on('.zoom', null);
  container.html('');
  tooltip.reset();

  const heading = container.append('div').attr('class', 'chart-heading');
  heading.append('h4').text(title);
  if (opts.operation) {
    heading.append('span').attr('class', 'chart-operation-badge')
      .text(opts.operation === 'read' ? '● Read' : '◆ Write');
  }
  // Note: ordered-before-clear teardown (RAF cancel, zoom unbind) for the
  // previous chart in this container is handled by the caller via state.destroy().

  if (!data.length) {
    container.append('p').attr('class', 'no-data').text('No data available');
    return null;
  }

  const filtered = processData(data);

  if (!filtered.length) {
    container.append('p').attr('class', 'no-data').text('No data matches the current filters');
    return null;
  }

  // ---- Dimensions ----
  const margin = { top: 16, right: 30, bottom: 50, left: 65 };
  const fullWidth = container.node()?.getBoundingClientRect().width || 800;
  let width = Math.max(1, fullWidth - margin.left - margin.right);
  const height = 380 - margin.top - margin.bottom;

  // ---- SVG ----
  const svgEl = container
    .append('div')
    .attr('class', 'chart-wrapper')
    .append('svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('role', 'img')
    .attr('aria-label', [title, opts.operation, 'chart'].filter(Boolean).join(' '));

  // Clip path for chart area
  const clipId = `clip-${CLIP_SEQ++}`;
  const clipRect = svgEl.append('defs').append('clipPath')
    .attr('id', clipId)
    .attr('clipPathUnits', 'userSpaceOnUse')
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height);

  const svg = svgEl.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // ---- Scales ----
  const { xScale, yScale, xScaleOrig, yScaleOrig } = createScales(filtered, width, height);

  // ---- Zoom ----
  let rafId = 0;
  const zoomBehavior = d3.zoom<HTMLDivElement, unknown>()
    .scaleExtent([1, 20])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', (event: d3.D3ZoomEvent<HTMLDivElement, unknown>) => {
      const t = event.transform;
      xScale.domain(t.rescaleX(xScaleOrig).domain());
      yScale.domain(t.rescaleY(yScaleOrig).domain());
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => redraw());
    });

  const wrapper = container.select<HTMLDivElement>('.chart-wrapper');
  wrapper.call(zoomBehavior);

  // Keyboard zoom support
  wrapper.attr('tabindex', '0')
    .attr('role', 'group')
    .attr('aria-label', `${title} chart area, use + to zoom in, - to zoom out, 0 to reset`)
    .on('keydown', (event: KeyboardEvent) => {
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        wrapper.transition().duration(300).call(zoomBehavior.scaleBy, 1.5);
      } else if (event.key === '-') {
        event.preventDefault();
        wrapper.transition().duration(300).call(zoomBehavior.scaleBy, 1 / 1.5);
      } else if (event.key === '0') {
        event.preventDefault();
        wrapper.transition().duration(500).call(zoomBehavior.transform, d3.zoomIdentity);
      }
    });

  // ---- Zoom controls ----
  const controls = container.append('div').attr('class', 'zoom-controls')
    .attr('role', 'group')
    .attr('aria-label', 'Zoom controls');
  controls.append('button').attr('class', 'zoom-btn').attr('aria-label', 'Zoom in').text('+').on('click', () => {
    wrapper.transition().duration(300).call(zoomBehavior.scaleBy, 1.5);
  });
  controls.append('button').attr('class', 'zoom-btn').attr('aria-label', 'Zoom out').text('\u2212').on('click', () => {
    wrapper.transition().duration(300).call(zoomBehavior.scaleBy, 1 / 1.5);
  });
  controls.append('button').attr('class', 'zoom-btn').attr('aria-label', 'Reset zoom').text('\u21BA').on('click', () => {
    wrapper.transition().duration(500).call(zoomBehavior.transform, d3.zoomIdentity);
  });

  // ---- Grid & Axes ----
  const gridGroup = svg.append('g').attr('class', 'grid') as unknown as d3.Selection<SVGGElement, unknown, SVGGElement, unknown>;
  const xAxisGroup = svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`);
  const yAxisGroup = svg.append('g').attr('class', 'y-axis');

  // ---- Y-axis label ----
  svg.append('text')
    .attr('class', 'chart-y-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -50)
    .attr('text-anchor', 'middle')
    .text(metricType === 'iops' ? 'IOPS' : 'Latency (ms)');

  // ---- Group data ----
  const dataByGroup = d3.group(filtered, d => d.fullGroup);
  const allFullGroups = Array.from(dataByGroup.keys()).sort();

  const groupColors = new Map<string, string>();
  const baseGroups = [...new Set(filtered.map(d => d.group))].sort();
  baseGroups.forEach((g, i) => groupColors.set(g, getColor(colorMap.get(g) ?? i)));
  opts.onGroupColors?.(baseGroups, groupColors);

  // Pre-sort points per group (used by lines, dots, and redraw)
  const sortedByGroup = new Map<string, ProcessedPoint[]>();
  for (const fullGroup of allFullGroups) {
    const pts = (dataByGroup.get(fullGroup) ?? []).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    sortedByGroup.set(fullGroup, pts);
  }

  // ---- Lines ----
  const line = d3.line<ProcessedPoint>()
    .x(d => xScale(d.timestamp))
    .y(d => yScale(d.value))
    .curve(d3.curveMonotoneX);

  const linesGroup = svg.append('g').attr('class', 'lines').attr('clip-path', `url(#${clipId})`) as unknown as d3.Selection<SVGGElement, unknown, SVGGElement, unknown>;
  const dotsGroup = svg.append('g').attr('class', 'dots').attr('clip-path', `url(#${clipId})`) as unknown as d3.Selection<SVGGElement, unknown, SVGGElement, unknown>;

  type LineSelection = d3.Selection<SVGPathElement, ProcessedPoint[], SVGGElement, undefined>;
  type DotSelection = d3.Selection<SVGPathElement, ProcessedPoint, SVGGElement, undefined>;

  const markerPosition = (d: ProcessedPoint) => `translate(${xScale(d.timestamp)},${yScale(d.value)})`;
  const markerShape = (op: ProcessedPoint['operation'], radius: number) => {
    if (op === 'write') {
      // Give the diamond a wider outline so it reads clearly beside the circle.
      const tip = radius * 1.4;
      return `M0,${-tip} L${tip},0 L0,${tip} L${-tip},0 Z`;
    }
    return `M${-radius},0 a${radius},${radius} 0 1,0 ${2 * radius},0 a${radius},${radius} 0 1,0 ${-2 * radius},0`;
  };

  const lineElements = new Map<string, LineSelection>();
  const dotElements = new Map<string, DotSelection>();

  for (const fullGroup of allFullGroups) {
    const pts = sortedByGroup.get(fullGroup)!;
    if (!pts.length) continue;

    const operation = pts[0].operation;
    const baseGroup = pts[0].group;
    const color = groupColors.get(baseGroup) ?? '#999';
    const style = getOperationStyle(operation);
    const isVisible = visibleGroups.has(baseGroup) && visibleOperations.has(operation);

    const path = linesGroup.append('path')
      .datum(pts)
      .attr('class', `line line-${safeClassName(fullGroup)}`)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', style.strokeWidth)
      .attr('stroke-dasharray', style.strokeDasharray)
      .attr('stroke-linecap', 'round')
      .style('opacity', isVisible ? '1' : '0')
      .style('transition', 'opacity 0.3s ease');

    lineElements.set(fullGroup, path);

    const dots = dotsGroup.selectAll('.dot-' + safeClassName(fullGroup))
      .data(pts)
      .enter()
      .append('path')
      .attr('class', `dot dot-${safeClassName(fullGroup)}`)
      .attr('data-operation', operation)
      .attr('transform', markerPosition)
      .attr('d', markerShape(operation, 5))
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('opacity', isVisible ? '1' : '0')
      .style('pointer-events', isVisible ? 'auto' : 'none')
      .style('transition', 'opacity 0.3s ease');

    dots.each(function(d) { dotDataMap.set(this, d); });
    dotElements.set(fullGroup, dots);

  }

  // ---- Event delegation on dots group ----
  let activeDot: SVGPathElement | null = null;

  dotsGroup
    .on('mouseover', function (event: MouseEvent) {
      const target = event.target as SVGPathElement;
      const pt = dotDataMap.get(target);
      if (!pt) return;
      if (lineElements.get(pt.fullGroup)?.style('opacity') !== '0') {
        if (activeDot && activeDot !== target) {
          d3.select(activeDot).attr('d', markerShape(dotDataMap.get(activeDot)!.operation, 5));
        }
        activeDot = target;
        d3.select(target).attr('d', markerShape(pt.operation, 7));
        tooltip.show(event, {
          group: pt.group, operation: pt.operation, value: pt.value,
          timestamp: pt.timestamp, branch: pt.branch, config: pt.config,
          commit_sha: pt.commit_sha,
        }, metricType, timeRangeDays);
      }
    })
    .on('mouseout', function (event: MouseEvent) {
      const target = event.target as SVGPathElement;
      const related = event.relatedTarget as HTMLElement | null;
      if (related && dotsGroup.node()?.contains(related)) return;
      if (activeDot) {
        d3.select(activeDot).attr('d', markerShape(dotDataMap.get(activeDot)!.operation, 5));
        activeDot = null;
      }
      tooltip.hide();
    })
    .on('click', function (event: MouseEvent) {
      const target = event.target as SVGPathElement;
      const pt = dotDataMap.get(target);
      if (!pt) return;
      const url = pt.test_url;
      if (/^\.\.?\//.test(url) || /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/blob\//.test(url)) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });

  // ---- Redraw (for zoom) — updates axes, lines, dots without recreating DOM elements ----
  function redraw() {
    drawAxes(xAxisGroup, yAxisGroup, xScale, yScale, timeRangeDays, metricType);
    drawGrid(gridGroup, xScale, yScale, width, height);

    const [x0, x1] = xScale.domain();

    for (const fullGroup of allFullGroups) {
      const pts = sortedByGroup.get(fullGroup)!;
      const path = lineElements.get(fullGroup);
      if (path) path.attr('d', line(pts));

      const dots = dotElements.get(fullGroup);
      if (dots) {
        dots.style('display', (d: ProcessedPoint) => d.timestamp < x0 || d.timestamp > x1 ? 'none' : null);
        dots.filter((d: ProcessedPoint) => d.timestamp >= x0 && d.timestamp <= x1)
          .attr('transform', markerPosition);
      }
    }
  }

  // Initial draw
  drawAxes(xAxisGroup, yAxisGroup, xScale, yScale, timeRangeDays, metricType);
  drawGrid(gridGroup, xScale, yScale, width, height);

  let resizeFrame = 0;
  function fitToWidth() {
    const wrapperWidth = wrapper.node()?.clientWidth;
    if (!wrapperWidth) return;
    const nextWidth = Math.max(1, wrapperWidth - margin.left - margin.right);
    if (nextWidth === width) return;

    const node = wrapper.node()!;
    const zoom = d3.zoomTransform(node);
    const horizontalRatio = nextWidth / width;
    width = nextWidth;
    xScale.range([0, width]);
    xScaleOrig.range([0, width]);
    svgEl.attr('viewBox', `0 0 ${wrapperWidth} ${height + margin.top + margin.bottom}`);
    clipRect.attr('width', width);
    zoomBehavior.extent([[0, 0], [width, height]]).translateExtent([[0, 0], [width, height]]);
    // Preserve the visible data domain when the horizontal pixel scale changes.
    wrapper.interrupt().call(zoomBehavior.transform,
      d3.zoomIdentity.translate(zoom.x * horizontalRatio, zoom.y).scale(zoom.k));
  }

  function onResize() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(fitToWidth);
  }
  fitToWidth();
  window.addEventListener('resize', onResize);

  // ---- State ----
  const state: ChartState = {
    data: filtered,
    fullGroups: allFullGroups,
    lines: lineElements,
    dots: dotElements,
    updateVisibility(visibleGroups: Set<string>) {
      for (const fullGroup of allFullGroups) {
        const isVisible = visibleGroups.has(fullGroup);
        const el = lineElements.get(fullGroup);
        if (el) {
          el.style('opacity', isVisible ? '1' : '0')
            .style('pointer-events', isVisible ? 'auto' : 'none');
        }
        const dots = dotElements.get(fullGroup);
        if (dots) {
          dots.style('opacity', isVisible ? '1' : '0')
            .style('pointer-events', isVisible ? 'auto' : 'none');
        }
      }
    },
    destroy() {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(resizeFrame);
      cancelAnimationFrame(rafId);
      wrapper.interrupt();
      wrapper.on('.zoom', null);
    },
  };

  return state;
}
