/*
  Theme 2 (the UK economy), from the MASTER course documents.

  The macroeconomics documents (Measuring Macroeconomic Performance through
  The Balance of Payments) read end to end against what each chapter already
  said. Like econ-notes-firm-master.js, this file adds only what was missing
  or thinner than the source and does not restate what the chapters cover.
  It is merged onto the END of each chapter (see mergeNotes in library.js).

  What it adds, chapter by chapter:

    Economic Growth        index numbers worked end to end; nominal to real
                           GDP and GDP per capita as calculations; the
                           three-sector structure of an economy; why recorded
                           GDP understates output; GNI per capita (PPP) with
                           its merits and limits; growth against development
                           and the Easterlin paradox.
    Causes and Effects     exogenous supply-side shocks; the stages of the
                           cycle; the environmental Kuznets curve in full;
                           the extra benefits and costs of growth; what
                           decides whether growth is actually beneficial.
    Macro Objectives       how to read the UK's macro record chart by chart.
    Circular Flow          the closed-economy model; three ways to measure
                           national income; a tax cut walked through the
                           multiplier; average against marginal propensities.
    Components of AD       why the AD curve slopes down (three effects); which
                           component moves in each scenario; more determinants
                           of G; three more limits on the exchange rate effect.
    Consumption, Saving    the permanent income hypothesis; when the life cycle
    and Investment         hypothesis fits; gross against net investment.
    Aggregate Supply       SRAS cost factors; neo-classical against Keynesian
                           LRAS; the three sections of the Keynesian curve;
                           macroeconomic equilibrium and the laissez-faire case.
    Output Gaps            why each gap is a problem; drawing them; evaluating
                           how much they matter.
    Unemployment           labour force and participation calculations; the
                           claimant count's blind spots; case studies; the
                           positive side of full employment.
    Inflation              hyperinflation; index-number practice; CPI and RPI
                           history and use; money illusion; all of deflation.
    Fiscal Policy          the UK tax table; average and marginal rates and
                           fiscal drag worked; furlough and Eat Out to Help
                           Out; classifying budget changes; extra advantages
                           and limits.
    Public Expenditure,    transfer payments; why spending changes; the
    National Debt          debt-to-GDP ratio and the Greek crisis.
    Monetary Policy        how Bank Rate reaches customers; symmetric against
                           asymmetric targets; the liquidity trap; bonds and
                           yields; QE step by step; QT; more evaluation.
    Supply-Side Policy     effects on the objectives; NEET, childcare and Help
                           to Buy; what effectiveness depends on; the
                           productivity puzzle.
    Conflicts, Phillips    the 25-mark inflation and environment conflicts; the
    Curve                  Phillips curve story; adaptive expectations and the
                           NAIRU; how useful the curve is.
    Balance of Payments    the capital account and the accounts identity; a
                           worked 2014 example; when a deficit is positive;
                           capital flight; foreign ownership.
*/

import { h, p, ul, ol, defn, det, worked, tip, table, chapter } from './econ-notes-build'

/* ====================================================== ECONOMIC GROWTH */

const economicGrowth = chapter(
  h('Index numbers'),
  defn(
    'Index number',
    'A way of comparing the value of a variable with a BASE observation, usually an earlier year, by setting the base to 100.',
  ),
  p(
    'The base year always has an index of 100: whatever its value, dividing it by itself and multiplying by 100 gives 100. Every other year is then expressed relative to it.',
  ),
  ul([
    'Index in year X = (value in year X ÷ value in the base year) × 100.',
    'Percentage change FROM THE BASE YEAR = index − 100. An index of 110 means 10% higher than the base; 97.5 means 2.5% LOWER.',
    'Percentage change between any two OTHER years = (later index − earlier index) ÷ earlier index × 100. This is not the same as the gap in index points, because the starting point is no longer 100.',
  ]),
  table(
    ['Year', 'Average house price (£000)', 'Index (2012 = 100)', '% change on base year', '% change on previous year'],
    [
      ['2012', '200', '100', 'base year', 'n/a'],
      ['2013', '220', '110', '+10', '+10'],
      ['2014', '230', '115', '+15', '+4.5'],
      ['2015', '210', '105', '+5', '−8.7'],
      ['2016', '195', '97.5', '−2.5', '−7.1'],
    ],
  ),
  p(
    'Reading the table: an index of 110 in 2013 means prices were 10% higher than in 2012. Prices FELL in 2015 and 2016 because the index fell. The 2016 index of 97.5 means prices were still 2.5% below the base year, even though the fall from 2015 was 7.1%. The largest year-on-year rise was 2013.',
  ),
  worked(
    'An index of car output reads 95 (2014), 100 (2015), 105 (2016) and 110 (2017). Find the percentage change 2014 to 2015, 2015 to 2016, 2016 to 2017, 2014 to 2017 and 2015 to 2017, and say which year is the base.',
    'The base year is 2015 because its index is 100. 2014 to 2015: (100 − 95) ÷ 95 = 5.26%. 2015 to 2016: 5%, read straight off the index points because 2015 is the base. 2016 to 2017: (110 − 105) ÷ 105 = 4.76%. 2014 to 2017: (110 − 95) ÷ 95 = 15.79%. 2015 to 2017: 10%, again straight off the points. Only comparisons FROM the base year can be read directly; every other pair needs the formula, which is why 2014 to 2015 is 5.26% and not 5%.',
  ),
  worked(
    'UK GDP (£m) was 1,549,820 in 2007, 1,589,931 in 2008, 1,547,562 in 2009, 1,601,925 in 2010 and 1,659,785 in 2011. Express it as an index with 2007 = 100 and interpret it.',
    'Index = GDP ÷ 1,549,820 × 100, giving 100, 102.59, 99.85, 103.36 and 107.10. GDP in 2009 is slightly BELOW its 2007 level (99.85) - the economy had shrunk back past its starting point after the financial crisis - and had recovered 7.1% above 2007 by 2011.',
  ),
  tip(
    'The base year is not arbitrary. It is chosen because it is a useful reference point: here 2007 is the year before the financial crisis, so the index shows how far output fell and when it got back. Say why a base year was chosen if the question asks.',
  ),

  h('From nominal to real GDP, calculated'),
  defn(
    'Nominal GDP',
    'Total output measured in current prices, with no adjustment for inflation. It can rise simply because prices rose, even if the economy produced no more.',
  ),
  defn(
    'Real GDP',
    'Total output adjusted for inflation, also called GDP at constant prices. It measures the change in the VOLUME of output rather than the price level.',
  ),
  p('Real GDP = (nominal GDP ÷ price index) × 100.'),
  worked(
    'UK GDP in 2018 was about £2.2 trillion at current prices and the price index stood at 104 (base year = 100). Calculate real GDP.',
    '(2.2 ÷ 104) × 100 = £2.12 trillion. Stripping out the 4% rise in prices leaves a smaller number than the headline figure.',
  ),
  worked(
    'Between 2018 and 2019 UK GDP at current prices rose from £2,144,304m to £2,214,888m, while the price index rose from 100 to 105. Calculate (a) the percentage rise in nominal GDP, (b) real GDP in 2019, (c) the percentage change in real GDP.',
    '(a) (2,214,888 − 2,144,304) ÷ 2,144,304 = 3.29%. (b) 2,214,888 ÷ 105 × 100 = £2,109,417m. (c) 2018 is the base, so its nominal and real values are both £2,144,304m, and (2,109,417 − 2,144,304) ÷ 2,144,304 = −1.63%. Nominal GDP ROSE 3.3% but real GDP FELL 1.6%, because prices rose by 5%, faster than nominal output. Economic growth is a real concept: always use the real figure.',
  ),

  h('GDP per capita, calculated'),
  defn('GDP per capita', 'The average level of GDP per head of the population: GDP ÷ population.'),
  p(
    'A country can record high growth simply because its population is growing, in which case more people share the output and nobody need be better off. Only if output PER HEAD rises is there evidence of higher average living standards. As a rule of thumb, growth in GDP per capita is approximately GDP growth minus population growth: 6% growth with 3% population growth is roughly 3% growth per head.',
  ),
  table(
    ['Country', 'GDP (£bn)', 'Population (m)', 'GDP per capita'],
    [
      ['A', '605', '63', '£9,603'],
      ['B', '790', '36', '£21,944'],
      ['C', '511', '13.2', '£38,712'],
    ],
  ),
  p(
    'Country B generates the most total income, but Country C has the highest income per head. A large total can be a large population rather than a high standard of living: India has a very large GDP and still a low average income. GDP per capita is therefore the better guide to material living standards, though it is still only an average and says nothing about how income is distributed.',
  ),

  h('The structure of an economy'),
  table(
    ['Sector', 'What it does', 'Examples'],
    [
      ['Primary', 'Extracts raw materials and grows food', 'Agriculture, forestry, fishing, mining'],
      ['Secondary', 'Transforms raw materials into goods', 'Motor manufacturing, steel, furniture making'],
      ['Tertiary', 'Provides services rather than a physical good, but still creates value', 'Banking, insurance, retail, education'],
    ],
  ),
  p(
    'In the UK, manufacturing now makes up a much smaller share of output than it once did. This is DEINDUSTRIALISATION: as incomes rise, demand shifts towards services; productivity growth means manufacturing needs fewer workers per unit of output; and production moves overseas where costs are lower. The cost is structural unemployment in the regions that depended on the declining industries.',
  ),

  h('Why recorded GDP understates output'),
  p(
    'GDP only counts output that is recorded, so it is very likely to underestimate total production. Three things go missing:',
  ),
  table(
    ['Source of unrecorded output', 'Explanation', 'Example'],
    [
      ['The shadow (black) economy', 'Output deliberately not declared, to avoid tax or because the activity is illegal. Estimates of its size vary widely and are always uncertain', 'A builder paid cash in hand; illegal drug sales'],
      ['Non-marketed goods and services', 'Output produced without money changing hands, or not traded at all, is not in the accounts', 'Cooking, cleaning, gardening and childcare done within the household'],
      ['The informal sector', 'In many developing countries most activity is small-scale and unregistered, so it is missed by measures based on recorded transactions', 'Subsistence farming'],
    ],
  ),
  p(
    'What counts as recorded also depends on the law. The Netherlands, where prostitution is legal and the sale of some drugs is tolerated and regulated, will show a higher level of recorded activity than a country with the same real output where those activities are underground.',
  ),
  det(
    'Does a rise in real GDP always mean higher living standards?',
    'No, because the measure and the thing it is standing in for can move apart.',
    [
      'In developing countries a rise in recorded GDP may partly reflect more activity being recorded as farming and trade become formalised, rather than more being produced.',
      'GDP counts the output but not the distribution: average income can rise while most people see no gain.',
      'It ignores non-monetary factors - leisure, health, environmental quality, work-life balance.',
    ],
    'The measure is still the best single indicator we have, and over time and across countries it correlates strongly with literacy, life expectancy and falling absolute poverty. The honest conclusion is that it is a good starting point which needs supporting with per capita, distribution and wellbeing measures.',
  ),

  h('GNI per capita (PPP): merits and limits'),
  defn(
    'GNI per capita',
    'GDP plus net income from abroad, expressed as an average per person. It is the standard measure the World Bank uses to compare income levels across countries.',
  ),
  p(
    'PPP (purchasing power parity) adjusts for the cost of living. Ask two questions: how many goods and services can I buy with a given income in Thailand, and how many US dollars would I need to buy the same basket in the USA? The comparison is then of what income actually buys, not of exchange-rate conversions.',
  ),
  table(
    ['Merit', 'Limit'],
    [
      ['Includes remittances, an important contribution to living standards in many developing countries', 'Says nothing about distribution: the income may be held by a small group or a single region'],
      ['PPP allows for different costs of living, so comparisons are fair', 'Based on monetary transactions, so it misses the informal activity - such as agriculture - that dominates many low-income economies'],
    ],
  ),
  p(
    'PPP narrows the apparent gap between rich and poor countries. Thailand\'s GNI per capita at market exchange rates was roughly a ninth of the US figure, but on a PPP basis it is closer to a quarter. Converting at market exchange rates alone would exaggerate the gap in living standards, because prices in lower-income countries are lower.',
  ),

  h('Growth and development'),
  defn(
    'Economic development',
    'Real per capita incomes rise AND people benefit from improved living conditions: lower poverty, better nutrition, higher standards of education and healthcare.',
  ),
  p(
    'Growth is a rise in output; development is what that output does for people. They usually travel together but need not. Compare what growth means in different places:',
  ),
  table(
    ['Developing country (for example Uganda)', 'Developed country (for example the UK)'],
    [
      [
        'Many people live in ABSOLUTE poverty. Growth provides income for basic necessities - food, clothing, shelter - lets more children go to school and brings clean water, which reduces disease. But it only helps if the government uses the extra tax revenue well, rather than losing it to corruption',
        'Material living standards have risen with growth, but often at the expense of longer working hours, a worse work-life balance and higher levels of stress and depression, so the improvement in quality of life is uncertain',
      ],
    ],
  ),
  det(
    'The Easterlin paradox',
    'Happiness does not necessarily rise in line with economic growth.',
    [
      'If everyone in a country gets richer, average happiness stays roughly the same over time.',
      'The explanation is that people care most about RELATIVE income: being richer than the people around you makes you happier.',
      'So being poor in a rich country can leave you less happy than being rich in a poor country, even if the first person has the higher absolute income and material standard of living.',
    ],
    [
      'Comparison with others, work-life balance and relative costs of living all matter, which is why a rising average does not translate into rising contentment.',
      'The finding is contested: later studies using larger datasets find that happiness does rise with income across countries, so it should be presented as an argument about the limits of GDP, not a settled fact.',
    ],
  ),
)

/* ============================================= CAUSES AND EFFECTS OF GROWTH */

