/*
  The framework of the diagram bank, taken from the notes.

  BANK_SECTIONS is the order the course teaches the diagrams in (the notes'
  own chapter order), each section naming the notes chapters it belongs to.
  SLIDE_NOTES says, for each run of diagram numbers, which chapter and which
  section of the notes explains it, so a diagram can show the passage that
  goes with it. The headings are matched against the real notes (see
  sectionFor), and a heading that is not found falls back to the chapter, so
  nothing here can point at an empty page.
*/

export const BANK_SECTIONS = [
  { family: 'PPF', title: 'Production possibility frontier', theme: 'Theme 1', chapters: ['Production Possibility Frontiers'] },
  { family: 'Supply and demand', title: 'Demand, supply and equilibrium', theme: 'Theme 1', chapters: ['Demand', 'Supply and Elasticity of Supply', 'Price Determination and the Price Mechanism'] },
  { family: 'Elasticity', title: 'Elasticity and total revenue', theme: 'Theme 1', chapters: ['Price, Income and Cross Elasticities of Demand', 'Supply and Elasticity of Supply'] },
  { family: 'Consumer and producer surplus', title: 'Consumer and producer surplus', theme: 'Theme 1', chapters: ['Consumer and Producer Surplus'] },
  { family: 'Price controls', title: 'Price controls', theme: 'Theme 1', chapters: ['Government Intervention in Markets'] },
  { family: 'Tax and subsidy', title: 'Tax and subsidy', theme: 'Theme 1', chapters: ['Government Intervention in Markets'] },
  { family: 'Externalities', title: 'Externalities and market failure', theme: 'Theme 1', chapters: ['Externalities', 'Public Goods and Information Gaps'] },
  { family: 'Labour market', title: 'Labour markets', theme: 'Theme 3', chapters: ['Wage Determination', 'Labour Market Issues', 'Monopsony'] },
  { family: 'AR and MR curves', title: 'AR and MR curves', theme: 'Theme 3', chapters: ['Revenue, Costs and Profit'] },
  { family: 'Costs', title: 'Costs and economies of scale', theme: 'Theme 3', chapters: ['Revenue, Costs and Profit', 'Economies and Diseconomies of Scale'] },
  { family: 'Perfect competition', title: 'Perfect competition', theme: 'Theme 3', chapters: ['Perfect Competition'] },
  { family: 'Monopoly', title: 'Monopoly', theme: 'Theme 3', chapters: ['Monopoly', 'Efficiency'] },
  { family: 'Monopolistic competition', title: 'Monopolistic competition', theme: 'Theme 3', chapters: ['Monopolistic Competition'] },
  { family: 'Oligopoly', title: 'Oligopoly', theme: 'Theme 3', chapters: ['Oligopoly'] },
  { family: 'AD / AS (Keynesian AS)', title: 'AD / AS: the Keynesian AS curve', theme: 'Theme 2', chapters: ['Aggregate Supply', 'Components of Aggregate Demand', 'Output Gaps and the Trade Cycle'] },
  { family: 'AD / AS (neo-classical LRAS)', title: 'AD / AS: the neo-classical LRAS', theme: 'Theme 2', chapters: ['Aggregate Supply', 'Inflation'] },
  { family: 'Money and bonds', title: 'Money, interest rates and bonds', theme: 'Theme 2', chapters: ['Monetary Policy', 'The Role of Financial Markets'] },
  { family: 'Exchange rate', title: 'Exchange rates', theme: 'Theme 2', chapters: ['Exchange Rates'] },
  { family: 'Economic cycle', title: 'The economic cycle', theme: 'Theme 2', chapters: ['Output Gaps and the Trade Cycle'] },
  { family: 'Phillips and Laffer', title: 'Phillips curve and Laffer curve', theme: 'Theme 2', chapters: ['Conflicts Between Objectives and the Phillips Curve', 'Public Expenditure and Taxation'] },
  { family: 'Inequality', title: 'Inequality', theme: 'Theme 4', chapters: ['Poverty and Inequality'] },
  { family: 'Trade', title: 'International trade', theme: 'Theme 4', chapters: ['International Trade', 'Protectionism and Trade Restrictions'] },
]

// The four themes of the course, which the topics are grouped under.
export const THEME_NAMES = {
  'Theme 1': 'Introduction to markets and market failure',
  'Theme 2': 'The UK economy: performance and policies',
  'Theme 3': 'Business behaviour and the labour market',
  'Theme 4': 'A global perspective',
}
export const themeOfFamily = (family) => BANK_SECTIONS.find((s) => s.family === family)?.theme || null

