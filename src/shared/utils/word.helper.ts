const LOWERCASE_WORDS = [
  "dari",
  "ke",
  "dan",
  "di",
  "yang",
];

export const smartCapitalize = (text: string): string => {
  if (!text) return "";

  const words = text.trim().split(/\s+/);

  return words
    .map((word, index) => {
      const lowerWord = word.toLowerCase();

      if (word.length >= 2 && word === word.toUpperCase()) {
        return word;
      }

      if (LOWERCASE_WORDS.includes(lowerWord) && index !== 0) {
        return lowerWord;
      }

      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join(" ");
};