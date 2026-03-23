export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export interface JsonContextType {
    searchQuery: string;
    selectedPath: string;
    setSelectedPath: (path: string) => void;
}
