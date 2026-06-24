import React, { useState, useEffect } from "react";

// ==========================================
// 🚀 TRUCO PWA: INYECCIÓN DINÁMICA DE MANIFEST
// ==========================================
if (typeof window !== "undefined") {
  const existingLink = document.querySelector("link[rel='manifest']");
  if (!existingLink) {
    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = "/manifest.json";
    document.head.appendChild(manifestLink);
  }
}

// ==========================================
// ⚽ DATOS SEMILLA PARA EL SIMULADOR DEL MUNDIAL
// ==========================================
const INITIAL_MATCHES = [
  {
    id: 1,
    homeTeam: "España",
    awayTeam: "Alemania",
    kickoff: "Hoy - 21:00",
    status: "scheduled",
    category: "Fase de Grupos",
    markets: [
      { id: "m1-1", label: "Gana España", odds: 1.95, selection: "España" },
      { id: "m1-x", label: "Empate", odds: 3.40, selection: "Empate" },
      { id: "m1-2", label: "Gana Alemania", odds: 3.80, selection: "Alemania" },
      { id: "m1-c1", label: "Más de 8.5 Córneres", odds: 1.85, selection: "Córneres" },
      { id: "m1-t1", label: "Más de 3.5 Tarjetas", odds: 1.70, selection: "Tarjetas" }
    ]
  },
  {
    id: 2,
    homeTeam: "Argentina",
    awayTeam: "Francia",
    kickoff: "Mañana - 18:00",
    status: "scheduled",
    category: "Fase de Grupos",
    markets: [
      { id: "m2-1", label: "Gana Argentina", odds: 2.30, selection: "Argentina" },
      { id: "m2-x", label: "Empate", odds: 3.10, selection: "Empate" },
      { id: "m2-2", label: "Gana Francia", odds: 2.90, selection: "Francia" },
      { id: "m2-c2", label: "Más de 9.5 Córneres", odds: 2.10, selection: "Córneres" },
      { id: "m2-t2", label: "Más de 4.5 Tarjetas", odds: 1.95, selection: "Tarjetas" }
    ]
  }
];

const MOCK_LEAGUE_MEMBERS = [
  { rank: 1, name: "Tú (Gabriel)", bankroll: 14500, avatar: "🦁" },
  { rank: 2, name: "Carlos", bankroll: 12200, avatar: "🐼" },
  { rank: 3, name: "Lucas", bankroll: 9800, avatar: "🦊" },
  { rank: 4, name: "Sofía", bankroll: 8500, avatar: "🐱" },
  { rank: 5, name: "Dani", bankroll: 5000, avatar: "🐸" }
];