const causesEffectsOfGrowth = chapter(
  h('Short-run growth against long-run growth: why the second matters'),
  p(
    'Short-run (actual) growth comes from changes in the components of AD, or from putting previously unemployed resources back to work. But it cannot continue indefinitely: without long-run growth, short-run growth runs into a SUPPLY CONSTRAINT, a point where nothing more can be produced and extra demand only raises prices. Long-run growth is what moves that ceiling.',
  ),
  worked(
    'Say whether each of these leads to actual or potential growth. (a) The government spends more on healthcare. (b) Hosting the Olympics raises consumer confidence and spending.',
    '(a) BOTH, over different time horizons. Higher government spending raises AD at once, so actual growth; but if it improves the health of the workforce it raises the QUALITY of labour over time, which is potential growth. (b) ACTUAL growth only: it raises consumption and AD, but does not add to productive capacity, and the effect is likely to be temporary.',
  ),
  det(
    'A decline in long-run growth: exogenous supply-side shocks',
    'Long-run growth falls when the quantity or quality of factors of production falls.',
    [
      'An EXOGENOUS supply-side shock comes from outside the economy\'s own control and directly changes its productive capacity.',
      'A natural disaster such as an earthquake or tsunami kills people (labour) and destroys capital and infrastructure.',
      'War and political conflict reduce what can be produced and drag down productivity and investment.',
      'The LRAS curve (and PPF) shifts INWARD, so potential output is lower.',
    ],
    'Some shocks are temporary: rebuilding after a disaster can itself raise AD and investment, and capital destroyed can be replaced with newer, more productive capital. The effect depends on how quickly the capacity is rebuilt and whether labour and skills are lost permanently.',
  ),

  h('The economic cycle in six stages'),
  p(
    'Real GDP rises and falls in a fairly regular pattern around its long-run trend, known as the economic cycle.',
  ),
  table(
    ['Stage', 'What is happening'],
    [
      ['Recession', 'Negative growth: real GDP is falling'],
      ['Trough', 'The point where the NEGATIVE output gap is greatest'],
      ['Recovery', 'Growth returns and real GDP rises, but actual GDP is still below trend'],
      ['Boom', 'Rapid growth, with actual GDP above trend'],
      ['Slowdown', 'Real GDP is still rising but at a slower rate'],
      ['Peak', 'The point where the POSITIVE output gap is greatest'],
    ],
  ),
  table(
    ['Phase', 'Investment, demand and output'],
    [
      ['Growth', 'Investment is needed to meet rising demand and to REPLACE worn-out capital'],
      ['Boom', 'Investment rises, AD rises and real GDP rises further through the multiplier; inflationary pressure builds'],
      ['Downturn', 'Output falls, unemployment rises, consumption and investment fall, so tax revenue falls; imports fall and inflationary pressure eases'],
    ],
  ),

  h('The environmental Kuznets curve: reasons and criticisms'),
  p(
    'The curve (Grossman and Krueger, 1991) suggests that development first worsens the environment but that, beyond some level of income, environmental degradation falls.',
  ),
  table(
    ['Why pollution might fall as income rises', 'Why it might not'],
    [
      [
        'Greater awareness and regulation: cleaner air is politically popular once basic needs are met (London\'s congestion charge and ultra-low emission zone came from residents\' demand)',
        'Growth means more resource use: even a move into services brings more air travel and more cars',
      ],
      [
        'Better technology uses fewer raw materials (electric cars, solar power)',
        'Rich countries can EXPORT their environmental damage by buying goods made elsewhere, or meat produced on deforested land',
      ],
      [
        'Structural change: moving from the primary to the secondary sector raises pollution, but moving from secondary to tertiary lowers it',
        'Pollution is not a simple function of income; the effectiveness of regulation and many other factors matter',
      ],
    ],
  ),

  h('Further benefits and costs of growth'),
  table(
    ['Benefit', 'Explanation'],
    [
      ['Lower unemployment', 'Labour is a DERIVED demand: as growth raises incomes and spending on goods, firms need more workers'],
      ['Higher tax revenue', 'More income, indirect and corporation tax, which can be reinvested in supply-side improvements or spent on reducing poverty'],
      ['Higher material living standards', 'If GDP per capita rises, people can afford more holidays, meals out, durable goods and childcare. More tax revenue also funds healthcare and education, improving literacy and lowering infant mortality, especially valuable in developing countries'],
      ['Influence abroad', 'Larger economies carry more weight in trade negotiations, as China\'s growing role shows'],
    ],
  ),
  table(
    ['Cost', 'Explanation'],
    [
      ['Quality of life', 'Material gains may come with longer working hours. If growth comes from working more hours rather than raising output per worker per hour, it is not sustainable'],
      ['Environmental costs', 'More land use and water, noise and air pollution, more congestion and more demand for air travel'],
      ['Income and wealth inequality', 'High growth can concentrate gains in few hands (the experience of China and India is often cited); if only a few benefit, most people\'s living standards do not rise'],
      ['Regional inequality', 'Investment concentrated in some areas, as in the UK\'s North/South divide around London and the south-east'],
      ['Capital-labour substitution', 'Growth driven by automation may reduce the demand for labour even as output rises'],
      ['Unbalanced growth', 'Growth should be spread across sectors and across the components of AD; dependence on one of them (such as consumer borrowing) is fragile'],
      ['Inflation', 'If AD rises faster than AS, demand-pull inflation builds and the growth is not sustainable'],
      ['Worse net exports', 'Higher incomes raise import demand (more so with a high marginal propensity to import) and inflation reduces export competitiveness'],
    ],
  ),

  h('What decides whether growth is actually beneficial?'),
  table(
    ['It depends on', 'Why'],
    [
      [
        'What the tax revenue is spent on',
        'Effective investment in supply-side policy such as infrastructure raises productive capacity and offsets inflation; redistribution through benefits spreads the gains; subsidies encourage cleaner energy; support helps workers move into higher-value sectors',
      ],
      [
        'How long it lasts',
        'Growth that is persistent and resilient is worth more than a short burst',
      ],
      [
        'Social sustainability',
        'Longer hours and worsening wellbeing mean the gains are partly illusory',
      ],
      [
        'Environmental sustainability',
        'Pollution, loss of non-renewable resources and environmental degradation borrow from the future',
      ],
      [
        'The quality of employment',
        'If new jobs are low-skilled and poorly paid, higher output does not translate into better living standards',
      ],
    ],
  ),
)

/* ============================================== MACROECONOMIC OBJECTIVES */

const macroObjectives = chapter(
  h('Reading the UK\'s macro record'),
  p(
    'Exam questions often hand over a chart or table of UK data. These are the standard readings and, more importantly, the reasons behind them, for the period up to the early 2020s. Check the dates on any data you are given: the analysis stays the same but the figures change.',
  ),
  table(
    ['Objective', 'What the data show', 'The explanation'],
    [
      [
        'Economic growth',
        'Real GDP has grown over time, since most annual figures are positive. The two recent periods of NEGATIVE growth are the financial crisis (from 2007) and the coronavirus pandemic (2020)',
        'Both were large negative shocks to demand and supply: a banking collapse in one case and the lockdown of whole sectors in the other',
      ],
      [
        'Unemployment',
        'Before the pandemic unemployment was historically low, at around 4%. It rose during the pandemic but did not reach the peaks of earlier recessions',
        'Part of the low pre-pandemic figure reflects flexible contracts (zero-hours, part-time work), which keep people counted as employed. The furlough scheme meant firms kept workers on payroll rather than making them redundant',
      ],
      [
        'Balance of payments',
        'The UK has run a current account deficit, in goods especially, with imports exceeding exports',
        'High propensity to import, a decline in manufacturing and strong consumer demand, partly offset by a surplus in services',
      ],
      [
        'Government borrowing',
        'Debt as a share of GDP rose sharply after the financial crisis and again in the pandemic, but remains well below the level reached after the Second World War',
        'Heavy borrowing to support the economy in a crisis; the debt-to-GDP ratio is the better measure of the burden because it compares debt with the ability to repay',
      ],
      [
        'Inequality',
        'Income inequality has increased significantly since the 1970s',
        'Changes in the structure of the economy, weaker trade unions, skill-biased technological change and changes in taxation and benefits',
      ],
    ],
  ),
  p(
    'Other charts worth recognising: migration from the EU fell after the 2016 Brexit referendum, and house prices rose strongly in 2021 as people looked to buy larger homes during and after the pandemic.',
  ),
  tip(
    'For any chart, do three things in order: say what the data show (with figures from the chart), give the reason, then say what it implies for the objective. The marks are for the middle step.',
  ),
)

/* ================================================ CIRCULAR FLOW AND MULTIPLIER */

const circularFlow = chapter(
  h('The simplest model: a closed economy with no government'),
  p(
    'Start with the most stripped-down version: no international trade and no government, just households and firms. Households own ALL the factors of production and supply them to firms (labour, capital, land and enterprise); in return they receive factor incomes (wages, interest, rent and profit). Firms use those factors to produce goods and services, which households buy with their income.',
  ),
  p(
    'In this model every pound of income is spent on domestic output, so the flow is constant. Real economies are not like this, which is what the leakages are for: income that is not spent on domestic consumption has been SAVED, TAXED or spent on IMPORTS.',
  ),
  h('Why GDP can rise even when imports grow faster than exports'),
  worked(
    'Imports are growing more quickly than exports in the UK, yet real GDP rises. Use the circular flow to explain how.',
    'A faster rise in imports than exports widens the trade deficit, which on its own is a net leakage. But national income rises whenever TOTAL injections exceed TOTAL withdrawals. If investment and government spending (plus exports) rise by more than saving, taxation and imports, the flow expands and real GDP grows. The trade deficit is one leakage among several, not the only item on the scale.',
  ),
  tip(
    'The test for whether the economy is growing, shrinking or standing still is the comparison of total injections (I + G + X) with total withdrawals (S + T + M). When they are equal national income is unchanged, because the same amount of income is circulating round and round.',
  ),

  h('Three ways to measure national income'),
  p(
    'The circular flow shows that the same total can be counted at three points: as it is produced, as it is spent and as it is earned.',
  ),
  table(
    ['Method', 'What it adds up', 'Example in an economy that only makes golf clubs'],
    [
      ['Output', 'The total value of goods and services produced', 'The value of all the golf clubs produced'],
      ['Expenditure', 'All spending: consumer spending, private investment, government purchases (and net exports)', 'Consumers\' spending on golf clubs'],
      ['Income', 'All income received: wages, rent, interest and profit', 'The income the owners and workers receive from selling the golf clubs'],
    ],
  ),
  p(
    'All three must give the same answer, because every pound spent on a good is also a pound of income for whoever produced it: output = expenditure = income. To avoid counting the same thing twice, only FINAL goods and services (or the value added at each stage) are included, never the intermediate goods that are used up in making them.',
  ),

  h('Where the multiplier came from, and a tax cut worked through'),
  p(
    'The multiplier became important in the 1930s, when Keynes proposed it as a way of maintaining high employment: an injection of new demand creates further rounds of spending, so the effect on output and employment is bigger than the injection itself.',
  ),
  worked(
    'The government cuts income tax. Show the effect on AD and AS and explain why AD may shift by more than your first analysis.',
    'The cut raises real disposable income, so consumption and AD shift right from AD1 to AD2, raising output from Y1 to Y2 and the price level from P1 to P2. That is only the first round. Higher output means firms\' profits rise, giving them the confidence to invest. Because labour is a derived demand, more output also means more people employed and earning wages rather than claiming benefits. That extra income is spent in turn, so AD shifts a second time, from AD2 to AD3: the multiplier effect.',
  ),
  p(
    'The same circular flow shows why an increase in income need not lead to an equal increase in domestic consumption: some of it is SAVED, some TAXED and some spent on IMPORTS. These are the withdrawals that limit the multiplier.',
  ),

  h('What decides the size of the multiplier'),
  p('The multiplier is large when the marginal propensity to withdraw (MPW) is low, so most of each round is re-spent at home.'),
  table(
    ['Component', 'When the multiplier is larger', 'Further points'],
    [
      ['Marginal propensity to save (MPS)', 'When MPS is LOW', 'MPS is low when confidence is high (a high MPC). A rise in interest rates tends to raise MPS by making saving more rewarding'],
      ['Marginal rate of tax (MRT)', 'When MRT is LOW', 'Progressive taxes mean MRT rises with income, which dampens the multiplier as the economy expands'],
      ['Marginal propensity to import (MPM)', 'When MPM is LOW', 'MPM tends to rise with income because imports have a positive income elasticity of demand, so the multiplier shrinks as incomes grow'],
    ],
  ),
  worked(
    'For every extra £100 of income, 10% is saved, 20% is taxed and 20% is spent on imports. Find the MPW and the final effect of a £400m boost to government spending.',
    'MPW = 0.1 + 0.2 + 0.2 = 0.5. Multiplier = 1 ÷ 0.5 = 2. Final change in income = £400m × 2 = £800m. The same logic explains why a government spending increase is beneficial in practice: it creates jobs, the wages are spent and raise consumption, that raises AD again, and because labour is a derived demand firms hire further workers, starting another round.',
  ),

  h('Average against marginal propensities'),
  p(
    'The multiplier uses MARGINAL propensities - what happens to an extra pound of income. The AVERAGE propensities describe the whole of income instead.',
  ),
  defn(
    'Average propensity to withdraw (APW)',
    'The ratio of total withdrawals to total income: APW = APS + APT + APM, where APS = savings ÷ income, APT = tax ÷ income and APM = import spending ÷ income.',
  ),
  worked(
    'Steve earns £400 a week. He pays £80 in tax, saves £100 and spends £40 on luxury goods from abroad. Calculate his average propensities to save, to tax and to import, and his APW.',
    'APS = 100 ÷ 400 = 0.25. APT = 80 ÷ 400 = 0.2. APM = 40 ÷ 400 = 0.1. APW = 0.25 + 0.2 + 0.1 = 0.55, so 55% of his income leaves the circular flow.',
  ),
  worked(
    'A person\'s income rises from £30,000 to £41,000 and their annual saving rises from £3,500 to £4,200. Calculate the marginal propensity to save.',
    'MPS = change in saving ÷ change in income = £700 ÷ £11,000 = 0.06. Of each extra pound earned, about 6p is saved.',
  ),
  det(
    'Can the average propensity to save be negative?',
    'Yes, when people spend more than they earn.',
    [
      'APS shows the proportion of TOTAL income that is saved; MPS shows how much of EXTRA income is saved.',
      'If income is £1,000 and consumption is £1,200, saving is −£200 (dissaving, financed by borrowing or running down savings).',
      'APS = −200 ÷ 1,000 = −0.2.',
    ],
    'Dissaving cannot continue indefinitely: it needs savings to run down or credit to be available, which is why consumption driven by borrowing is a fragile source of demand. MPS, by contrast, is normally positive because it measures only the response to a change in income.',
  ),
)

