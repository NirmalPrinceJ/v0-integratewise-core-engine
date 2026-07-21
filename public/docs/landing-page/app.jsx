// App — mounts sections + wires scroll reveal

const Logomark = ({ size = 28 }) => {
  const h = Math.round(size * 0.46);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 165 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      aria-label="IntegrateWise"
      role="img"
    >
      <path
        d="M104.107 0q3.39-.02 3.35 4.45-.07 7.85-.08 19.38a.68.68 0 0 0 .46.65q10.05 3.53 10.05 13.38c0 7.61-6.03 13.22-13.52 13.26s-13.58-5.51-13.66-13.13q-.09-9.84 9.92-13.47a.68.68 0 0 0 .45-.66q-.12-11.53-.27-19.38-.09-4.47 3.3-4.48"
        fill="currentColor"
      />
      <path
        d="M26.787 41.03q-2.01 7.55-9.57 9.73C6.267 53.92-3.143 42.95.997 32.63c3.95-9.82 16.64-10.82 23.18-3.22q.05.07.09.14l2.1 3.99a1.21 1.21 0 0 0 1.07.64h2.74a.86.86 0 0 0 .86-.86q0-4.21.01-7.52c.05-10.05 5.85-18.17 14.43-22.98q3.81-2.14 8.8-2.58 15.8-1.42 25.3 11.53 4.64 6.33 4.78 15.45.03 1.72-.02 15.54-.03 10.03 2.11 14.61c7.72 16.53 32.86 13.92 37.47-2.93q.82-3.01.98-8.99.13-4.74-.31-16.25-.591-15.5 11.16-24.11 6.56-4.8 15.15-4.95a3.36 3.36 0 0 1 2.31.86 3.35 3.35 0 0 1 1.1 2.2l.02.23a2.98 2.98 0 0 1-1.705 2.946 2.95 2.95 0 0 1-1.165.274q-9.54.24-14.43 5.48-5.841 6.27-5.94 14.8-.14 11.69-.04 20.37.069 6.46-1.32 10.18c-4.21 11.33-15.57 18.32-27.57 17.32-11.58-.96-21.76-9.81-23.98-21.37q-.5-2.59-.2-9.99.44-10.82-.35-18.71c-1.49-14.96-17.1-22.59-30.11-15.64-4.81 2.57-8.98 8.56-9.9 13.34q-.56 2.93-.29 11.38c.24 7.56-3.6 6.55-9.69 6.57a.9.9 0 0 0-.538.181.87.87 0 0 0-.312.47"
        fill="currentColor"
      />
      <path
        d="M57.487 24.22c7.48-.03 13.56 5.53 13.63 13.13q.08 9.84-9.92 13.46a.7.7 0 0 0-.334.25.7.7 0 0 0-.126.4q.12 11.52.26 19.36.08 4.47-3.31 4.48t-3.34-4.45q.08-7.85.1-19.37a.7.7 0 0 0-.127-.4.7.7 0 0 0-.333-.25q-10.03-3.53-10.02-13.37c0-7.61 6.04-13.21 13.52-13.24"
        fill="currentColor"
      />
      <path
        d="M151.077 51.28c7.494 0 13.57-6.075 13.57-13.57 0-7.494-6.076-13.57-13.57-13.57s-13.57 6.076-13.57 13.57 6.075 13.57 13.57 13.57"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
};

window.Logomark = Logomark;

const Nav = () => (
  <nav className="nav">
    <div className="nav-brand">
      <span className="nav-brand-mark" style={{ color: "var(--forest-4)" }}>
        <Logomark size={40} />
      </span>
      <span>IntegrateWise</span>
    </div>
    <div className="nav-links">
      <a href="#platform">Platform</a>
      <a href="#workbenches">Workbenches</a>
      <a href="#why">Capabilities</a>
      <a href="#intent">Ecosystem</a>
      <a href="#">Pricing</a>
      <a href="#">Developers</a>
      <a href="#">Resources</a>
    </div>
    <div className="row gap-12" style={{ alignItems: "center" }}>
      <a href="#" style={{ fontSize: 14, color: "var(--ink-2)", textDecoration: "none" }}>
        Sign in
      </a>
      <a className="btn btn-primary" href="#start">
        Start Free
      </a>
    </div>
  </nav>
);

const App = () => {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 20% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const safety = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
    }, 8000);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <SocialProof />
      <What />
      <IntentExecution />
      <Workbenches />
      <Why />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
