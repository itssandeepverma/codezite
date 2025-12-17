import React from 'react';
import { AlgorithmStep, VisualState } from '../engine/types';
import '../styles/app.css';

const width = 860;
const height = 440;

interface VisualizerProps {
  state: VisualState;
  step: AlgorithmStep | null;
  svgRef?: React.RefObject<SVGSVGElement>;
  scale?: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ state, step, svgRef, scale = 1 }) => {
  const renderBoard = () => {
    const board = state.board;
    if (!board) return null;
    const { size, queens, attempt, solved } = board;
    if (!size || size <= 0) return null;

    const boardSize = Math.min(width - 40, height - 60);
    const cellSize = boardSize / size;
    const offsetX = (width - boardSize) / 2;
    const offsetY = (height - boardSize) / 2;

    const isQueen = (r: number, c: number) => queens.some((q) => q.row === r && q.col === c);
    const queenByCell = (r: number, c: number) => queens.find((q) => q.row === r && q.col === c);

    return (
      <g transform={`translate(${offsetX},${offsetY})`}>
        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((__, c) => {
            const x = c * cellSize;
            const y = r * cellSize;
            const isDark = (r + c) % 2 === 1;
            const isAttempt = attempt && attempt.row === r && attempt.col === c && !isQueen(r, c);
            const queen = queenByCell(r, c);
            const fill = queen
              ? queen.conflict
                ? '#ff6b6b'
                : solved
                ? '#7cf8c4'
                : '#6bd1ff'
              : isAttempt
              ? 'rgba(255, 255, 255, 0.35)'
              : isDark
              ? 'rgba(11,22,43,0.2)'
              : 'rgba(255,255,255,0.4)';
            return (
              <g key={`${r}-${c}`}>
                <rect x={x} y={y} width={cellSize} height={cellSize} fill={fill} stroke="rgba(11,22,43,0.3)" rx={4} />
                {queen && (
                  <g>
                    {solved && (
                      <circle
                        cx={x + cellSize / 2}
                        cy={y + cellSize / 2}
                        r={cellSize * 0.4}
                        fill="rgba(124, 248, 196, 0.35)"
                      />
                    )}
                    <text
                      x={x + cellSize / 2}
                      y={y + cellSize / 2 + 5}
                      textAnchor="middle"
                      fontSize={cellSize * 0.45}
                      fontWeight={800}
                      fill={queen.conflict ? '#fff' : solved ? '#06311f' : '#0b162b'}
                    >
                      ♛
                    </text>
                  </g>
                )}
                {isAttempt && (
                  <circle cx={x + cellSize / 2} cy={y + cellSize / 2} r={cellSize * 0.12} fill="rgba(11,22,43,0.5)" />
                )}
              </g>
            );
          })
        )}
        <text
          x={boardSize / 2}
          y={-10}
          textAnchor="middle"
          fontSize={12}
          fill="#0b162b"
          opacity={0.7}
        >{`N = ${size}${solved ? ' · solution found' : ''}`}</text>
      </g>
    );
  };

  const renderArray = () => {
    const arr = state.array || [];
    if (!arr.length) return null;
    const mode = state.arrayMode || 'bars';

    if (mode === 'cells') {
      const cellWidth = Math.max(36, (width - 80) / Math.max(arr.length, 1));
      const cellHeight = 46;
      const startX = 20;
      const startY = height / 2 - cellHeight / 2;
      return (
        <g transform={`translate(${startX},${startY})`}>
          {arr.map((v, idx) => {
            const x = idx * (cellWidth + 8);
            const highlight = state.highlight?.indices?.includes(idx);
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={0}
                  width={cellWidth}
                  height={cellHeight}
                  rx={8}
                  fill={highlight ? '#1b74e4' : 'rgba(255,255,255,0.85)'}
                  stroke="#0b162b"
                  strokeWidth={highlight ? 2 : 1}
                />
                <text x={x + cellWidth / 2} y={cellHeight / 2 + 4} textAnchor="middle" fontWeight={700} fill="#0b162b">
                  {v}
                </text>
                <text x={x + cellWidth / 2} y={cellHeight + 14} textAnchor="middle" fontSize={11} fill="#6b7280">
                  {idx}
                </text>
              </g>
            );
          })}
        </g>
      );
    }

    const max = Math.max(...arr, 1);
    const barWidth = Math.max(10, (width - 40) / arr.length);
    return (
      <g transform="translate(20,20)">
        {arr.map((v, idx) => {
          const barHeight = (v / max) * (height - 80);
          const x = idx * barWidth;
          const y = height - 120 - barHeight;
          const highlight = state.highlight?.indices?.includes(idx);
          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={barWidth - 4}
                height={barHeight}
                rx={6}
                fill={highlight ? '#1b74e4' : '#7db2ff'}
                opacity={highlight ? 0.95 : 0.8}
                style={{ transition: 'all 0.25s ease' }}
              />
              <text x={x + (barWidth - 4) / 2} y={height - 90} textAnchor="middle" fontSize={12} fill="#0b162b">
                {v}
              </text>
              <text x={x + (barWidth - 4) / 2} y={height - 70} textAnchor="middle" fontSize={10} fill="#6b7280">
                {idx}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const renderList = () => {
    const list = state.list || [];
    if (!list.length) return null;
    const isMapView = list.every((n) => n.role === 'current');
    const y = height / 2;
    const spacing = 160;
    const nodeWidth = 96;
    const nodeHeight = 54;
    const nodesById = Object.fromEntries(list.map((n) => [n.id, n]));

    if (isMapView) {
      const startX = 20;
      const startY = 50;
      const rowH = 32;
      const colW = 120;
      return (
        <g transform={`translate(${startX},${startY})`}>
          <text x={0} y={-14} fontSize={12} fill="#0b162b" fontWeight={700}>
            Map (key : index)
          </text>
          <rect x={0} y={0} width={colW * 2} height={rowH} rx={6} fill="#eef2ff" stroke="#cbd5e1" />
          <text x={colW / 2} y={rowH / 2 + 4} textAnchor="middle" fontWeight={700} fill="#0b162b">
            Key
          </text>
          <text x={(3 * colW) / 2} y={rowH / 2 + 4} textAnchor="middle" fontWeight={700} fill="#0b162b">
            Index
          </text>
          {list.map((node, idx) => (
            <g key={node.id} transform={`translate(0, ${(idx + 1) * rowH})`}>
              <rect x={0} y={0} width={colW * 2} height={rowH} rx={6} fill="#fff" stroke="#cbd5e1" />
              <text x={colW / 2} y={rowH / 2 + 4} textAnchor="middle" fontWeight={700} fill="#0b162b">
                {node.value}
              </text>
              <text x={(3 * colW) / 2} y={rowH / 2 + 4} textAnchor="middle" fontWeight={600} fill="#1b74e4">
                {node.next}
              </text>
            </g>
          ))}
        </g>
      );
    }

    return (
      <g transform={`translate(40,0)`}>
        {list.map((node) => {
          const x = (node.pos ?? 0) * spacing;
          const isActive = node.role === 'current';
          return (
            <g key={node.id}>
              <rect
                x={x}
                y={y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={10}
                fill={isActive ? '#1b74e4' : '#fef3c7'}
                stroke="#0b162b"
              />
              <text x={x + nodeWidth / 2} y={y} textAnchor="middle" fontWeight={600} fill={isActive ? '#fff' : '#0b162b'}>
                {node.value}
              </text>
              {node.next && nodesById[node.next] && (
                (() => {
                  const target = nodesById[node.next];
                  const targetX = (target.pos ?? 0) * spacing;
                  const isLeft = (target.pos ?? 0) < (node.pos ?? 0);
                  const startX = isLeft ? x : x + nodeWidth;
                  const endX = isLeft ? targetX + nodeWidth : targetX;
                  if (isLeft) {
                    const yOffset = y - 12; // keep reversed pointer slightly above nodes
                    return (
                      <line
                        x1={startX}
                        y1={yOffset}
                        x2={endX}
                        y2={yOffset}
                        stroke="#0b162b"
                        strokeWidth={2}
                        markerEnd="url(#arrow)"
                      />
                    );
                  }
                  return (
                    <line
                      x1={startX}
                      y1={y}
                      x2={endX}
                      y2={y}
                      stroke="#0b162b"
                      strokeWidth={2}
                      markerEnd="url(#arrow)"
                    />
                  );
                })()
              )}
              <text x={x + nodeWidth / 2} y={y + 22} textAnchor="middle" fontSize={11} fill="#6b7280">
                {node.role || ''}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const renderStack = () => {
    const stack = state.stack || [];
    if (!stack.length) return null;
    const startY = height - 60;
    return (
      <g transform="translate(40,0)">
        {stack.map((v, idx) => {
          const y = startY - idx * 50;
          return (
            <g key={`${v}-${idx}`}>
              <rect x={0} y={y - 40} width={120} height={40} rx={8} fill="#c7f9cc" stroke="#0b162b" />
              <text x={60} y={y - 16} textAnchor="middle" fontWeight={600} fill="#0b162b">
                {v}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const renderQueue = () => {
    const queue = state.queue || [];
    if (!queue.length) return null;
    const y = height / 2;
    return (
      <g transform="translate(40,0)">
        {queue.map((v, idx) => {
          const x = idx * 120;
          return (
            <g key={`${v}-${idx}`}>
              <rect x={x} y={y - 30} width={100} height={60} rx={10} fill="#e0f2fe" stroke="#0b162b" />
              <text x={x + 50} y={y} textAnchor="middle" fontWeight={600} fill="#0b162b">
                {v}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const renderGraph = () => {
    const graph = state.graph;
    if (!graph) return null;
    const radius = 150;
    const centerX = width / 2;
    const centerY = height / 2;
    const nodes = graph.nodes.map((n, idx) => {
      const angle = (idx / graph.nodes.length) * Math.PI * 2;
      return { ...n, x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
    });
    const nodeLookup = Object.fromEntries(nodes.map((n) => [n.id, n]));
    return (
      <g>
        {graph.edges.map((e) => {
          const from = nodeLookup[e.from];
          const to = nodeLookup[e.to];
          if (!from || !to) return null;
          return (
            <line
              key={e.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={e.active ? '#1b74e4' : '#94a3b8'}
              strokeWidth={e.active ? 3 : 1.5}
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={20}
              fill={n.visited ? '#1b74e4' : '#fff'}
              stroke={n.active ? '#ff7a59' : '#0b162b'}
              strokeWidth={n.active ? 3 : 1.5}
            />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.visited ? '#fff' : '#0b162b'} fontWeight={600}>
              {n.label || n.id}
            </text>
          </g>
        ))}
      </g>
    );
  };

  const renderTree = () => {
    const tree = state.tree;
    if (!tree) return null;
    const levels = Math.max(...tree.nodes.map((n) => n.level), 0) + 1;
    return (
      <g>
        {tree.edges.map((e) => {
          const from = tree.nodes.find((n) => n.id === e.from);
          const to = tree.nodes.find((n) => n.id === e.to);
          if (!from || !to) return null;
          const yGap = (height - 100) / Math.max(levels, 1);
          const xScale = (width - 80) / (Math.pow(2, from.level + 1) + 1);
          const fromX = 40 + (from.x + 1) * xScale;
          const toX = 40 + (to.x + 1) * ((width - 80) / (Math.pow(2, to.level + 1) + 1));
          const fromY = 40 + from.level * yGap;
          const toY = 40 + to.level * yGap;
          return <line key={e.id} x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#94a3b8" strokeWidth={2} />;
        })}
        {tree.nodes.map((n) => {
          const yGap = (height - 100) / Math.max(levels, 1);
          const xScale = (width - 80) / (Math.pow(2, n.level + 1) + 1);
          const x = 40 + (n.x + 1) * xScale;
          const y = 40 + n.level * yGap;
          return (
            <g key={n.id}>
              <circle cx={x} cy={y} r={18} fill={n.visited ? '#1b74e4' : '#fff'} stroke={n.active ? '#ff7a59' : '#0b162b'} strokeWidth={n.active ? 3 : 1.5} />
              <text x={x} y={y + 4} textAnchor="middle" fontWeight={700} fill={n.visited ? '#fff' : '#0b162b'}>
                {n.label}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="visualizer-shell" role="img" aria-label="Algorithm visualizer canvas">
      <svg
        ref={svgRef}
        className="visualizer-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#0b162b" />
          </marker>
        </defs>
        {renderBoard()}
        {renderArray()}
        {renderList()}
        {renderStack()}
        {renderQueue()}
        {renderGraph()}
        {renderTree()}
      </svg>
      <div className="legend" aria-live="polite">
        <div style={{ fontWeight: 700 }}>{step?.description || 'Ready to visualize'}</div>
        <div style={{ fontSize: 12, color: '#4b5565' }}>
          {state.legend || 'Legend'} · {step?.type || 'idle'}
        </div>
        {state.counters && (
          <div style={{ fontSize: 11, marginTop: 4 }}>
            {Object.entries(state.counters)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' · ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualizer;