/* =============================================== COMPONENTS OF AGGREGATE DEMAND */

const componentsOfAD = chapter(
  h('Why the AD curve slopes downwards'),
  p(
    'AD is inversely related to the price level: a rise in the price level causes a CONTRACTION of AD and a fall causes an EXTENSION. The reason is different from the one for an ordinary demand curve. When the price of one good falls, people switch towards it from other goods because it has become relatively cheaper. Along the AD curve the price level is falling in ALL markets at once, so there are no relative price changes and no substitution between goods. Three other effects do the work:',
  ),
  table(
    ['Effect', 'How a FALL in the price level raises AD'],
    [
      ['Wealth effect', 'A lower price level raises the purchasing power of money and savings, so people can afford to buy more goods and services'],
      ['Interest rate effect', 'A lower price level means less borrowing and money are needed for the same purchases, which tends to lower interest rates and so raises consumption and investment (a RISE in prices has the reverse effect)'],
      ['International trade effect', 'Domestic goods become cheaper relative to foreign goods (assuming foreign prices are unchanged), so exports rise and imports fall, improving net exports'],
    ],
  ),
  det(
    'Movement along the AD curve against a shift of it',
    'The two have different causes and must not be confused.',
    [
      'A change in the PRICE LEVEL moves the economy along a given AD curve.',
      'A change in any determinant of C, I, G or (X − M) other than the price level SHIFTS the whole curve.',
    ],
    'The three effects above are weaker in practice than the textbook suggests: central banks set interest rates in response to inflation rather than letting them move automatically, and under a floating exchange rate the currency may move to offset changes in relative prices, limiting the trade effect.',
  ),
  worked(
    'For each scenario, say whether AD rises or falls and which component is affected. (1) Unemployment rises. (2) The government spends £200m on a new hospital. (3) The top rate of income tax is cut to 45%. (4) The interest rate is cut from 0.5% to 0.25%.',
    '(1) AD FALLS: consumption falls (lower income and confidence) and investment falls (lower expected returns as demand weakens). Note that benefit payments are transfers and so do not count as G. (2) AD RISES: government spending, a direct purchase of output, increased by the £200m (and then by the multiplier). (3) AD RISES, modestly: consumption rises as disposable income rises, and investment may rise through better expected returns, though high earners have a low MPC so the effect is limited. (4) AD RISES, modestly: lower borrowing costs and mortgage payments raise consumption, and cheaper finance and better expectations raise investment, though from a rate that was already very low.',
  ),

  h('What else decides the level of government spending'),
  table(
    ['Determinant', 'Explanation', 'Why it might not hold'],
    [
      ['The level of market failure', 'If the government judges that markets are failing it spends more to correct them, for example on street lighting or free healthcare', 'This is a value judgement: different governments see different amounts of market failure'],
      ['International circumstances', 'War and security threats can push spending up sharply for a period', 'Spending may be financed by borrowing, with consequences later'],
      ['Ideological priorities', 'A government that prioritises low inflation or low borrowing will not spend excessively; one less concerned with inequality will spend less on benefits and public provision', 'Priorities change with governments and with events'],
      ['The aim to please voters', 'Politicians spend more before an election to win support', 'Voters may punish visible pre-election spending, and borrowing has to be repaid'],
    ],
  ),
  p(
    'Why might government spending be a higher share of AD in the UK than in the USA? A larger public sector (the "big state"), such as a tax-funded national health service; the age structure of the population, with more demand for pensions and healthcare; and a stronger aim to redistribute income.',
  ),

  h('Net exports: three more reasons the exchange rate effect may not hold'),
  p(
    'Net exports make a POSITIVE contribution to AD in a trade surplus (exports exceed imports) and a NEGATIVE one in a deficit. An appreciation raises the foreign-currency price of exports and lowers the sterling price of imports, which worsens net exports. But:',
  ),
  ul([
    'BRAND LOYALTY and INERTIA: British consumers may continue to buy British goods, such as food from British farmers, even when imports become cheaper.',
    'CONTRACTS: firms may be locked into existing contracts, so cannot switch to cheaper imports in the short run.',
    'INFORMATION FAILURE: consumers may be unaware that foreign goods have become cheaper.',
  ]),
)

/* =========================================== CONSUMPTION, SAVINGS AND INVESTMENT */

const consumptionSavingsInvestment = chapter(
  h('The permanent income hypothesis (Friedman, 1957)'),
  defn(
    'Permanent income hypothesis',
    'Consumers base their spending on their PERMANENT income, the level they expect to be able to sustain over a long period (five to ten years), not on changes in current income. If a rise in income is believed to be temporary, they will not change their consumption habits.',
  ),
  p(
    'The workers most likely to experience changes in income are the self-employed and others with irregular earnings. For them, a good year does not necessarily signal a permanently higher income.',
  ),
  worked(
    'An 18-year-old footballer signs a first one-year contract with a club and his salary seems huge. Why would it be irrational to increase his consumption massively?',
    'The contract may not be renewed, and an injury or loss of form could end the income altogether, so his permanent income is much lower than this year\'s. Many footballers who spent as though the high income were permanent have ended up bankrupt. A rational consumer saves most of a temporary rise to smooth spending.',
  ),
  p(
    'One implication is that a TEMPORARY tax cut or one-off rebate is likely to raise consumption by less than a PERMANENT one, because households save much of the temporary gain.',
  ),
  table(
    ['Limitation', 'Explanation'],
    [
      ['Low against high incomes', 'Low-income households are under far heavier pressure to consume out of any extra income, so they cannot smooth in the way the theory assumes'],
      ['Windfalls', 'An unexpected bonus is quite likely to be spent, perhaps to celebrate, even though it is temporary'],
      ['Subjectivity', 'Some people regard a rise in income as permanent and others regard the same rise as temporary, so predicting the effect is hard'],
    ],
  ),

  h('How plausible is the life cycle hypothesis?'),
  p('The extent to which the life cycle hypothesis explains behaviour depends on who is being considered:'),
  table(
    ['Factor', 'Effect on how well the theory fits'],
    [
      [
        'High income against low income',
        'High earners are more likely to have the financial knowledge and the luxury of being able to save for the future. Low earners have less disposable income to save and may have resorted to loans',
      ],
      [
        'Developed against developing economy',
        'Saving to smooth consumption over a lifetime matters most in developing countries, where there is little state pension or means-tested support. In a developed economy generous means-tested benefits for the old can discourage saving, because lower savings lead to more social security payments',
      ],
    ],
  ),

  h('Gross and net investment'),
  defn(
    'Gross investment',
    'The total amount the economy spends on new capital. It includes the investment needed just to replace worn-out or obsolete capital.',
  ),
  defn('Net investment', 'Gross investment minus capital depreciation.'),
  p(
    'Only NET investment adds to the capital stock and so to productive capacity. If gross investment exceeds depreciation, net investment is positive and firms can meet rising demand in future.',
  ),
  p(
    'Capital depreciates through wear and tear, breakdowns (and the spending on repairs they bring) and technical obsolescence, when newer equipment makes the old unprofitable to use.',
  ),
  worked(
    'In its first year a firm buys £2m of machines. In its second year one machine worth £0.5m breaks down and the firm spends £1.3m on new machines. Calculate gross and net investment in each year.',
    'Year 1: no depreciation, so gross investment = net investment = £2m. Year 2: gross investment = £1.3m, depreciation = £0.5m, net investment = £0.8m. At the end of year 2 the firm has £2.8m of working machines (£2m − £0.5m + £1.3m).',
  ),
  worked(
    'A business spends £500,000 on an electric van fleet, replacing diesel vans valued at £150,000. A separate factory burns down, causing a £400,000 loss, and is rebuilt for £400,000. Find gross and net investment in each case and the implication.',
    'Vans: gross investment £500,000, net investment £500,000 − £150,000 = £350,000. Factory: gross investment £400,000, but the £400,000 depreciation (the loss) cancels it, so net investment is £0. The firm spent £400,000 and has exactly the capacity it had before: no increase in the capital stock, so no contribution to potential growth.',
  ),

  h('More on what drives investment'),
  p(
    'When deciding whether to invest, a firm asks what the price and demand for the product made with the new capital will be (a larger factory is only worthwhile if the output sells) and whether it will make the firm more efficient, for example through economies of scale. It invests when the expected return exceeds the cost.',
  ),
  det(
    'Income at home and abroad',
    'A rise in real disposable income raises the demand for goods and so the case for investing to meet it.',
    [
      'Higher real disposable income at home raises demand for firms\' output.',
      'Higher real income abroad raises demand for exports, encouraging export-oriented firms to expand.',
    ],
    'Firms must believe consumers will actually spend the extra income, that the rise is permanent, and that existing equipment could not already produce the extra output. If not, they will not invest.',
  ),
  det(
    'Capacity utilisation',
    'Firms operating close to full capacity are more likely to invest, because they cannot meet extra demand without more capital.',
    ['With spare capacity, extra demand is met from existing plant and there is no need to buy more.'],
    'If expectations are weak, even a firm near capacity may simply get by with overtime or delay orders rather than commit to expensive capital.',
  ),
  ul([
    'GOVERNMENT INFRASTRUCTURE spending can raise firms\' confidence to invest. A major rail project such as Crossrail (now the Elizabeth line) brings more footfall to the stations it serves, makes it quicker for workers to reach jobs so firms have a wider pool of labour, and raises productivity.',
    'COMPETITIVE FUNDAMENTALS: in some industries firms must hold the best product-specific capital simply to keep their efficiency and stay competitive on both price and non-price grounds, so investment is a necessity rather than a choice.',
    'FINANCE: firms can fund investment from previous profits, or borrow, where lower interest rates reduce the cost.',
  ]),
)

/* ============================================== AGGREGATE SUPPLY AND EQUILIBRIUM */

