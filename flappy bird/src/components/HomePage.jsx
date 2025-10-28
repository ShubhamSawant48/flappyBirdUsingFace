import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bird, Smile, Zap, Trophy } from "lucide-react";

function HomePage() {
  return (
    <main style={styles.page}>
      <section style={styles.heroSection} className="hero-responsive">
        <div style={styles.leftCol} className="hero-left">
          <h1 style={styles.title}>
            <span style={styles.grad1}>Smile</span>
            <span style={styles.amp}>&</span>
            <span style={styles.grad2}>Fly</span>
          </h1>
          <p style={styles.subTitle}>
            A revolutionary flappy bird game that responds to your smile! Use
            your camera to detect your smile and make the bird soar through the
            sky.
          </p>
          <div style={styles.ctaRow}>
            <Link
              to="/play"
              style={styles.ctaPrimary}
              className="btn-hero btn-hero-primary"
            >
              Start Playing
              <ArrowRight size={18} />
            </Link>
            <a
              href="#learn"
              style={styles.ctaSecondary}
              className="btn-hero btn-hero-secondary"
            >
              Learn More
            </a>
          </div>
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <div style={styles.featureValue}>100%</div>
              <div style={styles.featureLabel}>Fun Guaranteed</div>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureValue}>∞</div>
              <div style={styles.featureLabel}>Endless Levels</div>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureValue}>0ms</div>
              <div style={styles.featureLabel}>Lag Free</div>
            </div>
          </div>
        </div>
        <div style={styles.rightCol} className="hero-right" aria-hidden>
          <div style={styles.birdBackdrop} />
          <div style={styles.birdRing} />
          <div style={styles.birdGlow} />
          <Bird style={styles.birdIcon} size={220} strokeWidth={1.8} />
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader} className="animate-slide-up">
          <h2 style={styles.h2}>Why You'll Love It</h2>
          <p style={styles.lead}>
            Experience gaming like never before with cutting-edge smile
            detection technology
          </p>
        </div>

        <div style={styles.featuresGrid}>
          <div
            style={{ ...styles.featureCard, ...styles.cardPrimary }}
            className="feature-card animate-slide-up"
            aria-label="Smile Detection"
          >
            <div
              style={{
                ...styles.featureIconWrap,
                background: "rgba(37,99,235,0.14)",
              }}
            >
              <Smile size={28} style={{ color: "#2563eb" }} />
            </div>
            <h3 style={styles.cardTitle}>Smile Detection</h3>
            <p style={styles.cardText}>
              Advanced camera technology detects your smile in real-time and
              controls the bird's flight.
            </p>
          </div>

          <div
            style={{ ...styles.featureCard, ...styles.cardAccent }}
            className="feature-card animate-slide-up"
            aria-label="Lightning Fast"
          >
            <div
              style={{
                ...styles.featureIconWrap,
                background: "rgba(56,189,248,0.16)",
              }}
            >
              <Zap size={28} style={{ color: "#38bdf8" }} />
            </div>
            <h3 style={styles.cardTitle}>Lightning Fast</h3>
            <p style={styles.cardText}>
              Instant response time ensures your smile is captured and processed
              without any lag.
            </p>
          </div>

          <div
            style={{ ...styles.featureCard, ...styles.cardSecondary }}
            className="feature-card animate-slide-up"
            aria-label="Leaderboards"
          >
            <div
              style={{
                ...styles.featureIconWrap,
                background: "rgba(250,204,21,0.16)",
              }}
            >
              <Trophy size={28} style={{ color: "#f59e0b" }} />
            </div>
            <h3 style={styles.cardTitle}>Leaderboards</h3>
            <p style={styles.cardText}>
              Compete with friends and climb the global leaderboards to prove
              your smile power!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaPanel}>
          <div style={styles.ctaDecorA} />
          <div style={styles.ctaDecorB} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <h2 style={{ ...styles.h2, color: "#fff", marginBottom: 12 }}>
              Ready to Smile Your Way to Victory?
            </h2>
            <p
              style={{
                ...styles.lead,
                color: "rgba(255,255,255,0.9)",
                margin: "0 auto 20px",
                maxWidth: 720,
              }}
            >
              Join thousands of players who are already having fun with Flappy
              Face. Start your journey today!
            </p>
            <Link to="/play" style={styles.ctaWhite}>
              Play Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Leaderboard Section (sample) */}
      <section style={styles.leaderboardSection}>
        <div style={styles.sectionHeader} className="animate-slide-up">
          <h2 style={styles.h2}>Top Smilers</h2>
          <p style={styles.lead}>
            Check out the best smile-powered players on the leaderboard
          </p>
        </div>

        <div style={styles.lbWrap}>
          <div style={styles.lbHeader}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 7fr 3fr",
                gap: 12,
                fontWeight: 800,
              }}
            >
              <div>Rank</div>
              <div>Player</div>
              <div style={{ textAlign: "right" }}>Score</div>
            </div>
          </div>
          <div>
            {[
              { rank: 1, name: "SmileMaster", score: 8750, medal: "🥇" },
              { rank: 2, name: "HappyFlyer", score: 7920, medal: "🥈" },
              { rank: 3, name: "JoyfulBird", score: 7450, medal: "🥉" },
              { rank: 4, name: "GrinGamer", score: 6890, medal: "4️⃣" },
              { rank: 5, name: "BeamBoss", score: 6320, medal: "5️⃣" },
            ].map((p, i) => (
              <div key={i} style={styles.lbRow} className="animate-slide-up">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 7fr 3fr",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 20 }}>{p.medal}</div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div
                    style={{
                      textAlign: "right",
                      color: "#2563eb",
                      fontWeight: 800,
                    }}
                  >
                    {p.score.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/play" style={styles.leaderboardCta}>
              View Full Leaderboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    width: "100%",
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: "40px 100px",
    background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
  },
  // Sections
  featuresSection: {
    width: "100%",
    maxWidth: 1200,
    margin: "50px auto",
    padding: "48px 24px",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: 24,
  },
  h2: {
    fontSize: 40,
    fontWeight: 800,
    margin: 0,
    marginBottom: 8,
  },
  lead: {
    color: "#64748b",
    fontSize: 18,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  featureCard: {
    padding: 24,
    borderRadius: 16,
    background: "#fff",
    border: "1px solid #e5e7eb",
    transition:
      "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
  },
  cardPrimary: {},
  cardAccent: {},
  cardSecondary: {},
  featureIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: 800, margin: 0, marginBottom: 6 },
  cardText: { color: "#475569", margin: 0 },

  // CTA
  ctaSection: {
    width: "100%",
    padding: "48px 24px",
  },
  ctaPanel: {
    position: "relative",
    maxWidth: 1200,
    margin: "0 auto",
    borderRadius: 28,
    padding: 40,
    background: "linear-gradient(90deg, #fb923c, #f43f5e, #ef4444)",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(37,99,235,0.25)",
  },
  ctaDecorA: {
    position: "absolute",
    width: 380,
    height: 380,
    background: "#fff",
    opacity: 0.12,
    borderRadius: 9999,
    filter: "blur(36px)",
    top: -120,
    left: -120,
  },
  ctaDecorB: {
    position: "absolute",
    width: 380,
    height: 380,
    background: "#fff",
    opacity: 0.12,
    borderRadius: 9999,
    filter: "blur(36px)",
    bottom: -120,
    right: -120,
  },
  ctaWhite: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    color: "#2563eb",
    textDecoration: "none",
    padding: "14px 22px",
    borderRadius: 9999,
    fontWeight: 700,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },

  // Leaderboard
  leaderboardSection: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "48px 24px 64px",
  },
  lbWrap: {
    maxWidth: 820,
    margin: "0 auto",
    borderRadius: 20,
    border: "1px solid #e5e7eb",
    background: "#fff",
    boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  lbHeader: {
    background: "linear-gradient(90deg, #fb923c, #f43f5e, #ef4444)",
    color: "#fff",
    padding: 18,
    fontSize: 18,
  },
  lbRow: {
    padding: 16,
    borderTop: "1px solid #e5e7eb",
    transition: "background-color .2s ease",
  },
  leaderboardCta: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700,
  },
  heroSection: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 16,
    alignItems: "center",
    padding: "72px 32px",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
    paddingLeft: 8,
  },
  title: {
    margin: 0,
    fontSize: 104,
    lineHeight: 1.02,
    letterSpacing: -1.6,
    fontWeight: 900,
  },
  grad1: {
    fontWeight: 900,
    background: "linear-gradient(90deg, #fb923c 0%, #f43f5e 50%, #ef4444 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  grad2: {
    fontWeight: 900,
    background: "linear-gradient(90deg, #f59e0b 0%, #fb7185 60%, #ef4444 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  amp: {
    margin: "0 12px",
    fontWeight: 900,
  },
  subTitle: {
    color: "#334155",
    fontSize: 24,
    maxWidth: 840,
  },
  ctaRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "linear-gradient(90deg, #f97316, #ef4444)",
    color: "#fff",
    textDecoration: "none",
    padding: "14px 22px",
    borderRadius: 14,
    fontWeight: 800,
    boxShadow: "0 12px 24px rgba(239,68,68,0.25)",
  },
  ctaSecondary: {
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#ef4444",
    background: "transparent",
    padding: "12px 22px",
    borderRadius: 14,
    border: "2px solid #fecaca",
    fontWeight: 700,
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
    gap: 28,
    marginTop: 10,
    maxWidth: 560,
  },
  featureItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  featureValue: {
    fontSize: 32,
    fontWeight: 800,
    color: "#ef4444",
  },
  featureLabel: {
    color: "#64748b",
    fontWeight: 600,
  },
  rightCol: {
    position: "relative",
    minHeight: 420,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  birdBackdrop: {
    position: "absolute",
    width: 620,
    height: 620,
    borderRadius: "50%",
    background:
      "radial-gradient(closest-side, rgba(253, 114, 114, 0.35), rgba(253, 164, 116, 0.22) 45%, rgba(255, 214, 153, 0.10) 65%, transparent 75%)",
    filter: "blur(2px)",
  },
  birdRing: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: "50%",
    background:
      "conic-gradient(from 180deg at 50% 50%, rgba(255,125,125,.55), rgba(255,203,125,.35), rgba(255,125,125,.55))",
    filter: "blur(16px)",
    opacity: 0.9,
  },
  birdGlow: {
    position: "absolute",
    width: 460,
    height: 460,
    borderRadius: "50%",
    boxShadow: "0 0 140px 42px rgba(244,63,94,0.28)",
  },
  birdIcon: {
    position: "relative",
    color: "#ef4444",
    animation: "float 3s ease-in-out infinite",
  },
};

export default HomePage;
