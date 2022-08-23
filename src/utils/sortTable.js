import { ArrowUpDownIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useState, useMemo } from "react";

// sorts the passed array according to direction (ascending or descending) and returns the sorted array

export const useSortableData = (items, config) => {
    const [sortConfig, setSortConfig] = useState(config);
    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key] || a[sortConfig.key] == null) {
                    
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key] || b[sortConfig.key] == null) {
                    
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }

                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    // sets key and direction in sortConfig

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
          //  direction = 'descending';
        key="tokenNumber"
        }
        setSortConfig({ key, direction });
    }

    return { items: sortedItems, requestSort, sortConfig };

}

// return UpArrow or DownArrow depending on selected direction

export const SortIcon = ({ sortConfig, id }) => {

    if (sortConfig && sortConfig.key == id && sortConfig.direction == "ascending")
        return <ChevronDownIcon w={5} h={5} />
    else if (sortConfig && sortConfig.key == id && sortConfig.direction == "descending")
        return <ChevronUpIcon w={5} h={5} />
    else
        return <ArrowUpDownIcon />
}
