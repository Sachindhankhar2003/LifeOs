const fs = require('fs'); 
const files = [
  'src/app/(app)/client-layout.tsx', 
  'src/app/(app)/dashboard/page.tsx', 
  'src/app/(app)/goals/page.tsx', 
  'src/app/(app)/settings/page.tsx', 
  'src/app/(app)/chat/page.tsx', 
  'src/app/(app)/simulator/page.tsx', 
  'src/components/figma-ui.tsx'
]; 
files.forEach(f => { 
  let code = fs.readFileSync(f, 'utf-8'); 
  code = code.replace(/'Inter, sans-serif'/g, "'var(--font-cursive)'")
             .replace(/'DM Serif Display, serif'/g, "'var(--font-cursive)'")
             .replace(/'JetBrains Mono, monospace'/g, "'var(--font-cursive)'"); 
  fs.writeFileSync(f, code); 
});
console.log('done!');
