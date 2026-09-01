const fs = require('fs');

// 1. Update src/lib/auth.tsx
let authTsx = fs.readFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/lib/auth.tsx', 'utf8');
if (!authTsx.includes('GoogleAuthProvider')) {
  authTsx = authTsx.replace(
    "import {\n  onAuthStateChanged,",
    "import {\n  onAuthStateChanged,\n  GoogleAuthProvider,\n  signInWithPopup,"
  );
  authTsx = authTsx.replace(
    "logout: () => Promise<void>;\n}",
    "logout: () => Promise<void>;\n  loginWithGoogle: (role: 'director' | 'wholesaler') => Promise<void>;\n}"
  );
  authTsx = authTsx.replace(
    "logout: async () => {},",
    "logout: async () => {},\n  loginWithGoogle: async () => {},"
  );
  
  const googleLoginImpl = `
  const loginWithGoogle = async (role: 'director' | 'wholesaler') => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const existingRole = cred.user.displayName?.split('|')[1];
    if (!existingRole) {
      const name = cred.user.displayName || 'User';
      await updateProfile(cred.user, { displayName: \`\${name}|\${role}\` });
    }
  };
  `;
  
  authTsx = authTsx.replace(
    "const logout = async () => {",
    googleLoginImpl + "\n  const logout = async () => {"
  );
  
  authTsx = authTsx.replace(
    "login, register, logout",
    "login, register, logout, loginWithGoogle"
  );
  
  fs.writeFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/lib/auth.tsx', authTsx);
}

// 2. Update src/app/login/page.tsx
let pageTsx = fs.readFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/app/login/page.tsx', 'utf8');
if (!pageTsx.includes('loginWithGoogle')) {
  pageTsx = pageTsx.replace(
    "const { login, register, user } = useAuth();",
    "const { login, register, loginWithGoogle, user } = useAuth();"
  );
  
  const googleHandler = `
  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle(role);
      router.push(role === "wholesaler" ? "/wholesaler" : "/fleet");
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError("Please enable Google Sign-In in your Firebase Console first.");
      } else {
        setError(err.message || "Google Sign-In failed.");
      }
    }
  };
  `;
  
  pageTsx = pageTsx.replace(
    "const handleLogin = async",
    googleHandler + "\n  const handleLogin = async"
  );
  
  const googleButtonHTML = `
          {/* Google Sign In Button */}
          <div className="mt-6 flex items-center justify-center gap-4 relative z-10">
            <div className="flex-1 h-px bg-[var(--separator)]"></div>
            <span className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-[var(--separator)]"></div>
          </div>
          
          <button type="button" onClick={handleGoogleLogin} className="w-full mt-6 relative group outline-none flex items-center justify-center gap-3 py-4 rounded-[20px] bg-white text-black font-extrabold text-[16px] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:scale-[1.01] transition-all active:scale-[0.98] z-10 border border-white/20">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
  `;
  
  pageTsx = pageTsx.replace(
    "</form>",
    googleButtonHTML + "\n        </form>"
  );
  
  fs.writeFileSync('/Users/sumitsaraswat/Annapurna-Gemini-APAC/src/app/login/page.tsx', pageTsx);
}

console.log("Google Auth Button Added!");