// [first diagram, last diagram, notes chapter, section heading]
export const SLIDE_NOTES = [
  [3, 3, 'Production Possibility Frontiers', 'Using the PPF to show economic concepts'],
  [4, 4, 'Production Possibility Frontiers', 'Shifts in the PPF'],
  [5, 5, 'Production Possibility Frontiers', 'Technology that helps only one good'],
  [6, 6, 'Production Possibility Frontiers', 'Inward shifts'],
  [8, 8, 'Demand', 'The conditions of demand'],
  [9, 10, 'Demand', 'Movements against shifts'],
  [11, 13, 'Demand', 'The conditions of demand'],
  [14, 15, 'Supply and Elasticity of Supply', 'The conditions of supply'],
  [16, 17, 'Price Determination and the Price Mechanism', 'Reading the equilibrium on a diagram'],
  [18, 25, 'Price Determination and the Price Mechanism', 'The four cases of a change in equilibrium'],
  [26, 26, 'Price Determination and the Price Mechanism', 'Effects on related markets'],
  [27, 32, 'Price, Income and Cross Elasticities of Demand', 'Price elasticity of demand (PED)'],
  [33, 34, 'Supply and Elasticity of Supply', 'Price elasticity of supply (PES)'],
  [35, 35, 'Government Intervention in Markets', '3. Maximum and minimum prices'],
  [37, 38, 'Consumer and Producer Surplus', 'Consumer surplus'],
  [39, 45, 'Price, Income and Cross Elasticities of Demand', 'PED and total revenue'],
  [47, 50, 'Government Intervention in Markets', '3. Maximum and minimum prices'],
  [51, 51, 'Government Intervention in Markets', 'Buffer stocks'],
  [52, 52, 'Government Intervention in Markets', '3. Maximum and minimum prices'],
  [53, 57, 'Government Intervention in Markets', '1. Indirect taxation'],
  [58, 58, 'Government Intervention in Markets', '2. Subsidies'],
  [59, 59, 'Protectionism and Trade Restrictions', 'More forms of protection'],
  [61, 61, 'Externalities', 'The other two cases'],
  [62, 62, 'Externalities', 'Positive consumption externality'],
  [63, 63, 'Externalities', 'Negative production externality'],
  [64, 64, 'Externalities', 'The other two cases'],
  [65, 67, 'Externalities', 'The four cases, and why the diagram'],
  [68, 68, 'Government Intervention in Markets', '1. Indirect taxation'],
  [69, 69, 'Government Intervention in Markets', '5. State provision and regulation'],
  [70, 70, 'Public Goods and Information Gaps', 'Information gaps'],
  [71, 72, 'Externalities', 'Positive consumption externality'],
  [73, 73, 'Externalities', 'The other two cases'],
  [74, 75, 'Externalities', 'Negative production externality'],
  [77, 77, 'Wage Determination', 'Determinants of labour DEMAND'],
  [78, 83, 'Wage Determination', 'The competitive labour market'],
  [84, 85, 'Labour Market Issues', 'Trade unions'],
  [86, 86, 'Labour Market Issues', 'The national minimum wage'],
  [87, 87, 'Monopsony', 'How a monopsonist sets price and quantity'],
  [88, 88, 'Wage Determination', 'Elasticity of labour demand and supply'],
  [90, 101, 'Revenue, Costs and Profit', 'Revenue'],
  [102, 114, 'Revenue, Costs and Profit', 'Costs in the short run'],
  [115, 116, 'Economies and Diseconomies of Scale', 'Internal economies of scale'],
  [117, 117, 'Economies and Diseconomies of Scale', 'EXTERNAL economies of scale'],
  [118, 119, 'Perfect Competition', 'X-inefficiency in practice'],
  [120, 122, 'Revenue, Costs and Profit', 'Costs in the short run'],
  [123, 126, 'Perfect Competition', 'Short run'],
  [127, 131, 'Perfect Competition', 'Long run'],
  [132, 134, 'Perfect Competition', 'Short run to long run'],
  [135, 139, 'Monopoly', 'The assumptions of the monopoly model'],
  [140, 142, 'Efficiency', 'Efficiency by market structure'],
  [143, 148, 'Business Objectives', 'Criticisms of profit maximisation'],
  [149, 150, 'Monopolistic Competition', 'Assumptions'],
  [151, 151, 'Monopolistic Competition', 'Comparison with the other structures'],
  [152, 156, 'Monopoly', 'The assumptions of the monopoly model'],
  [157, 157, 'Monopoly', 'Price discrimination'],
  [158, 159, 'Oligopoly', 'The kinked demand curve'],
  [160, 160, 'Oligopoly', 'Evaluating oligopoly'],
  [161, 161, 'Monopoly', 'Natural monopoly'],
  [162, 162, 'Monopolistic Competition', 'Non-price competition'],
  [164, 164, 'Components of Aggregate Demand', 'Why the AD curve slopes downwards'],
  [165, 171, 'Aggregate Supply', 'Short-run aggregate supply (SRAS)'],
  [172, 178, 'Aggregate Supply', 'Two schools of thought on long-run aggregate supply'],
  [179, 180, 'Aggregate Supply', 'Two schools of thought on long-run aggregate supply'],
  [181, 182, 'The Circular Flow of Income and the Multiplier', 'The multiplier'],
  [183, 184, 'Output Gaps and the Trade Cycle', 'Reading the output gap on an AD/AS diagram'],
  [185, 185, 'Aggregate Supply', 'What shifts SRAS'],
  [186, 186, 'Output Gaps and the Trade Cycle', 'Reading the output gap on an AD/AS diagram'],
  [187, 187, 'The Circular Flow of Income and the Multiplier', 'The multiplier'],
  [188, 188, 'Aggregate Supply', 'What shifts LRAS'],
  [189, 189, 'Conflicts Between Objectives and the Phillips Curve', 'The Phillips curve: the history'],
  [190, 191, 'Inflation', 'Causes of inflation'],
  [193, 196, 'The Role of Financial Markets', 'The role of financial markets'],
  [197, 197, 'Monetary Policy', 'Bonds and yields'],
  [198, 203, 'Exchange Rates', 'What determines a floating rate'],
  [205, 205, 'Output Gaps and the Trade Cycle', 'The trade cycle'],
  [206, 206, 'Causes and Effects of Economic Growth', 'Actual and potential growth'],
  [207, 207, 'Conflicts Between Objectives and the Phillips Curve', 'Inflation against unemployment'],
  [208, 211, 'Public Expenditure and Taxation', 'Taxation'],
  [212, 215, 'Poverty and Inequality', 'Measuring it'],
  [216, 216, 'Poverty and Inequality', 'The Kuznets curve'],
  [218, 220, 'International Trade', 'Absolute advantage'],
  [221, 221, 'International Trade', 'Comparative advantage'],
  [222, 225, 'Protectionism and Trade Restrictions', 'The tariff diagram'],
  [226, 226, 'Protectionism and Trade Restrictions', 'More forms of protection'],
]