const aggregateSupply = chapter(
  h('Short-run aggregate supply in more detail'),
  defn(
    'Short-run aggregate supply (SRAS)',
    'How much output firms are prepared to supply in the short run at any given overall price level.',
  ),
  ul([
    'SRAS slopes upwards because at higher price levels across the economy firms want to produce more in order to maximise profit.',
    'In the short run firms cannot change their quantity of land, capital or enterprise, and technology is constant, but they CAN use the existing factors more intensely. A higher price level encourages them to offer higher wages to bring in more workers and to pay existing workers to work extra hours.',
    'The curve does not run through the origin: output will not be supplied for nothing, so a positive price level (reflecting scarcity and, for labour, the minimum wage) is needed before anything is produced.',
    'The only thing that moves SRAS is a change in the COST of production at each price level. A rise in costs shifts it left; a fall shifts it right.',
  ]),
  h('More factors that shift SRAS'),
  table(
    ['Factor', 'Why it matters'],
    [
      ['Raw materials', 'Key inputs for many firms, such as oil. Their prices are volatile, supplies are limited and many are imported'],
      ['Wages', 'The largest cost for most firms. Wages are lower in many developing countries, where the cost of living is lower and there is less regulation such as a minimum wage'],
      ['The exchange rate', 'Matters most for firms that rely on imported materials, energy or components, which means those in the secondary sector. An APPRECIATION makes imports cheaper and lowers costs'],
      ['Government regulation', 'New environmental or health and safety rules raise costs because firms must upgrade to meet the standard'],
      ['Protectionism', 'A cut in tariffs lowers costs for firms that import parts of the production process; a rise in tariffs raises them'],
    ],
  ),
  det(
    'Is the wage still the main cost for firms?',
    'For many firms, less than it used to be.',
    [
      'Technological progress has made many industries more capital-intensive and less labour-intensive, agriculture being one example.',
      'Total wage costs therefore fall as a share of costs, so wage rises feed through to the price level less strongly than in the past.',
    ],
    'Labour remains the dominant cost in service sectors such as hospitality, care and education, so the importance of wages varies greatly between industries.',
  ),

  h('Two schools of thought on long-run aggregate supply'),
  p(
    'Economics is a social science, and economists have built different, often conflicting, models of the same problem, called schools of thought. Which one you use changes your evaluation of policy.',
  ),
  det(
    'The neo-classical view',
    'If there are no market imperfections the economy always operates at full capacity.',
    [
      'All factors of production are fully and efficiently employed, so the LRAS curve is vertical.',
      'It shifts only when the QUANTITY or QUALITY of the factors of production changes.',
      'Any unemployment is temporary: wages fall, firms find it profitable to hire more workers and full employment is restored automatically.',
    ],
    'The theory depends on wages and prices being flexible. In practice they often are not, and recessions have lasted years, which is the criticism Keynes made.',
  ),
  det(
    'The Keynesian view (John Maynard Keynes, 1883 to 1946)',
    'The economy does not always self-adjust to full employment.',
    [
      'Keynes challenged the neo-classical view during the Great Depression of the 1930s; his ideas were set out in The General Theory of Employment, Interest and Money (1936), and by the late 1930s many Western countries had adopted more government management of their economies.',
      'He argued that money wages are STICKY DOWNWARDS, so a pool of unemployed workers need not cause wages to fall, and unemployment can persist.',
      'He argued for government spending to offset low business confidence (animal spirits) and generate jobs, with the multiplier amplifying the effect.',
    ],
    'Keynesian policy depends on there being spare capacity and on the government being able to finance the spending. Near full capacity, extra demand is simply inflationary.',
  ),
  p('Why workers will not accept pay cuts in a period of high unemployment:'),
  ul([
    'trade union power;',
    'existing contracts that fix wages;',
    'firms themselves being reluctant to cut pay because of the damage to morale and productivity.',
  ]),
  table(
    ['Section of the Keynesian AS curve', 'Shape', 'Why'],
    [
      [
        'Keynesian',
        'Perfectly elastic (horizontal)',
        'With low output and high unemployment, firms can raise output with NO rise in prices by employing previously unemployed workers at the going wage, buying materials and equipment at the going price. There is no competition for factors because there is so much spare capacity',
      ],
      [
        'Intermediate',
        'Upward sloping',
        'As output rises resources become scarcer. Firms must use less efficient workers or machinery, or compete for the efficient ones, so costs and the price level rise',
      ],
      [
        'Classical',
        'Perfectly inelastic (vertical)',
        'All factors are fully and efficiently employed. Output cannot rise further however high the price level goes, because there is no spare capacity left',
      ],
    ],
  ),
  p(
    'The whole curve shifts right when the quantity or quality of factors rises in the long run. For example, raising the retirement age increases the labour force and so productive capacity.',
  ),
  table(
    ['Policy to raise productive capacity', 'How it works'],
    [
      ['Education and training', 'Improves OCCUPATIONAL mobility and the quality of labour'],
      ['Reform of the tax and benefit system', 'Increases the incentive to take work'],
      ['Infrastructure', 'Improves GEOGRAPHICAL mobility and lowers firms\' costs'],
      ['Subsidies for firms', 'Funds research and development to unlock technological progress'],
      ['Immigration', 'Increases the size of the labour force'],
    ],
  ),

  h('Macroeconomic equilibrium'),
  p(
    'Macroeconomic equilibrium occurs where AD equals AS, giving an equilibrium price level (P1) and level of real output (Y1). Using the Keynesian curve:',
  ),
  ul([
    'AD shifts RIGHT: output rises (growth), unemployment falls because labour is a derived demand, and the price level rises, so the growth is partly inflationary. How much goes into output and how much into prices depends on the SPARE CAPACITY available.',
    'This is the trade-off in any demand-led expansion: higher output and lower unemployment at the cost of higher inflation.',
  ]),
  table(
    ['Change', 'Outcome'],
    [
      [
        'AS grows FASTER than AD',
        'The gap between output and full capacity widens (a negative output gap). Stocks build up unintentionally, firms cut production and, since labour is a derived demand, cut jobs: DEMAND-DEFICIENT unemployment. The price level falls',
      ],
      ['AS grows at the SAME rate as AD', 'The economy enjoys higher output without inflationary pressure: the price level is unchanged'],
      ['AS grows MORE SLOWLY than AD', 'Output rises but the economy is overheating, with a higher price level'],
    ],
  ),
  p(
    'Over time AD and AS normally both rise: consumption and investment grow most years, and innovation and better education expand AS. Some policies shift BOTH curves at once. Spending on infrastructure raises AS (workers gain skills and goods are transported faster, lifting productivity) and raises AD (firms gain the confidence to invest, foreign direct investment may be attracted, and the wages paid to those building it are spent).',
  ),
  worked(
    'Using the Keynesian approach, when is government spending most effective, and how should it be financed?',
    'When there is significant spare capacity, because output can then rise without inflation. After a recession, expansionary fiscal policy is appropriate. Keynes argued it should be financed by BORROWING, because the debt can be repaid out of the extra tax revenue once the economy is growing again.',
  ),
  det(
    'The neo-classical (laissez-faire) macroeconomic equilibrium',
    'Disequilibrium from full employment is only a short-run phenomenon: the economy rapidly converges back to full-employment output.',
    [
      'A FALL in AD (for example from lower consumption): wages are flexible downwards, and workers would rather take a pay cut than be made redundant. Lower prices also mean a nominal pay cut does not reduce purchasing power. Costs fall, SRAS shifts RIGHT, output stays at the full-employment level and the fall in AD has been purely DEFLATIONARY.',
      'A RISE in AD beyond capacity: possible only briefly, through overtime and overworking capital (skipping maintenance). Prices rise unexpectedly while real wages fall. Workers eventually adjust their expectations and demand higher nominal wages when contracts are renegotiated, so SRAS shifts LEFT, output returns to full capacity and the rise in AD has been purely INFLATIONARY.',
      'The conclusion: markets work best when left alone, there is no long-run unemployment, and extra government spending only causes inflation.',
    ],
    [
      'The adjustment can take years if wages are sticky, and during that time output and jobs are lost. This is the Keynesian criticism.',
      'Neo-classical growth comes from shifting BOTH SRAS and LRAS to the right: a rise in productivity lowers unit costs (SRAS right) and raises productive capacity (LRAS right).',
    ],
  ),
)

/* ================================================================ OUTPUT GAPS */

const outputGaps = chapter(
  h('Why each kind of output gap is a problem'),
  table(
    ['', 'Negative output gap', 'Positive output gap'],
    [
      ['Meaning', 'Actual GDP is BELOW potential GDP', 'Actual GDP is ABOVE potential GDP'],
      [
        'Why it is a problem',
        'Resources are idle, so unemployment is higher than it need be. If the cause is falling AD, the derived demand for labour falls and the price level may fall (deflation)',
        'Output beyond potential can only be sustained in the SHORT run, by using factors more intensively. A rising price level makes workers demand higher wages, shifting SRAS left and returning output to full employment at a HIGHER price level: a wage-price spiral',
      ],
      [
        'Likely policy response',
        'Expansionary DEMAND-side policy',
        'Contractionary demand-side policy, or supply-side policy to raise potential output',
      ],
    ],
  ),
  p(
    'The positive gap is greatest at the PEAK of the cycle and the negative gap is greatest at the TROUGH.',
  ),
  det(
    'Drawing output gaps',
    'The same idea appears differently on each diagram.',
    [
      'On a PPF a NEGATIVE gap is a point INSIDE the frontier (idle resources); a positive gap is a point just beyond it, possible only briefly because resources are being over-used.',
      'On the economic cycle the gap is the vertical distance between the actual path and the trend line.',
      'On a KEYNESIAN AD/AS diagram you can show a negative gap (equilibrium on the horizontal or rising section, short of the vertical section), but not a positive one, because the curve is vertical at full capacity so output cannot exceed it. A positive gap needs the SRAS and LRAS diagram, where the SRAS equilibrium can sit to the right of the vertical LRAS.',
      'An increase in POTENTIAL GDP shifts the vertical (full capacity) section of the Keynesian curve to the right, or the neo-classical LRAS to the right.',
    ],
    'A positive gap is a feature of the neo-classical short-run model rather than a state the Keynesian curve can describe, so say which model you are using.',
  ),

  h('Evaluating how much output gaps matter'),
  p(
    'Output gaps, particularly negative ones, are generally thought to be bad, but economists disagree about how harmful they really are. The answer depends on three things.',
  ),
  table(
    ['Factor', 'Explanation'],
    [
      [
        'The school of thought',
        'In the NEO-CLASSICAL view a negative gap matters little: disequilibrium unemployment is quickly resolved as wages fall and SRAS shifts right, restoring full employment. In the KEYNESIAN view a negative gap can be extremely damaging, because a NEGATIVE multiplier turns a fall in spending into a deep recession and the damage may become permanent through HYSTERESIS',
      ],
      [
        'The cause of a positive gap',
        'If it comes from debt-fuelled consumption it is unsustainable and merely inflationary. If it comes from higher government spending on things like infrastructure, there is a prospect of LRAS rising too, so the higher output can be sustained',
      ],
      [
        'How long the change in AD lasts',
        'A negative gap caused by a brief contraction along AD, after prices rise because an external shock shifted SRAS left, is not very harmful: it does not last and the impact is not severe. One caused by a severe collapse in business and consumer confidence can be long-lasting and, on the Keynesian view, lead to hysteresis',
      ],
    ],
  ),
)

/* =============================================================== UNEMPLOYMENT */

const unemployment = chapter(
  h('Definitions and measures in full'),
  defn('Employment', 'People working for firms or other organisations, or who are self-employed.'),
  defn('Labour force', 'Everyone who is employed or unemployed: the ECONOMICALLY ACTIVE.'),
  p(
    'People outside the labour force are not unemployed. They are either outside working age (broadly 16 to 65) or of working age but not looking for work, such as homemakers, people with disabilities, full-time students, carers and early retirees. Together these are the economically inactive.',
  ),
  defn(
    'Labour force participation rate',
    'The percentage of the working-age population that is in the labour force (employed or unemployed). Participation rate = labour force ÷ working-age population × 100.',
  ),
  p(
    'The age range used is often adjusted. Looking only at 25 to 54 year olds, for example, removes students and early retirees and so shows women\'s participation more clearly. Comparing the UK and the USA, participation rates were similar around 1999 but the UK\'s has been higher since, up to the early 2020s. Women\'s participation is lower than men\'s but has risen steadily in Britain.',
  ),
  worked(
    'At the end of 2019 there were 31.1 million people in employment and 1.311 million unemployed. Calculate the unemployment rate.',
    'Labour force = 31.1m + 1.311m = 32.411m. Unemployment rate = 1.311 ÷ 32.411 × 100 = 4.04%.',
  ),
  worked(
    'In January 2022 the UK economic inactivity rate was 21.5% and the labour force was 34.5 million. Calculate the number of economically inactive people.',
    'The activity rate is 100 − 21.5 = 78.5%, so the 34.5m labour force is 78.5% of the working-age population. Working-age population = 34.5 ÷ 0.785 = 43.95m. Inactive = 43.95m × 0.215 = 9.45 million.',
  ),
  table(
    ['Measure', 'Further detail', 'Who it misses or includes wrongly'],
    [
      [
        'Labour Force Survey',
        'Counts a person as unemployed if they are out of work, want a job, have looked for work in the last four weeks and could start within two weeks - or are out of work, have found a job and will start within two weeks',
        'Includes some people who say they are seeking work but are not really prepared to work. As a sample survey its estimate may be inaccurate',
      ],
      [
        'Claimant count',
        'A monthly count of those claiming unemployment-related benefit',
        'Misses many genuinely unemployed people who are not eligible or choose not to claim, a particular problem in countries without an established benefits system',
      ],
    ],
  ),
  p(
    'The gap between the two measures has widened over time because the rules for claiming have been tightened many times since 1979. The claimant count therefore leaves out:',
  ),
  ul([
    'people in full-time education and retirees;',
    'people who have not paid enough National Insurance contributions;',
    'people whose savings, or whose partner\'s income, are too high to qualify;',
    'people who are eligible but do not claim, for example because of stigma;',
    'people judged not to be searching hard enough (applications, letters);',
    'people returning to work after a break, and people looking only for part-time work;',
    'the LONG-TERM unemployed who have given up searching, who are unemployed in any sensible meaning of the word.',
  ]),

  h('More on structural, frictional and seasonal unemployment'),
  det(
    'Case study: coal mining',
    'Structural unemployment is concentrated where one industry dominated.',
    [
      'The UK had around a million miners in the 1920s and fewer than 5,000 now.',
      'As manual workers they often had no formal qualifications and strong ties to their mining towns, so they were both OCCUPATIONALLY and GEOGRAPHICALLY immobile.',
    ],
    'Structural unemployment can occur even during strong growth, because growth in other sectors does not create jobs for people whose skills do not match them or who cannot move.',
  ),
  p(
    'Structural unemployment can also be driven by changes in how we work and shop. The Office for Budget Responsibility has said that structural unemployment has been rising since the pandemic. Plausible reasons are working from home, less business travel and the shift to online retail, all of which reduce demand for workers in some sectors and places.',
  ),
  det(
    'Are older or younger workers more at risk of structural unemployment?',
    'Older workers, for several reasons.',
    [
      'Their jobs are more likely to be replaced by technology.',
      'They are less likely to return to education and retrain.',
      'They are less able to move to find work, particularly if they own a home; in the financial crisis many were in negative equity.',
      'They may be unwilling to accept a lower-paid job.',
      'They may face age discrimination from employers.',
    ],
    'Younger workers face a different risk: they are more exposed to cyclical unemployment because firms stop hiring first, and a long spell of youth unemployment can scar lifetime earnings.',
  ),
  det(
    'Reducing seasonal unemployment: the example of ski resorts',
    'The aim is to create demand for labour in the off-season.',
    [
      'Market the area as a summer destination: hiking, white-water rafting, cycling.',
      'The government can create off-season jobs, such as building infrastructure like ski lifts.',
      'Temporary migration, such as students working as chalet hosts, means that local workers are not left without a seasonal job.',
    ],
    'Seasonal employment still leaves workers with irregular income against regular bills, so some will move to more stable work elsewhere, depleting the local workforce.',
  ),
  det(
    'Would cutting unemployment benefits reduce frictional unemployment?',
    'Probably, but at a price.',
    [
      'Lower benefits make working relatively more attractive, so people take jobs sooner. That also reduces HYSTERESIS, the way long spells out of work make people harder to employ.',
      'Better information on vacancies reduces frictional unemployment by speeding up job matching.',
    ],
    'Benefits are also what allow people to search for a suitable job without falling into poverty, so cutting them too far may lead to worse job matches, lower productivity and greater hardship. The outcome depends on how generous benefits are to begin with.',
  ),
  det(
    'Why tourism and agriculture are exposed to exogenous shocks',
    'Many developing economies depend heavily on both sectors.',
    [
      'Tourism: terrorist attacks, global recessions that cut incomes abroad, pandemics.',
      'Agriculture: volatile output and prices from drought or adverse weather.',
    ],
    'The effect is magnified in developing economies because a large share of workers are already close to poverty and there is little social security to cushion them.',
  ),

  h('Underemployment and signs of full employment'),
  defn(
    'Underemployment',
    'Where a person is working but their job does not fully use their skills, or does not provide enough hours or pay to meet their needs.',
  ),
  p(
    'Underemployment is a problem because workers are producing below their potential. It also means the headline unemployment rate can look healthy while productive capacity and living standards are lower than they appear.',
  ),
  p(
    'Evidence that the UK was close to full employment when unemployment was 3.8% in April 2022 included pay rises for lorry drivers because of a shortage of drivers, and long queues and cancelled flights at airports from a shortage of staff with the required security clearance.',
  ),

  h('The positive consequences of full employment'),
  table(
    ['Consequence', 'Explanation'],
    [
      ['Productive efficiency', 'Fuller use of resources increases output and income: the economy moves towards its PPF'],
      ['Higher living standards', 'More income and more goods and services, and lower poverty, since lack of work is a major cause of poverty'],
      ['A better fiscal position', 'Less spending on benefits and on the costs of anti-social behaviour, and more income, indirect and corporation tax'],
      ['Support for development', 'Higher incomes and spending raise tax revenue that can go to education and healthcare'],
      [
        'Actual growth feeding potential growth',
        'A shortage of workers pushes up wages. Firms may respond by training staff to raise productivity, and higher wages draw more people into the labour force. Both shift LRAS right, so growth becomes non-inflationary',
      ],
    ],
  ),
  p('Two further drawbacks of full employment, alongside those already listed:'),
  ul([
    'PRODUCTIVITY may fall. If workers cannot easily be replaced they may slacken off; when unemployed people are available to take their jobs, existing workers are motivated to work harder.',
    'WORK-LIFE BALANCE may worsen. If firms cannot hire more staff, they may ask existing workers to work longer hours.',
  ]),
  p(
    'Whether full employment is beneficial depends on whether it can be achieved without inflation or a worsening current account deficit, and with well-paid, high-skilled jobs. More education and training can help, by raising productivity and encouraging innovation, so the economy can reach full employment without inflation.',
  ),
  p(
    'Cyclical unemployment can also be seen as having one benefit: a fall in AD reduces pressure on the price level, and lower inflation can in turn improve international competitiveness.',
  ),
)

