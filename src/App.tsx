import React, { useEffect, useMemo, useState } from 'react';
import CodeViewer from './components/CodeViewer';
import './styles/app.css';
import { problems } from './data/problems';
import VisualExperience from './components/VisualExperience';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const sections = ['Problem', 'Solution', 'Code', 'Complexity', 'Visuals'] as const;

const App: React.FC = () => {
  const [selectedId, setSelectedId] = useState(problems[0].id);
  const [query, setQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [showHard, setShowHard] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string | 'All'>('All');
  const [openSection, setOpenSection] = useState<(typeof sections)[number] | null>(null);
  const [codeLang, setCodeLang] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const selected = useMemo(() => problems.find((p) => p.id === selectedId) || problems[0], [selectedId]);

  const topics = useMemo(() => {
    const set = new Set(problems.map((p) => p.topic));
    return ['All', ...Array.from(set)];
  }, []);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    topics.filter((t) => t !== 'All').forEach((t) => {
      next[t] = expandedTopics[t] ?? false;
    });
    setExpandedTopics(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (!showHard && p.difficulty === 'Hard') return false;
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
      if (topicFilter !== 'All' && p.topic !== topicFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${p.number} ${p.title} ${p.topic}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [difficultyFilter, query, showHard, topicFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof problems> = {};
    filtered.forEach((p) => {
      if (!map[p.topic]) map[p.topic] = [];
      map[p.topic].push(p);
    });
    return map;
  }, [filtered]);

  const renderAccordion = (section: (typeof sections)[number]) => {
    const isOpen = openSection === section;
    const toggle = () => setOpenSection(isOpen ? null : section);

    if (section === 'Problem') {
      return (
        <div className="accordion-card" key={section}>
          <button className="accordion-header" onClick={toggle}>
            <span>Problem</span>
            <span className="tag ghost">{isOpen ? 'Hide' : 'Show'}</span>
          </button>
          {isOpen && (
            <div className="accordion-body">
              <p className="muted">{selected.statement}</p>
              <div className="subhead">Constraints</div>
              <ul className="bullets">
                {selected.constraints.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <div className="subhead">Samples</div>
              {selected.samples.map((s, idx) => (
                <div key={idx} className="sample-card">
                  <div><strong>Input:</strong> {s.input}</div>
                  <div><strong>Output:</strong> {s.output}</div>
                  <div className="muted"><strong>Explanation:</strong> {s.explanation}</div>
                </div>
              ))}
              <a className="inline-link" href={selected.leetcodeUrl} target="_blank" rel="noreferrer">
                🔗 LeetCode
              </a>
            </div>
          )}
        </div>
      );
    }

    if (section === 'Solution') {
      return (
        <div className="accordion-card" key={section}>
          <button className="accordion-header" onClick={toggle}>
            <span>Solution Explanation</span>
            <span className="tag ghost">{isOpen ? 'Hide' : 'Show'}</span>
          </button>
          {isOpen && (
            <div className="accordion-body">
              <p>{selected.solution.summary}</p>
              <ol className="steps">
                {selected.solution.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      );
    }

    if (section === 'Code') {
      const code =
        codeLang === 'cpp'
          ? selected.code.cpp
          : codeLang === 'python'
          ? selected.code.python
          : codeLang === 'java'
          ? selected.code.java
          : selected.code.javascript;
      return (
        <div className="accordion-card" key={section}>
          <button className="accordion-header" onClick={toggle}>
            <span>Code</span>
            <span className="tag ghost">{isOpen ? 'Hide' : 'Show'}</span>
          </button>
          {isOpen && (
            <div className="accordion-body">
              <div className="tabs">
                {['javascript', 'python', 'java', 'cpp'].map((lang) => (
                  <button
                    key={lang}
                    className={`tab ${codeLang === lang ? 'active' : ''}`}
                    onClick={() => setCodeLang(lang as typeof codeLang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <CodeViewer code={code} language={codeLang === 'javascript' ? 'javascript' : codeLang === 'python' ? 'python' : codeLang === 'cpp' ? 'cpp' : 'javascript'} />
            </div>
          )}
        </div>
      );
    }

    if (section === 'Complexity') {
      return (
        <div className="accordion-card" key={section}>
          <button className="accordion-header" onClick={toggle}>
            <span>Complexity</span>
            <span className="tag ghost">{isOpen ? 'Hide' : 'Show'}</span>
          </button>
          {isOpen && (
            <div className="accordion-body">
              <div><strong>Time:</strong> {selected.complexity.time}</div>
              <div><strong>Space:</strong> {selected.complexity.space}</div>
              <p className="muted">{selected.complexity.rationale}</p>
            </div>
          )}
        </div>
      );
    }

    if (section === 'Visuals') {
      return (
        <div className="accordion-card" key={section}>
          <button className="accordion-header" onClick={toggle}>
            <span>Visuals</span>
            <span className="tag ghost">{isOpen ? 'Hide' : 'Show'}</span>
          </button>
          {isOpen && (
            <div className="accordion-body">
              {selected.visualsAvailable && selected.algorithmId ? (
                <VisualExperience algorithmId={selected.algorithmId} sampleInput={selected.sampleInput as any} />
              ) : (
                <div className="placeholder-card">
                  No visual yet. We’ll add a step-by-step animation soon.
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-shell" style={{ minHeight: '100vh' }}>
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo" aria-hidden>
            CZ
          </div>
          <div>
            <div>Codezite · DSA Visualizer Hub</div>
            <small style={{ color: '#6b7280' }}>Hands-on visuals to learn algorithms faster</small>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#4b5565' }}>Select a problem on the left to get started</div>
      </header>

      <div className="dsa-layout">
        <aside className="dsa-rail">
          <div className="rail-filters">
            <input
              className="text-inline"
              placeholder="Search number or title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="filter-row">
              <select className="selector" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value as typeof difficultyFilter)}>
                <option value="All">All difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select className="selector" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value as typeof topicFilter)}>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <label className="inline-checkbox">
              <input type="checkbox" checked={showHard} onChange={(e) => setShowHard(e.target.checked)} /> Show Hard
            </label>
          </div>
          <div className="rail-list">
            {topics
              .filter((t) => t !== 'All')
              .filter((t) => grouped[t] && grouped[t].length)
              .map((topic) => {
                const isOpen = expandedTopics[topic] ?? true;
                const color = topic === 'Arrays' ? 'blue' : topic === 'Linked List' ? 'purple' : topic === 'Stacks & Queues' ? 'orange' : topic === 'Trees' ? 'green' : topic === 'Graphs' ? 'teal' : topic === 'Dynamic Programming' ? 'amber' : 'gray';
                const icon = topic === 'Arrays' ? '🧱' : topic === 'Linked List' ? '🔗' : topic === 'Stacks & Queues' ? '🗂️' : topic === 'Trees' ? '🌳' : topic === 'Graphs' ? '🕸️' : topic === 'Dynamic Programming' ? '📐' : '📁';
                return (
                  <div key={topic} className="rail-group">
                    <button className={`rail-group-header ${color}`} onClick={() => setExpandedTopics((prev) => ({ ...prev, [topic]: !isOpen }))}>
                      <span className="rail-group-title">{icon} {topic}</span>
                      <span className="pill ghost">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="rail-group-body">
                        {grouped[topic].map((p, idx) => (
                          <button
                            key={p.id}
                            className={`rail-item ${p.id === selectedId ? 'active' : ''}`}
                            onClick={() => setSelectedId(p.id)}
                          >
                            <div className="rail-top">
                              <span className="pill">Q{idx + 1}</span>
                              <span className={`pill ${p.difficulty === 'Easy' ? 'green' : p.difficulty === 'Medium' ? 'amber' : 'red'}`}>
                                {p.difficulty}
                              </span>
                            </div>
                            <div className="rail-title">{p.title}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            {filtered.length === 0 && <div className="muted" style={{ padding: '6px 4px' }}>No problems match filters</div>}
          </div>
        </aside>

        <main className="dsa-main">
          <div className="card">
            <div className="label-row" style={{ marginBottom: 8 }}>
              <div>
                <div className="muted" style={{ fontSize: 12 }}>LeetCode #{selected.number} · {selected.topic}</div>
                <h2 style={{ margin: '4px 0 0' }}>{selected.title}</h2>
              </div>
              <span className={`pill ${selected.difficulty === 'Easy' ? 'green' : selected.difficulty === 'Medium' ? 'amber' : 'red'}`}>
                {selected.difficulty}
              </span>
            </div>
            {sections.map(renderAccordion)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
