/**
 * Reference-build card with tags and outbound links.
 * @startingPoint section="Components" subtitle="16:10 image, tags, honest blurb" viewport="420x420"
 */
export interface ShowcaseCardProps { name: string; blurb?: string; tags?: string[]; links?: { href: string; label: string }[]; image?: string; }
export declare function ShowcaseCard(props: ShowcaseCardProps): JSX.Element;