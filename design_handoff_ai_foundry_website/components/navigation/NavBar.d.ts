/**
 * Top bar: stamped nameplate left, links plus one action right.
 * @startingPoint section="Components" subtitle="Nameplate, links, one action" viewport="700x90"
 */
export interface NavBarProps {
  links?: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
  sticky?: boolean;
}
export declare function NavBar(props: NavBarProps): JSX.Element;