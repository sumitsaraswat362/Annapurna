const fs = require('fs');
let ui = fs.readFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/app/login/page.tsx', 'utf8');

// Revert role from farmer back to director
ui = ui.replace(
  'const [role, setRole] = useState<"farmer" | "wholesaler">("farmer");',
  'const [role, setRole] = useState<"director" | "wholesaler">("director");'
);
ui = ui.replace(/>Farmer</g, '>Fleet Director<');
ui = ui.replace(/setRole\("farmer"\)/g, 'setRole("director")');
ui = ui.replace(/role === "farmer"/g, 'role === "director"');
ui = ui.replace(/\/nerve-center/g, '/fleet');

fs.writeFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/app/login/page.tsx', ui);
console.log("Roles fixed!");
