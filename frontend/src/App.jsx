import React, { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/compare')
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err) => console.error("API Fetch Error:", err));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #334155', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <h3 style={{ marginTop: '1.5rem', fontWeight: '500' }}>Fetching Medicaid Public Data...</h3>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const { metrics, scoring } = data;
  const metricKeys = Object.keys(metrics.molina);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1e293b', paddingBottom: '4rem' }}>
      
      {/* 1. HERO HEADER */}
      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: '3rem 1.5rem 4rem 1.5rem', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.15)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Medicaid Managed Care Intelligence
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '1rem', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
            Molina Healthcare <span style={{ color: '#64748b', fontWeight: '400' }}>vs</span> Centene (WellCare)
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Side-by-side performance evaluation powered by public SEC filings, Medicaid.gov data, and NCQA quality metrics.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '-2.5rem auto 0 auto', padding: '0 1.5rem' }}>
        
        {/* 2. COMPOSITE SCORE SUMMARY CARD */}
        <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', padding: '2rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Composite Performance Score</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Weighted 0–100 scale normalized across quality, reach, and financial parameters.</p>
            </div>
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.5rem 1rem', color: '#1d4ed8', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏆 Winner: {scoring.winner}
            </div>
          </div>

          {/* Score Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            {/* Molina Card */}
            <div style={{ padding: '1.5rem', borderRadius: '12px', border: scoring.scores.molina >= scoring.scores.centene ? '2px solid #2563eb' : '1px solid #e2e8f0', backgroundColor: scoring.scores.molina >= scoring.scores.centene ? '#f0f9ff' : '#fafafa', position: 'relative' }}>
              {scoring.scores.molina >= scoring.scores.centene && (
                <span style={{ position: 'absolute', top: '-12px', right: '16px', backgroundColor: '#2563eb', color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '2px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>Highest Rated</span>
              )}
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#334155', fontWeight: '600' }}>Molina Healthcare</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.75rem 0' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: '#1e40af', lineHeight: '1' }}>{scoring.scores.molina}</span>
                <span style={{ color: '#64748b', fontWeight: '500' }}>/ 100</span>
              </div>
              {/* Progress Bar */}
              <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '10px', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${scoring.scores.molina}%`, backgroundColor: '#2563eb', height: '100%', borderRadius: '9999px', transition: 'width 1s ease-in-out' }}></div>
              </div>
            </div>

            {/* Centene Card */}
            <div style={{ padding: '1.5rem', borderRadius: '12px', border: scoring.scores.centene > scoring.scores.molina ? '2px solid #0d9488' : '1px solid #e2e8f0', backgroundColor: scoring.scores.centene > scoring.scores.molina ? '#f0fdf4' : '#fafafa', position: 'relative' }}>
              {scoring.scores.centene > scoring.scores.molina && (
                <span style={{ position: 'absolute', top: '-12px', right: '16px', backgroundColor: '#0d9488', color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '2px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>Highest Rated</span>
              )}
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#334155', fontWeight: '600' }}>Centene (WellCare)</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.75rem 0' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: '#0f766e', lineHeight: '1' }}>{scoring.scores.centene}</span>
                <span style={{ color: '#64748b', fontWeight: '500' }}>/ 100</span>
              </div>
              {/* Progress Bar */}
              <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '10px', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${scoring.scores.centene}%`, backgroundColor: '#0d9488', height: '100%', borderRadius: '9999px', transition: 'width 1s ease-in-out' }}></div>
              </div>
            </div>

          </div>

          {/* Rationale Bulletins */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '1.25rem', border: '1px solid #f1f5f9' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📊 Key Scoring Breakdown
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {scoring.rationale.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. SIDE-BY-SIDE METRICS TABLE */}
        <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>Side-by-Side Metric Comparison</h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Direct payor benchmarks with traced public citations.</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '30%' }}>Metric</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2563eb', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '35%' }}>Molina Healthcare</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#0d9488', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '35%' }}>Centene (WellCare)</th>
                </tr>
              </thead>
              <tbody>
                {metricKeys.map((key, idx) => {
                  const m = metrics.molina[key];
                  const c = metrics.centene[key];
                  
                  // Determine metric leader
                  const molinaWins = m.value > c.value;
                  const centeneWins = c.value > m.value;

                  return (
                    <tr key={key} style={{ borderBottom: idx === metricKeys.length - 1 ? 'none' : '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      
                      {/* Metric Name */}
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem', verticalAlign: 'top' }}>
                        {m.label}
                      </td>

                      {/* Molina Cell */}
                      <td style={{ padding: '1.25rem 1.5rem', verticalAlign: 'top', backgroundColor: molinaWins ? 'rgba(239, 246, 255, 0.4)' : 'transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>{m.value}</span>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{m.unit}</span>
                          {molinaWins && (
                            <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '0.7rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Leader</span>
                          )}
                        </div>
                        
                        {/* Citation block */}
                        <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
                          <div style={{ fontWeight: '600', color: '#334155', marginBottom: '2px' }}>{m.citation.source}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <a href={m.citation.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              Verify Source ↗
                            </a>
                            <span>Fetched: {m.citation.fetched_date}</span>
                          </div>
                        </div>
                      </td>

                      {/* Centene Cell */}
                      <td style={{ padding: '1.25rem 1.5rem', verticalAlign: 'top', backgroundColor: centeneWins ? 'rgba(240, 253, 244, 0.4)' : 'transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>{c.value}</span>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{c.unit}</span>
                          {centeneWins && (
                            <span style={{ backgroundColor: '#ccfbf1', color: '#0f766e', fontSize: '0.7rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Leader</span>
                          )}
                        </div>

                        {/* Citation block */}
                        <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
                          <div style={{ fontWeight: '600', color: '#334155', marginBottom: '2px' }}>{c.citation.source}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <a href={c.citation.url} target="_blank" rel="noreferrer" style={{ color: '#0d9488', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              Verify Source ↗
                            </a>
                            <span>Fetched: {c.citation.fetched_date}</span>
                          </div>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
