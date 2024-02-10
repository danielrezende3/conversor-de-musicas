import { describe, test, it, expect } from "vitest";

import { Music } from "../src/conversor.js";

describe("creating class music", () => {
    test('Music constructor throws error when title is empty', () => {
        expect(() => new Music('', 'C', 'text')).toThrow('Title, tone, and text cannot be empty')
    })

    test('Music constructor throws error when tone is empty', () => {
        expect(() => new Music('title', '', 'text')).toThrow('Title, tone, and text cannot be empty')
    })

    test('Music constructor throws error when text is empty', () => {
        expect(() => new Music('title', 'C', '')).toThrow('Title, tone, and text cannot be empty')
    })
    it("onlyLyrics", () => {
        const text = "Sua [Eb/G]gra\u00E7a pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        expect(test.onlyLyrics).toBe("Sua gra\u00E7a provou Seu amor ");
    });
    it("chordsWithBrackets", () => {
        const text = "Sua [Eb/G]gra\u00E7a pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        expect(test.chordsWithBrackets).toEqual([
            "[Eb/G]",
            "[F]",
            "[Eb]",
            "[Bb/D]",
            "[Cm]",
            "[Bb]",
        ]);
    });
    it("chordsWithoutBrackets", () => {
        const text = "Sua [Eb/G]gra\u00E7a pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        expect(test.chordsWithoutBrackets).toEqual([
            "Eb/G",
            "F",
            "Eb",
            "Bb/D",
            "Cm",
            "Bb",
        ]);
    });
    it("chordPositions", () => {
        const text = "Sua [Eb/G]gra\u00E7a pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        expect(test.chordPositions).toEqual([4, 13, 22, 26, 26, 26]);
    });
});

describe("class music basic functions testing", () => {
    it("extractSuffix should return chord without suffix and suffix", () => {
        const test = new Music("hello", "C", "abc");
        const result1 = test.extractSuffix("Am7");
        const result2 = test.extractSuffix("Abm7");
        const result3 = test.extractSuffix("A#m7");
        expect(result1).toEqual({ chordWithoutSuffix: "A", suffix: "m7" });
        expect(result2).toEqual({ chordWithoutSuffix: "Ab", suffix: "m7" });
        expect(result3).toEqual({ chordWithoutSuffix: "A#", suffix: "m7" });
    });

    it("extractSuffix should return empty chord without suffix and empty suffix if no suffix is present", () => {
        const test = new Music("hello", "C", "abc");
        const result = test.extractSuffix("C");
        expect(result).toEqual({ chordWithoutSuffix: "C", suffix: "" });
    });

    it("extractSuffix should return empty chord without suffix and empty suffix if chord is empty", () => {
        const test = new Music("hello", "C", "abc");
        const result = test.extractSuffix("");
        expect(result).toEqual({ chordWithoutSuffix: "", suffix: "" });
    });
    it("calculateNewToneIndex should return the correct tone index", () => {
        const test = new Music("hello", "C", "abc");
        const result1 = test.calculateNewToneIndex(0, 5);
        const result2 = test.calculateNewToneIndex(10, 3);
        const result3 = test.calculateNewToneIndex(7, -9);
        expect(result1).toBe(5);
        expect(result2).toBe(1);
        expect(result3).toBe(10);
    });
    it("findNewTone should return the correct tone", () => {
        const test = new Music("hello", "C", "abc");
        const result1 = test.findNewTone(5);
        const result2 = test.findNewTone(1);
        const result3 = test.findNewTone(10);
        expect(result1).toBe("F");
        expect(result2).toBe("C#");
        expect(result3).toBe("A#");
    });

    it("changeChord should return the correct chord with the new tone", () => {
        const test = new Music("hello", "C", "abc");
        const result1 = test.changeChord("Am7", 5);
        const result2 = test.changeChord("Abm7", 3);
        const result3 = test.changeChord("A#m7", -9);
        expect(result1).toBe("Dm7");
        expect(result2).toBe("Bm7");
        expect(result3).toBe("C#m7");
    });
    it("changeChord should return the same chord if the tone is not found", () => {
        const test = new Music("hello", "C", "abc");
        const result = test.changeChord("Zm7", 5);
        expect(result).toBe("Zm7");
    });
    it("changeChord should return the same chord if the chord is empty", () => {
        const test = new Music("hello", "C", "abc");
        const result = test.changeChord("", 5);
        expect(result).toBe("");
    });
    it("removeBracketFromChord should remove brackets from chord", () => {
        const test = new Music("hello", "C", "abc");
        const result1 = test.removeBracketFromChord("[Eb/G]");
        const result2 = test.removeBracketFromChord("[F]");
        const result3 = test.removeBracketFromChord("[Bb/D]");
        expect(result1).toBe("Eb/G");
        expect(result2).toBe("F");
        expect(result3).toBe("Bb/D");
    });
    it("findChordPositions should return an array of chord positions in the text", () => {
        const text = "Sua [Eb/G]graça pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        expect(test.chordPositions).toEqual([4, 13, 22, 26, 26, 26]);
    });

    it("findChordPositions should return an empty array if text doesn't contain any chords", () => {
        const text = "abc";
        const test = new Music("hello", "C", text);
        expect(test.chordPositions).toEqual([]);
    });
});