/* ================================================================= INFLATION */

const inflation = chapter(
  h('Hyperinflation, and telling the terms apart'),
  defn('Hyperinflation', 'Inflation at extreme or excessive rates, so high that money stops working as a store of value.'),
  p(
    'In Zimbabwe in November 2008 inflation was estimated at around 79.6 billion per cent a month, roughly 98% a DAY. Prices changed so fast that firms could not publish them and people refused to hold the currency.',
  ),
  worked(
    'UK inflation was 4.3% in 2007, 4.0% in 2008, −0.5% in 2009, 4.6% in 2010 and 5.2% in 2011. Identify the years of inflation, disinflation and deflation.',
    '2008 is DISINFLATION: the rate fell from 4.3% to 4.0% but prices were still rising. 2009 is both disinflation (the rate fell again) and DEFLATION (the rate is negative, so the price level fell). 2010 and 2011 are INFLATION at a higher and rising rate. Watch the wording: a falling rate is disinflation, only a negative rate is deflation.',
  ),

  h('Index numbers and inflation, worked'),
  worked(
    'The price of wheat ($ per bushel) was 3.05 in 2011, 2.78 in 2012, 2.98 in 2013, 3.12 in 2014, 4.26 in 2015 and 3.86 in 2016. Construct a price index with 2011 as the base.',
    'Index = price ÷ 3.05 × 100, giving 100, 91.15, 97.70, 102.30, 139.67 and 126.56. Wheat prices fell in 2012, passed their 2011 level in 2014, peaked in 2015 at nearly 40% above the base and then eased.',
  ),
  table(
    ['Year', 'Oil price ($ a barrel)', 'Oil index (2015 = 100)', 'UK petrol price (£ a litre)'],
    [
      ['2015', '61.2', '100', '1.118'],
      ['2016', '39.5', '64.5', '1.031'],
      ['2017', '51.4', '84.0', '1.204'],
      ['2018', '65.5', '107.0', '1.206'],
    ],
  ),
  p(
    'The petrol price generally moves in the same DIRECTION as the oil price, but not by the same PROPORTION. Oil fell by over a third in 2016 while petrol fell by under 8%. The reason is that crude oil is only part of what you pay: fuel duty and VAT, refining and retail margins, the exchange rate (oil is priced in dollars) and time lags all intervene. This is one example of cost-push pressure feeding through to consumers, and of why oil shocks are a particular concern: oil is a key input for firms in almost every industry.',
  ),

  h('CPI and RPI: history and use'),
  ul([
    'The RPI was created in 1947 and the CPI in 1996. Because the RPI has been used for so much longer it is useful for analysing long-run changes in inflation.',
    'The UK adopted the CPI as its target measure in December 2003, so that inflation could be compared with other European countries that use the same measure.',
    'The CPI is criticised for leaving out the housing costs of owner-occupiers and council tax, which matters in a country of home-owners. (A later measure, CPIH, adds owner-occupiers\' housing costs.)',
    'The RPI includes mortgage interest payments and leaves out pensioner households and the highest-income households, to better reflect the "average" household, since high-income households spend more and would otherwise carry a heavy weight.',
  ]),
  det(
    'Why do different bodies use different measures?',
    'The RPI is typically higher than the CPI, so the choice favours whoever pays or receives the adjustment.',
    [
      'Historically the RPI has been used to set rail fares and student loan interest. A higher measure means rail companies and the government receive more from users and students.',
      'The CPI has been used to uprate benefits. A lower measure means a smaller rise in what the government pays out.',
      'Trade unions typically cite the RPI in wage negotiations because the higher figure supports a bigger pay claim, and because it includes housing costs which matter to their members.',
    ],
    'The measures can reverse. In 2009 the RPI fell BELOW the CPI because it includes mortgage interest payments and house prices, and both fell sharply as interest rates were cut and house prices dropped after the financial crisis.',
  ),

  h('The causes of inflation in 2022'),
  p(
    'Cost-push inflation tends to be temporary because the things that cause it - raw material prices and exchange rates - are volatile and fall as well as rise. Commonly cited causes of the surge in UK inflation in 2022 were largely supply-side: energy and food prices after the war in Ukraine, supply-chain disruption after the pandemic and trade frictions after Brexit, together with a recovery in demand.',
  ),

  h('More on the benefits of a little inflation'),
  defn(
    'Money illusion',
    'The tendency to think of money in NOMINAL rather than REAL terms: workers feel better off when their pay figure rises even if its purchasing power has not.',
  ),
  p(
    'Money illusion is why mild inflation helps: a firm can give a 2% nominal pay rise while inflation is 3%, cutting real wages without the resistance that a nominal pay cut would provoke. Workers may even work harder in response to the pay rise. With zero inflation, real wages could only fall through nominal cuts, which workers resist, so unemployment would rise instead.',
  ),

  h('Deflation'),
  p(
    'Deflation, a fall in the general level of prices, is rare, but it matters because of what it does to an economy. Its effect depends entirely on its CAUSE.',
  ),
  table(
    ['Cause of deflation', 'Beneficial?', 'Why'],
    [
      [
        'A fall in AD',
        'NO',
        'Real GDP falls. Firms cut production and unemployment rises. Households cut back for fear of unemployment and because they expect prices to fall further',
      ],
      [
        'An increase in AS (Keynesian)',
        'YES',
        'Real GDP rises while prices fall. Consumers get more goods and services and the economy becomes more competitive, for example from better education or technology',
      ],
      [
        'An increase in SRAS (for example lower raw material prices) or in neo-classical LRAS',
        'YES',
        'Lower production costs or greater productive capacity lower the price level while raising output',
      ],
    ],
  ),
  table(
    ['Cost of deflation', 'Explanation'],
    [
      ['Delayed consumption', 'If consumers expect prices to keep falling they delay purchases. Firms invest less, AD, output and employment fall, and falling incomes mean even less spending: a deflationary spiral'],
      ['Higher real cost of borrowing', 'If nominal interest rates do not fall as fast as prices, REAL interest rates rise, deterring investment and activity'],
      ['Debts rise in real terms', 'The real value of debt increases, redistributing income from debtors to creditors'],
      ['Lower confidence', 'Falling asset prices, such as a housing market deflating, damage consumer confidence'],
      ['Lower profits', 'Lower prices mean lower revenue and profits, so firms cut costs by shedding labour, raising unemployment'],
    ],
  ),
  table(
    ['Benefit of deflation', 'Explanation'],
    [
      ['A higher standard of living', 'Lower prices for some goods let consumers keep more of their income and raise their welfare'],
      ['Better competitiveness', 'Falling input prices and technology gains raise productivity and price competitiveness, which matters most for export-driven economies'],
    ],
  ),
  table(
    ['Whether deflation is harmful depends on', 'Why'],
    [
      ['The cause', 'Deflation from higher productivity and better technology lowers prices AND raises real GDP, which is the benign kind'],
      ['The duration', 'A fall in prices caused by SRAS, such as cheaper oil, is likely to be short-lived because such costs are volatile. Persistent falls in AD risk a deflationary spiral'],
      [
        'The price level against competitors',
        'A country with deflation while others have inflation becomes more internationally competitive and exports more. Japan\'s long deflation saw strong exports, which helped offset weak consumer spending, though not enough. If the whole region has deflation, as parts of Europe did in 2014 and 2015, the competitive advantage is lost',
      ],
    ],
  ),
)

/* ============================================================== FISCAL POLICY */

