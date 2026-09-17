const { useMemo, useState } = React;

const LOAN_PRODUCTS = [
  {
    id: "personal",
    icon: "◈",
    name: "Personal Loan",
    description: "Flexible financing for personal needs.",
    maxAmount: 10000000,
    tenor: "6–12 months",
    rate: "1.5% / month",
  },
  {
    id: "business",
    icon: "▣",
    name: "Business Loan",
    description: "Working-capital financing for your business.",
    maxAmount: 25000000,
    tenor: "12–24 months",
    rate: "1.25% / month",
  },
  {
    id: "emergency",
    icon: "✦",
    name: "Emergency Loan",
    description: "Financing for urgent and unexpected expenses.",
    maxAmount: 5000000,
    tenor: "3–6 months",
    rate: "2% / month",
  },
];

const INITIAL_LOANS = [
  {
    id: "LN-2026-001",
    product: "Personal Loan",
    amount: 5000000,
    remaining: 3250000,
    nextPayment: 450000,
    dueDate: "25 Sep 2026",
    status: "Active",
  },
];

function formatIDR(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function App() {
  return <AppShell />;
}

function AppShell() {
  const [activeTab, setActiveTab] = useState("home");
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const activeLoans = useMemo(
    () => loans.filter((loan) => loan.status === "Active"),
    [loans]
  );

  const outstanding = useMemo(
    () => activeLoans.reduce((sum, loan) => sum + loan.remaining, 0),
    [activeLoans]
  );

  function openApplication(product) {
    setSelectedProduct(product);
  }

  function submitApplication({ amount, tenor }) {
    const newLoan = {
      id: `LN-2026-${String(loans.length + 1).padStart(3, "0")}`,
      product: selectedProduct.name,
      amount,
      remaining: amount,
      nextPayment: Math.ceil(amount / tenor),
      dueDate: "25 Oct 2026",
      status: "Active",
    };

    setLoans((current) => [...current, newLoan]);
    setSelectedProduct(null);
    setActiveTab("loans");
  }

  return (
    <div className="app-shell">
      <div className="app">
        <Header />

        <main className="app-main">
          {activeTab === "home" && (
            <HomeView
              activeLoans={activeLoans}
              outstanding={outstanding}
              onApply={openApplication}
              onViewLoans={() => setActiveTab("loans")}
            />
          )}

          {activeTab === "loans" && (
            <LoansView
              loans={loans}
              onApply={() => setActiveTab("home")}
            />
          )}

          {activeTab === "profile" && <ProfileView />}
        </main>

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />

        <Overlay
          selectedProduct={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubmit={submitApplication}
        />
      </div>
    </div>
  );
}

function Header() {
  function handleNotifications() {
    alert("No new notifications");
  }

  return (
    <header className="topbar">
      <div className="brand">Loan Apps</div>
      <button
        className="topbar-action"
        onClick={handleNotifications}
        aria-label="Notifications"
      >
        ♢
      </button>
    </header>
  );
}

function HomeView({ activeLoans, outstanding, onApply, onViewLoans }) {
  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>
          Simple financing,
          <br />
          made easier.
        </h1>
        <p>
          Manage your loans and explore financing options from one simple mobile app.
        </p>
      </section>

      <section className="section">
        <div className="stats">
          <div className="stat">
            <div className="stat-label">ACTIVE LOANS</div>
            <div className="stat-value">{activeLoans.length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">OUTSTANDING</div>
            <div className="stat-value">{formatIDR(outstanding)}</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">My Loans</h2>
          <button className="section-link" onClick={onViewLoans}>
            View all
          </button>
        </div>

        {activeLoans.length === 0 ? (
          <div className="card empty">You don't have any active loans.</div>
        ) : (
          <LoanCard loan={activeLoans[0]} compact />
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Loan Products</h2>
        </div>

        <div className="stack">
          {LOAN_PRODUCTS.map((product) => (
            <LoanProductCard
              key={product.id}
              product={product}
              onApply={() => onApply(product)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function LoanProductCard({ product, onApply }) {
  return (
    <article className="card product-card" onClick={onApply}>
      <div className="card-top">
        <div className="icon-box" aria-hidden="true">
          {product.icon}
        </div>
        <span className="badge">Available</span>
      </div>
      <h3 className="card-title">{product.name}</h3>
      <p className="card-description">{product.description}</p>

      <div className="meta-grid">
        <div>
          <div className="meta-label">UP TO</div>
          <div className="meta-value">{formatIDR(product.maxAmount)}</div>
        </div>
        <div>
          <div className="meta-label">TENOR</div>
          <div className="meta-value">{product.tenor}</div>
        </div>
        <div>
          <div className="meta-label">RATE</div>
          <div className="meta-value">{product.rate}</div>
        </div>
      </div>
    </article>
  );
}

function LoansView({ loans, onApply }) {
  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">My Loans</h1>
        </div>

        {loans.length === 0 ? (
          <div className="card empty">You don't have any loans yet.</div>
        ) : (
          <div>
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button className="primary-button" onClick={onApply}>
            Apply for a New Loan
          </button>
        </div>
      </section>
    </div>
  );
}

function LoanCard({ loan, compact = false }) {
  const paid = Math.max(0, loan.amount - loan.remaining);
  const progress = loan.amount
    ? Math.min(100, (paid / loan.amount) * 100)
    : 0;

  return (
    <article className="card loan-card">
      <div className="card-top">
        <div>
          <div className="loan-number">{loan.id}</div>
          <h3 className="card-title" style={{ marginTop: 5 }}>
            {loan.product}
          </h3>
        </div>
        <span className="badge success">{loan.status}</span>
      </div>

      <div className="loan-amount">{formatIDR(loan.remaining)}</div>
      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
        remaining balance
      </div>

      <div
        className="progress"
        aria-label={`Loan paid ${Math.round(progress)} percent`}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="detail-row">
        <span className="muted">Next payment</span>
        <span className="strong">{formatIDR(loan.nextPayment)}</span>
      </div>
      <div className="detail-row">
        <span className="muted">Due date</span>
        <span className="strong">{loan.dueDate}</span>
      </div>

      {!compact && (
        <div className="detail-row">
          <span className="muted">Original amount</span>
          <span className="strong">{formatIDR(loan.amount)}</span>
        </div>
      )}
    </article>
  );
}

function ProfileView() {
  return (
    <div className="page">
      <div className="card profile">
        <div className="avatar">LG</div>
        <h1>Account</h1>
        <p>Manage your personal information and preferences.</p>
      </div>

      <div className="list">
        <button className="list-item">
          <span>Personal Information</span>
          <span className="arrow">›</span>
        </button>
        <button className="list-item">
          <span>Documents</span>
          <span className="arrow">›</span>
        </button>
        <button className="list-item">
          <span>Security</span>
          <span className="arrow">›</span>
        </button>
        <button className="list-item">
          <span>Notifications</span>
          <span className="arrow">›</span>
        </button>
        <button className="list-item">
          <span>Help &amp; Support</span>
          <span className="arrow">›</span>
        </button>
      </div>
    </div>
  );
}

function BottomNav({ activeTab, onChange }) {
  const items = [
    ["home", "⌂", "Home"],
    ["loans", "▣", "Loans"],
    ["profile", "○", "Profile"],
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(([id, icon, label]) => (
        <button
          key={id}
          className={`nav-button ${activeTab === id ? "active" : ""}`}
          onClick={() => onChange(id)}
          aria-current={activeTab === id ? "page" : undefined}
        >
          <span className="nav-icon" aria-hidden="true">
            {icon}
          </span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Overlay({ selectedProduct, onClose, onSubmit }) {
  if (!selectedProduct) return null;

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <LoanApplicationSheet
        product={selectedProduct}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function LoanApplicationSheet({ product, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [tenor, setTenor] = useState(12);
  const [error, setError] = useState("");

  function handleSubmit() {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid loan amount.");
      return;
    }

    if (value > product.maxAmount) {
      setError(`Maximum amount is ${formatIDR(product.maxAmount)}.`);
      return;
    }

    onSubmit({ amount: value, tenor: Number(tenor) });
  }

  return (
    <section
      className="sheet"
      onClick={(event) => event.stopPropagation()}
      aria-label="Loan application"
    >
      <div className="handle" />
      <h2>Apply for {product.name}</h2>
      <p className="sheet-subtitle">
        Choose an amount and tenor to start your application.
      </p>

      <div className="field">
        <label htmlFor="loan-amount">Loan amount</label>
        <input
          id="loan-amount"
          type="number"
          inputMode="numeric"
          min="1"
          max={product.maxAmount}
          placeholder="Enter amount"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setError("");
          }}
        />
      </div>

      <div className="field">
        <label htmlFor="loan-tenor">Tenor</label>
        <select
          id="loan-tenor"
          value={tenor}
          onChange={(event) => setTenor(event.target.value)}
        >
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
          <option value="18">18 months</option>
          <option value="24">24 months</option>
        </select>
      </div>

      {error && (
        <p
          style={{
            color: "var(--danger)",
            fontSize: 12,
            margin: "-4px 0 12px",
          }}
        >
          {error}
        </p>
      )}

      <div className="sheet-actions">
        <button className="primary-button" onClick={handleSubmit}>
          Submit Application
        </button>
        <button className="secondary-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