// The notes chapter (and section heading) that explains a diagram, from the
// table above alone, so a screen that has not loaded the notes can still link to
// them. `null` when the diagram has no section.
export function chapterFor(id) {
  const hit = SLIDE_NOTES.find(([a, b]) => id >= a && id <= b)
  return hit ? { chapter: hit[2], heading: hit[3] } : null
}

const DIAGRAM_MARKER = /<div\s+data-diagram="[^"]*"\s*><\/div>/gi
const text = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

/*
  The passage of the notes that goes with a diagram: the chapter, the section
  heading found in it, and that section's HTML (diagram markers removed so it
  does not draw the same diagram again). `html` is null when the heading is
  not in the chapter, in which case only the chapter is offered.
*/
export function sectionFor(id, notes) {
  const hit = SLIDE_NOTES.find(([a, b]) => id >= a && id <= b)
  if (!hit || !notes) return null
  const [, , chapterName, heading] = hit
  const keys = Object.keys(notes)
  const chapter = keys.find((k) => k.toLowerCase() === chapterName.toLowerCase()) || keys.find((k) => k.toLowerCase().includes(chapterName.toLowerCase()))
  if (!chapter) return null
  const parts = notes[chapter].split('<h3>').slice(1)
  const part = parts.find((p) => text(p.split('</h3>')[0]).toLowerCase().includes(heading.toLowerCase()))
  if (!part) return { chapter, heading: null, html: null }
  const [title, ...rest] = part.split('</h3>')
  return { chapter, heading: text(title), html: rest.join('</h3>').replace(DIAGRAM_MARKER, '') }
}
