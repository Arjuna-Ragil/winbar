import { Container } from 'lucide-react';
import ContainerItem from './ContainerItem';

export default function ContainerList({ containers, error }) {
    return (
        <>
            {error && <div className="text-red-400 text-sm">{error}</div>}

            <div className="flex-1 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                {containers.length === 0 && !error && (
                    <div className="text-white text-sm text-center mt-4 flex flex-col justify-center items-center gap-2">
                        <Container size={36} strokeWidth={1.25} />
                        <span>No running containers found</span>
                    </div>
                )}
                {containers.map(container => (
                    <ContainerItem key={container.name} container={container} />
                ))}
            </div>
        </>
    );
}
