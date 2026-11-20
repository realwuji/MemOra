// Essay plan specs, part 3: supply-side policy, firms and market structures,
// macro conflicts, trade, exchange rates, development, inequality, labour and
// finance (questions 111 to 204). Chains are read from the notes.
import { D, E, S } from './plan-refs.mjs'

const SSP = 'Supply-Side Policy'
const CEG = 'Causes and Effects of Economic Growth'
const EG = 'Economic Growth'
const RCP = 'Revenue, Costs and Profit'
const ESC = 'Economies and Diseconomies'
const BO = 'Business Objectives'
const BG = 'Business Growth'
const MC = 'Monopolistic Competition'
const OLI = 'Oligopoly'
const MON = 'Monopoly'
const CONT = 'Contestability'
const EFF = 'Efficiency'
const MSP = 'Monopsony'
const WD = 'Wage Determination'
const LMI = 'Labour Market Issues'
const GIE = 'Government Intervention and Equity'
const GIM = 'Government Intervention in Markets'
const GF = 'Government Failure'
const PI = 'Poverty and Inequality'
const MSD = 'Measures and Strategies'
const FIG = 'Factors Influencing Growth'
const RFM = 'Role of Financial Markets'
const CBFR = 'Central Banks'
const TMF = 'Types of Market Failure'
const MO = 'Macroeconomic Objectives'
const CON = 'Conflicts Between'
const BOP1 = 'The Balance of Payments'
const BOP2 = 'Balance of Payments'
const EXR = 'Exchange Rates'
const IC = 'International Competitiveness'
const IT = 'International Trade'
const TOT = 'Terms of Trade'
const AS = 'Aggregate Supply'
const CAD = 'Components of Aggregate Demand'
const CSI = 'Consumption, Savings and Investment'
const CIR = 'The Circular Flow'
const FP = 'Fiscal Policy'
const ND = 'The National Debt'
const PET = 'Public Expenditure and Taxation'
const MP = 'Monetary Policy'
const MPGC = 'Macroeconomic Policies in a Global Context'
const EMP = 'Employment and Unemployment'
const DEM = 'Demand'
const SUP = 'Supply and Elasticity of Supply'
const PED = 'Price, Income and Cross Elasticities'
const EXT = 'Externalities'

const education = D(SSP, 'Education and training', { t: 'Education and training', d: [188] })
const infrastructure = D(SSP, 'Infrastructure', { t: 'Infrastructure', d: [188] })
const taxReform = D(SSP, 'Tax and benefit reform', { t: 'Tax and benefit reform' })
const privatisation = D(SSP, 'Privatisation and deregulation', { t: 'Privatisation and deregulation' })
const rd = D(SSP, 'Subsidies, R&D and affordable housing', { t: 'Subsidies, R&D and affordable housing' })
const educationLimits = E(SSP, 'Education and training', { t: 'Why training may not work' })
const infraLimits = E(SSP, 'Infrastructure', { t: 'Why infrastructure may not raise growth' })
const taxLimits = E(SSP, 'Tax and benefit reform', { t: 'Why tax reform may not work' })
const drawbacks = S(SSP, 'More on the drawbacks of supply-side polic', { t: 'More on the drawbacks of supply-side policy' })
const sticky = D(OLI, 'Why prices are sticky', { t: 'Why prices are sticky: the kinked demand curve', d: [158] })
const collusion = D(OLI, 'When is collusion likely to succeed?', { t: 'When collusion is likely to succeed' })
const cartels = D(OLI, 'Why cartels are unstable', { t: 'Why cartels are unstable' })
const natMon = S(MON, 'Natural monopoly', { t: 'Natural monopoly', d: [161] })
const monOutcome = D(MON, 'The monopoly outcome', { t: 'The monopoly outcome', d: [140] })
const monEffects = D(MON, 'Conditions and effects', { t: 'Conditions and effects' })
const monEfficient = D(MON, 'Where one firm is genuinely the efficient outcome', { t: 'Where one firm is genuinely the efficient outcome', d: [161] })
const monBetter = D(MON, 'When a monopoly is better than perfect competition', { t: 'When a monopoly is better than perfect competition' })
const compPolicy = S(GIE, 'Competition policy', { t: 'Competition policy' })
const compPolicyLimits = E(GIE, 'Does competition policy work?', { t: 'Does competition policy work?' })
const shutdown = D(RCP, 'The short-run shutdown rule', { t: 'The short-run shutdown rule' })
const passOn = S(PED, 'PED decides who bears a rise in costs', { t: 'Can the firm pass the cost on?' })
const subst = D(PED, 'Availability of close substitutes', { t: 'Close substitutes limit price rises' })
const cadConflict = (t, c) => D(MO, c, { t })

