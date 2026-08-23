export interface DialogAction { label: string; variant?: 'primary' | 'secondary' | 'ghost'; onClick?: () => void; }
export interface DialogProps { open: boolean; onClose?: () => void; title: string; actions?: DialogAction[]; children?: React.ReactNode; }
export declare function Dialog(props: DialogProps): JSX.Element;