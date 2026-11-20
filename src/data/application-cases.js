/*
  Real-life application cases for Economics, keyed by the notes topic they test.

  Every figure was read from the source named on its case (checked on
  19 November 2026). To add one, copy a case and keep every number traceable to
  a page you link; never write one from memory.

    kind        'latest' (a current event) or 'example' (a real case worth knowing)
    title       the name you would say in an exam
    region      who and where
    when        the period, as a short label
    headline    the one sentence to remember
    facts       the numbers worth learning: { n: '145%', l: 'what it measures' }
    story       what happened, in order: { when, what }
    links       how it connects to the theory: { concept, how }
    diagram     ids from the diagram bank to show, unshifted (optional)
    task        the exam-style command
    analysis    the chain of reasoning, one step per line
    evaluation  why it might not hold, one point per line
    sources     { label, url } the pages the figures came from
*/

export const APPLICATION_CASES = {
  'Protectionism and Trade Restrictions': [
    {
      kind: 'latest',
      title: 'The US-China tariff war',
      region: 'US · China',
      when: 'Jan 2025 to Sep 2026',
      headline: 'Two economies taxed each other\'s goods to over 100%, then spent a year climbing back down.',
      facts: [
        { n: '145%', l: 'peak US tariff on Chinese goods, April 2025' },
        { n: '125%', l: 'China\'s tariff on US goods at the peak' },
        { n: '57% → 47%', l: 'US tariff on Chinese exports after the Busan truce, 30 Oct 2025' },
        { n: '36.5%', l: 'US tariff on Chinese goods still in place, July 2026' },
      ],
      story: [
        { when: 'Jan to Apr 2025', what: 'Trump raises tariffs on Chinese goods, citing the flow of fentanyl. China hits back with its own tariffs and then curbs exports of rare-earth metals. Tariffs head towards 150%.' },
        { when: 'May 2025', what: 'Talks in Geneva pause the escalation: US tariffs fall from 145% to 30% and China\'s from 125% to 10%.' },
        { when: '30 Oct 2025', what: 'Trump and Xi agree a one-year truce at Busan. The US cuts its tariff on Chinese exports from 57% to 47%. China suspends its latest rare-earth export controls for a year and agrees to buy US soybeans.' },
        { when: '20 Feb 2026', what: 'The US Supreme Court rules that emergency powers cannot be used to impose most of the 2025 tariffs. About $165bn of duties may have to be refunded to importers.' },
        { when: '23 Sep 2026', what: 'During Xi\'s state visit the truce is extended by two months and China\'s rare-earth ban is delayed to 10 January. Chinese goods still face 36.5% in the US, and US goods 31% in China.' },
      ],
      links: [
        { concept: 'A tariff is a tax on imports', how: 'It raises the domestic price, cuts imports and gives the government revenue ($214.7bn above the usual level by February 2026).' },
        { concept: 'Who pays', how: 'Yale\'s Budget Lab estimated that 46% to 86% of the tariff reached US consumer prices for core goods, so US households carried much of the cost.' },
        { concept: 'Retaliation', how: 'China answered with its own tariffs and a rare-earth export curb, so both sides lost, which is the main evaluation point against protectionism.' },
        { concept: 'Over-dependence', how: 'China\'s control of rare earths showed how specialisation leaves an economy exposed to one supplier.' },
      ],
      diagram: [222],
      task: 'Explain the effects of the tariffs on US consumers, producers and the government, and evaluate whether tariffs are an effective policy.',
      analysis: [
        'A tariff raises the price of imported goods, so the quantity of imports falls and US consumers buy less.',
        'Consumers lose consumer surplus. US producers gain, because they sell more at the higher price, and the government gains tariff revenue.',
        'There is a deadweight loss: consumption that no longer happens because of the higher price, and higher-cost domestic production replacing cheaper imports.',
        'Because the importer pays the tax, much of it passes on to US households and firms rather than falling only on the Chinese exporter.',
      ],
      evaluation: [
        'Revenue is not secure: a legal ruling can turn collected duties into refunds, as the Supreme Court decision showed.',
        'Retaliation hurt US exporters and farmers, and tariffs on imported components raise costs for the very manufacturers they are meant to protect.',
        'Yale found no definitive effect on total employment, only some weakness in tariff-exposed industries, so the jobs argument is not clearly supported.',
        'Protection can be justified temporarily for strategic reasons, but it removes the competitive pressure that drives efficiency.',
      ],
      sources: [
        { label: 'Al Jazeera, 24 Sep 2026', url: 'https://www.aljazeera.com/economy/2026/9/24/hostile-but-hooked-whats-behind-the-us-china-trade-truce-extension' },
        { label: 'Council on Foreign Relations, 30 Oct 2025', url: 'https://www.cfr.org/articles/united-states-and-china-agree-trade-truce' },
        { label: 'Yale Budget Lab, Apr 2026', url: 'https://budgetlab.yale.edu/research/tracking-economic-effects-tariffs' },
      ],
    },
  ],

  'Aggregate Supply': [
    {
      kind: 'latest',
      title: 'The Gulf conflict and an oil supply shock',
      region: 'US · Iran · Gulf',
      when: 'Feb 2026 to now',
      headline: 'A war closed the world\'s main oil route, and every oil-importing economy took a supply shock.',
      facts: [
        { n: '20%', l: 'of global oil and gas supplies pass through the Strait of Hormuz' },
        { n: '$72 → $106', l: 'Brent crude a barrel, 27 Feb to 16 Mar 2026' },
        { n: '~$100', l: 'Brent the EIA expects for the rest of 2026' },
        { n: '$77', l: 'EIA forecast for Brent in Q4 2027' },
      ],
      story: [
        { when: '28 Feb 2026', what: 'US-Israeli strikes on Iran begin. Iran retaliates against Gulf states and shipping.' },
        { when: 'Early Mar 2026', what: 'Traffic through the Strait of Hormuz collapses. On 2 March QatarEnergy suspends LNG production after a drone attack; Qatar supplies 20% of the world\'s LNG.' },
        { when: '16 Mar 2026', what: 'Brent reaches $106 a barrel, up more than 40% in under three weeks.' },
        { when: 'Oct 2026', what: 'Crude rises for a third month as tanker attacks and constrained shipping keep supply tight.' },
        { when: '10 Nov 2026', what: 'The EIA expects Brent to stay near $100 this year and fall to $77 by the fourth quarter of 2027 as inventories rebuild.' },
      ],
      links: [
        { concept: 'AS shifts left', how: 'Energy is an input to almost every industry, so higher prices raise unit costs across the economy.' },
        { concept: 'Cost-push inflation', how: 'Fuel and gas costs pass into UK prices: CPI is 3.6% with motor fuels the biggest upward push.' },
        { concept: 'Inelastic demand and supply', how: 'In the short run neither falls quickly, so a modest cut in supply caused a large price rise.' },
        { concept: 'Real incomes and AD', how: 'An energy importer spends more abroad, so consumption weakens and AD can shift left too.' },
      ],
      diagram: [185],
      task: 'Use an AD/AS diagram to show how this affects an economy that imports energy, such as the UK.',
      analysis: [
        'Oil and gas are inputs to almost every industry (transport, heating, plastics, fertiliser), so a higher energy price raises unit costs across the economy.',
        'Higher costs shift the aggregate supply (AS) curve to the left: the price level rises and real GDP falls. This is cost-push inflation with weaker output, sometimes called stagflation.',
        'An energy importer also loses real income, because more of household and business spending goes on imported energy. Consumption and investment weaken, so AD may shift left as well, deepening the fall in output.',
        'Productive capacity (the vertical part of the AS curve) is unchanged by a temporary shock. It moves left only if the price stays high enough to make energy-intensive capital uneconomic, and may move right later if firms invest in energy efficiency and other energy sources.',
      ],
      evaluation: [
        'Duration is the key judgement. The EIA expects Brent to fall back in 2027, so a temporary shock would shift AS back; a permanent one would not.',
        'The size of the effect depends on how elastic energy demand and supply are. In the short run demand is inelastic, which is why a modest cut in supply caused a large price rise.',
        'Economies use less oil per unit of GDP than they did in the 1970s, so a given price rise does less damage than the shocks of that decade.',
        'Policy is awkward: stimulating AD to protect output would add to inflation, while tight policy would deepen the fall in output.',
      ],
      sources: [
        { label: 'US Energy Information Administration, Short-Term Energy Outlook, 10 Nov 2026', url: 'https://www.eia.gov/outlooks/steo/' },
        { label: 'Al Jazeera, 16 Mar 2026', url: 'https://www.aljazeera.com/news/2026/3/16/the-tell-tale-signs-how-bad-has-the-iran-war-hit-the-global-economy' },
      ],
    },
  ],

  'Monetary Policy': [
    {
      kind: 'latest',
      title: 'Bank Rate rises to 4% as the energy shock feeds through',
      region: 'UK',
      when: 'Nov 2026',
      headline: 'The Bank of England raised rates into an energy shock because it feared prices would keep chasing prices.',
      facts: [
        { n: '8 to 1', l: 'MPC vote on 4 November 2026' },
        { n: '4%', l: 'new Bank Rate, up 0.25 points' },
        { n: '3.5%', l: 'UK CPI inflation in September' },
        { n: '~5%', l: 'inflation the Bank expects by mid-2027' },
      ],
      story: [
        { when: 'From Mar 2026', what: 'The Middle East conflict pushes global energy prices up; by November it is in its ninth month.' },
        { when: 'Sep 2026', what: 'UK CPI inflation rises to 3.5%. Activity turns out stronger than the Bank expected.' },
        { when: '4 Nov 2026', what: 'The MPC votes 8 to 1 to raise Bank Rate by 0.25 points to 4%. One member wanted a 0.5 point rise.' },
        { when: '5 Nov 2026', what: 'The Bank says inflation will rise to around 5% by mid-2027 before falling as the energy effect fades. It sees little sign yet of knock-on effects on pay and prices but enough pressure in the pipeline to act.' },
      ],
      links: [
        { concept: 'Transmission mechanism', how: 'A higher Bank Rate raises borrowing costs, so consumption and investment fall and AD shifts left.' },
        { concept: 'Cost-push inflation', how: 'Rates cut demand but cannot lower the world price of gas and oil.' },
        { concept: 'Second-round effects', how: 'The Bank acted to stop higher energy prices turning into higher wages and prices.' },
        { concept: 'Time lags', how: 'The full effect takes a year or more, by which time energy prices may have fallen.' },
      ],
      task: 'Explain how a rise in Bank Rate affects the economy and evaluate whether it is the right response.',
      analysis: [
        'A higher Bank Rate raises the interest rates banks charge on loans and mortgages and the return on saving.',
        'Borrowing is more expensive and saving more rewarding, so consumption and investment fall: the cost of financing projects rises and the opportunity cost of spending rises.',
        'Consumption and investment are components of aggregate demand, so AD shifts left. The price level is lower than it would otherwise be, which slows demand-side inflationary pressure and helps keep inflation expectations anchored.',
        'If UK rates rise relative to other countries, hot money inflows can raise the value of the pound, which makes imports cheaper and reduces imported inflation.',
      ],
      evaluation: [
        'This inflation is cost-push, caused by energy prices. Interest rates cut demand but cannot lower the world price of gas or oil, so output and jobs may be sacrificed to bring inflation down.',
        'The Bank argued the rise was warranted by the risk of second-round effects. If they do not appear, the rise may prove unnecessary.',
        'Time lags: the full effect of a rate change takes a year or more, by which time energy prices may have fallen (the EIA expects Brent to ease in 2027) and policy may have overshot.',
        'The effect depends on how households are financed. Those on fixed-rate mortgages feel the rise only when they refinance, and households with large savings gain from higher rates.',
      ],
      sources: [{ label: 'Bank of England, Monetary Policy Report, Nov 2026', url: 'https://www.bankofengland.co.uk/monetary-policy-report/2026/November-2026' }],
    },
  ],

  Inflation: [
    {
      kind: 'latest',
      title: 'UK CPI climbs to 3.6% with motor fuels leading',
      region: 'UK',
      when: 'Jun to Oct 2026',
      headline: 'Core inflation sits at 2.8%; the gap to the 3.6% headline is energy.',
      facts: [
        { n: '3.6%', l: 'CPI inflation, 12 months to October 2026' },
        { n: '2.6%', l: 'CPI in June 2026, the low for the year' },
        { n: '2.8%', l: 'core CPI (excludes energy, food, alcohol, tobacco)' },
        { n: '7.5%', l: 'rise in transport prices on the year (CPIH measure)' },
      ],
      story: [
        { when: 'Jun 2026', what: 'CPI inflation is 2.6%, its lowest this year.' },
        { when: 'Jul and Aug 2026', what: 'It rises to 2.9% and then 3.1% as fuel and energy costs feed through.' },
        { when: 'Sep 2026', what: 'CPI reaches 3.5%.' },
        { when: '18 Nov 2026', what: 'The ONS reports 3.6% for October. Transport, especially motor fuels, makes the largest upward contribution. Services inflation is 3.7%.' },
      ],
      links: [
        { concept: 'Cost-push inflation', how: 'Higher fuel and energy costs shift AS left and push the price level up.' },
        { concept: 'Headline vs core', how: 'Core strips out energy, so the gap shows energy is the main driver.' },
        { concept: 'Second-round effects', how: 'Services inflation at 3.7% hints at wage costs, the route by which a shock becomes persistent.' },
        { concept: 'Weights in the basket', how: 'Almost everyone buys fuel, so a big rise lifts the whole index.' },
      ],
      diagram: [185],
      task: 'Is this demand-pull or cost-push inflation? Use the evidence.',
      analysis: [
        'Headline inflation (3.6%) is well above core inflation (2.8%). Core strips out energy, so the gap shows that energy and fuel are the main reason inflation is above the 2% target.',
        'Higher fuel and energy prices raise firms\' costs, shifting AS left. The price level rises while output is squeezed, which is the signature of cost-push inflation.',
        'Services inflation at 3.7% suggests some domestic pressure as well, probably from wage costs, so demand and cost factors are mixed.',
        'The weights matter: motor fuels are bought by nearly everyone, so a large rise in their price lifts the whole index.',
      ],
      evaluation: [
        'One shock does not make a trend. If energy prices fall as forecast, the cost-push effect fades from the 12-month rate through base effects.',
        'The risk is second-round effects: if workers bargain for higher wages and firms raise prices to cover them, cost-push turns into a wage-price spiral, which is what the Bank of England is watching.',
        'CPI is an average. Households that spend more of their budget on fuel and heating, such as rural and low-income households, face higher personal inflation than the headline.',
      ],
      sources: [{ label: 'Office for National Statistics, Consumer price inflation, Oct 2026', url: 'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/latest' }],
    },
    {
      kind: 'example',
      title: 'The 2022 inflation shock and 14 rate rises',
      region: 'UK',
      when: 'Dec 2021 to Aug 2023',
      headline: 'Energy and food pushed inflation to a 41-year high; the Bank answered with fourteen rate rises in a row.',
      facts: [
        { n: '11.1%', l: 'CPI inflation in October 2022, a 41-year high' },
        { n: '£2,500', l: 'typical annual energy bill from October 2022' },
        { n: '16.4%', l: 'food price inflation in October 2022' },
        { n: '0.1% → 5.25%', l: 'Bank Rate, December 2021 to August 2023' },
      ],
      story: [
        { when: 'Dec 2021', what: 'Bank Rate is 0.1%. The Bank begins raising it.' },
        { when: 'Oct 2022', what: 'The energy price cap lifts the typical bill from £1,971 to £2,500, food prices are 16.4% higher and CPI reaches 11.1%.' },
        { when: '2022 to 2023', what: 'The Bank raises Bank Rate at meeting after meeting to bring demand down.' },
        { when: '3 Aug 2023', what: 'The MPC votes 6 to 3 to raise Bank Rate to 5.25%, the fourteenth consecutive rise and the highest in fifteen years.' },
      ],
      links: [
        { concept: 'Cost-push inflation', how: 'The biggest contribution came from housing and energy costs, then food, which are supply-side costs.' },
        { concept: 'Regressive impact', how: 'Lower-income households were hit hardest: 12.5% for the poorest tenth of households against 9.6% for the richest tenth.' },
        { concept: 'Monetary tightening', how: 'Higher rates cut consumption and investment, shifting AD left to bring inflation back to 2%.' },
        { concept: 'Government intervention', how: 'Without the Energy Price Guarantee one estimate put October inflation at 13.8%.' },
      ],
      diagram: [185],
      task: 'Explain the causes of the 2022 inflation and evaluate the Bank of England\'s response.',
      analysis: [
        'Gas and electricity prices surged, raising firms\' and households\' energy costs. AS shifted left, so the price level rose.',
        'Food prices followed because farming, transport and manufacturing all use energy, adding a second cost-push source.',
        'Inflation rose faster than the Bank expected, so it kept raising Bank Rate to reduce consumption and investment, shifting AD left.',
        'Higher rates also raise mortgage costs, which cuts disposable income and spending for borrowers.',
      ],
      evaluation: [
        'Rates cannot cut global gas prices, so much of the fall in inflation depended on energy prices easing rather than on the Bank.',
        'Raising rates hurt borrowers hardest, while savers gained, so the burden fell unevenly.',
        'The Energy Price Guarantee held measured inflation below what it otherwise would have been, so fiscal and monetary policy were pulling in different directions.',
        'Time lags mean the full effect of fourteen rises came after inflation had already begun to fall.',
      ],
      sources: [
        { label: 'Bank of England, Monetary Policy Summary, Aug 2023', url: 'https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2023/august-2023' },
        { label: 'Professional Adviser, on ONS data, Nov 2022', url: 'https://www.professionaladviser.com/news/4060267/uk-energy-food-prices-push-inflation-41' },
      ],
    },
  ],

  'Government Intervention in Markets': [
    {
      kind: 'latest',
      title: 'Energy price cap rises 4% and VAT is removed from electricity',
      region: 'UK',
      when: 'Aug to Oct 2026',
      headline: 'A cap that follows costs rose because gas did; the government took VAT off electricity to cushion it.',
      facts: [
        { n: '£1,723', l: 'typical annual bill from 1 October 2026 (+4%)' },
        { n: '8%', l: 'rise in gas bills under the new cap' },
        { n: '~£45', l: 'what the VAT cut saves a typical household' },
        { n: '52%', l: 'below the 2022 crisis cap of £2,500' },
      ],
      story: [
        { when: '2022', what: 'The government caps typical bills at £2,500 during the energy crisis.' },
        { when: 'Mar 2026', what: 'The Middle East conflict pushes wholesale gas prices up.' },
        { when: '26 Aug 2026', what: 'Ofgem announces a 4% rise in the price cap from 1 October, to £1,723. Gas bills rise 8%. The government has removed VAT from domestic electricity bills.' },
        { when: '1 Oct 2026', what: 'The new cap starts. About 35% of households (around 11 million) are on fixed tariffs and are not affected.' },
      ],
      links: [
        { concept: 'Maximum price', how: 'The cap limits the unit rate and standing charge on default tariffs; it is reset every three months from costs.' },
        { concept: 'Indirect tax cut', how: 'Removing VAT on electricity shifts supply down by the amount of the tax.' },
        { concept: 'Inelastic demand', how: 'Households need energy, so a price rise barely cuts the quantity demanded and spending rises.' },
        { concept: 'Equity', how: 'Poorer households spend a larger share of income on energy, so the burden is regressive.' },
      ],
      task: 'Explain how the price cap and the VAT cut affect the energy market and evaluate them.',
      analysis: [
        'The cap limits the maximum unit rate and standing charge suppliers can charge on default tariffs, so it is a form of maximum price. It is reset every three months from suppliers\' costs, including an allowance for their earnings, so it sits near the cost-covering price rather than far below it. That is why it does not create a shortage.',
        'The rise comes from wholesale gas. A higher input cost shifts the supply of gas to households to the left, so the price at which suppliers can cover costs goes up.',
        'Removing VAT is a cut in an indirect tax. It shifts the supply curve of electricity down by the amount of the tax, and because the cap is built from costs plus tax, the saving passes straight through to households.',
        'Household demand for energy is price inelastic (a necessity with few short-run substitutes), so a higher price barely reduces the quantity demanded and spending on energy rises. Poorer households spend a larger share of income on energy, so the burden is regressive.',
      ],
      evaluation: [
        'The cap does not limit the total bill: a household that uses more energy still pays more. About 11 million households on fixed tariffs are outside it.',
        'The VAT cut helps every household whatever its income, so it is poorly targeted, and it costs the government revenue that must be raised elsewhere or borrowed.',
        'Cheaper electricity relative to gas nudges households towards electric heating, which supports longer-run decarbonisation. A blanket gas price cap would not.',
        'Scale: Ofgem notes that prices are still 52% below the 2022 peak, when the government capped bills at £2,500, so this is a smaller problem than the 2022 crisis.',
      ],
      sources: [{ label: 'Ofgem press release, 26 Aug 2026', url: 'https://www.ofgem.gov.uk/press-release/energy-price-cap-will-rise-4-october-2026' }],
    },
    {
      kind: 'example',
      title: 'Minimum unit pricing for alcohol in Scotland',
      region: 'Scotland',
      when: 'May 2018 to 2023',
      headline: 'A 50p floor under a unit of alcohol cut alcohol deaths by 13.4%.',
      facts: [
        { n: '50p', l: 'minimum price per unit from 1 May 2018' },
        { n: '13.4%', l: 'fall in deaths wholly caused by alcohol' },
        { n: '~150', l: 'deaths a year estimated to be prevented' },
      ],
      story: [
        { when: '1 May 2018', what: 'Scotland sets a floor of 50p per unit of alcohol, so no seller can charge less, however strong or cheap the drink.' },
        { when: '2018 to 2021', what: 'Researchers compare alcohol deaths in Scotland with similar areas without the policy.' },
        { when: 'Mar 2023', what: 'A study in The Lancet finds deaths wholly attributable to alcohol were 13.4% lower after about two and a half years, around 150 deaths a year.' },
        { when: '2023', what: 'Public Health Scotland\'s final evaluation finds strong evidence of fewer deaths and fewer hospital admissions for chronic causes.' },
      ],
      links: [
        { concept: 'Minimum price (floor)', how: 'A floor above the market price for cheap drinks forces the price up and the quantity demanded down.' },
        { concept: 'Negative externality', how: 'Heavy drinking imposes costs on the health service and others that drinkers do not pay.' },
        { concept: 'PED', how: 'Demand is inelastic for heavy drinkers, so quantity falls less than the price rise would suggest.' },
        { concept: 'Who gains', how: 'The extra price is kept by sellers, not collected as tax, so the government gets no revenue.' },
      ],
      diagram: [52],
      task: 'Explain how minimum unit pricing works and evaluate it as a way to reduce alcohol harm.',
      analysis: [
        'A minimum price above the price some drinks were sold at raises the price of cheap, strong alcohol.',
        'A higher price reduces the quantity demanded along the demand curve, so less alcohol is consumed.',
        'Heavy drinkers buy the cheapest drinks, so the policy targets those causing the largest external costs to health services.',
        'Less drinking cuts deaths and hospital admissions, reducing the external cost to society.',
      ],
      evaluation: [
        'Demand from heavy drinkers is inelastic, so they may keep buying and spend less on other goods instead.',
        'The extra revenue goes to retailers, not the government, unlike a tax that could fund treatment.',
        'It is regressive: poorer drinkers lose more of their income than richer ones.',
        'The authors acknowledged limits, including the effect of the Covid-19 pandemic on hospital capacity and attendance.',
      ],
      sources: [
        { label: 'Public Health Scotland, MUP evaluation', url: 'https://publichealthscotland.scot/publications/evaluating-the-impact-of-minimum-unit-pricing-for-alcohol-in-scotland-a-synthesis-of-the-evidence/' },
        { label: 'Public Health Scotland news, Mar 2023', url: 'https://publichealthscotland.scot/news/2023/march/report-highlights-the-impact-of-minimum-unit-pricing-mup-on-deaths-and-hospital-admissions/' },
      ],
    },
    {
      kind: 'example',
      title: 'Berlin\'s rent cap',
      region: 'Germany',
      when: '2020 to Apr 2021',
      headline: 'Rents fell under the cap, but so did the number of flats on offer.',
      facts: [
        { n: '2014', l: 'flats built before this year were covered by the cap' },
        { n: 'up to 60%', l: 'fall in rental listings (ifo Institute)' },
        { n: '15 Apr 2021', l: 'the Constitutional Court declared the cap void' },
      ],
      story: [
        { when: '2020', what: 'Berlin caps rents on flats built before 2014.' },
        { when: '2020 to 2021', what: 'The number of flats advertised for rent drops sharply, while listings outside the cap\'s scope rise above average.' },
        { when: '15 Apr 2021', what: 'Germany\'s Federal Constitutional Court rules the law null and void because Berlin lacked the authority to regulate rents.' },
        { when: 'After the ruling', what: 'Landlords can reclaim the rents that had been held down.' },
      ],
      links: [
        { concept: 'Maximum price', how: 'A ceiling below the market rent creates excess demand.' },
        { concept: 'Shrinking supply', how: 'Lower rents reduce the incentive to let flats, so supply falls and the shortage widens.' },
        { concept: 'Unintended consequences', how: 'Listings rose outside the cap, showing landlords switching to uncapped flats.' },
        { concept: 'Government failure', how: 'The law was struck down, so the policy was lost altogether.' },
      ],
      diagram: [49],
      task: 'Explain the effects of a rent cap below the market rent and evaluate the policy.',
      analysis: [
        'A cap below the equilibrium rent means tenants demand more flats than landlords supply, creating excess demand.',
        'Landlords earn less on capped flats, so some withdraw them from the market or sell, which reduces supply and widens the shortage.',
        'With excess demand, flats must be rationed by something other than price, such as queues, connections or willingness to accept conditions.',
        'Tenants who find a flat pay less, so they gain, but those who cannot find one lose.',
      ],
      evaluation: [
        'The supply fall was large, and the benefits went only to existing tenants, not to people looking for a flat.',
        'Higher rents on uncapped flats show that the problem moved rather than disappeared.',
        'The ifo evidence comes from a single study, so the exact size of the effect should be treated with some caution.',
        'The underlying cause is a shortage of housing, which a cap does not fix; building more would raise supply.',
      ],
      sources: [
        { label: 'ifo Institute via Leibniz Association', url: 'https://www.leibniz-gemeinschaft.de/en/about-us/whats-new/news/forschungsnachrichten-single/newsdetails/mietendeckel-verknappt-angebot' },
        { label: 'RTE, 15 Apr 2021', url: 'https://www.rte.ie/news/world/2021/0415/1210008-berlin-rent-cap' },
      ],
    },
  ],

  'Employment and Unemployment': [
    {
      kind: 'latest',
      title: 'Unemployment falls to 4.6% while payrolls shrink',
      region: 'UK',
      when: 'Jul to Sep 2026',
      headline: 'The survey says jobs are up; the tax records say payrolls are down.',
      facts: [
        { n: '4.6%', l: 'unemployment rate, down 0.3 points' },
        { n: '75.4%', l: 'employment rate (16 to 64)' },
        { n: '-90,000', l: 'payrolled employees over the year' },
        { n: '20.8%', l: 'economic inactivity rate' },
      ],
      story: [
        { when: 'Jul to Sep 2026', what: 'The Labour Force Survey puts unemployment at 4.6%, down 0.3 percentage points on both the year and the quarter.' },
        { when: 'Same period', what: 'HMRC records show payrolled employees fell by 90,000 (0.3%) over the year.' },
        { when: 'Same period', what: 'Vacancies fall further, with smaller businesses saying higher labour and operating costs affect hiring.' },
        { when: '17 Nov 2026', what: 'The ONS calls the picture mixed; regular wage growth has slowed.' },
      ],
      links: [
        { concept: 'Measuring unemployment', how: 'The survey counts people looking for work; it can fall if people leave the labour force.' },
        { concept: 'Derived demand', how: 'Firms facing higher costs hire fewer workers, so labour demand shifts left.' },
        { concept: 'Wages and inflation', how: 'Slower pay growth reduces cost pressure, which helps the Bank of England.' },
        { concept: 'Lagging indicator', how: 'Unemployment changes after the economy does, so a low figure now is not a guarantee.' },
      ],
      task: 'Explain why different labour market measures can point in different directions, and evaluate what this means for the economy.',
      analysis: [
        'The Labour Force Survey counts people who are without a job, looking for work and available to start. Its unemployment rate can fall because people stop looking (leaving the labour force) or because of the mix of people in the survey, which the ONS says partly explains the latest movement.',
        'Payrolled employees come from HMRC records and count jobs on payrolls, so a fall suggests weaker demand for labour. Labour demand is derived demand: firms facing higher costs, such as wages and energy, hire fewer workers.',
        'Falling vacancies mean fewer new jobs and slower pay growth means less upward pressure on firms\' costs, which also helps the Bank of England bring inflation down.',
      ],
      evaluation: [
        'The Labour Force Survey is a sample and single-quarter changes can be noisy, which is why the ONS flags quality considerations. The admin data and the survey should be read together.',
        'Unemployment lags the economy, so a low figure now does not rule out job losses if higher energy prices cut spending.',
        'Slower pay growth helps inflation but squeezes living standards. Real earnings only grow if pay rises faster than prices, and CPI inflation is 3.6%.',
      ],
      sources: [{ label: 'Office for National Statistics, Labour market overview, Nov 2026', url: 'https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/uklabourmarket/latest' }],
    },
  ],

  'Economic Growth': [
    {
      kind: 'latest',
      title: 'UK GDP grows 0.7% in the third quarter',
      region: 'UK',
      when: 'Q1 to Q3 2026',
      headline: 'Three quarters of growth in a row, led by services, with construction the weak spot.',
      facts: [
        { n: '0.7%', l: 'real GDP growth, Q3 2026' },
        { n: '1.9%', l: 'growth on the same quarter a year earlier' },
        { n: '1.7%', l: 'growth in real GDP per head on the year' },
        { n: '-0.7%', l: 'construction output in Q3' },
      ],
      story: [
        { when: 'Q1 2026', what: 'GDP grows 0.6%.' },
        { when: 'Q2 2026', what: 'GDP grows 0.5%.' },
        { when: 'Q3 2026', what: 'GDP grows 0.7%. Services rise 0.9%, production 0.1% and construction falls 0.7%.' },
        { when: '12 Nov 2026', what: 'The ONS notes first estimates are revised, and revises August growth down from 0.1% to zero in the same release.' },
      ],
      links: [
        { concept: 'Real vs nominal GDP', how: 'Real GDP strips out price changes, so 0.7% is growth in output volume.' },
        { concept: 'GDP per head', how: 'It allows for population, so it is a better guide to average living standards.' },
        { concept: 'Limits of GDP', how: 'It ignores distribution, unpaid work and environmental costs.' },
        { concept: 'Growth and policy', how: 'Strong growth with inflation near 5% by 2027 could force the Bank to tighten.' },
      ],
      diagram: [206],
      task: 'Explain what the growth figures show and evaluate how far they measure improvements in living standards.',
      analysis: [
        'Real GDP is output adjusted for price changes, so the 0.7% rise is growth in the volume of goods and services produced, not just higher prices.',
        'Growth is led by services, which are the largest sector of the UK economy, while construction fell, so the expansion is uneven across sectors.',
        'GDP per head (1.7% on the year) is a better guide to average living standards than total GDP, because it allows for population growth.',
        'Stronger growth means more output, income and tax revenue, and it raises demand for labour, which is consistent with the fall in unemployment.',
      ],
      evaluation: [
        'GDP says nothing about how growth is distributed, so average gains can hide falling incomes for some households, particularly as energy bills rise.',
        'GDP omits unpaid work and the informal economy, and ignores environmental costs, so it overstates or understates welfare.',
        'First estimates are revised, and the ONS revised August growth down in this very release, so one quarter should not be over-interpreted.',
        'Strong demand-side growth with inflation rising towards 5% may force the Bank of England to tighten, which could slow growth later.',
      ],
      sources: [{ label: 'Office for National Statistics, GDP first quarterly estimate, 12 Nov 2026', url: 'https://www.ons.gov.uk/economy/grossdomesticproductgdp/bulletins/gdpfirstquarterlyestimateuk/latest' }],
    },
  ],

  'Conflicts Between Objectives and the Phillips Curve': [
    {
      kind: 'latest',
      title: 'Inflation above target while growth and jobs hold up',
      region: 'UK',
      when: 'Q3 to Nov 2026',
      headline: 'The economy is strong enough to push prices up and the Bank has to lean against it.',
      facts: [
        { n: '3.6%', l: 'CPI inflation, October 2026' },
        { n: '4.6%', l: 'unemployment, Jul to Sep 2026' },
        { n: '0.7%', l: 'GDP growth in Q3 2026' },
        { n: '~5%', l: 'inflation the Bank expects by mid-2027' },
      ],
      story: [
        { when: 'Q3 2026', what: 'GDP grows 0.7% and unemployment falls to 4.6%: activity is stronger than expected.' },
        { when: '4 Nov 2026', what: 'The Bank raises Bank Rate to 4%, saying experience of high inflation over the last five years may make firms and households quicker to raise prices and pay.' },
        { when: '18 Nov 2026', what: 'CPI inflation is reported at 3.6%, against a 2% target.' },
      ],
      links: [
        { concept: 'Trade-off between objectives', how: 'Raising rates helps inflation but slows growth and can lift unemployment.' },
        { concept: 'Short-run Phillips curve', how: 'Lower unemployment goes with higher inflation, so falling unemployment is a warning sign.' },
        { concept: 'Cost-push shift', how: 'An energy shock moves the curve outward: more inflation at every level of unemployment.' },
        { concept: 'Expectations', how: 'If people expect high inflation they build it into pay settlements.' },
      ],
      diagram: [207],
      task: 'Explain the conflicts between macroeconomic objectives that policymakers face here.',
      analysis: [
        'The objectives are stable prices (2% inflation), growth and low unemployment. Raising interest rates cuts aggregate demand, which reduces inflation but also slows growth and can raise unemployment, so one objective is traded for another.',
        'Strong growth and falling unemployment mean there is less spare capacity. On the short-run Phillips curve, lower unemployment is associated with higher wage and price inflation, so the economy is moving along the curve in the wrong direction for the inflation target.',
        'An energy price shock is cost-push: it shifts the short-run Phillips curve outward, giving higher inflation at every level of unemployment, so both can worsen together.',
      ],
      evaluation: [
        'The conflict is mild while growth is resilient. It would sharpen sharply if the weaker-demand scenario in the Bank\'s report came true, because raising rates into a slowdown would cost jobs.',
        'The Phillips curve is unstable. Expectations matter, and if people expect higher inflation they build it into pay settlements, which is why the Bank is worried about second-round effects.',
        'The conflict is not permanent. If energy prices fall, inflation falls without needing a weaker economy.',
      ],
      sources: [
        { label: 'Bank of England, Monetary Policy Report, Nov 2026', url: 'https://www.bankofengland.co.uk/monetary-policy-report/2026/November-2026' },
        { label: 'Office for National Statistics, Consumer price inflation, Oct 2026', url: 'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/latest' },
      ],
    },
  ],

  'Fiscal Policy': [
    {
      kind: 'example',
      title: 'The 2022 mini-budget',
      region: 'UK',
      when: 'Sep to Oct 2022',
      headline: '£45bn of unfunded tax cuts: the bond market said no within days.',
      facts: [
        { n: '£45bn', l: 'unfunded tax cuts, the largest in 50 years' },
        { n: '$1.035', l: 'sterling\'s record low against the dollar, 26 Sep' },
        { n: '3 Oct', l: 'the 45p top-rate tax cut is reversed' },
        { n: '14 Oct', l: 'the Chancellor is sacked' },
      ],
      story: [
        { when: '23 Sep 2022', what: 'The Chancellor announces about £45bn of unfunded tax cuts, the largest package in 50 years.' },
        { when: '26 Sep 2022', what: 'Investors lose confidence. Gilt yields jump and sterling falls to a record low of $1.035.' },
        { when: '28 Sep 2022', what: 'The Bank of England steps in to buy long-dated government bonds "on whatever scale is necessary" to restore orderly markets, as pension funds come close to collapse.' },
        { when: '3 Oct 2022', what: 'The government reverses the abolition of the 45p top rate of income tax.' },
        { when: '14 Oct 2022', what: 'The Chancellor is sacked and corporation tax is set to rise to 25% in 2023.' },
      ],
      links: [
        { concept: 'Expansionary fiscal policy', how: 'Tax cuts raise disposable income and aim to raise AD and growth.' },
        { concept: 'Borrowing and the debt', how: 'Unfunded cuts mean more borrowing, and investors demand a higher yield to lend.' },
        { concept: 'Exchange rate', how: 'Lost confidence cut demand for sterling, so the pound fell.' },
        { concept: 'Supply-side argument', how: 'The Laffer idea is that lower tax rates can raise growth and revenue, but only if the cut is credible.' },
      ],
      diagram: [209],
      task: 'Explain the intended effects of the mini-budget and evaluate why it failed.',
      analysis: [
        'Cutting taxes raises disposable income, so consumption rises and AD shifts right, aiming to raise growth.',
        'Lower tax rates on work and profit were also meant to improve incentives, a supply-side effect that raises productive capacity (the AS curve) over time.',
        'But the cuts were not matched by spending cuts or revenue, so the government had to borrow more by selling gilts.',
        'Investors, doubting the government could repay, sold gilts, so yields rose and the cost of borrowing for the government and mortgage lenders rose.',
      ],
      evaluation: [
        'Credibility is the crux: tax cuts without a plan to fund them are punished by lenders, whatever the theory says about growth.',
        'The Bank had to intervene on financial stability grounds, showing how fiscal and monetary policy can collide.',
        'Supply-side gains take years, while the market reaction took days, so the timing was the opposite of what was needed.',
        'The 45p cut mainly helped high earners, so it was poorly targeted for the aim of stimulating demand.',
      ],
      sources: [
        { label: 'Bank of England, gilt market operation, 28 Sep 2022', url: 'https://www.bankofengland.co.uk/news/2022/september/bank-of-england-announces-gilt-market-operation' },
        { label: 'Interactive Investor, Sep 2022', url: 'https://ii.co.uk/analysis-commentary/bank-england-intervenes-end-bond-market-panic-ii525453' },
        { label: 'Civil Service World', url: 'https://civilserviceworld.com/professions/article/bank-of-england-chief-kwarteng-mini-budget-fallout-unprecedented' },
      ],
    },
    {
      kind: 'example',
      title: 'The furlough scheme',
      region: 'UK',
      when: '2020 to Sep 2021',
      headline: 'The state paid wages to keep jobs alive at a cost of £69.3bn.',
      facts: [
        { n: '£69.3bn', l: 'final gross cost of the scheme (OBR)' },
        { n: '30 Sep 2021', l: 'the scheme closed' },
      ],
      story: [
        { when: '2020', what: 'The Coronavirus Job Retention Scheme lets employers keep workers on the payroll while the economy is shut down, with the government paying part of their wages.' },
        { when: '2020 to 2021', what: 'It is extended several times as lockdowns continue.' },
        { when: '30 Sep 2021', what: 'The scheme closes.' },
        { when: '2023', what: 'The Treasury and HMRC publish the final evaluation of what the scheme cost and achieved.' },
      ],
      links: [
        { concept: 'Discretionary fiscal policy', how: 'Government spending replaces lost private income to stop AD collapsing.' },
        { concept: 'Employment and unemployment', how: 'Keeping workers attached to firms avoids the cost of rehiring and long spells out of work.' },
        { concept: 'National debt', how: 'The cost was paid by extra borrowing, adding to the debt.' },
      ],
      task: 'Explain how the furlough scheme worked as fiscal policy and evaluate it.',
      analysis: [
        'Lockdown cut revenue, so firms faced laying off workers, which would have cut household incomes and spending further.',
        'By paying part of wages, the government supported incomes and consumption, limiting the fall in AD.',
        'Workers stayed matched to their jobs, so firms could restart quickly and unemployment rose by far less than output fell.',
        'The money came from borrowing, so the government deficit and the national debt rose.',
      ],
      evaluation: [
        'At £69.3bn, the opportunity cost was large and some payments went to firms that did not need support.',
        'It protected existing jobs but did little to move workers from shrinking to growing sectors.',
        'Whether it was good value depends on the unemployment it prevented, which is hard to measure.',
      ],
      sources: [
        { label: 'Office for Budget Responsibility', url: 'https://obr.uk/box/what-happened-to-furloughed-employees-after-the-cjrs-closed' },
        { label: 'HM Treasury and HMRC, CJRS final evaluation, Jul 2023', url: 'https://www.gov.uk/government/publications/the-coronavirus-job-retention-scheme-final-evaluation/the-coronavirus-job-retention-scheme-final-evaluation' },
      ],
    },
  ],

  Externalities: [
    {
      kind: 'example',
      title: 'The UK soft drinks levy',
      region: 'UK',
      when: 'Apr 2018 to 2026',
      headline: 'A tax designed to raise little because firms cut the sugar instead of paying it.',
      facts: [
        { n: '46%', l: 'average fall in sugar added to soft drinks (2024 review)' },
        { n: '£153.8m', l: 'raised in the first seven months, against £240m forecast for a year' },
        { n: '£2.2bn+', l: 'raised since 2018 (British Heart Foundation, 2026)' },
        { n: '3.5%', l: 'sugar cut by the earlier voluntary scheme' },
      ],
      story: [
        { when: 'Apr 2018', what: 'The Soft Drinks Industry Levy starts, charged on the sugar content of drinks, at a higher rate for the sugariest.' },
        { when: 'Nov 2018', what: 'HMRC figures show £153.8m raised in seven months, short of the £240m forecast for the first year, because firms were reformulating.' },
        { when: '2024', what: 'A government review finds sugar added to soft drinks fell by an average of 46%.' },
        { when: '2026', what: 'The British Heart Foundation says the levy has raised over £2.2bn since 2018.' },
      ],
      links: [
        { concept: 'Indirect tax on a negative externality', how: 'The tax raises firms\' costs, so the market moves towards the socially optimal output.' },
        { concept: 'Firm behaviour', how: 'Firms reformulated to avoid the tax, so less sugar was consumed without consumers paying more.' },
        { concept: 'Voluntary vs tax', how: 'The voluntary scheme cut sugar by 3.5% against 46% for the levy.' },
      ],
      diagram: [68],
      task: 'Explain how the soft drinks levy aims to correct an externality and evaluate its success.',
      analysis: [
        'Sugary drinks create external costs because obesity and tooth decay burden health services, so the market over-consumes.',
        'The levy raises producers\' costs, so supply shifts left and the price rises, reducing quantity towards the social optimum.',
        'Firms could avoid the tax by cutting sugar, so the tax works partly through changing the product rather than the price.',
        'Revenue paid for programmes that tackle childhood obesity.',
      ],
      evaluation: [
        'The levy was set on producers, not consumers, so its effect depends on how firms respond.',
        'The tax worked so well that revenue fell below forecast, a sign that a successful tax can reduce its own revenue.',
        'Health benefits are long-term and hard to measure, and sugar can still be taken in other foods.',
        'Some of the figures come from advocacy groups, so the government review is the more reliable source.',
      ],
      sources: [
        { label: 'FoodNavigator, Nov 2018', url: 'https://www.foodnavigator.com/Article/2018/11/23/UK-sugar-tax-154m-raised-since-introduction/' },
        { label: 'British Heart Foundation, Mar 2026', url: 'https://www.bhf.org.uk/what-we-do/news-from-the-bhf/news-archive/2026/march/learning-from-soft-drinks-industry-levy-sugar-tax' },
        { label: 'Action on Sugar', url: 'https://www.actiononsugar.org/reformulation-/soft-drinks-industry-levy' },
      ],
    },
  ],

  'Rational Decision Making': [
    {
      kind: 'example',
      title: 'The 5p carrier bag charge',
      region: 'England',
      when: 'Oct 2015 to 2021',
      headline: 'A charge of 5p cut plastic bag use by over 95%.',
      facts: [
        { n: '7.6bn', l: 'bags issued by main retailers in 2014' },
        { n: '226m', l: 'bags sold by main retailers in 2019 to 2020 (549m the year before)' },
        { n: '95%+', l: 'fall in use since the charge' },
        { n: '10p', l: 'charge from 2021, extended to all businesses' },
      ],
      story: [
        { when: '2014', what: 'The main retailers issue 7.6 billion single-use carrier bags in England.' },
        { when: '5 Oct 2015', what: 'Large retailers must charge at least 5p for every single-use plastic bag.' },
        { when: '2019 to 2020', what: 'Main retailers sell 226 million bags, compared with 549 million the year before. Defra reports a fall of over 95% since the charge.' },
        { when: '2021', what: 'The charge rises to 10p and applies to all businesses.' },
      ],
      links: [
        { concept: 'Price and rational choice', how: 'A small price turned a free, thoughtless purchase into a decision, so most people switched to reusable bags.' },
        { concept: 'Negative externality', how: 'Plastic waste harms the environment, a cost that shoppers did not pay.' },
        { concept: 'Elastic demand', how: 'Bags have close substitutes (reusable bags), so quantity demanded falls a lot when the price rises.' },
      ],
      task: 'Explain why a small charge changed behaviour so much and evaluate the policy.',
      analysis: [
        'Bags were free, so shoppers took them without weighing the cost.',
        'A charge of 5p made the cost visible and gave a simple alternative: carry your own bag.',
        'Demand for single-use bags is price elastic because of the substitutes, so the quantity demanded fell by a large percentage.',
        'Fewer bags means less plastic waste, so the external cost falls.',
      ],
      evaluation: [
        'The figures are for the main supermarkets, so use in other retailers and of other bag types may differ.',
        'Reusable bags use more material to make, so the net environmental effect depends on how often they are reused.',
        'The charge is small relative to income, so its effect is more about changing habits than price alone.',
      ],
      sources: [
        { label: 'Defra, Jul 2020', url: 'https://deframedia.blog.gov.uk/2020/07/31/war-on-plastic-bags-reaps-positive-results-with-95-reduction-since-2014/' },
        { label: 'GOV.UK, carrier bag charge data', url: 'https://gov.uk/government/publications/carrier-bag-charge-summary-of-data-in-england/single-use-plastic-carrier-bags-charge-data-in-england-for-2019-to-2020' },
      ],
    },
  ],

  'Exchange Rates': [
    {
      kind: 'example',
      title: 'The pound after the Brexit vote',
      region: 'UK',
      when: 'Jun 2016 to Jan 2017',
      headline: 'The pound fell over 10% in hours and kept falling.',
      facts: [
        { n: '10%+', l: 'fall against the dollar within hours of the vote' },
        { n: '$1.46 → $1.21', l: 'pound, day before the referendum to January 2017' },
        { n: '1985', l: 'the pound hit its lowest since this year' },
      ],
      story: [
        { when: '23 Jun 2016', what: 'The UK votes to leave the European Union.' },
        { when: '24 Jun 2016', what: 'Sterling falls by more than 10% against the dollar within hours to about $1.33, its lowest since 1985.' },
        { when: 'Early Jul 2016', what: 'It reaches $1.3112, the lowest since September 1985.' },
        { when: 'Jan 2017', what: 'Sterling hits $1.21, down from $1.46 the day before the referendum.' },
      ],
      links: [
        { concept: 'Exchange rate depreciation', how: 'Demand for pounds fell and supply rose as investors expected weaker growth, so the pound\'s price fell.' },
        { concept: 'Imported inflation', how: 'A weaker pound makes imported goods dearer in pounds.' },
        { concept: 'Competitiveness', how: 'UK exports become cheaper abroad, which should help exporters and the trade balance.' },
      ],
      diagram: [199],
      task: 'Explain why the pound fell and evaluate the effects of a depreciation on the UK economy.',
      analysis: [
        'The vote raised uncertainty about UK trade and growth, so investors sold pounds, raising the supply of pounds and cutting demand for them.',
        'The equilibrium price of the pound in dollars fell.',
        'Imports cost more in pounds, so import prices and inflation rise, squeezing household real incomes.',
        'UK exports become cheaper in foreign currency, so export volumes may rise and the current account may improve.',
      ],
      evaluation: [
        'The effect on the trade balance depends on elasticity of demand for exports and imports, and takes time.',
        'Higher import costs hit firms that rely on imported inputs, offsetting some export gains.',
        'Governor Carney said the fall should help ease the balance of payments shortfall, but the gains were slow to appear.',
      ],
      sources: [
        { label: 'MaltaToday, 24 Jun 2016', url: 'https://www.maltatoday.com.mt/business/business_news/66840/sterling_in_free_fall_with_10_decline_within_hours_of_brexit_vote' },
        { label: 'Al Jazeera, 9 Jan 2017', url: 'https://www.aljazeera.com/amp/news/2017/1/9/pound-hits-new-low-after-theresa-mays-brexit-remarks' },
      ],
    },
  ],

  Oligopoly: [
    {
      kind: 'example',
      title: 'OPEC+ cuts oil output to hold up prices',
      region: 'Global',
      when: 'Oct to Nov 2022',
      headline: 'A cartel agreed to supply less oil, then the cut turned out smaller than the headline.',
      facts: [
        { n: '2m bpd', l: 'cut announced on 5 October 2022' },
        { n: '~2%', l: 'of global oil demand' },
        { n: '~880,000', l: 'barrels a day of real cuts, on one estimate' },
        { n: '$84', l: 'Brent low just before, after a summer above $100' },
      ],
      story: [
        { when: 'Summer 2022', what: 'Brent spends most of the summer over $100 a barrel.' },
        { when: 'Early Sep 2022', what: 'Prices start to slide on recession fears, reaching a low of $84.' },
        { when: '5 Oct 2022', what: 'OPEC+ agrees at its first in-person meeting since the pandemic to cut output by 2 million barrels a day from November.' },
        { when: 'After the meeting', what: 'Analysts say the real cut is nearer 880,000 barrels a day, because members were already producing below target. The White House calls the move short-sighted.' },
      ],
      links: [
        { concept: 'Cartel', how: 'Producers collude on output quotas to restrict supply and raise price.' },
        { concept: 'Interdependence', how: 'Each member\'s output affects the price all of them get, so they negotiate rather than compete.' },
        { concept: 'Incentive to cheat', how: 'Members produced below target already, and any member can gain by producing more.' },
      ],
      diagram: [21],
      task: 'Explain why a cartel restricts output and evaluate how stable it is.',
      analysis: [
        'Oil demand is price inelastic in the short run, so cutting supply raises price by more than it cuts quantity, increasing total revenue.',
        'A cut in output shifts supply left, raising the price.',
        'Members share the cut by quotas, so each member earns a higher price on a smaller output.',
        'Each member also has an incentive to cheat and produce above quota while others restrict.',
      ],
      evaluation: [
        'The headline cut overstated the real cut, since members were already producing below target.',
        'High prices encourage other producers outside the cartel to supply more, weakening it over time.',
        'Governments in consuming countries criticised the cut, showing the political cost of using market power.',
      ],
      sources: [
        { label: 'Business Insider India / Reuters, Oct 2022', url: 'https://www.businessinsider.in/international/news/opec-to-cut-oil-output-by-2-million-bpd-from-november/amp_articleshow/94671295.cms' },
        { label: 'BNN Bloomberg, 5 Oct 2022', url: 'https://www.bnnbloomberg.ca/opec-agrees-on-2-million-barrel-a-day-cut-to-output-limit-1.1828375' },
      ],
    },
  ],

  Contestability: [
    {
      kind: 'example',
      title: 'Aldi and Lidl challenge the Big Four',
      region: 'UK',
      when: '2025',
      headline: 'Two low-cost entrants now hold about a fifth of UK grocery sales.',
      facts: [
        { n: '19%', l: 'Aldi and Lidl combined share, 12 weeks to 15 June 2025' },
        { n: '11%', l: 'Aldi\'s share for the first time, 12 weeks to 23 March 2025' },
        { n: '+11.2%', l: 'Lidl sales growth, 12 weeks to 15 June 2025' },
        { n: '28.4%', l: 'Tesco\'s share, mid-August 2025' },
      ],
      story: [
        { when: '12 weeks to 23 Mar 2025', what: 'Aldi\'s share reaches 11% for the first time, with sales up 5.6%.' },
        { when: '12 weeks to 15 Jun 2025', what: 'Lidl\'s sales rise 11.2% and Aldi and Lidl together hold 19% of the market.' },
        { when: 'Jul to Aug 2025', what: 'Lidl overtakes Morrisons as the UK\'s fifth-largest food and drink retailer.' },
        { when: 'Aug 2025', what: 'Tesco, with 28.4%, uses aggressive price-matching while Asda\'s share falls below 12% for the first time.' },
      ],
      links: [
        { concept: 'Contestable market', how: 'Entry by low-cost firms forces incumbents to hold prices down.' },
        { concept: 'Oligopoly', how: 'A few large firms dominate, so they watch each other and respond with price-matching.' },
        { concept: 'Non-price competition', how: 'Quality, range and loyalty schemes matter alongside price.' },
      ],
      task: 'Explain how the entry of Aldi and Lidl affects competition in UK grocery retailing.',
      analysis: [
        'Aldi and Lidl have lower costs through a limited range and efficient stores, so they can charge lower prices and still make a profit.',
        'Their growth takes customers from the Big Four, which cuts their market share and revenue.',
        'The Big Four respond with price-matching and promotions to defend share, which lowers prices for consumers.',
        'The threat of further entry limits how much supernormal profit incumbents can keep.',
      ],
      evaluation: [
        'Share figures differ by source and by whether they measure all grocery or only food and drink, so compare like with like.',
        'The market is still dominated by a few firms, so it is not highly competitive; entry has limits such as the cost of building stores.',
        'Price-matching can also help firms avoid competing hard on price, which weakens the benefit to consumers.',
      ],
      sources: [
        { label: 'The Grocer, 2025', url: 'https://www.thegrocer.co.uk/news/aldi-and-lidls-growth-surging-again-as-pressure-mounts-on-household-finances/702878.article' },
        { label: 'International Supermarket News, 2025', url: 'https://internationalsupermarketnews.com/tescos-momentum-grows-while-asdas-market-share-dips-below-12' },
        { label: 'Grocery Gazette, 1 Aug 2025', url: 'https://www.grocerygazette.co.uk/2025/08/01/lidl-surpasses-morrisons-fifth/' },
      ],
    },
  ],

  'Business Growth': [
    {
      kind: 'example',
      title: 'Kraft takes over Cadbury',
      region: 'UK · US',
      when: '2010',
      headline: 'An £11.5bn takeover, a broken promise about a factory, and a rebuke from the regulator.',
      facts: [
        { n: '£11.5bn', l: 'value of the takeover' },
        { n: '750+', l: 'people employed at Somerdale at its peak' },
        { n: '2011', l: 'the Somerdale plant closed' },
      ],
      story: [
        { when: 'Early 2010', what: 'US food group Kraft completes a takeover of Cadbury worth about £11.5bn.' },
        { when: 'During the bid', what: 'Kraft says it will keep the Somerdale factory open.' },
        { when: '9 Feb 2010', what: 'Kraft confirms Somerdale will close, reversing what it said.' },
        { when: 'May 2010', what: 'The Takeover Panel publicly censures Kraft for breaching its code. A Commons committee calls Kraft\'s earlier statement irresponsible and unwise.' },
        { when: '2011', what: 'The Somerdale plant closes.' },
      ],
      links: [
        { concept: 'External growth', how: 'A takeover is the fastest way to grow, buying an existing firm and its brands.' },
        { concept: 'Motives', how: 'Gaining market share and savings, such as closing duplicate sites, are typical reasons.' },
        { concept: 'Stakeholder conflict', how: 'Shareholders gain from the deal, but workers lose their jobs.' },
      ],
      task: 'Explain the reasons for a takeover and evaluate its effects on stakeholders.',
      analysis: [
        'A takeover lets a firm grow immediately by buying an established competitor, rather than waiting for slower internal growth.',
        'The combined firm may gain market power and savings from closing duplicate plants and sharing costs.',
        'Shareholders of the target are paid for their shares, usually at a premium.',
        'Workers at closed sites lose jobs, and communities lose local employment.',
      ],
      evaluation: [
        'Takeovers often fail to deliver the savings promised, and the cost of the bid can be high.',
        'Promises made during a bid may not be kept if conditions change; the Panel punished Kraft for this.',
        'The effect on consumers depends on whether savings are passed on or the firm uses its larger share to raise prices.',
      ],
      sources: [
        { label: 'Food Manufacture, 28 May 2010', url: 'https://foodmanufacture.co.uk/Article/2010/05/28/Takeover-Panel-censures-Kraft-over-Cadbury-bid' },
        { label: 'Food Manufacture, 9 Feb 2010', url: 'https://www.foodmanufacture.co.uk/Article/2010/02/09/Kraft-confirms-closure-of-Cadbury-s-Somerdale-plant' },
      ],
    },
  ],

  'Price Determination and the Price Mechanism': [
    {
      kind: 'example',
      title: 'US egg prices and bird flu',
      region: 'US',
      when: 'Jan to Mar 2025',
      headline: 'Culling over 168 million birds cut supply, and with demand inelastic the price hit a record $6.23.',
      facts: [
        { n: '$6.23', l: 'record price of a dozen eggs, March 2025' },
        { n: '168m+', l: 'birds slaughtered since the outbreak began' },
        { n: '285m', l: 'laying hens on 1 March 2025 (over 315m before)' },
        { n: '$4.95', l: 'the previous record, January 2025' },
      ],
      story: [
        { when: 'From 2022', what: 'Bird flu spreads through US flocks. When a bird is infected the whole flock is slaughtered.' },
        { when: 'Jan 2025', what: 'Egg prices reach a record $4.95 a dozen.' },
        { when: 'Feb 2025', what: 'They rise again to $5.90.' },
        { when: 'Mar 2025', what: 'A new record of $6.23 is set, even though wholesale prices had fallen and no farms had outbreaks that month. A producer is investigated by the Justice Department over price rises.' },
      ],
      links: [
        { concept: 'Supply shock', how: 'Fewer hens shifts supply left, so the price rises.' },
        { concept: 'Inelastic demand', how: 'Eggs are a staple with few substitutes, so people keep buying and the price rises sharply.' },
        { concept: 'Inelastic supply', how: 'A flock cannot be rebuilt quickly, so supply stays low for months.' },
        { concept: 'Price lags', how: 'Retail prices lag wholesale prices, so they stay high after wholesale prices fall.' },
      ],
      diagram: [21],
      task: 'Use supply and demand to explain the rise in egg prices.',
      analysis: [
        'Culling infected flocks reduced the number of laying hens, so supply shifted left.',
        'At the old price there was excess demand, so the price rose until the market cleared at a higher price and a smaller quantity.',
        'Demand for eggs is price inelastic, so the price rise was large relative to the fall in quantity.',
        'Supply is inelastic in the short run because raising new hens takes months, so the higher price persisted.',
      ],
      evaluation: [
        'Retail prices lag wholesale prices, so some of the March rise reflected earlier costs.',
        'The investigation into one producer raises the possibility that market power amplified the price rise.',
        'Prices should fall when flocks recover, so the effect is temporary.',
      ],
      sources: [{ label: 'NBC News / AP, Apr 2025', url: 'https://www.nbcwashington.com/news/national-international/egg-prices-record-high-march-2025-donald-trump-bird-flu/' }],
    },
  ],
}
