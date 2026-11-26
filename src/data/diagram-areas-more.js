/*
  Hover definitions for the shaded areas and marked points of the converted slides, by slide
  number. Same format as diagram-areas.js (fill = the slide's own shaded shape). Each was written
  from the rendered slide and its caption and checked by a second reader; a shape that is not an
  economic area (a frame, a key swatch, a ring) is left out.
*/
export const MORE_AREAS = {
  5: [
    { fill: 8, name: "Point W: unattainable", note: "W lies outside both PPF1 and PPF2, so the economy cannot produce this combination of goods with its resources and technology." },
  ],
  9: [
    { fill: 7, name: "Point A: before the price fall", note: "A is the starting point on D, with a higher price and a lower quantity demanded than at B." },
    { fill: 8, name: "Point B: after the price fall", note: "The fall in price causes an extension in quantity demanded, a movement down D from A to B where more is demanded." },
  ],
  10: [
    { fill: 7, name: "Point A: before the price rise", note: "A is the starting point on D, with a lower price and a higher quantity demanded than at B." },
    { fill: 8, name: "Point B: after the price rise", note: "The rise in price causes a contraction in quantity demanded, a movement up D from A to B where less is demanded." },
  ],
  30: [
    { fill: 9, name: "Unitary point at the midpoint", note: "At the midpoint of a straight-line demand curve PED is -1, so a percentage change in price causes an equal percentage change in quantity demanded." },
  ],
  31: [
    { fill: 13, name: "Midpoint where PED = -1", note: "At this midpoint PED is exactly -1, so demand is unitary here, elastic above this point and inelastic below it." },
  ],
  37: [
    { fill: 6, name: "Consumer surplus", note: "The triangle above price P and below the demand curve up to P1 shows how much more consumers were willing to pay than the price P they actually pay." },
  ],
  39: [
    { fill: 12, name: "Total revenue at equilibrium", note: "Its height is price P and its width is output Q, so the area is total revenue TR = P x Q." },
  ],
  40: [
    { fill: 14, name: "Revenue at P1 and Q1", note: "Its height is P1 and its width is Q1, so the area is the total revenue the firm earns before the price falls." },
    { fill: 15, name: "Revenue at P2 and Q2", note: "Its height is P2 and its width is Q2, so the area is the total revenue the firm earns after the price falls." },
  ],
  43: [
    { fill: 10, name: "Total revenue at output A", note: "Its height is the price on the AR = D curve at A and its width is output A, so the rectangle is TR = P x Q at A." },
    { fill: 11, name: "Total revenue at output B", note: "Its height is the price on the AR = D curve at B and its width is output B, so the rectangle is TR = P x Q at B." },
  ],
  56: [
    { fill: 27, name: "Tax revenue", note: "Its height is the tax per unit (P1 minus P) and its width is the output Q sold, so the rectangle is the government's tax revenue." },
    { fill: 30, name: "Tax revenue", note: "Its height is the tax per unit (P1 minus P) and its width is the output Q sold, so the rectangle is the government's tax revenue." },
  ],
  57: [
    { fill: 25, name: "Tax revenue", note: "Its height is the tax per unit (P1 minus P) and its width is the new output Q1, so the rectangle is the government's tax revenue." },
    { fill: 27, name: "Tax revenue", note: "Its height is the tax per unit, from the price the producer keeps on S up to P, and its width is the new output Q1, so the rectangle is the government's tax revenue." },
  ],
  61: [
    { fill: 18, name: "Deadweight welfare loss", note: "Between Q* and Q the MSC of each extra unit is above its MSB, so each unit costs society more than it is worth and the triangle is the total loss." },
  ],
  62: [
    { fill: 18, name: "Deadweight welfare loss", note: "Between Q and Q* the MSB of each unit is above its MSC, so each unit not produced would have been worth more than it cost and the triangle is the total loss." },
  ],
  63: [
    { fill: 18, name: "Deadweight welfare loss", note: "Between Q* and Q the MSC of each extra unit is above its MSB, so each unit costs society more than it is worth and the triangle is the total loss." },
  ],
  64: [
    { fill: 18, name: "Deadweight welfare loss", note: "Between Q and Q* the MSB of each unit is above its MSC, so each unit not produced would have been worth more than it cost and the triangle is the total loss." },
  ],
  72: [
    { fill: 17, name: "Welfare loss from under-consumption", note: "Between Q and Q* the MSB of each unit is above its MSC, so each unit not consumed would have been worth more than it cost and the triangle is the total loss." },
  ],
  73: [
    { fill: 19, name: "Welfare loss from underproduction", note: "Between Q and Q* the MSB is above the MSC, so each unit not made would have given society more benefit than cost." },
  ],
  74: [
    { fill: 19, name: "Welfare loss from overproduction", note: "Between Q* and Q the MSC is above the MSB, so each extra unit made costs society more than it benefits it." },
  ],
  75: [
    { fill: 19, name: "Welfare loss from overproduction", note: "Between Q* and Q the MSC is above the MSB, so each extra unit made costs society more than it benefits it." },
  ],
  125: [
    { fill: 14, name: "Supernormal profit CPAB", note: "Its height is price P minus average cost C and its width is output Q, so the area is (P - C) x Q, the profit above normal profit." },
  ],
  126: [
    { fill: 12, name: "Supernormal profit", note: "Its height is price P minus AC and its width is output Q, so the area is (P - AC) x Q." },
  ],
  128: [
    { fill: 23, name: "Firm's supernormal profit", note: "Its height is price P minus AC and its width is output Q, so the area is (P - AC) x Q." },
  ],
  130: [
    { fill: 14, name: "Total variable cost", note: "Its height is AVC, which is ATC minus AFC at Q, and its width is output Q, so TVC = AVC x Q." },
  ],
  131: [
    { fill: 13, name: "Short-run supernormal profit", note: "Its height is price P minus AC at output Q and its width is Q, so it is the supernormal profit earned in the short run before new firms enter." },
  ],
  133: [
    { fill: 14, name: "Supernormal profit at output Q", note: "Its height is price P minus the new average cost C and its width is output Q, so it is (P minus C) x Q." },
  ],
  137: [
    { fill: 0, name: "Monopoly supernormal profit", note: "Its height is Pmon minus average cost C and its width is output Q, so it is (Pmon minus C) x Q." },
  ],
  139: [
    { fill: 16, name: "Monopoly loss at output Q", note: "Its height is AC minus AR at output Q and its width is Q, so the loss is (AC minus AR) x Q." },
  ],
  140: [
    { fill: 20, name: "Profit-maximising point", note: "MC cuts MR here, so the monopoly produces Q1 and charges P1." },
    { fill: 21, name: "Allocatively efficient point", note: "MC cuts AR here, so allocative efficiency needs output Q2 at the lower price P2." },
  ],
  143: [
    { fill: 15, name: "Supernormal profit at max revenue", note: "Its height is AR minus AC at the output where MR is zero and its width is that output, so it is (AR minus AC) x Q." },
  ],
  144: [
    { fill: 12, name: "Total cost at max revenue output", note: "Its height is AC at the output where MR is zero and its width is that output, so it is TC = AC x Q." },
  ],
  146: [
    { fill: 24, name: "Supernormal profit at Q1", note: "Its height is P1 minus average cost C1 and its width is output Q1, so it is (P1 minus C1) x Q1." },
  ],
  147: [
    { fill: 18, name: "Minimum point of AC", note: "MC cuts AC at the very bottom of the AC curve, so output Q1 is productively efficient." },
  ],
  149: [
    { fill: 18, name: "Supernormal profit", note: "Its height is price P minus average cost C and its width is output Q, so profit is (P - C) x Q." },
  ],
  151: [
    { fill: 32, name: "Short-run supernormal profit", note: "Its height is price P minus average cost at Q and its width is output Q, so it is the profit that attracts new firms." },
    { fill: 50, name: "Short-run supernormal profit", note: "Its height is price P minus average cost at Q and its width is output Q, so it is the profit that attracts new firms." },
  ],
  152: [
    { fill: 24, name: "New supernormal profit", note: "After demand rises, its height is P1 minus average cost at Q1 and its width is Q1, so profit is bigger." },
    { fill: 25, name: "Original supernormal profit", note: "Before the shift, its height is P minus average cost at Q and its width is Q, so profit is smaller." },
  ],
  153: [
    { fill: 27, name: "New supernormal profit", note: "After costs rise, its height is P1 minus C1 and its width is Q1, so profit is (P1 - C1) x Q1." },
    { fill: 28, name: "Original supernormal profit", note: "Before costs rose, its height was P minus C and its width was Q, so profit was (P - C) x Q." },
  ],
  154: [
    { fill: 18, name: "New supernormal profit", note: "After fixed costs rise, its height is P minus C1 and its width is Q, so profit is (P - C1) x Q." },
    { fill: 19, name: "Original supernormal profit", note: "Before fixed costs rose, its height was P minus C and its width was Q, so profit was (P - C) x Q." },
  ],
  161: [
    { fill: 20, name: "Loss at output Q", note: "At output Q the LRAC is above price P, so this strip of height LRAC minus P and width Q is the loss." },
  ],
  165: [
    { fill: 6, name: "Point W on SRAS", note: "W is the starting point on the SRAS curve, at the lower price level and lower real output." },
    { fill: 7, name: "Point X on SRAS", note: "X is further up the same SRAS curve, so a higher price level goes with higher real national output." },
  ],
  207: [
    { fill: 6, name: "Point A", note: "A is the point on the SRPC with higher unemployment and lower inflation than point B." },
    { fill: 7, name: "Point B", note: "B is the point on the SRPC with lower unemployment and higher inflation than point A." },
  ],
  216: [
    { fill: 7, name: "China at the peak", note: "China is marked at the top of the Kuznets curve, where the Gini coefficient is at its highest before inequality starts to fall." },
    { fill: 8, name: "UK on the downward slope", note: "The UK is marked on the falling part of the curve, where higher GDP per capita goes with lower inequality." },
  ],
  222: [
    { fill: 19, name: "Tariff tax revenue", note: "Its height is the £2 tariff and its width is the imports still bought at £4, so revenue = tariff x imports." },
    { fill: 21, name: "Welfare loss: lost consumption", note: "Consumers buy fewer units because the price rises from £2 to £4, so the consumer surplus on those units is lost and nobody gains it." },
    { fill: 22, name: "Welfare loss: inefficient production", note: "Domestic firms now make extra units that cost more than the £2 world price, so resources are wasted on units that could be imported more cheaply." },
  ],
}
