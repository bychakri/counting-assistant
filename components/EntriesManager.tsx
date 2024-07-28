import React, { useState } from 'react';
import { View, Button } from 'react-native';
import AudioEntry from './AudioEntry';

interface Entry {
    id: number;
}

const EntriesManager: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);

    const addEntry = () => {
        const newEntry: Entry = {
            id: entries.length + 1,
        };
        setEntries([...entries, newEntry]);
    };

    const deleteEntry = (id: number) => {
        const updatedEntries = entries.filter((entry) => entry.id !== id);
        setEntries(updatedEntries);
    };

    const moveEntryUp = (id: number) => {
        const entryIndex = entries.findIndex((entry) => entry.id === id);
        if (entryIndex > 0) {
            const updatedEntries = [...entries];
            [updatedEntries[entryIndex - 1], updatedEntries[entryIndex]] = [
                updatedEntries[entryIndex],
                updatedEntries[entryIndex - 1],
            ];
            setEntries(updatedEntries);
        }
    };

    const moveEntryDown = (id: number) => {
        const entryIndex = entries.findIndex((entry) => entry.id === id);
        if (entryIndex < entries.length - 1) {
            const updatedEntries = [...entries];
            [updatedEntries[entryIndex], updatedEntries[entryIndex + 1]] = [
                updatedEntries[entryIndex + 1],
                updatedEntries[entryIndex],
            ];
            setEntries(updatedEntries);
        }
    };

    return (
        <View>
            <Button title="Add Entry" onPress={addEntry} />
            {entries.map((entry) => (
                <View key={entry.id}>
                    <AudioEntryWrapper id={entry.id} />
                    <Button title="Move Up" onPress={() => moveEntryUp(entry.id)} />
                    <Button title="Move Down" onPress={() => moveEntryDown(entry.id)} />
                    <Button title="Delete" onPress={() => deleteEntry(entry.id)} />
                </View>
            ))}
        </View>
    );
};

interface AudioEntryWrapperProps {
    id: number;
}

const AudioEntryWrapper: React.FC<AudioEntryWrapperProps> = ({ id }) => {
    // Implement the AudioEntry component here
    return <View><AudioEntry/></View>;
};

export default EntriesManager;
