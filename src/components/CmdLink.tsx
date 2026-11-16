import { useContext, type ReactNode } from 'react';
import { RunContext } from '../features/runContext';

type Props = {
    cmd: string;
    children?: ReactNode;
    className?: string;
};

/** Text that runs a terminal command when clicked, for people who'd rather not type. */
export default function CmdLink({ cmd, children, className = '' }: Props) {
    const run = useContext(RunContext);
    return (
        <button
            type="button"
            className={'termLink ' + className}
            title={cmd}
            onClick={(e) => {
                e.stopPropagation();
                run(cmd);
            }}
        >
            {children ?? cmd}
        </button>
    );
}
