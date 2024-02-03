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
    if (!title || !tone || !text) {
      throw new Error("Title, tone, and text cannot be empty");
    }

    this.title = title;
    this.tone = tone;
    this.chordsWithBrackets = this.getLyrics(text);
    this.chordsWithoutBrackets = this.chordsWithBrackets.map((chord) =>
      this.removeBracketFromChord(chord)
    );
    this.onlyLyrics = this.getChords(text);
    this.chordPositions = this.findChordPositions(text, this.chordsWithBrackets);
    this.OriginalText = text;
  }
  getChords(text) {
    const regex = /\[.*?\]/g;
    return text.replace(regex, "");
  }
  getLyrics(text) {
    const regex = /\[(.*?)\]/g;
    if (text.match(regex) === null) {
      return [];
    } else {
      return text.match(regex);

    }
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
  removeBracketFromChord(chord) {
    return chord.replace(/\[|\]/g, "");
  }
  findChordPositions(OriginalText, chordsWithBrackets) {
    // Initialize an array to store the positions of the chords in the text
    var chordPositions = [];
    var tmp_text = OriginalText;
    // Initialize a variable to keep track of the length of the chords found so far
    var removeAlreadyFound = 0;

    if (OriginalText === null) {
      return chordPositions;
    }

    // Loop over each chord in the chords array
    for (let index = 0; index < chordsWithBrackets.length; index++) {
      // Get the current chord
      let element = chordsWithBrackets[index];

      // Find the position of the current chord in the text
      let position = tmp_text.indexOf(element);
      let spaceSize = element.length;
      let spaces = " ".repeat(spaceSize);
      tmp_text = tmp_text.replace(element, spaces);
      // Subtract the length of the chords found so far from the position and add the result to the chordPositions array
      chordPositions.push(position - removeAlreadyFound);

      // Add the length of the current chord to the total length of the chords found so far
      removeAlreadyFound += element.length;
    }
    return chordPositions;
  }

  formatChords() {
    let formattedChords = "";
    let positionSet = new Set();

    for (let index = 0; index < this.chordPositions.length; index++) {
      const currentPosition = this.chordPositions[index];

      while (formattedChords.length < currentPosition) {
        formattedChords += " ";
      }

      if (positionSet.has(currentPosition)) {
        formattedChords += " ";
      }

      if (
        index > 0 &&
        formattedChords.length === currentPosition &&
        formattedChords[formattedChords.length - 1] !== " "
      ) {
        formattedChords += " ";
        this.text =
          this.text.substring(0, currentPosition) +
          "-" +
          this.text.substring(currentPosition);
        for (let i = index; i < this.chordPositions.length; i++) {
          this.chordPositions[i] += 1;
        }
      }

      if (
        currentPosition > 0 &&
        formattedChords.length > 0 &&
        formattedChords[formattedChords.length - 1] !== " "
      ) {
        formattedChords += " ";
      }

      formattedChords += this.chordsWithoutBrackets[index];
      positionSet.add(currentPosition);
    }

    return formattedChords;
  }
  transposeChords(value){
    this.chordsWithoutBrackets = this.chordsWithoutBrackets.map((chord) => this.changeChord(chord, value));
  }
}

let text = "Sua [Eb/G]graça pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
const test = new Music("hello", "C", text);
const result = test.formatChords();
console.log(result);
console.log(test.onlyLyrics);
// console.log("    Eb/G   F   Eb Bb/D Cm Bb");
// console.log("Sua  -graça provou Seu a-mor -Bb/D-Cm-Bb");