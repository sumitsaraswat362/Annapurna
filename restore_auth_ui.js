const fs = require('fs');

let ui = fs.readFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/app/login/page.original.tsx', 'utf8');

// 1. Change role to farmer/wholesaler
ui = ui.replace(
  'const [role, setRole] = useState<"director" | "wholesaler">("director");',
  'const [role, setRole] = useState<"farmer" | "wholesaler">("farmer");'
);

// 2. Add email state and mode state
ui = ui.replace(
  'const [name, setName] = useState("");',
  'const [name, setName] = useState("");\n  const [email, setEmail] = useState("");\n  const [mode, setMode] = useState<"login"|"register">("login");'
);

// 3. Update useAuth to include register and user
ui = ui.replace(
  'const { login } = useAuth();',
  'const { login, register, user } = useAuth();\n  const router = require("next/navigation").useRouter();\n\n  // Redirect if logged in\n  if (user) {\n    router.push(user.role === "wholesaler" ? "/wholesaler" : "/nerve-center");\n    return null;\n  }'
);

// 4. Update role toggle UI texts
ui = ui.replace(/>Fleet Director</g, '>Farmer<');
ui = ui.replace(/>Wholesale Buyer</g, '>Buyer / Wholesaler<');
ui = ui.replace(/setRole\("director"\)/g, 'setRole("farmer")');
ui = ui.replace(/role === "director"/g, 'role === "farmer"');

// 5. Update the form submission logic
ui = ui.replace(
  /const handleSubmit = async \(e: React\.FormEvent\) => {[\s\S]*?};/,
  `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and Access Code are required.");
      return;
    }
    setError("");
    
    // Auto-generate name if missing in login mode
    const finalName = name || email.split('@')[0];
    
    try {
      if (mode === 'login') {
         await login(email, password);
      } else {
         await register(email, password, finalName, role);
      }
      router.push(role === "wholesaler" ? "/wholesaler" : "/nerve-center");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check credentials.");
    }
  };`
);

// 6. Insert Email field into the form and add mode toggler
ui = ui.replace(
  '{/* User Identity */}',
  `{/* Login / Register Toggle */}
          <div className="flex bg-[var(--fill-secondary)] p-1 rounded-2xl mb-8 border border-[var(--separator)] shadow-inner">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={\`flex-1 py-3 text-[15px] font-bold rounded-xl transition-all \${
                mode === "login" 
                  ? "bg-white text-black shadow-md" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }\`}
            >
              System Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={\`flex-1 py-3 text-[15px] font-bold rounded-xl transition-all \${
                mode === "register" 
                  ? "bg-white text-black shadow-md" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }\`}
            >
              Create Account
            </button>
          </div>

          {/* User Identity */}
          <AnimatePresence>
            {mode === "register" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-bold text-[var(--text-secondary)] ml-2 tracking-wide">Full Name (Optional)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="off"
                    className="w-full bg-[var(--fill-secondary)] border border-[var(--separator)] rounded-[20px] px-6 py-4.5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:bg-[var(--bg-primary)] focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all shadow-sm text-[16px] font-bold"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

// 7. Remove original Name field to avoid duplication since we put it above
ui = ui.replace(
  /<div className="mb-5">\s*<label className="block mb-2 text-sm font-bold text-\[var\(--text-secondary\)\] ml-2 tracking-wide">Operator Identifier<\/label>[\s\S]*?<\/div>/,
  ''
);

// 8. Make sure password requirement is clear
ui = ui.replace(
  'placeholder="Enter authorization key"',
  'placeholder="Minimum 6 characters"'
);

// 9. Fix imports if any are missing
if (!ui.includes('import { useRouter }')) {
  ui = ui.replace('import { useAuth }', 'import { useRouter } from "next/navigation";\nimport { useAuth }');
}

fs.writeFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/app/login/page.tsx', ui);
console.log("UI Restored and Updated!");
