export class Music {
  #midiScale = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };

// Chords + lyrics
  constructor(title, tone, text) {
    this.title = title;
    this.tone = tone;
    this.chords = this.getChords(text);
    this.lyrics = this.getLyrics(text);
    this.text = text;
  }
  getChords(text) {
    const regex = /\[.*?\]/g;
    return text.replace(regex, "");
  }
  getLyrics(text) {
    const regex = /\[(.*?)\]/g;
    return text.match(regex);
  }
  // removes "m", "0-9" and "+"
  extractSuffix(chord) {
    const suffix = chord.match(/m|[0-9]|\+/g)?.join("") || "";
    const chordWithoutSuffix = chord.replace(suffix, "");
    return { chordWithoutSuffix, suffix };
  }
  calculateNewToneIndex(toneIndex, value) {
    return (((toneIndex + value) % 12) + 12) % 12;
  }
  findNewTone(newToneIndex) {
    return Object.keys(this.#midiScale).find(
      (key) => this.#midiScale[key] === newToneIndex
    );
  }
  changeChord(chord, value) {
    // Extract the chord without suffix and the suffix from the chord
    const { chordWithoutSuffix, suffix } = this.extractSuffix(chord);
    // Get the tone index from the midiScale
    const toneIndex = this.#midiScale[chordWithoutSuffix];

    // If the tone is not found, return the chord as it is
    if (toneIndex === undefined) {
      console.error(`Tone ${chordWithoutSuffix} not found in midiScale`);
      return chord;
    }

    // Calculate the new tone index
    const newToneIndex = this.calculateNewToneIndex(toneIndex, value);
    // Find the new tone based on the new tone index
    const newTone = this.findNewTone(newToneIndex);

    // If the new tone is not found, return the chord as it is
    if (newTone === undefined) {
      console.error(
        `New tone with index ${newToneIndex} not found in midiScale`
      );
      return chord;
    }

    // Combine the new tone with the suffix to get the new chord
    chord = newTone + suffix;
    return chord;
  }
  
}