const fiscalPolicy = chapter(
  h('The main UK taxes, and whether each is progressive'),
  table(
    ['Tax', 'What it taxes', 'Type and nature'],
    [
      ['Income tax', 'Earnings above a personal allowance; the largest source of revenue', 'Direct, progressive'],
      ['VAT', 'Most goods and services at a standard rate of 20%; some, such as basic groceries, are exempt', 'Indirect, regressive'],
      ['Excise duties', 'Specific products such as alcohol, tobacco and fuel, at rates that vary by product; consumed disproportionately by low-income households', 'Indirect, regressive'],
      ['Capital gains tax', 'The rise in value of assets such as shares and second homes: a tax on wealth', 'Direct, progressive'],
      ['Corporation tax', 'The profits of firms, as a single percentage (the main rate was raised from 19% to 25% in April 2023)', 'Direct, proportional'],
      ['Inheritance tax', 'The wealth of the deceased: 40% of the value above £325,000', 'Direct, progressive'],
    ],
  ),
  p(
    'The government cares who bears the burden of a tax, because reducing inequality is one of its objectives. Classify a tax by comparing the PERCENTAGE of income paid at different income levels, not the amount. Paying £10,000 on £100,000 and £2,000 on £20,000 is 10% each: proportional. Paying 30% on £100,000 but 5% on £20,000 is progressive. Paying 4% on £100,000 but 10% on £20,000 is regressive, even though the richer person pays more pounds.',
  ),

  h('Average and marginal rates of tax, worked'),
  defn('Average rate of taxation', 'Total tax paid ÷ total income × 100.'),
  defn('Marginal rate of taxation', 'The change in tax paid ÷ the change in income × 100: the rate of tax on the NEXT pound earned.'),
  p(
    'If a rise in income does not cross into a new tax band, the marginal rate is simply the rate for that band. The worked examples use the 2022 to 2023 income tax rates: a personal allowance of £12,570, then 20% up to £50,270, 40% up to £125,140 and 45% above (ignoring, for simplicity, the withdrawal of the allowance at very high incomes).',
  ),
  worked(
    'Dalib earns £15,000. Find his average tax rate, then his marginal rate if his income rises by £10,000.',
    'Tax = (15,000 − 12,570) × 0.2 = £486. Average rate = 486 ÷ 15,000 = 3.24%. At £25,000 tax = (25,000 − 12,570) × 0.2 = £2,486. Marginal rate = (2,486 − 486) ÷ 10,000 = 20%, which is just the basic rate, because both incomes lie in the same band.',
  ),
  worked(
    'Sana earns £48,000 and gets a 5% pay rise while inflation is 9%. Find her average rate before, her marginal rate on the rise and her average rate after.',
    'Before: tax = (48,000 − 12,570) × 0.2 = £7,086, so the average rate is 14.76%. After: pay is £50,400, which crosses into the 40% band, so tax = 37,700 × 0.2 + 130 × 0.4 = £7,592. Marginal rate = (7,592 − 7,086) ÷ 2,400 = 21.08%. New average rate = 15.06%. Her real income FELL (5% against 9% inflation) yet her average tax rate ROSE by 0.3 percentage points.',
  ),
  defn(
    'Fiscal drag',
    'Inflation and earnings growth push more taxpayers into higher tax brackets when thresholds are not raised, so the government\'s tax revenue rises without any change in rates.',
  ),
  worked(
    'Eileen earns £170,000. Find her average tax rate and her marginal rate if her income rises by £10,000, and say what happens to her average rate.',
    'Tax = (170,000 − 125,140) × 0.45 + (125,140 − 50,270) × 0.4 + (50,270 − 12,570) × 0.2 = £20,187 + £29,948 + £7,540 = £57,675. Average rate = 33.93%. She is already in the 45% band, so her marginal rate is 45%. At £180,000 tax is £57,675 + £4,500 = £62,175 and her average rate is 34.54%, up about 0.6 percentage points. Under a progressive tax the marginal rate is above the average rate, so the average rate rises with income.',
  ),
  tip(
    'Thresholds rise over time with inflation, so a question about tax bands may use different numbers. The method does not change: tax the slice in each band at that band\'s rate, add the slices, then divide by income for the average, or compare two totals for the marginal.',
  ),

  h('Automatic stabilisers against discretionary policy'),
  p(
    'In a boom automatic stabilisers restrain AD: people earn more and pay more income tax at unchanged rates (more leakage from the circular flow) and less is spent on unemployment benefits. In a recession the reverse happens: less tax is collected and more is paid out, which limits the fall in AD.',
  ),
  det(
    'Why automatic stabilisers have advantages over discretionary policy',
    'Both aim to smooth the cycle, but they differ in how they behave.',
    [
      'They produce a DEFICIT in a recession and a SURPLUS in a boom, so over a whole cycle debt need not rise.',
      'With discretionary policy there is always the temptation to spend any surplus to please voters.',
      'Discretionary changes have long time lags because they must pass through Parliament.',
      'Stabilisers act automatically, keeping growth much closer to the trend rate.',
    ],
    'Stabilisers only dampen the cycle; they cannot lift a deep recession, which is when deliberate action is needed.',
  ),
  det(
    'Case study: furlough',
    'Discretionary policy at scale, during the coronavirus pandemic.',
    [
      'The government initially paid 80% of the wages of people who could not work, or whose employers could not afford to pay them, up to £2,500 a month. By the end of the scheme it paid 60% and employers paid 20%.',
      'It cost the government nearly £70bn, but the Resolution Foundation judged it a great success, protecting living standards and preventing the catastrophic rise in unemployment many had feared.',
    ],
    'It was very costly and added to borrowing, and some jobs it protected may not have been viable once the scheme ended.',
  ),
  det(
    'Case study: Eat Out to Help Out',
    'A targeted attempt to restore demand in one sector.',
    [
      'In August 2020 customers received 50% off meals, up to £10 each, on Monday to Wednesday, at participating restaurants, pubs and cafes; the venue deducted the discount and reclaimed it from the Treasury.',
      'The aim was to support hospitality and raise high street footfall after months of "stay at home" messages. It applied only to food and soft drinks eaten in, not takeaways.',
    ],
    'Some of the spending would have happened anyway (deadweight), it brought forward demand rather than creating it, and it was open to the criticism that it encouraged social mixing while the virus was circulating.',
  ),

  h('The budget position over the cycle'),
  table(
    ['Position', 'Meaning', 'In the cycle'],
    [
      ['Budget surplus', 'Tax revenue exceeds government spending', 'More likely in a boom: benefit spending falls and tax revenue rises'],
      ['Budget deficit', 'Government spending exceeds tax revenue; financed by borrowing', 'More likely in a recession: benefit spending rises, tax revenue falls, which supports AD'],
      ['Balanced budget', 'Spending equals tax revenue', 'Rarely happens exactly'],
    ],
  ),
  table(
    ['Change', 'Type of fiscal policy', 'Why (ceteris paribus)'],
    [
      ['A widening deficit', 'Expansionary', 'Spending is rising or taxes falling: leakages fall relative to injections'],
      ['A narrowing deficit', 'Contractionary', 'Spending is falling or taxes rising: leakages grow relative to injections'],
      ['A growing surplus', 'Contractionary', 'Spending is falling or taxes rising'],
      ['A shrinking surplus', 'Expansionary', 'Spending is rising or taxes falling'],
    ],
  ),
  p(
    'The deficit that opens in a downturn is a CYCLICAL deficit; one that persists at full employment is STRUCTURAL. Borrowing for capital projects such as HS2 or Crossrail raises AD and, in time, productive capacity, so the result can be NON-INFLATIONARY growth, with AD and LRAS both shifting right.',
  ),

  h('Advantages and limits of fiscal policy: the missing points'),
  table(
    ['Advantage', 'Explanation'],
    [
      ['Improves living standards', 'Spending on benefits or major projects shifts AD right, creating jobs and incomes'],
      ['Crowding in', 'Government spending can encourage private spending. Private development has followed the new Elizabeth line stations'],
      ['Raises productive capacity', 'Education improves the quality of labour, infrastructure the quality of capital, and a higher personal allowance can raise the quantity of labour by increasing participation'],
      ['Can reduce inequality', 'A progressive system, with a higher top rate and a higher personal allowance, narrows the income distribution'],
      ['Corrects market failure', 'Excise duties on demerit goods and goods with negative externalities'],
    ],
  ),
  table(
    ['Limit', 'Explanation'],
    [
      ['It may damage other objectives', 'A tax rise to cut inflation may raise unemployment. Higher taxes on firms reduce investment and competitiveness, worsening the trade balance (though in the short run higher taxes on income may reduce imports). Regressive taxes, and benefit cuts under austerity, fall hardest on low incomes'],
      ['Ceteris paribus may not hold', 'If the UK expands but the USA enters recession, UK exports may fall by enough to offset the stimulus'],
      ['Some spending is inflexible', 'Once a new school or hospital is under way, it is politically hard to stop or change'],
      ['Higher taxes are needed eventually', 'More public spending must be paid for, which affects disposable income and incentives'],
    ],
  ),
  det(
    'Does the type of spending change what happens to debt?',
    'Yes: current and capital spending affect the debt-to-GDP ratio differently.',
    [
      'If extra borrowing pays for CURRENT spending, debt rises while GDP may not, so the debt-to-GDP ratio rises. Lenders then see a riskier borrower and demand higher interest rates.',
      'If extra borrowing pays for CAPITAL spending, GDP rises as capacity grows, so debt rises by less than output and the ratio can fall.',
    ],
    'This holds only if the capital projects really earn a return and are completed on time and budget; large infrastructure projects often overrun in cost and time.',
  ),
  worked(
    'Some UK politicians argued for cutting corporation tax from 19%, when Ireland\'s rate was about 12.5%. (a) How could a cut make UK firms more internationally competitive, and how might it affect government efficiency? (b) Would it raise or reduce revenue?',
    '(a) Firms keep more profit to spend on R&D and investment, raising quality and lowering costs. Tax competition also gives governments an incentive to cut wasteful spending and spend more efficiently. (b) It could REDUCE revenue because each firm pays less on the same profit, or INCREASE it if output, investment and inward FDI rise enough. The result depends on how responsive firms\' location and investment decisions are to the rate.',
  ),
  worked(
    'Evaluate removing the VAT exemption from private school fees (a policy introduced in January 2025).',
    'FOR: it raises revenue; demand for private schooling is likely to be price-inelastic, so revenue holds up; and it is progressive since richer families use private schools more. AGAINST: many parents already save hard to pay fees; and if some children move to state schools, public spending on education rises, offsetting part of the revenue. The size of the net gain depends on how elastic demand turns out to be.',
  ),
)

/* ================================================== PUBLIC EXPENDITURE AND TAXATION */

const publicExpenditure = chapter(
  h('Transfer payments and why spending changes'),
  defn(
    'Transfer payments',
    'Funds given without requiring any goods or services in return, usually distributed by the government to provide individuals with income.',
  ),
  p(
    'Their aim is to provide a minimum standard of living for those on low incomes. Examples are Jobseeker\'s Allowance, Income Support, child benefit and the state pension.',
  ),
  table(
    ['Reason the size and composition of public spending changes', 'Explanation'],
    [
      ['Changing demographics', 'An ageing population raises spending on healthcare and pensions'],
      ['Economic crises', 'In the financial crisis of 2007 to 2008 governments spent large sums bailing out banks. Afterwards many reduced spending to shrink their budget deficits'],
      ['Political ideology', 'Some governments prefer more spending on benefits, others more on defence'],
    ],
  ),
)

/* ======================================================== THE NATIONAL DEBT */

const nationalDebt = chapter(
  h('The debt-to-GDP ratio and why lenders watch it'),
  p(
    'The cash value of debt means little on its own. The debt-to-GDP ratio compares debt with annual output, which is the government\'s tax base. Think of a household: a bank will lend more to someone with a higher income. In the same way investors are more willing to lend to a country with higher output.',
  ),
  p(
    'The danger is a loss of confidence. Once investors worry about repayment they see a higher risk of default and demand a higher interest rate, which raises the cost of the debt. If it rises too far, the economy faces a financial crisis.',
  ),
  det(
    'Case study: the Greek debt crisis',
    'A high ratio, foreign creditors and a loss of confidence reinforced each other.',
    [
      'Much of Greece\'s debt was held by foreign governments and banks, including German banks.',
      'By 2009 its debt-to-GDP ratio had risen above 110%, which provoked fears of default and pushed the interest rate on 10-year government bonds past 35% at the peak.',
      'Greece cut spending and raised taxes to meet its debts, which slowed the economy and made the debt harder to pay down.',
    ],
    'Greece shared a currency with its creditors and so could not devalue or create money to cope, which made its position worse than that of a country with its own currency.',
  ),
  table(
    ['Why national debt is a problem', 'Why it may not be'],
    [
      [
        'Higher debt makes the government a riskier borrower, so interest costs rise sharply, with an opportunity cost in health and education',
        'Borrowing in a recession offsets the rise in private-sector saving, and governments can borrow very cheaply then',
      ],
      [
        'Future generations bear a higher tax burden or lower spending',
        'Borrowing for capital spending can lower the debt-to-GDP ratio if it raises output',
      ],
      [
        'Crowding out of private investment',
        'Austerity can cut growth so much that the deficit stays the same share of GDP',
      ],
      [
        'An ageing population claims more pensions, worsening the structural deficit',
        'Japan\'s debt reached about 257% of GDP in 2020, yet most is held domestically and Japan holds large foreign assets, so the risk of default is low',
      ],
    ],
  ),
  p(
    'One further cost of high debt: the higher interest rates it can bring may attract hot money inflows, which appreciate the currency and hurt exports.',
  ),
)

/* ============================================================ MONETARY POLICY */

