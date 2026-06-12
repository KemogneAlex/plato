import { useState } from "react";
import { Link, useLocation } from "wouter";
import { authClient, captureToken } from "../lib/auth";
import { ChefHat, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authClient.signUp.email(
        { name, email, password },
        { onSuccess: captureToken }
      );
      if (res.error) {
        setError(res.error.message ?? "Erreur lors de l'inscription.");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-body)" }}>
      {/* Left — visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "var(--color-dark)" }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(255,107,53,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,107,53,0.05)" }} />
        <div className="relative text-center">
          <div className="text-7xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "white" }}>
            Créez votre site<br />en quelques minutes
          </h2>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 300, margin: "0 auto" }}>
            Rejoignez 500+ restaurateurs qui font confiance à Plato pour leur présence en ligne.
          </p>
          <div className="flex justify-center gap-2 mt-8">
            {["🍕", "🍣", "🍔", "☕", "🥗"].map((em, i) => (
              <span key={i} className="text-2xl" style={{ opacity: 0.7 }}>{em}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/">
            <a className="inline-flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
                <ChefHat size={18} color="white" />
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>Plato</span>
            </a>
          </Link>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>
            Créer un compte
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-gray)" }}>
            Commencez gratuitement, sans carte bancaire
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "var(--color-danger)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-dark)" }}>Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jean Dupont"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #E5E7EB", color: "var(--color-dark)", background: "white" }}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.12)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-dark)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@restaurant.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #E5E7EB", color: "var(--color-dark)", background: "white" }}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.12)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-dark)" }}>Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #E5E7EB", color: "var(--color-dark)", background: "white" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.12)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-gray)" }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2"
              style={{ background: "var(--color-primary)", color: "white", opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "var(--color-primary-dark)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
            >
              {loading ? "Création du compte..." : "Créer mon compte gratuitement"}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "var(--color-gray)" }}>
            En créant un compte, vous acceptez nos{" "}
            <a href="#" style={{ color: "var(--color-primary)" }}>CGU</a> et{" "}
            <a href="#" style={{ color: "var(--color-primary)" }}>Politique de confidentialité</a>
          </p>

          <p className="text-center text-sm mt-5" style={{ color: "var(--color-gray)" }}>
            Déjà un compte ?{" "}
            <Link to="/login">
              <a className="font-semibold" style={{ color: "var(--color-primary)" }}>Se connecter</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
