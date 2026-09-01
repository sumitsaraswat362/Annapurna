const fs = require('fs');
let ui = fs.readFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/app/login/page.original.tsx', 'utf8');

// 1. Update imports
if (!ui.includes('import { useRouter }')) {
  ui = ui.replace('import { useAuth }', 'import { useRouter } from "next/navigation";\nimport { useAuth }');
}

// 2. Add email state and user/register from useAuth
ui = ui.replace(
  'const { login } = useAuth();',
  'const { login, register, user } = useAuth();\n  const router = useRouter();\n\n  if (user) {\n    router.push(user.role === "wholesaler" ? "/wholesaler" : "/fleet");\n    return null;\n  }'
);

ui = ui.replace(
  'const [name, setName] = useState("");',
  'const [name, setName] = useState("");\n  const [email, setEmail] = useState("");'
);

// 3. Replace handleLogin
ui = ui.replace(
  /const handleLogin = async \(e: React\.FormEvent\) => {[\s\S]*?};/,
  `const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and authorization key are required.");
      return;
    }
    
    // Auto-generate name if missing
    const finalName = name.trim() || email.split('@')[0];
    
    try {
      try {
        await login(email, password);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          // If not found, auto-register
          await register(email, password, finalName, role);
        } else {
          throw err;
        }
      }
      router.push(role === "wholesaler" ? "/wholesaler" : "/fleet");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check credentials.");
    }
  };`
);

// 4. Update the Operator Identifier input to include Email
ui = ui.replace(
  /<div className="mb-5">\s*<label className="block mb-2 text-sm font-bold text-\[var\(--text-secondary\)\] ml-2 tracking-wide">Operator Identifier<\/label>[\s\S]*?<\/div>/,
  `<div className="mb-5">
      <label className="block mb-2 text-sm font-bold text-[var(--text-secondary)] ml-2 tracking-wide">Full Name (Optional)</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Operator Alias"
        autoComplete="off"
        className="w-full bg-[var(--fill-secondary)] border border-[var(--separator)] rounded-[20px] px-6 py-4.5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:bg-[var(--bg-primary)] focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all shadow-sm text-[16px] font-bold"
      />
    </div>
    <div className="mb-5">
      <label className="block mb-2 text-sm font-bold text-[var(--text-secondary)] ml-2 tracking-wide">Email Address</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="operator@annapurna.ai"
        required
        autoComplete="off"
        className="w-full bg-[var(--fill-secondary)] border border-[var(--separator)] rounded-[20px] px-6 py-4.5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:bg-[var(--bg-primary)] focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all shadow-sm text-[16px] font-bold"
      />
    </div>`
);

fs.writeFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/app/login/page.tsx', ui);
console.log("UI Restored Perfectly!");