export const SPECS_3 = {
  111: {
    cols: ['Price and non-price competition', 'Limits'],
    left: [S(MC, 'Non-price competition', { t: 'Non-price competition' }), S(OLI, 'Non-price competition', { t: 'Non-price competition in oligopoly' })],
    right: [sticky, D(MC, 'Is product differentiation good for consumers?', { t: 'Is product differentiation good for consumers?' })],
    judge: 'Retailers on the high street have many rivals and online competition, so price cuts are quickly matched; non-price competition such as service and brand is more lasting, but it costs money and consumers may not value it.',
  },
  112: {
    cols: ['Impact of migration on employment and unemployment', ''],
    left: [D(SSP, 'Immigration policy', { t: 'Immigration policy' }), S(EMP, 'Causes of unemployment', { t: 'Causes of unemployment' })],
    right: [],
  },
  113: {
    cols: ['Supply-side policies to raise growth', 'Limits'],
    left: [education, infrastructure, taxReform, privatisation],
    right: [educationLimits, infraLimits, taxLimits, drawbacks],
    judge: 'Supply-side policies raise LRAS and growth without causing inflation, but they work slowly, cost money, and their effect is uncertain. Education and infrastructure are the most durable; tax cuts have the weakest evidence.',
  },
  114: {
    cols: ['Supply-side policies to raise productivity', 'Limits'],
    left: [education, infrastructure, rd, S(SSP, 'The productivity puzzle', { t: 'The productivity puzzle' })],
    right: [educationLimits, infraLimits, E(SSP, 'Subsidies, R&D and affordable housing', { t: 'Why subsidies and R&D may not work' })],
    judge: 'Skills, infrastructure and R&D raise productivity, but benefits come slowly and the UK has had weak productivity growth despite many policies, so the effect is hard to guarantee.',
  },
  115: {
    cols: ['A reason for the trend in UK productivity', ''],
    left: [S(SSP, 'The productivity puzzle', { t: 'The productivity puzzle' })],
    right: [],
  },
  116: {
    cols: ['Effects of migration on firms', 'Limits'],
    left: [D(SSP, 'Immigration policy', { t: 'Immigration policy' }), D(AS, 'Quantity and quality of labour', { t: 'Quantity and quality of labour' })],
    right: [E(SSP, 'Immigration policy', { t: 'Why migration may not help firms' })],
    judge: 'More migration widens the labour supply, which fills shortages and keeps wages and costs down for firms that depend on it, but it may reduce the pressure to train and invest.',
  },
  117: {
    cols: ['Benefits of more infrastructure spending', 'Limits'],
    left: [infrastructure, D(CIR, 'What makes the multiplier large', { t: 'The multiplier amplifies the spending', d: [182] })],
    right: [infraLimits, S(PET, 'Crowding out and crowding in', { t: 'Crowding out and crowding in' }), D(ND, 'Why a high national debt matters', { t: 'The cost to the national debt' })],
    judge: 'Infrastructure raises AD at once and LRAS over time, so it helps growth in the short and long run, but it takes time to plan and build, costs money and adds to the debt.',
  },
  118: {
    cols: ['How better transport links raise growth', 'Limits'],
    left: [D(FIG, 'Infrastructure', { t: 'Infrastructure', d: [188] }), infrastructure],
    right: [E(FIG, 'Infrastructure', { t: 'Why infrastructure may not raise growth' }), infraLimits],
    judge: 'Better links cut transport costs, widen markets and attract investment, which raises growth, but the benefit depends on the other barriers to trade and on the cost of building and maintaining them.',
  },
  119: {
    cols: ['Diminishing marginal productivity and cabin crew', ''],
    left: [D(RCP, 'The law of diminishing marginal returns', { t: 'The law of diminishing marginal returns' })],
    right: [],
  },
  120: {
    cols: ['How interest rates control inflation', 'Why they may not work'],
    left: [D(MP, 'The interest rate channels', { t: 'The interest rate channels' }), S(MP, 'The transmission mechanism', { t: 'The transmission mechanism' })],
    right: [E(MP, 'The interest rate channels', { t: 'Why transmission may be slow and weak' }), D('Inflation', 'Cost-push inflation', { t: 'Rates cannot fix cost-push inflation' }), S(MP, 'More on evaluating monetary policy', { t: 'More on evaluating monetary policy' })],
    judge: 'Raising rates cuts AD and so demand-pull inflation, but it is slow, blunt and does nothing for cost-push inflation from energy or import prices. It is effective against demand-pull inflation and weak against supply shocks.',
  },
  121: {
    cols: ['Economies of scale', 'Diseconomies and limits'],
    left: [S(ESC, 'Internal economies of scale - RTFMPS', { t: 'Internal economies of scale' }), S(ESC, 'How much do economies of scale actually ma', { t: 'How much do economies of scale matter?' })],
    right: [S(ESC, 'Diseconomies of scale', { t: 'Diseconomies of scale' }), D(ESC, 'Why MES matters', { t: 'Why minimum efficient scale matters' })],
    judge: 'Electronics firms gain from large-scale production through technical and purchasing economies, but only up to their minimum efficient scale, beyond which diseconomies of scale can raise average costs.',
  },
  122: {
    cols: ['A reason for the rise in profit', 'Limits'],
    left: [S(RCP, 'Profit', { t: 'Profit' }), S(ESC, 'Internal economies of scale - RTFMPS', { t: 'Lower costs from economies of scale' })],
    right: [E(RCP, 'The profit-maximising rule in practice', { t: 'Why profit may not rise' })],
  },
  123: {
    cols: ['Price and non-price strategies', 'Limits'],
    left: [S(MC, 'Non-price competition', { t: 'Non-price competition' }), S(MC, 'Assumptions', { t: 'Monopolistic competition: price-making with close substitutes' })],
    right: [D(MC, 'Is product differentiation good for consumers?', { t: 'Is product differentiation good for consumers?' }), subst],
    judge: 'Starbucks competes mainly on brand, quality and experience rather than price, because close substitutes limit how far it can raise prices; strategies are costly and can be copied.',
  },
  124: {
    cols: ['Factors causing high street closures', 'Limits'],
    left: [D(SUP, 'Costs of production', { t: 'Rising costs of rent, wages and energy', d: [21] }), subst, D(DEM, 'Advertising and tastes', { t: 'Changing tastes' })],
    right: [shutdown, S(RCP, 'Fixed costs are sunk costs', { t: 'Fixed costs are sunk costs' })],
    judge: 'Rising costs, the shift to online shopping and changing tastes all reduce profit; a branch closes when revenue no longer covers variable costs (the shutdown rule), or when it cannot cover its fixed costs in the long run.',
  },
  125: {
    cols: ['The case for a subsidy', 'Limits'],
    left: [shutdown, D(GIM, 'Subsidy', { t: 'A subsidy', d: [58] })],
    right: [E(GIM, 'Subsidy', { t: 'Why a subsidy may not work' }), D(GF, 'Distortion of price signals and excessive interv', { t: 'Distortion of price signals' })],
    judge: 'A subsidy can keep a firm above its shutdown point and protect jobs, but it costs taxpayers, distorts signals and may only delay the failure of a firm that cannot cover its costs.',
  },
  126: {
    cols: ['How investment in technology raises profit', 'Limits'],
    left: [D(AS, 'Technology and innovation', { t: 'Technology and innovation', d: [188] }), D(CSI, 'The determinants of investment', { t: 'The determinants of investment' })],
    right: [E(AS, 'Technology and innovation', { t: 'Why technology may not raise profit' }), D(RCP, 'Is labour a fixed or a variable cost?', { t: 'Is labour a fixed or variable cost?' })],
    judge: 'New technology lowers costs and raises productivity, which raises profit if demand holds, but it takes time to pay back and may cost jobs; its effect depends on the price and on how fast rivals copy it.',
  },
  127: {
    cols: ['Effects of rising costs on profit', 'What firms can do'],
    left: [S(RCP, 'Costs in the short run', { t: 'Costs in the short run' }), D(AS, 'Costs of raw materials and energy', { t: 'Costs of production rise' })],
    right: [passOn, subst],
    judge: 'Rising costs cut profit unless coffee shops can raise prices. With many close substitutes, demand is elastic, so they can pass on little and profit falls.',
  },
  128: {
    cols: ['Micro effects of rising energy bills', 'What hotels can do'],
    left: [D(AS, 'Costs of raw materials and energy', { t: 'Costs of production rise' }), S(RCP, 'Costs in the short run', { t: 'Costs in the short run' })],
    right: [passOn, subst, shutdown],
    judge: 'Energy bills raise hotels\' costs and cut profit; whether they can pass the rise on depends on elasticity, and some hotels may have to close if revenue falls below variable costs.',
  },
  129: {
    cols: ['Why the short-run Phillips curve is useful', ''],
    left: [S(CON, 'Inflation against unemployment: the Phillips curve', { t: 'Inflation against unemployment' }), S(CON, 'How useful is the Phillips curve to policy', { t: 'How useful is the Phillips curve to policy' })],
    right: [],
  },
  130: {
    cols: ['Conflicts between growth and other objectives', 'Limits and resolution'],
    left: [cadConflict('Growth against inflation', 'Growth vs inflation'), cadConflict('Growth against the current account', 'Growth vs the current account'), cadConflict('Growth against the environment', 'Growth vs the environment'), cadConflict('Growth against equality', 'Growth vs equality')],
    right: [D(CON, 'Why supply-side policy is the resolution', { t: 'Supply-side policy as the resolution' }), S(CON, 'The other conflicts', { t: 'The other conflicts' })],
    judge: 'Growth driven by demand tends to conflict with inflation and the current account in the short run, and with the environment and equality in the long run; supply-side growth reduces some conflicts but not those with the environment.',
  },
  131: {
    cols: ['Conflicts when a central bank controls inflation', 'Limits'],
    left: [cadConflict('Unemployment against inflation', 'Unemployment vs inflation'), cadConflict('Growth against inflation', 'Growth vs inflation'), S(CON, 'Inflation against unemployment: the Phillips curve', { t: 'The Phillips curve' })],
    right: [D(CON, 'Why the short-run curve has flattened', { t: 'Why the short-run curve has flattened' }), D(CON, 'The long-run Phillips curve is vertical', { t: 'The long-run Phillips curve is vertical' })],
    judge: 'Raising interest rates to control inflation reduces AD, so growth slows and unemployment can rise in the short run; in the long run the Phillips curve is vertical, so the cost is temporary.',
  },
  132: {
    cols: ['Trade-offs between the environment and other objectives', 'Limits and resolution'],
    left: [S(CON, 'Environmental protection against the other', { t: 'Environmental protection against the other objectives' }), cadConflict('Growth against the environment', 'Growth vs the environment'), D(CEG, 'Costs of growth', { t: 'Costs of growth' })],
    right: [S(CEG, 'The environmental Kuznets curve', { t: 'The environmental Kuznets curve' }), D(CON, 'Why supply-side policy is the resolution', { t: 'Supply-side policy as the resolution' })],
    judge: 'Protecting the environment can cost growth and jobs in the short run, but over time clean technology and higher incomes can reduce the conflict, as the environmental Kuznets curve suggests.',
  },
  133: {
    cols: ['Why a deficit is significant', 'Why it may not be'],
    left: [S(BOP2, 'Consequences of a persistent deficit', { t: 'Consequences of a persistent deficit' }), D(BOP2, 'Poor international competitiveness', { t: 'Poor international competitiveness' }), S(BOP1, 'Financing a deficit and its risks', { t: 'Financing a deficit and its risks' })],
    right: [S(BOP2, 'Is a deficit necessarily a problem?', { t: 'Is a deficit necessarily a problem?' }), S(BOP2, 'Can a current account deficit be a good th', { t: 'Can a deficit be a good thing?' })],
    judge: 'A persistent deficit must be financed by borrowing or selling assets, which raises debt and exposes the economy to a loss of confidence, but a deficit from investment in a growing economy is much less worrying.',
  },
  134: {
    cols: ['Benefits to consumers of integration', 'Limits'],
    left: [S(BG, 'External (inorganic) growth', { t: 'External growth' }), S(ESC, 'Internal economies of scale - RTFMPS', { t: 'Economies of scale' })],
    right: [D(BG, 'Does external growth work?', { t: 'Does external growth work?' })],
  },
  135: {
    cols: ['The principal-agent problem', 'Limits'],
    left: [S(BO, 'The principal–agent problem', { t: 'The principal-agent problem' })],
    right: [E(BO, 'Consequences', { t: 'Why it may not be the main cause' })],
    judge: 'The principal-agent problem arises when managers act in their own interests rather than shareholders\'; it is a plausible cause of failure, but other causes such as costs, debt and demand are likely to have mattered more.',
  },
  136: {
    cols: ['Profit maximisation is assumed', 'Why other objectives may matter'],
    left: [S(BO, 'Which firms actually profit maximise', { t: 'Which firms actually maximise profit' })],
    right: [S(BO, 'Criticisms of profit maximisation as a mod', { t: 'Criticisms of profit maximisation' }), S(BO, 'How other objectives can still lead to pro', { t: 'How other objectives can still lead to profit' })],
    judge: 'Profit maximisation is the standard assumption because it makes predictions simple, but managers, owners and other stakeholders often pursue other goals, so it is a useful assumption but not a universal one.',
  },
  137: {
    cols: ['Effects of integration', 'Limits'],
    left: [S(BG, 'The four types of integration, with worked', { t: 'The four types of integration' }), D(BG, 'Does external growth work?', { t: 'Does external growth work?' })],
    right: [S(ESC, 'Diseconomies of scale', { t: 'Diseconomies of scale' }), S(MON, 'A scorecard for monopoly', { t: 'A scorecard for monopoly' })],
    judge: 'Integration can give firms scale, lower costs and market power, but the benefits to consumers depend on whether savings are passed on and on competition authorities\' response.',
  },
  138: {
    cols: ['Why high street retailers stay small', 'Limits'],
    left: [D(BG, 'Why do small firms grow organically', { t: 'Why small firms stay small' }), S(BG, 'Why some firms stay small', { t: 'Why some firms stay small' })],
    right: [S(BG, 'Regulation as a constraint on growth', { t: 'Regulation as a constraint on growth' }), D(ESC, 'Why MES matters', { t: 'Why minimum efficient scale matters' })],
  },
  139: {
    cols: ['Concerns of the competition authorities', 'Limits'],
    left: [compPolicy, monEffects, S(BG, 'External (inorganic) growth', { t: 'External growth' })],
    right: [compPolicyLimits, monEfficient],
    judge: 'The authorities worry that a merger could create market power, raise prices and reduce choice; against that, a merger can give economies of scale that benefit consumers, so they weigh the two.',
  },
  140: {
    cols: ['Constraints on growth for energy suppliers', 'Limits'],
    left: [S(BG, 'Regulation as a constraint on growth', { t: 'Regulation as a constraint on growth' }), D(ESC, 'Why MES matters', { t: 'Why minimum efficient scale matters' })],
    right: [D(BG, 'Does external growth work?', { t: 'Does external growth work?' }), D(BG, 'Organic growth: is it the better route?', { t: 'Organic growth: is it the better route?' })],
    judge: 'Regulation of prices and competition rules limit how large energy suppliers can grow by merger, and diseconomies of scale limit growth from within.',
  },
  141: {
    cols: ['Problems for expansion of the chocolate industry in Ghana', ''],
    left: [D(FIG, 'Primary product dependency', { t: 'Primary product dependency' }), D(FIG, 'Access to credit and banking', { t: 'Access to credit and banking' }), D(FIG, 'Infrastructure', { t: 'Infrastructure' })],
    right: [],
  },
  142: {
    cols: ['Effects of investment in dams on rice farmers\' profit', 'Limits'],
    left: [infrastructure, D(SUP, 'Weather, shocks and expectations', { t: 'Weather and shocks: dams reduce the risk', d: [21] })],
    right: [infraLimits],
  },
  143: {
    cols: ['Policies to reduce a current account deficit', 'Limits'],
    left: [S(BOP2, 'Policies to correct a deficit', { t: 'Policies to correct a deficit' }), S(EXR, 'Effects of a depreciation', { t: 'Depreciation' }), D(IC, 'Policies to raise competitiveness', { t: 'Policies to raise competitiveness' })],
    right: [S(BOP1, 'The J-curve effect', { t: 'The J-curve effect' }), S(BOP1, 'The Marshall-Lerner condition', { t: 'The Marshall-Lerner condition' }), E(IC, 'Policies to raise competitiveness', { t: 'Why competitiveness policy is slow' })],
    judge: 'Expenditure-switching (depreciation) and expenditure-reducing policies can reduce a deficit, but a depreciation works only if the Marshall-Lerner condition holds and takes time; supply-side policy is slower but more lasting.',
  },
  144: {
    cols: ['Why Jet2 may have raised prices', 'Limits'],
    left: [D(SUP, 'Costs of production', { t: 'Costs of fuel and wages rise', d: [21] }), S(PED, 'PED and total revenue - why firms care', { t: 'PED and total revenue' })],
    right: [subst, D(PED, 'Nature of the product', { t: 'The nature of the product' }), passOn],
    judge: 'Jet2 can raise prices profitably if demand is inelastic, because revenue rises; if demand is elastic, a price rise would cut revenue, so the decision depends on competition and how much customers value the holiday.',
  },
  145: {
    cols: ['Policies to raise the employment rate', 'Limits'],
    left: [D(SSP, 'Young people not in education, employment or training', { t: 'Young people not in education, employment or training' }), education, taxReform, D(SSP, 'Are childcare subsidies enough to bring parents', { t: 'Childcare subsidies' })],
    right: [educationLimits, taxLimits, D(EMP, 'Structural unemployment', { t: 'Structural unemployment takes time to fix' })],
    judge: 'Policies that raise skills, make work pay and help parents back into work raise the employment rate, but they are slow and costly, and they work only if there are jobs for those who gain skills.',
  },
  146: {
    cols: ['Why the long-term trend rate of growth might be lower', 'Limits'],
    left: [D(CEG, 'A decline in long-run growth: exogenous supply-s', { t: 'A decline in long-run growth' }), S(SSP, 'The productivity puzzle', { t: 'The productivity puzzle' }), D(EG, 'Long-run (potential) growth: LRAS', { t: 'Long-run (potential) growth: LRAS' })],
    right: [E(EG, 'Long-run (potential) growth: LRAS', { t: 'Why the trend rate is uncertain' })],
    judge: 'A lower trend rate reflects slower growth in productivity and in the labour force; forecasts are uncertain because potential output cannot be observed directly.',
  },
  147: {
    cols: ['Effects of reducing the budget deficit', 'Limits'],
    left: [S(ND, 'Measures to reduce a deficit', { t: 'Measures to reduce a deficit' }), D(MPGC, 'Austerity and its effects', { t: 'Austerity and its effects' }), D(FP, 'Discretionary fiscal policy', { t: 'Discretionary fiscal policy' })],
    right: [E(MPGC, 'Austerity and its effects', { t: 'Why austerity may reduce growth' }), D(ND, 'Why a high national debt matters', { t: 'The cost of a high debt' }), S(FP, 'Evaluating fiscal policy', { t: 'Evaluating fiscal policy' })],
    judge: 'Cutting the deficit lowers debt and may raise confidence, but it reduces AD, so growth and jobs suffer in the short run, especially with spare capacity; the gain is larger when debt is high and growth strong.',
  },
  149: {
    cols: ['Conflicts from expansionary policy', 'Limits'],
    left: [cadConflict('Growth against inflation', 'Growth vs inflation'), cadConflict('Growth against the current account', 'Growth vs the current account'), cadConflict('The budget against everything else', 'Fiscal balance vs everything else'), S(CON, 'Inflation against unemployment: the Phillips curve', { t: 'The Phillips curve' })],
    right: [D(CON, 'Why the short-run curve has flattened', { t: 'Why the short-run curve has flattened' }), D(CON, 'The long-run Phillips curve is vertical', { t: 'The long-run Phillips curve is vertical' })],
    judge: 'Expansionary policy raises growth and cuts unemployment but risks inflation, a wider deficit and a current account deficit; the conflict is greatest near full capacity and small when there is spare capacity.',
  },
  150: {
    cols: ['How far the MPC succeeded 2008 to 2019', 'Limits'],
    left: [S(MO, 'Reading the UK\'s macro record', { t: 'The UK\'s macro record' }), S(MP, 'Evaluating monetary policy', { t: 'Evaluating monetary policy' }), D(MP, 'QE The central bank', { t: 'Quantitative easing' })],
    right: [E(MP, 'QE The central bank', { t: 'Limits of quantitative easing' }), S(MP, 'More on evaluating monetary policy', { t: 'More on evaluating monetary policy' }), D(CBFR, 'Why central bank independence matters', { t: 'Why central bank independence matters' })],
    judge: 'The MPC avoided deflation and prevented a deeper recession with low rates and QE, but growth and productivity were weak and QE widened wealth inequality, so success against the inflation objective was greater than against the others.',
  },
  159: {
    cols: ['The case that rail is a natural monopoly', 'The case that it is not'],
    left: [natMon, monEfficient],
    right: [S(MON, 'Natural monopoly: regulation, subsidy and', { t: 'Regulation, subsidy and nationalisation' }), D(MON, 'The cost of subsidy and nationalisation', { t: 'The cost of subsidy and nationalisation' })],
    judge: 'Rail has very high fixed costs for track and signals, so one network is cheaper than several, which is a natural monopoly; but train operators can compete on the track, so it is only the infrastructure that is a natural monopoly.',
  },
  161: {
    cols: ['Benefits of price discrimination to passengers', 'Limits'],
    left: [S(MON, 'Price discrimination', { t: 'Price discrimination', d: [157] }), S(MON, 'Perfect price discrimination, worked', { t: 'Perfect price discrimination, worked' })],
    right: [monEffects],
    judge: 'Off-peak and advance fares lower prices for those who can be flexible, and more people travel, but peak passengers pay more, so the benefit depends on who can switch.',
  },
  162: {
    cols: ['How price discrimination affects profit', 'Limits'],
    left: [S(MON, 'Price discrimination', { t: 'Price discrimination', d: [157] }), S(MON, 'Perfect price discrimination, worked', { t: 'Perfect price discrimination, worked' })],
    right: [monEffects, S(MON, 'The assumptions of the monopoly model', { t: 'The assumptions of the monopoly model' })],
    judge: 'Charging different prices to groups with different elasticities captures more consumer surplus as profit, but it needs market power, separate markets and no resale, so the gain is limited.',
  },
  164: {
    cols: ['Policies Nigeria could use', 'Limits'],
    left: [D(IC, 'Policies to raise competitiveness', { t: 'Policies to raise competitiveness' }), rd],
    right: [D(IT, 'Arguments FOR protectionism', { t: 'Arguments for protection' }), E(IC, 'Policies to raise competitiveness', { t: 'Why competitiveness policy is slow' })],
    judge: 'Raising competitiveness through investment and subsidies helps manufacturers over time; protection is faster but raises prices and risks retaliation, so the best policy depends on how quickly the industry can become competitive.',
  },
  166: {
    cols: ['Why a monopoly may be inefficient', 'Why it may operate efficiently'],
    left: [monOutcome, S(EFF, 'Efficiency by market structure', { t: 'Efficiency by market structure' }), D(EFF, 'Monopoly and efficiency - the standard case against', { t: 'Monopoly and efficiency: the standard case against' })],
    right: [monEfficient, monBetter, S(MON, 'A scorecard for monopoly', { t: 'A scorecard for monopoly' })],
    judge: 'A monopoly is allocatively inefficient because it sets price above marginal cost, and may be X-inefficient; but where economies of scale are large, or it faces a contestable market, it can be more efficient than competition.',
  },
  167: {
    cols: ['The role of forward markets in currencies', ''],
    left: [S(EXR, 'Speculation, shorting and hedging', { t: 'Speculation, shorting and hedging' })],
    right: [],
  },
  168: {
    cols: ['Effects of a change in sterling on the UK economy', 'Limits'],
    left: [S(EXR, 'Effects of a depreciation', { t: 'Effects of a depreciation' }), D(CAD, 'The exchange rate', { t: 'Net exports raise AD' })],
    right: [E(CAD, 'The exchange rate', { t: 'Why AD may not rise much' }), S(BOP1, 'The J-curve effect', { t: 'The J-curve effect' })],
    judge: 'A fall in sterling makes exports cheaper and imports dearer, raising AD and growth but also import prices; a rise has the opposite effect, so the net effect depends on elasticities and time.',
  },
  169: {
    cols: ['How a central bank intervenes in the currency market', ''],
    left: [S(EXR, 'Fixed rates: why intervene and how', { t: 'Why and how to intervene' }), D(EXR, 'Defending a peg', { t: 'Defending a peg' })],
    right: [],
  },
  170: {
    cols: ['Why a government may avoid a large fall in the currency', 'Limits'],
    left: [S(EXR, 'Effects of a depreciation', { t: 'Effects of a depreciation' }), D(AS, 'Exchange rates', { t: 'Imported inputs cost more' })],
    right: [S(BOP1, 'The J-curve effect', { t: 'The J-curve effect' })],
  },
  172: {
    cols: ['Reasons the market may be contestable', 'Reasons it may not be'],
    left: [S(CONT, 'Conditions for contestability', { t: 'Conditions for contestability' }), S(CONT, 'Sunk costs are the key variable', { t: 'Sunk costs are the key variable' })],
    right: [D(CONT, 'Barriers to entry that reduce contestability', { t: 'Barriers to entry that reduce contestability' }), D(CONT, 'Limit pricing', { t: 'Limit pricing' }), D(CONT, 'Predatory pricing', { t: 'Predatory pricing' })],
    judge: 'A coffee shop market has low sunk costs and low barriers to entry for small independents, which makes it contestable, though the big chains\' brand and prime locations are barriers.',
  },
  173: {
    cols: ['Reasons the industry may be contestable', 'Reasons it may not be'],
    left: [S(CONT, 'Conditions for contestability', { t: 'Conditions for contestability' }), S(CONT, 'Sunk costs are the key variable', { t: 'Sunk costs are the key variable' }), S(CONT, 'Why contestability matters', { t: 'Why contestability matters' })],
    right: [D(CONT, 'Barriers to entry that reduce contestability', { t: 'Barriers to entry that reduce contestability' }), S(CONT, 'How incumbents deter entry', { t: 'How incumbents deter entry' }), D(CONT, 'Limit pricing', { t: 'Limit pricing' })],
    judge: 'An industry is contestable when entry and exit are cheap, so incumbents behave competitively; brand loyalty, scale and sunk costs make real markets less contestable than the theory assumes.',
  },
  174: {
    cols: ['Two factors that explain different rates of poverty decline', ''],
    left: [D(FIG, 'Savings gap and the Harrod-Domar model', { t: 'The savings gap' }), D(FIG, 'Education and skills', { t: 'Education and skills' })],
    right: [],
  },
  175: {
    cols: ['Two causes of income inequality in the UK', ''],
    left: [D(PI, 'Causes of inequality', { t: 'Causes of inequality' }), D(TMF, 'Is inequality a market failure?', { t: 'Is inequality a market failure?' })],
    right: [],
  },
  176: {
    cols: ['Causes of income and wealth inequality in Brazil', 'Limits'],
    left: [D(PI, 'Causes of inequality', { t: 'Causes of inequality' }), D(FIG, 'Education and skills', { t: 'Education and skills' }), D(FIG, 'Access to credit and banking', { t: 'Access to credit and banking' })],
    right: [D(PI, 'Does inequality rise then fall with development?', { t: 'Does inequality rise then fall with development?' }), D(PI, 'Policies to reduce inequality', { t: 'Policies to reduce inequality' })],
    judge: 'Inequality comes from differences in education, wealth and access to credit, and often rises in the early stages of development before it falls, as the Kuznets curve suggests.',
  },
  177: {
    cols: ['Two causes of income inequality in the UK', ''],
    left: [D(PI, 'Causes of inequality', { t: 'Causes of inequality' }), D(TMF, 'Is inequality a market failure?', { t: 'Is inequality a market failure?' })],
    right: [],
  },
  178: {
    cols: ['Effects on firms of cutting prices in oligopoly', 'Limits'],
    left: [sticky, S(OLI, 'The kinked demand curve', { t: 'The kinked demand curve' }), S(OLI, 'Game theory and the prisoner’s dilemma', { t: 'Game theory and the prisoner\'s dilemma' })],
    right: [S(OLI, 'Predatory pricing among oligopolists', { t: 'Predatory pricing among oligopolists' }), D(CONT, 'Predatory pricing', { t: 'Predatory pricing' })],
    judge: 'A firm cutting its price in oligopoly is likely to be matched by rivals, so it gains little and all lose revenue, which is why prices are sticky and firms prefer non-price competition.',
  },
  179: {
    cols: ['Why some inequality may be desirable', 'Why large inequality is harmful'],
    left: [D(TMF, 'Is inequality a market failure?', { t: 'Is inequality a market failure?' })],
    right: [D(PI, 'Redistribution through tax and benefits', { t: 'Redistribution through tax and benefits' }), D(PI, 'Policies to reduce inequality', { t: 'Policies to reduce inequality' })],
    judge: 'Some inequality rewards effort and risk-taking, and so maintains incentives, but large inequality reduces opportunity and spending power, so most economists favour limited redistribution.',
  },
  180: {
    cols: ['Why high market share may not be in the consumer interest', 'Why it may be'],
    left: [monOutcome, monEffects],
    right: [monEfficient, monBetter, compPolicy, compPolicyLimits],
    judge: 'A high share gives market power to raise prices and reduce choice, but if it reflects economies of scale and the firm passes on savings, consumers can benefit; competition policy exists to tell the two apart.',
  },
  181: {
    cols: ['Why firms collude', 'Why collusion is unstable'],
    left: [collusion, S(OLI, 'Collusion', { t: 'Collusion' }), S(OLI, 'Game theory and the prisoner’s dilemma', { t: 'Game theory and the prisoner\'s dilemma' })],
    right: [cartels, compPolicy],
    judge: 'Firms collude to raise prices and profit and to reduce uncertainty, but each has an incentive to cheat, and competition law makes it illegal, so collusion is more likely where there are few firms and high barriers to entry.',
  },
  182: {
    cols: ['Consequences of higher market concentration', 'Limits'],
    left: [S(OLI, 'Calculating a concentration ratio', { t: 'The concentration ratio' }), S(OLI, 'Characteristics', { t: 'Characteristics of oligopoly' }), S(OLI, 'Non-price competition', { t: 'Non-price competition' })],
    right: [sticky, D(CONT, 'It changes the whole competition policy conclusion', { t: 'Contestability changes the conclusion' }), S(OLI, 'Evaluating oligopoly', { t: 'Evaluating oligopoly' })],
    judge: 'Higher concentration makes firms interdependent, so they avoid price competition and may collude; but if the market is contestable, the threat of entry limits what they can do.',
  },
  183: {
    cols: ['Two reasons most firms are small, apart from finance', ''],
    left: [D(BG, 'Why do small firms grow organically', { t: 'Why small firms stay small' }), D(ESC, 'Why MES matters', { t: 'The minimum efficient scale is small' })],
    right: [],
  },
  184: {
    cols: ['Problems of depending on cocoa', 'Limits'],
    left: [D(FIG, 'Primary product dependency', { t: 'Primary product dependency' }), S(TOT, 'The Prebisch-Singer hypothesis', { t: 'The Prebisch-Singer hypothesis' }), D(SUP, 'Weather, shocks and expectations', { t: 'Weather and shocks to supply', d: [21] })],
    right: [D(TOT, 'Why the hypothesis may not hold', { t: 'Why the hypothesis may not hold' })],
    judge: 'Dependence on one primary export exposes the Ivory Coast to price swings and falling terms of trade, so incomes and revenue are unstable; diversification into higher-value goods reduces the risk.',
  },
  185: {
    cols: ['Two demographic factors influencing development in Kenya', ''],
    left: [D(FIG, 'Demographic factors', { t: 'Demographic factors' }), D(FIG, 'Education and skills', { t: 'Education and skills' })],
    right: [],
  },
  186: {
    cols: ['How borrowers may benefit from microfinance', 'Limits'],
    left: [D(FIG, 'Access to credit and banking', { t: 'Access to credit and banking' })],
    right: [E(FIG, 'Access to credit and banking', { t: 'Why microfinance may not help' })],
    judge: 'Microfinance gives poor borrowers access to credit they could not otherwise get, which can fund small businesses, but high interest rates and over-borrowing can leave some worse off.',
  },
  187: {
    cols: ['Policies other than tariffs to develop manufacturing', 'Limits'],
    left: [rd, D(FIG, 'Education and skills', { t: 'Education and skills' }), D(FIG, 'Infrastructure', { t: 'Infrastructure' }), D(MSD, 'Foreign direct investment', { t: 'Foreign direct investment' })],
    right: [E(MSD, 'Foreign direct investment', { t: 'Limits of foreign direct investment' }), E(FIG, 'Infrastructure', { t: 'Why infrastructure may not help' })],
    judge: 'Investment in skills and infrastructure and attracting FDI build a manufacturing base without the costs of tariffs, but they take time and depend on political stability and the right incentives.',
  },
  188: {
    cols: ['Market-oriented strategies for Angola', 'Limits'],
    left: [S(MSD, 'Market-led against interventionist', { t: 'Market-led against interventionist' }), privatisation, D(MSD, 'Foreign direct investment', { t: 'Foreign direct investment' })],
    right: [D(MSD, 'Which approach works?', { t: 'Which approach works?' }), E(MSD, 'Foreign direct investment', { t: 'Limits of foreign direct investment' })],
    judge: 'Market strategies such as privatisation, FDI and free trade can raise efficiency and growth, but where institutions are weak and markets fail, they may widen inequality, so a mix is usually more effective.',
  },
  189: {
    cols: ['Factors influencing the supply of labour', 'Limits'],
    left: [S(WD, 'Determinants of labour SUPPLY', { t: 'Determinants of labour supply' }), D(WD, 'The wage rate and net advantages', { t: 'The wage rate and net advantages' }), D(WD, 'Qualifications, training and barriers to entry', { t: 'Qualifications, training and barriers to entry' }), D(WD, 'Labour mobility', { t: 'Labour mobility' })],
    right: [S(WD, 'Elasticity of labour demand and supply', { t: 'Elasticity of labour demand and supply' })],
    judge: 'The supply of labour to an occupation rises with the wage, but qualifications, training and mobility mean it is inelastic in the short run, especially for skilled jobs.',
  },
  190: {
    cols: ['Two factors influencing the supply of labour in electronics', ''],
    left: [D(WD, 'Qualifications, training and barriers to entry', { t: 'Qualifications, training and barriers to entry' }), D(WD, 'The wage rate and net advantages', { t: 'The wage rate and net advantages' })],
    right: [],
  },
  191: {
    cols: ['Benefits of aid to Indonesia', 'Limits'],
    left: [D(MSD, 'Aid', { t: 'Aid' }), D(FIG, 'Savings gap and the Harrod-Domar model', { t: 'The savings gap' })],
    right: [E(MSD, 'Aid', { t: 'Why aid may not work' })],
    judge: 'Aid can fill the savings gap and fund infrastructure, health and education, which raise growth; its benefits depend on how well it is used and on dependency and corruption.',
  },
  192: {
    cols: ['How a Fairtrade scheme affects farming communities', ''],
    left: [D(GIM, 'Minimum price (price floor)', { t: 'A minimum price', d: [52] }), D(GIM, 'Buffer stock scheme', { t: 'A buffer stock scheme' })],
    right: [],
  },
  193: {
    cols: ['Impact of a change in aid on the Rwandan economy', 'Limits'],
    left: [D(MSD, 'Aid', { t: 'Aid' }), D(FIG, 'Savings gap and the Harrod-Domar model', { t: 'The savings gap' })],
    right: [E(MSD, 'Aid', { t: 'Why aid may not work' })],
    judge: 'A fall in aid reduces funds for investment and public services, which slows growth, especially if the country depends on it; a rise has the opposite effect, subject to how effectively it is used.',
  },
  194: {
    cols: ['Two benefits of debt relief to Angola', ''],
    left: [D(FIG, 'Debt', { t: 'Debt' })],
    right: [],
  },
  195: {
    cols: ['Role of the financial sector in growth and development', 'Risks'],
    left: [S(RFM, 'The role of financial markets', { t: 'The role of financial markets' }), D(FIG, 'Access to credit and banking', { t: 'Access to credit and banking' }), D(FIG, 'Savings gap and the Harrod-Domar model', { t: 'The savings gap' })],
    right: [S(RFM, 'Market failure in financial markets', { t: 'Market failure in financial markets' }), D(RFM, 'How a bubble forms and bursts', { t: 'How a bubble forms and bursts' })],
    judge: 'Banks and markets channel savings to investment, which raises growth, but when they fail through bubbles or moral hazard the damage is large, so regulation matters as much as depth.',
  },
  196: {
    cols: ['Costs of a monopsony', 'Limits'],
    left: [D(MSP, 'The monopsonist buys where the marginal cost', { t: 'How a monopsonist sets price and quantity' }), S(MSP, 'Who gains and who loses', { t: 'Who gains and who loses' })],
    right: [S(MSP, 'Monopsony in practice', { t: 'Monopsony in practice' }), S(GIE, 'Protecting suppliers and employees from mo', { t: 'Protecting suppliers and employees' }), D(WD, 'The minimum wage under monopsony', { t: 'The minimum wage under monopsony' })],
    judge: 'A monopsony pays suppliers less and buys less than a competitive market, so suppliers lose and output falls; consumers can gain from lower prices, so the cost depends on whether savings are passed on.',
  },
  197: {
    cols: ['The case for supporting banks', 'The case against'],
    left: [S(CBFR, 'The crisis toolkit', { t: 'The crisis toolkit' })],
    right: [D(CBFR, 'Moral hazard', { t: 'Moral hazard' }), D(CBFR, 'Does financial regulation work?', { t: 'Does financial regulation work?' })],
    judge: 'Supporting banks prevents the financial system collapsing, which would harm the whole economy, but it creates moral hazard and puts the cost on taxpayers, so conditions and regulation should follow.',
  },
  198: {
    cols: ['One role of financial markets', ''],
    left: [S(RFM, 'The role of financial markets', { t: 'The role of financial markets' })],
    right: [],
  },
  199: {
    cols: ['Why wages differ', 'Limits'],
    left: [S(WD, 'Determinants of labour DEMAND', { t: 'Determinants of labour demand' }), D(WD, 'The wage rate and net advantages', { t: 'The wage rate and net advantages' }), D(WD, 'Qualifications, training and barriers to entry', { t: 'Qualifications, training and barriers to entry' }), D(WD, 'Labour mobility', { t: 'Labour mobility' })],
    right: [S(LMI, 'Wage differentials and discrimination', { t: 'Wage differentials and discrimination' }), D(LMI, 'The economics of discrimination', { t: 'The economics of discrimination' }), S(LMI, 'Trade unions', { t: 'Trade unions' })],
    judge: 'Wages differ because of differences in productivity, skills and demand for the product, and because of unions and discrimination; the first set explain differences that are efficient, the others are market imperfections.',
  },
  200: {
    cols: ['Policies to reduce labour immobility', 'Limits'],
    left: [D(TMF, 'Immobility of labour and capital', { t: 'Immobility of labour and capital' }), education, D(WD, 'Labour mobility', { t: 'Labour mobility' })],
    right: [E(TMF, 'Immobility of labour and capital', { t: 'Why immobility is hard to fix' }), educationLimits],
    judge: 'Retraining and help with moving reduce occupational and geographical immobility, but they are slow and costly, and housing costs and family ties keep many workers where they are.',
  },
  201: {
    cols: ['How nationalisation could protect employees', 'Limits'],
    left: [S(GIE, 'Nationalisation and privatisation', { t: 'Nationalisation and privatisation' }), D(MON, 'Employees', { t: 'Employees' })],
    right: [D(MON, 'The cost of subsidy and nationalisation', { t: 'The cost of subsidy and nationalisation' }), E(MON, 'Employees', { t: 'Why employees may not gain' })],
    judge: 'Public ownership can protect pay and jobs because profit is not the only aim, but it may be less efficient and need subsidy, which can threaten the jobs it aims to protect.',
  },
  202: {
    cols: ['Disadvantages of a higher living wage in social care', 'Limits'],
    left: [S(LMI, 'The national minimum wage', { t: 'The national minimum wage' }), D(LMI, 'A single dominant employer', { t: 'A single dominant employer' }), D(WD, 'The minimum wage under monopsony', { t: 'The minimum wage under monopsony' })],
    right: [E(WD, 'The minimum wage under monopsony', { t: 'Why it may not cut jobs' }), D(LMI, 'Arguments for and against', { t: 'Arguments for and against' })],
    judge: 'A higher wage raises costs for care providers, which may cut jobs or raise prices, but where a few employers dominate (monopsony) a higher wage can raise employment, so the effect depends on market power.',
  },
  203: {
    cols: ['Micro consequences of a shift to electric vehicles', 'Limits'],
    left: [D(DEM, 'Related goods - substitutes and complements', { t: 'Substitutes and complements' }), D(SUP, 'Technology', { t: 'Technology lowers costs', d: [20] }), S(EXT, 'Negative production externality', { t: 'The external cost falls' })],
    right: [E(GIM, 'Subsidy', { t: 'Limits of subsidies' }), D(GF, 'Unintended consequences', { t: 'Unintended consequences' }), D(EMP, 'Structural unemployment', { t: 'Structural unemployment in oil-related jobs' })],
    judge: 'Electric vehicles raise demand for electricity and batteries and cut demand for fuel, so some firms and workers gain and others lose; external costs fall, but jobs in oil-related industries decline.',
  },
  204: {
    cols: ['Two ways cocoa farmers could raise incomes', ''],
    left: [D(SUP, 'Technology', { t: 'Technology raises productivity', d: [20] }), D(FIG, 'Primary product dependency', { t: 'Diversify away from one product' })],
    right: [],
  },
}
