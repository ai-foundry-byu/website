/**
 * Offering card: hairline border, sharp corners, points as hairline rows.
 * @startingPoint section="Components" subtitle="Hairline card with point rows" viewport="360x300"
 */
export interface CardProps { title: string; blurb?: string; points?: string[]; children?: React.ReactNode; }
export declare function Card(props: CardProps): JSX.Element;