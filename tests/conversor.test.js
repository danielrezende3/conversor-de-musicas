import { describe, test, it, expect } from "vitest";

import { Music } from "../src/conversor.js";

describe("Music", () => {
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
    it("changeChord should return the modified chord", () => {
        const test = new Music("hello", "C", "");
        expect(test.changeChord("Cmaj7", 2)).toBe("Dmaj7");
        expect(test.changeChord("G7", -1)).toBe("F#7");
        // expect(test.changeChord("Am", 5)).toBe("C#m");
      });
    //   it("changeChord should return the original chord if tone is not found", () => {
    //     const test = new Music("hello", "C", "");
    //     expect(test.changeChord("Dm7", 2)).toBe("Dm7");
    //     expect(test.changeChord("F#m", -1)).toBe("F#m");
    //     expect(test.changeChord("Em7", 5)).toBe("Em7");
    //   });
    //   it("changeChord should return the original chord if new tone is not found", () => {
    //     const test = new Music("hello", "C", "");
    //     expect(test.changeChord("Cmaj7", 12)).toBe("Cmaj7");
    //     expect(test.changeChord("G7", -8)).toBe("G7");
    //     expect(test.changeChord("Am", 10)).toBe("Am");
    //   });
});