const monetaryPolicy = chapter(
  h('Who sets rates, and the rate customers actually pay'),
  p(
    'The Bank of England is the UK\'s central bank. Its main task is to keep CPI inflation at 2%, within a band of one percentage point either side, although on occasion other objectives take priority. Decisions on Bank Rate are made by the nine-member Monetary Policy Committee (MPC), and the Bank became independent of the government in 1997.',
  ),
  p(
    'Commercial banks take deposits and lend them on at a higher rate to make a profit. Their rates follow Bank Rate because they can deposit with and borrow from the central bank, which is the bank to the banks. As a rule they charge borrowers MORE than Bank Rate and pay savers LESS. For example:',
  ),
  table(
    ['Who', 'Rate in the example'],
    [
      ['Central bank sets Bank Rate', '0.5%'],
      ['Commercial banks can borrow from the central bank at', '0.5%'],
      ['Commercial banks pay savers', '0.25%'],
      ['Commercial banks lend to borrowers at', '3%'],
    ],
  ),
  p(
    'The gap between what banks charge and pay is their margin. It is why a change in Bank Rate is passed on only partly and why borrowing rates can stay high when Bank Rate is very low.',
  ),

  h('Inflation targets: symmetric against asymmetric'),
  p(
    'A specific inflation target has two benefits: it reduces inflation expectations, which avoids a wage-price spiral, and it improves consumer and business confidence, which supports growth.',
  ),
  table(
    ['Type of target', 'What it means', 'Example'],
    [
      ['Symmetric', 'Policy-makers must act if inflation falls BELOW target as well as if it rises above it', 'The Bank of England\'s 2% target, with a band of one percentage point either side'],
      ['Asymmetric', 'Action is required only if inflation rises above the target', 'The European Central Bank defined price stability as inflation "below, but close to, 2%" until it adopted a symmetric 2% target in 2021'],
    ],
  ),
  p(
    'A symmetric target is better for the UK because with an asymmetric one policy-makers are tempted to UNDERSHOOT the target, risking deflation and weak growth. The aim is more likely to be met if overshooting and undershooting count as equally bad.',
  ),

  h('Expansionary and contractionary policy: the effect on the objectives'),
  table(
    ['', 'Expansionary (cut in rates)', 'Contractionary (rise in rates)'],
    [
      ['Consumption', 'Borrowing is cheaper, the reward for saving falls and mortgage payments fall, so disposable income and confidence rise', 'Borrowing costs more, saving pays more and mortgage payments rise, so spending falls'],
      ['Investment', 'Banks borrow more cheaply and can pass on lower rates, so firms take out more loans to invest', 'The reverse: dearer loans mean fewer investment projects'],
      ['When it is used', 'In a downturn to stimulate the economy', 'When the economy is overheating, to bring inflation down'],
      ['Effect on objectives', 'Output rises (growth) and unemployment falls because labour is a derived demand, but demand-pull inflation builds as the price level rises', 'The price level falls, reducing inflationary pressure, but output may fall, risking recession and rising unemployment'],
    ],
  ),
  det(
    'Can a cut in interest rates improve both AD and AS?',
    'Yes, if the cheaper borrowing is spent well.',
    [
      'The cut raises AD through consumption and investment.',
      'If firms use the borrowing to fund research and development, they raise productive capacity and technology, shifting LRAS right too.',
    ],
    'This needs the borrowing to be used for productive investment. If it goes into consumption or asset speculation, AD rises and AS does not, so the result is inflationary.',
  ),

  h('When transmission fails: the liquidity trap'),
  p(
    'Changes in Bank Rate take time to filter through, because commercial banks do not pass them on immediately. After the 2008 financial crisis, interest rates were at record lows yet spending and investment stayed weak, for three reasons:',
  ),
  ul([
    'CONFIDENCE was very low. High interest rates were not what was putting people off spending, so further cuts could not solve the problem.',
    'Banks did not pass cuts on, because they wanted to hold on to deposits to improve their own liquidity and were not keen to lend.',
    'Banks were unwilling to lend to EACH OTHER, again to protect their liquidity, and inter-bank lending is essential for financial markets to function.',
  ]),
  defn(
    'Liquidity trap',
    'A situation where interest rates can fall no further and monetary policy can no longer influence aggregate demand.',
  ),
  p('In such circumstances a central bank may need unconventional policy, such as quantitative easing.'),

  h('Bonds and yields, the background to QE'),
  defn('Bond', 'A loan made by an investor to a borrower, with the borrower paying interest (the coupon) and repaying the amount at a set date.'),
  ul([
    'GOVERNMENT bonds fund things like roads and schools; CORPORATE bonds fund things like research and equipment.',
    'A business cannot always borrow what it needs from one bank. Bond markets let thousands of investors each lend a part, and a bondholder can sell the bond to another investor before it matures.',
    'Buyers are mainly institutions such as banks, pension funds and insurance companies.',
  ]),
  p('Yield (rate of return) = annual coupon payment ÷ market price of the bond × 100.'),
  worked(
    'A 10-year bond is issued at £1,000 with a 10% coupon. Find the yield if the bond is held to maturity, if it is sold for £800 and if it is sold for £1,200.',
    'The coupon is £100 a year whatever the market price. At £1,000 the yield is 100 ÷ 1,000 = 10%. At £800 (a discount) the yield is 100 ÷ 800 = 12.5%. At £1,200 (a premium) it is 100 ÷ 1,200 = 8.33%. Bond PRICES and YIELDS move in OPPOSITE directions: more demand for a bond raises its price and so lowers its yield.',
  ),
  p(
    'Government bonds usually have lower yields than corporate bonds because they are less risky. The UK government has never failed to repay a bond, so demand for gilts is higher, their price is higher and their yield is lower.',
  ),

  h('Quantitative easing, step by step'),
  defn('Quantitative easing (QE)', 'A central bank buys bonds with newly created electronic money, to lower interest rates on savings and loans and expand the money supply.'),
  ol([
    'The central bank creates electronic money (in effect, printing money) and buys bonds, mostly government bonds, from financial institutions.',
    'The institutions now hold more cash, so they have more liquidity to lend.',
    'The central bank\'s demand raises bond prices and lowers their yields, so holding government bonds becomes unattractive.',
    'Investors move into corporate bonds (a little riskier but better yield) and shares. Higher demand lifts corporate bond prices and lowers their yields, so it becomes cheaper for firms to borrow by issuing bonds, which can encourage investment.',
    'Share prices rise, creating a wealth effect that raises consumption, and banks are encouraged to lend more.',
    'AD rises through consumption and investment. If institutions remain too wary to lend, the central bank can buy corporate bonds directly.',
  ]),
  table(
    ['In favour of QE', 'Against QE'],
    [
      ['Low Bank Rate may not bring recovery in a liquidity trap, so QE offers another route', 'Banks may hoard the cash rather than lend it to businesses and households'],
      ['Without QE the UK might have had sustained deflation and a longer recession after the financial crisis', 'It is uncertain how much reaches the small firms most likely to create jobs; in a global banking system, banks can invest in emerging markets where returns are higher'],
      ['Bank of England estimates suggest QE lowered long-term interest rates by around one percentage point, cutting the cost of corporate bonds and mortgages', 'It widens income and wealth inequality: asset owners gain, while low-income workers are priced out of rising housing markets and may risk a new housing bubble'],
      ['It injects confidence into the financial system, which encourages firms to invest', 'Low yields reduce the returns on pension funds and annuities, so pensions may fall in real terms'],
    ],
  ),
  p(
    'A further risk, stressed by monetarist economists, is that a huge expansion of the money supply could cause much higher inflation later. QE can be reversed. QUANTITATIVE TIGHTENING means the central bank shrinks its bond holdings, at first by not reinvesting the proceeds of maturing bonds (the Bank of England started this in 2022, when inflation was high) and later by selling bonds. The risk is that reversing QE too early deepens a recession.',
  ),

  h('More on evaluating monetary policy'),
  p(
    'In the exam, questions can be BROAD ("Evaluate the effectiveness of monetary policy in achieving the government\'s macroeconomic objectives") or NARROW (one tool and one objective, for example "Evaluate the effectiveness of a cut in interest rates on economic growth"). For a broad question you can use QE as well as interest rates; for a narrow one stay with the named tool and objective.',
  ),
  table(
    ['Further strengths', 'Explanation'],
    [
      ['Powerful effect on AD', 'UK households are sensitive to interest rates, not least because so many are home-owners with mortgages'],
      ['Can change frequently', 'The MPC meets about eight times a year, roughly every six weeks, far more often than a discretionary fiscal change can be made'],
      ['Independence', 'Freedom from political interference makes the price stability target credible and builds confidence'],
      ['Can affect AD and AS together', 'If firms use cheaper loans for productive investment, growth can be non-inflationary'],
      ['A multiplier effect', 'Lower rates lift investment and jobs, and the extra income is spent, supporting recovery'],
    ],
  ),
  table(
    ['Further weaknesses', 'Explanation'],
    [
      ['It may harm other objectives', 'With inflation as its sole target the MPC may keep rates high and limit growth (it raised rates in November 2017 despite uncertainty about growth). Expansionary policy risks demand-pull inflation; higher rates attract hot money, appreciating the currency and hurting exports'],
      ['Uneven sensitivity', 'Regions and industries differ. London is more sensitive because of its housing market, and so are construction and related industries'],
      ['It hurts some more than others', 'Rate rises hurt net borrowers and help net savers, and there are many more net borrowers in the UK. QE can widen inequality'],
      ['High costs for some borrowers', 'Credit card and overdraft rates stayed far above Bank Rate even when it was near zero, and payday lenders charged more than 100% a year. Cheap policy rates do not reach everyone'],
    ],
  ),
  table(
    ['Effectiveness depends on', 'Why'],
    [
      ['The size of the change', 'A cut from 10% to 3% is far more powerful than one from 3.5% to 3.25%'],
      ['Confidence and spare capacity', 'In a downturn with plenty of spare capacity, firms will not invest however cheap the loan. At full capacity, extra demand is purely inflationary'],
      ['The quality of investment', 'If it does not improve the quantity or quality of factors of production, capacity does not rise'],
      ['Debt levels and how credit is allocated', 'Rates kept very low for long can encourage excessive government borrowing, crowd out private investment and keep "zombie firms" alive that can only survive on cheap credit'],
      ['Mortgages and the marginal propensity to consume', 'Households whose payments fall may save the money or spend it on imports rather than on domestic output'],
      ['Rates abroad', 'A cut can cause hot money outflows and a depreciation that boosts exports, but not if other countries cut rates too, which is likely in a global downturn'],
      ['Other policies and shocks', 'Expansionary monetary policy can be cancelled by contractionary fiscal policy, such as a rise in corporation tax, or by weak external demand'],
    ],
  ),
  det(
    'Negative interest rates: the Bank of Japan',
    'A policy designed to break out of a long period of low inflation or deflation.',
    [
      'Japan had experienced low inflation or deflation for almost two decades, so households and firms held back spending in the hope that prices would fall.',
      'Negative rates were meant to push banks to lend to businesses instead of holding cash, supporting the economy and ending deflation.',
      'They could also weaken the yen: lower rates encourage hot money outflows, which cuts the exchange rate. That links the interest rate tool to the exchange rate tool.',
    ],
    'Negative rates squeeze bank profit margins, which can reduce lending, and savers may simply hold cash. The evidence that they raised lending and inflation in Japan was limited.',
  ),
)

/* ========================================================= SUPPLY-SIDE POLICY */

const supplySidePolicy = chapter(
  h('What supply-side policy does to the objectives'),
  p(
    'A successful supply-side policy shifts LRAS right: real output rises and the price level falls, which also improves international competitiveness. The effect on UNEMPLOYMENT is less certain. Training and better mobility reduce it, but policies that lead to capital replacing labour, or that bring in more workers than there are jobs, can raise it.',
  ),
  ul([
    'The WAGE REPLACEMENT RATIO is benefits ÷ wage when in work. A ratio of 0.8 means benefits replace 80% of the wage, a weak incentive to take a job. It can be lowered by a higher personal allowance, a lower basic tax rate or lower benefits, which raises the quantity of labour.',
    'Governments may TARGET benefit cuts rather than cut them for everyone, for example by tightening eligibility while protecting people who cannot work for health reasons.',
    'Corporation tax cuts raise retained profit, which can fund capital spending: at 40% a firm with £100m of profit keeps £60m, at 20% it keeps £80m.',
  ]),
  p(
    'Privatisation in the UK covered BT (1984), British Gas (1986), British Airways and Rolls-Royce (1987), the water companies (1989) and Royal Mail (2013), as well as British Steel and parts of British Rail. The outcome has been mixed: the track is still run by a public body, Network Rail, and some train operating franchises have since returned to public ownership. Deregulation can also reduce safety. Cutting the number of adults per baby in nurseries, for example, would lower childcare costs but raise the risk of injury, because a nine-month-old cannot say that it has been hurt.',
  ),

  h('Three case studies'),
  det(
    'Young people not in education, employment or training (NEET)',
    'A NEET is a young person (aged 16 to 24) who is not in education, employment or training.',
    [
      'The UNEMPLOYED are actively seeking work and available to start. The ECONOMICALLY INACTIVE are neither working nor looking, often because of illness, caring responsibilities or discouragement.',
      'Poor health, mental health in particular, is a major factor: official analyses have found that a large share of NEETs have a health condition.',
      'Weak labour market conditions matter too, such as falling vacancies and payroll employment in sectors like hospitality that traditionally employ many young people.',
    ],
    'The two causes need different policies: health support and training address inactivity, while demand-side policy is needed when the problem is a shortage of jobs. This is a case where supply-side policy alone cannot work.',
  ),
  det(
    'Are childcare subsidies enough to bring parents back to work?',
    'They help, but their design limits the effect.',
    [
      '30 free hours a week may cover only about three days a week of nursery if a child at school is in for five.',
      'The hours are often spread over only 38 term-time weeks, so the average over the whole year is far lower than 30.',
      'Eligibility is withdrawn above an income of £100,000, so some parents reduce their hours to stay below it, which reduces the labour supply the policy was meant to raise.',
    ],
    'There also have to be enough nursery places and staff, which is a supply constraint in the childcare market itself.',
  ),
  det(
    'Help to Buy',
    'A scheme to make home ownership affordable for first-time buyers by cutting the deposit they needed.',
    [
      'Lenders were unwilling to lend more than about 75% of a home\'s value, because above that the risk is too high. A 25% deposit on a £200,000 home is £50,000, which is a great deal for a first-time buyer.',
      'Under Help to Buy a first-time buyer put down only 5% (£10,000 on £200,000), with the government providing an equity loan to fill much of the gap.',
      'It made housing more affordable for those buyers.',
    ],
    'It raises demand for homes faster than supply can respond, so part of the benefit can be capitalised into higher house prices, going to sellers and builders rather than buyers. Its value therefore depends on how much extra housing is actually built.',
  ),

  h('More on the drawbacks of supply-side policy'),
  table(
    ['Drawback', 'Explanation'],
    [
      ['Cost', 'HS2 was first estimated at £32.7bn and later estimates exceeded £100bn. A third runway at Heathrow was predicted to cost £49bn'],
      ['Negative externalities', 'Large projects impose costs on people nearby: living next to a nuclear power station or a busy motorway'],
      ['Higher unemployment in places', 'Immigrants may work for less than local workers, and send remittances home, which reduces the size of the multiplier. Investment in capital may substitute for labour'],
    ],
  ),
  table(
    ['Effectiveness depends on', 'Why'],
    [
      [
        'The state of the economy',
        'Raising productive capacity does nothing if the economy is on the Keynesian (horizontal) part of AS. A corporation tax cut will not lead to investment if confidence is low, and the retained profit may go to shareholders. Cutting benefits in a recession may push people to look for work that does not exist',
      ],
      [
        'Quality',
        'Education spending that does not produce the skills the economy needs fails, which is why there is more emphasis on STEM subjects. A points-based immigration system raises the skill level of migrants and so tax revenue. Poor infrastructure, such as a congested motorway or an airport that is always delayed, will not attract FDI',
      ],
      [
        'Policies in other countries',
        'The UK stays attractive to FDI and competitive only if its education, R&D and infrastructure keep pace with those elsewhere',
      ],
      [
        'Whether policies work together',
        'A new runway on its own adds traffic. Childcare subsidies need enough staff. Graduates are wasted if they end up in non-graduate jobs. Cutting benefits needs training for the occupationally immobile and information on vacancies for those unaware of them',
      ],
      [
        'Sustainability',
        'Subsidies can create dependency or be used for the wrong purpose. Infrastructure paid for with excessive borrowing means higher taxes later, and there is a large opportunity cost: is it good value for money?',
      ],
    ],
  ),
  p(
    'As with monetary policy, questions can be BROAD (supply-side policy and the government\'s macroeconomic objectives) or NARROW (a named policy against a named objective, for example cutting direct taxes and boosting training to reduce unemployment). With a narrow question stay with the policy and objective named.',
  ),

  h('The productivity puzzle'),
  p(
    'Productivity (output per hour worked) has trended upwards over time, which is what has allowed living standards to rise. It is normal for it to fall in a downturn, as in 2008 to 2009. What was unusual was that it then went flat after 2010, which had no precedent in the post-war period and became known as the PRODUCTIVITY PUZZLE. Estimates have put productivity about 16% below where the pre-2007 trend would have taken it, with wages and living standards lower as a result. It is a strong reason to take supply-side policy seriously: the gap is the output that capital, skills and technology policy would aim to recover.',
  ),
)

/* ========================================== CONFLICTS AND THE PHILLIPS CURVE */

