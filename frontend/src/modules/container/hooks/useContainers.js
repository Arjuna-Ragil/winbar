import { useEffect, useState, useMemo } from 'react';
import { GetContainers } from '../../../../wailsjs/go/handlers/Docker';

export function useContainers() {
    const [containers, setContainers] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name', 'ram', 'cpu'

    useEffect(() => {
        const fetchContainers = async () => {
            try {
                const data = await GetContainers();
                setContainers(data || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to fetch containers');
            }
        };

        fetchContainers();
        const interval = setInterval(fetchContainers, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredAndSorted = useMemo(() => {
        let result = containers;

        if (searchQuery) {
            result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        result = [...result].sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'ram') return b.ram_usage - a.ram_usage;
            if (sortBy === 'cpu') return b.cpu_usage - a.cpu_usage;
            return 0;
        });

        return result;
    }, [containers, searchQuery, sortBy]);

    return {
        containers,
        error,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filteredAndSorted
    };
}
