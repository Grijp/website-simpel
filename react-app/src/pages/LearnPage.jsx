import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

export default function LearnPage() {
  return (
    <div className="container">
      <div className="lpShell">
        {/* Reuse the same header to keep unity across pages */}
        <SiteHeader />

        <div className="workshop wsSeamless">
          <div className="wsBadge">Workshop</div>
          <h1 className="wsTitle">Denken met AI</h1>
          <h2 className="wsSubtitle">Train je basisvaardigheid.</h2>

          <div className="wsIntroGrid">
            <div className="wsIntroLeft">
              <h3 className="wsIntroHeading">Snel itereren van input naar output.</h3>
              <div className="wsIntroList">
                <span>Je werkt met je eigen taken.</span>
                <span>Je doet veel pogingen.</span>
                <span>Je past steeds kleine dingen aan.</span>
                <span>Je ontdekt wat er mogelijk is.</span>
              </div>
              <div className="wsIntroConclusion">Meer pogingen. Meer inzicht. Meer resultaat.</div>
            </div>

            <div className="wsFlowCard">
              <div className="wsFlowWrap">
                <div className="wsFlowLoop" aria-hidden="true">
                  <div className="wsFlowMask">De kern van de workshop</div>
                  <div className="wsFlowArrow wsFlowArrowTop">›</div>
                  <div className="wsFlowArrow wsFlowArrowBottom">‹</div>
                </div>

                <div className="wsFlowSteps">
                  <div className="wsFlowStep">
                    <div className="wsIconBox wsIconPurple" aria-hidden="true">
                      ✎
                    </div>
                    <div className="wsStepTitle">Input</div>
                    <div className="wsStepDesc">Iets invoeren</div>
                  </div>

                  <div className="wsStraightArrow" aria-hidden="true">
                    →
                  </div>

                  <div className="wsFlowStep">
                    <div className="wsIconBox wsIconBlue" aria-hidden="true">
                      ✦
                    </div>
                    <div className="wsStepTitle">Output</div>
                    <div className="wsStepDesc">Kijken wat er gebeurt</div>
                  </div>

                  <div className="wsStraightArrow" aria-hidden="true">
                    →
                  </div>

                  <div className="wsFlowStep">
                    <div className="wsIconBox wsIconGreen" aria-hidden="true">
                      ≋
                    </div>
                    <div className="wsStepTitle">Aanpassen</div>
                    <div className="wsStepDesc">Iets veranderen</div>
                  </div>

                  <div className="wsStraightArrow" aria-hidden="true">
                    →
                  </div>

                  <div className="wsFlowStep">
                    <div className="wsIconBox wsIconOutline" aria-hidden="true">
                      ↻
                    </div>
                    <div className="wsStepTitle">Opnieuw</div>
                    <div className="wsStepDesc">Proberen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="wsDivider" />

          <div className="wsSection">
            <h3 className="wsSectionTitle">Het programma</h3>
            <div className="wsProgramGrid">
              <div className="wsProgramItem">
                <div className="wsProgramNumber">01</div>
                <div className="wsProgramIcon" aria-hidden="true">
                  ↗
                </div>
                <div className="wsProgramTitle">Korte start</div>
                <div className="wsProgramDesc">Kort inzicht in hoe je anders kijkt naar output.</div>
              </div>
              <div className="wsProgramItem">
                <div className="wsProgramNumber">02</div>
                <div className="wsProgramIcon" aria-hidden="true">
                  ▶
                </div>
                <div className="wsProgramTitle">Direct beginnen</div>
                <div className="wsProgramDesc">Je pakt een eigen taak en voert in zoals je normaal doet.</div>
              </div>
              <div className="wsProgramItem">
                <div className="wsProgramNumber">03</div>
                <div className="wsProgramIcon" aria-hidden="true">
                  ↺
                </div>
                <div className="wsProgramTitle">Itereren in tempo</div>
                <div className="wsProgramDesc">Input → output → aanpassen → opnieuw. Steeds sneller.</div>
              </div>
              <div className="wsProgramItem">
                <div className="wsProgramNumber">04</div>
                <div className="wsProgramIcon" aria-hidden="true">
                  ◇
                </div>
                <div className="wsProgramTitle">Variatie testen</div>
                <div className="wsProgramDesc">
                  Andere woorden, andere invalshoeken, meer of minder context. Je verkent.
                </div>
              </div>
              <div className="wsProgramItem">
                <div className="wsProgramNumber">05</div>
                <div className="wsProgramIcon" aria-hidden="true">
                  ◎
                </div>
                <div className="wsProgramTitle">Richting aanbrengen</div>
                <div className="wsProgramDesc">Waar moet het heen? Wat mist er nog? Wat moet scherper?</div>
              </div>
              <div className="wsProgramItem">
                <div className="wsProgramNumber">06</div>
                <div className="wsProgramIcon" aria-hidden="true">
                  ▦
                </div>
                <div className="wsProgramTitle">Flow</div>
                <div className="wsProgramDesc">Loskomen van perfecte zinnen. Werken in snelle fragmenten.</div>
              </div>
            </div>
          </div>

          <div className="wsDivider" />

          <div className="wsSection">
            <h3 className="wsSectionTitle">Wat je gaat ervaren</h3>
            <div className="wsExperienceGrid">
              <div className="wsExpItem">
                <div className="wsExpIcon" aria-hidden="true">
                  ⚡
                </div>
                <div className="wsExpContent">
                  <div className="wsExpTitle">Snel proberen</div>
                  <div className="wsExpDesc">Je kunt snel veel pogingen doen.</div>
                </div>
              </div>
              <div className="wsExpItem">
                <div className="wsExpIcon" aria-hidden="true">
                  ◉
                </div>
                <div className="wsExpContent">
                  <div className="wsExpTitle">Meer mogelijkheden</div>
                  <div className="wsExpDesc">Je ontdekt meer dan je vooraf dacht.</div>
                </div>
              </div>
              <div className="wsExpItem">
                <div className="wsExpIcon" aria-hidden="true">
                  ↗
                </div>
                <div className="wsExpContent">
                  <div className="wsExpTitle">Kleine aanpassingen, groot verschil</div>
                  <div className="wsExpDesc">Output verandert door aanpassingen in je input.</div>
                </div>
              </div>
              <div className="wsExpItem">
                <div className="wsExpIcon" aria-hidden="true">
                  ↻
                </div>
                <div className="wsExpContent">
                  <div className="wsExpTitle">Vaker gebruiken</div>
                  <div className="wsExpDesc">Je krijgt er plezier in en gaat AI vaker inzetten.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="wsDevelop">
            <div className="wsDevelopIcon" aria-hidden="true">
              ⬤
            </div>
            <div className="wsDevelopText">
              <div className="wsDevelopTitle">Wat je ontwikkelt</div>
              <div className="wsDevelopDesc">Een basisvaardigheid die je werk direct sterker maakt:</div>
              <div className="wsDevelopHighlight">snel denken door te itereren met AI.</div>
            </div>
          </div>

          <div className="wsFollowup">
            <div className="wsFollowupDivider" aria-hidden="true" />
            <div className="wsFollowupContent">
              <div className="wsFollowupIcon" aria-hidden="true">
                ◍
              </div>
              <div className="wsFollowupText">
                <div className="wsFollowupTitle">Vervolg (optioneel)</div>
                <div className="wsFollowupDesc">
                  Begeleiding om dit structureel toe te passen in je dagelijkse werk.
                </div>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  )
}