const conflicts = chapter(
  h('Trade-offs: how to build a 25-mark conflicts answer'),
  defn('Trade-off', 'A situation where a gain in one item must be accompanied by a loss in another.'),
  p(
    'Take "evaluate the possible conflicts between macroeconomic objectives when seeking to control inflation". Start by listing the policies that reduce inflation, then for each one set out the conflict it creates AND why that conflict may not happen.',
  ),
  table(
    ['Policy to cut inflation', 'The conflict it creates', 'Why the conflict may not happen'],
    [
      [
        'Higher interest rates',
        'Dearer borrowing cuts AD, so real GDP falls and unemployment rises. Higher rates may also appreciate the currency, worsening the current account deficit',
        'The fall in AD reduces demand-pull inflation and the appreciation reduces cost-push inflation. A stronger currency also makes it easier to repay debts denominated in dollars',
      ],
      [
        'Supply-side policy',
        'Infrastructure and corporation tax cuts could worsen the government\'s fiscal position. Subsidies may lead to capital replacing labour. Deregulation may reduce safety. Immigrants willing to work for less may displace domestic workers',
        'If the economy grows faster than debt the debt-to-GDP ratio falls. Lower corporation tax can fund R&D, and new technology such as AI creates new jobs. The effect depends on how far deregulation goes, and skilled migrants may fill genuine shortages',
      ],
      [
        'Higher taxes',
        'Higher income tax cuts real disposable income, consumption and AD, lowering prices, but at the cost of output. Some workers may move abroad',
        'It may narrow the fiscal deficit, which is itself an objective',
      ],
      [
        'Lower government spending',
        'Freezing public sector pay makes it harder to recruit good teachers and so lowers the quality of labour',
        'The cut may simply lead to more efficient spending',
      ],
    ],
  ),
  h('Environmental protection against the other objectives'),
  table(
    ['Trade-off', 'Why it may not happen'],
    [
      [
        'POLLUTION may not fall: switching to electric cars still needs large amounts of resources, and much of the electricity still comes from non-renewable sources',
        'Growth gives the government more money to invest in green transport such as electric buses',
      ],
      [
        'INFLATION: packaging changes, recycling costs and charges such as the ultra-low emission zone raise costs for firms',
        'Greener machinery can be more efficient, electricity for electric vehicles is cheap, and firms can earn money by recycling materials',
      ],
      [
        'INEQUALITY: replacing fossil fuels needs huge capital spending that may raise energy costs, which hit low-income households hardest',
        'In the long run renewable energy should be cheaper and not exposed to volatile world oil and gas prices',
      ],
      [
        'UNEMPLOYMENT: workers in polluting industries lose jobs if firms close because of pollution rules',
        'Many jobs have been created in renewable energy, carbon capture research and recycling',
      ],
    ],
  ),
  worked(
    'Explain, with an AD/AS diagram, how spending on HS2 might involve no trade-offs in the long term.',
    'Government spending on the project raises AD at once, and over time the new capacity (faster transport, lower costs, better access to labour and markets) shifts AS right too. Both curves shift: actual growth rises and productive capacity rises, so growth is non-inflationary. The supply effect only appears in the long term, so in the short run there may still be some inflationary pressure and a higher deficit.',
  ),

  h('The Phillips curve: the history and the evidence'),
  p(
    'The curve is named after A. W. (Bill) Phillips, whose 1958 paper analysed UK data on wage inflation and unemployment from 1860 to 1957 and found an inverse relationship. The diagram was soon simplified to show price inflation against unemployment.',
  ),
  ul([
    'The 1960s explanation: as unemployment falls, workers\' bargaining power rises, pushing up wage demands, and so wage and price inflation; the opposite occurs when unemployment is high.',
    'It assumes a close link between wage rises and price rises, because wages are a large share of firms\' costs.',
    'Evidence for the short-run curve: between 1979 and 1983 UK inflation fell sharply while unemployment more than doubled to over 10%. In the 2008 recession unemployment rose sharply and inflation fell, with the RPI turning negative in 2009.',
  ]),
  worked(
    'On the short-run curve, how can expansionary demand-side policy cut unemployment, and why is the gain only temporary?',
    'Expansion raises AD, creating a positive output gap and raising output to Y2. The derived demand for labour rises and nominal wages increase. Workers supply more labour because of MONEY ILLUSION: they see a higher nominal wage and think their purchasing power has risen, when inflation has actually risen more than they expected (they were working with the expectation of the old, lower rate). So in the short run the economy moves along the curve from A to B: unemployment is lower, but inflation is higher.',
  ),
  defn('Stagflation', 'Rising inflation AND rising unemployment at the same time.'),
  defn(
    'Adaptive expectations',
    'People form their expectation of inflation from past and present inflation. If inflation was 1% last year, workers ask for a 1% pay rise this year, believing it will keep their real income constant.',
  ),
  defn(
    'NAIRU',
    'The non-accelerating inflation rate of unemployment: the lowest rate of unemployment that can be sustained without wage growth and inflation rising.',
  ),
  p(
    'In the late 1960s Milton Friedman (and Edmund Phelps) argued the trade-off holds only in the short run. In the long run workers\' expectations adapt: once they see that inflation has risen and their purchasing power has fallen, they demand higher wages to restore it. Costs rise, SRAS shifts inwards, and some workers are laid off. The short-run curve shifts UP to reflect higher expected inflation, and the economy ends at point C: the original unemployment but with higher prices. In the long run the curve is therefore VERTICAL at the NAIRU.',
  ),
  p(
    'On this monetarist view demand-side policy aimed at pushing unemployment below the NAIRU is purely inflationary, and excessive government spending produces only debt and inflation, which is a direct criticism of Keynesian policy. The NAIRU will never be zero, because there will always be some frictional, seasonal and structural unemployment. Monetarists say it can only be lowered by supply-side policies (deregulation, education and training), which shift the long-run curve left and, because rising capacity lowers inflation expectations, also shift the short-run curve down: a lower NAIRU with stable inflation.',
  ),
  ol([
    'Phillips plots 100 years of UK data on wage inflation and unemployment and finds an inverse relationship.',
    'The 1960s explanation: low unemployment strengthens workers\' bargaining power, driving up wages and then prices.',
    'The 1970s bring STAGFLATION, high inflation and high unemployment together, so the simple trade-off appears to break down.',
    'Phelps and Friedman argue the curve still exists but there is a whole series of short-run curves, each tied to a different level of expected inflation.',
    'They argue the economy returns to its natural rate whatever the policy, so the long-run curve is vertical.',
    'Because of the extra inflation the real value of the stimulus falls; if expectations have not changed, those newly employed lose their jobs again and the economy returns to A. The movement along the curve was temporary.',
    'If workers do not suffer money illusion they expect inflation, build it into wage claims, firms lay workers off, and the economy moves from B to C: the natural rate again, with higher expected inflation.',
    'Only supply-side policies in the labour market can lower the natural rate permanently, for example more flexible working patterns, greater mobility and better transferable skills.',
  ]),

  h('How useful is the Phillips curve to policy-makers?'),
  table(
    ['It depends on', 'Why'],
    [
      [
        'The level of inflation',
        'When inflation is low and stable, people are more likely to form expectations from past inflation and to suffer money illusion, so the short-run curve is useful and unemployment can be reduced for a time. When inflation is high and volatile, adaptive expectations adjust quickly because people constantly update them',
      ],
      [
        'The link between wages and prices',
        'The theory needs wages to drive prices. With automation, wages are a smaller share of costs, so a wage change does not necessarily change inflation proportionally',
      ],
      [
        'How rational expectations are',
        'With more news and information, people may have rational expectations: they understand the economy now and need not adapt with a lag. If so there is no trade-off even in the short run, and demand-side policy is not useful',
      ],
      [
        'The central bank\'s credibility',
        'If the Bank of England keeps inflation close to target, expectations stay roughly constant, the long-run curve is less true in practice, and the short-run curve describes more of what we see, so demand-side policy can work',
      ],
    ],
  ),
  det(
    'Why the short-run curve has flattened',
    'Workers have less bargaining power than they once did, so falling unemployment pushes wages up by less.',
    [
      'Union membership fell from about 38% of employees in 1990 to about 23% by 2016, and is lower still in the private sector, while self-employment, part-time and temporary work (the gig economy) have grown.',
      'Globalisation and digitalisation: workers hesitate to ask for pay rises for fear that their jobs will be outsourced or offshored.',
      'Migration from the EU after 2004 may have helped to dampen wage growth.',
    ],
    'A flatter curve means a smaller trade-off between inflation and unemployment, which gives policy-makers more room to use demand-side policy to cut unemployment without causing much inflation. It can steepen again if labour markets tighten, as they did after 2021.',
  ),
)

/* ============================================================ BALANCE OF PAYMENTS */

const balanceOfPayments = chapter(
  h('The third account, and the identity that ties them together'),
  defn(
    'Capital account',
    'The account recording transfers of funds linked to buying fixed assets such as land, often when a migrant moves assets from one country to another. It is small compared with the other two.',
  ),
  p(
    'The three accounts together must balance: current account + financial account + capital account = 0 (ignoring statistical errors and omissions). A current account deficit must therefore be matched by a financial and capital account surplus, which is the same as saying the country is financing its deficit by borrowing from abroad or selling assets abroad.',
  ),
  worked(
    'In 2014 the UK current account balance was −£92.9bn and the capital account balance was −£0.8bn. Trade in goods was −£123.7bn, trade in services was +£89.1bn and secondary income was −£25.2bn. Calculate (a) the financial account balance and (b) primary income.',
    '(a) CA + FA + capital account = 0, so −92.9 + FA − 0.8 = 0 and FA = +£93.7bn. (b) The current account is goods + services + primary income + secondary income. Goods + services + secondary income = −123.7 + 89.1 − 25.2 = −£59.8bn, so primary income = −92.9 − (−59.8) = −£33.1bn. Net investment income was a large deficit: the UK was paying out more in interest, dividends and profits than it received.',
  ),
  det(
    'Is a larger current account deficit linked to faster growth?',
    'Usually yes, in the sense that growth tends to WORSEN the current account.',
    [
      'Higher incomes raise demand for imports, particularly where the marginal propensity to import is high.',
      'A boom therefore tends to coincide with a widening deficit, and a recession with a narrowing one as import demand falls.',
    ],
    'The link runs one way only: faster growth does not require a deficit, and export-led growth improves the current account at the same time.',
  ),
  p(
    'Measures that raise competitiveness can also correct a deficit. Higher INVESTMENT lowers average costs and so raises exports; more ENTERPRISE brings innovation and better quality, and lower INFLATION makes domestic goods relatively cheaper. Demographic change can matter too: as an older, import-hungry generation is replaced by a younger one that spends less on imports, the deficit can narrow without any policy.',
  ),

  h('Can a current account deficit be a good thing?'),
  table(
    ['Positive consequence', 'Explanation'],
    [
      [
        'It brings capacity-raising investment',
        'A current account deficit means a financial account SURPLUS, for example high inward direct investment. Foreign firms bring capital, jobs, technology and new working practices: Japanese car makers raised labour productivity in the UK. Investment in infrastructure, such as Chinese-financed projects in Africa like a coastal railway in Nigeria, can raise incomes and tax revenue, which can be spent on health and education to improve development',
      ],
      ['Automatic correction', 'A large deficit tends to cause the currency to depreciate under a floating rate, which makes exports cheaper and imports dearer and so reduces the deficit'],
      ['It may reflect high incomes', 'Rich consumers buy a greater variety of better goods at lower prices from around the world, and firms gain from cheaper inputs, which is not a cause for concern'],
      ['It may reflect demographics', 'People aged about 40 to 65 save for retirement and tend to run surpluses, while retirees run down savings and spend heavily on imports'],
    ],
  ),
  table(
    ['Whether a deficit is a concern depends on', 'Why'],
    [
      ['Its size relative to GDP', 'A deficit of over about 5% of GDP is more worrying because it relies heavily on foreigners continuing to invest. If that stops there can be a sharp depreciation and cost-push inflation'],
      ['Developed or developing', 'A country like the USA can attract capital flows by selling dollar securities, so has less to fear. A developing economy is more vulnerable because investors are quicker to fear a downturn and withdraw their money'],
      ['The cause', 'A large, persistent deficit may signal weak competitiveness and weak supply-side policy; or it may simply reflect high incomes or demographics'],
      ['How it is financed', 'Borrowing to fund investment that raises productive capacity is healthy; borrowing to fund consumption is not'],
    ],
  ),
)

const balanceOfPaymentsGlobal = chapter(
  h('Two further risks of a deficit in the global economy'),
  det(
    'Capital flight',
    'The financial account that funds a deficit can reverse quickly.',
    [
      'If investors lose confidence in a government\'s ability to repay, money may flow out of the country.',
      'In the Asian crisis of 1997 hot money inflows dried up, causing a rapid devaluation and cost-push inflation.',
      'The financial account is exposed to external shocks, for example restrictions placed on who may buy UK property.',
    ],
    'Countries with deep, trusted markets and their own currency, such as the UK and the USA, are far less exposed than those that borrow in foreign currency.',
  ),
  det(
    'Foreign ownership of assets',
    'Financing a deficit by selling assets transfers future income abroad.',
    [
      'Foreign owners receive the rent, interest and profit, so the primary income balance worsens in the long term.',
      'The country becomes more exposed to the influence of other economies and more prone to external shocks.',
    ],
    'The overseas owners may bring investment and expertise that would not otherwise have been available, which raises the country\'s output as well as the income paid abroad.',
  ),
)

export const ECON_MASTER_T2_NOTES = {
  'Balance of Payments': balanceOfPayments,
  'The Balance of Payments': balanceOfPaymentsGlobal,
  'Conflicts Between Objectives and the Phillips Curve': conflicts,
  'Supply-Side Policy': supplySidePolicy,
  'Monetary Policy': monetaryPolicy,
  'Fiscal Policy': fiscalPolicy,
  'Public Expenditure and Taxation': publicExpenditure,
  'The National Debt': nationalDebt,
  Inflation: inflation,
  'Employment and Unemployment': unemployment,
  'Output Gaps and the Trade Cycle': outputGaps,
  'Aggregate Supply': aggregateSupply,
  'Components of Aggregate Demand': componentsOfAD,
  'Consumption, Savings and Investment': consumptionSavingsInvestment,
  'The Circular Flow of Income and the Multiplier': circularFlow,
  'Economic Growth': economicGrowth,
  'Causes and Effects of Economic Growth': causesEffectsOfGrowth,
  'Macroeconomic Objectives': macroObjectives,
}
