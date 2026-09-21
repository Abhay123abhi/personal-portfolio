export function downloadBlogCard(article) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Image export is unavailable in this browser.');
  ctx.fillStyle = '#0d1214'; ctx.fillRect(0, 0, 1200, 630);
  const gradient = ctx.createRadialGradient(1000, 50, 0, 1000, 50, 680);
  gradient.addColorStop(0, '#203b36'); gradient.addColorStop(1, '#0d1214');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = '#8edec1'; ctx.font = '20px monospace';
  ctx.fillText(`ENGINEERING NOTES / ${article.topic.toUpperCase()}`, 65, 70);
  ctx.fillStyle = '#eff5f3'; ctx.font = 'bold 48px sans-serif';
  const words = article.title.split(' '); const lines = []; let line = '';
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (ctx.measureText(next).width > 1050 && line) { lines.push(line); line = word; } else { line = next; } }
  if (line) lines.push(line);
  lines.forEach((text, i) => ctx.fillText(text, 65, 170 + i * 62));
  ctx.font = '20px monospace';
  article.flow.forEach((label, i) => { const x = 65 + i * 350; ctx.strokeStyle = '#56766d'; ctx.strokeRect(x, 410, 300, 72); ctx.fillStyle = '#a8ebd2'; ctx.fillText(label, x + 20, 455); if (i < 2) ctx.fillText('→', x + 315, 455); });
  ctx.fillStyle = '#eff5f3'; ctx.font = 'bold 22px sans-serif'; ctx.fillText('ABHAY JAISWAL', 65, 560);
  ctx.fillStyle = '#a3b1b5'; ctx.font = '18px sans-serif'; ctx.fillText('System design · LLD · Backend engineering', 65, 593);
  canvas.toBlob(blob => { if (!blob) return; const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${article.slug}.png`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000); }, 'image/png');
}
