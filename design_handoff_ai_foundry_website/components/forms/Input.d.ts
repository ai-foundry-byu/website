export interface FieldProps { label: string; required?: boolean; hint?: string; children?: React.ReactNode; }
export declare function Field(props: FieldProps): JSX.Element;
export interface InputProps { label?: string; required?: boolean; hint?: string; type?: string; placeholder?: string; }
export declare function Input(props: InputProps): JSX.Element;