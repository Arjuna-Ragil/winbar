import { useContainers } from './hooks/useContainers';
import Header from './components/Header';
import Controls from './components/Controls';
import ContainerList from './components/ContainerList';

const DockerModule = () => {
    const {
        containers,
        error,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filteredAndSorted
    } = useContainers();

    return (
        <div className="p-6 min-w-[320px] text-white font-sans flex flex-col gap-4 min-h-75 resize overflow-hidden" style={{ maxHeight: '80vh', maxWidth: '90vw' }}>
            <Header count={containers.length} />
            <Controls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
            <ContainerList containers={filteredAndSorted} error={error} />
        </div>
    );
};

export default DockerModule;
