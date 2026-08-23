/**
 * Primary action button. Royal fill, hover to navy, press stamps down 1px.
 * @startingPoint section="Components" subtitle="Primary, secondary, inverse, ghost" viewport="420x140"
 */
export interface ButtonProps {
  /** primary = royal fill; secondary = navy outline; inverse = white fill for navy grounds; ghost = text only */
  variant?: 'primary' | 'secondary' | 'inverse' | 'ghost';
  size?: 'md' | 'lg';
  /** Renders an <a> when set */
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;