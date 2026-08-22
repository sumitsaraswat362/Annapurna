const fs = require('fs');
const file = 'src/app/wholesaler/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Filter Chips
const filterChipsCode = `
              {/* Active Filter Chips & Clear Button */}
              {(filterType !== "all" || filterMaxPrice !== "" || filterMinQty !== "" || filterMaxSpoilage !== "") && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[var(--separator)]">
                  <span className="text-xs font-bold text-[var(--text-tertiary)] mr-2">ACTIVE FILTERS:</span>
                  {filterType !== "all" && (
                    <span className="px-3 py-1 bg-[#007AFF]/10 text-[#007AFF] rounded-full text-xs font-bold flex items-center">
                      Type: {filterType} <button onClick={() => setFilterType("all")} className="ml-2 hover:text-[#FF3B30]">✕</button>
                    </span>
                  )}
                  {filterMaxPrice !== "" && (
                    <span className="px-3 py-1 bg-[#007AFF]/10 text-[#007AFF] rounded-full text-xs font-bold flex items-center">
                      &lt; ₹{filterMaxPrice}/kg <button onClick={() => setFilterMaxPrice("")} className="ml-2 hover:text-[#FF3B30]">✕</button>
                    </span>
                  )}
                  {filterMinQty !== "" && (
                    <span className="px-3 py-1 bg-[#007AFF]/10 text-[#007AFF] rounded-full text-xs font-bold flex items-center">
                      &gt; {filterMinQty}kg <button onClick={() => setFilterMinQty("")} className="ml-2 hover:text-[#FF3B30]">✕</button>
                    </span>
                  )}
                  {filterMaxSpoilage !== "" && (
                    <span className="px-3 py-1 bg-[#007AFF]/10 text-[#007AFF] rounded-full text-xs font-bold flex items-center">
                      Spoils &lt; {filterMaxSpoilage}m <button onClick={() => setFilterMaxSpoilage("")} className="ml-2 hover:text-[#FF3B30]">✕</button>
                    </span>
                  )}
                  <button onClick={() => { setFilterType("all"); setFilterMaxPrice(""); setFilterMinQty(""); setFilterMaxSpoilage(""); }} className="text-xs font-bold text-[#FF3B30] hover:underline ml-auto">
                    Clear Filters
                  </button>
                </div>
              )}
`;

content = content.replace('</div>\n\n            {/* Emergency Offers */}', '</div>\n' + filterChipsCode + '\n            {/* Emergency Offers */}');

// 2. Add Empty Filter State
const emptyFilterStateCode = `
            {/* Empty Filter State */}
            {totalOffers > 0 && emergencyCargos.length === 0 && upcomingCargos.length === 0 && (
              <div className="glass liquid-glass p-12 text-center rounded-2xl shadow-sm border border-[var(--separator)] mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--fill-secondary)] flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No cargo matches these filters</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Try widening your search criteria or clearing filters.</p>
                <button onClick={() => { setFilterType("all"); setFilterMaxPrice(""); setFilterMinQty(""); setFilterMaxSpoilage(""); }} className="px-4 py-2 bg-[#007AFF] text-white text-sm font-bold rounded-lg shadow-sm">
                  Clear All Filters
                </button>
              </div>
            )}
`;

content = content.replace('{/* Emergency Offers */}', emptyFilterStateCode + '\n            {/* Emergency Offers */}');

fs.writeFileSync(file, content);
console.log("UI Patched successfully.");
