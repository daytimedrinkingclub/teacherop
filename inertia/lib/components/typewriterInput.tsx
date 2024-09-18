import { useEffect, useState } from "react";
import { Input } from "./ui/input";


type TypewriterInputProps = {
    placeholders: string[];
    typingSpeed?: number;
    delay?: number;
    query: string;
    setQuery: (query: string) => void;
};

const TypewriterInput: React.FC<TypewriterInputProps> = ({ placeholders, typingSpeed = 150, delay = 1500, query, setQuery }) => {
    const [currentPlaceholder, setCurrentPlaceholder] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const currentText = placeholders[placeholderIndex];

        if (!isDeleting && charIndex < currentText.length) {
            const typingTimeout = setTimeout(() => {
                setCurrentPlaceholder(currentText.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, typingSpeed);
            return () => clearTimeout(typingTimeout);
        } else if (isDeleting && charIndex > 0) {
            const deletingTimeout = setTimeout(() => {
                setCurrentPlaceholder(currentText.slice(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            }, typingSpeed / 2);
            return () => clearTimeout(deletingTimeout);
        } else if (charIndex === currentText.length && !isDeleting) {
            const delayTimeout = setTimeout(() => setIsDeleting(true), delay);
            return () => clearTimeout(delayTimeout);
        } else if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
    }, [charIndex, isDeleting, placeholders, placeholderIndex, typingSpeed, delay]);

    return (
        <Input
            type="text"
            placeholder={currentPlaceholder}
            className="transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
};

export default TypewriterInput;

