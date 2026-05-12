const flowPaths = [
  {
    id: 'homeFlowPathOne',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-1.2s',
    radius: 3.4,
    d: 'M237.744 -47.5C111.077 79.1667 111.077 190 237.744 285C364.41 380 348.577 443.333 190.244 475C31.9104 506.667 126.91 570 475.244 665',
  },
  {
    id: 'homeFlowPathTwo',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-4.2s',
    radius: 3.2,
    d: 'M713.5 -47.5C840.167 79.1667 840.167 190 713.5 285C586.833 380 602.667 443.333 761 475C919.333 506.667 824.333 570 476 665',
  },
  {
    id: 'homeFlowPathThree',
    className: 'homeBgFlowPathViolet',
    dotClassName: 'homeBgFlowDotViolet',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-7.2s',
    radius: 3,
    d: 'M333.14 95L304.64 142.5L361.64 190L314.14 237.5L380.64 285L342.64 332.5L399.64 380L371.14 427.5L428.14 475L409.14 522.5L456.64 570L447.14 617.5L475.64 665',
  },
  {
    id: 'homeFlowPathFour',
    className: 'homeBgFlowPathViolet',
    dotClassName: 'homeBgFlowDotViolet',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-10.2s',
    radius: 2.9,
    d: 'M571 95L590 123.5L552 152L599.5 190L561.5 237.5L609 285L542.5 332.5L590 380L523.5 427.5L552 475L504.5 522.5L514 570L485.5 617.5L476 665',
  },
  {
    id: 'homeFlowPathChaosFive',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-2.4s',
    radius: 2.7,
    d: 'M0 47.5C285 95 95 475 456 646',
  },
  {
    id: 'homeFlowPathChaosSix',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-5.4s',
    radius: 2.7,
    d: 'M951.04 47.5C666.04 95 856.04 475 495.04 646',
  },
  {
    id: 'homeFlowPathChaosSeven',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-8.4s',
    radius: 2.6,
    d: 'M-47.6 190C379.9 237.5 189.9 570 465.4 655.5',
  },
  {
    id: 'homeFlowPathChaosEight',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-11.4s',
    radius: 2.6,
    d: 'M998.52 190C571.02 237.5 761.02 570 485.52 655.5',
  },
  {
    id: 'homeFlowPathChaosNine',
    className: 'homeBgFlowPathViolet',
    dotClassName: 'homeBgFlowDotViolet',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-3.9s',
    radius: 2.5,
    d: 'M142.8 95C332.8 47.5 237.8 380 470.55 660.25',
  },
  {
    id: 'homeFlowPathChaosTen',
    className: 'homeBgFlowPathViolet',
    dotClassName: 'homeBgFlowDotViolet',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-6.9s',
    radius: 2.5,
    d: 'M808.51 95C618.51 47.5 713.51 380 480.76 660.25',
  },
  {
    id: 'homeFlowPathChaosEleven',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-.6s',
    radius: 2.35,
    d: 'M95.2 0C380.2 285 285.2 570 475.2 665',
  },
  {
    id: 'homeFlowPathChaosTwelve',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-9.6s',
    radius: 2.35,
    d: 'M856 0C571 285 666 570 476 665',
  },
  {
    id: 'homeFlowPathChaosThirteen',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-1.8s',
    radius: 2.25,
    d: 'M0 0C475 95 -95 475 427.5 665',
  },
  {
    id: 'homeFlowPathChaosFourteen',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-10.8s',
    radius: 2.25,
    d: 'M951.1 0C476.1 95 1046.1 475 523.6 665',
  },
  {
    id: 'homeFlowPathChaosFifteen',
    className: 'homeBgFlowPathViolet',
    dotClassName: 'homeBgFlowDotViolet',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-3.3s',
    radius: 2.15,
    d: 'M237.959 0C142.959 190 427.959 427.5 465.959 655.5',
  },
  {
    id: 'homeFlowPathChaosSixteen',
    className: 'homeBgFlowPathViolet',
    dotClassName: 'homeBgFlowDotViolet',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-7.8s',
    radius: 2.15,
    d: 'M713.52 0C808.52 190 523.52 427.5 485.52 655.5',
  },
  {
    id: 'homeFlowPathChaosSeventeen',
    className: 'homeBgFlowPathViolet',
    dotClassName: 'homeBgFlowDotViolet',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-4.8s',
    radius: 2.1,
    d: 'M333.2 47.5C523.2 142.5 285.7 475 475.7 665',
  },
  {
    id: 'homeFlowPathChaosEighteen',
    className: 'homeBgFlowPathViolet',
    dotClassName: 'homeBgFlowDotViolet',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-6.3s',
    radius: 2.1,
    d: 'M618.5 47.5C428.5 142.5 666 475 476 665',
  },
  {
    id: 'homeFlowPathChaosNineteen',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-.15s',
    radius: 2,
    d: 'M190.4 142.5C380.4 285 142.9 475 285.4 570C427.9 665 456.4 617.5 473.5 663.1',
  },
  {
    id: 'homeFlowPathChaosTwenty',
    className: 'homeBgFlowPathPink',
    dotClassName: 'homeBgFlowDotPink',
    phaseClassName: 'homeBgFlowPhaseChaos',
    duration: '12s',
    delay: '-11.85s',
    radius: 2,
    d: 'M761.004 142.5C571.004 285 808.504 475 666.004 570C523.504 665 495.004 617.5 477.904 663.1',
  },
  {
    id: 'homeFlowPathFive',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '5s',
    radius: 2.4,
    d: 'M465.7 712.5L399.2 779V902.5H190.2L171.2 921.5V1187.5H95.2',
  },
  {
    id: 'homeFlowPathSix',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '5.75s',
    radius: 2.4,
    d: 'M485.52 712.5L552.02 779V902.5H761.02L780.02 921.5V1187.5H856.02',
  },
  {
    id: 'homeFlowPathSeven',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '6.5s',
    radius: 2.2,
    d: 'M475.52 665L466.02 741L447.02 760V874H380.52L361.52 893V1064H266.52L247.52 1083V1235',
  },
  {
    id: 'homeFlowPathEight',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '7.25s',
    radius: 2.2,
    d: 'M476 665L485.5 741L504.5 760V874H571L590 893V1064H685L704 1083V1235',
  },
  {
    id: 'homeFlowPathNine',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '8s',
    radius: 2.1,
    d: 'M475.7 665L466.2 779L428.2 817V950L399.7 978.5V1140L333.2 1206.5V1330',
  },
  {
    id: 'homeFlowPathTen',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '8.75s',
    radius: 2.1,
    d: 'M476 665L485.5 779L523.5 817V950L552 978.5V1140L618.5 1206.5V1330',
  },
  {
    id: 'homeFlowPathEleven',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '9.5s',
    radius: 2,
    d: 'M466 1092.5L428 1130.5V1187.5H238',
  },
  {
    id: 'homeFlowPathTwelve',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '10.25s',
    radius: 2,
    d: 'M485.52 1092.5L523.52 1130.5V1187.5H713.52',
  },
  {
    id: 'homeFlowPathStructureThirteen',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '5.35s',
    radius: 1.9,
    d: 'M475.24 665L470.49 693.5L437.24 726.75H332.74L313.74 745.75V855H237.74L218.74 874V1045H114.24',
  },
  {
    id: 'homeFlowPathStructureFourteen',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '6.15s',
    radius: 1.9,
    d: 'M476 665L480.75 693.5L514 726.75H618.5L637.5 745.75V855H713.5L732.5 874V1045H837',
  },
  {
    id: 'homeFlowPathStructureFifteen',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '6.95s',
    radius: 1.85,
    d: 'M437.4 726.75V807.5H361.4L342.4 826.5V969H209.4L190.4 988V1092.5',
  },
  {
    id: 'homeFlowPathStructureSixteen',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '7.7s',
    radius: 1.85,
    d: 'M514.08 726.75V807.5H590.08L609.08 826.5V969H742.08L761.08 988V1092.5',
  },
  {
    id: 'homeFlowPathStructureSeventeen',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '8.45s',
    radius: 1.8,
    d: 'M446.86 874V1026H332.86L313.86 1045V1159H171.36',
  },
  {
    id: 'homeFlowPathStructureEighteen',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '9.2s',
    radius: 1.8,
    d: 'M504.56 874V1026H618.56L637.56 1045V1159H780.06',
  },
  {
    id: 'homeFlowPathStructureNineteen',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '9.95s',
    radius: 1.75,
    d: 'M475.6 665L468 997.5L437.6 1027.9V1216L380.6 1273H285.6',
  },
  {
    id: 'homeFlowPathStructureTwenty',
    className: 'homeBgFlowPathCyan',
    dotClassName: 'homeBgFlowDotCyan',
    phaseClassName: 'homeBgFlowPhaseStructure',
    duration: '12s',
    delay: '10.7s',
    radius: 1.75,
    d: 'M476 665L483.6 997.5L514 1027.9V1216L571 1273H666',
  },
]

