import { describe, test, it, expect } from "vitest";

import { Music } from "../src/conversor.js";

describe("creating class music", () => {
    it("getChords", () => {
        const text = "Sua [Eb/G]gra\u00E7a pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        expect(test.getChords(text)).toBe("Sua gra\u00E7a provou Seu amor ");
    });
    it("getLyrics", () => {
        const text = "Sua [Eb/G]gra\u00E7a pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
        const test = new Music("hello", "C", text);
        expect(test.getLyrics(text)).toEqual([
            "[Eb/G]",
            "[F]",
            "[Eb]",
            "[Bb/D]",
            "[Cm]",
            "[Bb]",
        ]);
    });

});

describe("class music functions testing", () => {
    it("extractSuffix should return chord without suffix and suffix", () => {
        const test = new Music("hello", "C", "");
        const result1 = test.extractSuffix("Am7");
        const result2 = test.extractSuffix("Abm7");
        const result3 = test.extractSuffix("A#m7");
        expect(result1).toEqual({ chordWithoutSuffix: "A", suffix: "m7" });
        expect(result2).toEqual({ chordWithoutSuffix: "Ab", suffix: "m7" });
        expect(result3).toEqual({ chordWithoutSuffix: "A#", suffix: "m7" });
    });

    it("extractSuffix should return empty chord without suffix and empty suffix if no suffix is present", () => {
        const test = new Music("hello", "C", "");
        const result = test.extractSuffix("C");
        expect(result).toEqual({ chordWithoutSuffix: "C", suffix: "" });
    });

    it("extractSuffix should return empty chord without suffix and empty suffix if chord is empty", () => {
        const test = new Music("hello", "C", "");
        const result = test.extractSuffix("");
        expect(result).toEqual({ chordWithoutSuffix: "", suffix: "" });
    });
    it("calculateNewToneIndex should return the correct tone index", () => {
        const test = new Music("hello", "C", "");
        const result1 = test.calculateNewToneIndex(0, 5);
        const result2 = test.calculateNewToneIndex(10, 3);
        const result3 = test.calculateNewToneIndex(7, -9);
        expect(result1).toBe(5);
        expect(result2).toBe(1);
        expect(result3).toBe(10);
    });
    it("findNewTone should return the correct tone", () => {
        const test = new Music("hello", "C", "");
        const result1 = test.findNewTone(5);
        const result2 = test.findNewTone(1);
        const result3 = test.findNewTone(10);
        expect(result1).toBe("F");
        expect(result2).toBe("C#");
        expect(result3).toBe("A#");
    });

    it("changeChord should return the correct chord with the new tone", () => {
        const test = new Music("hello", "C", "");
        const result1 = test.changeChord("Am7", 5);
        const result2 = test.changeChord("Abm7", 3);
        const result3 = test.changeChord("A#m7", -9);
        expect(result1).toBe("Dm7");
        expect(result2).toBe("Bm7");
        expect(result3).toBe("C#m7");
    });
    it("changeChord should return the same chord if the tone is not found", () => {
        const test = new Music("hello", "C", "");
        const result = test.changeChord("Zm7", 5);
        expect(result).toBe("Zm7");
    });
    it("changeChord should return the same chord if the chord is empty", () => {
        const test = new Music("hello", "C", "");
        const result = test.changeChord("", 5);
        expect(result).toBe("");
    });
});