// Componente Principal Autocontenido para la Previsualización
export default function App() {
  const [activeTab, setActiveTab] = useState<"matches" | "leaderboard" | "my-bets">("matches");
  const [bankroll, setBankroll] = useState(10000);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [selectedMarket, setSelectedMarket] = useState<{
    matchId: number;
    matchName: string;
    marketId: string;
    label: string;
    odds: number;
  } | null>(null);
  const [betAmount, setBetAmount] = useState<string>("1000");
  const [myBets, setMyBets] = useState<any[]>([]);
  const [activeLeague, setActiveLeague] = useState("Amigos del Barrio 🏆");
  const [copied, setCopied] = useState(false);

  const handlePlaceBet = () => {
    if (!selectedMarket) return;
    const amount = parseInt(betAmount, 10);
    
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, introduce una cantidad válida.");
      return;
    }
    
    if (amount > bankroll) {
      alert("¡No tienes suficientes Euros Virtuales para esta apuesta!");
      return;
    }

    setBankroll(prev => prev - amount);
    
    const newBet = {
      id: Date.now(),
      match: selectedMarket.matchName,
      market: selectedMarket.label,
      odds: selectedMarket.odds,
      stake: amount,
      potentialReturn: Math.round(amount * selectedMarket.odds),
      status: "Pendiente"
    };

    setMyBets([newBet, ...myBets]);
    setSelectedMarket(null);
    setBetAmount("1000");
    alert("¡Apuesta virtual confirmada! Buena suerte.");
  };

  const handleShare = () => {
    const inviteUrl = `${window.location.origin}/join/PIQUE620`;
    const shareText = `¡Únete a mi liga "${activeLeague}" en Pique! Compitamos con dinero ficticio durante el Mundial. Código: PIQUE620 👉 ${inviteUrl}`;
    
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white font-sans flex flex-col max-w-md mx-auto shadow-2xl relative">
      
      {/* HEADER DE LA APP */}
      <header className="sticky top-0 z-30 bg-[#111827]/90 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              PIQUE
            </h1>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{activeLeague}</p>
          </div>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold text-sm">
            {bankroll.toLocaleString("de-DE")} €
          </span>
          <span className="text-[9px] text-emerald-300 font-extrabold bg-emerald-500/20 px-1 py-0.5 rounded uppercase">FICTICIO</span>
        </div>
      </header>

      {/* BANNER DE INVITACIÓN RÁPIDA (ONBOARDING VIRAL) */}
      <div className="mx-4 mt-4 p-3 bg-gradient-to-br from-cyan-950 to-blue-950 rounded-xl border border-cyan-500/20 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-cyan-300">¡Pica a tus colegas del barrio!</h4>
          <p className="text-[10px] text-gray-300">Copia el enlace de invitación de tu liga para WhatsApp.</p>
        </div>
        <button 
          onClick={handleShare}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs px-3 py-1.5 rounded-lg transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0"
        >
          {copied ? "¡Copiado! 🚀" : "Invitar Amigos"}
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <main className="flex-1 px-4 py-4 overflow-y-auto pb-24">
        
        {activeTab === "matches" && (
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Partidos Disponibles</h2>
            
            {matches.map(match => (
              <div key={match.id} className="bg-[#111827] border border-gray-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full text-gray-400 font-semibold">{match.category}</span>
                  <span className="text-xs text-cyan-400 font-bold">{match.kickoff}</span>
                </div>

                <div className="flex items-center justify-between text-center py-2">
                  <div className="flex-1">
                    <span className="text-3xl block mb-1">🇪🇸</span>
                    <span className="font-bold text-sm block">{match.homeTeam}</span>
                  </div>
                  <span className="text-gray-600 font-extrabold text-sm px-2">VS</span>
                  <div className="flex-1">
                    <span className="text-3xl block mb-1">🇩🇪</span>
                    <span className="font-bold text-sm block">{match.awayTeam}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                  {match.markets.slice(0, 3).map(market => (
                    <button
                      key={market.id}
                      onClick={() => setSelectedMarket({
                        matchId: match.id,
                        matchName: `${match.homeTeam} vs ${match.awayTeam}`,
                        marketId: market.id,
                        label: market.label,
                        odds: market.odds
                      })}
                      className="bg-gray-800/50 hover:bg-cyan-500/20 border border-gray-700/60 hover:border-cyan-500/40 p-2 rounded-xl text-center transition-all group"
                    >
                      <span className="text-[10px] text-gray-400 block group-hover:text-cyan-200 transition-colors">{market.label}</span>
                      <span className="text-sm font-extrabold text-cyan-400 group-hover:text-cyan-300">{market.odds}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {match.markets.slice(3).map(market => (
                    <button
                      key={market.id}
                      onClick={() => setSelectedMarket({
                        matchId: match.id,
                        matchName: `${match.homeTeam} vs ${match.awayTeam}`,
                        marketId: market.id,
                        label: market.label,
                        odds: market.odds
                      })}
                      className="bg-gray-800/30 hover:bg-emerald-500/20 border border-gray-700/40 hover:border-emerald-500/40 px-3 py-1.5 rounded-xl flex justify-between items-center transition-all group"
                    >
                      <span className="text-[10px] text-gray-400 group-hover:text-emerald-200 transition-colors">{market.label}</span>
                      <span className="text-xs font-extrabold text-emerald-400 group-hover:text-emerald-300">{market.odds}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLASIFICACIÓN / LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Clasificación de la Liga</h2>
              <span className="text-[10px] text-cyan-400 font-bold">5 Participantes</span>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
              {MOCK_LEAGUE_MEMBERS.map(member => (
                <div key={member.name} className={`flex items-center justify-between p-4 ${member.name.includes("Tú") ? "bg-cyan-950/20" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      member.rank === 1 ? "bg-yellow-500 text-black" : 
                      member.rank === 2 ? "bg-gray-400 text-black" : 
                      member.rank === 3 ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400"
                    }`}>
                      {member.rank}
                    </span>
                    <span className="text-xl">{member.avatar}</span>
                    <span className={`text-sm font-semibold ${member.name.includes("Tú") ? "text-cyan-400 font-bold" : "text-white"}`}>
                      {member.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">
                    {member.bankroll.toLocaleString("de-DE")} €
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORIAL DE APUESTAS REALIZADAS */}
        {activeTab === "my-bets" && (
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Mis Apuestas Virtuales</h2>
            
            {myBets.length === 0 ? (
              <div className="text-center py-12 bg-[#111827] border border-gray-800 rounded-2xl">
                <span className="text-3xl block mb-2">🎟️</span>
                <p className="text-sm text-gray-400">Aún no has hecho ninguna apuesta.</p>
                <button 
                  onClick={() => setActiveTab("matches")}
                  className="mt-3 text-xs font-bold text-cyan-400 hover:underline"
                >
                  Ver mercados disponibles
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myBets.map(bet => (
                  <div key={bet.id} className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{bet.match}</h4>
                        <p className="text-xs text-gray-400">{bet.market} @ {bet.odds}</p>
                      </div>
                      <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-full font-bold">
                        {bet.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Apuesta</span>
                        <span className="text-xs font-bold">{bet.stake} €</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-500 block">Posible Premio</span>
                        <span className="text-xs font-bold text-emerald-400">{bet.potentialReturn} €</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL DE APUESTA VIRTUAL */}
      {selectedMarket && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-end justify-center backdrop-blur-sm px-4">
          <div className="bg-[#111827] w-full max-w-md rounded-t-3xl border-t border-gray-800 p-6 space-y-4 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-md text-cyan-400">Confirmar Apuesta</h3>
              <button 
                onClick={() => setSelectedMarket(null)}
                className="text-gray-400 hover:text-white p-1 text-sm font-bold"
              >
                Cerrar
              </button>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selectedMarket.matchName}</p>
              <h4 className="font-extrabold text-lg text-white mt-1">
                {selectedMarket.label} <span className="text-emerald-400">@ {selectedMarket.odds}</span>
              </h4>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-semibold">Cantidad a apostar (€ Ficticios):</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-extrabold text-lg flex-1 focus:outline-none focus:border-cyan-500"
                  placeholder="Cantidad"
                />
                <button
                  onClick={() => setBetAmount(Math.min(bankroll, 5000).toString())}
                  className="bg-gray-800 border border-gray-700 px-3 rounded-xl text-xs font-bold"
                >
                  Mitad
                </button>
                <button
                  onClick={() => setBetAmount(bankroll.toString())}
                  className="bg-gray-800 border border-gray-700 px-3 rounded-xl text-xs font-bold text-cyan-400"
                >
                  Todo
                </button>
              </div>
              <p className="text-[10px] text-gray-500">Saldo disponible: {bankroll.toLocaleString("de-DE")} € ficticios.</p>
            </div>

            <div className="flex justify-between items-center bg-gray-800/30 p-3 rounded-xl">
              <span className="text-xs text-gray-400">Posible Premio:</span>
              <span className="text-lg font-extrabold text-emerald-400">
                {(parseInt(betAmount, 10) ? Math.round(parseInt(betAmount, 10) * selectedMarket.odds) : 0).toLocaleString("de-DE")} €
              </span>
            </div>

            <button
              onClick={handlePlaceBet}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-black py-4 rounded-2xl transition-all shadow-lg"
            >
              CONFIRMAR APUESTA VIRTUAL
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#111827]/95 border-t border-gray-800 px-6 py-2 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab("matches")}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === "matches" ? "text-cyan-400" : "text-gray-500"}`}
        >
          <span className="text-xl">⚽</span>
          <span className="text-[10px] font-bold">Partidos</span>
        </button>

        <button 
          onClick={() => setActiveTab("leaderboard")}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === "leaderboard" ? "text-cyan-400" : "text-gray-500"}`}
        >
          <span className="text-xl">🏆</span>
          <span className="text-[10px] font-bold">Ligas</span>
        </button>

        <button 
          onClick={() => setActiveTab("my-bets")}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === "my-bets" ? "text-cyan-400" : "text-gray-500"}`}
        >
          <span className="text-xl">🎟️</span>
          <span className="text-[10px] font-bold">Mis Apuestas</span>
        </button>
      </nav>

    </div>
  );
}