(() => {
  const e = React.createElement;
  const { useEffect, useMemo, useState } = React;

  function useHashRoute() {
    const getRoute = () => {
      const raw = (window.location.hash || "#/").replace(/^#/, "");
      if (raw === "" || raw === "/") return "/";
      if (raw.startsWith("/leren")) return "/leren";
      return "/";
    };

    const [route, setRoute] = useState(getRoute);

    useEffect(() => {
      const onHashChange = () => setRoute(getRoute());
      window.addEventListener("hashchange", onHashChange);
      return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    return route;
  }

  function navigate(to) {
    window.location.hash = to.startsWith("#") ? to : `#${to}`;
  }

  function LandingPage() {
    return e(
      "div",
      { className: "container" },
      e("div", { className: "kicker" }, "Even uit je sleur..."),
      e(
        "div",
        { className: "hero-grid" },
        e(
          "div",
          null,
          e("div", { className: "bigline" }, "Jij gebruikt het:"),
          e(
            "div",
            { className: "input-mock", "aria-hidden": "true" },
            e("span", null, "Tik een vraag..."),
            e("span", { className: "bolt" }, "⚡")
          ),
          e("div", { style: { height: 18 } }),
          e("div", { className: "bigline" }, "Maar gebruikt het nog niet echt."),
          e("div", { className: "lead" }, "Wat zie je nu over het hoofd?"),
          e(
            "div",
            { className: "mid-rail", "aria-hidden": "true" },
            e("span", null, "Net goed genoeg"),
            e("span", null, "Maar aan de oppervlakte"),
            e("span", null, "Wat mis je hier?")
          ),
          e(
            "div",
            { className: "center-actions" },
            e(
              "button",
              { className: "btn btn-primary", onClick: () => navigate("/leren") },
              "JA, IK WIL HET ÉCHT LEREN GEBRUIKEN"
            ),
            e(
              "button",
              { className: "btn btn-secondary", onClick: () => navigate("/leren") },
              "Kijk verder dan de oppervlakte"
            )
          )
        ),
        e(
          "div",
          { className: "card ui-card" },
          e(
            "div",
            { className: "ui-top" },
            e(
              "div",
              { style: { display: "flex", gap: 10, alignItems: "center" } },
              e("span", { className: "dot" }, "✦"),
              e("span", null, "AI Model")
            ),
            e(
              "span",
              { className: "dots", "aria-hidden": "true" },
              e("i", null),
              e("i", null),
              e("i", null)
            )
          ),
          e("div", { className: "ui-input" }, "Tik een vraag..."),
          e("div", { className: "ui-row" }),
          e("div", { className: "ui-row" }),
          e("div", { className: "ui-row" }),
          e("div", { className: "wire", "aria-hidden": "true" })
        )
      ),
      e(
        "div",
        { className: "squares", "aria-hidden": "true" },
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null)
      )
    );
  }

  function LearnPage() {
    return e(
      "div",
      { className: "container" },
      e("div", { className: "kicker" }, "Even uit je sleur..."),
      e(
        "div",
        { className: "hero-grid", style: { gridTemplateColumns: "1fr" } },
        e(
          "div",
          null,
          e(
            "div",
            { className: "h1" },
            "Leer werken met taalmodellen",
            e("br", null),
            "zoals ze echt werken"
          ),
          e(
            "div",
            { className: "sublead" },
            "Een training van een dagdeel waarin je ontdekt hoe je AI niet als tool, maar als denkruimte kunt gebruiken."
          ),
          e("div", { className: "rule" }),
          e(
            "div",
            { className: "steps" },
            e(
              "div",
              { className: "step" },
              e("h3", null, "1. Ruwe gedachte droppen"),
              e("p", null, "(Chaotische, eigen input.)")
            ),
            e("div", { className: "arrow", "aria-hidden": "true" }, "→"),
            e(
              "div",
              { className: "step" },
              e("h3", null, "2. Strategisch spiegelen"),
              e("p", null, "(Gerichte, kritische vragen.)")
            ),
            e("div", { className: "arrow", "aria-hidden": "true" }, "→"),
            e(
              "div",
              { className: "step" },
              e("h3", null, "3. Kristallisatie & Concreet resultaat"),
              e("p", null, "(Formuleer een haarscherpe conclusie.)")
            )
          ),
          e(
            "div",
            { className: "bullets" },
            e(
              "div",
              { className: "bullet" },
              e("span", { className: "icon" }, "≡"),
              e("span", null, "Gebruik ruwe input als startpunt")
            ),
            e(
              "div",
              { className: "bullet" },
              e("span", { className: "icon" }, "◔"),
              e("span", null, "Begrijp welk woord wat")
            ),
            e(
              "div",
              { className: "bullet" },
              e("span", { className: "icon" }, "⇄"),
              e("span", null, "Stuur gericht, tik 1 ding aan tegelijk")
            )
          ),
          e("div", { className: "h2" }, "Voor wie al met AI werkt, maar voelt: ‘Zit er niet meer in?’"),
          e(
            "div",
            { className: "cta-wrap" },
            e(
              "button",
              {
                className: "btn btn-primary btn-wide",
                onClick: () => alert("Placeholder: inschrijven flow"),
              },
              "[ IK ZEG ‘JA’ EN SCHRIJF ME IN ]"
            ),
            e(
              "a",
              {
                className: "linkish",
                href: "#/",
                onClick: (evt) => {
                  evt.preventDefault();
                  navigate("/");
                },
              },
              "Beschikbare data & prijzen"
            )
          )
        )
      )
    );
  }

  function App() {
    const route = useHashRoute();
    const page = useMemo(() => (route === "/leren" ? e(LearnPage) : e(LandingPage)), [route]);
    return e("div", { className: "app" }, e("div", { className: "mesh", "aria-hidden": "true" }), page);
  }

  const root = document.getElementById("root");
  ReactDOM.createRoot(root).render(e(App));
})();