describe("transposeChords function testing", () => {
    it("should transpose chords correctly", () => {
        const text = "Sua [Eb/G]graça pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        test.transposeChords(2);
        expect(test.chordsWithoutBrackets).toEqual([
            "F/A",
            "G",
            "F",
            "C/E",
            "Dm",
            "C",
        ]);
        expect(test.chordsWithBrackets).toEqual([
            "[F/A]",
            "[G]",
            "[F]",
            "[C/E]",
            "[Dm]",
            "[C]",
        ]);
    });

    it("should handle empty chordsWithoutBrackets array", () => {
        const text = "Sua graça provou Seu amor";
        const test = new Music("hello", "C", text);
        test.transposeChords(2);
        expect(test.chordsWithoutBrackets).toEqual([]);
        expect(test.chordsWithBrackets).toEqual([]);
    });

    it("should handle negative transpose value", () => {
        const text = "Sua [Eb/G]graça pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        test.transposeChords(-1);
        expect(test.chordsWithoutBrackets).toEqual([
            "D/F#",
            "E",
            "D",
            "A/C#",
            "Bm",
            "A",
        ]);
        expect(test.chordsWithBrackets).toEqual([
            "[D/F#]",
            "[E]",
            "[D]",
            "[A/C#]",
            "[Bm]",
            "[A]",
        ]);
    });

    it("should handle transpose value of 0", () => {
        const text = "Sua [Eb/G]graça pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        test.transposeChords(0);
        expect(test.chordsWithoutBrackets).toEqual([
            "Eb/G",
            "F",
            "Eb",
            "Bb/D",
            "Cm",
            "Bb",
        ]);
        expect(test.chordsWithBrackets).toEqual([
            "[Eb/G]",
            "[F]",
            "[Eb]",
            "[Bb/D]",
            "[Cm]",
            "[Bb]",
        ]);
    });
});



describe("formatChords function testing", () => {
    it("should format chords and modify text correctly", () => {
        const text1 = "Sua [Eb/G]graça pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test1 = new Music("hello", "C", text1)
        expect(test1.formatChords()).toBe("    Eb/G     F        Eb  Bb/D Cm Bb");

        const text2 = "[Cm]Gr[Eb/F]ande é o Se[Bb]nhor!";
        const test2 = new Music("hello", "C", text2)
        test2.transposeChords(0)
        expect(test2.formatChords()).toBe("Cm Eb/F       Bb");
        expect(test2.onlyLyrics).toBe("Gr-ande é o Senhor!");

        const test3 = new Music("hello", "C", text2)
        test3.transposeChords(1)
        expect(test3.formatChords()).toBe("C#m E/F#       B");
        expect(test3.onlyLyrics).toBe("Gr--ande é o Senhor!");
    });
});