const VERTICAL_BACKGROUND_SRC = '/achtergrond-verticaal-minder-chaos.svg'

export default function HomeBackground({ scene = 'full' }) {
  const isRebuild = scene === 'rebuild'

  if (isRebuild) {
    return (
      <div className="homeBackgroundStack homeBackgroundStack--rebuild" aria-hidden="true">
        <div className="homeBgBase" />
        <div className="homeBgGlow" />
        <img
          className="homeBgVerticalArt"
          src={VERTICAL_BACKGROUND_SRC}
          alt=""
          width={952}
          height={1330}
          decoding="async"
          draggable={false}
        />
      </div>
    )
  }

  const preserveAspectRatio = 'xMidYMin meet'

  const particlePaths = [
    'homeFlowPathOne',
    'homeFlowPathTwo',
    'homeFlowPathFive',
    'homeFlowPathSix',
    'homeFlowPathStructureTwenty',
  ]

  const particleSet = flowPaths.filter((path) => particlePaths.includes(path.id))

  return (
    <div className="homeBackgroundStack" aria-hidden="true">
      <div className="homeBgBase" />
      <div className="homeBgGlow" />
      <svg className="homeBgFlowOverlay" viewBox="0 0 952 1330" preserveAspectRatio={preserveAspectRatio}>
        <defs>
          <filter id="homeFlowGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="4.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle className="homeBgFlowCore" cx="476" cy="665" r="6" filter="url(#homeFlowGlow)" />

        {flowPaths.map((path) => (
          <path
            id={path.id}
            key={`${path.id}-guide`}
            className={`homeBgFlowGuide ${path.className}`}
            pathLength="1000"
            d={path.d}
          />
        ))}

        {flowPaths.map((path, index) => (
          <path
            key={`${path.id}-pulse`}
            className={`homeBgFlowPulse homeBgFlowPulse${index + 1} ${path.phaseClassName} ${path.className}`}
            pathLength="1000"
            d={path.d}
            style={{ '--flow-duration': path.duration, '--flow-delay': path.delay }}
          />
        ))}

        {/* Only a few slow particles are visible at once (mobile-first). */}
        {particleSet.map((path, index) => (
          <circle
            key={`${path.id}-dot`}
            className={`homeBgFlowDot homeBgFlowDot${index + 1} ${path.phaseClassName} ${path.dotClassName}`}
            r={path.radius}
            filter="url(#homeFlowGlow)"
            style={{ '--flow-duration': '18s', '--flow-delay': path.delay }}
          >
            <animateMotion dur="18s" begin={path.delay} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${path.id}`} />
            </animateMotion>
          </circle>
        ))}
      </svg>
      <div className="homeBgTransformGlass" />
    </div>
  )
}
